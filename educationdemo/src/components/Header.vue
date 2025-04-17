<!--
 * @Author: bc_ax 1542650614@qq.com
 * @Date: 2025-04-16 11:12:41
 * @LastEditors: bc_ax 1542650614@qq.com
 * @LastEditTime: 2025-04-16 16:03:52
 * @FilePath: \aidemo\src\components\Header.vue
 * @Description: v
-->

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// 导航菜单
const navItems = [
  { name: "万申AI教学助手", path: "/" },
  // { name: '智读', path: '/file' },
  // { name: '研报', path: '/report' },
  // { name: '设置', path: '/settings' }
];

// 处理导航点击
const handleNavClick = (path: string) => {
  router.push(path);
};
</script>

<script lang="ts">
export default {
  name: 'Header'
}
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <img
        src="http://10.88.188.21:9000/aitools/wanshen.png"
        alt=""
        @click="router.push('/')"
      />
    </div>
    <nav class="header-nav">
      <div
        v-for="item in navItems"
        :key="item.path"
        class="nav-item"
        :class="{ active: route.path === item.path }"
        @click="handleNavClick(item.path)"
      >
        {{ item.name }}
      </div>
    </nav>
  </header>
</template>

<style lang="scss" scoped>
.app-header {
  height: 60px;
  background-color: #81b6ea;
  display: flex;
  align-items: center;
  padding: 0 20px;
  position: relative;
  z-index: 200;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .header-nav {
    flex: 1;
    display: flex;
    justify-content: center;
    gap: 40px;

    .nav-item {
      color: rgba(255, 255, 255, 0.8);
      font-size: 18px;
      font-weight: 500;
      letter-spacing: 2px;
      cursor: pointer;
      padding: 8px 16px;
      border-radius: 4px;
      transition: all 0.3s ease;

      &:hover {
        color: white;
        background-color: rgba(255, 255, 255, 0.1);
      }

      &.active {
        color: white;
        background-color: rgba(255, 255, 255, 0.15);
      }
    }
  }

  .header-left {
    height: 40px;
    img {
      height: 100%;
    }
  }
}
</style> 