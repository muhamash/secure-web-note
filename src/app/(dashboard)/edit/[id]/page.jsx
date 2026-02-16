import EditNotePage from "@/components/modules/note/CreateNoteHome";
import EditNoteSkeleton from "@/components/modules/skeletons/EditNoteSkeleton";
import { fetchSingleUserNote } from "@/lib/services/note/user.service";
import { Suspense } from "react";

const EditNoteHome = async ({params}) =>
{

  const notesParams = await params

  console.log( notesParams );

  const getNotePromise =  fetchSingleUserNote( notesParams?.id )
  // console.log(getNote)
  
  return (
    <Suspense fallback={ <EditNoteSkeleton /> }>
      <EditNotePage singleNotePromise={ getNotePromise} />
    </Suspense>
  );
};

export default EditNoteHome;