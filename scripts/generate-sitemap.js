import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// ES模块兼容
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载环境变量
dotenv.config({ path: path.join(__dirname, '../.env') });

// 从环境变量读取配置
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少Supabase配置信息');
  console.log('请检查 .env 文件中的 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY');
  console.log('当前环境变量:', {
    VITE_SUPABASE_URL: supabaseUrl ? '已设置' : '未设置',
    VITE_SUPABASE_ANON_KEY: supabaseKey ? '已设置' : '未设置'
  });
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateSitemap() {
  try {
    console.log('🔄 开始生成sitemap.xml...');

    // 获取所有分类
    const { data: categories, error: categoriesError } = await supabase
      .from('main_categories')
      .select('*')
      .order('sort_order');

    if (categoriesError) throw categoriesError;

    // 获取所有工具
    const { data: tools, error: toolsError } = await supabase
      .from('tools')
      .select('id,created_at,updated_at')
      .in('status', ['approved', 'active']);

    if (toolsError) throw toolsError;

    // 获取课程与课节
    const { data: courses, error: coursesError } = await supabase
      .from('course_settings')
      .select('id,updated_at');

    if (coursesError) throw coursesError;

    const { data: lessons, error: lessonsError } = await supabase
      .from('knowledge_lessons')
      .select('id,course_id,created_at,updated_at,status')
      .eq('status', 'published')
      .order('sort_order', { ascending: true });

    if (lessonsError) throw lessonsError;

    // 生成sitemap内容
    const baseUrl = 'https://aimakerbox.com';
    const currentDate = new Date().toISOString();

    // 静态页面
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: '/knowledge', priority: '0.9', changefreq: 'daily' },
      { url: '/ai-writing', priority: '0.9', changefreq: 'daily' },
      { url: '/ai-drawing', priority: '0.9', changefreq: 'daily' },
      { url: '/ai-office', priority: '0.9', changefreq: 'daily' },
      { url: '/ai-video', priority: '0.9', changefreq: 'daily' },
      { url: '/ai-code', priority: '0.9', changefreq: 'daily' }
    ];

    // 工具页面
    const toolPages = tools.map(tool => ({
      url: `/tool/${tool.id}`,
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: tool.updated_at || tool.created_at || currentDate
    }));

    const defaultCourseId = courses?.[0]?.id || '1';
    const coursePages = (courses || []).map((course) => ({
      url: `/knowledge/course/${course.id}`,
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: course.updated_at || currentDate,
    }));

    const lessonPages = (lessons || []).map((lesson) => ({
      url: `/knowledge/course/${lesson.course_id || defaultCourseId}/lesson/${lesson.id}`,
      priority: '0.7',
      changefreq: 'weekly',
      lastmod: lesson.updated_at || lesson.created_at || currentDate,
    }));

    // 组合所有页面
    const allPages = [...staticPages, ...coursePages, ...lessonPages, ...toolPages];

    // 生成XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : `<lastmod>${currentDate}</lastmod>`}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    // 写入文件
    const outputPath = path.join(__dirname, '../public/sitemap.xml');
    fs.writeFileSync(outputPath, xml);

    console.log(`✅ sitemap.xml 生成成功！`);
    console.log(`📁 输出文件: ${outputPath}`);
    console.log(`📊 总页面数: ${allPages.length}`);
    console.log(`🔧 工具页面: ${toolPages.length}`);
    console.log(`🎓 课程页面: ${coursePages.length}`);
    console.log(`📝 课节页面: ${lessonPages.length}`);
    console.log(`📁 静态页面: ${staticPages.length}`);

  } catch (error) {
    console.error('❌ 生成sitemap失败:', error);
    process.exit(1);
  }
}

// 执行生成
generateSitemap();
