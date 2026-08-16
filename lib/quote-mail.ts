import {
  dateJa,
  dateTimeJa,
  deleteOn,
  handoffText,
  type QuoteHandoff,
} from "./quote";

/**
 * 竜司さんへ送るメールの中身を組み立てる。
 *
 * **副作用を持たせないこと。**送信そのものは /api/quote がやる。
 * ここを純粋なままにしてあるのは、削除予定日や金額の転記が
 * 合っているかを、実際にメールを送らずに確かめられるようにするため。
 *
 * 【text と html を、1つの並びから作る】（指示 34 §1）
 * 本文は Block の配列を1本だけ作り、それを text と html の2つに流す。
 * **片方だけを直せる形にしないため。**別々に組み立てると、
 * HTMLを出すメールソフトと出さないメールソフトで、
 * 竜司さんが見る内容がずれる（しかも誰も気づかない）。
 *
 * 【HTMLで変えるのは写真だけ】
 * 写真のURLを、押せるサムネイルにする。それ以外の行は
 * text と同じ文字・同じ順のまま出す（指示 34「本文の構造は変えないでください」）。
 *
 * 【サムネイルが出なくても、写真に辿り着けること】
 * 外部画像を出さない設定の人がいる。サムネイルの下に**押せる番号を1行**置き、
 * img には alt を付ける。**画像が出ない＝写真に辿り着けない、にしない。**
 */

export type QuoteMailInput = {
  name: string;
  contact: string;
  message: string;
  /** Blob のURL。検証済みのものだけを渡すこと */
  photos: string[];
  handoff: QuoteHandoff | null;
  /** 受信日時。写真の削除予定日もここから出す */
  now: Date;
};

export type QuoteMail = {
  subject: string;
  text: string;
  /** text と同じ内容。HTMLを出さないメールソフトには text が読まれる */
  html: string;
  /** ご連絡先がメールアドレスのときだけ入る */
  replyTo?: string;
};

