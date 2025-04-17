<template>
  <div class="ai-questionbank-container">
    <!-- 导航区 -->
    <el-header class="glass-header">
      <div class="nav-content">
        <h1 class="logo">
          <span style="color: var(--primary)">AI</span>
          <span style="color: var(--secondary)">题库系统</span>
          <div class="title-line"></div>
        </h1>
        <div class="nav-actions">
          <el-button
              v-for="(action, index) in actions"
              :key="index"
              class="flat-btn"
              :style="{ color: action.color }"
          >
            <el-icon><component :is="action.icon" /></el-icon>
            {{ action.label }}
          </el-button>
        </div>
      </div>
    </el-header>

    <!-- 核心功能区 -->
    <main class="main-grid">
      <!-- 智能组卷 -->
      <div class="glass-card generate-card">
        <div class="deco-line"></div>
        <el-icon :color="variables.primary" class="main-icon">
          <MagicStick />
        </el-icon>
        <h2>智能组卷</h2>
        <div class="control-panel">
          <el-select placeholder="选择学科" class="flat-select">
            <el-option label="数学" value="math" />
            <el-option label="物理" value="physics" />
          </el-select>
          <el-button type="primary" class="generate-btn">
            立即生成
          </el-button>
        </div>
      </div>

      <!-- 题库统计 -->
      <div class="stats-panel">
        <div
            v-for="(stat, index) in stats"
            :key="index"
            class="stat-card"
            :style="{ borderColor: stat.color }"
        >
          <div class="stat-header">
            <div class="color-block" :style="{ background: stat.color }"></div>
            <el-icon :color="stat.color"><component :is="stat.icon" /></el-icon>
          </div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>

      <!-- 最新作业 -->
      <div class="glass-card assignment-card">
        <div class="card-header">
          <h3>最新作业</h3>
          <el-tag type="danger">3份待批改</el-tag>
        </div>
        <div class="assignment-list">
          <div
              v-for="(item, index) in assignments"
              :key="index"
              class="assignment-item"
          >
            <div class="subject-tag" :style="{ background: item.color }">
              {{ item.subject }}
            </div>
            <div class="assignment-info">
              <div class="title">{{ item.title }}</div>
              <div class="meta">
                <span>{{ item.class }}班</span>
                <el-divider direction="vertical" />
                <span>提交率 {{ item.submitRate }}</span>
              </div>
            </div>
            <el-button circle class="detail-btn">
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { MagicStick, DataAnalysis, Collection, Document } from '@element-plus/icons-vue'

const variables = {
  primary: '#4566d1',
  secondary: '#45B7D1',
  accent: '#FF6B6B'
}

const actions = ref([
  { label: '题库管理', icon: Collection, color: variables.primary },
  { label: '作业批改', icon: Document, color: variables.secondary },
  { label: '学情分析', icon: DataAnalysis, color: variables.accent }
])

const stats = ref([
  { label: '总题量', value: '12,345', color: variables.primary, icon: Collection },
  { label: '平均正确率', value: '86.7%', color: variables.secondary, icon: DataAnalysis },
  { label: '本周新增', value: '238', color: variables.accent, icon: Document }
])

const assignments = ref([
  {
    subject: '数学',
    title: '立体几何专题练习',
    class: '高三(1)',
    submitRate: '92%',
    color: '#4566d1'
  },
  {
    subject: '物理',
    title: '电磁学综合测试',
    class: '高二(3)',
    submitRate: '85%',
    color: '#45B7D1'
  }
])
</script>

<style lang="scss" scoped>
.ai-questionbank-container {
  --primary: #4566d1;
  --secondary: #45B7D1;
  --accent: #FF6B6B;
  --glass-bg: rgba(255,255,255,0.85);
  min-height: 100vh;
  background: linear-gradient(150deg, #f8fbfe 0%, #f2f7ff 100%);
  padding: 2rem;

  .glass-header {
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
        .title-line {
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
    grid-template-columns: 1fr 300px;
    gap: 2rem;

    .glass-card {
      background: var(--glass-bg);
      backdrop-filter: blur(8px);
      border-radius: 16px;
      padding: 2rem;
      border: 1px solid rgba(69, 102, 209, 0.1);

      &.generate-card {
        grid-row: span 2;
        text-align: center;

        .deco-line {
          width: 60px;
          height: 3px;
          background: var(--primary);
          margin: 1rem auto;
        }

        .main-icon {
          font-size: 3rem;
          margin: 2rem 0;
        }

        .control-panel {
          margin-top: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
      }
    }

    .stats-panel {
      display: grid;
      gap: 1.5rem;

      .stat-card {
        background: var(--glass-bg);
        backdrop-filter: blur(8px);
        border-radius: 12px;
        padding: 1.5rem;
        border-left: 4px solid;

        .stat-header {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;

          .color-block {
            width: 8px;
            height: 24px;
            margin-right: 0.5rem;
          }
        }

        .stat-value {
          font-size: 24px;
          font-weight: 600;
          color: var(--primary);
        }
      }
    }

    .assignment-card {
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
      }

      .assignment-item {
        display: flex;
        align-items: center;
        padding: 1rem;
        margin: 1rem 0;
        background: rgba(255,255,255,0.9);
        border-radius: 8px;

        .subject-tag {
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          margin-right: 1rem;
        }

        .assignment-info {
          flex: 1;
          .title {
            font-weight: 500;
          }
          .meta {
            color: #666;
            font-size: 0.9em;
          }
        }
      }
    }
  }

  .flat-btn {
    background: transparent !important;
    border: none !important;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      color: var(--primary) !important;
    }
  }

  .flat-select {
    :deep(.el-input__inner) {
      background: rgba(69, 102, 209, 0.05) !important;
      border: none !important;
    }
  }

  .generate-btn {
    background: linear-gradient(135deg, var(--primary), var(--secondary)) !important;
    border: none !important;
    border-radius: 8px !important;
  }
}
</style>
