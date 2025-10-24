/**
 * Reveal.js HTML组装器
 * 将AI生成的内容组装成完整的Reveal.js演示文稿
 */

import { wrapWithRevealJS, wrapSlideSection } from './html-themes/revealjs-adapter';

export interface AssembleOptions {
  theme?: string;
  title?: string;
  customCSS?: string;
}

/**
 * 组装完整的Reveal.js HTML
 */
export function assembleRevealJSPresentation(
  aiGeneratedContent: string,
  options: AssembleOptions = {}
): string {
  const { theme = 'white', title = 'Presentation', customCSS } = options;
  
  console.log('🔍 AI生成内容长度:', aiGeneratedContent.length);
  console.log('🔍 AI生成内容预览:', aiGeneratedContent.substring(0, 500));
  
  // 将AI生成的内容分割成单独的幻灯片
  const slides = splitIntoSlides(aiGeneratedContent);
  
  console.log('🔍 分割后幻灯片数量:', slides.length);
  if (slides.length > 0) {
    console.log('🔍 第一个幻灯片预览:', slides[0].substring(0, 200));
  }
  
  // 为每个幻灯片包装section标签
  const wrappedSlides = slides.map((slide, index) => {
    // 第一页通常是封面，居中显示
    const className = index === 0 ? 'center' : '';
    return wrapSlideSection(slide, className);
  }).join('\n\n');
  
  console.log('🔍 包装后的幻灯片预览:', wrappedSlides.substring(0, 500));
  
  // 组装完整的HTML
  return wrapWithRevealJS(wrappedSlides, theme, title, customCSS);
}

/**
 * 将AI生成的内容分割成单独的幻灯片
 * 策略：
 * 1. 优先按照h1/h2标题分割（最可靠）
 * 2. 如果没有标题，按照连续的空行分割
 * 3. 如果还是太少，按照单个空行分割
 */
function splitIntoSlides(content: string): string[] {
  // 清理内容
  content = content.trim();
  
  // 策略1：按h1/h2标题分割（最可靠）
  let slides = splitByHeadings(content);
  
  if (slides.length >= 3) {
    console.log('✅ 使用标题分割，得到', slides.length, '个幻灯片');
    return slides;
  }
  
  // 策略2：按照连续空行分割（两个或更多换行）
  slides = content
    .split(/\n\s*\n\s*\n+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  if (slides.length >= 3) {
    console.log('✅ 使用连续空行分割，得到', slides.length, '个幻灯片');
    return slides;
  }
  
  // 策略3：按照单个空行分割
  slides = content
    .split(/\n\s*\n/)
    .map(s => s.trim())
    .filter(s => s.length > 20); // 过滤掉太短的片段
  
  if (slides.length >= 3) {
    console.log('✅ 使用单个空行分割，得到', slides.length, '个幻灯片');
    return slides;
  }
  
  // 策略4：如果还是太少，使用整个内容作为单个幻灯片
  if (content.length > 0) {
    console.warn('⚠️ 无法正确分割幻灯片，使用整个内容作为单个幻灯片');
    return [content];
  }
  
  // 策略5：如果内容为空，返回一个错误提示幻灯片
  console.error('❌ AI生成的内容为空！');
  return ['<h1>生成失败</h1><p>AI没有生成任何内容，请重试。</p>'];
}

/**
 * 按照h1或h2标题分割内容
 */
function splitByHeadings(content: string): string[] {
  const slides: string[] = [];
  const lines = content.split('\n');
  let currentSlide: string[] = [];
  let foundFirstHeading = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // 检测是否是新的幻灯片开始（h1或h2标题）
    const isHeading = trimmed.match(/^<h[12][\s>]/i);
    
    if (isHeading) {
      // 保存之前的幻灯片（如果有内容）
      if (currentSlide.length > 0 && foundFirstHeading) {
        const slideContent = currentSlide.join('\n').trim();
        if (slideContent.length > 0) {
          slides.push(slideContent);
        }
        currentSlide = [];
      }
      foundFirstHeading = true;
    }
    
    if (foundFirstHeading) {
      currentSlide.push(line);
    }
  }
  
  // 添加最后一个幻灯片
  if (currentSlide.length > 0) {
    const slideContent = currentSlide.join('\n').trim();
    if (slideContent.length > 0) {
      slides.push(slideContent);
    }
  }
  
  console.log('🔍 按标题分割结果:', slides.length, '个幻灯片');
  if (slides.length > 0) {
    console.log('🔍 第一个幻灯片:', slides[0].substring(0, 100));
  }
  
  return slides;
}

/**
 * 从HTML中提取标题作为演示文稿标题
 */
export function extractTitle(html: string): string {
  const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (h1Match) {
    return h1Match[1].replace(/<[^>]+>/g, '').trim();
  }
  return 'Presentation';
}
