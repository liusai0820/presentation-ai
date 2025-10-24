import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { getGenerateModel } from '@/lib/get-configured-model';
import { getUserIdOrDev } from '@/lib/dev-user';
import { auth } from '@/server/auth';
import { generateRevealJSPrompt } from '@/lib/prompts/revealjs-content-generator';
import { assembleRevealJSPresentation, extractTitle } from '@/lib/presentation/html-assembler-revealjs';
import { getCustomThemeCSS, isCustomTheme } from '@/lib/presentation/html-themes/theme-css-loader';

/**
 * 清理AI生成的内容
 * 移除markdown代码块标记和其他格式问题
 */
function cleanAIContent(content: string): string {
  let cleaned = content;

  // 移除markdown代码块标记
  cleaned = cleaned.replace(/```html\s*/gi, '');
  cleaned = cleaned.replace(/```\s*$/gi, '');
  cleaned = cleaned.replace(/^```\s*/gm, '');

  // 移除可能的前导说明文字
  const htmlStart = cleaned.indexOf('<');
  if (htmlStart > 0 && htmlStart < 200) {
    cleaned = cleaned.substring(htmlStart);
  }

  // 移除可能的尾部说明文字
  const lastTagEnd = cleaned.lastIndexOf('>');
  if (lastTagEnd > 0 && lastTagEnd < cleaned.length - 200) {
    cleaned = cleaned.substring(0, lastTagEnd + 1);
  }

  return cleaned.trim();
}

export async function POST(request: NextRequest) {
  try {
    // 验证用户身份
    const session = await auth();
    await getUserIdOrDev(session);

    const body = await request.json();
    const {
      title,
      prompt,
      outline,
      language,
      theme = 'mckinsey',
      searchResults,
      analyzedDocument,
      originalDocumentContent,
      // 兼容旧参数
      topic: legacyTopic,
      originalDocument: legacyDocument,
    } = body;

    // 构建topic
    const topic = title || prompt || legacyTopic;

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    // 构建文档内容
    let documentContent = originalDocumentContent || legacyDocument || '';
    if (outline && outline.length > 0) {
      documentContent += '\n\n大纲：\n' + outline.join('\n\n');
    }

    // 格式化搜索结果
    let searchResultsText = '';
    if (searchResults && searchResults.length > 0) {
      searchResultsText = searchResults
        .map((item: any, index: number) => {
          const results = Array.isArray(item.results) ? item.results : [];
          return `搜索 ${index + 1}: ${item.query}\n${results.slice(0, 3).map((r: any) =>
            `- ${r.title || ''}\n  ${r.content || ''}`
          ).join('\n')}`;
        })
        .join('\n\n');
    }

    console.log(`🎨 开始生成Reveal.js演示文稿: ${topic}`);
    console.log(`   - 主题: ${theme}`);
    console.log(`   - 语言: ${language || 'zh'}`);
    console.log(`   - 大纲页数: ${outline?.length || 0}`);
    console.log(`   - 原始文档: ${documentContent ? '有' : '无'}`);
    console.log(`   - 搜索结果: ${searchResultsText ? '有' : '无'}`);

    // 生成Prompt
    const promptText = generateRevealJSPrompt(topic, documentContent || undefined, searchResultsText || undefined);

    // 获取配置的AI模型
    const model = getGenerateModel();

    console.log(`🚀 调用AI生成内容...`);

    // 调用AI生成内容
    const result = await generateText({
      model,
      prompt: promptText,
      maxTokens: 12000,
      temperature: 0.8,
      abortSignal: AbortSignal.timeout(360000), // 120秒超时
    });

    let aiContent = result.text;

    if (!aiContent) {
      return NextResponse.json(
        { error: 'Failed to generate content' },
        { status: 500 }
      );
    }

    console.log(`✅ 内容生成成功，Token使用: ${result.usage.totalTokens}`);
    console.log(`🔍 原始内容长度: ${aiContent.length}`);
    console.log(`🔍 原始内容预览: ${aiContent.substring(0, 300)}`);

    // 清理AI可能添加的markdown代码块标记和其他格式问题
    aiContent = cleanAIContent(aiContent);

    console.log(`🔍 清理后内容长度: ${aiContent.length}`);
    console.log(`🔍 清理后内容预览: ${aiContent.substring(0, 300)}`);

    // 提取标题
    const extractedTitle = extractTitle(aiContent);

    // 加载自定义CSS - 支持mckinsey, bcg, bain三个主题
    const isCustom = isCustomTheme(theme);
    console.log(`🎨 主题检查: ${theme}, 是否已支持的主题: ${isCustom}`);

    // 加载对应主题的CSS
    // 支持的主题: mckinsey, bcg, bain
    const themeToLoad = isCustom ? theme : 'mckinsey';
    const customCSS = getCustomThemeCSS(themeToLoad);
    console.log(`🎨 加载主题: ${themeToLoad}`);
    console.log(`🎨 CSS加载结果: ${customCSS ? `成功 (${customCSS.length}字符)` : '失败或为空'}`);

    if (!customCSS) {
      console.warn(`⚠️  警告: 主题 ${themeToLoad} 的CSS加载失败，将使用默认样式`);
    }

    // 组装完整的Reveal.js HTML（应用CSS主题）
    const completeHTML = assembleRevealJSPresentation(aiContent, {
      theme: themeToLoad,
      title: extractedTitle,
      customCSS,
    });

    console.log(`🎉 Reveal.js演示文稿生成完成: ${extractedTitle}`);

    return NextResponse.json({
      success: true,
      html: completeHTML,
      title: extractedTitle,
      theme,
      tokensUsed: result.usage.totalTokens,
      promptTokens: result.usage.promptTokens,
      completionTokens: result.usage.completionTokens,
    });

  } catch (error) {
    console.error('❌ Reveal.js演示文稿生成错误:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate presentation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
