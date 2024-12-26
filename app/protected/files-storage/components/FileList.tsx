'use client';

import { FileItem } from '@/types/files-storage';
import { createClient } from '@/utils/supabase/client';
import { FolderIcon, FileIcon, TrashIcon, DownloadIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function FileList({ files }: { files: FileItem[] }) {
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async (file: FileItem) => {
    if (!confirm('Are you sure you want to delete this?')) return;

    try {
      // Delete from storage if it's a file
      if (file.type === 'file' && file.storage_path) {
        await supabase
          .storage
          .from('user-files')
          .remove([file.storage_path]);
      }

      // Soft delete in database
      await supabase
        .from('files')
        .update({ is_deleted: true })
        .eq('id', file.id);

      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting file');
    }
  };

  const handleDownload = async (file: FileItem) => {
    if (file.type !== 'file' || !file.storage_path) return;

    try {
      const { data, error } = await supabase
        .storage
        .from('user-files')
        .download(file.storage_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Error downloading file');
    }
  };

  return (
    <div className="grid gap-4">
      {files.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No files or folders
        </div>
      ) : (
        files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-4 bg-white rounded shadow hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              {file.type === 'folder' ? (
                <FolderIcon className="w-6 h-6 text-yellow-500" />
              ) : (
                <FileIcon className="w-6 h-6 text-blue-500" />
              )}
              {file.type === 'folder' ? (
                <Link
                  href={`/protected/files-storage?folder=${file.id}`}
                  className="hover:underline"
                >
                  {file.name}
                </Link>
              ) : (
                <span>{file.name}</span>
              )}
              {file.size && (
                <span className="text-sm text-gray-500">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {file.type === 'file' && (
                <button
                  onClick={() => handleDownload(file)}
                  className="p-2 hover:bg-gray-100 rounded"
                  title="Download"
                >
                  <DownloadIcon className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => handleDelete(file)}
                className="p-2 hover:bg-gray-100 rounded text-red-500"
                title="Delete"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}