<!--
 * @Description: 页面头部组件
-->
<script setup lang="ts">
import { Expand, Fold } from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';

const props = defineProps<{
  collapsed: boolean;
  toggleSidebar: () => void;
}>();

const route = useRoute();
const router = useRouter();

// 获取当前路由的标题
const currentTitle = computed(() => {
  return route.meta?.title || '当前页面';
});

// 获取面包屑路径
const breadcrumbs = computed(() => {
  const paths = route.path.split('/').filter(Boolean);
  if (paths.length === 0) return [{ title: '首页', path: '/' }];
  
  const result = [{ title: '首页', path: '/' }];
  
  // 找到匹配的路由
  const getRouteByPath = (path) => {
    return router.options.routes.find(r => r.path === '/' + path || r.name === path);
  };
  
  // 查找子路由
  const findChildRoute = (parentRoute, path) => {
    if (!parentRoute?.children) return null;
    return parentRoute.children.find(r => {
      const routePath = r.path.startsWith('/') ? r.path.substring(r.path.lastIndexOf('/') + 1) : r.path;
      return routePath === path || r.name === path;
    });
  };
  
  let currentPath = '';
  let parentRoute = null;
  
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    currentPath += '/' + path;
    
    if (!parentRoute) {
      parentRoute = getRouteByPath(path);
      if (parentRoute) {
        result.push({
          title: parentRoute.meta?.title || path,
          path: currentPath
        });
      }
    } else if (path === 'management') {
      const childRoute = findChildRoute(parentRoute, paths[i + 1]);
      if (childRoute) {
        result.push({
          title: parentRoute.meta?.title || path,
          path: currentPath
        });
      }
    } else {
      const childRoute = findChildRoute(parentRoute, path);
      if (childRoute) {
        result.push({
          title: childRoute.meta?.title || path,
          path: currentPath
        });
      } else {
        result.push({
          title: path,
          path: currentPath
        });
      }
    }
  }
  
  return result;
});
</script>

<script lang="ts">
export default {
  name: 'PageHeader'
}
</script>

<template>
  <div class="page-header">
    <div class="left-section">
      <el-button
        link
        class="toggle-button"
        @click="toggleSidebar"
      >
        <el-icon :size="20">
          <component :is="collapsed ? Expand : Fold" />
        </el-icon>
      </el-button>
      
      <el-breadcrumb separator="/">
        <el-breadcrumb-item 
          v-for="(item, index) in breadcrumbs" 
          :key="index" 
          :to="item.path"
        >
          {{ item.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="right-section">
      <slot name="extra"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-header {
  height: 56px;
  padding: 0 10px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  
  .left-section {
    display: flex;
    align-items: center;
  }
  
  .toggle-button {
    width: 40px;
    height: 40px;
    margin-right: 16px;
    padding: 0;
    border-radius: 50%;
    color: #1e293b;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      color: #1890ff;
      background: #f0f5ff;
    }

    .el-icon {
      font-size: 20px;
    }
  }

  :deep(.el-breadcrumb__item) {
    .el-breadcrumb__inner {
      color: #1e293b;
      font-size: 16px;
      
      &:hover {
        color: #1890ff;
      }

      &.is-link {
        font-weight: normal;
      }
    }

    &:last-child {
      .el-breadcrumb__inner {
        color: #1890ff;
        font-weight: 500;
      }
    }
  }

  .right-section {
    display: flex;
    align-items: center;
    gap: 16px;
  }
}
</style>