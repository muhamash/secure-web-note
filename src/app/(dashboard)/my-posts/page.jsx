import MyPostsPage from "@/components/modules/post/MyPostPage";
import { getUserPostsAction } from "@/lib/services/post/post.service";

export default async function PostsPage({ searchParams }) {
  const page = Number((await searchParams)?.page) || 1;
  const limit = Number((await searchParams)?.limit) || 4;

  const postsResponse = await getUserPostsAction({ page, limit });

  if (!postsResponse.success) {
    return <div>Error loading posts</div>;
  }

  const posts = postsResponse?.data?.data?.posts || [];
  const meta = postsResponse?.data?.data?.meta || {};

  console.log(posts, meta)

  return (
    <MyPostsPage posts={ posts } meta={ meta } />
  );
}