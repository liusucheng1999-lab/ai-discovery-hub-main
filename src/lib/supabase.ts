import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY

// 检查环境变量是否正确加载
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase环境变量未正确配置！')
  throw new Error('Supabase配置错误')
}

// 普通客户端（用于读取操作）
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
})

// 管理员客户端（用于需要 service key 的操作）
// 注意：service key 不应该暴露在前端运行环境中，这里做兼容处理：没有配置时返回 null
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null
