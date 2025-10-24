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
  { name: "mckinsey", label: "麦肯锡 (推荐)", cssUrl: "/themes/mckinsey.css" },
  { name: "bcg", label: "BCG波士顿", cssUrl: "/themes/bcg.css" },
  { name: "bain", label: "贝恩咨询", cssUrl: "/themes/bain.css" },
  { name: "deloitte", label: "德勤", cssUrl: "/themes/deloitte.css" },

  // 金融投行主题
  { name: "cicc", label: "中金公司", cssUrl: "/themes/cicc.css" },
  { name: "goldman", label: "高盛", cssUrl: "/themes/goldman.css" },

  // 现代风格主题
  { name: "apple", label: "苹果风格", cssUrl: "/themes/apple.css" },
  { name: "ted", label: "TED演讲", cssUrl: "/themes/ted.css" },

  // Reveal.js 内置主题（备选）
  {
    name: "white",
    label: "Reveal白色",
    cssUrl: "https://unpkg.com/reveal.js@5.0.4/dist/theme/white.css",
  },
  {
    name: "black",
    label: "Reveal黑色",
    cssUrl: "https://unpkg.com/reveal.js@5.0.4/dist/theme/black.css",
  },
  {
    name: "league",
    label: "Reveal灰蓝",
    cssUrl: "https://unpkg.com/reveal.js@5.0.4/dist/theme/league.css",
  },
];

/**
 * 将内容包装成Reveal.js HTML结构
 */
