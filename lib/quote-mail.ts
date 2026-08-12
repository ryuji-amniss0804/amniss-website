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
 * 外部画像を出さない設定の人がいる。サムネイルの下にURLを**文字としても**並べ、
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
    { k: "line", text: "このメールは amniss-japan.jp のお見積り依頼フォームから届いています。" },
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
 * サムネイルの見た目。
 *
 * **幅を決め打ちしない**（指示 34 §1）。`max-width` だけを置き、`width` 属性も
 * 固定 px も付けない。こうしておくと、画面が狭いときは画面に合わせて縮み、
 * 横にはみ出さない。上限を 200px にしているのは、320px の画面でも
 * 左右の余白を引いた残り（約 288px）に必ず収まるため。
 */
const THUMB_IMG =
  "display:block;max-width:200px;height:auto;border:1px solid #e0ddd8;border-radius:2px;";

function renderPhotos(urls: string[]): string {
  const thumbs = urls
    .map(
      (u, i) =>
        `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer"` +
        ` style="display:inline-block;margin:0 10px 10px 0;text-decoration:none;">` +
        `<img src="${esc(u)}" alt="写真${i + 1}" style="${THUMB_IMG}"></a>`,
    )
    .join("");

  // **サムネイルが出なかったときに写真へ辿り着く道。**
  // 外部画像を出さない設定でも、この行は文字として読めるし、押せる
  const list = urls
    .map(
      (u, i) =>
        `<div style="margin:0 0 2px 0;word-break:break-all;">　${i + 1}　` +
        `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer"` +
        ` style="color:#1a56a0;">${esc(u)}</a></div>`,
    )
    .join("");

  return (
    `<div style="margin:6px 0 4px 0;">${thumbs}</div>` +
    `<div style="font-size:12px;line-height:1.7;color:#666;">${list}</div>`
  );
}

/**
 * text と同じ文字・同じ順で出す。**変えるのは写真だけ。**
 * 段落は div 1つ＝1行。空行は高さのある div にする
 * （中身が空の div は、メールソフトによっては潰される）。
 */
function renderHtml(blocks: Block[]): string {
  const body = blocks
    .map((b) => {
      if (b.k === "blank") return `<div style="height:14px;line-height:14px;">&nbsp;</div>`;
      if (b.k === "photos") return renderPhotos(b.urls);
      if (b.k === "head") return `<div style="font-weight:700;">${esc(b.text)}</div>`;
      return `<div>${esc(b.text)}</div>`;
    })
    .join("");

  return (
    `<!doctype html><html lang="ja"><head><meta charset="utf-8">` +
    `<meta name="viewport" content="width=device-width,initial-scale=1"></head>` +
    `<body style="margin:0;padding:0;background:#ffffff;">` +
    `<div style="max-width:680px;padding:16px;` +
    `font-family:-apple-system,BlinkMacSystemFont,'Hiragino Kaku Gothic ProN','Yu Gothic',Meiryo,sans-serif;` +
    `font-size:15px;line-height:1.9;color:#1a1a1a;">${body}</div></body></html>`
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
