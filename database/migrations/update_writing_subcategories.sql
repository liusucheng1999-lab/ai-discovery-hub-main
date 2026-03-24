-- 更新写作分类的二级分类系统
-- 根据用户需求重新定义写作分类下的5个二级分类

-- 1. 更新现有的写作分类子分类
UPDATE sub_categories 
SET name = '通用写作', 
    description = '通用文本生成、创意写作、内容创作工具'
WHERE id = 'writing_business' AND main_category_id = 'writing';

UPDATE sub_categories 
SET name = '营销文案', 
    description = '广告语、营销文案、产品描述、推广内容'
WHERE id = 'writing_marketing' AND main_category_id = 'writing';

UPDATE sub_categories 
SET name = '论文创作', 
    description = '学术论文、研究论文、文献综述、学术写作'
WHERE id = 'writing_academic' AND main_category_id = 'writing';

-- 2. 删除不需要的子分类
DELETE FROM sub_categories 
WHERE main_category_id = 'writing' AND id = 'writing_translation';

-- 3. 添加新的子分类
INSERT INTO sub_categories (id, name, main_category_id, description, sort_order) VALUES
('writing_general', '通用写作', 'writing', '通用文本生成、创意写作、内容创作工具', 1),
('writing_marketing', '营销文案', 'writing', '广告语、营销文案、产品描述、推广内容', 2),
('writing_academic', '论文创作', 'writing', '学术论文、研究论文、文献综述、学术写作', 3),
('writing_novel', '小说创作', 'writing', '小说创作、故事编写、创意文学写作', 4),
('writing_english', '英文润色', 'writing', '英文语法校对、润色、翻译、风格优化', 5)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  main_category_id = EXCLUDED.main_category_id,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order;

-- 4. 更新工具的分类归属
-- 通用写作类工具
UPDATE tools 
SET main_category = 'writing', 
    sub_category = 'writing_general'
WHERE name IN (
    'TextCortex', 'Jasper', 'Copy.ai', 'Writesonic', 'Rytr', 
    '秘塔写作猫', '讯飞写作', '火龙果写作', '文涌 Effidit', '晓语台', 
    '橙篇', 'Magic Write', 'Cohesive', '悟智写作', '树熊写作', '奇妙文', 
    '万彩 AI', '小鱼 AI 写作', '松果 AI 写作', '库宝 AI 工作助手', 
    '深言达意', '01Agent', '笔灵 AI 写作', 'GetDraft'
);

-- 营销文案类工具
UPDATE tools 
SET main_category = 'writing', 
    sub_category = 'writing_marketing'
WHERE name IN (
    'Mark Copy', 'Copysmith', '悉语', '快文 CopyDone', '易撰', 
    'HeyFriday', 'Anyword', '创作王', '智搜', 'Spell.tools', 
    'Jounce', '135 AI 排版', 'Magician'
);

-- 论文创作类工具
UPDATE tools 
SET main_category = 'writing', 
    sub_category = 'writing_academic'
WHERE name IN (
    '笔杆论文', '小微智能论文', '范文喵', 'PaperBetter AI', 'XPaper AI', 
    '66AI 论文', '千笔 AI 论文', '稿易 AI 论文', '万能小 in', 'Rubriq', 
    'Paperpal', '笔目鱼', 'Jenni'
);

-- 小说创作类工具
UPDATE tools 
SET main_category = 'writing', 
    sub_category = 'writing_novel'
WHERE name IN (
    'NovelAI', 'Sudowrite', '彩云小梦', '百度作家平台', 'WriteWise', 
    '量子探险', '千页小说 AI', '落笔 AI 写作', 'FeelFish', '笔灵 AI 小说', 
    '创一 AI', 'Muset'
);

-- 英文润色类工具
UPDATE tools 
SET main_category = 'writing', 
    sub_category = 'writing_english'
WHERE name IN (
    'Grammarly', 'DeepL Write', 'ProWritingAid', 'QuillBot', '有道写作', 
    'Wordvice AI', 'Reword', 'WritingPal', '有道翻译・AI 写作'
);

-- 5. 验证更新结果
SELECT 
    sc.name as 子分类名称,
    sc.description as 子分类描述,
    COUNT(t.id) as 工具数量
FROM sub_categories sc
LEFT JOIN tools t ON sc.id = t.sub_category
WHERE sc.main_category_id = 'writing'
GROUP BY sc.id, sc.name, sc.description
ORDER BY sc.sort_order;
