# Prompt增强指南 - 教AI使用新组件

## 需要在`revealjs-content-generator.ts`中添加的内容

### 1. ECharts图表示例

在"可用的设计组件"部分添加：

```markdown
### 6. 数据可视化（ECharts）

**柱状图示例：**
\`\`\`html

<div class="chart-wrapper">
  <h4>市场份额对比</h4>
  <div class="chart-container" id="chart-bar"></div>
</div>
<script>
  const chartBar = echarts.init(document.getElementById('chart-bar'));
  chartBar.setOption({
    color: ['#0066CC'],
    grid: { left: '10%', right: '10%', bottom: '15%', top: '10%' },
    xAxis: { type: 'category', data: ['产品A', '产品B', '产品C', '产品D'] },
    yAxis: { type: 'value' },
    series: [{
      data: [120, 200, 150, 80],
      type: 'bar',
      barWidth: '50%'
    }]
  });
</script>
\`\`\`

**折线图示例：**
\`\`\`html

<div class="chart-wrapper">
  <h4>增长趋势</h4>
  <div class="chart-container" id="chart-line"></div>
</div>
<script>
  const chartLine = echarts.init(document.getElementById('chart-line'));
  chartLine.setOption({
    color: ['#0066CC'],
    grid: { left: '10%', right: '10%', bottom: '15%', top: '10%' },
    xAxis: { type: 'category', data: ['2020', '2021', '2022', '2023', '2024'] },
    yAxis: { type: 'value' },
    series: [{
      data: [100, 132, 161, 234, 310],
      type: 'line',
      smooth: true,
      lineStyle: { width: 3 }
    }]
  });
</script>
\`\`\`

**饼图示例：**
\`\`\`html

<div class="chart-wrapper">
  <h4>市场分布</h4>
  <div class="chart-container" id="chart-pie"></div>
</div>
<script>
  const chartPie = echarts.init(document.getElementById('chart-pie'));
  chartPie.setOption({
    color: ['#0066CC', '#0052a3', '#003d7a', '#66a3ff', '#99c2ff'],
    series: [{
      type: 'pie',
      radius: '60%',
      data: [
        { value: 335, name: '类别A' },
        { value: 310, name: '类别B' },
        { value: 234, name: '类别C' },
        { value: 135, name: '类别D' }
      ],
      label: { fontSize: 14 }
    }]
  });
</script>
\`\`\`
```

### 2. 进度条示例

```markdown
### 7. 进度条

\`\`\`html

<div class="progress-label">
  <span>项目完成度</span>
  <span>75%</span>
</div>
<div class="progress-bar">
  <div class="progress-fill" style="width: 75%;">75%</div>
</div>
\`\`\`
```

### 3. 时间线示例

```markdown
### 8. 时间线

\`\`\`html

<div class="timeline">
  <div class="timeline-item">
    <h4>2025年 Q1</h4>
    <p>启动阶段：完成需求分析和方案设计</p>
  </div>
  <div class="timeline-item">
    <h4>2025年 Q2-Q3</h4>
    <p>实施阶段：推进核心功能开发</p>
  </div>
  <div class="timeline-item">
    <h4>2025年 Q4</h4>
    <p>验收阶段：系统测试和上线部署</p>
  </div>
</div>
\`\`\`
```

### 4. 流程图示例

```markdown
### 9. 流程图

\`\`\`html

<div class="process-flow">
  <div class="flow-step">
    <h4>步骤1</h4>
    <p>需求分析</p>
  </div>
  <div class="flow-step">
    <h4>步骤2</h4>
    <p>方案设计</p>
  </div>
  <div class="flow-step">
    <h4>步骤3</h4>
    <p>开发实施</p>
  </div>
  <div class="flow-step">
    <h4>步骤4</h4>
    <p>测试上线</p>
  </div>
</div>
\`\`\`
```

### 5. 指标网格示例

