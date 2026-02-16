import PostsPage from '@/components/modules/post/AllPostsPage';
import { getAllPostsAction } from '@/lib/services/post/post.service';

export default async function AllPostPage({ searchParams }) {
 
  const page = Number((await searchParams)?.page) || 1;
  const limit = Number((await searchParams)?.limit) || 4;

  const authorFilter = (await searchParams)?.author || 'all';

  const postsResponse = await getAllPostsAction({ page, limit });

  if (!postsResponse.success) {
    return <div>Error loading posts</div>;
  }

  const combinedData = postsResponse?.data?.data || [];
  // const allUsers = postsResponse?.data?.users || [];
  // const meta = postsResponse?.data?.meta || {};

  console.log( combinedData?.users );

  return (
    <PostsPage
      allPost={combinedData?.data || []}
      allUsers={combinedData?.users || []}
      meta={combinedData?.meta || {}}
      page={page}
      limit={limit}
      authorFilter={authorFilter}
    />
  );
}