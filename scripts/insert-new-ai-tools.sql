-- 插入6个新的AI工具到数据库
-- 注意：id使用UUID生成，确保唯一性

-- SkillHub - 腾讯云技能安装工具
INSERT INTO tools (
  id, 
  name, 
  tagline, 
  description, 
  website_url, 
  category, 
  tags, 
  pricing_type, 
  is_china_available, 
  is_chinese_supported, 
  rating, 
  rating_count, 
  view_count, 
  status, 
  created_at
) VALUES (
  gen_random_uuid(),
  'SkillHub',
  '新SkillHub - 腾讯云专为中国用户推出的 Skill 极速安装工具',
  'SkillHub是腾讯云专为国内用户开发的一站式AI技能安装和管理平台。该工具提供了极其简化的安装流程，用户只需几步操作即可快速部署各种AI技能和工具。SkillHub针对中国网络环境进行了深度优化，确保高速稳定的下载和安装体验。平台内置了丰富的AI技能库，涵盖对话、写作、编程、设计等多个领域，并支持一键更新和版本管理。无论是个人开发者还是企业用户，都能通过SkillHub轻松构建自己的AI工具生态系统。',
  'https://skillhub.cloud.tencent.com',
  'dev',
  ARRAY['开发工具', '安装管理', '腾讯云', '一键部署'],
  'free',
  true,
  true,
  4.5,
  128,
  3567,
  'active',
  NOW()
);

-- AutoClaw - 智谱本地OpenClaw安装工具
INSERT INTO tools (
  id, 
  name, 
  tagline, 
  description, 
  website_url, 
  category, 
  tags, 
  pricing_type, 
  is_china_available, 
  is_chinese_supported, 
  rating, 
  rating_count, 
  view_count, 
  status, 
  created_at
) VALUES (
  gen_random_uuid(),
  'AutoClaw',
  '新AutoClaw - 智谱推出的国内首个一键安装本地版OpenClaw',
  'AutoClaw是智谱AI推出的国内首个本地化OpenClaw一键安装解决方案。该工具彻底简化了OpenClaw的本地部署流程，用户无需复杂的技术配置即可在个人电脑上运行完整的OpenClaw环境。AutoClaw提供了图形化的安装界面，自动处理依赖关系、环境配置和模型下载等繁琐步骤。支持离线运行，确保数据隐私和安全。特别适合对数据安全要求高的企业用户和希望在本地环境进行AI开发的个人开发者。',
  'https://autoclaw.zhipuai.cn',
  'dev',
  ARRAY['本地部署', 'OpenClaw', '智谱AI', '隐私保护'],
  'opensource',
  true,
  true,
  4.7,
  89,
  2145,
  'active',
  NOW()
);

-- InStreet - 字节扣子AI社交网络
INSERT INTO tools (
  id, 
  name, 
  tagline, 
  description, 
  website_url, 
  category, 
  tags, 
  pricing_type, 
  is_china_available, 
  is_chinese_supported, 
  rating, 
  rating_count, 
  view_count, 
  status, 
  created_at
) VALUES (
  gen_random_uuid(),
  'InStreet',
  'InStreet - 字节扣子推出的 AI Agent 专属中文社交网络',
  'InStreet是字节跳动旗下扣子平台打造的全球首个AI Agent专用中文社交网络。这是一个专为AI智能体设计的交流平台，让不同AI Agent能够相互学习、协作和进化。平台提供了丰富的社交功能，包括Agent间的对话、知识共享、技能交换等。InStreet采用先进的自然语言处理技术，确保Agent间的交流更加自然流畅。对于AI开发者和研究者来说，这里是观察AI社交行为、测试AI交互能力的理想场所。',
  'https://instreet.doubao.com',
  'agent',
  ARRAY['AI社交', 'Agent平台', '字节跳动', '中文AI'],
  'freemium',
  true,
  true,
  4.3,
  156,
  4892,
  'active',
  NOW()
);

-- WorkBuddy - 腾讯云AI桌面工作台
INSERT INTO tools (
  id, 
  name, 
  tagline, 
  description, 
  website_url, 
  category, 
  tags, 
  pricing_type, 
  is_china_available, 
  is_chinese_supported, 
  rating, 
  rating_count, 
  view_count, 
  status, 
  created_at
) VALUES (
  gen_random_uuid(),
  'WorkBuddy',
  'WorkBuddy - 腾讯云推出的AI原生桌面智能体工作台',
  'WorkBuddy是腾讯云推出的革命性AI原生桌面智能工作台，重新定义了人机协作的工作方式。该工具将多个AI助手无缝集成到桌面环境中，用户可以通过自然语言与AI助手协作完成各种工作任务。WorkBuddy支持文档处理、数据分析、代码编写、会议纪要等多种工作场景，并能够学习用户的工作习惯，提供个性化的智能建议。采用本地优先的架构设计，确保敏感数据的安全性。是企业提升办公效率的理想选择。',
  'https://workbuddy.cloud.tencent.com',
  'office',
  ARRAY['桌面助手', 'AI工作台', '腾讯云', '办公效率'],
  'freemium',
  true,
  true,
  4.6,
  203,
  6234,
  'active',
  NOW()
);

-- 智简简历 - AI简历制作工具
INSERT INTO tools (
  id, 
  name, 
  tagline, 
  description, 
  website_url, 
  category, 
  tags, 
  pricing_type, 
  is_china_available, 
  is_chinese_supported, 
  rating, 
  rating_count, 
  view_count, 
  status, 
  created_at
) VALUES (
  gen_random_uuid(),
  '智简简历',
  '智简简历 - 免费AI在线简历制作工具，可视化编辑',
  '智简简历是一款专为中国求职者设计的免费AI简历制作平台。该工具采用先进的AI技术，能够根据用户的职业背景和目标职位智能生成专业的简历内容。提供丰富的简历模板选择，涵盖各行各业的需求。支持可视化拖拽编辑，用户可以轻松调整简历布局和样式。AI助手会实时优化简历内容，突出个人优势，提高面试机会。还提供简历分析功能，帮助用户了解简历的完整性和专业性。完全免费使用，是求职者的必备工具。',
  'https://zhijiancv.com',
  'writing',
  ARRAY['简历制作', 'AI写作', '求职工具', '免费'],
  'free',
  true,
  true,
  4.4,
  367,
  8901,
  'active',
  NOW()
);

-- SheepGeo - 国内首个AI GEO工具
INSERT INTO tools (
  id, 
  name, 
  tagline, 
  description, 
  website_url, 
  category, 
  tags, 
  pricing_type, 
  is_china_available, 
  is_chinese_supported, 
  rating, 
  rating_count, 
  view_count, 
  status, 
  created_at
) VALUES (
  gen_random_uuid(),
  'SheepGeo',
  'SheepGeo - 国内首个AI GEO',
  'SheepGeo是中国首个专注于AI驱动的搜索引擎优化(GEO)工具，专门针对中文搜索环境进行深度优化。该工具利用先进的机器学习算法分析搜索引擎排名因素，为网站提供全方位的优化建议。支持关键词分析、竞争对手研究、内容优化、技术SEO检测等功能。特别针对百度、搜狗等中文搜索引擎的特点进行了专门优化。提供详细的数据报告和可视化分析，帮助用户直观了解SEO效果。无论是SEO新手还是专业优化师，都能通过SheepGeo快速提升网站在中文搜索引擎的排名。',
  'https://sheepgeo.com',
  'search',
  ARRAY['SEO优化', '搜索引擎', 'AI分析', '中文优化'],
  'freemium',
  true,
  true,
  4.2,
  94,
  1876,
  'active',
  NOW()
);
