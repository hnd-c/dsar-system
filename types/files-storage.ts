export type FileType = 'folder' | 'file';

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  storage_path?: string;
  size?: number;
  mime_type?: string;
  parent_id?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}