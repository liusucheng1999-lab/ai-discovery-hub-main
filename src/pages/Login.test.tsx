import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, expect, it, vi } from 'vitest';
const auth = vi.hoisted(() => ({ register: vi.fn(), login: vi.fn() }));
vi.mock('@/contexts/AuthContext', () => ({ useAuth: () => auth }));
import Login from './Login';
afterEach(() => { cleanup(); vi.clearAllMocks(); });
function mount(from?: { pathname: string; search?: string }) {
  render(<HelmetProvider><MemoryRouter initialEntries={[{ pathname: '/login', state: from ? { from } : undefined }]}><Routes><Route path="/login" element={<Login />} /><Route path="/profile" element={<div>个人资料目标页</div>} /><Route path="/published-apps" element={<div>社区目标页</div>} /></Routes></MemoryRouter></HelmetProvider>);
  fireEvent.mouseDown(screen.getByRole('tab', { name: '注册' }), { button: 0, ctrlKey: false });
}
function fill(password = 'Test7391', confirmation = password) {
  fireEvent.change(screen.getByLabelText('邮箱'), { target: { value: 'registration-check@example.com' } });
  fireEvent.change(screen.getByLabelText('密码', { exact: true }), { target: { value: password } });
  fireEvent.change(screen.getByLabelText('确认密码'), { target: { value: confirmation } });
}
it('空字段和邮箱格式由浏览器校验', () => {
  mount();
  expect(screen.getByLabelText('邮箱')).toBeInvalid();
  fireEvent.change(screen.getByLabelText('邮箱'), { target: { value: 'invalid-email' } });
  expect(screen.getByLabelText('邮箱')).toBeInvalid();
  expect(auth.register).not.toHaveBeenCalled();
});
it.each([['12345', '12345', '密码至少需要 6 位'], ['Test7391', 'Test7392', '两次输入的密码不一致']])('拦截密码错误 %s', async (password, confirmation, message) => {
  mount(); fill(password, confirmation);
  fireEvent.submit(screen.getByRole('button', { name: '注册' }).closest('form')!);
  expect(await screen.findByText(message)).toBeInTheDocument();
  expect(auth.register).not.toHaveBeenCalled();
});
it('注册中禁止重复点击，成功后回社区', async () => {
  let resolve!: (value: { success: boolean }) => void;
  auth.register.mockImplementation(() => new Promise(done => { resolve = done; }));
  mount(); fill();
  fireEvent.click(screen.getByRole('button', { name: '注册' }));
  expect(screen.getByRole('button', { name: '注册中...' })).toBeDisabled();
  resolve({ success: true });
  expect(await screen.findByText('社区目标页')).toBeInTheDocument();
});
it('从受保护页面进入注册，成功后回原页面', async () => {
  auth.register.mockResolvedValue({ success: true });
  mount({ pathname: '/profile' }); fill();
  fireEvent.click(screen.getByRole('button', { name: '注册' }));
  expect(await screen.findByText('个人资料目标页')).toBeInTheDocument();
});
it.each(['该邮箱已注册，请直接登录', '验证邮件发送过于频繁，请稍后再试', '注册请求超时，请检查网络后重试', '注册成功，请前往邮箱点击验证链接后再登录'])('显示服务返回结果并恢复操作：%s', async error => {
  auth.register.mockResolvedValue({ success: false, error });
  mount(); fill();
  fireEvent.click(screen.getByRole('button', { name: '注册' }));
  expect(await screen.findByText(error)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '注册' })).toBeEnabled();
  expect(screen.getByLabelText('邮箱')).toHaveValue('registration-check@example.com');
});
