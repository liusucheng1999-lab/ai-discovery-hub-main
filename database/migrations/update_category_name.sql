-- 更新分类名称：将"绘画"改为"图像"
UPDATE categories 
SET name = '图像' 
WHERE name = '绘画';

-- 如果没有找到"绘画"分类，确保"图像"分类存在
INSERT INTO categories (id, name, icon, sort_order) 
VALUES ('image', '图像', '🎨', 4)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  icon = EXCLUDED.icon;
