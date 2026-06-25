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
  /** GitHub 仓库文件 URL（可选）。设置后由服务端定时同步最新内容到 Storage */
  github_url: string | null;
  /** 最后一次从 GitHub 成功同步的时间 */
  github_synced_at: string | null;
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
  /** 上传文件或 GitHub URL 二选一，至少填一个 */
  file?: File;
  coverImage?: File;
  /** 连接 GitHub 文件 URL，发布后立即同步，之后每次 push 自动更新 */
  githubUrl?: string;
}

export interface UpdateAppInput {
  name?: string;
  description?: string;
  is_published?: boolean;
  cover_image_url?: string | null;
  status?: AppStatus;
  review_note?: string | null;
  reviewed_at?: string | null;
  github_url?: string | null;
}

export interface AppUploadResponse {
  app_id: string;
  file_path: string;
  message: string;
}
