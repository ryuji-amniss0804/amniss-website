import { TRAVEL, yen } from "./pc";
import { dateJa, dateTimeJa, deleteOn } from "./quote";

/**
 * パソコン修理のご相談（/pc/contact）で、竜司さんへ送るメールの中身を組み立てる。
 *
 * **副作用を持たせないこと。**送信そのものは /api/pc/inquiry がやる。
 * ここを純粋なままにしてあるのは、削除予定日や出張費の転記が合っているかを、
 * 実際にメールを送らずに確かめられるようにするため（`lib/quote-mail.ts` と同じ考え方）。
 *
 * ⚠ **`lib/quote-mail.ts` を書き換えて共用しないこと。**あちらは引越しの見積り依頼、
 *   いま動いている受け口の本文を作っている。項目が違うだけのために共有部分を触ると、
 *   引越しの問い合わせを巻き添えにする危険が出る。写真の保管日数と日本時間の整形
 *   （`lib/quote.ts`）だけを借りて、本文の並びはこちらで持つ。
 *
 * 【text と html を、1つの並びから作る】
 * 本文は Block の配列を1本だけ作り、それを text と html の2つに流す。
 * **片方だけを直せる形にしないため。**別々に組み立てると、HTMLを出すメールソフトと
 * 出さないメールソフトで、竜司さんが見る内容がずれる（しかも誰も気づかない）。
 *
 * 【日付は必ず日本時間】
 * Vercel の関数は UTC で動く。素の Date を整形すると9時間ずれた削除予定日が載る。
 * `lib/quote.ts` の `dateJa` / `dateTimeJa` がそれを吸収している。
 *
 * 【出張費の金額をここに書かないこと】
 * 市町村から `lib/pc.ts` の `TRAVEL` を引いて出す。書き写すと、出張費を変えたときに
 * メールだけ古い金額のまま残る。
 */

/**
 * 機種のタイプ。画面（`PcContactForm.tsx`）の選択肢と、受け口
 * （`app/api/pc/inquiry/route.ts`）の検証が**同じ一覧を見る。**
 * 2か所に書くと、選択肢を足したときに片方だけ古くなって黙って捨てられる。
 */
export const MACHINES = [
  "ノートパソコン",
  "デスクトップ",
  "自作PC",
  "タブレット",
  "わからない",
] as const;

export type PcInquiryInput = {
  name: string;
  tel: string;
  /** 任意。入っていれば reply_to になる */
  email: string;
  /** `TRAVEL` にある市町村名。出張費はここから引く */
  city: string;
  /** 任意。ノートパソコン／デスクトップ／… */
  machine: string;
  symptom: string;
  /** 任意。「例）今週の土日の午前中」 */
  preferred: string;
  /** Blob のURL。検証済みのものだけを渡すこと */
  photos: string[];
  /** 受信日時。写真の削除予定日もここから出す */
  now: Date;
};

export type PcInquiryMail = {
  subject: string;
  text: string;
  /** text と同じ内容。HTMLを出さないメールソフトには text が読まれる */
  html: string;
  /** メールアドレスをいただいたときだけ入る */
  replyTo?: string;
};

