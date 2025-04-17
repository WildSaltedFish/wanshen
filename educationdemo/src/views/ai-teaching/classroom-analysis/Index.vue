<template>
  <div class="ai-analytics-container">
    <!-- 导航区 -->
    <el-header class="glass-header">
      <div class="header-content">
        <h1 class="logo">
          <span style="color: var(--primary)">AI</span>
          <span style="color: var(--secondary)">课堂洞察</span>
          <div class="title-line"></div>
        </h1>
        <div class="header-actions">
          <el-select
              v-model="selectedClass"
              placeholder="选择班级"
              class="modern-select"
          >
            <el-option
                v-for="item in classes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </div>
      </div>
    </el-header>

    <!-- 核心数据区 -->
    <main class="dashboard-grid">
      <!-- 核心指标 -->
      <div class="glass-card metrics-panel">
        <div class="metric-grid">
          <div
              v-for="(metric, index) in metrics"
              :key="index"
              class="metric-item"
              :style="{ borderLeft: `4px solid ${metric.color}` }"
          >
            <div class="metric-value">{{ metric.value }}</div>
            <div class="metric-label">{{ metric.label }}</div>
            <el-icon :color="metric.color" class="trend-icon">
              <component :is="metric.trend" />
            </el-icon>
          </div>
        </div>
      </div>

      <!-- 参与度趋势 -->
      <div class="glass-card chart-card">
        <div class="card-header">
          <h3>课堂参与趋势</h3>
          <div class="legend">
            <span class="legend-item" style="color: var(--primary)">
              <div class="legend-dot"></div>
              当前班级
            </span>
            <span class="legend-item" style="color: var(--secondary)">
              <div class="legend-dot"></div>
              年级平均
            </span>
          </div>
        </div>
        <div class="line-chart"></div>
      </div>

      <!-- 知识点掌握 -->
      <div class="glass-card knowledge-card">
        <div class="card-header">
          <h3>知识点掌握率</h3>
          <el-radio-group v-model="knowledgeType">
            <el-radio-button label="本章"></el-radio-button>
            <el-radio-button label="全册"></el-radio-button>
          </el-radio-group>
        </div>
        <div class="bar-chart"></div>
      </div>

      <!-- 学生分布 -->
      <div class="glass-card distribution-card">
        <div class="card-header">
          <h3>成绩分布</h3>
          <el-tag >
           test
          </el-tag>
        </div>
        <div class="donut-chart"></div>
        <div class="distribution-labels">
          <div
              v-for="(item, index) in distributionData"
              :key="index"
              class="label-item"
          >
            <div class="color-dot" :style="{ backgroundColor: item.color }"></div>
            <span>{{ item.label }}</span>
            <span>{{ item.percentage }}%</span>
          </div>
        </div>
      </div>

      <!-- 实时互动 -->
      <div class="glass-card interaction-card">
        <div class="card-header">
          <h3>实时互动分析</h3>
          <el-button
              type="primary"
              class="analysis-btn"
              :icon="Refresh"
          >
            更新数据
          </el-button>
        </div>
        <div class="heatmap"></div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { TrendCharts, Refresh } from '@element-plus/icons-vue'

const variables = {
  primary: '#4566d1',
  secondary: 'rgb(69, 183, 209)',
  accent: '#ff6b6b'
}

const selectedClass = ref('class1')
const classes = ref([
  { label: '高三(1)班', value: 'class1' },
  { label: '高三(2)班', value: 'class2' }
])

const metrics = ref([
  {
    label: '平均参与度',
    value: '86%',
    color: variables.primary,
    trend: TrendCharts
  },
  {
    label: '疑问数量',
    value: '23',
    color: variables.secondary,
    trend: TrendCharts
  },
  {
    label: '平均得分',
    value: '92.5',
    color: variables.accent,
    trend: TrendCharts
  }
])

const distributionData = ref([
  { label: '优秀', percentage: 35, color: variables.primary },
  { label: '良好', percentage: 45, color: variables.secondary },
  { label: '待提高', percentage: 20, color: variables.accent }
])
</script>

<style lang="scss" scoped>
.ai-analytics-container {
  --primary: #4566d1;
  --secondary: rgb(69, 183, 209);
  --accent: #ff6b6b;
  --glass-bg: rgba(255,255,255,0.9);
  min-height: 100vh;
  background: linear-gradient(150deg, #f8fbfe 0%, #eaf5ff 100%);
  padding: 2rem;

  .glass-header {
    background: var(--glass-bg) !important;
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(69, 102, 209, 0.1);
    margin: -2rem -2rem 2rem -2rem;
    padding: 0 2rem;

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 64px;

      .logo {
        font: 500 24px 'Helvetica Neue';
        .title-line {
          width: 40px;
          height: 3px;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          margin-top: 8px;
        }
      }
    }
  }

  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 1.5rem;

    .glass-card {
      background: var(--glass-bg);
      backdrop-filter: blur(8px);
      border-radius: 16px;
      padding: 1.5rem;
      border: 1px solid rgba(69, 102, 209, 0.1);

      &.metrics-panel {
        grid-column: span 3;
        .metric-grid {
          display: grid;
          gap: 1rem;
          .metric-item {
            padding: 1rem;
            background: rgba(255,255,255,0.9);
            border-radius: 8px;
            position: relative;
            .metric-value {
              font-size: 24px;
              color: var(--primary);
            }
            .trend-icon {
              position: absolute;
              right: 1rem;
              top: 50%;
              transform: translateY(-50%);
            }
          }
        }
      }

      &.chart-card {
        grid-column: span 9;
        .line-chart {
          height: 300px;
          background: rgba(69, 102, 209, 0.05);
          border-radius: 8px;
          margin-top: 1rem;
        }
      }

      &.knowledge-card {
        grid-column: span 8;
        .bar-chart {
          height: 400px;
          background: rgba(69, 183, 209, 0.05);
          border-radius: 8px;
          margin-top: 1rem;
        }
      }

      &.distribution-card {
        grid-column: span 4;
        .donut-chart {
          height: 200px;
          margin: 1rem 0;
        }
        .distribution-labels {
          .label-item {
            display: flex;
            align-items: center;
            margin: 0.5rem 0;
            .color-dot {
              width: 12px;
              height: 12px;
              border-radius: 50%;
              margin-right: 0.5rem;
            }
          }
        }
      }

      &.interaction-card {
        grid-column: span 12;
        .heatmap {
          height: 200px;
          background: rgba(255,107,107,0.05);
          border-radius: 8px;
          margin-top: 1rem;
        }
      }
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      h3 {
        color: var(--primary);
      }
      .legend {
        display: flex;
        gap: 1rem;
        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 0.5rem;
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

  .analysis-btn {
    background: linear-gradient(135deg, var(--primary), var(--secondary)) !important;
    border: none !important;
    border-radius: 8px !important;
    transition: transform 0.3s ease;
    &:hover {
      transform: translateY(-2px);
    }
  }
}
</style>
