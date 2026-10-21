import { fireEvent, render, screen, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { HostedApp } from '@/types/app';
const state = vi.hoisted(() => ({ loggedIn: false, insert: vi.fn(), query: vi.fn() }));
vi.mock('@/contexts/AuthContext', () => ({ useAuth: () => ({ isLoggedIn: state.loggedIn }) }));
vi.mock('@/lib/supabase', () => ({ supabase: { from: () => ({ select: () => ({ eq: () => ({ order: () => ({ order: () => ({ limit: state.query }) }) }) }), insert: state.insert }) } }));
import { AppComments } from './AppComments';
const app = { id: 'app-1', name: '测试产品', publisher_name: '发布者', created_at: '2026-10-21T01:00:00Z' } as HostedApp;
afterEach(() => { cleanup(); vi.clearAllMocks(); state.loggedIn = false; });
function mount() { render(<MemoryRouter><AppComments app={app} /></MemoryRouter>); }
describe('产品评论', () => {
  it('默认收起，展开可读取他人评论，关闭后收起', async () => {
    state.query.mockResolvedValue({ data: [{ id: 'c1', content: '可以使用', author_name: '评论者', created_at: app.created_at }], error: null });
    mount();
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(state.query).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: '展开评论' }));
    expect(await screen.findByText('可以使用')).toBeInTheDocument();
    expect(screen.getByText('发布人：发布者')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '登录后评论' })).toHaveAttribute('href', '/login');
    fireEvent.click(screen.getByRole('button', { name: '收起评论' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });
  it('禁止空白评论，发送失败保留内容，重试后显示已保存评论', async () => {
    state.loggedIn = true;
    state.query.mockResolvedValue({ data: [], error: null });
    const single = vi.fn().mockResolvedValueOnce({ data: null, error: new Error('offline') }).mockResolvedValueOnce({ data: { id: 'c2', content: '实用', author_name: '我', created_at: app.created_at }, error: null });
    state.insert.mockReturnValue({ select: () => ({ single }) });
    mount();
    fireEvent.click(screen.getByRole('button', { name: '展开评论' }));
    await screen.findByText('暂无评论');
    const input = screen.getByLabelText('评论内容');
    fireEvent.change(input, { target: { value: '  ' } });
    expect(screen.getByRole('button', { name: '发表评论' })).toBeDisabled();
    fireEvent.change(input, { target: { value: ' 实用 ' } });
    fireEvent.click(screen.getByRole('button', { name: '发表评论' }));
    await screen.findByRole('alert');
    expect(input).toHaveValue(' 实用 ');
    fireEvent.click(screen.getByRole('button', { name: '发表评论' }));
    await waitFor(() => expect(input).toHaveValue(''));
    expect(screen.getByText('实用')).toBeInTheDocument();
    expect(state.insert).toHaveBeenLastCalledWith({ app_id: 'app-1', content: '实用' });
  });
});
