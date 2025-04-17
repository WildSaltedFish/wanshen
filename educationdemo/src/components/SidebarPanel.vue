<!--
 * @Author: bc-ax 1542650614@qq.com
 * @Date: 2025-03-12 15:30:00
 * @LastEditors: bc-ax 1542650614@qq.com
 * @LastEditTime: 2025-03-12 14:26:36
 * @FilePath: \demo\src\components\SidebarPanel.vue
 * @Description: 右侧侧边栏面板组件
-->

<script setup lang="ts">
import { defineEmits, defineComponent } from 'vue';

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};
</script>

<script lang="ts">
export default defineComponent({
  name: 'SidebarPanel'
});
</script>

<template>
  <div class="sidebar-panel-overlay" @click="close">
    <div class="sidebar-panel" @click.stop>
      <div class="sidebar-header">
        <h3>内容结构</h3>
        <button class="close-btn" @click="close">
          <span class="close-icon">×</span>
        </button>
      </div>
      <div class="sidebar-content">
        <!-- 这里可以添加右侧面板的内容 -->
        <p>此处可以显示文档结构或其他辅助信息</p>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 定义变量
$text-primary: #2c3e50;
$text-secondary: #7f8c8d;
$border-color: #e9ecef;
$bg-white: #fff;
$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.1);

/* 遮罩层样式 */
.sidebar-panel-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
}

/* 右侧面板样式 */
.sidebar-panel {
  width: 400px;
  height: 100%;
  background-color: $bg-white;
  box-shadow: $shadow-sm;
  padding: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid $border-color;

  h3 {
    margin: 0;
    font-size: 1.1rem;
    color: $text-primary;
  }
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: $text-secondary;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background-color: $border-color;
    color: $text-primary;
  }
}

.sidebar-content {
  padding: 20px;
  flex: 1;
}

// 响应式布局
@media (max-width: 768px) {
  .sidebar-panel {
    width: 300px;
  }
}
</style>