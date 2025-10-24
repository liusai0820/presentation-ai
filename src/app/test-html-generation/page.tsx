"use client";

import { HTMLSlideViewer } from "@/components/presentation/html-slides/HTMLSlideViewer";
import { Button } from "@/components/ui/button";
import { HTMLSlideParser } from "@/lib/html-slide-parser";
import { useState } from "react";
import { toast } from "sonner";

export default function TestHTMLGenerationPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [htmlSlides, setHtmlSlides] = useState<
    Array<{
      id: string;
      index: number;
      html: string;
      title: string;
    }>
  >([]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    toast.loading("正在生成HTML演示文稿...");

    try {
      const response = await fetch("/api/presentation/generate_html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "深圳市科技创新发展计划",
          prompt: "介绍深圳市科技创新发展的战略规划和实施路径",
          outline: [
            "# 一、发展背景与战略意义\n- 深圳作为改革开放前沿城市的独特地位\n- 科技创新在城市发展中的核心作用\n- 国家战略与地方实践的有机结合",
            "# 二、核心目标与发展愿景\n- 建设国际科技创新中心的总体目标\n- 关键技术领域的突破方向\n- 创新生态体系的构建路径",
            "# 三、重点任务与实施举措\n- 加强基础研究和原始创新能力\n- 推动产学研深度融合\n- 优化创新创业环境",
            "# 四、保障措施与预期成效\n- 政策支持与资金保障\n- 人才引进与培养机制\n- 预期的经济社会效益",
          ],
          language: "zh",
          theme: "professional",
        }),
      });

      if (!response.ok) {
        throw new Error("生成失败");
      }

      // 读取流式响应
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("无法读取响应");
      }

      let htmlContent = "";
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // 处理缓冲区中的完整行
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // 保留最后一个不完整的行

        for (const line of lines) {
          if (line.startsWith("0:")) {
            // 提取内容：0:"content"
            const match = line.match(/^0:"(.*)"/);
            if (match && match[1]) {
              // 解析JSON转义字符（\n, \", \\等）
              try {
                const unescaped = JSON.parse('"' + match[1] + '"');
                htmlContent += unescaped;
              } catch (e) {
                console.warn("JSON解析失败:", e);
                // 如果解析失败，尝试简单替换
                htmlContent += match[1]
                  .replace(/\\n/g, "\n")
                  .replace(/\\"/g, '"')
                  .replace(/\\\\/g, "\\");
              }
            }
          }
        }
      }

      console.log("✅ 生成的HTML内容长度:", htmlContent.length);
      console.log("📄 HTML内容预览:", htmlContent.substring(0, 500));

      // 解析HTML内容
      const parser = new HTMLSlideParser();
      const slides = parser.parse(htmlContent);

      if (slides.length === 0) {
        throw new Error("未能解析出任何幻灯片");
      }

      setHtmlSlides(slides);
      toast.success(`成功生成 ${slides.length} 页HTML演示文稿！`);
    } catch (error) {
      console.error("生成错误:", error);
      toast.error(error instanceof Error ? error.message : "生成失败，请重试");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPDF = () => {
    toast.info("PDF导出功能开发中...");
    // TODO: 实现PDF导出
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="border-b bg-background p-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">HTML演示文稿生成测试</h1>
            <p className="text-sm text-muted-foreground">
              测试AI生成具有设计感的HTML演示页面
            </p>
          </div>
          <Button onClick={handleGenerate} disabled={isGenerating} size="lg">
            {isGenerating ? "生成中..." : "生成测试演示文稿"}
          </Button>
        </div>
      </div>

      <div className="flex-1">
        {htmlSlides.length > 0 ? (
          <HTMLSlideViewer slides={htmlSlides} onExportPDF={handleExportPDF} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-lg text-muted-foreground">
                点击上方按钮生成测试演示文稿
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                AI将为每一页生成具有现代设计感的HTML页面
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
