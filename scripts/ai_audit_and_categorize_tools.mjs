import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'

function loadDotEnvIfNeeded() {
  try {
    const findEnvPath = () => {
      let dir = process.cwd()
      for (let i = 0; i < 5; i++) {
        const candidate = path.join(dir, '.env')
        if (fs.existsSync(candidate)) return candidate
        const parent = path.dirname(dir)
        if (!parent || parent === dir) break
        dir = parent
      }
      return null
    }

    const envPath = findEnvPath()
    if (!envPath) return

    const loadedKeys = []

    const content = fs.readFileSync(envPath, 'utf8')
    const lines = content.split(/\r?\n/)

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue

      const idx = trimmed.indexOf('=')
      if (idx === -1) continue

      const key = trimmed.slice(0, idx).trim()
      let value = trimmed.slice(idx + 1).trim()

      if (!key) continue
      if (process.env[key] != null && process.env[key] !== '') continue

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }

      process.env[key] = value
      loadedKeys.push(key)
    }

    globalThis.__DOTENV_PATH__ = envPath
    globalThis.__DOTENV_KEYS__ = loadedKeys
  } catch {
    // 忽略.env读取失败
  }
}

loadDotEnvIfNeeded()


const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_KEY

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || process.env.VITE_DEEPSEEK_API_KEY
const DEEPSEEK_BASE_URL =
  process.env.DEEPSEEK_BASE_URL || process.env.VITE_DEEPSEEK_BASE_URL || 'https://api.deepseek.com'

const TAVILY_API_KEY = process.env.TAVILY_API_KEY || process.env.VITE_TAVILY_API_KEY

function uniq(arr) {
  return Array.from(new Set(arr))
}

function getHost(url) {
  try {
    return new URL(url).hostname.toLowerCase()
  } catch {
    return ''
  }
}

function getPathDepth(url) {
  try {
    const p = new URL(url).pathname
    if (!p || p === '/') return 0
    return p.split('/').filter(Boolean).length
  } catch {
    return 99
  }
}

function stripTracking(url) {
  try {
    const u = new URL(url)
    const toDelete = []
    u.searchParams.forEach((_, k) => {
      const key = k.toLowerCase()
      if (
        key.startsWith('utm_') ||
        key === 'gclid' ||
        key === 'fbclid' ||
        key === 'srsltid'
      ) {
        toDelete.push(k)
      }
    })
    toDelete.forEach((k) => u.searchParams.delete(k))
    return u.toString()
  } catch {
    return url
  }
}

function isAggregatorHost(host) {
  const blocked = [
    'ai-bot.cn',
    'maxaibox.com',
    'juhe.ai',
    'aibase.com',
    'top.aibase.com',
    'mergeek.com',
    'ai-kit.cn',
    'pidoutv.com',
    'chinaz.com',
    'aitools.rdlab.tw'
  ]
  return blocked.includes(host)
}

function isSocialHost(host) {
  const socials = [
    'x.com',
    'twitter.com',
    'facebook.com',
    'www.facebook.com',
    'instagram.com',
    'www.instagram.com',
    'youtube.com',
    'www.youtube.com',
    'linkedin.com',
    'www.linkedin.com'
  ]
  return socials.includes(host)
}