export function wrapWithRevealJS(
  slidesContent: string,
  theme: string = "white",
  title: string = "Presentation",
  customCSS?: string,
): string {
  const selectedTheme =
    REVEAL_THEMES.find((t) => t.name === theme) || REVEAL_THEMES[0]!;

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  
  <!-- Reveal.js 核心CSS - 必须加载！ -->
  <link rel="stylesheet" href="https://unpkg.com/reveal.js@5.0.4/dist/reveal.css">
  
  <!-- 主题样式 -->
  ${
    customCSS
      ? `<style>${customCSS}</style>`
      : `<link rel="stylesheet" href="${selectedTheme.cssUrl}">`
  }
  
  <!-- 代码高亮主题 -->
  <link rel="stylesheet" href="https://unpkg.com/reveal.js@5.0.4/plugin/highlight/monokai.css">
  
  <!-- 基础样式修复 - 保守方案 -->
  <style>
    /* 保持Reveal.js默认行为，只做必要修复 */
    .reveal .slides {
      text-align: left;
    }
    
    /* 内容容器 - 最小化干预 */
    .reveal .slides section .slide-content {
      width: 90%;
      max-width: 90%;
      margin: 0 auto;
      padding: 20px;
      box-sizing: border-box;
      
      /* 让内容自然流动，不强制高度 */
      height: auto;
      min-height: auto;
    }
    
    /* 封面幻灯片居中 */
    .reveal .slides section.center .slide-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      height: 100%;
    }
    
    /* 全屏模式微调 */
    .reveal.fullscreen .slides section .slide-content {
      width: 85%;
      max-width: 85%;
      padding: 30px;
    }
    
    /* 文本换行处理 */
    .reveal .slides section h1,
    .reveal .slides section h2,
    .reveal .slides section h3,
    .reveal .slides section p,
    .reveal .slides section ul,
    .reveal .slides section ol {
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
    
    /* 表格响应式 */
    .reveal .slides section table {
      max-width: 100%;
      font-size: 0.9em;
    }
    
    /* 图片响应式 */
    .reveal .slides section img {
      max-width: 100%;
      height: auto;
    }
  </style>
  
  <!-- Overview 网格布局CSS - 使用官方推荐方法 -->
  <style>
    /* Overview模式：使用CSS zoom属性进行缩放 */
    .reveal.overview .slides {
      display: grid !important;
      grid-template-columns: repeat(auto-fill, minmax(288px, 1fr)) !important;  /* 960 * 0.3 = 288 */
      gap: 20px !important;
      width: 95% !important;
      max-width: 1920px !important;
      padding: 30px !important;
      margin: 0 auto !important;
      overflow-y: auto !important;
      position: absolute !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      height: auto !important;
      max-height: 95vh !important;
      justify-items: center !important;
      align-items: start !important;
    }
    
    /* 缩略图卡片 - 使用zoom进行缩放 */
    .reveal.overview .slides section {
      position: relative !important;
      width: 960px !important;  /* 与幻灯片宽度一致 */
      height: 700px !important;  /* 与幻灯片高度一致 */
      zoom: 0.3 !important;  /* 使用zoom缩小到30% */
      
      display: block !important;
      opacity: 1 !important;
      visibility: visible !important;
      cursor: pointer !important;
      background: white !important;
      border: 2px solid rgba(0, 0, 0, 0.1) !important;
      border-radius: 4px !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
      transition: all 0.2s ease !important;
      overflow: hidden !important;  /* 防止内容溢出 */
      
      /* 重置位置 */
      top: 0 !important;
      left: 0 !important;
      margin: 0 !important;
      transform: none !important;
    }
    
    .reveal.overview .slides section:hover {
      border-color: #0066cc !important;
      box-shadow: 0 4px 16px rgba(0, 102, 204, 0.2) !important;
      zoom: 0.32 !important;
      z-index: 10 !important;
    }
    
    /* 当前幻灯片高亮 */
    .reveal.overview .slides section.present {
      border-color: #0066cc !important;
      border-width: 3px !important;
      box-shadow: 0 4px 16px rgba(0, 102, 204, 0.3) !important;
    }
    
    /* 保持原始内容布局，不进行额外变换 */
    .reveal.overview .slides section > * {
      pointer-events: none !important;
    }
    
    /* 控制按钮和进度条 */
    .reveal.overview .controls,
    .reveal.overview .progress {
      opacity: 0.3 !important;
    }
    
    .reveal.overview .slide-number {
      display: none !important;
    }
    
    /* 响应式调整 */
    @media (max-width: 1600px) {
      .reveal.overview .slides {
        grid-template-columns: repeat(auto-fill, minmax(259px, 1fr)) !important;  /* 960 * 0.27 */
      }
      .reveal.overview .slides section {
        zoom: 0.27 !important;
      }
      .reveal.overview .slides section:hover {
        zoom: 0.29 !important;
      }
    }
    
    @media (max-width: 1200px) {
      .reveal.overview .slides {
        grid-template-columns: repeat(auto-fill, minmax(221px, 1fr)) !important;  /* 960 * 0.23 */
        gap: 15px !important;
      }
      .reveal.overview .slides section {
        zoom: 0.23 !important;
      }
      .reveal.overview .slides section:hover {
        zoom: 0.25 !important;
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
      
      // 初始化 Reveal.js - 使用标准配置
      Reveal.initialize({
        // 标准PPT尺寸
        width: 960,
        height: 700,
        margin: 0.04,
        minScale: 0.2,
        maxScale: 2.0,
        
        // 基础配置
        hash: false,
        center: true,  // 保持Reveal.js默认的居中行为
        transition: 'slide',
        transitionSpeed: 'default',
        backgroundTransition: 'fade',
        embedded: false,
        disableLayout: false,
        
        // 响应式配置
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
        
        // 监听全屏变化
        function handleFullscreenChange() {
          const isFullscreen = !!(document.fullscreenElement || 
                                 document.webkitFullscreenElement || 
                                 document.mozFullScreenElement);
          
          // 添加/移除全屏CSS类
          const revealElement = document.querySelector('.reveal');
          if (revealElement) {
            if (isFullscreen) {
              revealElement.classList.add('fullscreen');
            } else {
              revealElement.classList.remove('fullscreen');
            }
          }
          
          // 简单的重新布局
          setTimeout(() => {
            Reveal.layout();
          }, 200);
        }
        
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        
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
  const classAttr = className ? ` class="${className}"` : "";
  // 使用r-fit-text和r-stretch确保内容自适应并居中
  return `      <section${classAttr}>
        <div class="slide-content">
${content}
        </div>
      </section>`;
}
