<!--
 * @Author: bc-ax 1542650614@qq.com
 * @Date: 2025-03-11 17:02:10
 * @LastEditors: bc-ax 1542650614@qq.com
 * @LastEditTime: 2025-03-11 17:23:24
 * @FilePath: \demo\src\components\markdown\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="chat-container">
      <MarkdownView :content="markdownContent" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import MarkdownView from './MarkdownView.vue';
  
  const markdownContent = ref(`
  # Markdown 示例页面
  
  这是一个 **Markdown** 渲染示例。
  
  ## 代码高亮
  
  \`\`\`javascript
  // 这是一段 JavaScript 代码
  function hello(name) {
    console.log(\`Hello, \${name}!\`);
  }
  
  hello('World');
  \`\`\`
  
  ## 列表示例
  
  ### 无序列表
  - 项目 1
  - 项目 2
  - 项目 3
  
  ### 有序列表
  1. 第一项
  2. 第二项
  3. 第三项
  
  ## 链接和强调
  
  这是一个 [链接示例](https://example.com)。
  
  *这是斜体文本* 和 **这是粗体文本**。
  
  ## 引用
  
  > 这是一段引用文本。
  > 可以有多行。
  
  ## 表格
  
  | 表头 1 | 表头 2 |
  |--------|--------|
  | 单元格 1 | 单元格 2 |
  | 单元格 3 | 单元格 4 |
  `);
  </script>

  <style scoped>
  .chat-container {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    height: 100vh;
    overflow-y: auto;
  }
  </style>