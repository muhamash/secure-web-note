'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Newspaper, Plus } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function MyPostsPage({ posts = [], meta = {} }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = meta?.totalPages || 1;

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page);
    router.push(`/my-posts?${params.toString()}`);
  };

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            My Posts
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage your published posts
          </p>
        </div>
        <Button
          onClick={() => router.push('/posts/create')}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </div>

      {/* Empty State */}
      {posts.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-300 dark:border-slate-700">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Newspaper className="h-16 w-16 text-slate-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              No posts yet
            </h3>
            <Button onClick={() => router.push('/posts/create')}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Posts List */}
          <div className="space-y-4">
            {posts.map((post) => (
              <Card
                key={post._id}
                className="hover:shadow-lg transition-all"
              >
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <CardTitle className="text-lg">
                        {post.title}
                      </CardTitle>
                      <div className="flex items-center text-sm text-slate-500 mt-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-slate-600 line-clamp-3">
                    {post.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-6">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={currentPage === p ? 'default' : 'outline'}
                  onClick={() => handlePageChange(p)}
                >
                  {p}
                </Button>
              ))}

              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}