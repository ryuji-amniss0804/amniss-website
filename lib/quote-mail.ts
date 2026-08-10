import { dateJa, dateTimeJa, deleteOn, handoffText, type QuoteHandoff } from "./quote";

/**
 * 竜司さんへ送るメールの中身を組み立てる。
 *
 * **副作用を持たせないこと。**送信そのものは /api/quote がやる。
 * ここを純粋なままにしてあるのは、削除予定日や金額の転記が
 * 合っているかを、実際にメールを送らずに確かめられるようにするため。
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
  /** ご連絡先がメールアドレスのときだけ入る */
  replyTo?: string;
};

/** 件名と Reply-To に改行を持ち込ませない */
function oneLine(s: string): string {
  return s.replace(/[\r\n]+/g, " ").trim();
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function buildQuoteMail(p: QuoteMailInput): QuoteMail {
  const isEmail = EMAIL.test(p.contact);

  const lines: string[] = [
    `お名前　　${p.name}`,
    `ご連絡先　${p.contact}`,
    `受信日時　${dateTimeJa(p.now)}`,
    "",
    "■ ご依頼の内容",
    ...p.message.split("\n").map((l) => `　${l}`),
  ];

  // /simulator を通ってきた人は、条件と金額がそのまま入る
  if (p.handoff) lines.push("", handoffText(p.handoff));

  lines.push("", `■ お荷物の写真（${p.photos.length}枚）`);
  if (p.photos.length) {
    lines.push(...p.photos.map((u) => `　${u}`));
    // **この日付は Cron の削除日数（lib/quote.ts）から出している。**
    // 別々に書くと、片方だけ直したときにメールが嘘になる
    lines.push("", `　この写真は ${dateJa(deleteOn(p.now))} に自動で削除されます。`);
  } else {
    lines.push("　（写真の添付はありません）");
  }

  lines.push(
    "",
    "――",
    "このメールは amniss-japan.jp のお見積り依頼フォームから届いています。",
    isEmail
      ? "「返信」を押すと、お客様のメールアドレス宛になります。"
      : "ご連絡先はお電話番号です。折り返しはお電話でお願いします。",
  );

  return {
    subject: `【見積り依頼】${oneLine(p.name)} 様`,
    text: lines.join("\n"),
    ...(isEmail ? { replyTo: oneLine(p.contact) } : {}),
  };
}
