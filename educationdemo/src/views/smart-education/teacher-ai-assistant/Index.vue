<template>
  <div class="ai-office-container">
    <!-- 导航区 -->
    <el-header class="glass-nav">
      <div class="nav-content">
        <h1 class="logo">
          <span style="color: var(--primary)">AI</span>
          <span style="color: var(--secondary)">Office</span>
          <div class="nav-line"></div>
        </h1>
        <div class="nav-buttons">
          <el-button
              v-for="(btn, index) in navButtons"
              :key="index"
              class="flat-btn"
              :style="{ color: btn.color }"
          >
            <i :class="btn.icon"></i>
            {{ btn.label }}
          </el-button>
        </div>
      </div>
    </el-header>

    <!-- 功能展示区 -->
    <main class="feature-grid">
      <div
          v-for="(feature, index) in features"
          :key="index"
          class="glass-card"
          :style="{ '--accent': feature.color }"
      >
        <div class="decorative-line"></div>
        <el-icon :color="feature.color" class="card-icon">
          <component :is="feature.icon" />
        </el-icon>
        <h3>{{ feature.title }}</h3>
        <p class="desc">{{ feature.desc }}</p>
        <div class="hover-effect"></div>
      </div>
    </main>

    <!-- 数据看板 -->
    <div class="dashboard">
      <div
          v-for="(item, index) in stats"
          :key="index"
          class="data-badge"
          :style="{ backgroundColor: item.color + '20' }"
      >
        <div class="value" :style="{ color: item.color }">{{ item.value }}</div>
        <div class="label">{{ item.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { MagicStick, DataAnalysis, Document } from '@element-plus/icons-vue'

const navButtons = ref([
  { label: '智能文档', icon: 'el-icon-document', color: '#4566d1' },
  { label: '会议助手', icon: 'el-icon-chat-line-round', color: '#45B7D1' },
  { label: '数据分析', icon: 'el-icon-data-line', color: '#FF9F4D' }
])

const features = ref([
  {
    title: '智能创作',
    desc: 'AI辅助文档生成与优化',
    icon: MagicStick,
    color: '#4566d1'
  },
  {
    title: '数据分析',
    desc: '实时数据可视化洞察',
    icon: DataAnalysis,
    color: '#45B7D1'
  },
  {
    title: '文档管理',
    desc: '智能分类与版本控制',
    icon: Document,
    color: '#FF6B6B'
  }
])

const stats = ref([
  { value: '1.2K', label: '今日处理', color: '#4566d1' },
  { value: '98%', label: '准确率', color: '#45B7D1' },
  { value: '456', label: '协同编辑', color: '#FF9F4D' }
])
</script>

<style lang="scss" scoped>
.ai-office-container {
  --primary: #4566d1;
  --secondary: #45B7D1;
  --glass-bg: rgba(255, 255, 255, 0.85);
  min-height: 100vh;
  background: linear-gradient(150deg, #f8fbfe 0%, #f2f7ff 100%);
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
      height: 60px;

      .logo {
        font: 500 24px 'Helvetica Neue';
        position: relative;
        .nav-line {
          width: 40px;
          height: 3px;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          margin-top: 8px;
        }
      }
    }
  }

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;

    .glass-card {
      background: var(--glass-bg);
      backdrop-filter: blur(8px);
      border-radius: 16px;
      padding: 2rem;
      position: relative;
      transition: transform 0.3s ease;
      border: 1px solid rgba(69, 102, 209, 0.1);

      &:hover {
        transform: translateY(-5px);
        .hover-effect {
          opacity: 1;
        }
      }

      .decorative-line {
        width: 40px;
        height: 2px;
        background: var(--accent);
        margin: 1rem 0;
      }

      .card-icon {
        font-size: 2.5rem;
        margin: 1rem 0;
      }

      h3 {
        color: var(--primary);
        margin: 1rem 0;
      }

      .desc {
        color: #666;
        line-height: 1.6;
      }

      .hover-effect {
        position: absolute;
        inset: 0;
        background: radial-gradient(
                200px circle at var(--x) var(--y),
                rgba(69, 102, 209, 0.08) 0%,
                transparent 100%
        );
        opacity: 0;
        transition: opacity 0.3s;
      }
    }
  }

  .dashboard {
    display: flex;
    gap: 1.5rem;
    justify-content: center;

    .data-badge {
      padding: 1.5rem;
      border-radius: 12px;
      min-width: 120px;
      text-align: center;

      .value {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }

      .label {
        color: #666;
        font-size: 14px;
      }
    }
  }

  .flat-btn {
    background: transparent !important;
    border: none !important;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      color: var(--primary) !important;
    }
  }
}
</style>
