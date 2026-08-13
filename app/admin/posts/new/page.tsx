import PostForm from "../../_components/PostForm";

/**
 * 新規投稿。
 *
 * 【55／段階4】中身は `app/admin/_components/PostForm.tsx` に移した。**編集画面と同じものを使う。**
 * 分けて持つと、A-4 の対策（JSが追いつくまで入力欄を disabled）が片方にしか入らない。
 */
export default function NewPostPage() {
  return <PostForm mode="new" />;
}
