"use client";

import { REVEAL_THEMES } from "@/lib/presentation/html-themes/revealjs-adapter";
import { useState } from "react";

export default function TestRevealJSPage() {
  const [topic, setTopic] = useState("特斯拉投资价值分析报告");
  const [theme, setTheme] = useState("white");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/presentation/generate_revealjs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          theme,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generation failed");
      }

      // 调试：检查返回的HTML
      console.log("API返回的数据:", {
        success: data.success,
        title: data.title,
        theme: data.theme,
        htmlLength: data.html?.length,
        htmlPreview: data.html?.substring(0, 200),
      });

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result?.html) return;

    const blob = new Blob([result.html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.title || "presentation"}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Reveal.js 演示文稿生成测试</h1>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm">
            ✨ <strong>麦肯锡级别专业主题</strong> -
            数据驱动、简洁专业、商业级质量
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                演示文稿主题
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="输入演示文稿主题..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                视觉主题
                <span className="ml-2 text-xs text-gray-500">
                  (推荐使用麦肯锡白、BCG极简或贝恩经典)
                </span>
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="选择视觉主题"
              >
                {REVEAL_THEMES.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                当前选择：{REVEAL_THEMES.find((t) => t.name === theme)?.label}
              </p>
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading || !topic}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "生成中..." : "生成演示文稿"}
            </button>

            {loading && (
              <div className="text-center text-sm text-gray-600">
                <p>正在使用麦肯锡级别设计标准生成演示文稿...</p>
                <p className="text-xs mt-1">预计需要 8-15 秒</p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{result.title}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    主题: {result.theme} | Tokens: {result.tokensUsed}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  下载 HTML
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">预览</h3>
              <div className="mb-2 text-xs text-gray-500">
                HTML大小: {result.html?.length || 0} 字符
              </div>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <iframe
                  srcDoc={result.html}
                  className="w-full h-[600px]"
                  title="Presentation Preview"
                  sandbox="allow-scripts allow-same-origin"
                  onLoad={() => {
                    console.log("iframe加载完成");
                    console.log("HTML内容预览:", result.html.substring(0, 1000));
                  }}
                  onError={(e) => console.error("iframe加载错误:", e)}
                  style={{ border: "none" }}
                />
              </div>
              
              {/* 调试信息 */}
              <details className="mt-4 bg-gray-50 p-4 rounded">
                <summary className="cursor-pointer font-medium text-sm">
                  🔍 查看生成的HTML源代码（调试用）
                </summary>
                <pre className="mt-2 text-xs overflow-auto max-h-96 bg-white p-4 rounded border">
                  {result.html}
                </pre>
              </details>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">
                  💡 <strong>导航提示：</strong>使用方向键 (← →)
                  或点击控制按钮来导航幻灯片
                </p>
                <p className="text-sm text-gray-600">
                  🎨 <strong>麦肯锡风格特点：</strong>
                </p>
                <ul className="text-xs text-gray-500 ml-6 space-y-1">
                  <li>• 数据卡片带左侧彩色边框和悬停效果</li>
                  <li>• 关键数字用蓝色突出显示（1.8倍大小）</li>
                  <li>• H2标题带下划线强调</li>
                  <li>• 专业的列表样式（自定义圆点/数字）</li>
                  <li>• 简洁的留白和清晰的层次</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
