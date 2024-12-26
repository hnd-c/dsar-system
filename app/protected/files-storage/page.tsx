import { createClient } from '@/utils/supabase/server';
import FileList from './components/FileList';
import FileUpload from './components/FileUpload';
import BreadCrumb from './components/BreadCrumb';
import CreateFolder from './components/CreateFolder';

interface PageProps {
  searchParams: Promise<{
    folder?: string;
  }>;
}

export default async function FilesStoragePage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const params = await searchParams;
  const currentFolder = params?.folder || null;

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  //console.log('Current user:', user.id); // Debug log

  // Get files in current folder (without parent_id filter if null)
  const filesQuery = supabase
    .from('files')
    .select('*')
    .eq('owner_id', user.id)
    .eq('is_deleted', false);

  // Only add parent_id filter if currentFolder exists
  if (currentFolder) {
    filesQuery.eq('parent_id', currentFolder);
  } else {
    filesQuery.is('parent_id', null);
  }

  const { data: files, error: filesError } = await filesQuery
    .order('type')
    .order('name');

  //console.log('Files:', files, filesError); // Debug log

  // Get current folder details if we're in a subfolder
  const { data: currentFolderDetails, error: folderError } = currentFolder ? await supabase
    .from('files')
    .select('*')
    .eq('id', currentFolder)
    .single() : { data: null, error: null };

  //console.log('Folder details:', currentFolderDetails, folderError); // Debug log

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <BreadCrumb currentFolder={currentFolderDetails} />
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {currentFolderDetails?.name || 'My Files'}
        </h1>
        <div className="flex gap-4">
          <CreateFolder parentId={currentFolder} />
          <FileUpload parentId={currentFolder} />
        </div>
      </div>

      {filesError ? (
        <div className="text-red-500">Error loading files</div>
      ) : (
        <FileList files={files || []} />
      )}
    </div>
  );
}