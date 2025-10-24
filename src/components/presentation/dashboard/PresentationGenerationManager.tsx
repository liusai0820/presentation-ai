"use client";

import { generateImageAction } from "@/app/_actions/image/generate";
import { getImageFromUnsplash } from "@/app/_actions/image/unsplash";
import { updatePresentation } from "@/app/_actions/presentation/presentationActions";
import { extractThinking } from "@/lib/thinking-extractor";
import { usePresentationState } from "@/states/presentation-state";
import { useChat, useCompletion } from "@ai-sdk/react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { SlideParser } from "../utils/parser";

function stripXmlCodeBlock(input: string): string {
  let result = input.trim();
  if (result.startsWith("```xml")) {
    result = result.slice(6).trimStart();
  }
  if (result.endsWith("```")) {
    result = result.slice(0, -3).trimEnd();
  }
  return result;
}

export function PresentationGenerationManager() {
  const {
    numSlides,
    language,
    presentationInput,
    shouldStartOutlineGeneration,
    shouldStartPresentationGeneration,
    webSearchEnabled,
    modelProvider,
    modelId,
    setIsGeneratingOutline,
    setShouldStartOutlineGeneration,
    setShouldStartPresentationGeneration,
    resetGeneration,
    resetForNewGeneration,
    setOutline,
    setSearchResults,
    setSlides,
    setOutlineThinking,
    setPresentationThinking,
    setIsGeneratingPresentation,
    setCurrentPresentation,
    currentPresentationId,
    imageModel,
    imageSource,
    rootImageGeneration,
    startRootImageGeneration,
    completeRootImageGeneration,
    failRootImageGeneration,
    isGeneratingPresentation,
    isGeneratingOutline,
    slides,
  } = usePresentationState();

  // Create a ref for the streaming parser to persist between renders
  const streamingParserRef = useRef<SlideParser>(new SlideParser());
  // Add refs to track the animation frame IDs
  const slidesRafIdRef = useRef<number | null>(null);
  const outlineRafIdRef = useRef<number | null>(null);
  const outlineBufferRef = useRef<string[] | null>(null);
  const searchResultsBufferRef = useRef<Array<{
    query: string;
    results: unknown[];
  }> | null>(null);
  // Track the last processed messages length to avoid unnecessary updates
  const lastProcessedMessagesLength = useRef<number>(0);
  // Track if title has already been extracted to avoid unnecessary processing
  const titleExtractedRef = useRef<boolean>(false);

  // Function to update slides using requestAnimationFrame
  const updateSlidesWithRAF = (): void => {
    // Extract thinking for presentation and parse only the remaining content
    const presentationThinkingExtract = extractThinking(presentationCompletion);
    if (presentationThinkingExtract.hasThinking) {
      setPresentationThinking(presentationThinkingExtract.thinking);
    }
    const presentationContentToParse = presentationThinkingExtract.hasThinking
      ? presentationThinkingExtract.content
      : presentationCompletion;

    const processedPresentationCompletion = stripXmlCodeBlock(
      presentationContentToParse,
    );
    streamingParserRef.current.reset();
    streamingParserRef.current.parseChunk(processedPresentationCompletion);
    streamingParserRef.current.finalize();
    const allSlides = streamingParserRef.current.getAllSlides();
    // Merge any completed root image URLs from state into streamed slides
    const mergedSlides = allSlides.map((slide) => {
      const gen = rootImageGeneration[slide.id];
      if (gen?.status === "success" && slide.rootImage?.query) {
        return {
          ...slide,
          rootImage: {
            ...slide.rootImage,
            url: gen.url,
          },
        };
      }
      return slide;
    });
    // For any slide that has a rootImage query but no url, ensure generation is tracked/started
    for (const slide of allSlides) {
      const slideId = slide.id;
      const rootImage = slide.rootImage;
      if (rootImage?.query && !rootImage.url) {
        const already = rootImageGeneration[slideId];
        if (!already || already.status === "error") {
          startRootImageGeneration(slideId, rootImage.query);
          void (async () => {
            try {
              let result;

              if (imageSource === "stock") {
                // Use Unsplash for stock images
                const unsplashResult = await getImageFromUnsplash(
                  rootImage.query,
                  rootImage.layoutType,
                );
                if (unsplashResult.success && unsplashResult.imageUrl) {
                  result = { image: { url: unsplashResult.imageUrl } };
                }
              } else {
                // Use AI generation
                result = await generateImageAction(rootImage.query, imageModel);
              }

              if (result?.image?.url) {
                completeRootImageGeneration(slideId, result.image.url);
                // If we don't have a thumbnail yet, set it now and persist once
                const stateNow = usePresentationState.getState();
                if (!stateNow.thumbnailUrl && stateNow.currentPresentationId) {
                  stateNow.setThumbnailUrl(result.image.url);
                  try {
                    await updatePresentation({
                      id: stateNow.currentPresentationId,
                      thumbnailUrl: result.image.url,
                    });
                  } catch {
                    // Ignore persistence errors for thumbnail to avoid interrupting generation flow
                  }
                }
                // Persist into slides state
                usePresentationState.getState().setSlides(
                  usePresentationState.getState().slides.map((s) =>
                    s.id === slideId
                      ? {
                          ...s,
                          rootImage: {
                            query: rootImage.query,
                            url: result.image.url,
                          },
                        }
                      : s,
                  ),
                );
              } else {
                failRootImageGeneration(slideId, "No image url returned");
              }
            } catch (err) {
              const message =
                err instanceof Error ? err.message : "Image generation failed";
              failRootImageGeneration(slideId, message);
            }
          })();
        }
      }
    }
    setSlides(mergedSlides);
    slidesRafIdRef.current = null;
  };

  // Function to extract title from content
  const extractTitle = (
    content: string,
  ): { title: string | null; cleanContent: string } => {
    const titleMatch = content.match(/<TITLE>(.*?)<\/TITLE>/i);
    if (titleMatch?.[1]) {
      const title = titleMatch[1].trim();
      const cleanContent = content.replace(/<TITLE>.*?<\/TITLE>/i, "").trim();
      return { title, cleanContent };
    }
    return { title: null, cleanContent: content };
  };

  // Function to process messages and extract data (optimized - only process last message)
  const processMessages = (messages: typeof outlineMessages): void => {
    if (messages.length <= 1) return;

    // Get the last message - this is where all the current data is
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return;

    // Extract search results from the last message only (much more efficient)
    if (webSearchEnabled && lastMessage.parts) {
      const searchResults: Array<{ query: string; results: unknown[] }> = [];

      for (const part of lastMessage.parts) {
        if (part.type === "tool-invocation" && part.toolInvocation) {
          const invocation = part.toolInvocation;
          if (
            invocation.toolName === "webSearch" &&
            invocation.state === "result" &&
            "result" in invocation &&
            invocation.result
          ) {
            const query =
              typeof invocation.args?.query === "string"
                ? invocation.args.query
                : "Unknown query";

            // Parse the search result
            let parsedResult;
            try {
              parsedResult =
                typeof invocation.result === "string"
                  ? JSON.parse(invocation.result)
                  : invocation.result;
            } catch {
              parsedResult = invocation.result;
            }

            searchResults.push({
              query,
              results: parsedResult?.results || [],
            });
          }
        }
      }

      // Store search results in buffer (only if we found any)
      if (searchResults.length > 0) {
        searchResultsBufferRef.current = searchResults;
      }
    }

    // Extract outline from the last assistant message
    if (lastMessage.role === "assistant" && lastMessage.content) {
      console.log("🔍 处理助手消息，内容长度:", lastMessage.content.length);
      
      // Extract <think> content from assistant message and keep only the remainder for parsing
      const thinkingExtract = extractThinking(lastMessage.content);
      if (thinkingExtract.hasThinking) {
        setOutlineThinking(thinkingExtract.thinking);
      }

      let cleanContent = thinkingExtract.hasThinking
        ? thinkingExtract.content
        : lastMessage.content;
        
      console.log("🧹 清理后的内容预览:", cleanContent.substring(0, 300));

      // Only extract title if we haven't done it yet
      if (!titleExtractedRef.current) {
        const { title, cleanContent: extractedCleanContent } =
          extractTitle(cleanContent);

        console.log("🏷️ 提取的标题:", title);
        cleanContent = extractedCleanContent;

        // Set the title if found and mark as extracted
        if (title) {
          setCurrentPresentation(currentPresentationId, title);
          titleExtractedRef.current = true;
          console.log("✅ 标题已设置:", title);
        } else {
          // Title not found yet, don't process outline
          console.log("❌ 未找到标题，跳过大纲处理");
          return;
        }
      } else {
        // Title already extracted, just remove it from content if it exists
        cleanContent = cleanContent.replace(/<TITLE>.*?<\/TITLE>/i, "").trim();
        console.log("🔄 标题已提取，清理内容");
      }

      // Parse the outline into sections
      // Split by heading lines and filter out empty sections
      const sections = cleanContent.split(/\n(?=# )/gm).filter(Boolean);
      const outlineItems: string[] =
        sections.length > 0
          ? sections
              .map((section) => section.trim())
              .filter((section) => section.length > 0)
          : [];

      console.log("📋 解析的大纲项目数量:", outlineItems.length);
      console.log("📋 大纲项目预览:", outlineItems.slice(0, 2));

      if (outlineItems.length > 0) {
        outlineBufferRef.current = outlineItems;
        console.log("✅ 大纲已存储到缓冲区");
      } else {
        console.log("❌ 没有解析到大纲项目");
      }
    }
  };

  // Function to update outline and search results using requestAnimationFrame
  const updateOutlineWithRAF = (): void => {
    console.log("🎬 RAF更新被调用");
    
    // Update search results if available
    if (searchResultsBufferRef.current !== null) {
      console.log("🔍 更新搜索结果:", searchResultsBufferRef.current.length);
      setSearchResults(searchResultsBufferRef.current);
      searchResultsBufferRef.current = null;
    }

    // Update outline if available
    if (outlineBufferRef.current !== null) {
      console.log("📋 更新大纲，项目数量:", outlineBufferRef.current.length);
      setOutline(outlineBufferRef.current);
      outlineBufferRef.current = null;
    }

    // Clear the current frame ID
    outlineRafIdRef.current = null;
  };

  // Outline generation with or without web search
  const { messages: outlineMessages, append: appendOutlineMessage } = useChat({
    api: webSearchEnabled
      ? "/api/presentation/outline-with-search"
      : "/api/presentation/outline",
    body: {
      prompt: presentationInput,
      numberOfCards: numSlides,
      language,
      modelProvider,
      modelId,
    },
    fetch: (url, options) => {
      return fetch(url, {
        ...options,
        signal: AbortSignal.timeout(60000), // 60秒超时
      });
    },
    onFinish: () => {
      setIsGeneratingOutline(false);
      setShouldStartOutlineGeneration(false);
      setShouldStartPresentationGeneration(false);

      const {
        currentPresentationId,
        outline,
        searchResults,
        currentPresentationTitle,
        theme,
        imageSource,
      } = usePresentationState.getState();

      if (currentPresentationId) {
        void updatePresentation({
          id: currentPresentationId,
          outline,
          searchResults,
          prompt: presentationInput,
          title: currentPresentationTitle ?? "",
          theme,
          imageSource,
        });
      }

      // Cancel any pending outline animation frame
      if (outlineRafIdRef.current !== null) {
        cancelAnimationFrame(outlineRafIdRef.current);
        outlineRafIdRef.current = null;
      }
    },
    onError: (error) => {
      toast.error("Failed to generate outline: " + error.message);
      resetGeneration();

      // Cancel any pending outline animation frame
      if (outlineRafIdRef.current !== null) {
        cancelAnimationFrame(outlineRafIdRef.current);
        outlineRafIdRef.current = null;
      }
    },
  });

  // Lightweight useEffect that only schedules RAF updates
  useEffect(() => {
    console.log("📨 收到消息数量:", outlineMessages.length);
    
    // Only update if we have new messages
    if (outlineMessages.length > 1) {
      lastProcessedMessagesLength.current = outlineMessages.length;

      // Process messages and store in buffers (non-blocking)
      processMessages(outlineMessages);

      // Only schedule a new frame if one isn't already pending
      if (outlineRafIdRef.current === null) {
        outlineRafIdRef.current = requestAnimationFrame(updateOutlineWithRAF);
      }
    }
  }, [outlineMessages, webSearchEnabled]);

  // Watch for outline generation start
  useEffect(() => {
    const startOutlineGeneration = async (): Promise<void> => {
      if (shouldStartOutlineGeneration) {
        try {
          // Reset all state except ID and input when starting new generation
          resetForNewGeneration();

          // Reset processing refs for new generation
          titleExtractedRef.current = false;

          setIsGeneratingOutline(true);

          // Get the current state after reset
          const { presentationInput, analyzedDocument } = usePresentationState.getState();

          // 如果有文档分析结果，直接使用它生成大纲
          if (analyzedDocument) {
            console.log("📄 使用文档分析结果生成大纲");
            
            // 设置标题
            setCurrentPresentation(currentPresentationId, analyzedDocument.title);
            titleExtractedRef.current = true;

            // 生成大纲
            const outlineItems = analyzedDocument.sections.map((section, idx) => {
              const heading = `# ${idx + 1}. ${section.heading}`;
              const points = section.keyPoints.map(point => `- ${point}`).join('\n');
              return `${heading}\n${points}`;
            });

            setOutline(outlineItems);
            setIsGeneratingOutline(false);
            setShouldStartOutlineGeneration(false);

            // 保存到数据库
            if (currentPresentationId) {
              void updatePresentation({
                id: currentPresentationId,
                outline: outlineItems,
                title: analyzedDocument.title,
                prompt: presentationInput,
              });
            }

            return;
          }

          // 没有文档分析结果，使用AI生成大纲
          console.log("🤖 使用AI生成大纲");

          // Start the RAF cycle for outline updates
          if (outlineRafIdRef.current === null) {
            outlineRafIdRef.current =
              requestAnimationFrame(updateOutlineWithRAF);
          }

          await appendOutlineMessage(
            {
              role: "user",
              content: presentationInput,
            },
            {
              body: {
                prompt: presentationInput,
                numberOfCards: numSlides,
                language,
              },
            },
          );
        } catch (error) {
          console.log(error);
          // Error is handled by onError callback
        } finally {
          setIsGeneratingOutline(false);
          setShouldStartOutlineGeneration(false);
        }
      }
    };

    void startOutlineGeneration();
  }, [shouldStartOutlineGeneration]);

  const { completion: presentationCompletion, complete: generatePresentation } =
    useCompletion({
      api: "/api/presentation/generate",
      onFinish: (_prompt, _completion) => {
        setIsGeneratingPresentation(false);
        setShouldStartPresentationGeneration(false);
      },
      onError: (error) => {
        toast.error("Failed to generate presentation: " + error.message);
        resetGeneration();
        streamingParserRef.current.reset();

        // Cancel any pending animation frame
        if (slidesRafIdRef.current !== null) {
          cancelAnimationFrame(slidesRafIdRef.current);
          slidesRafIdRef.current = null;
        }
      },
    });

  useEffect(() => {
    if (presentationCompletion) {
      try {
        // Only schedule a new frame if one isn't already pending
        if (slidesRafIdRef.current === null) {
          slidesRafIdRef.current = requestAnimationFrame(updateSlidesWithRAF);
        }
      } catch (error) {
        console.error("Error processing presentation XML:", error);
        toast.error("Error processing presentation content");
      }
    }
  }, [presentationCompletion]);

  useEffect(() => {
    if (shouldStartPresentationGeneration) {
      const {
        outline,
        presentationInput,
        language,
        presentationStyle,
        currentPresentationTitle,
        searchResults: stateSearchResults,
        modelProvider,
        modelId,
        setThumbnailUrl,
        generationMode,
        setHtmlSlides,
        setGeneratedHtml,
        theme,
        analyzedDocument,
      } = usePresentationState.getState();

      setIsGeneratingPresentation(true);
      setThumbnailUrl(undefined);

      // 检查生成模式
      if (generationMode === "html" || generationMode === "revealjs") {
        // HTML或Reveal.js生成模式
        const modeLabel = generationMode === "revealjs" ? "Reveal.js" : "HTML";
        console.log(`🎨 使用${modeLabel}生成模式`);
        console.log("📄 文档分析结果:", analyzedDocument ? "有" : "无");
        
        void (async () => {
          try {
            const { originalDocumentContent } = usePresentationState.getState();
            
            // 根据模式选择API端点和默认主题
            const endpoint = generationMode === "revealjs"
              ? "/api/presentation/generate_revealjs"
              : "/api/presentation/generate_html";
            const defaultTheme = generationMode === "revealjs" ? "mckinsey" : "professional";
            
            const response = await fetch(endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: currentPresentationTitle ?? presentationInput ?? "",
                prompt: presentationInput ?? "",
                outline,
                language,
                theme: theme || defaultTheme,
                searchResults: stateSearchResults,
                analyzedDocument,
                originalDocumentContent,
              }),
            });

            if (!response.ok) {
              throw new Error(`${modeLabel}生成失败`);
            }

            // Reveal.js返回JSON，HTML返回流
            if (generationMode === "revealjs") {
              const data = await response.json();
              
              if (!data.success || !data.html) {
                throw new Error("Reveal.js生成失败");
              }
              
              console.log("✅ Reveal.js生成完成");
              console.log("   - 标题:", data.title);
              console.log("   - 主题:", data.theme);
              console.log("   - Tokens:", data.tokensUsed);
              
              // 存储完整的HTML
              setGeneratedHtml(data.html);
              
              // 创建虚拟幻灯片列表用于预览
              const slideCount = (data.html.match(/<section/g) || []).length;
              const virtualSlides = Array.from({ length: slideCount }, (_, i) => ({
                id: `slide-${i + 1}`,
                index: i,
                html: `<section>幻灯片 ${i + 1}</section>`,
                title: `幻灯片 ${i + 1}`,
              }));
              
              setHtmlSlides(virtualSlides);
              console.log(`✅ 创建了${slideCount}个虚拟幻灯片用于预览`);
              
              setIsGeneratingPresentation(false);
              setShouldStartPresentationGeneration(false);
              toast.success(`成功生成 ${slideCount} 页Reveal.js演示文稿！`);
              return;
            }

            // HTML模式：读取流式响应
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
              
              const lines = buffer.split("\n");
              buffer = lines.pop() || "";

              for (const line of lines) {
                if (line.startsWith("0:")) {
                  const match = line.match(/^0:"(.*)"/);
                  if (match && match[1]) {
                    try {
                      const unescaped = JSON.parse('"' + match[1] + '"');
                      htmlContent += unescaped;
                    } catch (e) {
                      htmlContent += match[1]
                        .replace(/\\n/g, '\n')
                        .replace(/\\"/g, '"')
                        .replace(/\\\\/g, '\\');
                    }
                  }
                }
              }
            }

            console.log("✅ HTML生成完成，长度:", htmlContent.length);
            console.log("📄 HTML内容预览:", htmlContent.substring(0, 1000));
            
            // 检查是否包含SLIDE标记
            const hasSlideMarkers = htmlContent.includes("<!-- SLIDE") && htmlContent.includes("<!-- END SLIDE");
            console.log("🔍 是否包含SLIDE标记:", hasSlideMarkers);
            
            if (!hasSlideMarkers) {
              console.error("❌ HTML内容中没有找到SLIDE标记");
              console.error("完整HTML内容:", htmlContent);
              throw new Error("AI生成的HTML格式不正确，缺少<!-- SLIDE X -->标记");
            }

            // 解析HTML内容
            const { HTMLSlideParser } = await import("@/lib/html-slide-parser");
            const parser = new HTMLSlideParser();
            const slides = parser.parse(htmlContent);

            console.log("🔍 解析结果:", slides);

            if (slides.length === 0) {
              console.error("❌ 未能解析出任何幻灯片");
              console.error("HTML内容前2000字符:", htmlContent.substring(0, 2000));
              throw new Error("未能解析出任何幻灯片，请检查HTML格式");
            }

            console.log("📄 解析出", slides.length, "个HTML幻灯片");
            console.log("📄 幻灯片详情:", slides.map(s => ({ id: s.id, index: s.index, title: s.title })));
            
            setHtmlSlides(slides);
            console.log("✅ HTML幻灯片已存储到状态");
            
            setIsGeneratingPresentation(false);
            setShouldStartPresentationGeneration(false);
            toast.success(`成功生成 ${slides.length} 页HTML演示文稿！`);
          } catch (error) {
            console.error("❌ HTML生成错误:", error);
            toast.error(
              error instanceof Error ? error.message : "HTML生成失败"
            );
            resetGeneration();
          }
        })();
      } else {
        // XML组件模式（原有逻辑）
        console.log("📦 使用XML组件模式");
        streamingParserRef.current.reset();
        void generatePresentation(presentationInput ?? "", {
          body: {
            title: currentPresentationTitle ?? presentationInput ?? "",
            prompt: presentationInput ?? "",
            outline,
            searchResults: stateSearchResults,
            language,
            tone: presentationStyle,
            modelProvider,
            modelId,
          },
        });
      }
    }
  }, [shouldStartPresentationGeneration]);

  // Listen for manual root image generation changes (when user manually triggers image generation)
  useEffect(() => {
    // Only process if we're not currently generating presentation or outline
    if (isGeneratingPresentation || isGeneratingOutline) {
      return;
    }

    // Check for any pending root image generations that need to be processed
    for (const [slideId, gen] of Object.entries(rootImageGeneration)) {
      if (gen.status === "pending") {
        // Find the slide to get the rootImage query
        const slide = slides.find((s) => s.id === slideId);
        if (slide?.rootImage?.query) {
          void (async () => {
            try {
              let result;

              if (imageSource === "stock") {
                // Use Unsplash for stock images
                const unsplashResult = await getImageFromUnsplash(
                  slide.rootImage!.query,
                  slide.rootImage!.layoutType,
                );
                if (unsplashResult.success && unsplashResult.imageUrl) {
                  result = { image: { url: unsplashResult.imageUrl } };
                }
              } else {
                // Use AI generation
                result = await generateImageAction(
                  slide.rootImage!.query,
                  imageModel,
                );
              }

              if (result?.image?.url) {
                completeRootImageGeneration(slideId, result.image.url);
                // Update the slide with the new image URL
                setSlides(
                  slides.map((s) =>
                    s.id === slideId
                      ? {
                          ...s,
                          rootImage: {
                            ...s.rootImage!,
                            url: result.image.url,
                          },
                        }
                      : s,
                  ),
                );
              } else {
                failRootImageGeneration(slideId, "No image url returned");
              }
            } catch (err) {
              const message =
                err instanceof Error ? err.message : "Image generation failed";
              failRootImageGeneration(slideId, message);
            }
          })();
        }
      }
    }
  }, [
    rootImageGeneration,
    isGeneratingPresentation,
    isGeneratingOutline,
    slides,
    imageSource,
    imageModel,
    completeRootImageGeneration,
    failRootImageGeneration,
    setSlides,
  ]);

  // Clean up RAF on unmount
  useEffect(() => {
    return () => {
      if (slidesRafIdRef.current !== null) {
        cancelAnimationFrame(slidesRafIdRef.current);
        slidesRafIdRef.current = null;
      }

      if (outlineRafIdRef.current !== null) {
        cancelAnimationFrame(outlineRafIdRef.current);
        outlineRafIdRef.current = null;
      }
    };
  }, []);

  return null;
}
