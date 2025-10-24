/**
 * HTML幻灯片基础模板
 * 
 * 这是一个强制的CSS模板，确保所有页面的基础结构和样式统一
 * AI只需要填充内容部分，不能修改基础CSS
 */

export const HTML_SLIDE_BASE_TEMPLATE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{SLIDE_TITLE}}</title>
    <style>
        /* ==================== 基础重置 ==================== */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        /* ==================== 页面容器（固定，不可修改） ==================== */
        html, body {
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
        
        body {
            font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif;
            background: #F8F9FA;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        /* ==================== 幻灯片容器（固定尺寸，不可修改） ==================== */
        .slide-container {
            width: 1200px;
            height: 675px;
            background: #FFFFFF;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        
        /* ==================== 页眉（固定位置和样式） ==================== */
        .slide-header {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 80px;
            padding: 24px 60px;
            border-bottom: 2px solid #E1E8ED;
            background: #FFFFFF;
            z-index: 100;
        }
        
        .slide-header h1 {
            font-size: 32px;
            font-weight: 700;
            color: #2C3E50;
            line-height: 1.2;
            margin: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        
        /* ==================== 内容区域（固定位置，可滚动但不显示滚动条） ==================== */
        .slide-content {
            position: absolute;
            top: 80px;
            left: 0;
            right: 0;
            bottom: 50px;
            padding: 40px 60px;
            overflow: hidden;
        }
        
        /* ==================== 页脚（固定位置和样式） ==================== */
        .slide-footer {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 50px;
            padding: 0 60px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #E1E8ED;
            background: #FFFFFF;
            z-index: 100;
        }
        
        .slide-footer .source {
            font-size: 12px;
            color: #95A5A6;
        }
        
        .slide-footer .page-number {
            font-size: 14px;
            color: #7F8C8D;
            font-weight: 600;
        }
        
        /* ==================== 通用内容样式 ==================== */
        .slide-content h2 {
            font-size: 28px;
            font-weight: 700;
            color: #2C3E50;
            margin-bottom: 24px;
            line-height: 1.3;
        }
        
        .slide-content h3 {
            font-size: 22px;
            font-weight: 600;
            color: #34495E;
            margin-bottom: 16px;
            line-height: 1.4;
        }
        
        .slide-content p {
            font-size: 18px;
            color: #2C3E50;
            line-height: 1.6;
            margin-bottom: 16px;
        }
        
        .slide-content ul, .slide-content ol {
            margin-left: 24px;
            margin-bottom: 16px;
        }
        
        .slide-content li {
            font-size: 18px;
            color: #2C3E50;
            line-height: 1.8;
            margin-bottom: 12px;
        }
        
        /* ==================== 网格布局 ==================== */
        .grid-2 {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 32px;
            height: 100%;
        }
        
        .grid-3 {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
            height: 100%;
        }
        
        .grid-4 {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
            height: 100%;
        }
        
        /* ==================== 卡片样式 ==================== */
        .card {
            background: #F8F9FA;
            border-left: 4px solid #3498DB;
            padding: 24px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }
        
        .card-title {
            font-size: 18px;
            font-weight: 600;
            color: #2C3E50;
            margin-bottom: 12px;
        }
        
        .card-content {
            font-size: 16px;
            color: #7F8C8D;
            line-height: 1.6;
        }
        
        /* ==================== 数字卡片 ==================== */
        .metric-card {
            background: linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%);
            border-left: 4px solid #3498DB;
            padding: 32px 24px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }
        
        .metric-value {
            font-size: 56px;
            font-weight: 700;
            color: #2C3E50;
            line-height: 1;
            margin-bottom: 8px;
        }
        
        .metric-unit {
            font-size: 24px;
            color: #3498DB;
            font-weight: 600;
        }
        
        .metric-label {
            font-size: 16px;
            color: #7F8C8D;
            margin-top: 12px;
            font-weight: 500;
        }
        
        .metric-description {
            font-size: 14px;
            color: #95A5A6;
            margin-top: 8px;
            line-height: 1.5;
        }
        
        /* ==================== 进度条 ==================== */
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #E1E8ED;
            border-radius: 4px;
            overflow: hidden;
            margin: 8px 0;
        }
        
        .progress-fill {
            height: 100%;
            background: #3498DB;
            border-radius: 4px;
            transition: width 0.3s ease;
        }
        
        /* ==================== 列表样式 ==================== */
        .bullet-list {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        
        .bullet-list li {
            position: relative;
            padding-left: 32px;
            margin-bottom: 16px;
            font-size: 18px;
            line-height: 1.6;
            color: #2C3E50;
        }
        
        .bullet-list li::before {
            content: "";
            position: absolute;
            left: 0;
            top: 8px;
            width: 8px;
            height: 8px;
            background: #3498DB;
            border-radius: 50%;
        }
        
        /* ==================== 编号列表 ==================== */
        .numbered-list {
            list-style: none;
            counter-reset: item;
            margin: 0;
            padding: 0;
        }
        
        .numbered-list li {
            position: relative;
            padding-left: 48px;
            margin-bottom: 20px;
            font-size: 18px;
            line-height: 1.6;
            color: #2C3E50;
        }
        
        .numbered-list li::before {
            content: counter(item);
            counter-increment: item;
            position: absolute;
            left: 0;
            top: 0;
            width: 32px;
            height: 32px;
            background: #3498DB;
            color: #FFFFFF;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 16px;
        }
        
        /* ==================== 居中内容（用于封面页、结束页） ==================== */
        .centered-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            text-align: center;
        }
        
        .centered-content h1 {
            font-size: 56px;
            font-weight: 700;
            color: #2C3E50;
            margin-bottom: 24px;
            line-height: 1.2;
        }
        
        .centered-content h2 {
            font-size: 28px;
            font-weight: 400;
            color: #7F8C8D;
            margin-bottom: 48px;
            line-height: 1.4;
        }
        
        .centered-content .date {
            font-size: 16px;
            color: #95A5A6;
        }
        
        /* ==================== 自定义样式区域 ==================== */
        {{CUSTOM_STYLES}}
    </style>
</head>
<body>
    <div class="slide-container">
        {{SLIDE_HEADER}}
        
        <div class="slide-content">
            {{SLIDE_CONTENT}}
        </div>
        
        <div class="slide-footer">
            <div class="source">{{DATA_SOURCE}}</div>
            <div class="page-number">{{PAGE_NUMBER}} / {{TOTAL_PAGES}}</div>
        </div>
    </div>
</body>
</html>`;

/**
 * 生成完整的HTML幻灯片
 */
export function generateSlideHTML(params: {
  slideTitle: string;
  slideHeader: string;
  slideContent: string;
  dataSource: string;
  pageNumber: number;
  totalPages: number;
  customStyles?: string;
}): string {
  return HTML_SLIDE_BASE_TEMPLATE
    .replace('{{SLIDE_TITLE}}', params.slideTitle)
    .replace('{{SLIDE_HEADER}}', params.slideHeader)
    .replace('{{SLIDE_CONTENT}}', params.slideContent)
    .replace('{{DATA_SOURCE}}', params.dataSource)
    .replace('{{PAGE_NUMBER}}', params.pageNumber.toString())
    .replace('{{TOTAL_PAGES}}', params.totalPages.toString())
    .replace('{{CUSTOM_STYLES}}', params.customStyles || '');
}

/**
 * 页眉模板（标准页面）
 */
export const STANDARD_HEADER = `<div class="slide-header">
    <h1>{{TITLE}}</h1>
</div>`;

/**
 * 页眉模板（封面页/结束页 - 无页眉）
 */
export const NO_HEADER = '';

/**
 * 常用内容模板
 */
export const CONTENT_TEMPLATES = {
  // 2列数据卡片
  twoColumnMetrics: `<div class="grid-2">
    <div class="metric-card">
        <div class="metric-label">{{LABEL_1}}</div>
        <div class="metric-value">{{VALUE_1}}<span class="metric-unit">{{UNIT_1}}</span></div>
        <div class="metric-description">{{DESC_1}}</div>
    </div>
    <div class="metric-card">
        <div class="metric-label">{{LABEL_2}}</div>
        <div class="metric-value">{{VALUE_2}}<span class="metric-unit">{{UNIT_2}}</span></div>
        <div class="metric-description">{{DESC_2}}</div>
    </div>
</div>`,

  // 4列数据卡片
  fourColumnMetrics: `<div class="grid-4">
    <div class="metric-card">
        <div class="metric-label">{{LABEL_1}}</div>
        <div class="metric-value">{{VALUE_1}}<span class="metric-unit">{{UNIT_1}}</span></div>
        <div class="metric-description">{{DESC_1}}</div>
    </div>
    <div class="metric-card">
        <div class="metric-label">{{LABEL_2}}</div>
        <div class="metric-value">{{VALUE_2}}<span class="metric-unit">{{UNIT_2}}</span></div>
        <div class="metric-description">{{DESC_2}}</div>
    </div>
    <div class="metric-card">
        <div class="metric-label">{{LABEL_3}}</div>
        <div class="metric-value">{{VALUE_3}}<span class="metric-unit">{{UNIT_3}}</span></div>
        <div class="metric-description">{{DESC_3}}</div>
    </div>
    <div class="metric-card">
        <div class="metric-label">{{LABEL_4}}</div>
        <div class="metric-value">{{VALUE_4}}<span class="metric-unit">{{UNIT_4}}</span></div>
        <div class="metric-description">{{DESC_4}}</div>
    </div>
</div>`,

  // 要点列表
  bulletList: `<ul class="bullet-list">
    <li>{{POINT_1}}</li>
    <li>{{POINT_2}}</li>
    <li>{{POINT_3}}</li>
    <li>{{POINT_4}}</li>
</ul>`,

  // 编号列表
  numberedList: `<ol class="numbered-list">
    <li>{{POINT_1}}</li>
    <li>{{POINT_2}}</li>
    <li>{{POINT_3}}</li>
</ol>`,

  // 封面页
  coverPage: `<div class="centered-content">
    <h1>{{MAIN_TITLE}}</h1>
    <h2>{{SUBTITLE}}</h2>
    <div class="date">{{DATE}}</div>
</div>`,
};
