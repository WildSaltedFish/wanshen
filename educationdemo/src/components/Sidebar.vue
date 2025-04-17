<!--
 * @Description: 侧边导航组件
-->
<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import {
  Menu as IconMenu,
  Location,
  Document,
  Setting,
  Monitor,
  User,
  Lock,
  House,
  ChatLineRound,
  Collection,
  UserFilled,
  Opportunity,
} from "@element-plus/icons-vue";

const props = defineProps<{
  collapsed: boolean;
}>();

const router = useRouter();
const route = useRoute();

// 过滤并处理路由配置生成菜单项
const menuItems = computed(() => {
  return router.options.routes
    .filter((route) => !route.meta?.hidden)
    .map((route) => ({
      ...route,
      children: route.children?.filter((child) => !child.meta?.hidden),
    }))
    .filter((route) => route.children?.length || route.path !== "/");
});

// 获取当前激活的菜单项
const activeMenu = computed(() => {
  return route.path;
});
</script>

<script lang="ts">
export default {
  name: "Sidebar",
};
</script>

<template>
  <div class="sidebar" :class="{ collapsed }">
    <el-menu
      :collapse="collapsed"
      :default-active="activeMenu"
      class="sidebar-menu"
      router
      unique-opened
    >
      <template v-for="item in menuItems" :key="item.path">
        <el-sub-menu v-if="item.children?.length" :index="item.path">
          <template #title>
            <el-icon v-if="item.meta?.icon" class="menu-icon">
              <component :is="item.meta.icon" />
            </el-icon>
            <span class="menu-title">{{ item.meta?.title }}</span>
          </template>

          <el-menu-item
            v-for="child in item.children"
            :key="child.path"
            :index="child.path"
          >
            <el-icon v-if="child.meta?.icon" class="menu-icon">
              <component :is="child.meta.icon" />
            </el-icon>
            <template #title>
              <span class="menu-title">{{ child.meta?.title }}</span>
            </template>
          </el-menu-item>
        </el-sub-menu>

        <el-menu-item v-else :index="item.path">
          <el-icon v-if="item.meta?.icon" class="menu-icon">
            <component :is="item.meta.icon" />
          </el-icon>
          <template #title>
            <span class="menu-title">{{ item.meta?.title }}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<style lang="scss" scoped>
.sidebar {
  height: 100%;
  background-color: #f5f7fa;
  transition: width 0.3s ease;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  &.collapsed {
    .logo-container {
      padding: 16px 14px;

      .logo-small {
        width: 36px;
      }
    }
  }

  .logo-container {
    height: 64px;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #e6eaf0;
    background-color: #fff;

    .logo {
      height: 32px;
      width: auto;
    }

    .logo-small {
      height: 36px;
      width: 36px;
    }
  }

  .sidebar-menu {
    border-right: none;
    background: transparent;

    :deep(.el-menu) {
      background: transparent;
    }

    // .menu-icon {
    //   font-size: 14px !important;
    // }

    .menu-title {
      font-size: 16px;
      letter-spacing: 2px;
    }

    // :deep(.el-menu-item) .menu-title {
    //   font-size: 16px !important;
    // }

    :deep(.el-menu-item) {
      height: 56px;
      line-height: 56px;
      color: #333;

      &.is-active {
        background: rgba(64, 158, 255, 0.1);
        color: #409eff;
        border-right: 3px solid #409eff;
      }

      &:hover {
        background: rgba(64, 158, 255, 0.05);
        color: #409eff;
      }

      .el-icon {
        color: inherit;
      }
    }
    :deep(.el-sub-menu) {
      :deep(.el-sub-menu__title) {
        height: 56px;
        line-height: 56px;
        color: #333;
        .menu-title {
          font-size: 16px !important;
          letter-spacing: 1px;
        }
        &:hover {
          background: rgba(64, 158, 255, 0.05);
          color: #409eff;
        }

        .el-icon {
          color: inherit;
        }
      }

      .el-menu {
        background-color: #eaeef5;
      }
    }
  }
}
// 二级菜单
.el-menu--inline {
  .el-menu-item {
    .menu-title {
      font-size: 14px !important;
      letter-spacing: 1px;
    }
  }
}
</style>
