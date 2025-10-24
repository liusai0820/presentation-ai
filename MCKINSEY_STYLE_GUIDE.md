# 麦肯锡级别演示文稿设计指南

## 🎯 设计哲学

麦肯锡的演示文稿以**简洁、专业、数据驱动**著称。每一页都遵循"一页一观点"的原则，用最少的文字传达最核心的信息。

## 📐 核心设计原则

### 1. 金字塔原理（Pyramid Principle）

```
页面结构：
┌─────────────────────────────┐
│  H2: 核心观点（结论）        │  ← 最重要，放在最上面
├─────────────────────────────┤
│  H3: 支撑论据1              │
│  • 细节1                    │  ← 论据支撑结论
│  • 细节2                    │
├─────────────────────────────┤
│  H3: 支撑论据2              │
│  • 细节1                    │
│  • 细节2                    │
└─────────────────────────────┘
```

**示例：**
```html
<h2>AI医疗市场呈现爆发式增长</h2>
<div class="two-columns">
  <div>
    <h3>市场规模快速扩张</h3>
    <p>全球市场从 <span class="key-number">$150亿</span> 增长至 <span class="key-number">$1,870亿</span></p>
  </div>
  <div>
    <h3>中国市场领跑全球</h3>
    <p>年复合增长率达到 <span class="highlight">42.3%</span></p>
  </div>
</div>
```

### 2. MECE原则（Mutually Exclusive, Collectively Exhaustive）

每页的要点必须：
- **相互独立**：不重复
- **完全穷尽**：覆盖所有关键方面

**好的示例：**
```html
<h2>三大核心应用场景</h2>
<div class="three-columns">
  <div class="data-card">
    <h4>诊断辅助</h4>
    <div class="data-value">92%</div>
    <p>准确率超过人类医生</p>
  </div>
  <div class="data-card">
    <h4>药物研发</h4>
    <div class="data-value">60%</div>
    <p>研发周期缩短</p>
  </div>
  <div class="data-card">
    <h4>个性化治疗</h4>
    <div class="data-value">3-5倍</div>
    <p>治疗效果提升</p>
  </div>
</div>
```

### 3. 数据驱动（Data-Driven）

麦肯锡的每个观点都有数据支撑。

**数据展示层级：**
1. **关键数字** - 用 `.key-number` 在文本中突出
2. **数据卡片** - 用 `.data-card` 独立展示
3. **图表容器** - 用 `.chart-container` 包裹可视化

**示例：**
```html
<h2>市场增长超预期</h2>
<p>2024年市场规模达到 <span class="key-number">$150亿</span>，较去年增长 <span class="highlight">45%</span></p>

<div class="three-columns">
  <div class="data-card">
    <h4>北美市场</h4>
    <div class="data-value">$67.5亿</div>
    <p>占全球份额45%</p>
  </div>
  <div class="data-card">
    <h4>欧洲市场</h4>
    <div class="data-value">$45亿</div>
    <p>占全球份额30%</p>
  </div>
  <div class="data-card">
    <h4>亚太市场</h4>
    <div class="data-value">$37.5亿</div>
    <p>增速最快，达52%</p>
  </div>
</div>
```

## 🎨 视觉设计规范

### 标题规范

| 元素 | 用途 | 字数限制 | 示例 |
|------|------|----------|------|
| H1 | 封面标题 | 5-10字 | "AI重塑医疗行业" |
| H2 | 页面核心观点 | 8-15字 | "市场规模将在5年内增长10倍" |
| H3 | 支撑论据 | 5-8字 | "北美市场领先" |
| H4 | 数据卡片标题 | 3-5字 | "市场份额" |

### 布局规范

#### 1. 封面页
```html
<h1>演示文稿标题</h1>
<p>副标题或核心价值主张</p>
<div class="divider"></div>
<p style="opacity: 0.6; font-size: 0.9em;">日期 | 报告类型</p>
```

