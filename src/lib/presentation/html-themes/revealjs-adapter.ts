/**
 * Reveal.js 适配器
 * 将AI生成的内容包装成Reveal.js格式
 */

export interface RevealTheme {
  name: string;
  label: string;
  cssUrl: string;
}

// 自定义商业级主题配置
export const REVEAL_THEMES: RevealTheme[] = [
  // 顶级咨询公司主题
  { name: 'mckinsey', label: '麦肯锡 (推荐)', cssUrl: '/themes/mckinsey.css' },
  { name: 'bcg', label: 'BCG波士顿', cssUrl: '/themes/bcg.css' },
  { name: 'bain', label: '贝恩咨询', cssUrl: '/themes/bain.css' },
  { name: 'deloitte', label: '德勤', cssUrl: '/themes/deloitte.css' },
  
  // 金融投行主题
  { name: 'cicc', label: '中金公司', cssUrl: '/themes/cicc.css' },
  { name: 'goldman', label: '高盛', cssUrl: '/themes/goldman.css' },
  
  // 现代风格主题
  { name: 'apple', label: '苹果风格', cssUrl: '/themes/apple.css' },
  { name: 'ted', label: 'TED演讲', cssUrl: '/themes/ted.css' },

  // Reveal.js 内置主题（备选）
  { name: 'white', label: 'Reveal白色', cssUrl: 'https://unpkg.com/reveal.js@5.0.4/dist/theme/white.css' },
  { name: 'black', label: 'Reveal黑色', cssUrl: 'https://unpkg.com/reveal.js@5.0.4/dist/theme/black.css' },
  { name: 'league', label: 'Reveal灰蓝', cssUrl: 'https://unpkg.com/reveal.js@5.0.4/dist/theme/league.css' },
];

/**
 * 将内容包装成Reveal.js HTML结构
 */
export function wrapWithRevealJS(
  slidesContent: string,
  theme: string = 'white',
  title: string = 'Presentation',
  customCSS?: string
): string {
  const selectedTheme = REVEAL_THEMES.find(t => t.name === theme) || REVEAL_THEMES[0]!;

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  
  <!-- Reveal.js 核心CSS - 必须加载！ -->
  <link rel="stylesheet" href="https://unpkg.com/reveal.js@5.0.4/dist/reveal.css">
  
  <!-- 主题样式 -->
  ${customCSS
      ? `<style>${customCSS}</style>`
      : `<link rel="stylesheet" href="${selectedTheme.cssUrl}">`
    }
  
  <!-- 代码高亮主题 -->
  <link rel="stylesheet" href="https://unpkg.com/reveal.js@5.0.4/plugin/highlight/monokai.css">
  
  <!-- 网格布局CSS -->
  <style>
    /* Overview模式下的16:9网格布局 */
    .reveal.overview .slides {
      display: grid !important;
      /* 自适应列数，每列最小240px */
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)) !important;
      /* 根据16:9比例计算高度 (9/16 = 0.5625) */
      grid-auto-rows: 0fr !important;
      gap: 20px !important;
      width: 95% !important;
      max-width: 1600px !important;
      height: auto !important;
      max-height: 85vh !important;
      padding: 40px 20px !important;
      margin: 0 auto !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
      
      /* 重置Reveal默认变换 */
      perspective: none !important;
      transform-style: flat !important;
      position: absolute !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
    }
    
    .reveal.overview .slides section {
      /* 保持16:9比例 */
      position: relative !important;
      width: 100% !important;
      height: 0 !important;
      padding-bottom: 56.25% !important; /* 16:9 = 56.25% */
      
      /* 重置变换 */
      top: auto !important;
      left: auto !important;
      margin: 0 !important;
      transform: none !important;
      transform-origin: center !important;
      
      /* 视觉样式 */
      opacity: 1 !important;
      visibility: visible !important;
      cursor: pointer !important;
      background: white !important;
      border: 2px solid rgba(0, 0, 0, 0.12) !important;
      border-radius: 6px !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
      overflow: hidden !important;
    }
    
    /* 内容容器 - 绝对定位填充父元素 */
    .reveal.overview .slides section > * {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      padding: 8px 12px !important;
      box-sizing: border-box !important;
    }
    
    .reveal.overview .slides section:hover {
      border-color: #007acc !important;
      box-shadow: 0 6px 20px rgba(0, 122, 204, 0.2) !important;
      transform: translateY(-4px) !important;
      z-index: 10 !important;
    }
    
    /* 文本缩放 */
    .reveal.overview .slides section * {
      font-size: 0.18em !important;
      line-height: 1.3 !important;
      margin: 0.05em 0 !important;
      transform: scale(1) !important;
    }
    
    .reveal.overview .slides section h1 {
      font-size: 0.32em !important;
      margin-bottom: 0.15em !important;
      font-weight: bold !important;
    }
    
    .reveal.overview .slides section h2 {
      font-size: 0.26em !important;
      margin-bottom: 0.12em !important;
      font-weight: 600 !important;
    }
    
    .reveal.overview .slides section h3 {
      font-size: 0.22em !important;
      font-weight: 600 !important;
    }
    
    /* 隐藏图片避免布局混乱 */
    .reveal.overview .slides section img {
      max-height: 30px !important;
      width: auto !important;
      object-fit: contain !important;
    }
    
    /* 控制按钮和进度条 */
    .reveal.overview .controls,
    .reveal.overview .progress,
    .reveal.overview .slide-number {
      opacity: 0.2 !important;
    }
    
    /* 响应式调整 */
    @media (max-width: 1400px) {
      .reveal.overview .slides {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)) !important;
      }
    }
    
    @media (max-width: 1000px) {
      .reveal.overview .slides {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)) !important;
        gap: 15px !important;
      }
    }
  </style>