/** 件名と Reply-To に改行を持ち込ませない */
function oneLine(s: string): string {
  return s.replace(/[\r\n]+/g, " ").trim();
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 件名に入れる症状の頭。長い相談でも件名が一覧で読める長さに切る */
const SUBJECT_SYMPTOM = 20;

/** 未記入の任意項目。**行ごと消さない。**「聞いたが空だった」と分かるようにする */
const BLANK = "（ご記入なし）";

/**
 * 市町村から出張費の1行を作る。
 * **0円は「0円」と書かず「無料」と出す。**画面（/pc/contact）と同じ言い方にそろえる。
 */
export function travelLine(city: string): string {
  const t = TRAVEL.find((row) => (row.cities as readonly string[]).includes(city));
  if (!t) return city;
  return t.fee === 0 ? `${city}（出張費 無料）` : `${city}（出張費 ${yen(t.fee)}円）`;
}

/** ラベルの幅をそろえる。全角空白は HTML でも詰められないので、text と html で同じに出る */
const LABEL_W = 7;

function label(s: string): string {
  return s + "　".repeat(Math.max(1, LABEL_W - s.length + 1));
}

/**
 * 本文の1かたまり。
 * **写真だけが text と html で違う形になる。**ほかは同じ文字をそのまま流す。
 */
type Block =
  | { k: "line"; text: string }
  | { k: "head"; text: string }
  | { k: "blank" }
  | { k: "photos"; urls: string[] };

function blocksOf(p: PcInquiryInput, isEmail: boolean): Block[] {
  const b: Block[] = [
    { k: "line", text: `${label("お名前")}${p.name}` },
    { k: "line", text: `${label("お電話番号")}${p.tel}` },
    { k: "line", text: `${label("メールアドレス")}${p.email || BLANK}` },
    { k: "line", text: `${label("お住まい")}${travelLine(p.city)}` },
    { k: "line", text: `${label("機種のタイプ")}${p.machine || BLANK}` },
    { k: "line", text: `${label("ご希望の日時")}${p.preferred || BLANK}` },
    { k: "line", text: `${label("受信日時")}${dateTimeJa(p.now)}` },
    { k: "blank" },
    { k: "head", text: "■ 症状" },
    ...p.symptom.split("\n").map((l): Block => ({ k: "line", text: `　${l}` })),
    { k: "blank" },
    { k: "head", text: `■ 写真（${p.photos.length}枚）` },
  ];

  if (p.photos.length) {
    b.push({ k: "photos", urls: p.photos });
    // **この日付は Cron の削除日数（lib/quote.ts の PHOTO_RETENTION_DAYS）から出している。**
    // 別々に書くと、片方だけ直したときにメールが嘘になる
    b.push(
      { k: "blank" },
      { k: "line", text: `　この写真は ${dateJa(deleteOn(p.now))} に自動で削除されます。` },
    );
  } else {
    // 0枚のときは photos を積まない。**空の枠も壊れた画像も出さない**
    b.push({ k: "line", text: "　（写真の添付はありません）" });
  }

  b.push(
    { k: "blank" },
    { k: "line", text: "――" },
    {
      k: "line",
      text: "このメールは revive-toyama.jp のパソコン修理の相談フォームから届いています。",
    },
    {
      k: "line",
      text: isEmail
        ? "「返信」を押すと、お客様のメールアドレス宛になります。"
        : "メールアドレスのご記入がありません。折り返しはお電話でお願いします。",
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
 * 200px にしているのは、320px の画面でも左右の余白を引いた残り（約 288px）に必ず収まるため。
 * **`width` 属性にも同じ数字を入れる。**CSS の幅を見ないメールソフトがあるため。
 */
const THUMB_W = 200;

const THUMB_IMG = `display:block;max-width:${THUMB_W}px;height:auto;border:1px solid #e0ddd8;border-radius:2px;`;

/**
 * サムネイルの並び。
 * **ここだけは行（`<tr>`）に分けない。**写真5枚を5つの `<td>` に並べると 1000px の行ができ、
 * 320px の画面で横にはみ出す。`inline-block` なら幅が足りないところで折り返す。
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

const LINK_C = "#4a6285";
const MUTED_C = "#6f6a64";

/**
 * **サムネイルが出なかったときに写真へ辿り着く道。**
 * 外部画像を出さない設定でも、この行は文字として読めるし、押せる。
 * full の URL を並べないのは、削除予定日と末尾の1行が画面の下へ押し出されるため。
 * URL そのものはプレーンテキストの版に残っているので、**二重に届く。**
 */
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
 * 【表（`<table>`）＋インラインの `style` で組む】
 * 竜司さんが依頼を誰かに転送したとき、相手のメールソフトが分からない。
 * 従来の Outlook は Word の仕組みで描き、`<style>` の中の指定を落とす。
 * **だから指定は1つ残らずインラインの `style` に置く。**
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

/**
 * 件名は **`【PC修理】` で始める。**
 * 引越しの見積り依頼（`【見積り依頼】`）と同じ受信箱に届くので、
 * 件名で見分けられないと、パソコンと引越しを分けた意味がなくなる。
 */
export function buildPcInquiryMail(p: PcInquiryInput): PcInquiryMail {
  const isEmail = EMAIL.test(p.email);
  const blocks = blocksOf(p, isEmail);

  const head = oneLine(p.symptom).slice(0, SUBJECT_SYMPTOM);
  const tail = head ? `／${head}${oneLine(p.symptom).length > SUBJECT_SYMPTOM ? "…" : ""}` : "";

  return {
    subject: `【PC修理】${oneLine(p.name)} 様${tail}`,
    text: renderText(blocks),
    html: renderHtml(blocks),
    ...(isEmail ? { replyTo: oneLine(p.email) } : {}),
  };
}