#### 2. 观点页（单列）
```html
<h2>核心观点</h2>
<ul>
  <li>支撑要点1</li>
  <li>支撑要点2</li>
  <li>支撑要点3</li>
</ul>
<blockquote>
  "关键引用或总结"
</blockquote>
```

#### 3. 对比页（两列）
```html
<h2>核心观点</h2>
<div class="two-columns">
  <div>
    <h3>方面A</h3>
    <p>内容...</p>
  </div>
  <div>
    <h3>方面B</h3>
    <p>内容...</p>
  </div>
</div>
```

#### 4. 数据页（三列）
```html
<h2>核心观点</h2>
<div class="three-columns">
  <div class="data-card">
    <h4>指标1</h4>
    <div class="data-value">数值</div>
    <p>说明</p>
  </div>
  <!-- 重复2次 -->
</div>
```

#### 5. 建议页（分栏）
```html
<h2>战略建议</h2>
<div class="two-columns">
  <div>
    <h3>短期行动</h3>
    <ol>
      <li>行动1</li>
      <li>行动2</li>
    </ol>
  </div>
  <div>
    <h3>长期布局</h3>
    <ol>
      <li>行动1</li>
      <li>行动2</li>
    </ol>
  </div>
</div>
```

## 📊 数据可视化规范

### 1. 关键数字强调
```html
<p>市场规模从 <span class="key-number">$150亿</span> 增长至 <span class="key-number">$1,870亿</span></p>
```
**效果：** 数字以1.8倍大小、蓝色显示

### 2. 百分比和增长率
```html
<p>年复合增长率达到 <span class="highlight">37.5%</span></p>
```
**效果：** 蓝色背景高亮

### 3. 数据卡片
```html
<div class="data-card">
  <h4>指标名称</h4>
  <div class="data-value">85%</div>
  <p>简短说明（不超过15字）</p>
</div>
```
**效果：** 白色卡片，左侧彩色边框，悬停上浮

### 4. 趋势展示
```html
<div class="chart-container">
  <h4>市场规模趋势</h4>
  <p style="font-size: 2em; font-weight: 200; margin: 20px 0;">
    150 → 1,870
  </p>
  <p style="opacity: 0.7;">2024-2030年</p>
</div>
```

## ✍️ 文字规范

### 1. 标题写法
- ✅ **好：** "AI医疗市场呈现爆发式增长"
- ❌ **差：** "关于AI医疗市场的一些观察"

### 2. 数据表达
- ✅ **好：** "市场规模达到$150亿，增长45%"
- ❌ **差：** "市场规模很大，增长很快"

### 3. 列表要点
- ✅ **好：** "建立标准化数据采集体系"
- ❌ **差：** "我们需要更好的数据"

### 4. 结论表达
- ✅ **好：** "建议在6个月内启动试点项目"
- ❌ **差：** "可以考虑做一些尝试"

## 🎯 完整页面示例

### 示例1：市场分析页
```html
<h2>AI医疗市场进入快速增长期</h2>
<div class="two-columns">
  <div>
    <p>全球市场规模从2024年的 <span class="key-number">$150亿</span> 增长至2030年的 <span class="key-number">$1,870亿</span></p>
    <ul>
      <li>年复合增长率达到 <span class="highlight">37.5%</span></li>
      <li>北美市场占据 <span class="highlight">45%</span> 份额</li>
      <li>中国市场增速领先全球，达 <span class="highlight">42.3%</span></li>
    </ul>
  </div>
  <div class="chart-container">
    <h4>市场规模预测（亿美元）</h4>
    <p style="font-size: 2.5em; font-weight: 200; margin: 20px 0; color: #0066CC;">
      150 → 1,870
    </p>
    <p style="opacity: 0.7;">2024-2030年复合增长率：37.5%</p>
  </div>
</div>
```

