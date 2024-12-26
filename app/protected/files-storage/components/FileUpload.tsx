'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadIcon } from 'lucide-react';

export default function FileUpload({ parentId }: { parentId: string | null }) {
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const files = event.target.files;
      if (!files || files.length === 0) return;

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) throw new Error('Not authenticated');

      for (const file of Array.from(files)) {
        // Create storage path
        const storagePath = `${user.id}/${Date.now()}-${file.name}`;

        // Upload to storage
        const { error: uploadError } = await supabase
          .storage
          .from('user-files')
          .upload(storagePath, file);

        if (uploadError) throw uploadError;

        // Create file record
        const { error: dbError } = await supabase
          .from('files')
          .insert({
            name: file.name,
            type: 'file',
            storage_path: storagePath,
            size: file.size,
            mime_type: file.type,
            parent_id: parentId,
            owner_id: user.id,
            is_deleted: false
          });

        if (dbError) throw dbError;
      }

      router.refresh();
    } catch (error: any) {
      console.error('Upload error:', error.message);
      alert(`Error uploading file: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        id="file"
        className="hidden"
        onChange={handleUpload}
        disabled={uploading}
        multiple
      />
      <label
        htmlFor="file"
        className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded ${
          uploading
            ? 'bg-gray-400'
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white transition-colors`}
      >
        <UploadIcon className="w-5 h-5" />
        {uploading ? 'Uploading...' : 'Upload Files'}
      </label>
    </div>
  );
}