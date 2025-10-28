// 演示文稿编辑器 - 独立脚本
(function() {
  'use strict';
  
  let isEditMode = false;
  let selectedElement = null;
  let selectedImage = null;
  let resizeHandle = null;
  let imageHandles = [];
  let imageWrapper = null;
  
  // 初始化
  function init() {
    createEditButton();
    createResizeHandle();
    console.log('✅ 编辑器初始化完成');
  }
  
  // 创建编辑按钮
  function createEditButton() {
    const btn = document.createElement('button');
    btn.id = 'edit-mode-btn';
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
      transition: all 0.3s;
    `;
    
    btn.onmouseenter = () => {
      btn.style.background = isEditMode ? '#00a758' : '#0052a3';
      btn.style.transform = 'translateY(-2px)';
    };
    
    btn.onmouseleave = () => {
      btn.style.background = isEditMode ? '#00a758' : '#0066cc';
      btn.style.transform = 'translateY(0)';
    };
    
    btn.onclick = toggleEditMode;
    document.body.appendChild(btn);
  }
  
  // 创建文本框调整手柄
  function createResizeHandle() {
    resizeHandle = document.createElement('div');
    resizeHandle.style.cssText = `
      position: fixed;
      width: 14px;
      height: 14px;
      background: #0066cc;
      border: 3px solid white;
      border-radius: 50%;
      cursor: se-resize;
      display: none;
      z-index: 9998;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    `;
    resizeHandle.title = '拖动调整大小';
    document.body.appendChild(resizeHandle);
  }
  
  // 切换编辑模式
  function toggleEditMode() {
    isEditMode = !isEditMode;
    const btn = document.getElementById('edit-mode-btn');
    
    if (isEditMode) {
      btn.innerHTML = '✅ 完成编辑';
      btn.style.background = '#00a758';
      enableEditing();
      console.log('✅ 编辑模式已启用');
    } else {
      btn.innerHTML = '✏️ 编辑模式';
      btn.style.background = '#0066cc';
      disableEditing();
      console.log('✅ 编辑模式已关闭');
    }
  }
  
  // 启用编辑
  function enableEditing() {
    // 文本元素可编辑
    const textElements = document.querySelectorAll('.reveal .slides section h1, .reveal .slides section h2, .reveal .slides section h3, .reveal .slides section p, .reveal .slides section li, .reveal .slides section ul, .reveal .slides section ol');
    
    textElements.forEach(el => {
      el.setAttribute('contenteditable', 'true');
      el.style.outline = '1px dashed rgba(0, 102, 204, 0.3)';
      el.style.cursor = 'text';
      
      el.addEventListener('click', function(e) {
        e.stopPropagation();
        removeImageHandles();
        selectTextElement(this);
      });
    });
    
    // 图片可编辑
    const images = document.querySelectorAll('.reveal .slides section img');
    images.forEach(img => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', function(e) {
        e.stopPropagation();
        deselectTextElement();
        selectImage(this);
      });
    });
    
    // 点击空白处取消选择
    document.addEventListener('click', handleDocumentClick);
  }
  
  // 禁用编辑
  function disableEditing() {
    document.querySelectorAll('[contenteditable="true"]').forEach(el => {
      el.removeAttribute('contenteditable');
      el.style.outline = 'none';
      el.style.cursor = 'default';
    });
    
    document.querySelectorAll('.reveal .slides section img').forEach(img => {
      img.style.cursor = 'default';
    });
    
    deselectTextElement();
    removeImageHandles();
    document.removeEventListener('click', handleDocumentClick);
  }
  
  // 处理文档点击
  function handleDocumentClick(e) {
    const target = e.target;
    
    // 如果点击的是图片或手柄，不处理
    if (target.tagName === 'IMG' || 
        target.id === 'edit-mode-btn' ||
        target.style.cursor.includes('resize')) {
      return;
    }
    
    // 如果点击的是可编辑元素，不处理
    if (target.getAttribute('contenteditable') === 'true') {
      return;
    }
    
    // 否则取消所有选择
    deselectTextElement();
    removeImageHandles();
  }
  
  // === 文本框编辑 ===
  function selectTextElement(el) {
    if (selectedElement) {
      selectedElement.style.outline = '1px dashed rgba(0, 102, 204, 0.3)';
      selectedElement.style.background = 'transparent';
    }
    
    selectedElement = el;
    el.style.outline = '2px solid #0066cc';
    el.style.background = 'rgba(0, 102, 204, 0.05)';
    
    updateResizeHandle();
    resizeHandle.onmousedown = startTextResize;
  }
  
  function deselectTextElement() {
    if (selectedElement) {
      selectedElement.style.outline = '1px dashed rgba(0, 102, 204, 0.3)';
      selectedElement.style.background = 'transparent';
      selectedElement = null;
    }
    resizeHandle.style.display = 'none';
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
  
  function startTextResize(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = selectedElement.offsetWidth;
    const startHeight = selectedElement.offsetHeight;
    
    function onMove(e) {
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
    
    function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
    
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }
  
  // === 图片编辑 ===
  function selectImage(img) {
    // 先清理之前的
    removeImageHandles();
    
    selectedImage = img;
    img.style.outline = '2px solid #0066cc';
    
    // 创建wrapper和手柄
    imageWrapper = document.createElement('div');
    imageWrapper.style.cssText = 'position: relative; display: inline-block;';
    imageWrapper.className = 'image-edit-wrapper';
    
    img.parentNode.insertBefore(imageWrapper, img);
    imageWrapper.appendChild(img);
    
    // 8个手柄
    const positions = [
      {pos:'nw', cursor:'nw-resize', top:-6, left:-6},
      {pos:'n', cursor:'n-resize', top:-6, left:'50%', transform:'translateX(-50%)'},
      {pos:'ne', cursor:'ne-resize', top:-6, right:-6},
      {pos:'e', cursor:'e-resize', top:'50%', right:-6, transform:'translateY(-50%)'},
      {pos:'se', cursor:'se-resize', bottom:-6, right:-6},
      {pos:'s', cursor:'s-resize', bottom:-6, left:'50%', transform:'translateX(-50%)'},
      {pos:'sw', cursor:'sw-resize', bottom:-6, left:-6},
      {pos:'w', cursor:'w-resize', top:'50%', left:-6, transform:'translateY(-50%)'}
    ];
    
    positions.forEach(p => {
      const handle = document.createElement('div');
      handle.style.cssText = `
        position: absolute;
        width: 12px;
        height: 12px;
        background: #0066cc;
        border: 2px solid white;
        border-radius: 50%;
        z-index: 9999;
        cursor: ${p.cursor};
        ${p.top !== undefined ? 'top: ' + p.top + 'px;' : ''}
        ${p.bottom !== undefined ? 'bottom: ' + p.bottom + 'px;' : ''}
        ${p.left !== undefined ? 'left: ' + (typeof p.left === 'number' ? p.left + 'px' : p.left) + ';' : ''}
        ${p.right !== undefined ? 'right: ' + p.right + 'px;' : ''}
        ${p.transform ? 'transform: ' + p.transform + ';' : ''}
      `;
      
      handle.onmousedown = (e) => startImageResize(e, p, img, imageWrapper);
      
      imageWrapper.appendChild(handle);
      imageHandles.push(handle);
    });
    
    console.log('✅ 图片已选中，手柄已添加');
  }
  
  function removeImageHandles() {
    // 移除所有手柄
    imageHandles.forEach(h => {
      if (h && h.parentNode) {
        h.remove();
      }
    });
    imageHandles = [];
    
    // 恢复图片
    if (selectedImage) {
      selectedImage.style.outline = 'none';
      
      // 移除wrapper
      if (imageWrapper && imageWrapper.parentNode) {
        imageWrapper.parentNode.insertBefore(selectedImage, imageWrapper);
        imageWrapper.remove();
      }
      
      selectedImage = null;
      imageWrapper = null;
    }
    
    console.log('✅ 图片手柄已清理');
  }
  
  function startImageResize(e, position, img, wrapper) {
    e.preventDefault();
    e.stopPropagation();
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = img.offsetWidth;
    const startHeight = img.offsetHeight;
    const startLeft = wrapper.offsetLeft;
    const startTop = wrapper.offsetTop;
    
    function onMove(e) {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newLeft = startLeft;
      let newTop = startTop;
      
      if (position.pos.includes('e')) newWidth = startWidth + deltaX;
      if (position.pos.includes('w')) {
        newWidth = startWidth - deltaX;
        newLeft = startLeft + deltaX;
      }
      if (position.pos.includes('s')) newHeight = startHeight + deltaY;
      if (position.pos.includes('n')) {
        newHeight = startHeight - deltaY;
        newTop = startTop + deltaY;
      }
      
      newWidth = Math.max(50, newWidth);
      newHeight = Math.max(50, newHeight);
      
      img.style.width = newWidth + 'px';
      img.style.height = newHeight + 'px';
      img.style.maxWidth = newWidth + 'px';
      img.style.maxHeight = newHeight + 'px';
      img.style.objectFit = 'fill';
      
      if (position.pos.includes('w') || position.pos.includes('n')) {
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
  }
  
  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
