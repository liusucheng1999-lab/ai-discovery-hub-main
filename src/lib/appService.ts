import { supabase } from './supabase';
import { processUploadedFile } from './fileService';
import type { HostedApp, CreateAppInput, UpdateAppInput, AppUploadResponse } from '../types/app';

export const appService = {
  // Upload and create a new app
  async uploadApp(input: CreateAppInput): Promise<AppUploadResponse> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Process uploaded file (handle ZIP or HTML)
    const { files, entryFile, isZip } = await processUploadedFile(input.file);

    // Create app record
    const { data: appData, error: appError } = await supabase
      .from('hosted_apps')
      .insert({
        user_id: user.id,
        name: input.name,
        description: input.description,
        app_file_path: '',
        is_published: false,
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
          .upload(filePath, file.content, { upsert: false });

        if (uploadError) throw uploadError;
        return filePath;
      });

      await Promise.all(uploadPromises);

      // Set the entry file path as the app's file path
      const entryFilePath = `${user.id}/${appData.id}/${entryFile.path}`;
      const { error: updateError } = await supabase
        .from('hosted_apps')
        .update({ app_file_path: entryFilePath })
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

  // Get all published apps
  async getPublishedApps(limit = 50, offset = 0): Promise<HostedApp[]> {
    const { data, error } = await supabase
      .from('hosted_apps')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

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

    // Delete app record (will cascade delete files)
    const { error } = await supabase
      .from('hosted_apps')
      .delete()
      .eq('id', appId)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  // Publish/unpublish app
  async publishApp(appId: string, isPublished: boolean): Promise<HostedApp> {
    return this.updateApp(appId, { is_published: isPublished });
  },

  // Get signed URL for accessing app file
  async getAppFileUrl(filePath: string): Promise<string> {
    const { data } = supabase.storage
      .from('hosted-apps')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  // Increment view count
  async incrementViewCount(appId: string): Promise<void> {
    const { data } = await supabase
      .from('hosted_apps')
      .select('view_count')
      .eq('id', appId)
      .single();

    if (data) {
      await supabase
        .from('hosted_apps')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', appId);
    }
  },
};
