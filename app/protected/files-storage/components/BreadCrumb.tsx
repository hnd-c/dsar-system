'use client';

import { FileItem } from '@/types/files-storage';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface BreadCrumbProps {
  currentFolder: FileItem | null;
}

export default function BreadCrumb({ currentFolder }: BreadCrumbProps) {
  const [path, setPath] = useState<FileItem[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function loadPath() {
      if (!currentFolder) {
        setPath([]);
        return;
      }

      const pathArray: FileItem[] = [currentFolder];
      let parent = currentFolder;

      while (parent.parent_id) {
        const { data } = await supabase
          .from('files')
          .select('*')
          .eq('id', parent.parent_id)
          .single();

        if (!data) break;
        pathArray.unshift(data);
        parent = data;
      }

      setPath(pathArray);
    }

    loadPath();
  }, [currentFolder]);

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Link href="/protected/files-storage" className="hover:text-blue-500">
        Home
      </Link>
      {path.map((folder, index) => (
        <div key={folder.id} className="flex items-center gap-2">
          <span>/</span>
          <Link
            href={`/protected/files-storage?folder=${folder.id}`}
            className={`hover:text-blue-500 ${
              index === path.length - 1 ? 'font-medium text-gray-900' : ''
            }`}
          >
            {folder.name}
          </Link>
        </div>
      ))}
    </div>
  );
}