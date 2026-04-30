/**
 * 批量下载工具图标并上传到 Supabase Storage
 * 
 * 使用方式：
 *   node scripts/upload-tool-icons.mjs
 * 
 * 功能：
 *   1. 从 Supabase tools 表读取所有工具的 website_url
 *   2. 通过 DuckDuckGo / Google Favicon 服务下载图标
 *   3. 上传到 Supabase Storage 的 tool-icons bucket
 *   4. 更新 tools 表的 logo_url 字段为 Storage 公开 URL
 * 
 * 前置条件：
 *   - 需要在 Supabase 中创建名为 "tool-icons" 的公开 Storage bucket
 *   - .env 中需要配置 VITE_SUPABASE_URL 和 VITE_SUPABASE_SERVICE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// 加载环境变量
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env');
const envContent = readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim();
    process.env[key] = value;
  }
});

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.VITE_SUPABASE_SERVICE_KEY;
const BUCKET_NAME = 'tool-icons';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ 缺少环境变量 VITE_SUPABASE_URL 或 VITE_SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * 从 URL 提取域名
 */
function extractDomain(url) {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '');
    return hostname;
  } catch {
    return null;
  }
}

/**
 * 生成图标候选下载 URL（按优先级）
 * 注意：DuckDuckGo 和 Google Favicon 在国内网络不可用，改用 icon.horse 和 favicon.im
 */
function getIconDownloadUrls(domain) {
  return [
    `https://icon.horse/icon/${domain}`,
    `https://favicon.im/${domain}`,
  ];
}

/**
 * 下载图标，返回 Buffer 或 null
 */
async function downloadIcon(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    
    const res = await fetch(url, { 
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
    });
    clearTimeout(timeout);
    
    if (!res.ok) return null;
    
    const contentType = res.headers.get('content-type') || '';
    // 接受常见图标格式（包括 image/vnd.microsoft.icon）
    if (!contentType.match(/image|icon|octet-stream/)) return null;
    // 排除 HTML 响应（某些服务 404 返回 HTML）
    if (contentType.includes('text/html')) return null;
    
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // 过滤太小的文件（可能是空图标）
    if (buffer.length < 100) return null;
    
    return buffer;
  } catch {
    return null;
  }
}

/**
 * 确定文件扩展名
 */
function getExtension(buffer, url) {
  // 根据魔数判断格式
  if (buffer[0] === 0x89 && buffer[1] === 0x50) return '.png';
  if (buffer[0] === 0x47 && buffer[1] === 0x49) return '.gif';
  if (buffer[0] === 0xFF && buffer[1] === 0xD8) return '.jpg';
  if (buffer[0] === 0x00 && buffer[1] === 0x00 && buffer[2] === 0x01) return '.ico';
  if (buffer[0] === 0x00 && buffer[1] === 0x00 && buffer[2] === 0x02) return '.cur';
  // 从 URL 推断
  if (url.includes('.png')) return '.png';
  if (url.includes('.gif')) return '.gif';
  if (url.includes('.jpg') || url.includes('.jpeg')) return '.jpg';
  // 默认 ico
  return '.ico';
}

/**
 * 上传图标到 Supabase Storage
 */
async function uploadToStorage(domain, buffer, ext) {
  const filePath = `${domain}${ext}`;
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, buffer, {
      contentType: ext === '.png' ? 'image/png' : 
                   ext === '.gif' ? 'image/gif' : 
                   ext === '.jpg' ? 'image/jpeg' : 'image/x-icon',
      upsert: true, // 覆盖已有文件
    });
  
  if (error) {
    // 如果是文件已存在，尝试更新
    if (error.message?.includes('already exists')) {
      const { error: updateError } = await supabase.storage
        .from(BUCKET_NAME)
        .update(filePath, buffer, {
          contentType: ext === '.png' ? 'image/png' : 
                       ext === '.gif' ? 'image/gif' : 
                       ext === '.jpg' ? 'image/jpeg' : 'image/x-icon',
        });
      if (updateError) {
        console.error(`  ⚠️ 上传更新失败 ${domain}:`, updateError.message);
        return null;
      }
    } else {
      console.error(`  ⚠️ 上传失败 ${domain}:`, error.message);
      return null;
    }
  }
  
  // 获取公开 URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);
  
  return urlData?.publicUrl || null;
}

/**
 * 更新 tools 表的 logo_url
 */
async function updateLogoUrl(toolId, logoUrl) {
  const { error } = await supabase
    .from('tools')
    .update({ logo_url: logoUrl })
    .eq('id', toolId);
  
  if (error) {
    console.error(`  ⚠️ 更新数据库失败 (id=${toolId}):`, error.message);
    return false;
  }
  return true;
}

/**
 * 主流程
 */
