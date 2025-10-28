// 用于检查下载的 HTML 文件是否包含正确的 reveal.js 配置
// 使用方法：node check-html-config.js <你下载的HTML文件路径>

const fs = require('fs');

const filePath = process.argv[2];

if (!filePath) {
  console.log('使用方法: node check-html-config.js <HTML文件路径>');
  console.log('例如: node check-html-config.js ~/Downloads/presentation.html');
  process.exit(1);
}

try {
  const html = fs.readFileSync(filePath, 'utf-8');
  
  console.log('\n=== 检查 Reveal.js 配置 ===\n');
  
  // 检查关键配置
  const checks = [
    { name: 'margin: 0.1', pattern: /margin:\s*0\.1/, expected: true },
    { name: 'center: true', pattern: /center:\s*true/, expected: true },
    { name: 'embedded: false', pattern: /embedded:\s*false/, expected: true },
    { name: 'width: 960', pattern: /width:\s*960/, expected: true },
    { name: 'height: 700', pattern: /height:\s*700/, expected: true },
    { name: 'html, body 100%', pattern: /html,\s*body\s*{[^}]*width:\s*100%[^}]*height:\s*100%/, expected: true },
    { name: '全屏事件监听', pattern: /handleFullscreenChange/, expected: true },
    { name: 'iframe 检测', pattern: /isInIframe/, expected: true },
  ];
  
  let allPassed = true;
  
  checks.forEach(check => {
    const found = check.pattern.test(html);
    const status = found === check.expected ? '✅' : '❌';
    console.log(`${status} ${check.name}: ${found ? '找到' : '未找到'}`);
    if (found !== check.expected) {
      allPassed = false;
    }
  });
  
  console.log('\n=== 检查结果 ===\n');
  
  if (allPassed) {
    console.log('✅ 所有配置都正确！');
    console.log('\n如果全屏还是有问题，请：');
    console.log('1. 打开 HTML 文件');
    console.log('2. 按 F12 打开开发者工具');
    console.log('3. 按 F 键进入全屏');
    console.log('4. 查看 Console 中的日志');
  } else {
    console.log('❌ 配置不正确！');
    console.log('\n这个 HTML 文件可能是用旧代码生成的。');
    console.log('请在应用中重新生成一个新的演示文稿。');
  }
  
  console.log('\n');
  
} catch (error) {
  console.error('错误:', error.message);
  process.exit(1);
}
