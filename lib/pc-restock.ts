import { TEL } from "./site";
import { dateTimeJa } from "./quote";

/**
 * 中古パソコンの入荷通知（/pc の「入荷したら知らせてほしい」）で送る、2通のメールの中身。
 *
 * **副作用を持たせないこと。**送信そのものは /api/pc/restock がやる。
 * ここを純粋なままにしてあるのは、件名と本文を、実際にメールを送らずに確かめられるようにするため
 * （`lib/pc-inquiry.ts` と同じ考え方）。
 *
 * 【登録者の保存はしない】DB も一斉配信も作っていない。受け付けるたびに1通が受信箱に届き、
 * 入荷したら本人がその一覧を見て1通ずつ知らせる（94 §5）。
 *
 * ⚠ 自動返信の本文を言い換えないこと。「お知らせ以外には使いません」「停止は返信で」は
 *   プライバシーポリシー（/privacy 2条）と /pc の画面に同じ約束が書いてある。
 */

/**
 * 欲しい種類。画面（`RestockForm.tsx`）の選択肢と、受け口（`app/api/pc/restock/route.ts`）の
 * 検証が**同じ一覧を見る。**2か所に書くと、選択肢を足したときに片方だけ古くなって黙って捨てられる。
 */
export const RESTOCK_KINDS = ["ノート", "デスクトップ", "ゲーミング", "こだわらない"] as const;

/** メールアドレスの形。画面と受け口が同じ式で見る（`lib/pc-inquiry.ts` の式と同じ） */
export const RESTOCK_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 自動返信（登録した人へ届く1通）の返信先。**アドレスはここ1か所だけに書く。**
 *
 * 自動返信には「停止をご希望の場合は、このメールにご返信ください」と書いてある。
 * 差出人（`RESEND_FROM`）が受け取れないアドレスだと、その返信がどこにも届かずに消える。
 * 返信先を人が読む受信箱に固定して、停止の依頼が必ず届くようにしている（94a）。
 */
export const RESTOCK_REPLY_TO = "ogawa@amniss-japan.jp";

export type RestockInput = {
  /** 形式を検め済みのもの */
  email: string;
  /** 任意。`RESTOCK_KINDS` のどれか、または空 */
  kind: string;
  /** 受付日時 */
  now: Date;
};

export type RestockMails = {
  /** 受信箱へ届く1通。「返信」を押すと登録した人宛になる */
  owner: { subject: string; text: string; replyTo: string };
  /** 登録した人へ届く自動返信。**1通だけ**。「返信」を押すと `RESTOCK_REPLY_TO` 宛になる */
  reply: { to: string; subject: string; text: string; replyTo: string };
};

/** 未記入の任意項目。**行ごと消さない。**「聞いたが空だった」と分かるようにする */
const BLANK = "（ご指定なし）";

/** 件名と宛先に改行を持ち込ませない */
function oneLine(s: string): string {
  return s.replace(/[\r\n]+/g, " ").trim();
}

export function buildRestockMails(p: RestockInput): RestockMails {
  const email = oneLine(p.email);

  return {
    owner: {
      subject: "【re'vive_doc】中古PCの入荷通知の希望",
      text: [
        `メールアドレス　${email}`,
        `欲しい種類　　　${p.kind || BLANK}`,
        `受付日時　　　　${dateTimeJa(p.now)}`,
        "",
        "――",
        "このメールは revive-toyama.jp/pc の「入荷したら知らせてほしい」から届いています。",
        "登録した方には、受け付けたことを知らせる自動返信を1通送っています。",
        "一斉配信のしくみはありません。入荷したら、この件名のメールの一覧を見てお知らせしてください。",
      ].join("\n"),
      replyTo: email,
    },
    reply: {
      to: email,
      subject: "入荷のお知らせのご登録を受け付けました（re'vive_doc）",
      text: [
        "入荷したら、このアドレスにお知らせします。",
        "お知らせ以外には使いません。",
        "停止をご希望の場合は、このメールにご返信ください。",
        "",
        "――",
        "re'vive_doc（パソコン修理・富山）",
        `電話 ${TEL}`,
      ].join("\n"),
      replyTo: RESTOCK_REPLY_TO,
    },
  };
}
