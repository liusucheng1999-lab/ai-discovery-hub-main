import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { afterEach, expect, it, vi } from 'vitest';
const mock = vi.hoisted(() => ({ update: vi.fn(), upload: vi.fn(), remove: vi.fn(), user: { id: 'u1', user_metadata: { display_name: '原姓名', bio: '原简介' } } }));
vi.mock('@/contexts/AuthContext', () => ({ useAuth: () => ({ user: mock.user }) }));
vi.mock('@/lib/supabase', () => ({ supabase: { auth: { updateUser: mock.update }, storage: { from: () => ({ upload: mock.upload, remove: mock.remove, getPublicUrl: () => ({ data: { publicUrl: 'https://example.test/avatar.png' } }) }) } } }));
vi.mock('sonner', () => ({ toast: { success: vi.fn() } }));
import Profile from './Profile';
afterEach(() => { cleanup(); vi.clearAllMocks(); });
it('读取账号资料，保存姓名与简介，失败后保留编辑内容', async () => {
  mock.update.mockResolvedValueOnce({ error: new Error('offline') }).mockResolvedValueOnce({ error: null });
  render(<HelmetProvider><Profile /></HelmetProvider>);
  expect(screen.getByLabelText('姓名')).toHaveValue('原姓名');
  expect(screen.getByLabelText('简介')).toHaveValue('原简介');
  fireEvent.change(screen.getByLabelText('姓名'), { target: { value: ' 新姓名 ' } });
  fireEvent.change(screen.getByLabelText('简介'), { target: { value: '新简介' } });
  fireEvent.click(screen.getByRole('button', { name: '保存' }));
  await screen.findByRole('alert');
  expect(screen.getByLabelText('姓名')).toHaveValue(' 新姓名 ');
  fireEvent.click(screen.getByRole('button', { name: '保存' }));
  await waitFor(() => expect(mock.update).toHaveBeenCalledTimes(2));
  expect(mock.update).toHaveBeenLastCalledWith({ data: { display_name: '新姓名', bio: '新简介', avatar_url: null } });
});
it('拦截空白姓名和不支持的头像', async () => {
  render(<HelmetProvider><Profile /></HelmetProvider>);
  fireEvent.change(screen.getByLabelText('姓名'), { target: { value: '  ' } });
  expect(screen.getByRole('button', { name: '保存' })).toBeDisabled();
  fireEvent.change(screen.getByLabelText('上传头像'), { target: { files: [new File(['svg'], 'avatar.svg', { type: 'image/svg+xml' })] } });
  expect(await screen.findByRole('alert')).toHaveTextContent('2MB');
  expect(mock.upload).not.toHaveBeenCalled();
});

it('上传头像后保存真实地址，支持移除', async () => {
  vi.stubGlobal('URL', Object.assign(URL, { createObjectURL: vi.fn(() => 'blob:preview'), revokeObjectURL: vi.fn() }));
  mock.upload.mockResolvedValue({ error: null });
  mock.update.mockResolvedValue({ error: null });
  render(<HelmetProvider><Profile /></HelmetProvider>);
  fireEvent.change(screen.getByLabelText('上传头像'), { target: { files: [new File(['image'], 'avatar.png', { type: 'image/png' })] } });
  fireEvent.click(screen.getByRole('button', { name: '保存' }));
  await waitFor(() => expect(mock.update).toHaveBeenCalledWith({ data: { display_name: '原姓名', bio: '原简介', avatar_url: 'https://example.test/avatar.png' } }));
  await waitFor(() => expect(screen.getByRole('button', { name: '保存' })).toBeEnabled());
  fireEvent.click(screen.getByRole('button', { name: '移除' }));
  fireEvent.click(screen.getByRole('button', { name: '保存' }));
  await waitFor(() => expect(mock.update).toHaveBeenLastCalledWith({ data: { display_name: '原姓名', bio: '原简介', avatar_url: null } }));
});
