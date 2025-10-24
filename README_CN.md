# ALLWEONE® AI 演示文稿生成器

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)

> ⭐ **帮助我们触达更多开发者，为项目点个 Star！**

一个开源的 AI 驱动演示文稿生成器，几分钟内创建精美、专业的幻灯片。受 Gamma.app 启发，结合 AI 的强大能力和直观的设计，帮助您轻松创建令人惊艳的演示文稿。

## 🔗 快速链接

- 🌐 [在线演示](http://presentation.allweone.com)
- 🎥 [视频教程](https://www.youtube.com/watch?v=UUePLJeFqVQ)
- 💬 [Discord 社区](https://discord.gg/fsMHMhAHRV)
- 📖 [English README](README.md)

---

## 🌟 核心特性

### 🎨 演示文稿生成
- **AI 驱动内容生成**：基于任何主题生成完整演示文稿
- **双模式生成**：
  - **HTML 模式**：基于 Reveal.js 的快速、轻量级演示
  - **富编辑器模式**：功能完整的拖拽式编辑器
- **智能大纲**：AI 生成大纲，可在最终确定前审阅和编辑
- **实时生成**：实时观看演示文稿的构建过程
- **网络搜索集成**：可选的实时网络搜索增强内容

### 🎭 专业主题
- **麦肯锡风格主题**：专业咨询级别的设计
- **9+ 内置主题**：精心设计，适用于不同场景
- **自定义主题创建器**：从零开始构建和保存自己的主题
- **Reveal.js 集成**：现代化、响应式的 HTML 演示

### ✏️ 丰富的编辑体验
- **Plate 编辑器**：强大的富文本编辑器，支持完整格式化
- **拖拽功能**：直观的幻灯片重排和元素操作
- **图片生成**：AI 驱动的图片创建，支持多种模型
- **媒体嵌入**：轻松添加图片、视频和其他媒体
- **自动保存**：工作内容自动保存

### 🎯 演示工具
- **演示模式**：直接在应用中演示
- **全屏支持**：无缝的全屏演示体验
- **导出选项**：下载为 HTML 或 PowerPoint (PPTX)
- **响应式设计**：支持桌面、平板和移动设备

---

## 🧰 技术栈

### 核心框架
- **Next.js 14** - React 框架（App Router）
- **TypeScript** - 类型安全开发
- **Tailwind CSS** - 实用优先的 CSS 框架

### AI 与内容生成
- **OpenAI API** - GPT 模型内容生成
- **OpenRouter** - 多模型 AI 路由
- **Together AI** - 图片生成
- **Tavily API** - 网络搜索集成

### 演示引擎
- **Reveal.js** - HTML 演示框架
- **Plate Editor** - 富文本编辑
- **ECharts** - 数据可视化和图表

### 数据库与认证
- **PostgreSQL** - 主数据库
- **Prisma ORM** - 类型安全的数据库访问
- **NextAuth.js** - 认证解决方案

---

## 🚀 快速开始

### 前置要求

确保已安装以下内容：
- **Node.js** 18.x 或更高版本
- **pnpm**（推荐）或 npm/yarn
- **PostgreSQL** 数据库
- 所需的 API 密钥

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone git@github.com:allweonedev/presentation-ai.git
   cd presentation-ai
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **配置环境变量**
   
   复制 `.env.example` 为 `.env` 并填入您的值：
   ```env
   # AI 提供商
   OPENAI_API_KEY="your-openai-key"
   OPENROUTER_API_KEY="your-openrouter-key"
   TOGETHER_AI_API_KEY="your-together-ai-key"
   
   # 认证
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # 服务
   UPLOADTHING_TOKEN="your-uploadthing-token"
   UNSPLASH_ACCESS_KEY="your-unsplash-key"
   TAVILY_API_KEY="your-tavily-key"
   
   # 数据库
   DATABASE_URL="postgresql://user:password@localhost:5432/presentation_ai"
   ```

4. **初始化数据库**
   ```bash
   pnpm db:push
   ```

5. **启动开发服务器**
   ```bash
   pnpm dev
   ```

6. **打开应用**
   
   访问 [http://localhost:3000](http://localhost:3000)

### 快速使用指南

1. **登录**网站
2. **输入主题**
3. **配置设置**：
   - 幻灯片数量（推荐 5-10 页）
   - 语言偏好
   - 生成模式（HTML/富编辑器）
   - 启用网络搜索（可选）
4. **生成大纲**并审阅/编辑
5. **选择主题**和图片来源
6. **生成演示**并实时观看构建过程
7. **编辑、演示或导出**最终演示文稿

---

## 📚 文档

### 核心文档

| 文档 | 说明 |
|------|------|
| [REVEALJS_INTEGRATION_GUIDE.md](REVEALJS_INTEGRATION_GUIDE.md) | Reveal.js 集成完整指南 |
| [REVEALJS_LAYOUT_OPTIMIZATION.md](REVEALJS_LAYOUT_OPTIMIZATION.md) | 布局和样式优化详情 |
| [PROMPT_ENHANCEMENT_GUIDE.md](PROMPT_ENHANCEMENT_GUIDE.md) | AI 提示词工程最佳实践 |
| [MCKINSEY_STYLE_GUIDE.md](MCKINSEY_STYLE_GUIDE.md) | 专业主题设计指南 |

### 功能指南

| 文档 | 说明 |
|------|------|
| [CUSTOM_THEMES_GUIDE.md](CUSTOM_THEMES_GUIDE.md) | 如何创建自定义主题 |
| [HTML_GENERATION_GUIDE.md](HTML_GENERATION_GUIDE.md) | HTML 演示生成 |
| [GENERATION_MODE_PROPOSAL.md](GENERATION_MODE_PROPOSAL.md) | 理解生成模式 |

---

## 📁 项目结构

```
presentation-ai/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/presentation/        # 演示生成 API
│   │   ├── dashboard/               # 主仪表板
│   │   └── presentation/            # 演示页面
│   │
│   ├── components/                   # React 组件
│   │   ├── presentation/            # 演示相关组件
│   │   │   ├── dashboard/          # 仪表板 UI
│   │   │   ├── editor/             # 富文本编辑器
│   │   │   ├── outline/            # 大纲编辑器
│   │   │   └── presentation-page/  # 演示查看器
│   │   └── ui/                      # 共享 UI 组件
│   │
│   ├── lib/                          # 工具库
│   │   ├── presentation/            # 演示逻辑
│   │   │   ├── html-themes/        # Reveal.js 主题
│   │   │   └── html-assembler-revealjs.ts
│   │   └── prompts/                 # AI 提示词
│   │
│   └── states/                       # 状态管理
│
├── prisma/                           # 数据库
├── public/themes/                    # 主题 CSS 文件
└── docs/                             # 文档
```

---

## 🗺️ 路线图

### ✅ 已完成
- [x] AI 驱动的内容生成
- [x] Reveal.js HTML 演示
- [x] Plate 富文本编辑器
- [x] 专业麦肯锡风格主题
- [x] 自定义主题创建器
- [x] 网络搜索集成
- [x] 图片生成（AI 和库存）
- [x] 全屏演示模式
- [x] 布局优化（2024年10月）

### 🟡 进行中
- [ ] 导出为 PowerPoint (.pptx)
- [ ] 媒体嵌入改进
- [ ] 更多内置主题（计划 15+）
- [ ] 移动端响应式增强
- [ ] 高级图表生成

### 🔴 计划中
- [ ] 导出为 PDF
- [ ] 实时协作
- [ ] 模板库
- [ ] 动画和过渡效果
- [ ] 语音录制
- [ ] 云存储集成
- [ ] 演示分析
- [ ] AI 演讲备注
- [ ] 自定义字体上传
- [ ] 插件系统
- [ ] 公共 API

---

## 🤝 贡献

我们欢迎社区贡献！

### 贡献方式
- 🐛 报告 bug 和问题
- 💡 建议新功能
- 📝 改进文档
- 🎨 设计新主题
- 💻 提交 Pull Request

详细指南请参阅 [CONTRIBUTING.md](CONTRIBUTING.md)。

---

## 📝 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

---

## 💬 支持与社区

需要帮助或想要交流？

- 💬 [Discord 社区](https://discord.gg/wSVNudUBdY)
- 🐛 [报告 Bug](https://github.com/allweonedev/presentation-ai/issues)
- 💡 [功能建议](https://github.com/allweonedev/presentation-ai/issues)

---

<div align="center">

**由 ALLWEONE™ 团队用 ❤️ 构建**

[⭐ 在 GitHub 上给我们 Star](https://github.com/allweonedev/presentation-ai) • [🌐 访问网站](http://presentation.allweone.com) • [💬 加入 Discord](https://discord.gg/wSVNudUBdY)

</div>
