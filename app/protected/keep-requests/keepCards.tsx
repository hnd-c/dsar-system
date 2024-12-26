'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Trash2, Edit, Check, X } from 'lucide-react';

interface Note {
  id: string;
  title: string | null;
  content: string | null;
  color: string | null;
  is_pinned: boolean;
  is_archived: boolean;
  labels: string[];
  created_at: string;
  updated_at: string;
}

export default function NoteCard({ note }: { note: Note }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState({
    id: note.id,
    title: note.title ?? '',
    content: note.content ?? '',
    color: note.color ?? 'default',
    is_pinned: Boolean(note.is_pinned),
    is_archived: Boolean(note.is_archived),
    labels: Array.isArray(note.labels) ? note.labels : [],
    created_at: note.created_at,
    updated_at: note.updated_at
  });
  const supabase = createClient();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this note?')) {
      const { error } = await supabase
        .from('keep')
        .update({ 
          is_deleted: true,
          deleted_at: new Date().toISOString()
        })
        .eq('id', note.id);

      if (error) {
        alert('Error deleting note: ' + error.message);
      } else {
        window.location.reload();
      }
    }
  };

  const handleUpdate = async () => {
    const { error } = await supabase
      .from('keep')
      .update({
        title: editedNote.title,
        content: editedNote.content,
        color: editedNote.color,
        updated_at: new Date().toISOString()
      })
      .eq('id', note.id);

    if (error) {
      alert('Error updating note: ' + error.message);
    } else {
      setIsEditing(false);
      window.location.reload();
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 border border-blue-200">
        <div className="space-y-3">
          <input
            type="text"
            value={editedNote.title}
            onChange={(e) => setEditedNote({...editedNote, title: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="Title"
          />
          <textarea
            value={editedNote.content}
            onChange={(e) => setEditedNote({...editedNote, content: e.target.value})}
            className="w-full p-2 border rounded resize-none"
            rows={3}
            placeholder="Take a note..."
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded"
            >
              <X size={18} />
            </button>
            <button
              onClick={handleUpdate}
              className="p-2 text-green-500 hover:bg-green-100 rounded"
            >
              <Check size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-medium text-lg">{note.title}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-500 hover:bg-gray-100 rounded"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-red-500 hover:bg-red-100 rounded"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-700 mb-3 line-clamp-3">{note.content}</p>
        {note.labels && note.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {note.labels.map((label, index) => (
              <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                {label}
              </span>
            ))}
          </div>
        )}
        <div className="flex justify-between items-center text-xs text-gray-500 mt-auto pt-2 border-t">
          <span>{new Date(note.updated_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}