# Git 提交指南 - Reveal.js 模式优化

## 提交信息

### 标题
```
feat: 优化 Reveal.js 模式 - 修复页面宽度问题并添加图片生成功能
```

### 详细描述
```
本次提交优化了 Reveal.js 演示模式的两个关键问题：

1. 修复页面初始显示很窄的问题
   - 为 Reveal.js 模式创建独立的全宽布局
   - 移除不必要的宽度限制
   - 优化 RevealJSPresentationView 组件布局
   - 使用 max-w-[1600px] 限制最大宽度，避免过宽

2. 实现图片自动生成功能
   - 在 AI Prompt 中添加图片使用指南
   - 集成 Unsplash Source API
   - 要求封面页必须有图片
   - 要求每 2-3 页至少有 1 页包含图片
   - 提供详细的关键词选择建议

技术细节：
- 使用 Unsplash Source API (https://source.unsplash.com/960x540/?keywords)
- 图片尺寸统一为 960x540 (16:9 比例)
- 图片样式统一：圆角、间距
- 关键词使用英文，支持多个词组合

影响范围：
- Main.tsx: 布局逻辑优化
- RevealJSPresentationView.tsx: 组件布局优化
- revealjs-content-generator.ts: Prompt 增强

相关文档：
- REVEALJS_OPTIMIZATION.md: 详细的优化记录
- DOCUMENTATION_INDEX.md: 更新文档索引
```

## 修改的文件

### 核心文件
1. `src/components/presentation/presentation-page/Main.tsx`
   - 为 Reveal.js 模式创建独立的全宽布局
   - 其他模式保持原有布局

2. `src/components/presentation/presentation-page/RevealJSPresentationView.tsx`
   - 优化容器布局
   - 使用 max-w-[1600px] 限制最大宽度
   - 简化样式，使用 Tailwind 类

3. `src/lib/prompts/revealjs-content-generator.ts`
   - 添加图片插入组件说明
   - 更新页面类型参考
   - 添加图片使用示例
   - 强化最终指令

### 文档文件
1. `REVEALJS_OPTIMIZATION.md` (新建)
   - 完整的优化记录
   - 问题分析和解决方案
   - 技术细节说明
   - 测试验证指南

2. `DOCUMENTATION_INDEX.md`
   - 添加新文档的索引
   - 更新最近更新记录

3. `GIT_COMMIT_REVEALJS_OPTIMIZATION.md` (新建)
   - Git 提交指南

## 提交命令

### 1. 查看修改
```bash
git status
git diff
```

### 2. 添加文件
```bash
# 添加核心文件
git add src/components/presentation/presentation-page/Main.tsx
git add src/components/presentation/presentation-page/RevealJSPresentationView.tsx
git add src/lib/prompts/revealjs-content-generator.ts

# 添加文档文件
git add REVEALJS_OPTIMIZATION.md
git add DOCUMENTATION_INDEX.md
git add GIT_COMMIT_REVEALJS_OPTIMIZATION.md
```

### 3. 提交
```bash
git commit -m "feat: 优化 Reveal.js 模式 - 修复页面宽度问题并添加图片生成功能

本次提交优化了 Reveal.js 演示模式的两个关键问题：

1. 修复页面初始显示很窄的问题
   - 为 Reveal.js 模式创建独立的全宽布局
   - 移除不必要的宽度限制
   - 优化 RevealJSPresentationView 组件布局

2. 实现图片自动生成功能
   - 在 AI Prompt 中添加图片使用指南
   - 集成 Unsplash Source API
   - 要求封面页必须有图片
   - 要求每 2-3 页至少有 1 页包含图片

相关文档：REVEALJS_OPTIMIZATION.md"
```

### 4. 推送
```bash
git push origin main
```

## 验证清单

提交前请确认：

- [ ] 代码修改已测试
- [ ] 页面宽度问题已修复
- [ ] 图片生成功能正常工作
- [ ] 文档已更新
- [ ] 没有引入新的错误
- [ ] 代码风格符合项目规范
- [ ] 提交信息清晰明确

## 测试步骤

### 1. 测试页面宽度
```bash
# 启动开发服务器
npm run dev

# 访问演示页面
# 1. 选择 Reveal.js 模式
# 2. 生成演示文稿
# 3. 确认页面从一开始就全宽显示
```

### 2. 测试图片生成
```bash
# 生成新的演示文稿
# 1. 检查封面页是否有图片
# 2. 检查每 2-3 页是否至少有 1 页包含图片
# 3. 检查图片是否与内容主题相关
# 4. 检查图片样式是否统一
```

### 3. 测试其他模式
```bash
# 确保其他模式不受影响
# 1. 测试 XML 组件模式
# 2. 测试 HTML 模式
# 3. 测试 PowerPoint 模式
```

## 回滚方案

如果发现问题需要回滚：

```bash
# 查看提交历史
git log --oneline

# 回滚到上一个提交
git revert HEAD

# 或者硬回滚（慎用）
git reset --hard HEAD~1
```

## 后续工作

1. 监控用户反馈
2. 收集图片质量数据
3. 优化图片关键词选择
4. 考虑添加图片缓存
5. 考虑支持多图片源

## 相关 Issue

- #XXX: Reveal.js 页面初始显示很窄
- #XXX: Reveal.js 演示文稿缺少图片

## 相关 PR

- #XXX: 优化 Reveal.js 模式

---

**提交日期**: 2024-10-27
**提交者**: [Your Name]
**审核者**: [Reviewer Name]
