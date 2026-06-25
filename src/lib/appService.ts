import { supabase } from './supabase';
import { processUploadedFile, getContentType } from './fileService';
import type { HostedApp, CreateAppInput, UpdateAppInput, AppUploadResponse } from '../types/app';

// ─── GitHub URL 工具函数 ──────────────────────────────────────────────────────

/**
 * 将用户粘贴的 GitHub URL 转成 raw 文件 URL。
 * 支持两种格式：
 *   - https://github.com/owner/repo/blob/branch/path/file.html
 *   - https://raw.githubusercontent.com/owner/repo/branch/path/file.html
 * 返回 null 表示识别不了。
 */
export function parseGithubToRawUrl(url: string): string | null {
  try {
    const u = url.trim();
    // 已经是 raw URL
    if (u.startsWith('https://raw.githubusercontent.com/')) return u;
    // 标准 GitHub blob 预览链接
    const blobMatch = u.match(/https:\/\/github\.com\/([^/]+\/[^/]+)\/blob\/(.+)/);
    if (blobMatch) {
      return `https://raw.githubusercontent.com/${blobMatch[1]}/${blobMatch[2]}`;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * 简单验证：URL 是否看起来是合法的 GitHub HTML 文件链接。
 */
export function isValidGithubHtmlUrl(url: string): boolean {
  if (!url) return false;
  const raw = parseGithubToRawUrl(url);
  return raw !== null && /\.html?$/i.test(raw);
}

export const appService = {
  // Upload and create a new app
  async uploadApp(input: CreateAppInput): Promise<AppUploadResponse> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    if (!input.file && !input.githubUrl) {
      throw new Error('请上传应用文件或填写 GitHub 链接');
    }

    // GitHub-only 模式（无文件）：跳过文件处理，直接建记录后触发同步
    if (!input.file && input.githubUrl) {
      const { data: appData, error: appError } = await supabase
        .from('hosted_apps')
        .insert({
          user_id: user.id,
          name: input.name,
          description: input.description,
          app_file_path: '',        // 占位，sync 后会填充
          is_published: false,
          status: 'pending',
          github_url: input.githubUrl.trim(),
        })
        .select()
        .single();

      if (appError) throw appError;
      if (!appData) throw new Error('Failed to create app');

      // 设置文件路径占位符
      const entryFilePath = `${user.id}/${appData.id}/index.html`;
      await supabase
        .from('hosted_apps')
        .update({ app_file_path: entryFilePath })
        .eq('id', appData.id);

      // 上传封面图（如果有）
      if (input.coverImage) {
        const coverExt = input.coverImage.name.split('.').pop() || 'png';
        const coverPath = `${user.id}/${appData.id}/__cover__.${coverExt}`;
        const { error: coverError } = await supabase.storage
          .from('hosted-apps')
          .upload(coverPath, input.coverImage, {
            upsert: true,
            contentType: getContentType(input.coverImage.name),
          });
        if (!coverError) {
          const { data: coverData } = supabase.storage.from('hosted-apps').getPublicUrl(coverPath);
          await supabase.from('hosted_apps').update({ cover_image_url: coverData.publicUrl }).eq('id', appData.id);
        }
      }

      // 立即触发一次 GitHub 同步（拉取初始内容）
      try {
        await fetch(`/api/sync-app?app_id=${appData.id}`, { method: 'POST' });
      } catch {
        // 同步失败不阻断提交流程，后续可手动同步
      }

      return {
        app_id: appData.id,
        file_path: entryFilePath,
        message: 'App created and synced from GitHub',
      };
    }

    // Process uploaded file (handle ZIP or HTML)
    const { files, entryFile, isZip } = await processUploadedFile(input.file!);

    // Create app record
    const { data: appData, error: appError } = await supabase
      .from('hosted_apps')
      .insert({
        user_id: user.id,
        name: input.name,
        description: input.description,
        app_file_path: '',
        is_published: false,
        status: 'pending',
        github_url: input.githubUrl?.trim() || null,
      })
      .select()
      .single();

    if (appError) throw appError;
    if (!appData) throw new Error('Failed to create app');

    try {
      // Upload all files to storage
      const uploadPromises = files.map(async (file) => {
        const filePath = `${user.id}/${appData.id}/${file.path}`;
        const { error: uploadError } = await supabase.storage
          .from('hosted-apps')
          .upload(filePath, file.content, {
            upsert: false,
            contentType: getContentType(file.name),
            cacheControl: '0', // 不长期缓存，更换文件后能立即生效
          });

        if (uploadError) throw uploadError;
        return filePath;
      });

      await Promise.all(uploadPromises);

      // 上传封面图（如果有）
      let coverImageUrl: string | null = null;
      if (input.coverImage) {
        const coverExt = input.coverImage.name.split('.').pop() || 'png';
        const coverPath = `${user.id}/${appData.id}/__cover__.${coverExt}`;
        const { error: coverError } = await supabase.storage
          .from('hosted-apps')
          .upload(coverPath, input.coverImage, {
            upsert: true,
            contentType: getContentType(input.coverImage.name),
          });

        if (!coverError) {
          const { data: coverData } = supabase.storage
            .from('hosted-apps')
            .getPublicUrl(coverPath);
          coverImageUrl = coverData.publicUrl;
        }
      }

      // Set the entry file path as the app's file path
      const entryFilePath = `${user.id}/${appData.id}/${entryFile.path}`;
      const { error: updateError } = await supabase
        .from('hosted_apps')
        .update({ app_file_path: entryFilePath, cover_image_url: coverImageUrl })
        .eq('id', appData.id);

      if (updateError) throw updateError;

      return {
        app_id: appData.id,
        file_path: entryFilePath,
        message: `App uploaded successfully${isZip ? ' (from ZIP)' : ''}`,
      };
    } catch (error) {
      // Clean up app record if upload fails
      await supabase.from('hosted_apps').delete().eq('id', appData.id);
      throw error;
    }
  },

  // Get app by ID
  async getApp(appId: string): Promise<HostedApp> {
    const { data, error } = await supabase
      .from('hosted_apps')
      .select('*')
      .eq('id', appId)
      .single();

    if (error) throw error;
    return data;
  },

  // Get all published apps (审核通过的才公开展示)
  async getPublishedApps(limit = 50, offset = 0): Promise<HostedApp[]> {
    const { data, error } = await supabase
      .from('hosted_apps')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data;
  },

  // 管理员：获取所有待审核应用
  async getPendingApps(): Promise<HostedApp[]> {
    const { data, error } = await supabase
      .from('hosted_apps')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  // 管理员：审核应用（通过 / 拒绝）
  async reviewApp(
    appId: string,
    action: 'approved' | 'rejected',
    note?: string
  ): Promise<HostedApp> {
    const { data, error } = await supabase
      .from('hosted_apps')
      .update({
        status: action,
        is_published: action === 'approved',
        review_note: action === 'rejected' ? note?.trim() || null : null,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', appId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 用户：被拒后修改完重新提交，状态回到 pending
  async resubmitApp(appId: string): Promise<HostedApp> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('hosted_apps')
      .update({
        status: 'pending',
        review_note: null,
        reviewed_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', appId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user's apps
  async getUserApps(): Promise<HostedApp[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('hosted_apps')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Update app
  async updateApp(appId: string, input: UpdateAppInput): Promise<HostedApp> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('hosted_apps')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', appId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 更换应用文件（HTML/ZIP），返回新的入口文件路径
  async updateAppFile(appId: string, file: File): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // 处理新文件（HTML 或 ZIP）
    const { files, entryFile } = await processUploadedFile(file);

    // 删除旧的应用文件（保留封面图 __cover__）
    const { data: existing } = await supabase.storage
      .from('hosted-apps')
      .list(`${user.id}/${appId}`);

    if (existing && existing.length > 0) {
      const toRemove = existing
        .filter((f) => !f.name.startsWith('__cover__'))
        .map((f) => `${user.id}/${appId}/${f.name}`);
      if (toRemove.length > 0) {
        await supabase.storage.from('hosted-apps').remove(toRemove);
      }
    }

    // 上传新文件
    await Promise.all(
      files.map(async (f) => {
        const filePath = `${user.id}/${appId}/${f.path}`;
        const { error: uploadError } = await supabase.storage
          .from('hosted-apps')
          .upload(filePath, f.content, {
            upsert: true,
            contentType: getContentType(f.name),
            cacheControl: '0', // 不长期缓存，更换文件后能立即生效
          });
        if (uploadError) throw uploadError;
      })
    );

    // 更新入口文件路径
    const entryFilePath = `${user.id}/${appId}/${entryFile.path}`;
    const { error: updateError } = await supabase
      .from('hosted_apps')
      .update({ app_file_path: entryFilePath, updated_at: new Date().toISOString() })
      .eq('id', appId)
      .eq('user_id', user.id);

    if (updateError) throw updateError;

    return entryFilePath;
  },

  // 上传/更换封面图，返回公开 URL
  async uploadCoverImage(appId: string, coverImage: File): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const coverExt = coverImage.name.split('.').pop() || 'png';
    const coverPath = `${user.id}/${appId}/__cover__.${coverExt}`;
    const { error: coverError } = await supabase.storage
      .from('hosted-apps')
      .upload(coverPath, coverImage, {
        upsert: true,
        contentType: getContentType(coverImage.name),
      });

    if (coverError) throw coverError;

    const { data: coverData } = supabase.storage
      .from('hosted-apps')
      .getPublicUrl(coverPath);

    // 加时间戳避免浏览器缓存旧图
    return `${coverData.publicUrl}?t=${Date.now()}`;
  },

  // Delete app
  async deleteApp(appId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get app to find file path
    const { data: appData } = await supabase
      .from('hosted_apps')
      .select('app_file_path')
      .eq('id', appId)
      .eq('user_id', user.id)
      .single();

    if (appData) {
      // Delete files from storage
      const { error: deleteFileError } = await supabase.storage
        .from('hosted-apps')
        .remove([appData.app_file_path]);

      if (deleteFileError) console.error('Error deleting file:', deleteFileError);
    }

    // Delete app record
    const { error } = await supabase
      .from('hosted_apps')
      .delete()
      .eq('id', appId)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  // Get signed URL for accessing app file
  async getAppFileUrl(filePath: string): Promise<string> {
    const { data } = supabase.storage
      .from('hosted-apps')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  // 抓取入口 HTML 内容（以 UTF-8 解码），并注入 <base> 让相对资源正确加载
  // 用于 iframe srcdoc 渲染，绕开 Storage 的 Content-Type/编码问题
  async getAppHtmlContent(filePath: string, version?: string): Promise<string> {
    const fileUrl = await this.getAppFileUrl(filePath);

    // 计算文件夹 URL（用于 <base href>），让相对路径资源指向 Storage 目录
    const baseHref = fileUrl.substring(0, fileUrl.lastIndexOf('/') + 1);

    // 加版本号让 CDN/浏览器缓存失效，更换文件后能立即看到新内容
    const cacheBust = version ? `?v=${new Date(version).getTime() || version}` : '';
    const res = await fetch(`${fileUrl}${cacheBust}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('无法加载应用文件');

    // 用 TextDecoder 强制以 UTF-8 解码，避免中文乱码
    const buffer = await res.arrayBuffer();
    let html = new TextDecoder('utf-8').decode(buffer);

    // 注入 <base> 标签（如果还没有）
    if (!/<base\s/i.test(html)) {
      const baseTag = `<base href="${baseHref}">`;
      if (/<head[^>]*>/i.test(html)) {
        html = html.replace(/<head[^>]*>/i, (m) => `${m}\n${baseTag}`);
      } else if (/<html[^>]*>/i.test(html)) {
        html = html.replace(/<html[^>]*>/i, (m) => `${m}\n<head>${baseTag}</head>`);
      } else {
        html = `${baseTag}\n${html}`;
      }
    }

    return html;
  },

  // 设置 / 清除 GitHub 同步 URL
  async updateGithubUrl(appId: string, githubUrl: string | null): Promise<HostedApp> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('hosted_apps')
      .update({
        github_url: githubUrl || null,
        // 清除旧同步时间，让下次同步重新标记
        github_synced_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', appId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Increment view count（单次原子自增）
  async incrementViewCount(appId: string): Promise<void> {
    await supabase.rpc('increment_view_count', { app_id: appId });
  },

  // Increment run count（用户实际运行应用时调用，单次原子自增）
  async incrementRunCount(appId: string): Promise<void> {
    await supabase.rpc('increment_run_count', { app_id: appId });
  },
};
