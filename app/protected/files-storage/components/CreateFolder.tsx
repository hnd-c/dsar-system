'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FolderPlusIcon } from 'lucide-react';

export default function CreateFolder({ parentId }: { parentId: string | null }) {
  const [isCreating, setIsCreating] = useState(false);
  const [folderName, setFolderName] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) throw new Error('Not authenticated');

      // Create folder
      const { error: folderError } = await supabase
        .from('files')
        .insert({
          name: folderName.trim(),
          type: 'folder',
          parent_id: parentId,
          owner_id: user.id,
          is_deleted: false
        });

      if (folderError) {
        console.error('Folder creation error:', folderError);
        throw folderError;
      }

      setFolderName('');
      setIsCreating(false);
      router.refresh();
    } catch (error: any) {
      console.error('Error creating folder:', error.message);
      alert(`Error creating folder: ${error.message}`);
    }
  };

  return (
    <div>
      {isCreating ? (
        <form onSubmit={handleCreate} className="flex gap-2">
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="border rounded px-2 py-1"
            placeholder="Folder name"
            autoFocus
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => setIsCreating(false)}
            className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
        >
          <FolderPlusIcon className="w-5 h-5" />
          New Folder
        </button>
      )}
    </div>
  );
}