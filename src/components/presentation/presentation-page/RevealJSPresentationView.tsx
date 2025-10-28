"use client";

import { Button } from "@/components/ui/button";
import { usePresentationState } from "@/states/presentation-state";
import { Download, ExternalLink } from "lucide-react";

export function RevealJSPresentationView() {
  const generatedHtml = usePresentationState((s) => s.generatedHtml);
  const currentPresentationTitle = usePresentationState(
    (s) => s.currentPresentationTitle,
  );

  if (!generatedHtml) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <p className="text-muted-foreground">没有可显示的演示文稿</p>
      </div>
    );
  }

  // 下载纯净版（用于演示）
  const handleDownload = () => {
    const blob = new Blob([generatedHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentPresentationTitle || "presentation"}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 下载可编辑版（带编辑功能）
  const handleDownloadEditable = async () => {
    // 获取编辑器脚本
    const editorScriptResponse = await fetch("/presentation-editor.js");
    const editorScript = await editorScriptResponse.text();

    // 在HTML中注入编辑脚本
    const editScriptTag = `
    <script>
    ${editorScript}
    </script>
  </body>`;

    // 将脚本注入到HTML中
    const editableHtml = generatedHtml.replace("</body>", editScriptTag);

    const blob = new Blob([editableHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentPresentationTitle || "presentation"}-editable.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 旧的实现（备用）
  const handleDownloadEditableOld = () => {
    const editScript = `
    <script>
    (function() {
      let isEditMode = false;
      let selectedElement = null;
      let resizeHandle = null;
      
      function initEditMode() {
        createEditButton();
        createResizeHandle();
      }
      
      function createEditButton() {
        const btn = document.createElement('button');
        btn.innerHTML = '✏️ 编辑模式';
        btn.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;padding:10px 20px;background:#0066cc;color:white;border:none;border-radius:6px;cursor:pointer;font-size:14px;font-weight:600;box-shadow:0 4px 12px rgba(0,102,204,0.3);transition:all 0.3s';
        btn.onmouseenter = () => { btn.style.background = '#0052a3'; btn.style.transform = 'translateY(-2px)'; };
        btn.onmouseleave = () => { btn.style.background = isEditMode ? '#00a758' : '#0066cc'; btn.style.transform = 'translateY(0)'; };
        btn.onclick = toggleEditMode;
        document.body.appendChild(btn);
      }
      
      function createResizeHandle() {
        resizeHandle = document.createElement('div');
        resizeHandle.style.cssText = 'position:fixed;width:14px;height:14px;background:#0066cc;border:3px solid white;border-radius:50%;cursor:se-resize;display:none;z-index:9998;box-shadow:0 2px 8px rgba(0,0,0,0.4);pointer-events:auto';
        resizeHandle.title = '拖动调整大小';
        document.body.appendChild(resizeHandle);
      }
      
      function toggleEditMode() {
        isEditMode = !isEditMode;
        const btn = document.querySelector('button');
        if (isEditMode) {
          btn.innerHTML = '✅ 完成编辑';
          btn.style.background = '#00a758';
          enableEditing();
        } else {
          btn.innerHTML = '✏️ 编辑模式';
          btn.style.background = '#0066cc';
          disableEditing();
        }
      }
      
      function enableEditing() {
        const textElements = document.querySelectorAll('.reveal .slides section h1, .reveal .slides section h2, .reveal .slides section h3, .reveal .slides section p, .reveal .slides section li, .reveal .slides section ul, .reveal .slides section ol, .reveal .slides section div:not(.slide-content-wrapper)');
        textElements.forEach(el => {
          el.setAttribute('contenteditable', 'true');
          el.style.outline = '1px dashed rgba(0,102,204,0.3)';
          el.style.cursor = 'text';
          el.addEventListener('click', function(e) {
            e.stopPropagation();
            removeImageHandles();
            selectElement(this);
          });
        });
        enableImageEditing();
        
        // 点击空白处取消选择
        document.body.addEventListener('click', (e) => {
          const target = e.target;
          // 如果点击的不是图片、不是手柄、不是文本元素
          if (!target.closest('img') && 
              !target.closest('[contenteditable]') && 
              target.style.cursor !== 'nw-resize' &&
              target.style.cursor !== 'ne-resize' &&
              target.style.cursor !== 'sw-resize' &&
              target.style.cursor !== 'se-resize' &&
              target.style.cursor !== 'n-resize' &&
              target.style.cursor !== 's-resize' &&
              target.style.cursor !== 'e-resize' &&
              target.style.cursor !== 'w-resize') {
            deselectElement();
            removeImageHandles();
          }
        }, true);
      }
      
      function disableEditing() {
        document.querySelectorAll('[contenteditable="true"]').forEach(el => {
          el.removeAttribute('contenteditable');
          el.style.outline = 'none';
          el.style.cursor = 'default';
        });
        document.querySelectorAll('.reveal .slides section img').forEach(img => {
          img.style.cursor = 'default';
        });
        deselectElement();
        removeImageHandles();
      }
      
      function selectElement(el) {
        if (selectedElement) {
          selectedElement.style.outline = '1px dashed rgba(0,102,204,0.3)';
          selectedElement.style.background = 'transparent';
        }
        selectedElement = el;
        el.style.outline = '2px solid #0066cc';
        el.style.background = 'rgba(0,102,204,0.05)';
        updateResizeHandle();
        resizeHandle.onmousedown = startResize;
      }
      
      function updateResizeHandle() {
        if (!selectedElement) {
          resizeHandle.style.display = 'none';
          return;
        }
        const rect = selectedElement.getBoundingClientRect();
        resizeHandle.style.display = 'block';
        resizeHandle.style.left = (rect.right - 7) + 'px';
        resizeHandle.style.top = (rect.bottom - 7) + 'px';
      }
      
      function deselectElement() {
        if (selectedElement) {
          selectedElement.style.outline = '1px dashed rgba(0,102,204,0.3)';
          selectedElement.style.background = 'transparent';
          selectedElement = null;
        }
        resizeHandle.style.display = 'none';
      }
      
      function startResize(e) {
        e.preventDefault();
        e.stopPropagation();
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = selectedElement.offsetWidth;
        const startHeight = selectedElement.offsetHeight;
        
        function onMouseMove(e) {
          const deltaX = e.clientX - startX;
          const deltaY = e.clientY - startY;
          const newWidth = Math.max(100, startWidth + deltaX);
          const newHeight = Math.max(50, startHeight + deltaY);
          selectedElement.style.width = newWidth + 'px';
          selectedElement.style.maxWidth = newWidth + 'px';
          selectedElement.style.height = newHeight + 'px';
          selectedElement.style.minHeight = newHeight + 'px';
          updateResizeHandle();
        }
        
        function onMouseUp() {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        }
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      }
      
      // 图片编辑功能
      function enableImageEditing() {
        const images = document.querySelectorAll('.reveal .slides section img');
        images.forEach(img => {
          img.style.cursor = 'pointer';
          img.addEventListener('click', function(e) {
            e.stopPropagation();
            selectImage(this);
          });
        });
      }
      
      let selectedImage = null;
      let imageHandles = [];
      
      function selectImage(img) {
        deselectElement();
        if (selectedImage && selectedImage !== img) {
          removeImageHandles();
        }
        selectedImage = img;
        img.style.outline = '2px solid #0066cc';
        if (imageHandles.length === 0) {
          addImageHandles(img);
        }
      }
      
      function removeImageHandles() {
        imageHandles.forEach(h => {
          if (h && h.parentNode) h.remove();
        });
        imageHandles = [];
        if (selectedImage) {
          selectedImage.style.outline = 'none';
          const wrapper = selectedImage.parentElement;
          if (wrapper && wrapper.style.position === 'relative' && wrapper.childNodes.length === 1) {
            wrapper.parentNode.insertBefore(selectedImage, wrapper);
            wrapper.remove();
          }
          selectedImage = null;
        }
      }
      
      function addImageHandles(img) {
        const positions = [
          {pos:'nw',cursor:'nw-resize',top:-6,left:-6},
          {pos:'n',cursor:'n-resize',top:-6,left:'50%',transform:'translateX(-50%)'},
          {pos:'ne',cursor:'ne-resize',top:-6,right:-6},
          {pos:'e',cursor:'e-resize',top:'50%',right:-6,transform:'translateY(-50%)'},
          {pos:'se',cursor:'se-resize',bottom:-6,right:-6},
          {pos:'s',cursor:'s-resize',bottom:-6,left:'50%',transform:'translateX(-50%)'},
          {pos:'sw',cursor:'sw-resize',bottom:-6,left:-6},
          {pos:'w',cursor:'w-resize',top:'50%',left:-6,transform:'translateY(-50%)'}
        ];
        
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'position:relative;display:inline-block;';
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
        
        positions.forEach(p => {
          const handle = document.createElement('div');
          let css = 'position:absolute;width:12px;height:12px;background:#0066cc;border:2px solid white;border-radius:50%;z-index:9999;cursor:'+p.cursor+';';
          if(p.top!==undefined) css += 'top:'+p.top+'px;';
          if(p.bottom!==undefined) css += 'bottom:'+p.bottom+'px;';
          if(p.left!==undefined) css += 'left:'+(typeof p.left==='number'?p.left+'px':p.left)+';';
          if(p.right!==undefined) css += 'right:'+p.right+'px;';
          if(p.transform) css += 'transform:'+p.transform+';';
          handle.style.cssText = css;
          
          handle.onmousedown = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = img.offsetWidth;
            const startHeight = img.offsetHeight;
            const startLeft = wrapper.offsetLeft;
            const startTop = wrapper.offsetTop;
            const rect = img.getBoundingClientRect();
            const startRight = rect.right;
            const startBottom = rect.bottom;
            
            function onMove(e) {
              const deltaX = e.clientX - startX;
              const deltaY = e.clientY - startY;
              let newWidth = startWidth;
              let newHeight = startHeight;
              let newLeft = startLeft;
              let newTop = startTop;
              
              if(p.pos.includes('e')) newWidth = startWidth + deltaX;
              if(p.pos.includes('w')) { newWidth = startWidth - deltaX; newLeft = startLeft + deltaX; }
              if(p.pos.includes('s')) newHeight = startHeight + deltaY;
              if(p.pos.includes('n')) { newHeight = startHeight - deltaY; newTop = startTop + deltaY; }
              
              newWidth = Math.max(50, newWidth);
              newHeight = Math.max(50, newHeight);
              
              img.style.width = newWidth + 'px';
              img.style.height = newHeight + 'px';
              img.style.maxWidth = newWidth + 'px';
              img.style.maxHeight = newHeight + 'px';
              img.style.objectFit = 'fill';
              
              if(p.pos.includes('w') || p.pos.includes('n')) {
                wrapper.style.position = 'absolute';
                wrapper.style.left = newLeft + 'px';
                wrapper.style.top = newTop + 'px';
              }
            }
            
            function onUp() {
              document.removeEventListener('mousemove', onMove);
              document.removeEventListener('mouseup', onUp);
            }
            
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
          };
          
          wrapper.appendChild(handle);
          imageHandles.push(handle);
        });
      }
      
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEditMode);
      } else {
        initEditMode();
      }
    })();
    </script>
  </body>`;

    // 将脚本注入到HTML中
    const editableHtml = generatedHtml.replace("</body>", editScript);

    const blob = new Blob([editableHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentPresentationTitle || "presentation"}-editable.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePreview = () => {
    const blob = new Blob([generatedHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-4 w-full">
      {/* 操作栏 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {currentPresentationTitle || "演示文稿"}
          </h3>
          <p className="text-sm text-muted-foreground">
            Reveal.js 演示文稿已生成
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview} className="gap-2">
            <ExternalLink className="h-4 w-4" />
            在新窗口打开
          </Button>
          <Button
            variant="outline"
            onClick={handleDownloadEditable}
            className="gap-2"
            title="下载带编辑功能的版本，可调整文本框宽度、编辑内容"
          >
            <Download className="h-4 w-4" />
            下载可编辑版
          </Button>
          <Button
            onClick={handleDownload}
            className="gap-2"
            title="下载纯净版，用于演示，无编辑按钮"
          >
            <Download className="h-4 w-4" />
            下载演示版
          </Button>
        </div>
      </div>

      {/* 预览区域 - 保持 16:9 横屏比例，居中显示，更大尺寸 */}
      <div className="w-full flex justify-center items-center">
        <div
          className="relative overflow-hidden rounded-lg border bg-card shadow-lg"
          style={{
            /* 保持 16:9 比例，使用接近全屏的尺寸 */
            aspectRatio: "16/9",
            width: "95%",
            maxWidth: "1800px",
            minHeight: "700px",
            maxHeight: "calc(100vh - 150px)",
          }}
        >
          <iframe
            srcDoc={generatedHtml}
            className="absolute inset-0 w-full h-full border-0"
            title="Presentation Preview"
            sandbox="allow-scripts allow-same-origin allow-fullscreen"
            allowFullScreen
            style={{
              border: "none",
              outline: "none",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </div>

      {/* 提示信息 */}
      <div className="text-sm text-muted-foreground text-center">
        <p>使用方向键 (← →) 翻页 | 按 F 键全屏 | 按 ESC 退出全屏</p>
      </div>
    </div>
  );
}
