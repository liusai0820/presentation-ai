# PowerPoint 模式实现文档

## 更新日期
2024年10月27日

---

## 概述

PowerPoint 模式是一个专门优化的生成模式，旨在生成可以完美导出为 PPTX 格式的演示文稿。

### 核心特点
- ✅ 使用与 XML 编辑器相同的格式
- ✅ 针对 16:9 比例优化
- ✅ 支持完整的组件库
- ✅ 可以在浏览器中预览和编辑
- ✅ 可以无损导出为 PPTX 文件

---

## 技术架构

### 生成流程
```
用户输入 → PowerPoint API → AI 生成 XML → SlideParser 解析 → Plate 编辑器 → 用户编辑 → 导出 PPTX
```

### 与其他模式的关系
- **XML 模式**：通用的富文本编辑器模式
- **HTML 模式**：自定义网页演示
- **Reveal.js 模式**：专业网页演示
- **PowerPoint 模式**：优化了 prompt 的 XML 模式，专注于 PPTX 导出

---

## XML 格式规范

### 基础结构
```xml
<PRESENTATION>
  <SECTION>
    <!-- 第一张幻灯片 -->
  </SECTION>
  <SECTION>
    <!-- 第二张幻灯片 -->
  </SECTION>
</PRESENTATION>
```

### 关键规则
1. ✅ 每个 `<SECTION>` 代表一张幻灯片
2. ✅ 不要在 SECTION 标签上添加属性
3. ✅ 使用标准 HTML 标签
4. ✅ 使用专用组件标签
5. ✅ 所有标签必须正确闭合

---

## 支持的组件

### 1. 基础文本
- `<H1>` - 主标题
- `<H2>` - 副标题/章节标题
- `<H3>` - 小标题
- `<P>` - 段落文本

### 2. 图片
```xml
<IMG query="detailed English description" />
```

### 3. 列表组件
- `<BULLETS>` - 项目符号列表
- `<ICONS>` - 图标列表

### 4. 流程组件
- `<ARROWS>` - 箭头流程
- `<TIMELINE>` - 时间线
- `<PYRAMID>` - 金字塔结构

### 5. 布局组件
- `<COLUMNS>` - 分栏布局
- `<TABLE>` - 表格

---

## Prompt 设计要点

### 1. 格式严格性
- 明确禁止使用自定义标签
- 明确禁止在 SECTION 上添加属性
- 提供正确和错误的示例对比

### 2. 内容质量控制
- 每页 200-300 字
- 3-5 个信息块
- 每个要点有 2-3 句详细说明

### 3. 视觉元素
- 每页至少一个视觉元素
- 图片查询详细、专业
- 合理使用不同组件

### 4. PPTX 兼容性
- 16:9 比例优化
- 避免过于复杂的嵌套
- 确保所有组件都能正确导出

---

## 幻灯片类型模板

### 封面页
```xml
<SECTION>
  <H1>演示文稿主标题</H1>
  <H2>副标题</H2>
  <P>日期</P>
  <IMG query="professional cover background" />
</SECTION>
```

### 标准内容页
```xml
<SECTION>
  <H2>页面标题</H2>
  <BULLETS>
    <DIV>
      <H3>要点1</H3>
      <P>详细说明</P>
    </DIV>
    <DIV>
      <H3>要点2</H3>
      <P>详细说明</P>
    </DIV>
  </BULLETS>
  <IMG query="supporting imagery" />
</SECTION>
```

### 对比页
```xml
<SECTION>
  <H2>对比分析</H2>
  <COLUMNS>
    <COLUMN>
      <H3>方案A</H3>
      <BULLETS>...</BULLETS>
    </COLUMN>
    <COLUMN>
      <H3>方案B</H3>
      <BULLETS>...</BULLETS>
    </COLUMN>
  </COLUMNS>
</SECTION>
```

### 流程页
```xml
<SECTION>
  <H2>实施流程</H2>
  <ARROWS>
    <DIV>
      <H3>步骤1</H3>
      <P>说明</P>
    </DIV>
    <DIV>
      <H3>步骤2</H3>
      <P>说明</P>
    </DIV>
  </ARROWS>
</SECTION>
```

