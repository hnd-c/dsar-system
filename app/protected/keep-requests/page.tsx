import { createClient } from "@/utils/supabase/server";
import NoteCard from "./keepCards";
import CreateNoteForm from "./keepForm";

export default async function NotesPage() {
  const supabase = await createClient();

  const { data: notes, error } = await supabase
    .from("keep")
    .select()
    .eq('is_deleted', false)
    .order('is_pinned', { ascending: false })
    .order('updated_at', { ascending: false });

  if (error) {
    return <p>Error fetching notes: {error.message}</p>;
  }

  const pinnedNotes = notes?.filter(note => note.is_pinned) || [];
  const unpinnedNotes = notes?.filter(note => !note.is_pinned) || [];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <CreateNoteForm />
      </div>

      {pinnedNotes.length > 0 && (
        <>
          <h2 className="text-sm font-medium text-gray-500 mb-4">PINNED</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {pinnedNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </>
      )}

      {unpinnedNotes.length > 0 && (
        <>
          {pinnedNotes.length > 0 && (
            <h2 className="text-sm font-medium text-gray-500 mb-4">OTHERS</h2>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {unpinnedNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}