function normalizeForMatch(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

function isLikelyOfficialUrl(url, tool) {
  const host = getHost(url)
  if (!host) return false
  if (isSocialHost(host)) return false
  if (isAggregatorHost(host)) return false

  // 尽量避免博客/文章页作为官网
  const depth = getPathDepth(url)
  if (depth >= 4) return false

  // 工具名与域名相关性
  const nameKey = normalizeForMatch(tool?.name)
  const hostKey = normalizeForMatch(host.replace(/^www\./, ''))
  if (nameKey && nameKey.length > 4 && hostKey.includes(nameKey.slice(0, Math.min(8, nameKey.length)))) {
    return true
  }

  // 与原始域名相同/相近也认为更像官网
  const originalHost = getHost(normalizeUrl(tool?.website_url || '') || '')
  if (originalHost && (host === originalHost || host === originalHost.replace(/^www\./, '') || host.replace(/^www\./, '') === originalHost)) {
    return true
  }

  // 常见大厂域名（从描述里猜）
  const text = `${tool?.name || ''} ${tool?.tagline || ''} ${tool?.description || ''}`.toLowerCase()
  if (text.includes('openai') && host.endsWith('openai.com')) return true
  if (text.includes('microsoft') && host.endsWith('microsoft.com')) return true
  if (text.includes('google') && host.endsWith('google.com')) return true

  // GitHub：只接受仓库/组织首页（深度<=2）
  if (host === 'github.com' && depth <= 2) return true

  return false
}

function isHighConfidenceOfficialCandidate(url, tool) {
  const host = getHost(url)
  if (!host) return false
  if (isSocialHost(host) || isAggregatorHost(host)) return false

  const depth = getPathDepth(url)
  if (depth > 2) return false

  const originalHost = getHost(normalizeUrl(tool?.website_url || '') || '')
  if (originalHost && (host === originalHost || host.replace(/^www\./, '') === originalHost.replace(/^www\./, ''))) {
    return true
  }

  const nameKey = normalizeForMatch(tool?.name)
  const hostKey = normalizeForMatch(host.replace(/^www\./, ''))
  if (nameKey && nameKey.length > 6 && hostKey.includes(nameKey.slice(0, Math.min(10, nameKey.length)))) {
    return true
  }

  const text = `${tool?.name || ''} ${tool?.tagline || ''} ${tool?.description || ''}`.toLowerCase()
  if (text.includes('openai') && host.endsWith('openai.com')) return true
  if (text.includes('microsoft') && host.endsWith('microsoft.com')) return true
  if (text.includes('google') && host.endsWith('google.com')) return true

  return false
}

async function tavilySearchOfficialWebsites(tool) {
  if (!TAVILY_API_KEY) {
    return { candidates: [], reasoning: '未配置TAVILY_API_KEY，跳过联网搜索' }
  }

  const queries = uniq([
    `${tool.name} official website`,
    `${tool.name} 官网`,
    `${tool.name} AI tool official site`
  ])

  const allUrls = []
  const meta = []

  for (const q of queries) {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query: q,
        search_depth: 'basic',
        max_results: 5,
        include_answer: false,
        include_images: false
      })
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      meta.push({ query: q, ok: false, status: res.status, error: text.slice(0, 200) })
      continue
    }

    const data = await res.json().catch(() => null)
    const results = Array.isArray(data?.results) ? data.results : []
    meta.push({ query: q, ok: true, count: results.length })

    for (const r of results) {
      if (r?.url) allUrls.push(String(r.url))
    }
  }

  const candidates = uniq(allUrls)
    .map((u) => normalizeUrl(u))
    .filter((u) => !!u)
    .map((u) => stripTracking(u))
    // 过滤掉明显的搜索/追踪链接
    .filter((u) => {
      try {
        const host = new URL(u).hostname.toLowerCase()
        return !['google.com', 'www.google.com', 'bing.com', 'www.bing.com', 'duckduckgo.com'].includes(host)
      } catch {
        return false
      }
    })

  const officialCandidates = candidates
    .filter((u) => isLikelyOfficialUrl(u, tool))
    .sort((a, b) => getPathDepth(a) - getPathDepth(b))
    .slice(0, 5)

  const otherCandidates = candidates
    .filter((u) => !officialCandidates.includes(u))
    .slice(0, 5)

  return {
    candidates: officialCandidates,
    other_candidates: otherCandidates,
    reasoning: officialCandidates.length
      ? 'Tavily联网搜索返回疑似官网候选URL'
      : (candidates.length ? 'Tavily联网搜索有结果但未命中疑似官网（已降级）' : 'Tavily联网搜索未返回候选URL'),
    meta
  }
}

const DEBUG_ENV = process.env.DEBUG_ENV === '1'

if (DEBUG_ENV) {
  if (globalThis.__DOTENV_PATH__) {
    console.log('[ENV] .env path:', globalThis.__DOTENV_PATH__)
    console.log('[ENV] .env loaded keys count:', Array.isArray(globalThis.__DOTENV_KEYS__) ? globalThis.__DOTENV_KEYS__.length : 0)
    console.log('[ENV] .env has TAVILY_API_KEY:', Array.isArray(globalThis.__DOTENV_KEYS__) ? globalThis.__DOTENV_KEYS__.includes('TAVILY_API_KEY') : false)
  } else {
    console.log('[ENV] .env path: (not found)')
  }
  console.log('[ENV] SUPABASE_URL exists:', !!SUPABASE_URL)
  console.log('[ENV] SUPABASE_SERVICE_ROLE_KEY exists:', !!SUPABASE_SERVICE_ROLE_KEY)
  console.log('[ENV] DEEPSEEK_API_KEY exists:', !!DEEPSEEK_API_KEY)
  console.log('[ENV] DEEPSEEK_BASE_URL:', DEEPSEEK_BASE_URL)
  console.log('[ENV] TAVILY_API_KEY exists:', !!TAVILY_API_KEY)
}

