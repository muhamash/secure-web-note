'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Plus, User } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function PostsPage({ allPost, allUsers, meta, page, limit, authorFilter }) {
  const router = useRouter();
    const searchParams = useSearchParams();
    
    console.log(allPost, allUsers, meta)

  const [selectedAuthor, setSelectedAuthor] = useState(authorFilter || 'all');

  const updateUrl = (newPage = page, newAuthor = selectedAuthor) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    params.set('limit', limit.toString());
    if (newAuthor && newAuthor !== 'all') {
      params.set('author', newAuthor);
    } else {
      params.delete('author');
    }

    router.push(`/posts?${params.toString()}`);
  };

  // Ensure allPost is always an array
  const posts = Array.isArray(allPost) ? allPost : [];

const filteredPosts = selectedAuthor === 'all'
  ? posts
  : posts.filter(post => post.user?.name.toLowerCase() === selectedAuthor.toLowerCase());

console.log('All Posts:', posts);
console.log('Filtered Posts:', filteredPosts);



  const totalPages = meta?.totalPages || 1;

  const getInitials = (name) => {
    if (!name) return 'NA';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const colors = [
    'from-teal-500 to-teal-600',
    'from-emerald-500 to-emerald-600',
    'from-purple-500 to-purple-600',
    'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600',
    'from-indigo-500 to-indigo-600',
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Public Posts</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Read posts from the community</p>
        </div>
        <Button
          onClick={() => router.push('/posts/create')}
          className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Post
        </Button>
      </div>

      {/* Author Filter */}
      <div className="flex items-center space-x-2">
        <User className="h-4 w-4 text-slate-400" />
        <Select 
          value={selectedAuthor} 
          onValueChange={(val) => {
            setSelectedAuthor(val);
            updateUrl(1, val);
          }}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Filter by author" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Authors</SelectItem>
            {Array.isArray(allUsers) && allUsers.map(user => (
              <SelectItem key={user._id} value={user.name}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedAuthor !== 'all' && (
          <Badge variant="secondary" className="bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
          </Badge>
        )}
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-300 dark:border-slate-700">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No posts found</h3>
            <p className="text-slate-600 dark:text-slate-400 text-center max-w-sm">
              {selectedAuthor === 'all' 
                ? 'No posts available at the moment' 
                : 'No posts available from this author'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map(post => (
            <Card 
              key={post._id} 
              className="group hover:shadow-xl transition-all duration-200 border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 relative"
            >
              <CardHeader>
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback 
                      className={`bg-gradient-to-br ${
                        colors[post.user?.name?.charCodeAt(0) % colors.length] || colors[0]
                      } text-white text-sm`}
                    >
                      {getInitials(post.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {post.user?.name || 'Unknown'}
                    </p>
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-4">
                  {post.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-4">
          <Button 
            onClick={() => updateUrl(Math.max(page - 1, 1))} 
            disabled={page === 1}
            variant="outline"
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <Button 
              key={p} 
              onClick={() => updateUrl(p)} 
              variant={page === p ? 'default' : 'outline'}
            >
              {p}
            </Button>
          ))}
          <Button 
            onClick={() => updateUrl(Math.min(page + 1, totalPages))} 
            disabled={page === totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}