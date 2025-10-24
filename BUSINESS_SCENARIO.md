# 企业演示文稿AI生成系统 - 业务场景分析与改造方案

## 🎯 核心业务场景

### 当前状态
- **用户输入**: 文字描述主题
- **AI操作**: 发散式生成内容
- **输出**: 新的演示文稿

### 实际需求(优先级排序)
1. **文档上传** - 上传已有文档(Word/PDF/PPT等)
2. **内容解析** - AI读取文档内容
3. **结构重组** - 将文档内容优化成演示文稿
4. **设计美化** - 应用主题、美化布局、添加图片
5. **企业定制** - 政府/咨询相关的内容优化

---

## 📋 改造方案

### 第一阶段:文件上传功能 (优先)
#### 目标
让用户能够上传文档,系统自动提取内容

#### 需要改造的组件
```
src/components/presentation/dashboard/
├── PresentationInput.tsx          ← 改: 添加文件上传区域
├── FileUploadZone.tsx             ← 新: 拖拽上传组件
└── DocumentPreview.tsx            ← 新: 文档预览组件
```

#### 工作流程
```
用户上传文件
    ↓
服务端提取文本内容
    ↓
AI解析文档结构(标题、段落、列表等)
    ↓
自动生成演示大纲
    ↓
用户编辑/确认
    ↓
生成最终演示文稿
```

#### 支持的文件格式
- PDF (.pdf)
- Word (.docx, .doc)
- PowerPoint (.pptx)
- 纯文本 (.txt, .md)

---

### 第二阶段:文档内容智能优化
#### 目标
将原始文档转化为适合演示的内容

#### AI处理步骤
1. **结构识别** - 识别文档的逻辑结构
2. **内容浓缩** - 提取关键信息,去除冗余
3. **层级优化** - 组织成清晰的演示逻辑
4. **要点提炼** - 每张幻灯片的要点
5. **图表建议** - 建议哪些内容用图表展示

#### API端点
```
POST /api/presentation/parse-document
- 输入: 文件内容
- 输出: 结构化的演示大纲

POST /api/presentation/optimize-content
- 输入: 原始内容 + 幻灯片数量
- 输出: 优化后的演示内容
```

---

### 第三阶段:企业场景定制
#### 目标
针对政府/咨询机构的特殊需求优化

#### 定制方向
1. **政府报告模板**
   - 汇报结构(现状→问题→方案→效果)
   - 规范表述(正式用语)
   - 数据展示(表格、统计图)

2. **咨询方案模板**
   - 问题分析
   - 解决方案
   - 实施计划
   - 预期效果

3. **会议材料模板**
   - 议程安排
   - 要点讨论
   - 决议事项

---

## 🔧 技术改造清单

### 后端改造

#### 1. 文件处理库
```bash
# 需要添加的依赖
pnpm add pdf-parse mammoth pptx-parser
```

#### 2. 新建API路由
```
src/app/api/
├── document/
│   ├── upload.ts          ← 文件上传处理
│   ├── parse.ts           ← 文档内容解析
│   └── extract-text.ts    ← 文本提取
├── presentation/
│   ├── from-document.ts   ← 从文档生成演示
│   └── parse-structure.ts ← 结构分析
```

#### 3. 新建数据模型(Prisma)
```prisma
model UploadedDocument {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  
  filename  String
  fileType  String   // pdf, docx, pptx, txt
  fileUrl   String
  
  rawText   String   @db.Text
  structure Json     // 解析后的结构
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model PresentationFromDoc {
  id         String   @id @default(cuid())
  docId      String
  document   UploadedDocument @relation(fields: [docId], references: [id])
  
  outline    String[] // 从文档生成的大纲
  content    Json     // 生成的演示内容
  
  createdAt  DateTime @default(now())
}
```

### 前端改造

#### 1. 新组件
```
src/components/presentation/dashboard/
├── DocumentUploadZone.tsx        ← 主要上传区
├── DocumentList.tsx              ← 已上传文档列表
├── DocumentParser.tsx            ← 文档解析预览
└── PresentationModeSwitch.tsx   ← 模式切换(文本/文档)
```