async function main() {
  console.log('🚀 开始批量处理工具图标...\n');
  
  // 1. 确保 bucket 存在
  console.log('📦 检查 Storage bucket...');
  let { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  
  if (bucketError) {
    console.error('❌ 获取 bucket 列表失败:', bucketError.message);
    process.exit(1);
  }
  
  const bucketExists = buckets?.some(b => b.name === BUCKET_NAME);
  if (!bucketExists) {
    console.log(`  创建 bucket: ${BUCKET_NAME}...`);
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true, // 公开访问，不需要签名
      fileSizeLimit: 524288, // 512KB
      allowedMimeTypes: ['image/png', 'image/gif', 'image/jpeg', 'image/x-icon', 'image/vnd.microsoft.icon', 'image/svg+xml', 'application/octet-stream']
    });
    if (createError) {
      console.error('❌ 创建 bucket 失败:', createError.message);
      console.log('  请手动在 Supabase Dashboard 中创建名为 "tool-icons" 的公开 bucket');
      process.exit(1);
    }
    console.log('  ✅ bucket 创建成功');
  } else {
    console.log('  ✅ bucket 已存在');
  }
  
  // 2. 确保 logo_url 列存在
  console.log('\n📋 检查 logo_url 列...');
  {
    // 先尝试查询 logo_url 列，如果不存在则通过 REST API 添加
    const { error: testError } = await supabase
      .from('tools')
      .select('logo_url')
      .limit(1);
    
    if (testError && testError.message?.includes('does not exist')) {
      console.log('  logo_url 列不存在，尝试添加...');
      // 使用 service key 通过 REST API 执行 SQL
      const restUrl = `${SUPABASE_URL}/rest/v1/rpc/exec_sql`;
      const sqlRes = await fetch(restUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
        body: JSON.stringify({ query: 'ALTER TABLE tools ADD COLUMN IF NOT EXISTS logo_url TEXT;' }),
      });
      
      if (!sqlRes.ok) {
        // rpc 可能不存在，提示用户手动执行
        console.error('❌ 无法自动添加 logo_url 列');
        console.log('\n  请在 Supabase SQL 编辑器中执行以下 SQL：');
        console.log('  ────────────────────────────────────────');
        console.log('  ALTER TABLE tools ADD COLUMN IF NOT EXISTS logo_url TEXT;');
        console.log('  ────────────────────────────────────────');
        console.log('  执行完成后重新运行此脚本。\n');
        process.exit(1);
      }
      console.log('  ✅ logo_url 列添加成功');
    } else {
      console.log('  ✅ logo_url 列已存在');
    }
  }
  
  // 3. 获取所有工具
  console.log('\n📋 获取工具列表...');
  const allTools = [];
  let from = 0;
  const pageSize = 1000;
  
  while (true) {
    const { data, error } = await supabase
      .from('tools')
      .select('id, name, website_url, logo_url')
      .in('status', ['active', 'approved'])
      .order('view_count', { ascending: false })
      .range(from, from + pageSize - 1);
    
    if (error) {
      console.error('❌ 获取工具列表失败:', error.message);
      process.exit(1);
    }
    if (!data?.length) break;
    allTools.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  
  console.log(`  找到 ${allTools.length} 个工具\n`);
  
  // 3. 逐个处理
  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < allTools.length; i++) {
    const tool = allTools[i];
    const domain = extractDomain(tool.website_url);
    
    if (!domain) {
      console.log(`[${i + 1}/${allTools.length}] ⏭️ ${tool.name} - 无效URL`);
      skipCount++;
      continue;
    }
    
    // 如果 logo_url 已经指向 Supabase Storage，跳过
    if (tool.logo_url && tool.logo_url.includes(SUPABASE_URL) && tool.logo_url.includes(BUCKET_NAME)) {
      console.log(`[${i + 1}/${allTools.length}] ⏭️ ${tool.name} - 已有Storage图标`);
      skipCount++;
      continue;
    }
    
    // 下载图标
    let iconBuffer = null;
    let usedUrl = '';
    const downloadUrls = getIconDownloadUrls(domain);
    
    for (const url of downloadUrls) {
      iconBuffer = await downloadIcon(url);
      if (iconBuffer) {
        usedUrl = url;
        break;
      }
    }
    
    if (!iconBuffer) {
      console.log(`[${i + 1}/${allTools.length}] ❌ ${tool.name} (${domain}) - 下载失败`);
      failCount++;
      continue;
    }
    
    // 上传到 Storage
    const ext = getExtension(iconBuffer, usedUrl);
    const storageUrl = await uploadToStorage(domain, iconBuffer, ext);
    
    if (!storageUrl) {
      failCount++;
      continue;
    }
    
    // 更新数据库
    const updated = await updateLogoUrl(tool.id, storageUrl);
    if (updated) {
      console.log(`[${i + 1}/${allTools.length}] ✅ ${tool.name} (${domain}${ext}) - ${Math.round(iconBuffer.length / 1024)}KB`);
      successCount++;
    } else {
      failCount++;
    }
    
    // 限速：避免请求过快
    await new Promise(r => setTimeout(r, 300));
  }
  
  console.log('\n========================================');
  console.log(`📊 处理完成！`);
  console.log(`  ✅ 成功: ${successCount}`);
  console.log(`  ⏭️ 跳过: ${skipCount}`);
  console.log(`  ❌ 失败: ${failCount}`);
  console.log(`  📦 总计: ${allTools.length}`);
  console.log('========================================');
}

main().catch(err => {
  console.error('💥 脚本执行出错:', err);
  process.exit(1);
});
