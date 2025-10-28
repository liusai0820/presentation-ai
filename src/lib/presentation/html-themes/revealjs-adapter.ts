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
  ${customCSS
      ? `<style>${customCSS}</style>`
      : `<link rel="stylesheet" href="${selectedTheme.cssUrl}">`
    }
  
  <!-- 代码高亮主题 -->
  <link rel="stylesheet" href="https://unpkg.com/reveal.js@5.0.4/plugin/highlight/monokai.css">
  
  <!-- 基础样式修复 - 不干扰 reveal.js 布局 -->
  <style>
    /* 确保 reveal 容器占满整个视口 */
    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      margin: 0;
      padding: 0;
    }
    
    .reveal {
      width: 100%;
      height: 100%;
    }
    
    /* 确保幻灯片容器不会被裁剪 */
    .reveal .slides {
      text-align: left;
    }
    
    /* 统一的幻灯片内边距 - 减小左右边距 */
    .reveal .slides section {
      box-sizing: border-box;
      padding: 0 !important;
    }
    
    /* 内容包装器 - 提供统一的内边距 */
    .reveal .slides section .slide-content-wrapper {
      padding: 45px 35px 35px 35px;
      box-sizing: border-box;
    }
    
    /* 封面页：居中布局 */
    .reveal .slides section.cover .slide-content-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      min-height: 600px;
      padding: 60px 50px;
    }
    
    /* --- CORE FIX for Background Image --- */
    .reveal .slides section[data-background-image] {
      background: transparent !important;
    }

    /* Text wrapping */
    .reveal .slides section h1,
    .reveal .slides section h2,
    .reveal .slides section h3,
    .reveal .slides section p,
    .reveal .slides section ul,
    .reveal .slides section ol {
      word-wrap: break-word;
      overflow-wrap: break-word;
      max-width: 100%;
    }
    
    /* Responsive table */
    .reveal .slides section table {
      max-width: 100%;
      font-size: 0.9em;
    }
    
    /* 图片基础样式 - 专业演示文稿设计 */
    .reveal .slides section img {
      max-width: 100%;
      max-height: 400px;
      height: auto;
      object-fit: cover;
      display: block;
      margin: 25px auto;
      
      /* 视觉提升：阴影和圆角 */
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      
      /* 边框增加层次感 */
      border: 1px solid rgba(0, 0, 0, 0.08);
      
      /* 轻微的过渡效果 */
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    /* 图片悬停效果（在演示模式下不会触发，但在编辑时有用） */
    .reveal .slides section img:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }
    
    /* 图文混合布局 - 专业的左右排列 */
    .reveal .slides section .media-with-text {
      display: flex;
      gap: 35px;
      align-items: flex-start;
      margin: 25px 0;
      padding: 20px;
      background: rgba(0, 0, 0, 0.02);
      border-radius: 8px;
    }
    
    .reveal .slides section .media-with-text .text-content {
      flex: 1;
      min-width: 0;
      padding-right: 10px;
    }
    
    .reveal .slides section .media-with-text .media-content {
      flex: 0 0 380px;
      max-width: 380px;
      position: relative;
    }
    
    .reveal .slides section .media-with-text .media-content img {
      width: 100%;
      height: auto;
      max-height: 320px;
      object-fit: cover;
      border-radius: 6px;
      margin: 0;
      
      /* 更精致的阴影 */
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.8);
    }
    
    /* 图片容器的装饰性边框（可选） */
    .reveal .slides section .media-with-text .media-content::before {
      content: '';
      position: absolute;
      top: -8px;
      left: -8px;
      right: 8px;
      bottom: 8px;
      border: 2px solid rgba(0, 102, 204, 0.15);
      border-radius: 8px;
      pointer-events: none;
      z-index: -1;
    }
    
    /* 反向布局：右文左图 */
    .reveal .slides section .media-with-text.reverse {
      flex-direction: row-reverse;
    }
    
    .reveal .slides section .media-with-text.reverse .text-content {
      padding-right: 0;
      padding-left: 10px;
    }
    
    /* 两栏布局 - 专业分栏设计 */
    .reveal .slides section .two-columns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 35px;
      margin: 25px 0;
    }
    
    .reveal .slides section .two-columns > div {
      padding: 20px;
      background: rgba(0, 0, 0, 0.02);
      border-radius: 6px;
      border-left: 3px solid rgba(0, 102, 204, 0.3);
    }
    
    /* 三栏布局 */
    .reveal .slides section .three-columns {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 25px;
      margin: 25px 0;
    }
    
    .reveal .slides section .three-columns > div {
      padding: 18px;
      background: rgba(0, 0, 0, 0.02);
      border-radius: 6px;
      text-align: center;
    }
    
    /* 2x2 网格 */
    .reveal .slides section .grid-2x2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 25px;
      margin: 25px 0;
    }
    
    .reveal .slides section .grid-2x2 > div {
      padding: 20px;
      background: rgba(0, 0, 0, 0.02);
      border-radius: 6px;
    }
    
    /* 数据卡片 - 增强视觉效果 */
    .reveal .slides section .data-card,
    .reveal .slides section .metric-card {
      background: linear-gradient(135deg, rgba(0, 102, 204, 0.05) 0%, rgba(0, 102, 204, 0.02) 100%);
      border: 1px solid rgba(0, 102, 204, 0.15);
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .reveal .slides section .data-card:hover,
    .reveal .slides section .metric-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }
    
    /* 时间线 - 视觉引导 */
    .reveal .slides section .timeline {
      position: relative;
      padding-left: 30px;
      margin: 25px 0;
    }
    
    .reveal .slides section .timeline::before {
      content: '';
      position: absolute;
      left: 8px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: linear-gradient(180deg, rgba(0, 102, 204, 0.6) 0%, rgba(0, 102, 204, 0.2) 100%);
    }
    
    .reveal .slides section .timeline-item {
      position: relative;
      padding: 15px 20px;
      margin-bottom: 20px;
      background: rgba(0, 0, 0, 0.02);
      border-radius: 6px;
      border-left: 3px solid rgba(0, 102, 204, 0.4);
    }
    
    .reveal .slides section .timeline-item::before {
      content: '';
      position: absolute;
      left: -33px;
      top: 20px;
      width: 12px;
      height: 12px;
      background: #0066cc;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
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
      
      // 检测是否在 iframe 中
      const isInIframe = window.self !== window.top;
      console.log('🔍 运行环境:', isInIframe ? 'iframe 内嵌' : '独立窗口');
      
      // 初始化 Reveal.js - 优化配置以支持多种视图模式
      Reveal.initialize({
        // 标准PPT尺寸 (16:9 比例)
        width: 960,
        height: 700,
        
        // 关键：margin 控制内容与边缘的距离（减小边距让内容更充满屏幕）
        margin: 0.04,
        
        // 关键：缩放范围 - 确保在不同容器尺寸下都能正确显示
        minScale: 0.2,
        maxScale: 2.0,
        
        // 基础配置
        hash: false,
        
        // 关键：center 设为 true，让内容垂直居中
        center: true,
        
        transition: 'slide',
        transitionSpeed: 'default',
        backgroundTransition: 'fade',
        
        // embedded 保持 false
        embedded: false,
        
        // disableLayout 保持 false，让 reveal.js 自动处理布局
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
        
        // 初始化编辑模式
        initEditMode();
        
        // 监听全屏变化 - 优化布局刷新
        function handleFullscreenChange() {
          const isFullscreen = !!(document.fullscreenElement || 
                                 document.webkitFullscreenElement || 
                                 document.mozFullScreenElement);
          
          console.log('🔄 全屏状态变化:', isFullscreen ? '进入全屏' : '退出全屏');
          
          // 添加/移除全屏CSS类
          const revealElement = document.querySelector('.reveal');
          if (revealElement) {
            if (isFullscreen) {
              revealElement.classList.add('fullscreen');
            } else {
              revealElement.classList.remove('fullscreen');
            }
          }
          
          // 关键：延迟重新布局，确保浏览器完成全屏切换动画
          // 使用多次布局刷新，确保在不同浏览器下都能正确显示
          setTimeout(() => {
            Reveal.layout();
            console.log('🔄 第一次布局刷新完成');
          }, 100);
          
          setTimeout(() => {
            Reveal.layout();
            console.log('🔄 第二次布局刷新完成');
          }, 300);
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
        
        // 如果在 iframe 中，添加额外的布局刷新
        if (isInIframe) {
          console.log('🔍 检测到 iframe 环境，启用增强布局刷新');
          
          // 延迟刷新，确保 iframe 完全加载
          setTimeout(() => {
            Reveal.layout();
            console.log('🔄 iframe 初始布局刷新');
          }, 500);
          
          // 监听父窗口的消息（如果需要）
          window.addEventListener('message', (event) => {
            if (event.data === 'reveal-layout') {
              Reveal.layout();
              console.log('🔄 收到父窗口布局刷新请求');
            }
          });
        }
        
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
    
    // ==================== 编辑模式功能 ====================
    function initEditMode() {
      let isEditMode = false;
      let selectedImage = null;
      
      // 创建编辑模式切换按钮
      const editButton = document.createElement('button');
      editButton.innerHTML = '✏️ 编辑模式';
      editButton.style.cssText = \`
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        padding: 10px 20px;
        background: #0066cc;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
        transition: all 0.3s ease;
      \`;
      
      editButton.addEventListener('mouseenter', () => {
        editButton.style.background = '#0052a3';
        editButton.style.transform = 'translateY(-2px)';
        editButton.style.boxShadow = '0 6px 16px rgba(0, 102, 204, 0.4)';
      });
      
      editButton.addEventListener('mouseleave', () => {
        editButton.style.background = '#0066cc';
        editButton.style.transform = 'translateY(0)';
        editButton.style.boxShadow = '0 4px 12px rgba(0, 102, 204, 0.3)';
      });
      
      document.body.appendChild(editButton);
      
      // 创建富文本工具栏
      const toolbar = createRichTextToolbar();
      document.body.appendChild(toolbar);
      
      // 创建图片调整工具栏
      const imageToolbar = createImageToolbar();
      document.body.appendChild(imageToolbar);
      
      // 创建导出按钮
      const exportButton = document.createElement('button');
      exportButton.innerHTML = '💾 导出编辑版';
      exportButton.style.cssText = \`
        position: fixed;
        top: 20px;
        right: 160px;
        z-index: 9999;
        padding: 10px 20px;
        background: #28a745;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
        transition: all 0.3s ease;
        display: none;
      \`;
      
      exportButton.addEventListener('mouseenter', () => {
        exportButton.style.background = '#218838';
        exportButton.style.transform = 'translateY(-2px)';
        exportButton.style.boxShadow = '0 6px 16px rgba(40, 167, 69, 0.4)';
      });
      
      exportButton.addEventListener('mouseleave', () => {
        exportButton.style.background = '#28a745';
        exportButton.style.transform = 'translateY(0)';
        exportButton.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.3)';
      });
      
      exportButton.addEventListener('click', () => {
        exportEditedHTML();
      });
      
      document.body.appendChild(exportButton);
      
      // 切换编辑模式
      editButton.addEventListener('click', () => {
        isEditMode = !isEditMode;
        
        if (isEditMode) {
          enableEditMode();
          editButton.innerHTML = '✅ 保存并退出';
          editButton.style.background = '#00a758';
          exportButton.style.display = 'block';
        } else {
          disableEditMode();
          editButton.innerHTML = '✏️ 编辑模式';
          editButton.style.background = '#0066cc';
          exportButton.style.display = 'none';
        }
      });
      
      // 导出编辑后的 HTML
      function exportEditedHTML() {
        const htmlContent = document.documentElement.outerHTML;
        const blob = new Blob(['<!DOCTYPE html>\\n' + htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = document.title + '-edited.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('💾 编辑版本已导出！', 'success');
      }
      
      // 创建富文本工具栏
      function createRichTextToolbar() {
        const toolbar = document.createElement('div');
        toolbar.id = 'rich-text-toolbar';
        toolbar.style.cssText = \`
          position: fixed;
          top: 70px;
          right: 20px;
          z-index: 9998;
          background: white;
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: none;
          gap: 4px;
        \`;
        
        const buttons = [
          { cmd: 'bold', icon: '𝐁', title: '粗体' },
          { cmd: 'italic', icon: '𝐼', title: '斜体' },
          { cmd: 'underline', icon: '𝐔', title: '下划线' },
          { cmd: 'strikeThrough', icon: 'S̶', title: '删除线' },
          { cmd: 'separator' },
          { cmd: 'foreColor', icon: '🎨', title: '文字颜色', color: true },
          { cmd: 'hiliteColor', icon: '🖍️', title: '背景色', color: true },
          { cmd: 'separator' },
          { cmd: 'fontSize', icon: '📏', title: '字号', select: true },
          { cmd: 'separator' },
          { cmd: 'justifyLeft', icon: '⬅️', title: '左对齐' },
          { cmd: 'justifyCenter', icon: '↔️', title: '居中' },
          { cmd: 'justifyRight', icon: '➡️', title: '右对齐' },
          { cmd: 'separator' },
          { cmd: 'insertUnorderedList', icon: '•', title: '无序列表' },
          { cmd: 'insertOrderedList', icon: '1.', title: '有序列表' },
        ];
        
        buttons.forEach(btn => {
          if (btn.cmd === 'separator') {
            const sep = document.createElement('div');
            sep.style.cssText = 'width: 1px; height: 24px; background: #ddd; margin: 0 4px;';
            toolbar.appendChild(sep);
          } else if (btn.select) {
            const select = document.createElement('select');
            select.style.cssText = 'padding: 4px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;';
            select.innerHTML = \`
              <option value="3">小</option>
              <option value="4" selected>正常</option>
              <option value="5">大</option>
              <option value="6">特大</option>
            \`;
            select.addEventListener('change', (e) => {
              document.execCommand('fontSize', false, e.target.value);
            });
            toolbar.appendChild(select);
          } else if (btn.color) {
            const colorBtn = document.createElement('button');
            colorBtn.innerHTML = btn.icon;
            colorBtn.title = btn.title;
            colorBtn.style.cssText = 'padding: 6px 10px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; font-size: 16px;';
            
            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.style.cssText = 'position: absolute; opacity: 0; width: 0; height: 0;';
            
            colorBtn.addEventListener('click', () => colorInput.click());
            colorInput.addEventListener('change', (e) => {
              document.execCommand(btn.cmd, false, e.target.value);
            });
            
            toolbar.appendChild(colorBtn);
            toolbar.appendChild(colorInput);
          } else {
            const button = document.createElement('button');
            button.innerHTML = btn.icon;
            button.title = btn.title;
            button.style.cssText = 'padding: 6px 10px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; font-weight: bold;';
            button.addEventListener('click', () => {
              document.execCommand(btn.cmd, false, null);
            });
            button.addEventListener('mouseenter', () => {
              button.style.background = '#f0f0f0';
            });
            button.addEventListener('mouseleave', () => {
              button.style.background = 'white';
            });
            toolbar.appendChild(button);
          }
        });
        
        return toolbar;
      }
      
      // 创建图片调整工具栏（简化版）
      function createImageToolbar() {
        const toolbar = document.createElement('div');
        toolbar.id = 'image-toolbar';
        toolbar.style.cssText = \`
          position: fixed;
          z-index: 9998;
          background: white;
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: none;
          flex-direction: column;
          gap: 8px;
          min-width: 180px;
        \`;
        
        toolbar.innerHTML = \`
          <div style="font-weight: 600; margin-bottom: 4px; color: #333; font-size: 13px;">🖼️ 图片工具</div>
          <div style="font-size: 11px; color: #666; margin-bottom: 8px;">拖拽移动 | 角落缩放</div>
          
          <!-- 替换图片 -->
          <input type="file" id="img-file-input" accept="image/*" style="display: none;">
          <button id="img-replace" style="width: 100%; padding: 8px; border: 1px solid #0066cc; background: #0066cc; color: white; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600; margin-bottom: 8px;">
            📁 替换图片
          </button>
          <div id="img-upload-status" style="font-size: 11px; color: #666; margin-bottom: 8px; text-align: center; display: none;"></div>
          
          <button id="img-delete" style="width: 100%; padding: 8px; border: 1px solid #dc3545; background: #dc3545; color: white; border-radius: 4px; cursor: pointer; font-size: 12px;">🗑️ 删除图片</button>
        \`;
        
        // 替换图片按钮
        const replaceBtn = toolbar.querySelector('#img-replace');
        const fileInput = toolbar.querySelector('#img-file-input');
        const uploadStatus = toolbar.querySelector('#img-upload-status');
        
        replaceBtn.addEventListener('click', () => {
          fileInput.click();
        });
        
        fileInput.addEventListener('change', async (e) => {
          const file = e.target.files?.[0];
          if (!file || !selectedImage) return;
          
          // 验证文件类型
          if (!file.type.startsWith('image/')) {
            showNotification('❌ 请选择图片文件', 'error');
            return;
          }
          
          // 验证文件大小（4MB限制）
          if (file.size > 4 * 1024 * 1024) {
            showNotification('❌ 图片大小不能超过4MB', 'error');
            return;
          }
          
          try {
            // 显示上传状态
            uploadStatus.style.display = 'block';
            uploadStatus.textContent = '⏳ 上传中...';
            replaceBtn.disabled = true;
            replaceBtn.style.opacity = '0.6';
            
            // 方案1: 使用 Base64 编码（适用于小图片，无需服务器）
            const reader = new FileReader();
            reader.onload = (event) => {
              const base64Url = event.target.result;
              selectedImage.src = base64Url;
              
              uploadStatus.textContent = '✅ 替换成功';
              uploadStatus.style.color = '#00a758';
              
              setTimeout(() => {
                uploadStatus.style.display = 'none';
                uploadStatus.style.color = '#666';
              }, 2000);
              
              replaceBtn.disabled = false;
              replaceBtn.style.opacity = '1';
              
              showNotification('✅ 图片已替换', 'success');
            };
            
            reader.onerror = () => {
              uploadStatus.textContent = '❌ 读取失败';
              uploadStatus.style.color = '#dc3545';
              replaceBtn.disabled = false;
              replaceBtn.style.opacity = '1';
              showNotification('❌ 图片读取失败', 'error');
            };
            
            reader.readAsDataURL(file);
            
            // 清空input，允许重复选择同一文件
            fileInput.value = '';
            
          } catch (error) {
            console.error('图片替换错误:', error);
            uploadStatus.textContent = '❌ 替换失败';
            uploadStatus.style.color = '#dc3545';
            replaceBtn.disabled = false;
            replaceBtn.style.opacity = '1';
            showNotification('❌ 图片替换失败', 'error');
          }
        });
        
        // 删除按钮
        toolbar.querySelector('#img-delete').addEventListener('click', () => {
          if (selectedImage) {
            selectedImage.remove();
            toolbar.style.display = 'none';
            selectedImage = null;
          }
        });
        
        return toolbar;
      }
      
      // 图片拖拽和缩放功能
      function makeImageDraggableAndResizable(img) {
        // 确保图片有定位
        img.style.position = 'relative';
        img.style.cursor = 'move';
        
        let isDragging = false;
        let isResizing = false;
        let startX, startY, startLeft, startTop, startWidth, startHeight;
        
        // 创建缩放手柄
        const resizeHandle = document.createElement('div');
        resizeHandle.style.cssText = \`
          position: absolute;
          bottom: -5px;
          right: -5px;
          width: 20px;
          height: 20px;
          background: #0066cc;
          border: 2px solid white;
          border-radius: 50%;
          cursor: nwse-resize;
          z-index: 10;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          display: none;
        \`;
        
        // 将图片包装在容器中
        const wrapper = document.createElement('div');
        const imgMargin = img.style.margin || '25px auto';
        wrapper.style.cssText = \`
          position: relative;
          display: inline-block;
          margin: \${imgMargin};
        \`;
        
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
        wrapper.appendChild(resizeHandle);
        
        // 重置图片的margin（已经在wrapper上了）
        img.style.margin = '0';
        
        // 鼠标按下 - 开始拖拽
        img.addEventListener('mousedown', (e) => {
          // 如果点击的是缩放手柄，不触发拖拽
          if (e.target === resizeHandle) return;
          
          e.preventDefault();
          e.stopPropagation();
          
          isDragging = true;
          startX = e.clientX;
          startY = e.clientY;
          
          // 获取wrapper的当前位置
          const rect = wrapper.getBoundingClientRect();
          const parentRect = wrapper.parentElement.getBoundingClientRect();
          startLeft = rect.left - parentRect.left;
          startTop = rect.top - parentRect.top;
          
          // 改为绝对定位以便自由移动
          wrapper.style.position = 'absolute';
          wrapper.style.left = startLeft + 'px';
          wrapper.style.top = startTop + 'px';
          wrapper.style.margin = '0';
          
          img.style.cursor = 'grabbing';
        });
        
        // 缩放手柄按下
        resizeHandle.addEventListener('mousedown', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          isResizing = true;
          startX = e.clientX;
          startY = e.clientY;
          startWidth = img.offsetWidth;
          startHeight = img.offsetHeight;
        });
        
        // 鼠标移动
        document.addEventListener('mousemove', (e) => {
          if (isDragging) {
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            wrapper.style.left = (startLeft + deltaX) + 'px';
            wrapper.style.top = (startTop + deltaY) + 'px';
          } else if (isResizing) {
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            // 保持宽高比
            const aspectRatio = startWidth / startHeight;
            const newWidth = Math.max(100, startWidth + deltaX);
            const newHeight = newWidth / aspectRatio;
            
            img.style.width = newWidth + 'px';
            img.style.height = newHeight + 'px';
            img.style.maxWidth = newWidth + 'px';
            img.style.maxHeight = newHeight + 'px';
          }
        });
        
        // 鼠标释放
        document.addEventListener('mouseup', () => {
          if (isDragging) {
            isDragging = false;
            img.style.cursor = 'move';
          }
          if (isResizing) {
            isResizing = false;
          }
        });
        
        // 选中时显示缩放手柄
        img.addEventListener('click', (e) => {
          e.stopPropagation();
          
          // 取消之前选中的图片
          document.querySelectorAll('.reveal .slides section img').forEach(otherImg => {
            const otherWrapper = otherImg.parentElement;
            if (otherWrapper && otherWrapper !== wrapper) {
              otherImg.style.outline = 'none';
              const otherHandle = otherWrapper.querySelector('div[style*="nwse-resize"]');
              if (otherHandle) otherHandle.style.display = 'none';
            }
          });
          
          // 选中当前图片
          selectedImage = img;
          img.style.outline = '3px solid #0066cc';
          resizeHandle.style.display = 'block';
          
          // 显示工具栏
          const rect = wrapper.getBoundingClientRect();
          imageToolbar.style.display = 'flex';
          imageToolbar.style.left = (rect.right + 10) + 'px';
          imageToolbar.style.top = rect.top + 'px';
        });
      }
      
      // 启用编辑模式
      function enableEditMode() {
        // 让所有文本元素可编辑
        const editableElements = document.querySelectorAll('.reveal .slides section h1, .reveal .slides section h2, .reveal .slides section h3, .reveal .slides section h4, .reveal .slides section p, .reveal .slides section li');
        
        editableElements.forEach(el => {
          el.setAttribute('contenteditable', 'true');
          el.style.outline = '2px dashed rgba(0, 102, 204, 0.3)';
          el.style.outlineOffset = '4px';
          el.style.cursor = 'text';
          
          // 聚焦时显示富文本工具栏
          el.addEventListener('focus', function() {
            this.style.outline = '2px solid #0066cc';
            this.style.background = 'rgba(0, 102, 204, 0.05)';
            toolbar.style.display = 'flex';
          });
          
          el.addEventListener('blur', function() {
            this.style.outline = '2px dashed rgba(0, 102, 204, 0.3)';
            this.style.background = 'transparent';
          });
        });
        
        // 让图片可拖拽和缩放
        const images = document.querySelectorAll('.reveal .slides section img');
        images.forEach(img => {
          makeImageResizable(img);
        });
        
        // 点击空白处取消选择
        document.addEventListener('click', function(e) {
          if (selectedImage && !e.target.closest('#image-toolbar') && e.target.tagName !== 'IMG') {
            selectedImage.style.outline = 'none';
            selectedImage = null;
            imageToolbar.style.display = 'none';
            
            // 隐藏所有缩放手柄
            document.querySelectorAll('div[style*="nwse-resize"]').forEach(handle => {
              handle.style.display = 'none';
            });
          }
        });
        
        // 显示提示
        showNotification('✏️ 编辑模式已启用！点击文本编辑，点击图片调整', 'info');
        
        // 禁用 Reveal.js 的键盘导航，避免冲突
        Reveal.configure({ keyboard: false });
      }
      
      // 禁用编辑模式
      function disableEditMode() {
        const editableElements = document.querySelectorAll('[contenteditable="true"]');
        
        editableElements.forEach(el => {
          el.removeAttribute('contenteditable');
          el.style.outline = 'none';
          el.style.cursor = 'default';
          el.style.background = 'transparent';
        });
        
        // 隐藏工具栏
        toolbar.style.display = 'none';
        imageToolbar.style.display = 'none';
        
        // 取消图片选择和隐藏缩放手柄
        if (selectedImage) {
          selectedImage.style.outline = 'none';
          selectedImage = null;
        }
        
        document.querySelectorAll('div[style*="nwse-resize"]').forEach(handle => {
          handle.style.display = 'none';
        });
        
        showNotification('✅ 修改已保存！', 'success');
        
        // 恢复 Reveal.js 的键盘导航
        Reveal.configure({ keyboard: true });
      }
      
      // 让图片可拖动调整大小
      function makeImageResizable(img) {
        img.style.cursor = 'pointer';
        img.style.position = 'relative';
        
        // 点击选中图片
        img.addEventListener('click', function(e) {
          e.stopPropagation();
          
          // 取消之前选中的图片
          if (selectedImage && selectedImage !== this) {
            removeResizeHandles(selectedImage);
          }
          
          // 选中当前图片
          selectedImage = this;
          addResizeHandles(this);
          
          // 显示图片工具栏
          const rect = this.getBoundingClientRect();
          imageToolbar.style.display = 'flex';
          imageToolbar.style.left = (rect.right + 10) + 'px';
          imageToolbar.style.top = rect.top + 'px';
          
          // 更新滑块值
          const currentWidth = parseInt(this.style.width) || this.offsetWidth;
          const currentHeight = parseInt(this.style.height) || this.offsetHeight;
          
          document.querySelector('#img-width').value = currentWidth;
          document.querySelector('#img-width-value').textContent = currentWidth + 'px';
          document.querySelector('#img-height').value = currentHeight;
          document.querySelector('#img-height-value').textContent = currentHeight + 'px';
        });
      }
      
      // 添加调整手柄
      function addResizeHandles(img) {
        // 如果已经有手柄，先移除
        removeResizeHandles(img);
        
        img.style.outline = '3px solid #0066cc';
        img.style.objectFit = 'fill'; // 允许自由拉伸
        
        // 创建包装容器
        const wrapper = document.createElement('div');
        wrapper.className = 'image-resize-wrapper';
        wrapper.style.cssText = \`
          position: relative;
          display: inline-block;
          max-width: 100%;
        \`;
        
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
        
        // 8个调整手柄的位置
        const handles = [
          { pos: 'nw', cursor: 'nw-resize', top: '-6px', left: '-6px' },
          { pos: 'n', cursor: 'n-resize', top: '-6px', left: '50%', transform: 'translateX(-50%)' },
          { pos: 'ne', cursor: 'ne-resize', top: '-6px', right: '-6px' },
          { pos: 'e', cursor: 'e-resize', top: '50%', right: '-6px', transform: 'translateY(-50%)' },
          { pos: 'se', cursor: 'se-resize', bottom: '-6px', right: '-6px' },
          { pos: 's', cursor: 's-resize', bottom: '-6px', left: '50%', transform: 'translateX(-50%)' },
          { pos: 'sw', cursor: 'sw-resize', bottom: '-6px', left: '-6px' },
          { pos: 'w', cursor: 'w-resize', top: '50%', left: '-6px', transform: 'translateY(-50%)' }
        ];
        
        handles.forEach(h => {
          const handle = document.createElement('div');
          handle.className = 'resize-handle resize-' + h.pos;
          handle.style.cssText = \`
            position: absolute;
            width: 12px;
            height: 12px;
            background: white;
            border: 2px solid #0066cc;
            border-radius: 50%;
            cursor: \${h.cursor};
            z-index: 10;
            \${h.top ? 'top: ' + h.top + ';' : ''}
            \${h.bottom ? 'bottom: ' + h.bottom + ';' : ''}
            \${h.left ? 'left: ' + h.left + ';' : ''}
            \${h.right ? 'right: ' + h.right + ';' : ''}
            \${h.transform ? 'transform: ' + h.transform + ';' : ''}
          \`;
          
          // 拖动调整大小
          handle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = img.offsetWidth;
            const startHeight = img.offsetHeight;
            const startLeft = img.offsetLeft;
            const startTop = img.offsetTop;
            
            function onMouseMove(e) {
              const deltaX = e.clientX - startX;
              const deltaY = e.clientY - startY;
              
              let newWidth = startWidth;
              let newHeight = startHeight;
              
              // 根据手柄位置计算新尺寸
              if (h.pos.includes('e')) newWidth = startWidth + deltaX;
              if (h.pos.includes('w')) newWidth = startWidth - deltaX;
              if (h.pos.includes('s')) newHeight = startHeight + deltaY;
              if (h.pos.includes('n')) newHeight = startHeight - deltaY;
              
              // 限制最小尺寸
              newWidth = Math.max(50, newWidth);
              newHeight = Math.max(50, newHeight);
              
              img.style.width = newWidth + 'px';
              img.style.height = newHeight + 'px';
              img.style.maxWidth = newWidth + 'px';
              img.style.maxHeight = newHeight + 'px';
              
              // 更新工具栏的滑块值
              document.querySelector('#img-width').value = newWidth;
              document.querySelector('#img-width-value').textContent = newWidth + 'px';
              document.querySelector('#img-height').value = newHeight;
              document.querySelector('#img-height-value').textContent = newHeight + 'px';
            }
            
            function onMouseUp() {
              document.removeEventListener('mousemove', onMouseMove);
              document.removeEventListener('mouseup', onMouseUp);
            }
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
          });
          
          wrapper.appendChild(handle);
        });
      }
      
      // 移除调整手柄
      function removeResizeHandles(img) {
        img.style.outline = 'none';
        const wrapper = img.closest('.image-resize-wrapper');
        if (wrapper) {
          const handles = wrapper.querySelectorAll('.resize-handle');
          handles.forEach(h => h.remove());
          
          // 如果要完全移除包装器
          if (wrapper.parentNode) {
            wrapper.parentNode.insertBefore(img, wrapper);
            wrapper.remove();
          }
        }
      }
      
      // 显示通知 - 快速显示和消失
      function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.textContent = message;
        
        let bgColor = '#0066cc';
        if (type === 'success') bgColor = '#00a758';
        if (type === 'error') bgColor = '#dc3545';
        
        notification.style.cssText = \`
          position: fixed;
          top: 80px;
          right: 20px;
          z-index: 9999;
          padding: 10px 18px;
          background: \${bgColor};
          color: white;
          border-radius: 6px;
          font-size: 13px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          animation: slideIn 0.15s ease;
        \`;
        
        document.body.appendChild(notification);
        
        // 0.5秒后快速消失
        setTimeout(() => {
          notification.style.animation = 'slideOut 0.15s ease';
          setTimeout(() => notification.remove(), 150);
        }, 500);
      }
      
      // 添加动画样式
      const style = document.createElement('style');
      style.textContent = \`
        @keyframes slideIn {
          from {
            transform: translateX(300px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(300px);
            opacity: 0;
          }
        }
      \`;
      document.head.appendChild(style);
    }
    
    // ==================== 使用说明 ====================
    // 编辑功能使用方法：
    // 1. 点击"下载 HTML"按钮，保存 HTML 文件到本地
    // 2. 用浏览器打开下载的 HTML 文件（不是在这个预览窗口中）
    // 3. 在打开的页面右上角会看到"✏️ 编辑模式"按钮
    // 4. 点击进入编辑模式，即可：
    //    - 点击任何文本进行富文本编辑（粗体、颜色、对齐等）
    //    - 点击任何图片调整大小和位置
    // 5. 编辑完成后点击"💾 导出编辑版"保存修改后的版本
    // 
    // 注意：预览窗口（iframe）中无法编辑，必须下载后在浏览器中打开才能编辑！
  
  </script>
</body>
</html>`;
}

/**
 * 将单个幻灯片内容包装成Reveal.js的section
 */
export function wrapSlideSection(content: string, attributes?: string): string {
  const attrs = attributes ? ` ${attributes}` : "";
  // 使用r-fit-text和r-stretch确保内容自适应并居中
  return `      <section${attrs}>
        <div class="slide-content-wrapper">
${content}
        </div>
      </section>`;
}
