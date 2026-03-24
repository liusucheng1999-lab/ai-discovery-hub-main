-- 删除旧版分类和价格类型字段的NOT NULL约束
-- 然后清理数据

-- 1. 删除category字段的NOT NULL约束
ALTER TABLE tools ALTER COLUMN category DROP NOT NULL;

-- 2. 删除pricing_type字段的NOT NULL约束  
ALTER TABLE tools ALTER COLUMN pricing_type DROP NOT NULL;

-- 3. 清理所有旧版分类数据
UPDATE tools SET category = NULL WHERE category IS NOT NULL;

-- 4. 清理所有价格类型数据
UPDATE tools SET pricing_type = NULL WHERE pricing_type IS NOT NULL;

-- 5. 验证清理结果
SELECT 
  COUNT(*) as total_tools,
  COUNT(main_category) as with_main_category,
  COUNT(sub_category) as with_sub_category,
  COUNT(category) as with_old_category,
  COUNT(pricing_type) as with_pricing_type
FROM tools;
