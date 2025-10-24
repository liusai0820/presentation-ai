/**
 * HTML幻灯片解析器
 * 用于解析AI生成的HTML幻灯片内容
 */

export interface HTMLSlide {
  id: string;
  index: number;
  html: string;
  title: string;
}

export class HTMLSlideParser {
  private slides: HTMLSlide[] = [];

  /**
   * 解析HTML内容，提取各个幻灯片
   */
  parse(content: string): HTMLSlide[] {
    this.slides = [];
    
    // 使用正则表达式匹配每个幻灯片
    // 格式: <!-- SLIDE X --> ... <!-- END SLIDE X -->
    const slideRegex = /<!-- SLIDE (\d+) -->([\s\S]*?)<!-- END SLIDE \1 -->/g;
    
    let match;
    while ((match = slideRegex.exec(content)) !== null) {
      const index = parseInt(match[1] || "0", 10);
      const html = match[2]?.trim() || "";
      
      // 提取标题（从<title>标签）
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      const title = titleMatch?.[1] || `幻灯片 ${index}`;
      
      this.slides.push({
        id: `slide-${index}`,
        index,
        html,
        title,
      });
    }
    
    // 按索引排序
    this.slides.sort((a, b) => a.index - b.index);
    
    console.log(`📄 解析到 ${this.slides.length} 个HTML幻灯片`);
    
    return this.slides;
  }

  /**
   * 获取所有幻灯片
   */
  getSlides(): HTMLSlide[] {
    return this.slides;
  }

  /**
   * 获取指定索引的幻灯片
   */
  getSlide(index: number): HTMLSlide | undefined {
    return this.slides.find(slide => slide.index === index);
  }

  /**
   * 获取幻灯片数量
   */
  getSlideCount(): number {
    return this.slides.length;
  }

  /**
   * 将所有幻灯片导出为单个HTML文件（用于预览）
   */
  exportAsMultiPageHTML(): string {
    const pages = this.slides.map((slide, idx) => {
      return `
<!-- Page ${idx + 1} -->
<div class="html-slide-page" data-slide-index="${idx}" style="page-break-after: always;">
  ${slide.html}
</div>
`;
    }).join('\n');

    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>演示文稿预览</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        
        .html-slide-page {
            width: 100vw;
            height: 100vh;
            overflow: hidden;
        }
        
        @media print {
            .html-slide-page {
                page-break-after: always;
            }
        }
    </style>
</head>
<body>
${pages}
</body>
</html>
`;
  }

  /**
   * 重置解析器
   */
  reset(): void {
    this.slides = [];
  }
}