/** 件名と Reply-To に改行を持ち込ませない */
function oneLine(s: string): string {
  return s.replace(/[\r\n]+/g, " ").trim();
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 本文の1かたまり。
 * **写真だけが text と html で違う形になる。**ほかは同じ文字をそのまま流す。
 */
type Block =
  | { k: "line"; text: string }
  | { k: "head"; text: string }
  | { k: "blank" }
  | { k: "photos"; urls: string[] };

function blocksOf(p: QuoteMailInput, isEmail: boolean): Block[] {
  const b: Block[] = [
    { k: "line", text: `お名前　　${p.name}` },
    { k: "line", text: `ご連絡先　${p.contact}` },
    { k: "line", text: `受信日時　${dateTimeJa(p.now)}` },
    { k: "blank" },
    { k: "head", text: "■ ご依頼の内容" },
    ...p.message.split("\n").map((l): Block => ({ k: "line", text: `　${l}` })),
  ];

  // /simulator を通ってきた人は、条件と金額がそのまま入る。
  // **handoffText をそのまま使う。**行の作り方をここに書き写すと、
  // 画面（/contact）に出ている内容とずれる余地ができる
  if (p.handoff) {
    const [head, ...rest] = handoffText(p.handoff).split("\n");
    b.push({ k: "blank" }, { k: "head", text: head });
    rest.forEach((t) => b.push({ k: "line", text: t }));
  }

  b.push({ k: "blank" }, { k: "head", text: `■ お荷物の写真（${p.photos.length}枚）` });
  if (p.photos.length) {
    b.push({ k: "photos", urls: p.photos });
    // **この日付は Cron の削除日数（lib/quote.ts）から出している。**
    // 別々に書くと、片方だけ直したときにメールが嘘になる
    b.push({ k: "blank" }, { k: "line", text: `　この写真は ${dateJa(deleteOn(p.now))} に自動で削除されます。` });
  } else {
    // 0枚のときは photos を積まない。**空の枠も壊れた画像も出さない**（指示 34 §1）
    b.push({ k: "line", text: "　（写真の添付はありません）" });
  }

  b.push(
    { k: "blank" },
    { k: "line", text: "――" },
    { k: "line", text: "このメールは revive-toyama.jp のお見積り依頼フォームから届いています。" },
    {
      k: "line",
      text: isEmail
        ? "「返信」を押すと、お客様のメールアドレス宛になります。"
        : "ご連絡先はお電話番号です。折り返しはお電話でお願いします。",
    },
  );

  return b;
}

/* ============ text ============ */

function renderText(blocks: Block[]): string {
  const lines: string[] = [];
  for (const b of blocks) {
    if (b.k === "blank") lines.push("");
    else if (b.k === "photos") lines.push(...b.urls.map((u) => `　${u}`));
    else lines.push(b.text);
  }
  return lines.join("\n");
}

/* ============ html ============ */

/** 本文にはお客様の入力がそのまま入る。**必ずここを通してから埋める** */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * サムネイルの幅。**1か所で決める。**
 *
 * 上限を 200px にしているのは、320px の画面でも左右の余白を引いた残り
 * （約 288px）に必ず収まるため（指示 34 §1）。
 *
 * **`width` 属性にも同じ数字を入れる**（指示 35 §2）。CSS の幅を見ない
 * メールソフトがあるため。指示の例は 240 だったが、200 にしてある。
 * 240 を属性で入れると、CSS を見ないソフトでは `max-width:200px` が効かず、
 * 240px で出る。**320px の画面ではみ出さない、を壊さないため**に数字をそろえた。
 */
const THUMB_W = 200;

const THUMB_IMG =
  `display:block;max-width:${THUMB_W}px;height:auto;border:1px solid #e0ddd8;border-radius:2px;`;

/**
 * サムネイルの並び。
 *
 * **ここだけは行（`<tr>`）に分けない。**写真5枚を5つの `<td>` に並べると
 * 200px × 5 = 1000px の行ができ、320px の画面で横にはみ出す。
 * `inline-block` のまま置けば、幅が足りないところで折り返す。
 * 表で組む狙いは「崩れないこと」なので、はみ出す組み方に替えては本末転倒になる。
 */
function renderThumbs(urls: string[]): string {
  return urls
    .map(
      (u, i) =>
        `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer"` +
        ` style="display:inline-block;margin:0 10px 10px 0;text-decoration:none;">` +
        `<img src="${esc(u)}" alt="写真${i + 1}" width="${THUMB_W}" style="${THUMB_IMG}"></a>`,
    )
    .join("");
}

/**
 * **サムネイルが出なかったときに写真へ辿り着く道。**
 * 外部画像を出さない設定でも、この行は文字として読めるし、押せる。
 *
 * 【full の URL を並べず、番号だけの1行にする】（指示 37）
 * 以前は full の URL を1本ずつ縦に並べていた。写真5枚で**10行**になり
 * （1本が2行に折り返す）、その下の「自動で削除されます」と末尾の1行が
 * 画面のずっと下へ押し出されていた。**削除予定日は竜司さんが見るべき情報**
 * なので、URLのほうに場所を譲らせる。
 *
 * full の URL を消してよいのは、**プレーンテキストの版に同じ URL が
 * そのまま残っている**ため。HTMLを出さないメールソフトの人はそちらを読む。
 * HTMLを出すソフトで画像だけ止まっている人には、この1行と、サムネイルの
 * `alt`（写真1〜5）が押せる形の2つが残る。**二重に届く。**
 *
 * 色は落とすが**下線は残す。**色だけで押せることを伝えると、
 * 目立たない色にした分そのまま気づけなくなる。
 *
 * **落とす色にも下限を置いてある。**12px の小さな文字なので、白地に対して
 * 4.5:1 を切らないところで止めた（実測：番号 6.2:1／「写真」と区切り 5.4:1）。
 * 本文（`#1a1a1a`＝約17:1）と比べれば十分に引いて見える。
 */
const LINK_C = "#4a6285";
const MUTED_C = "#6f6a64";

function renderPhotoLinks(urls: string[]): string {
  const links = urls
    .map(
      (u, i) =>
        `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer"` +
        ` style="color:${LINK_C};text-decoration:underline;">${i + 1}</a>`,
    )
    .join(`<span style="color:${MUTED_C};"> ／ </span>`);
  return `<span style="color:${MUTED_C};">　写真 </span>${links}`;
}

/**
 * text と同じ文字・同じ順で出す。**変えるのは写真だけ。**
 *
 * 【表（`<table>`）＋インラインの `style` で組む】（指示 35 §2）
 * 竜司さんが使っているのは「新しい Outlook」で、これは outlook.com と同じ
 * 描画の仕組みなので、いまは div でも崩れない。**それでも表で組む。**
 * 竜司さんが依頼を誰かに転送したとき、相手のメールソフトが分からないため。
 * 従来の Outlook（デスクトップ版）は Word の仕組みで描き、`<style>` の中の
 * 指定を落とす。**だから指定は1つ残らずインラインの `style` に置く。**
 *
 * 1行＝`<tr>` 1つ。空行は高さのある `<td>` にする
 * （中身が空のセルは、メールソフトによっては潰される）。
 * 文字の指定は**セルごとに**書く。表の入れ子で継承が切れるソフトがあるため。
 */
const CELL =
  "font-family:-apple-system,BlinkMacSystemFont,'Hiragino Kaku Gothic ProN','Yu Gothic',Meiryo,sans-serif;" +
  "font-size:15px;line-height:1.9;color:#1a1a1a;";

function row(style: string, inner: string): string {
  return `<tr><td style="${style}">${inner}</td></tr>`;
}

function renderHtml(blocks: Block[]): string {
  const body = blocks
    .map((b) => {
      if (b.k === "blank") return row("height:14px;line-height:14px;font-size:14px;", "&nbsp;");
      if (b.k === "photos")
        return (
          row(`${CELL}padding:6px 0 4px 0;`, renderThumbs(b.urls)) +
          row(`${CELL}font-size:12px;line-height:1.7;color:${MUTED_C};`, renderPhotoLinks(b.urls))
        );
      if (b.k === "head") return row(`${CELL}font-weight:700;`, esc(b.text));
      return row(CELL, esc(b.text));
    })
    .join("");

  return (
    `<!doctype html><html lang="ja"><head><meta charset="utf-8">` +
    `<meta name="viewport" content="width=device-width,initial-scale=1"></head>` +
    `<body style="margin:0;padding:0;background:#ffffff;">` +
    `<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"` +
    ` style="border-collapse:collapse;background:#ffffff;">` +
    `<tr><td style="padding:16px;">` +
    `<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"` +
    ` style="border-collapse:collapse;max-width:680px;">${body}</table>` +
    `</td></tr></table></body></html>`
  );
}

/* ============ 組み立て ============ */

export function buildQuoteMail(p: QuoteMailInput): QuoteMail {
  const isEmail = EMAIL.test(p.contact);
  const blocks = blocksOf(p, isEmail);

  return {
    subject: `【見積り依頼】${oneLine(p.name)} 様`,
    text: renderText(blocks),
    html: renderHtml(blocks),
    ...(isEmail ? { replyTo: oneLine(p.contact) } : {}),
  };
}