const DRY_RUN = process.env.DRY_RUN === '1'
const LIMIT = Number(process.env.LIMIT || '0')
const CONCURRENCY = Math.max(1, Math.min(10, Number(process.env.CONCURRENCY || '3')))

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    '缺少环境变量：SUPABASE_URL、SUPABASE_SERVICE_ROLE_KEY（或在.env中提供 VITE_SUPABASE_URL、VITE_SUPABASE_SERVICE_KEY）。请确认你在项目根目录运行，或脚本能向上找到.env。'
  )
}

async function deepseekFindOfficialWebsites(tool, failedUrl, failedReason) {
  const systemPrompt = `你是AI工具导航站的资深编辑。现在需要你在“无法联网浏览”的前提下，基于你已有知识与常识，为一个AI工具给出可能的“官方/主站”网址候选。

要求：
- 必须输出 JSON，且只输出 JSON
- 字段：candidates（数组，最多3个URL字符串），reasoning（中文）
- candidates 必须是完整URL（带 https://），不要给搜索链接，不要给社交媒体页面（除非你认为官方只在社交平台运营且没有官网）
- 如果你认为该产品已下架/并不存在可靠官网，请返回 candidates: [] 并解释原因
`

  const userPrompt = `工具信息：
- id: ${tool.id}
- name: ${tool.name}
- tagline: ${tool.tagline || ''}
- description: ${tool.description || ''}
- tags: ${(tool.tags || []).join(', ')}

当前记录的网址访问失败：
- failed_url: ${failedUrl || ''}
- reason: ${failedReason || ''}

请返回可能的官方网址候选。`

  const res = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      temperature: 0.2,
      max_tokens: 600,
      stream: false,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    })
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`DeepSeek API错误(找官网): ${res.status} ${res.statusText} ${text}`.trim())
  }

  const data = await res.json()
  const content = data?.choices?.[0]?.message?.content
  const parsed = safeJsonParse(content)

  const candidates = Array.isArray(parsed?.candidates) ? parsed.candidates : []
  const cleaned = candidates
    .map((u) => normalizeUrl(u))
    .filter((u) => !!u)
    .slice(0, 3)

  return {
    candidates: cleaned,
    reasoning: String(parsed?.reasoning || '')
  }
}

if (!DEEPSEEK_API_KEY) {
  throw new Error('缺少环境变量：DEEPSEEK_API_KEY')
}

async function deepseekDirectAskOfficialWebsite({ name, tagline, description, failedUrl }) {
  const systemPrompt = `你是AI工具导航站的资深编辑。你无法联网浏览，请基于常识与已知信息回答，但不要编造。

要求：
- 必须输出 JSON，且只输出 JSON
- 字段：candidates（数组，最多3个URL字符串）、reasoning（中文）、confidence（0到1的小数）
- candidates 必须是完整URL（带 https://）
- 如果不确定，请降低confidence，且可以返回 candidates: []
`

  const userPrompt = `工具信息：
- name: ${name}
- tagline: ${tagline || ''}
- description: ${description || ''}

当前记录的网址可能不正确或访问失败：
- failed_url: ${failedUrl || ''}

请给出你认为最可能的官方/主站网址候选。`

  const res = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      temperature: 0.2,
      max_tokens: 500,
      stream: false,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    })
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`DeepSeek API错误(直接问官网): ${res.status} ${res.statusText} ${text}`.trim())
  }

  const data = await res.json()
  const content = data?.choices?.[0]?.message?.content
  const parsed = safeJsonParse(content)

  const candidates = Array.isArray(parsed?.candidates) ? parsed.candidates : []
  const cleaned = candidates
    .map((u) => normalizeUrl(u))
    .filter((u) => !!u)
    .slice(0, 3)

  const confidenceNum = Number(parsed?.confidence)

  return {
    candidates: cleaned,
    reasoning: String(parsed?.reasoning || ''),
    confidence: Number.isFinite(confidenceNum) ? confidenceNum : null
  }
}