### 示例2：数据对比页
```html
<h2>三大应用场景各具优势</h2>
<div class="three-columns">
  <div class="data-card">
    <h4>诊断辅助</h4>
    <div class="data-value">92%</div>
    <p>准确率超过人类医生平均水平</p>
    <div class="divider"></div>
    <p style="font-size: 0.85em; opacity: 0.7;">市场规模：$45亿</p>
  </div>
  <div class="data-card">
    <h4>药物研发</h4>
    <div class="data-value">60%</div>
    <p>研发周期缩短幅度</p>
    <div class="divider"></div>
    <p style="font-size: 0.85em; opacity: 0.7;">市场规模：$38亿</p>
  </div>
  <div class="data-card">
    <h4>个性化治疗</h4>
    <div class="data-value">3-5倍</div>
    <p>治疗效果提升倍数</p>
    <div class="divider"></div>
    <p style="font-size: 0.85em; opacity: 0.7;">市场规模：$67亿</p>
  </div>
</div>
```

### 示例3：战略建议页
```html
<h2>分阶段推进AI医疗战略</h2>
<div class="two-columns">
  <div>
    <h3>第一阶段（6-12个月）</h3>
    <span class="badge">试点验证</span>
    <ol>
      <li>选择影像诊断作为切入点</li>
      <li>与3-5家三甲医院建立合作</li>
      <li>完成1000例临床验证</li>
      <li>启动NMPA审批流程</li>
    </ol>
  </div>
  <div>
    <h3>第二阶段（1-2年）</h3>
    <span class="badge">规模化</span>
    <ol>
      <li>拓展至50家医院</li>
      <li>覆盖5个细分病种</li>
      <li>建立商业化收费模式</li>
      <li>实现收支平衡</li>
    </ol>
  </div>
</div>
<div class="divider"></div>
<p style="opacity: 0.7; font-size: 0.9em;">
  <strong>关键成功因素：</strong>数据质量、监管合规、临床验证、商业模式
</p>
```

## 🚫 常见错误

### 1. 信息过载
❌ **错误：** 一页放10个要点
✅ **正确：** 一页最多3-5个要点

### 2. 缺乏数据支撑
❌ **错误：** "市场增长很快"
✅ **正确：** "市场增长45%，达到$150亿"

### 3. 标题不明确
❌ **错误：** "市场情况"
✅ **正确：** "AI医疗市场呈现爆发式增长"

### 4. 视觉混乱
❌ **错误：** 混用多种布局和样式
✅ **正确：** 统一使用预定义的布局类

### 5. 缺乏层次
❌ **错误：** 所有文字一样大
✅ **正确：** 使用H2、H3、关键数字建立层次

## 🎨 主题选择建议

| 场景 | 推荐主题 | 原因 |
|------|----------|------|
| 董事会汇报 | 麦肯锡白 | 简洁专业，易于打印 |
| 客户提案 | BCG极简 | 现代感强，突出内容 |
| 内部培训 | 贝恩经典 | 易读性好，适合长时间观看 |
| 技术分享 | 深色专业 | 减少眼睛疲劳 |
| 产品发布 | 科技蓝 | 创新感强 |

## 📏 尺寸和间距

- **页面内边距：** 40px 60px
- **标题下边距：** 0.8em
- **卡片间距：** 24-40px
- **列间距：** 24-40px
- **列表项间距：** 16px

## 🎯 检查清单

在生成演示文稿前，确保：

- [ ] 每页只有一个核心观点（H2）
- [ ] 标题简洁有力（8-15字）
- [ ] 关键数据用 `.key-number` 或 `.data-value` 突出
- [ ] 使用 `.highlight` 标记重点
- [ ] 每页最多3-5个要点
- [ ] 数据都有说明和上下文
- [ ] 布局清晰，使用预定义的布局类
- [ ] 视觉层次分明
- [ ] 结论明确、可执行

---

**记住：麦肯锡的演示文稿不是为了展示你知道多少，而是为了让观众在最短时间内理解最核心的信息。**

**Less is More. 简洁即是力量。**
