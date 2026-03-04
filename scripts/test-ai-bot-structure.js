/**
 * 测试AI-BOT.CN网站结构
 */

async function testWebsiteStructure() {
  try {
    console.log('🔍 测试AI-BOT.CN网站结构...');
    
    const response = await fetch('https://ai-bot.cn/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3'
      }
    });
    
    if (!response.ok) {
      console.log('请求失败:', response.status);
      return;
    }
    
    const html = await response.text();
    
    // 查找所有链接
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const links = [];
    let match;
    
    while ((match = linkRegex.exec(html)) !== null) {
      links.push({
        text: match[1].trim(),
        url: match[2].trim()
      });
    }
    
    console.log(`\n找到 ${links.length} 个链接:`);
    console.log('================================');
    
    // 显示前20个链接
    links.slice(0, 20).forEach((link, index) => {
      console.log(`${index + 1}. ${link.text}`);
      console.log(`   URL: ${link.url}`);
      console.log('');
    });
    
    // 查找sites链接
    const siteLinks = links.filter(link => link.url.includes('/sites/'));
    console.log(`\n找到 ${siteLinks.length} 个工具链接:`);
    console.log('================================');
    
    siteLinks.slice(0, 10).forEach((link, index) => {
      console.log(`${index + 1}. ${link.text}`);
      console.log(`   URL: ${link.url}`);
      console.log('');
    });
    
    // 测试一个分类页面
    console.log('\n🔍 测试分类页面结构...');
    try {
      const categoryResponse = await fetch('https://ai-bot.cn/favorites/ai-programming-tools/', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3'
        }
      });
      
      if (categoryResponse.ok) {
        const categoryHtml = await categoryResponse.text();
        console.log('分类页面请求成功');
        
        // 查找分类页面中的链接
        const categoryLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const categoryLinks = [];
        let categoryMatch;
        
        while ((categoryMatch = categoryLinkRegex.exec(categoryHtml)) !== null) {
          categoryLinks.push({
            text: categoryMatch[1].trim(),
            url: categoryMatch[2].trim()
          });
        }
        
        console.log(`分类页面找到 ${categoryLinks.length} 个链接:`);
        console.log('================================');
        
        categoryLinks.slice(0, 10).forEach((link, index) => {
          console.log(`${index + 1}. ${link.text}`);
          console.log(`   URL: ${link.url}`);
          console.log('');
        });
        
      } else {
        console.log('分类页面请求失败:', categoryResponse.status);
      }
    } catch (error) {
      console.log('分类页面测试失败:', error.message);
    }
    
  } catch (error) {
    console.error('测试失败:', error);
  }
}

testWebsiteStructure();
