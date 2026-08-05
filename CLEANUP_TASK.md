> ⚠ このファイルに出てくる料金は2026/8/4以前の旧料金です。
> 現行の料金は D:\re'vive_toyama_marketing\moving_final.md を参照してください。

# 作業指示｜amniss-hd の整理とブログのリセット

対象リポジトリ：`D:\AmNissJapan_backup\amniss-hd`（Next.js App Router / main / Vercel自動デプロイ）

## 現在の状態

今日すでに2つコミットが入っています。作業前に `git log --oneline -3` で確認してください。

```
a752a72  旧サイトの死んだページを削除し、導線を個人向けに一本化
1ddf3e5  GBP対策: NAP・構造化データ・特商法ページを追加、sitemapを全ページ化
```

`_to_delete/` は `.gitignore` 済みです。中身は git のロックファイルと退避した `.next` なので**そのまま削除して構いません**（このVMからは消せなかったため残しています）。

---

# タスクA｜使っていないコードの処分

## A-1. `app/api/send-summary/route.ts` を削除

**削除理由（実機で確認済み）**

- 呼び出し元ゼロ。`grep -rn "send-summary\|autoPlan\|bookingNumber" app lib content` → 0件
- 旧LPの見積もりシミュレーター用エンドポイント。対応するフォームUIはサイトに存在しない
- 中身が旧料金体系：`2tアルミトラックプラン 35,000円` / `階段 +2,200〜6,600円` / `作業員追加 +11,000円` / `トラック進入不可 +3,300円`
- これらは `app/(corporate)/tokushoho/page.tsx` の「**当日の追加請求は行いません**」「**2階までの階段作業を含みます**」と正面から矛盾する
- 91行目に `console.log("API Key loaded:", process.env.RESEND_API_KEY ? "Yes" : "No")` というデバッグ残骸
- メール件名・送信元に旧屋号 `A.P.C LOGISTICS` が入っている

削除後、`.env` の `RESEND_API_KEY` も使われなくなります。他で使っていなければ外してください。

## A-2. 未使用 import の除去

| ファイル | 削除するもの |
|---|---|
| `app/(corporate)/company/page.tsx` | `import Link from "next/link"` — ファイル内に `<Link` なし |
| `app/(corporate)/privacy/page.tsx` | `import React from "react"` — `React.` の参照なし |

※ブログ静的3ページにも同様の未使用importがありますが、**タスクBでファイルごと削除する**ので対象外です。

## A-3. `app/globals.css` の未使用定義

削除対象（いずれも参照ゼロ）：

- `@keyframes amnFadeIn`
- `.amn-fade`
- `--color-background`
- `--color-foreground`
- `--font-serif`（見出しは全て inline の `fontFamily: "'Noto Serif JP', serif"` で指定している）
- `html { scroll-behavior: auto; }`（`auto` はCSS初期値なので何もしていない）

**残すもの**：`.amn-animate`（company / privacy で使用中）、`.prose` 系（`blog/[slug]` と管理画面プレビューで使用中）

## A-4. `app/(corporate)/page.tsx` の連続空行

39行目あたりに空行が4行続いています。削除済みコードの跡です。

## A-5. `package.json` の name

`"name": "revive-lp"` が旧LP時代のまま。`"amniss-hd"` などに変更してください。

## A-6. `app/(corporate)/privacy/page.tsx` の利用目的

18行目付近の個人情報の利用目的に、いまやっていない事業が残っています。

```
・カスタムPC製造、IT/DXソリューション導入に関するご相談・サポート
```

この1項目を削除してください。

## A-7. lint エラー

`app/(corporate)/page.tsx` で `<a href="/blog">` を使っており `@next/next/no-html-link-for-pages` が error になります（601行目付近と614行目付近）。ただし**タスクB-6でブログへの導線を外すなら、この箇所ごと消える**ので、Bを先にやってから残っていれば対応してください。

---

# タスクB｜ブログのリセット

**方針：記事は全部消す。投稿の仕組み（管理画面・一覧・動的ルート）は残す。**

管理画面（`app/admin/` と `app/api/admin/`）は JWT Cookie 認証と GitHub Git Data API で1コミットにまとめる作りで、よくできています。**ここは触らないでください。** 新しい記事はここから投稿します。

## B-1. 静的記事ページを削除

```
app/(corporate)/blog/how-to-pack/
app/(corporate)/blog/jisaku-pc/
app/(corporate)/blog/toyama-fuyohin-tips/
```

これらは .md ではなく直書きの .tsx ページです。本番で公開されており、以下が含まれています（`amniss-japan.jp` に直接リクエストして確認済み）。

| URL | 検出された表現 |
|---|---|
| `/blog/jisaku-pc` | 12,100円 ／ 地域最安級 ／ 業界で唯一 ／ どこよりも高く ／ 100%回避 ／ A.P.C LOGISTICS ／ 完全無料 |
| `/blog/how-to-pack` | 12,100円 ／ 地域最安級 ／ 100%回避 ／ A.P.C LOGISTICS ／ 完全無料 |
| `/blog/toyama-fuyohin-tips` | A.P.C LOGISTICS |

「地域最安級」「業界で唯一」「どこよりも高く」は根拠のない優良誤認表現、「新居でのWi-Fi開通設定が完全無料」は現在提供していないサービスの約束です。

## B-2. Markdown記事を削除

```
content/blog/20260608-9v4c.md          【DXの本質】中小企業のIT化（IT/DXコンサル記事）
content/blog/amniss-kaitori-nagare.md  出張買取・不用品回収の流れ
```

## B-3. `lib/posts-meta.ts` の配列を空に

