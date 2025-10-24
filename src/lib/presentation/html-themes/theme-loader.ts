/**
 * HTML主题加载器
 * 负责加载和管理HTML演示文稿的CSS主题
 */

import fs from 'fs';
import path from 'path';

export type HTMLTheme = 'professional' | 'creative' | 'minimalist';

/**
 * 获取主题CSS内容
 */
export function getThemeCSS(theme: HTMLTheme = 'professional'): string {
  try {
    const cssPath = path.join(process.cwd(), 'src/lib/presentation/html-themes', `${theme}.css`);
    return fs.readFileSync(cssPath, 'utf-8');
  } catch (error) {
    console.error(`Failed to load theme ${theme}:`, error);
    // 返回默认的professional主题
    return getDefaultCSS();
  }
}

/**
 * 默认CSS（如果文件加载失败）
 */
function getDefaultCSS(): string {
  return `
:root {
  --primary-color: #2C3E50;
  --accent-color: #3498DB;
  --text-color: #333;
  --text-light: #888;
  --bg-card: #f9f9f9;
  --border-color: #e8e8e8;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: 'Noto Sans SC', sans-serif;
  background: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
.slide {
  width: 1280px;
  height: 720px;
  background: #fff;
  box-shadow: 0 5px 25px rgba(0,0,0,0.15);
  display: grid;
  grid-template-rows: 60px 1fr 40px;
  padding: 20px;
  overflow: hidden;
}
.header { border-bottom: 2px solid var(--primary-color); padding-bottom: 10px; }
.header h1 { font-size: 28px; color: var(--primary-color); margin: 0; }
.content { padding: 20px 0; overflow: hidden; }
.footer {
  border-top: 1px solid var(--border-color);
  padding-top: 10px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-light);
}
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; height: 100%; }
.three-col { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; height: 100%; }
.grid-2x2 { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 20px; height: 100%; }
.card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.card h3 { font-size: 18px; color: var(--primary-color); margin-bottom: 10px; }
.card p { font-size: 14px; line-height: 1.6; color: var(--text-color); }
.data-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 25px;
  text-align: center;
}
.data-value { font-size: 48px; font-weight: 700; color: var(--primary-color); line-height: 1; }
.data-unit { font-size: 20px; color: var(--accent-color); margin-left: 5px; }
.data-label { font-size: 14px; color: var(--text-light); margin-top: 10px; }
ul { list-style: none; padding: 0; }
li { padding: 10px 0 10px 25px; position: relative; font-size: 16px; line-height: 1.5; }
li::before { content: "•"; position: absolute; left: 0; color: var(--accent-color); font-size: 20px; }
.centered {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}
.centered h1 { font-size: 52px; color: var(--primary-color); margin-bottom: 20px; }
.centered h2 { font-size: 24px; color: var(--text-light); font-weight: 400; margin-bottom: 40px; }
`;
}

/**
 * 将CSS注入到HTML中
 */
export function injectThemeCSS(htmlContent: string, theme: HTMLTheme = 'professional'): string {
  const css = getThemeCSS(theme);
  
  // 在<head>中查找<style>标签，如果没有则创建
  if (htmlContent.includes('<style>')) {
    // 替换现有的<style>内容
    return htmlContent.replace(
      /<style>[\s\S]*?<\/style>/,
      `<style>\n${css}\n</style>`
    );
  } else if (htmlContent.includes('</head>')) {
    // 在</head>前插入<style>
    return htmlContent.replace(
      '</head>',
      `<style>\n${css}\n</style>\n</head>`
    );
  }
  
  return htmlContent;
}
