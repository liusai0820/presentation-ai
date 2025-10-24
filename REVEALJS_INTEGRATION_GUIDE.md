# Reveal.js 集成指南

## 概述

将Reveal.js功能集成到现有的演示文稿生成流程中，让用户可以选择使用传统HTML模式或Reveal.js模式。

---

## 集成方案

### 方案A：添加生成模式选择（推荐）

在现有的`generationMode`基础上，添加`revealjs`选项。

#### 优点
- 用户可以自由选择
- 保留现有功能
- 灵活性高

#### 缺点
- 需要UI改动
- 增加用户选择成本

---

### 方案B：自动选择模式

根据场景自动选择最合适的生成模式。

#### 优点
- 用户体验简单
- 自动优化

#### 缺点
- 用户无法手动控制
- 需要智能判断逻辑

---

## 推荐实现：方案A（用户选择）

### 1. 更新状态管理

**文件：** `src/states/presentation-state.ts`

```typescript
// 添加生成模式类型
export type GenerationMode = 'pptx' | 'html' | 'revealjs';

// 在状态中添加
interface PresentationState {
  // ... 现有字段
  generationMode: GenerationMode;
  setGenerationMode: (mode: GenerationMode) => void;
}

// 在create中添加
setGenerationMode: (mode) => set({ generationMode: mode }),
```

### 2. 更新UI组件

**文件：** `src/components/presentation/dashboard/PresentationInput.tsx`

添加生成模式选择器：

```tsx
<div className="mb-4">
  <label className="block text-sm font-medium mb-2">
    生成模式
  </label>
  <select
    value={generationMode}
    onChange={(e) => setGenerationMode(e.target.value as GenerationMode)}
    className="w-full px-4 py-2 border rounded-lg"
  >
    <option value="pptx">PowerPoint (PPTX)</option>
    <option value="html">HTML (自定义样式)</option>
    <option value="revealjs">Reveal.js (专业演示)</option>
  </select>
  
  {generationMode === 'revealjs' && (
    <p className="text-sm text-gray-600 mt-2">
      ✨ Reveal.js模式：麦肯锡级别专业演示，支持键盘导航、全屏演示
    </p>
  )}
</div>
```

### 3. 更新生成管理器

**文件：** `src/components/presentation/dashboard/PresentationGenerationManager.tsx`

在HTML生成部分添加Reveal.js支持：

```typescript
// 在 generatePresentation 函数中
if (generationMode === "html" || generationMode === "revealjs") {
  console.log(`🎨 使用${generationMode === 'revealjs' ? 'Reveal.js' : 'HTML'}生成模式`);
  
  void (async () => {
    try {
      const { originalDocumentContent } = usePresentationState.getState();
      
      // 根据模式选择API端点
      const endpoint = generationMode === 'revealjs'
        ? '/api/presentation/generate_revealjs'
        : '/api/presentation/generate_html';
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: currentPresentationTitle ?? presentationInput ?? "",
          prompt: presentationInput ?? "",
          outline,
          language,
          theme: theme || (generationMode === 'revealjs' ? 'mckinsey' : 'professional'),
          searchResults: stateSearchResults,
          analyzedDocument,
          originalDocumentContent,
        }),
      });

      if (!response.ok) {
        throw new Error(`${generationMode}生成失败`);
      }

      if (generationMode === 'revealjs') {
        // Reveal.js返回完整HTML，不是流式
        const data = await response.json();
        
        if (!data.success || !data.html) {
          throw new Error("Reveal.js生成失败");
        }
        
        console.log("✅ Reveal.js生成完成");
        console.log("   - 标题:", data.title);
        console.log("   - 主题:", data.theme);
        console.log("   - Tokens:", data.tokensUsed);
        
        // 存储完整的HTML
        setGeneratedHtml(data.html);
        
        // 创建一个虚拟的幻灯片列表用于预览
        const slideCount = (data.html.match(/<section/g) || []).length;
        const virtualSlides = Array.from({ length: slideCount }, (_, i) => ({
          id: `slide-${i + 1}`,
          index: i,
          title: `幻灯片 ${i + 1}`,
          content: `<section>幻灯片 ${i + 1}</section>`,
        }));
        
        setHtmlSlides(virtualSlides);
        console.log(`✅ 创建了${slideCount}个虚拟幻灯片用于预览`);
        
      } else {
        // 原有的HTML流式处理逻辑
        const reader = response.body?.getReader();
        // ... 现有代码
      }
      
      setIsGeneratingPresentation(false);
      
    } catch (error) {
      console.error(`❌ ${generationMode}生成错误:`, error);
      setError(error instanceof Error ? error.message : "生成失败");
      setIsGeneratingPresentation(false);
    }
  })();
}
```

### 4. 更新Reveal.js API

**文件：** `src/app/api/presentation/generate_revealjs/route.ts`

确保API接受与HTML API相同的参数：

