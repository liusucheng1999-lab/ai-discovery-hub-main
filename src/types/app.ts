export type AppStatus = 'pending' | 'approved' | 'rejected';

export interface HostedApp {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  app_file_path: string;
  cover_image_url: string | null;
  is_published: boolean;
  status: AppStatus;
  review_note: string | null;
  reviewed_at: string | null;
  view_count: number;
  run_count: number;
  created_at: string;
  updated_at: string;
}

export interface AppFile {
  id: string;
  app_id: string;
  file_path: string;
  file_type: 'html' | 'zip';
  version: number;
  uploaded_at: string;
}

export interface CreateAppInput {
  name: string;
  description?: string;
  file: File;
  coverImage?: File;
}

export interface UpdateAppInput {
  name?: string;
  description?: string;
  is_published?: boolean;
  cover_image_url?: string | null;
  status?: AppStatus;
  review_note?: string | null;
  reviewed_at?: string | null;
}

export interface AppUploadResponse {
  app_id: string;
  file_path: string;
  message: string;
}
