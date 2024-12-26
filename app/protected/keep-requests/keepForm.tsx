'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function CreateNoteForm() {
  const [isExpanded, setIsExpanded] = useState(false);
  const initialFormState = {
    title: '',
    content: '',
    color: 'default',
    labels: [] as string[],
    shared_with: [] as string[],
    is_pinned: false,
    is_archived: false,
    is_deleted: false,
    deleted_at: null
  };
  
  const [formData, setFormData] = useState(initialFormState);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    
    if (!formData.content.trim()) {
      return;
    }

    const { error } = await supabase
      .from('keep')
      .insert([{
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: (await supabase.auth.getUser()).data.user?.id
      }]);

    if (error) {
      alert('Error creating note: ' + error.message);
    } else {
      setFormData({
        title: '',
        content: '',
        color: 'default',
        labels: [],
        shared_with: [],
        is_pinned: false,
        is_archived: false,
        is_deleted: false,
        deleted_at: null
      });
      setIsExpanded(false);
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white rounded-lg shadow-sm border border-gray-200 transition-shadow duration-200 hover:shadow-md"
      >
        {!isExpanded ? (
          <div 
            onClick={() => setIsExpanded(true)}
            className="p-4 cursor-text"
          >
            <input
              type="text"
              placeholder="Take a note..."
              className="w-full outline-none cursor-text"
              value=""
              onChange={() => {}}
              readOnly
            />
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Title"
              className="w-full p-2 outline-none"
              autoFocus
            />
            
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="Take a note..."
              className="w-full p-2 outline-none resize-none"
              rows={3}
              required
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsExpanded(false);
                  setFormData({
                    title: '',
                    content: '',
                    color: 'default',
                    labels: [],
                    shared_with: [],
                    is_pinned: false,
                    is_archived: false,
                    is_deleted: false,
                    deleted_at: null
                  });
                }}
                className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}