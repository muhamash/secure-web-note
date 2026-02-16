'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { deleteUserNote } from '@/lib/services/note/user.service';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { use } from 'react';
import toast from 'react-hot-toast';

export default function NotesPageHome({ promiseNotes, page = 1, limit = 6 }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const userData = use( promiseNotes );
  console.log(userData?.data?.data)
  const notes = userData?.data?.data?.notes || [];
  const notesMeta = userData?.data?.data?.notesMeta || {};
  const totalPages = notesMeta?.totalPages || 1;

  const handleEdit = (noteId) => {
    router.push(`/edit/${noteId}`);
  };

  const handleDelete = async(noteId) => {
    try 
    {
      const response = await deleteUserNote( noteId );

      if ( response?.success )
      {
        toast?.success( "Deleted!!" )
        window.location.reload();
      }
      else
      {
        return
      }
    }
    catch ( error )
    {
      console.log( error )
      toast.error(error?.message || "unable to delete")
    }
  };

  const handlePageChange = ( newPage ) =>
  {
    const params = new URLSearchParams( searchParams.toString() );
    params.set( 'page', String( newPage ) );
    router.push( `?${params.toString()}` );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          My Notes
        </h2>
        <Link href="/create-note">
          <Button className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg">
            Create Note
          </Button>
        </Link>
      </div>

      {notes.length === 0 ? (
        <p className="text-center text-slate-500 dark:text-slate-400 py-16">
          No notes available
        </p>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <Card
                key={note._id}
                className="group hover:shadow-xl transition-all duration-200 border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700"
              >
                <CardHeader>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {note.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {new Date(note.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-4">
                    {note.content}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {note.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(note._id)}
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(note._id)}
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={page === p ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(p)}
                  className={page === p ? 'bg-teal-600 hover:bg-teal-700' : ''}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
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