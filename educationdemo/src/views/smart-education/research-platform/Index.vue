<template>
  <div class="ai-research-platform">
    <!-- 导航区 -->
    <el-header class="glass-nav">
      <div class="nav-content">
        <div class="logo-group">
          <h1 class="logo">
            <span style="color: var(--primary)">AI</span>
            <span style="color: var(--secondary)">教研云</span>
          </h1>
          <div class="nav-line"></div>
        </div>
        <div class="nav-actions">
          <el-button
              v-for="(nav, index) in navItems"
              :key="index"
              class="flat-nav-btn"
              :style="{ '--hover-color': nav.color }"
          >
            <el-icon><component :is="nav.icon" /></el-icon>
            {{ nav.label }}
          </el-button>
        </div>
      </div>
    </el-header>

    <!-- 核心功能区 -->
    <main class="main-grid">
      <!-- 智能教案生成 -->
      <div class="feature-card generate-card">
        <div class="deco-line"></div>
        <el-icon :size="40" :color="variables.primary">
          <MagicStick />
        </el-icon>
        <h2>智能教案生成</h2>
        <div class="control-panel">
          <el-select
              placeholder="选择学科"
              class="modern-select"
              popper-class="modern-select-dropdown"
          >
            <el-option
                v-for="item in subjects"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
          <el-button type="primary" class="generate-btn">
            立即生成
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
      </div>

      <!-- 数据看板 -->
      <div class="stats-panel">
        <div
            v-for="(stat, index) in stats"
            :key="index"
            class="stat-card"
            :style="{ borderLeft: `4px solid ${stat.color}` }"
        >
          <div class="stat-header">
            <el-icon :color="stat.color"><component :is="stat.icon" /></el-icon>
            <div class="stat-value">{{ stat.value }}</div>
          </div>
          <div class="stat-label">{{ stat.label }}</div>
          <div class="progress-bar" :style="{ backgroundColor: stat.color + '20' }">
            <div
                class="progress"
                :style="{
                width: stat.progress + '%',
                backgroundColor: stat.color
              }"
            ></div>
          </div>
        </div>
      </div>

      <!-- 协作看板 -->
      <div class="collab-board">
        <div class="board-header">
          <h3>实时协作</h3>
          <el-tag type="info">23人正在协作</el-tag>
        </div>
        <div class="user-avatars">
          <div
              v-for="(user, index) in activeUsers"
              :key="index"
              class="avatar"
              :style="{
              backgroundColor: stringToColor(user.name),
              left: index * 32 + 'px'
            }"
          >
            {{ user.name.charAt(0) }}
          </div>
        </div>
        <div class="doc-preview">
          <div class="doc-mock">
            <div class="mock-line"></div>
            <div class="mock-line"></div>
            <div class="mock-line" style="width: 80%"></div>
          </div>
        </div>
      </div>

      <!-- 资源中心 -->
      <div class="resource-panel">
        <div class="panel-header">
          <h3>教学资源库</h3>
          <el-button class="upload-btn" text>
            <el-icon><Upload /></el-icon>
            上传新资源
          </el-button>
        </div>
        <div class="resource-grid">
          <div
              v-for="(res, index) in resources"
              :key="index"
              class="resource-card"
              :style="{ borderColor: res.color }"
          >
            <div class="file-type" :style="{ backgroundColor: res.color }">
              {{ res.type }}
            </div>
            <div class="file-name">{{ res.name }}</div>
            <div class="file-meta">
              <el-icon><User /></el-icon>
              {{ res.author }}
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { MagicStick, Collection, DataAnalysis, User, Upload } from '@element-plus/icons-vue'

const variables = {
  primary: '#4566d1',
  secondary: 'rgb(69, 183, 209)',
  accent: '#ff6b6b'
}

const navItems = ref([
  { label: '教案库', icon: Collection, color: variables.primary },
  { label: '学情分析', icon: DataAnalysis, color: variables.secondary },
  { label: '协作空间', icon: User, color: variables.accent }
])

const stats = ref([
  { label: '活跃教师', value: '235', progress: 70, color: variables.primary, icon: User },
  { label: '教学资源', value: '1.2k', progress: 85, color: variables.secondary, icon: Collection },
  { label: 'AI生成量', value: '568', progress: 60, color: variables.accent, icon: MagicStick }
])

