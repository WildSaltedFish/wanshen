<!--
 * @Author: bc_ax 1542650614@qq.com
 * @Date: 2025-04-16 13:26:48
 * @LastEditors: bc_ax 1542650614@qq.com
 * @LastEditTime: 2025-04-16 15:02:37
 * @FilePath: \aidemo\src\components\MainLayout.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Description: 主布局组件
-->
<script setup lang="ts">
import { ref } from 'vue';
import Sidebar from './Sidebar.vue';
import PageHeader from './PageHeader.vue';
import Header from './Header.vue';

const collapsed = ref(false);

const toggleSidebar = () => {
  collapsed.value = !collapsed.value;
};
</script>

<script lang="ts">
export default {
  name: 'MainLayout'
}
</script>

<template>
  <div class="main-layout">
    <Header class="main-header" />
    <div class="main-content">
      <Sidebar :collapsed="collapsed" class="layout-sidebar" />
      <div class="layout-container">
        <PageHeader 
          :collapsed="collapsed" 
          :toggleSidebar="toggleSidebar"
          class="layout-header" 
        />
        <main class="layout-content">
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-layout {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  min-width: 1200px;
  background-color: #fff;
  
  .main-header {
    height: 60px;
    width: 100%;
    flex: none;
  }
  
  .main-content {
    flex: 1;
    display: flex;
    height: calc(100% - 60px);
    overflow: hidden;
  }
  
  .layout-sidebar {
    height: 100%;
    flex: none;
    width: v-bind('collapsed ? "64px" : "240px"');
    transition: width 0.3s ease;
    z-index: 100;
    border-right: 1px solid #e6e6e6;
  }
  
  .layout-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 960px;
    background-color: #f0f2f5;
    
    .layout-header {
      height: 56px;
      flex: none;
      border-bottom: 1px solid #e6e6e6;
    }
    
    .layout-content {
      flex: 1;
      // padding: 16px;
      overflow: auto;
      
      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      
      &::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 3px;
      }
      
      &::-webkit-scrollbar-track {
        background: #f1f1f1;
      }
    }
  }
}
</style> 