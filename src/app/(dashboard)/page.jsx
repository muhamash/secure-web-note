import NotesPageHome from '@/components/modules/note/NoteHome';
import NotesSkeleton from '@/components/modules/skeletons/NotesHomeSkeleton';
import { getServerSideUserSession } from '@/lib/services/auth/auth.serverSideSession';
import { fetchUsersNotes } from '@/lib/services/note/user.service';
import { Suspense } from 'react';

export default async function NotesPage({ searchParams }) {
  const user = await getServerSideUserSession();

  const page = Number((await searchParams)?.page) || 1;
  const limit = Number((await searchParams)?.limit) || 4;

  const userNotesPromise = fetchUsersNotes(user?.user?.id, { page, limit });

  return (
    <Suspense fallback={<NotesSkeleton />}>
      <NotesPageHome promiseNotes={userNotesPromise} page={page} limit={limit} />
    </Suspense>
  );
}