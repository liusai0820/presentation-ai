// 演示文稿编辑辅助脚本
// 用于在下载的HTML中启用文本框和图片的调整功能

(function() {
  'use strict';
  
  let isEditMode = false;
  let selectedElement = null;
  let resizeHandle = null;
  
  // 初始化编辑功能
  function initEditMode() {
    createEditButton();
    createResizeHandle();
  }
  
  // 创建编辑按钮
  function createEditButton() {
    const btn = document.createElement('button');
    btn.innerHTML = '✏️ 编辑模式';
    btn.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      padding: 10px 20px;
      background: #0066cc;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
    `;
    
    btn.onclick = toggleEditMode;
    document.body.appendChild(btn);
  }
  
  // 创建调整手柄
  function createResizeHandle() {
    resizeHandle = document.createElement('div');
    resizeHandle.style.cssText = `
      position: absolute;
      width: 10px;
      height: 10px;
      background: #0066cc;
      border: 2px solid white;
      border-radius: 50%;
      cursor: ew-resize;
      display: none;
      z-index: 9998;
    `;
    document.body.appendChild(resizeHandle);
  }
  
  // 切换编辑模式
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
  
  // 启用编辑
  function enableEditing() {
    // 让所有文本元素可编辑和调整
    const textElements = document.querySelectorAll('.reveal .slides section h1, .reveal .slides section h2, .reveal .slides section h3, .reveal .slides section p, .reveal .slides section li, .reveal .slides section ul, .reveal .slides section ol');
    
    textElements.forEach(el => {
      // 文本可编辑
      el.setAttribute('contenteditable', 'true');
      el.style.outline = '1px dashed rgba(0, 102, 204, 0.3)';
      el.style.cursor = 'text';
      
      // 点击时显示调整手柄
      el.addEventListener('click', function(e) {
        e.stopPropagation();
        selectElement(this);
      });
    });
    
    // 点击空白处取消选择
    document.addEventListener('click', deselectElement);
  }
  
  // 禁用编辑
  function disableEditing() {
    const editableElements = document.querySelectorAll('[contenteditable="true"]');
    editableElements.forEach(el => {
      el.removeAttribute('contenteditable');
      el.style.outline = 'none';
      el.style.cursor = 'default';
    });
    
    deselectElement();
  }
  
  // 选中元素
  function selectElement(el) {
    if (selectedElement) {
      selectedElement.style.outline = '1px dashed rgba(0, 102, 204, 0.3)';
    }
    
    selectedElement = el;
    el.style.outline = '2px solid #0066cc';
    
    // 显示调整手柄
    const rect = el.getBoundingClientRect();
    resizeHandle.style.display = 'block';
    resizeHandle.style.left = (rect.right - 5) + 'px';
    resizeHandle.style.top = (rect.top + rect.height / 2 - 5) + 'px';
    
    // 绑定拖动事件
    resizeHandle.onmousedown = startResize;
  }
  
  // 取消选择
  function deselectElement() {
    if (selectedElement) {
      selectedElement.style.outline = '1px dashed rgba(0, 102, 204, 0.3)';
      selectedElement = null;
    }
    resizeHandle.style.display = 'none';
  }
  
  // 开始调整宽度
  function startResize(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const startX = e.clientX;
    const startWidth = selectedElement.offsetWidth;
    
    function onMouseMove(e) {
      const deltaX = e.clientX - startX;
      const newWidth = Math.max(100, startWidth + deltaX);
      selectedElement.style.width = newWidth + 'px';
      selectedElement.style.maxWidth = newWidth + 'px';
      
      // 更新手柄位置
      const rect = selectedElement.getBoundingClientRect();
      resizeHandle.style.left = (rect.right - 5) + 'px';
    }
    
    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
  
  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEditMode);
  } else {
    initEditMode();
  }
})();