### 总结页
```xml
<SECTION>
  <H2>核心要点总结</H2>
  <ICONS>
    <ICON query="icon description">
      <H3>结论1</H3>
      <P>总结</P>
    </ICON>
    <ICON query="icon description">
      <H3>结论2</H3>
      <P>总结</P>
    </ICON>
  </ICONS>
  <P style="text-align: center;">谢谢！</P>
</SECTION>
```

---

## 实现细节

### API 端点
- **路径**: `/api/presentation/generate_powerpoint`
- **方法**: POST
- **返回**: 纯文本 XML

### 前端处理
1. 用户选择 PowerPoint 模式
2. 调用 PowerPoint API 生成 XML
3. 使用 SlideParser 解析 XML
4. 在 Plate 编辑器中显示
5. 用户可以编辑
6. 导出为 PPTX

### 关键文件
```
src/app/api/presentation/generate_powerpoint/route.ts  # PowerPoint API
src/components/presentation/utils/parser.ts            # XML 解析器
src/components/presentation/presentation-page/         # 显示组件
src/states/presentation-state.ts                       # 状态管理
```

---

## 与 XML 模式的区别

| 特性 | XML 模式 | PowerPoint 模式 |
|------|----------|----------------|
| XML 格式 | 相同 | 相同 |
| 解析器 | 相同 | 相同 |
| 显示方式 | 相同 | 相同 |
| Prompt 优化 | 通用 | 针对 PPTX 优化 |
| 内容密度 | 灵活 | 严格控制 |
| 视觉元素 | 可选 | 强制要求 |
| 图片查询 | 简单 | 详细专业 |
| 目标用途 | 通用编辑 | PPTX 导出 |

---

## 测试要点

### 功能测试
- [ ] 生成的 XML 格式正确
- [ ] SlideParser 能正确解析
- [ ] 幻灯片显示为 16:9 比例
- [ ] 所有组件正确渲染
- [ ] 图片查询生成正确
- [ ] 可以在编辑器中编辑
- [ ] 可以导出为 PPTX

### 质量测试
- [ ] 内容密度适中（不过多不过少）
- [ ] 每页有视觉元素
- [ ] 布局多样化
- [ ] 专业性强

### 兼容性测试
- [ ] 导出的 PPTX 在 PowerPoint 中正常显示
- [ ] 导出的 PPTX 在 WPS 中正常显示
- [ ] 导出的 PPTX 在 Keynote 中正常显示

---

## 已知限制

1. **图片生成**：依赖外部 API，可能失败
2. **复杂布局**：某些复杂嵌套可能导出时有问题
3. **字体**：导出时使用系统默认字体
4. **动画**：不支持动画效果

---

## 未来优化方向

### 短期
1. 优化图片查询质量
2. 增加更多组件类型
3. 改进 PPTX 导出质量

### 长期
1. 支持自定义模板
2. 支持动画效果
3. 支持视频嵌入
4. 支持协作编辑

---

## 故障排查

### 问题：生成的幻灯片是空白的
**原因**：XML 格式不正确，解析器无法识别
**解决**：检查 XML 是否使用了正确的标签，没有自定义标签

### 问题：幻灯片比例不对
**原因**：SlideContainer 没有设置 aspect-ratio
**解决**：已在 SlideContainer 中添加 `aspect-[16/9]` 类

### 问题：内容过多溢出
**原因**：AI 生成的内容超过页面容量
**解决**：Prompt 中已添加严格的内容密度控制

### 问题：图片不显示
**原因**：图片查询不够详细或 API 失败
**解决**：优化图片查询描述，添加重试机制

---

## 总结

PowerPoint 模式通过优化 Prompt 和严格的格式控制，实现了高质量的 PPTX 导出。它本质上是 XML 模式的一个特化版本，专注于生成可以完美导出为 PowerPoint 文件的演示文稿。

**核心优势：**
- 🎯 专注于 PPTX 导出
- 📐 16:9 比例优化
- 🎨 视觉元素丰富
- ✏️ 可编辑性强
- 💼 专业性高

---

**文档维护者：** Kiro AI  
**最后更新：** 2024-10-27  
**版本：** v1.0