</head>
<body>
  <div class="reveal">
    <div class="slides">
${slidesContent}
    </div>
  </div>

  <!-- ECharts 图表库 -->
  <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
  
  <!-- Reveal.js 核心库 -->
  <script src="https://unpkg.com/reveal.js@5.0.4/dist/reveal.js"></script>
  
  <!-- 捝件 -->
  <script src="https://unpkg.com/reveal.js@5.0.4/plugin/notes/notes.js"></script>
  <script src="https://unpkg.com/reveal.js@5.0.4/plugin/markdown/markdown.js"></script>
  <script src="https://unpkg.com/reveal.js@5.0.4/plugin/highlight/highlight.js"></script>
  <script src="https://unpkg.com/reveal.js@5.0.4/plugin/zoom/zoom.js"></script>
  
  <script>
    // 等待Reveal.js加载完成
    function initReveal() {
      if (typeof Reveal === 'undefined') {
        console.error('Reveal.js未加载，3秒后重试...');
        setTimeout(initReveal, 3000);
        return;
      }
      
      console.log('Reveal.js已加载，开始初始化...');
      
      // 初始化 Reveal.js - 使用标准PPT 16:9比例
      Reveal.initialize({
        // 固定尺寸：标准PPT 16:9比例 (960x700)
        width: 960,
        height: 700,
        margin: 0.04,  // 4% 边距，避免内容贴边
        minScale: 0.2,
        maxScale: 2.0,
        
        // 基础配置
        hash: false,
        center: false,
        transition: 'slide',
        transitionSpeed: 'default',
        backgroundTransition: 'fade',
        embedded: false,
        disableLayout: false,  // 允许响应式布局
        
        // 确保等比例缩放
        respondToHashChanges: true,
        
        // 控制选项
        controls: true,
        progress: true,
        slideNumber: true,
        
        // 导航
        keyboard: true,
        touch: true,
        loop: false,
        
        // 自动播放
        autoSlide: 0,
        
        // 插件
        plugins: [
          typeof RevealMarkdown !== 'undefined' ? RevealMarkdown : null,
          typeof RevealHighlight !== 'undefined' ? RevealHighlight : null,
          typeof RevealNotes !== 'undefined' ? RevealNotes : null,
          typeof RevealZoom !== 'undefined' ? RevealZoom : null
        ].filter(Boolean)
      }).then(() => {
        console.log('✅ Reveal.js初始化成功！');
        console.log('幻灯片数量:', Reveal.getTotalSlides());
        
        // 监听全屏变化，确保等比例缩放
        document.addEventListener('fullscreenchange', () => {
          setTimeout(() => {
            Reveal.layout();
            console.log('� 全屏状片态改变，重新布局');
          }, 100);
        });
        
        // 监听窗口大小变化
        let resizeTimer;
        window.addEventListener('resize', () => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
            Reveal.layout();
            console.log('🔄 窗口大小改变，重新布局');
          }, 200);
        });
        
        // 调试：检查第一个幻灯片的样式
        const firstSlide = document.querySelector('.reveal .slides section');
        if (firstSlide) {
          const styles = window.getComputedStyle(firstSlide);
          console.log('🔍 第一个幻灯片样式:', {
            display: styles.display,
            opacity: styles.opacity,
            visibility: styles.visibility,
            color: styles.color,
            background: styles.background,
            transform: styles.transform
          });
          console.log('🔍 第一个幻灯片HTML:', firstSlide.innerHTML.substring(0, 200));
        } else {
          console.error('❌ 找不到幻灯片元素！');
        }
      }).catch((error) => {
        console.error('❌ Reveal.js初始化错误:', error);
      });
    }
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initReveal);
    } else {
      initReveal();
    }
  </script>
</body>
</html>`;
}

/**
 * 将单个幻灯片内容包装成Reveal.js的section
 */
export function wrapSlideSection(content: string, className?: string): string {
  const classAttr = className ? ` class="${className}"` : '';
  return `      <section${classAttr}>
${content}
      </section>`;
}