```typescript
interface RevealJSRequest {
  title: string;
  prompt: string;
  outline?: string[];  // 添加outline支持
  language: string;
  theme?: string;
  searchResults?: Array<{ query: string; results: unknown[] }>;
  analyzedDocument?: AnalyzedContent | null;
  originalDocumentContent?: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    await getUserIdOrDev(session);

    const body = await request.json() as RevealJSRequest;
    const {
      title,
      prompt,
      outline,
      language,
      theme = 'mckinsey',
      searchResults,
      analyzedDocument,
      originalDocumentContent,
    } = body;

    // 构建topic（如果有outline，使用outline；否则使用prompt）
    const topic = title || prompt;
    
    // 构建原始文档内容
    let documentContent = '';
    if (originalDocumentContent) {
      documentContent = originalDocumentContent;
    }
    
    // 如果有outline，添加到文档内容中
    if (outline && outline.length > 0) {
      documentContent += '\n\n大纲：\n' + outline.join('\n\n');
    }
    
    // 格式化搜索结果
    let searchResultsText = '';
    if (searchResults && searchResults.length > 0) {
      searchResultsText = searchResults
        .map((item, index) => {
          const results = Array.isArray(item.results) ? item.results : [];
          return `搜索 ${index + 1}: ${item.query}\n${results.slice(0, 3).map((r: any) => 
            `- ${r.title || ''}\n  ${r.content || ''}`
          ).join('\n')}`;
        })
        .join('\n\n');
    }

    console.log(`🎨 开始生成Reveal.js演示文稿: ${topic}`);
    console.log(`   - 主题: ${theme}`);
    console.log(`   - 语言: ${language}`);
    console.log(`   - 大纲页数: ${outline?.length || 0}`);
    console.log(`   - 原始文档: ${documentContent ? '有' : '无'}`);
    console.log(`   - 搜索结果: ${searchResultsText ? '有' : '无'}`);

    // 生成Prompt
    const promptText = generateRevealJSPrompt(
      topic,
      documentContent || undefined,
      searchResultsText || undefined
    );

    // ... 其余代码保持不变
  }
}
```

---

## 使用流程

### 用户操作流程

1. **输入内容**
   - 上传文档或输入主题
   - 系统分析文档生成大纲

2. **选择生成模式**
   - PowerPoint (PPTX) - 传统PPT文件
   - HTML (自定义样式) - 灵活的HTML
   - Reveal.js (专业演示) - 麦肯锡级别

3. **选择主题**（Reveal.js模式）
   - 麦肯锡（推荐）
   - BCG波士顿
   - 贝恩咨询
   - Reveal白色/黑色

4. **生成和预览**
   - 实时生成
   - 在线预览
   - 下载HTML文件

5. **演示**
   - 用浏览器打开HTML
   - 方向键翻页
   - F键全屏

---

## 技术细节

### API对比

| 特性 | HTML API | Reveal.js API |
|------|----------|---------------|
| 端点 | `/api/presentation/generate_html` | `/api/presentation/generate_revealjs` |
| 响应类型 | 流式（Stream） | JSON |
| 输出格式 | HTML片段 | 完整HTML文档 |
| 主题 | professional等 | mckinsey, bcg, bain |
| 导航 | 自定义 | Reveal.js内置 |

### 数据流

```
用户输入
  ↓
文档分析
  ↓
生成大纲
  ↓
选择模式 → [HTML模式] → generate_html API → 流式HTML
         → [Reveal.js模式] → generate_revealjs API → 完整HTML
  ↓
预览/下载
```

---

## 测试清单

### 功能测试

- [ ] 可以选择Reveal.js模式
- [ ] 可以选择不同主题
- [ ] 生成成功并返回HTML
- [ ] HTML可以在浏览器中打开
- [ ] 内容正确显示
- [ ] 翻页功能正常
- [ ] 控制按钮工作
- [ ] 可以下载HTML文件

### 兼容性测试

- [ ] 与现有HTML模式不冲突
- [ ] 与PPTX模式不冲突
- [ ] 文档分析功能正常
- [ ] 搜索功能正常
- [ ] 大纲生成正常

### 边界测试

- [ ] 空内容处理
- [ ] 超长内容处理
- [ ] 网络错误处理
- [ ] 超时处理

---

## 常见问题

### Q: Reveal.js和HTML模式有什么区别？

**A:** 
- **HTML模式**：灵活的自定义HTML，适合需要特殊设计的场景
- **Reveal.js模式**：专业的演示框架，适合商业演示，有完整的导航和控制

### Q: 为什么Reveal.js不用流式响应？

**A:** Reveal.js需要生成完整的HTML文档结构，包括head、body、script等，不适合流式输出。

### Q: 可以在Reveal.js模式下自定义CSS吗？

**A:** 可以！在`src/lib/presentation/html-themes/`目录下创建新的CSS文件，然后在`REVEAL_THEMES`中注册。

### Q: 如何添加新的Reveal.js主题？

**A:** 
1. 创建CSS文件：`src/lib/presentation/html-themes/your-theme.css`
2. 在`revealjs-adapter.ts`的`REVEAL_THEMES`数组中添加
3. 在`theme-css-loader.ts`的`isCustomTheme`中添加主题名

---

## 下一步

1. ✅ 实现基础集成
2. ✅ 测试功能
3. ⏳ 添加更多主题
4. ⏳ 优化性能
5. ⏳ 添加导出PDF功能

---

## 相关文档

- **REVEALJS_CRITICAL_FIX.md** - 关键问题修复
- **REVEALJS_SUCCESS_SUMMARY.md** - 功能总结
- **MCKINSEY_STYLE_GUIDE.md** - 麦肯锡风格指南

---

**最后更新：** 2024年10月24日