const EXPERIMENT_OFFICIAL_URL = process.env.EXPERIMENT_OFFICIAL_URL === '1'
if (EXPERIMENT_OFFICIAL_URL) {
  const name = process.env.EXPERIMENT_TOOL_NAME || '刺鸟配音'
  const tagline = process.env.EXPERIMENT_TOOL_TAGLINE || '一款有情绪的配音神器'
  const description = process.env.EXPERIMENT_TOOL_DESCRIPTION || '支持在线配音、下载APP等'
  const failedUrl = process.env.EXPERIMENT_FAILED_URL || 'https://ciniao.ai'

  const result = await deepseekDirectAskOfficialWebsite({ name, tagline, description, failedUrl })
  console.log(JSON.stringify({ name, failedUrl, ...result }, null, 2))
  process.exit(0)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

function nowIso() {
  return new Date().toISOString()
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function safeJsonParse(text) {
  const trimmed = String(text || '').trim()
  const jsonBlock = trimmed.match(/\{[\s\S]*\}/)
  if (!jsonBlock) throw new Error('未找到JSON对象')
  return JSON.parse(jsonBlock[0])
}

function normalizeUrl(url) {
  if (!url) return null
  let u = String(url).trim()
  if (!u) return null
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`
  try {
    const parsed = new URL(u)
    parsed.hash = ''
    return parsed.toString()
  } catch {
    return null
  }
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { ...options, signal: controller.signal, redirect: 'follow' })
    return res
  } finally {
    clearTimeout(timer)
  }
}

async function checkWebsite(url) {
  const normalized = normalizeUrl(url)
  if (!normalized) {
    return {
      ok: false,
      normalized: null,
      finalUrl: null,
      status: null,
      reason: 'URL格式非法',
      failureType: 'invalid_url'
    }
  }

  // 优先HEAD，很多站点不支持则fallback到GET
  try {
    let res = await fetchWithTimeout(normalized, { method: 'HEAD' }, 12000)
    if (res.status === 405 || res.status === 403) {
      res = await fetchWithTimeout(normalized, { method: 'GET' }, 12000)
    }

    const finalUrl = res.url || normalized

    if (res.ok) {
      return {
        ok: true,
        normalized,
        finalUrl,
        status: res.status,
        reason: null,
        failureType: null
      }
    }

    return {
      ok: false,
      normalized,
      finalUrl,
      status: res.status,
      reason: `HTTP状态异常: ${res.status}`,
      failureType: 'http_error'
    }
  } catch (e) {
    return {
      ok: false,
      normalized,
      finalUrl: null,
      status: null,
      reason: `请求失败: ${e?.name || 'Error'} ${e?.message || ''}`.trim(),
      failureType: 'network_error'
    }
  }
}

function shouldSoftDown(check) {
  if (!check || check.ok) return false
  if (check.failureType === 'invalid_url') return true
  if (check.failureType === 'http_error') {
    // 只有明确“资源不存在/下架/法律限制”等才下架
    return [404, 410, 451].includes(Number(check.status))
  }
  // network_error: 视为无法验证，不下架
  return false
}

const CATEGORY_SCHEMA = {
  chat: ['chat_general', 'chat_professional', 'chat_companion', 'chat_multimodal'],
  writing: ['writing_marketing', 'writing_academic', 'writing_business', 'writing_translation'],
  image: ['image_generation', 'image_design', 'image_editing', 'image_recognition'],
  video: ['video_generation', 'video_editing', 'video_enhancement'],
  audio: ['audio_synthesis', 'audio_composition', 'audio_transcription'],
  coding: ['coding_generation', 'coding_documentation', 'coding_testing'],
  search: ['search_smart', 'search_academic', 'search_research'],
  office: ['office_document', 'office_data', 'office_presentation', 'office_meeting'],
  ai_agent: ['ai_platform', 'ai_plugins', 'ai_other'],
  tools: ['tools_model', 'tools_prompt', 'tools_framework', 'tools_detection']
}

function isValidCategory(main, sub) {
  if (!main || !CATEGORY_SCHEMA[main]) return false
  if (!sub || !CATEGORY_SCHEMA[main].includes(sub)) return false
  return true
}

async function deepseekClassifyTool(tool) {
  const systemPrompt = `你是AI工具导航站的资深编辑。现在需要你基于工具信息做“语义理解”的分类（不要基于单纯关键词机械匹配），输出严格JSON。

分类体系：
主分类 main_category 只能是以下ID之一：
${Object.keys(CATEGORY_SCHEMA).map((k) => `- ${k}`).join('\n')}

子分类 sub_category 只能从对应主分类的子分类ID中选择：
${Object.entries(CATEGORY_SCHEMA)
  .map(([k, v]) => `- ${k}: ${v.join(', ')}`)
  .join('\n')}

要求：
- 必须输出 JSON，且只输出 JSON
- 字段：main_category, sub_category, confidence(0-1), reasoning(中文)
- confidence 为你对该分类正确性的主观把握
- main_category/sub_category 必须是上面给定ID
`

  const userPrompt = `工具信息：
- id: ${tool.id}
- name: ${tool.name}
- tagline: ${tool.tagline || ''}
- description: ${tool.description || ''}
- tags: ${(tool.tags || []).join(', ')}
- website_url: ${tool.website_url || ''}
- old_category: ${tool.category || ''}

请返回分类JSON。`

  const res = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      temperature: 0.2,
      max_tokens: 800,
      stream: false,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    })
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`DeepSeek API错误: ${res.status} ${res.statusText} ${text}`.trim())
  }

  const data = await res.json()
  const content = data?.choices?.[0]?.message?.content
  const parsed = safeJsonParse(content)

  const main = parsed?.main_category
  const sub = parsed?.sub_category

  if (!isValidCategory(main, sub)) {
    throw new Error(`AI返回分类不合法: main=${main}, sub=${sub}`)
  }

  return {
    main_category: main,
    sub_category: sub,
    confidence: Number(parsed?.confidence ?? 0),
    reasoning: String(parsed?.reasoning || '')
  }
}

async function loadTools() {
  // 只处理线上展示的工具
  const statuses = ['approved', 'active']

  const { data, error } = await supabase
    .from('tools')
    .select('id,name,tagline,description,tags,website_url,category,status,main_category,sub_category,note,ai_review_notes,updated_at')
    .in('status', statuses)
    .order('view_count', { ascending: false })

  if (error) throw error

  let tools = data || []
  if (LIMIT > 0) tools = tools.slice(0, LIMIT)
  return tools
}

function createLimiter(concurrency) {
  let active = 0
  const queue = []

  const next = () => {
    if (active >= concurrency) return
    const job = queue.shift()
    if (!job) return
    active++
    job()
  }

  return (fn) =>
    new Promise((resolve, reject) => {
      queue.push(async () => {
        try {
          resolve(await fn())
        } catch (e) {
          reject(e)
        } finally {
          active--
          next()
        }
      })
      next()
    })
}

async function updateTool(id, patch) {
  if (DRY_RUN) return { dryRun: true }
  const { error } = await supabase.from('tools').update(patch).eq('id', id)
  if (error) throw error
  return { ok: true }
}

async function main() {
  const startedAt = nowIso()
  const outDir = path.join(process.cwd(), 'scripts', 'outputs')
  fs.mkdirSync(outDir, { recursive: true })

  const outFile = path.join(outDir, `ai_audit_${startedAt.replace(/[:.]/g, '-')}.jsonl`)
  const out = fs.createWriteStream(outFile, { flags: 'a' })

  const tools = await loadTools()
  console.log(`待处理工具数: ${tools.length}（DRY_RUN=${DRY_RUN ? '是' : '否'}，CONCURRENCY=${CONCURRENCY}）`)

  const limit = createLimiter(CONCURRENCY)

  let fixedUrlCount = 0
  let downCount = 0
  let categorizedCount = 0
  let errorCount = 0

  await Promise.all(
    tools.map((tool) =>
      limit(async () => {
        const record = {
          tool_id: tool.id,
          name: tool.name,
          before: {
            website_url: tool.website_url,
            status: tool.status,
            main_category: tool.main_category,
            sub_category: tool.sub_category
          },
          after: {},
          steps: [],
          ts: nowIso()
        }

        try {
          // 1) URL巡检
          const websiteCheck = await checkWebsite(tool.website_url)
          record.steps.push({ type: 'url_check', ...websiteCheck })

          if (!websiteCheck.ok) {
            // 1.1) 访问失败：优先Tavily联网搜索官网候选，再兜底DeepSeek猜测
            const tavily = await tavilySearchOfficialWebsites(tool)
            record.steps.push({ type: 'tavily_search', ...tavily })

            const combinedCandidates = [...(tavily.candidates || [])]
            if (combinedCandidates.length < 3) {
              const aiWeb = await deepseekFindOfficialWebsites(tool, tool.website_url, websiteCheck.reason)
              record.steps.push({ type: 'ai_find_website', ...aiWeb })
              combinedCandidates.push(...(aiWeb.candidates || []))
            }

            const finalCandidates = uniq(combinedCandidates).slice(0, 8)

            let recoveredUrl = null
            for (const candidate of finalCandidates) {
              const candidateCheck = await checkWebsite(candidate)
              record.steps.push({ type: 'candidate_url_check', candidate, ...candidateCheck })
              if (candidateCheck.ok) {
                recoveredUrl = candidateCheck.finalUrl || candidateCheck.normalized || candidate
                break
              }
            }

            if (!recoveredUrl) {
              // 仍失败：只有在明确可判定下架时才软下架，否则标记“无法验证”
              if (shouldSoftDown(websiteCheck)) {
                const reason = `自动巡检：官网不可访问且可判定下架（${websiteCheck.reason}）`
                const patch = {
                  status: 'rejected',
                  ai_review_notes: reason,
                  updated_at: nowIso()
                }

                await updateTool(tool.id, patch)
                record.after.status = 'rejected'
                record.after.ai_review_notes = reason
                downCount++
              } else {
                const reason = `自动巡检：官网访问失败但无法验证是否下架（${websiteCheck.reason}），AI候选也未找到可访问站点；已跳过下架。`
                const patch = {
                  ai_review_notes: reason,
                  updated_at: nowIso()
                }
                await updateTool(tool.id, patch)
                record.after.ai_review_notes = reason
              }

              out.write(JSON.stringify(record) + '\n')
              return
            }

            // 找到可用URL：仅在高置信度情况下才更新为官网，避免误改
            if (isHighConfidenceOfficialCandidate(recoveredUrl, tool)) {
              await updateTool(tool.id, { website_url: recoveredUrl, updated_at: nowIso() })
              record.after.website_url = recoveredUrl
              fixedUrlCount++
            } else {
              record.steps.push({
                type: 'website_update_skipped',
                recoveredUrl,
                reason: '候选可访问但低置信度，跳过自动更新website_url，仅记录候选'
              })
              const note = `自动巡检：发现可访问候选URL但疑似非官网，已跳过自动更新（candidate=${recoveredUrl}）`
              await updateTool(tool.id, { ai_review_notes: note, updated_at: nowIso() })
              record.after.ai_review_notes = note
            }

            // 继续分类流程（使用原website_url，避免被低置信度候选影响）
            const cls = await deepseekClassifyTool(tool)

            const patch = {
              main_category: cls.main_category,
              sub_category: cls.sub_category,
              updated_at: nowIso(),
              ai_review_notes: `自动分类：confidence=${cls.confidence}; ${cls.reasoning}`
            }
            await updateTool(tool.id, patch)

            record.after.main_category = cls.main_category
            record.after.sub_category = cls.sub_category
            record.after.ai_review_notes = patch.ai_review_notes
            categorizedCount++

            out.write(JSON.stringify(record) + '\n')
            await sleep(200)
            return
          }

          // 2) URL纠正（仅当最终URL不同）
          const finalUrl = websiteCheck.finalUrl || websiteCheck.normalized
          if (finalUrl && tool.website_url && normalizeUrl(tool.website_url) !== normalizeUrl(finalUrl)) {
            await updateTool(tool.id, { website_url: finalUrl, updated_at: nowIso() })
            record.after.website_url = finalUrl
            fixedUrlCount++
          }

          // 3) AI语义分类
          const cls = await deepseekClassifyTool({
            ...tool,
            website_url: finalUrl || tool.website_url
          })

          const patch = {
            main_category: cls.main_category,
            sub_category: cls.sub_category,
            updated_at: nowIso(),
            ai_review_notes: `自动分类：confidence=${cls.confidence}; ${cls.reasoning}`
          }
          await updateTool(tool.id, patch)

          record.after.main_category = cls.main_category
          record.after.sub_category = cls.sub_category
          record.after.ai_review_notes = patch.ai_review_notes
          categorizedCount++

          out.write(JSON.stringify(record) + '\n')

          // 轻微延迟降低触发限流风险
          await sleep(200)
        } catch (e) {
          errorCount++
          record.steps.push({ type: 'error', message: String(e?.message || e) })
          out.write(JSON.stringify(record) + '\n')
        }
      })
    )
  )

  out.end()

  console.log('处理完成')
  console.log(`- URL纠正数量: ${fixedUrlCount}`)
  console.log(`- 软下架数量: ${downCount}`)
  console.log(`- 分类回写数量: ${categorizedCount}`)
  console.log(`- 错误数量: ${errorCount}`)
  console.log(`- 结果日志: ${outFile}`)
}

main().catch((e) => {
  console.error('脚本执行失败:', e)
  process.exit(1)
})