#### 2. 改造现有组件
```
PresentationInput.tsx
- 添加Tab: 文本输入 vs 文档上传
- 文档上传区
- 文档内容预览
```

#### 3. 工作流UI
```
DocumentUpload
    ↓ (预览)
DocumentPreview
    ↓ (编辑)
OutlineEditor
    ↓ (确认)
PresentationGenerator
    ↓
FinalPresentation
```

---

## 📊 用户使用流程(新)

### 场景1:上传政府报告
```
1. 打开应用
2. 切换到"上传文档"标签
3. 拖拽上传Word文件 (政府工作汇报.docx)
4. 系统自动提取内容、生成大纲
5. 用户预览、编辑大纲
6. 选择"政府报告"主题
7. 一键生成演示文稿
8. 编辑、美化、导出
```

### 场景2:将招标文案转成方案演示
```
1. 打开应用
2. 上传招标文件(PDF)
3. 系统提取关键信息
4. 自动生成:
   - 项目概述
   - 技术方案
   - 实施计划
   - 预期效果
5. 用户可以调整排序、删除、添加内容
6. 应用咨询公司主题色
7. 生成最终演示
```

---

## 🎯 优先级建议

### 第1周:核心功能(MVP)
- ✅ 文件上传UI
- ✅ PDF/Word文本提取
- ✅ 简单内容解析
- ✅ 从文档生成大纲
- ✅ 用户可编辑大纲

### 第2周:优化体验
- ⏳ 文档预览
- ⏳ 结构识别优化
- ⏳ 内容去重
- ⏳ 大纲自动分组

### 第3周:企业定制
- ⏳ 政府报告模板
- ⏳ 咨询方案模板
- ⏳ 企业品牌定制

---

## 📦 建议的代码结构

```
src/
├── lib/
│   ├── document-parser/
│   │   ├── pdf.ts         # PDF解析
│   │   ├── word.ts        # Word解析
│   │   ├── pptx.ts        # PowerPoint解析
│   │   └── utils.ts       # 通用工具
│   │
│   └── content-analyzer/
│       ├── structure.ts    # 内容结构识别
│       ├── extractor.ts    # 关键信息提取
│       └── formatter.ts    # 内容格式化
│
├── app/
│   ├── api/
│   │   └── document/
│   │       ├── upload.ts
│   │       ├── parse.ts
│   │       └── analyze.ts
│   │
│   └── _actions/
│       ├── document/
│       │   ├── uploadDocument.ts
│       │   ├── parseDocument.ts
│       │   └── generateFromDoc.ts
│
└── components/
    └── presentation/
        ├── document-upload/
        │   ├── UploadZone.tsx
        │   ├── FileList.tsx
        │   └── Preview.tsx
        │
        └── dashboard/
            ├── InputModeSwitch.tsx
            └── DocumentTab.tsx
```

---

## 🚀 立即开始的建议

1. **第一步** - 改造输入框
   - 添加Tab切换(文本输入/文档上传)
   - 添加拖拽上传区域
   - 显示文件列表

2. **第二步** - 实现文件解析
   - 安装PDF/Word解析库
   - 创建后端解析API
   - 提取文本内容

3. **第三步** - 集成到演示生成
   - 从解析内容生成大纲
   - 修改现有的生成流程
   - 用户可编辑

---

## 💡 核心差异点

| 方面 | 原始功能 | 新功能 |
|-----|--------|--------|
| 输入 | 用户手写主题 | 上传已有文档 |
| AI操作 | 发散生成 | 结构提取+优化 |
| 内容来源 | AI创意 | 文档内容 |
| 用户角色 | 创意者 | 整理者 |
| 适用场景 | 创意演示 | 报告总结 |

---

## 📝 总结

这个改造方向会让系统从"创意生成工具"转变为"内容智能转换工具",更符合你们咨询机构的实际工作流程:

**文档上传 → AI理解 → 智能重组 → 美化生成 → 导出使用**

相比原来的"凭空想象创作",这样更贴近日常的报告、方案、总结工作。

建议我们先从**第一步(改造输入框)**开始,一步步精细化调整。

