<!--
 * @Author: bc-ax 1542650614@qq.com
 * @Date: 2025-03-07 13:12:25
 * @LastEditors: bc_ax 1542650614@qq.com
 * @LastEditTime: 2025-04-16 10:38:32
 * @FilePath: \demo\src\App.vue
 * @Description: 应用主组件
-->
<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from "vue-router";
import { computed } from "vue";
import Sidebar from "./components/Sidebar.vue";
import Header from "./components/Header.vue";
import PageHeader from './components/PageHeader.vue';
import MainLayout from './components/MainLayout.vue';

const route = useRoute();

// 控制侧边栏折叠状态
const isCollapsed = ref(false);

// 切换侧边栏
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

// 计算是否显示侧边栏
const showSidebar = computed(() => {
  return [
    "/",
    "/welcome",
    "/chat",
    "/mainpage",
    "/resumenew",
    "/resumeold",
    "/onlineInterview",
    "/mockInterview",
    "/mbti",
  ].includes(route.path);
});

// 导航菜单
const navItems = [
  { name: "万申AI教学助手", path: "/" },
  // { name: '智读', path: '/file' },
  // { name: '研报', path: '/report' },
  // { name: '设置', path: '/settings' }
];

// 处理导航点击
const handleNavClick = (path: string) => {
  // TODO: 实现导航点击逻辑
  console.log("导航点击", path);
};

// 处理用户注销
const handleLogout = () => {
  // TODO: 实现注销逻辑
  console.log("用户注销");
};
</script>

<script lang="ts">
export default {
  name: 'App'
}
</script>

<template>
  <MainLayout />
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  background-color: #f8fafc;
}

#app {
  height: 100%;
  width: 100%;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.main-container {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
}

.sidebar-container {
  position: fixed;
  left: 0;
  top: 60px;
  bottom: 0;
  transition: all 0.3s ease;
  background-color: #f8fafc;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.content-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
  min-height: calc(100vh - 60px);
}

.main-content {
  flex: 1;
  // padding: 24px;
  overflow: auto;
  background-color: #f8fafc;
}

// 响应式处理
@media screen and (max-width: 768px) {
  .sidebar-container {
    transform: translateX(-200px);
    
    &.is-collapsed {
      transform: translateX(-64px);
    }
    
    &.is-show {
      transform: translateX(0);
    }
  }
  
  .content-container {
    margin-left: 0 !important;
  }
}
</style>