`BLOG_POSTS_META` を空配列にしてください。**型定義（`BlogPostMeta`）とデフォルト値の仕組みは残す**こと。管理画面がこのファイルの先頭にエントリを挿入する作りになっています（`app/api/admin/posts/route.ts` がマーカー文字列 `export const BLOG_POSTS_META: BlogPostMeta[] = [\n` を探して差し込む）。

**このマーカー行の書式を変えないでください。** 変えると管理画面からの投稿が壊れます。

## B-4. `lib/posts.ts` の整理

未使用の re-export を削除：

```ts
export { BLOG_POSTS_META };
export type { BlogPostMeta };
```

全ソース中、`@/lib/posts` からこの2つを import している箇所はありません（3箇所とも `@/lib/posts-meta` から直接）。

`readMarkdownMetas()` と `getPostBySlug()` は記事0件でも正常に動くので残してください。

## B-5. ブログ一覧ページ

`app/(corporate)/blog/page.tsx`

- 63行目付近の説明文から「パソコン・DX」を削除
  現在：`引越し・お片付け・パソコン・DXに関する役立つコンテンツです。`
  修正後：`引越し・お片付け・不用品の処分に関する役立つ情報をお届けします。`
- **記事0件のときの表示**を用意してください。「COMING SOON」のような空箱は置かないこと。記事がない場合はリストを出さず、LINE相談への導線だけにする、程度で十分です

## B-6. ブログへの導線を一時的に外す

記事が0件のあいだ、以下を非表示にしてください。**1本書いたら戻します。**

- `app/components/Header.tsx` — ナビの「ブログ」（PC版・モバイル版の両方）
- `app/components/Footer.tsx` — ナビの「ブログ」
- `app/(corporate)/page.tsx` — 「お役立ち情報（BLOG）」セクションごと
- `app/sitemap.ts` — `/blog` の行

コメントアウトではなく削除で構いません（gitに残るので）。

## B-7. sitemap

`getAllPosts()` が空配列を返すので、ブログ記事の行は自動的に消えます。**修正不要**です。`/blog` 自体の行だけ B-6 で外してください。

---

# 触らないでほしいもの

以下はGoogleビジネスプロフィールの審査対応で、外部と一字一句そろえてあります。**表記を変えないでください。**

| ファイル | 理由 |
|---|---|
| `app/components/Footer.tsx` のNAPブロック | 屋号・住所・電話がGBPと完全一致している必要がある |
| `app/components/JsonLd.tsx` | 同上。schema.org の構造化データ |
| `app/(corporate)/tokushoho/page.tsx` | 特定商取引法に基づく表記 |
| `next.config.ts` の `redirects()` | 削除済み5URLの受け皿 |

また `app/(corporate)/layout.tsx` に **canonical をレイアウトに書かない**旨のコメントがあります。App Router では `alternates` が子ページに継承され、ブログ記事まで全部トップに正規化されてしまうためです。ここは変えないでください。

---

# 判断が要るので、勝手にやらないでほしいこと

## public/images の未使用ファイル

```
総数 209枚 / 1,370MB
  参照あり   4枚（IMG_1438.JPG / face (2).jpg / logistics-car.png / gadgets-clean.png）
  未参照   205枚 / 1,356MB
```

リポジトリの99%が未参照の画像で、clone もデプロイも毎回1.4GB運んでいます。

**ただし `IMG_1307.JPG` 〜 `IMG_1445.JPG` は作業写真の可能性が高く**、トップページの「実際の作業風景」ギャラリー（現在 COMING SOON）に使うつもりで置いたものかもしれません。**中身を確認せずに消さないでください。**

本人に確認のうえ、別途対応します。参考までに未使用のうち大きいもの：

```
IMG_1445.JPG  11.4MB
IMG_1444.JPG  11.3MB
IMG_1332.JPG   9.1MB
it-dx-solution.png  8.8MB   ← これは削除済み事業の画像なので確実に不要
```

使う4枚も無圧縮です（`IMG_1438.JPG` 6.7MB、`logistics-car.png` 6.7MB）。ヒーロー画像が6.7MBはモバイルで数秒かかるので、圧縮は別途やります。

---

# 検証

```bash
npx tsc --noEmit
npm run build
npm run dev        # / と /blog を目視確認
```

削除したものへの参照が残っていないかも確認してください。

```bash
grep -rn "send-summary\|how-to-pack\|jisaku-pc\|toyama-fuyohin-tips\|amn-fade" app lib content
```

# コミット

2つに分けてください。

```
1) chore: 未使用コードと旧LPの残骸を削除
2) chore: ブログ記事をリセット（投稿の仕組みは維持）
```

push は自動デプロイなので、build が通ってから。

---

# 補足：出どころの明示

この指示書のうち、**実機（`D:\AmNissJapan_backup\amniss-hd`）で直接確認したもの**：

- `send-summary` の孤立（grep 0件）、`console.log` の存在
- ブログ3記事の旧価格・旧屋号・根拠なし表現（本番URLへの直接リクエストでも確認）
- `public/images` の枚数と容量

**クラウドに持ち込んだ複製で確認したもの（実機での再確認を推奨）**：

- 未使用import、未使用CSS、`lib/posts.ts` の未使用re-export
- `privacy/page.tsx` のIT/DX記述、`blog/page.tsx` の「パソコン・DX」
- lint エラー、`package.json` の name

複製には `public/images` を持ち込んでいなかったため、調査の過程で「画像が全部参照切れ」という誤った結論が一度出ています。**画像まわりの判断は実機の数字（上記）を使ってください。**