```markdown
### 10. 指标网格

\`\`\`html

<div class="metrics-grid">
  <div class="metric-card">
    <div class="metric-label">年增长率</div>
    <div class="metric-value">45%</div>
    <div class="metric-change positive">↑ 12% vs 去年</div>
  </div>
  <div class="metric-card">
    <div class="metric-label">市场份额</div>
    <div class="metric-value">28%</div>
    <div class="metric-change positive">↑ 5% vs 去年</div>
  </div>
  <div class="metric-card">
    <div class="metric-label">客户满意度</div>
    <div class="metric-value">92分</div>
    <div class="metric-change positive">↑ 3分 vs 去年</div>
  </div>
</div>
\`\`\`
```

### 6. 对比卡片示例

```markdown
### 11. 对比卡片

\`\`\`html

<div class="comparison-cards">
  <div class="comparison-card">
    <h3>传统方案</h3>
    <ul>
      <li>成本高</li>
      <li>周期长</li>
      <li>灵活性差</li>
    </ul>
  </div>
  <div class="comparison-card highlight">
    <span class="comparison-badge">推荐</span>
    <h3>创新方案</h3>
    <ul>
      <li>成本降低40%</li>
      <li>周期缩短50%</li>
      <li>高度灵活</li>
    </ul>
  </div>
</div>
\`\`\`
```

---

## 更新后的设计原则

在Prompt中强调：

### 内容密度原则

1. **每页必须包含至少一个视觉元素**
   - 数据卡片、图表、进度条、时间线等
2. **数据优先**

   - 有数据就用图表展示
   - 有对比就用对比卡片
   - 有进度就用进度条
   - 有流程就用流程图

3. **避免纯文字页面**
   - 文字+数据卡片
   - 文字+图表
   - 文字+时间线

### 视觉层次原则

1. **使用颜色区分重要性**

   - 关键数字用`.key-number`
   - 重点词用`.highlight`
   - 推荐方案用`.comparison-card.highlight`

2. **使用布局创造对比**
   - `.two-columns`对比展示
   - `.three-columns`并列展示
   - `.comparison-cards`方案对比

---

## 示例：优化前 vs 优化后

### 优化前（纯文字）

```html
<h2>市场分析</h2>
<p>市场规模持续增长，预计2025年达到500亿元。</p>
<ul>
  <li>增长率：25%</li>
  <li>市场份额：30%</li>
  <li>客户数量：10万</li>
</ul>
```

### 优化后（丰富视觉）

```html
<h2>市场呈现强劲增长态势</h2>
<div class="two-columns">
  <div>
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">市场规模</div>
        <div class="metric-value">500亿</div>
        <div class="metric-change positive">↑ 25% YoY</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">市场份额</div>
        <div class="metric-value">30%</div>
        <div class="metric-change positive">↑ 5% YoY</div>
      </div>
    </div>
  </div>
  <div>
    <div class="chart-wrapper">
      <h4>市场规模增长趋势（亿元）</h4>
      <div class="chart-container" id="chart-market"></div>
    </div>
  </div>
</div>
<script>
  const chartMarket = echarts.init(document.getElementById("chart-market"));
  chartMarket.setOption({
    color: ["#0066CC"],
    grid: { left: "10%", right: "10%", bottom: "15%", top: "10%" },
    xAxis: {
      type: "category",
      data: ["2021", "2022", "2023", "2024", "2025E"],
    },
    yAxis: { type: "value" },
    series: [
      {
        data: [250, 312, 390, 450, 500],
        type: "line",
        smooth: true,
        lineStyle: { width: 3 },
        areaStyle: { opacity: 0.1 },
      },
    ],
  });
</script>
```

---

## 实施步骤

1. **备份现有Prompt**
2. **在"可用的设计组件"部分添加新组件示例**
3. **在"麦肯锡级别设计原则"部分添加内容密度原则**
4. **在示例中展示如何使用新组件**
5. **测试生成效果**
6. **根据效果调整Prompt**

---

**注意事项：**

- 每个图表需要唯一的ID
- ECharts脚本要放在HTML内容之后
- 确保数据真实可信
- 图表配色使用麦肯锡蓝（#0066CC）