const activeUsers = ref([
  { name: '张老师' }, { name: '李主任' }, { name: '王老师' }, { name: '陈教授' }
])

const resources = ref([
  { name: '高中数学教案模板', type: 'DOC', author: '数学组', color: variables.primary },
  { name: '物理实验视频集', type: 'VID', author: '物理组', color: variables.secondary },
  { name: 'AI课件制作指南', type: 'PDF', author: '技术中心', color: variables.accent }
])

const stringToColor = (str) => {
  const colors = [variables.primary, variables.secondary, variables.accent]
  const index = Math.abs(str.split('').reduce((a,b) => a + b.charCodeAt(), 0)) % colors.length
  return colors[index]
}
</script>

<style lang="scss" scoped>
.ai-research-platform {
  --primary: #4566d1;
  --secondary: rgb(69, 183, 209);
  --accent: #ff6b6b;
  --glass-bg: rgba(255,255,255,0.9);
  min-height: 100vh;
  background: linear-gradient(150deg, #f8fbfe 0%, #ecf7ff 100%);
  padding: 2rem;

  .glass-nav {
    background: var(--glass-bg) !important;
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(69, 102, 209, 0.1);
    margin: -2rem -2rem 2rem -2rem;
    padding: 0 2rem;

    .nav-content {
      display: flex;
      align-items: center;
      height: 64px;

      .logo-group {
        position: relative;
        .logo {
          font: 500 24px 'Helvetica Neue';
          letter-spacing: 1px;
        }
        .nav-line {
          width: 40px;
          height: 3px;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          margin-top: 8px;
        }
      }
    }
  }

  .main-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    grid-template-areas:
      "generate generate stats stats"
      "collab collab resource resource";

    .feature-card {
      background: var(--glass-bg);
      backdrop-filter: blur(8px);
      border-radius: 16px;
      padding: 2rem;
      border: 1px solid rgba(69, 102, 209, 0.1);

      &.generate-card {
        grid-area: generate;
        text-align: center;
        .deco-line {
          width: 60px;
          height: 3px;
          background: var(--primary);
          margin: 1rem auto;
        }
        .control-panel {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
        }
      }
    }

    .stats-panel {
      grid-area: stats;
      display: grid;
      gap: 1.5rem;
      .stat-card {
        background: var(--glass-bg);
        padding: 1.5rem;
        border-radius: 8px;
        .stat-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          .stat-value {
            font-size: 24px;
            font-weight: 600;
          }
        }
        .progress-bar {
          height: 6px;
          border-radius: 3px;
          margin-top: 1rem;
          .progress {
            height: 100%;
            border-radius: 3px;
            transition: width 0.5s ease;
          }
        }
      }
    }

    .collab-board {
      grid-area: collab;
      background: var(--glass-bg);
      border-radius: 16px;
      padding: 2rem;
      .user-avatars {
        position: relative;
        height: 48px;
        margin: 1rem 0;
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          transition: all 0.3s ease;
        }
      }
      .doc-mock {
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        .mock-line {
          height: 12px;
          background: rgba(0,0,0,0.05);
          margin: 8px 0;
          border-radius: 4px;
          &:nth-child(odd) {
            width: 60%;
          }
        }
      }
    }

    .resource-panel {
      grid-area: resource;
      .resource-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        .resource-card {
          background: var(--glass-bg);
          border-radius: 8px;
          padding: 1rem;
          border-left: 4px solid;
          .file-type {
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            width: fit-content;
            margin-bottom: 1rem;
          }
        }
      }
    }
  }

  .modern-select {
    :deep(.el-input__inner) {
      background: rgba(69, 102, 209, 0.05) !important;
      border: none !important;
      border-radius: 8px !important;
    }
  }

  .generate-btn {
    background: linear-gradient(135deg, var(--primary), var(--secondary)) !important;
    border: none !important;
    border-radius: 8px !important;
    padding: 12px 24px !important;
  }

  .flat-nav-btn {
    background: none !important;
    border: none !important;
    transition: all 0.3s ease;
    &:hover {
      transform: translateY(-2px);
      color: var(--hover-color) !important;
    }
  }
}
</style>
