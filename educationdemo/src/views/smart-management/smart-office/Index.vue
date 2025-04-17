<template>
  <!-- 主容器 -->
  <div class="optimized-glass-container">
    <!-- 极简导航 -->
    <el-header class="clean-header">
      <div class="header-content">
        <h1 class="minimal-logo">
          <span>AI</span>Office
          <div class="logo-line"></div>
        </h1>
        <div class="header-actions">
          <el-button
              v-for="(action, index) in actions"
              :key="index"
              class="flat-btn"
              :style="{ color: action.color }"
          >
            <i :class="action.icon"></i>
            <span>{{ action.label }}</span>
          </el-button>
        </div>
      </div>
    </el-header>

    <!-- 核心功能展示 -->
    <main class="content-grid">
      <div
          v-for="(card, index) in featureCards"
          :key="index"
          class="enhanced-card"
          :style="{ '--accent-color': card.color }"
      >
        <div class="card-header">
          <i :class="card.icon" class="card-icon"></i>
          <div class="decorative-line"></div>
        </div>
        <h3 class="card-title">{{ card.title }}</h3>
        <ul class="feature-list">
          <li
              v-for="(item, i) in card.features"
              :key="i"
              class="list-item"
          >
            <el-icon><el-icon-check /></el-icon>
            {{ item }}
          </li>
        </ul>
        <div class="card-hover-layer"></div>
      </div>
    </main>

    <!-- 状态栏 -->
    <div class="status-bar">
      <div class="status-item" v-for="(stat, index) in stats" :key="index">
        <div class="stat-badge" :style="{ backgroundColor: stat.color }"></div>
        <span class="stat-label">{{ stat.label }}</span>
        <span class="stat-value">{{ stat.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 功能卡片配置
const featureCards = ref([
  {
    icon: 'el-icon-document',
    title: '智能文档',
    color: '#FF6B6B',
    features: ['自动生成模板', '多人协作编辑', '版本历史追溯', '智能语法检查']
  },
  {
    icon: 'el-icon-data-analysis',
    title: '数据分析',
    color: '#4ECDC4',
    features: ['可视化报表', '实时数据监控', '预测性分析', '多数据源整合']
  },
  {
    icon: 'el-icon-chat-line-round',
    title: '会议助手',
    color: '#A3DE83',
    features: ['语音实时转录', '待办事项生成', '智能日程安排', '会议纪要摘要']
  }
])

// 状态数据
const stats = ref([
  { label: '在线用户', value: '1.2k', color: '#4ECDC4' },
  { label: '处理文档', value: '3.8k', color: '#FF6B6B' },
  { label: '会议记录', value: '456', color: '#A3DE83' }
])
</script>

<style scoped>
/* 优化毛玻璃容器 */
.optimized-glass-container {
  --primary: #4566d1;
  --secondary: rgb(69, 183, 209);
  /* 新增辅助色 */
  --accent-1: #ff9f4d;
  --accent-2: #a3de83;
  min-height: 100vh;
  background: linear-gradient(150deg, #f8fbfe 0%, #f2f7fb 100%);
  backdrop-filter: blur(12px);
  padding: 20px;
}

.optimized-glass-container {
  background: linear-gradient(
      150deg,
      rgba(240, 245, 255, 0.95) 0%,
      rgba(232, 248, 255, 0.95) 100%
  );
}

/* 极简导航栏 */
.clean-header {
  background: rgba(255,255,255,0.9) !important;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  margin: -20px -20px 30px -20px;
  padding-left: 30px;
}

.minimal-logo {
  font: 600 24px 'Helvetica Neue';
  color: var(--primary);
  position: relative;
  padding-bottom: 8px;
  padding-top: 10px;
}

.logo-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: var(--secondary);
  border-radius: 2px;
}

/* 增强卡片 */
.enhanced-card {
  background: rgba(255,255,255,0.9);
  border-radius: 12px;
  padding: 25px;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s;
  border: 1px solid rgba(69, 102, 209, 0.1);}

.enhanced-card:hover {
  transform: translateY(-3px);
}

.card-icon {
  font-size: 32px;
  color: var(--primary);
  margin-bottom: 15px;
}

.decorative-line {
  width: 30px;
  height: 2px;
  background: linear-gradient(
      to right,
      var(--primary) 30%,
      var(--secondary)
  );
  margin: 10px 0;
  opacity: 0.6;
}

/* 特征列表 */
.feature-list {
  margin-top: 15px;
}

.list-item {
  padding: 8px 0;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.list-item .el-icon {
  color: var(--accent-color);
  margin-right: 8px;
}

/* 状态栏 */
.status-bar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  margin-top: 30px;
  background: linear-gradient(
      to right,
      rgba(69, 102, 209, 0.05),
      rgba(69, 183, 209, 0.05)
  );
  padding: 15px;
  border-radius: 8px;
}

.stat-badge {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
  box-shadow: 0 0 8px currentColor;
}

.stat-label {
  font-size: 12px;
  color: #888;
  margin-right: 5px;
}

.stat-value {
  font-weight: 600;
  color: #444;
}

/* 响应式布局 */
.content-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    margin-top: 15px;
  }
}

/* 按钮交互增强 */
.flat-btn {
  transition: all 0.3s ease;
}

.flat-btn:hover {
  background: rgba(69, 102, 209, 0.05);
  transform: translateY(-2px);
}

/* 新增卡片悬浮层 */
.card-hover-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
      circle at var(--x) var(--y),
      rgba(69, 102, 209, 0.08) 0%,
      transparent 60%
  );
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;
}

.enhanced-card:hover .card-hover-layer {
  opacity: 1;
}
</style>
