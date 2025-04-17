<template>
  <div class="ai-homework-container">
    <!-- 导航区 -->
    <el-header class="glass-header">
      <div class="header-content">
        <h1 class="logo">
          <span style="color: var(--primary)">AI</span>
          <span style="color: var(--secondary)">智能作业</span>
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

    <!-- 核心功能区 -->
    <main class="main-grid">


      <!-- 作业列表 -->
      <div class="glass-card homework-list">
        <div class="list-header">
          <h3>最新作业</h3>
          <el-button class="new-btn" :icon="Plus" type="primary">
            布置新作业
          </el-button>
        </div>
        <div class="homework-items">
          <div
              v-for="(hw, index) in homeworks"
              :key="index"
              class="homework-item"
          >
            <div class="subject-tag" :style="{ backgroundColor: hw.color }">
              {{ hw.subject }}
            </div>
            <div class="hw-content">
              <div class="hw-title">{{ hw.title }}</div>
              <div class="hw-meta">
                <el-icon><Clock /></el-icon>
                <span>{{ hw.deadline }}</span>
                <el-divider direction="vertical" />
                <el-icon><User /></el-icon>
                <span>{{ hw.submitted }}/{{ hw.total }}</span>
              </div>
            </div>
            <el-progress
                :percentage="(hw.submitted/hw.total)*100"
                :color="hw.color"
                class="hw-progress"
            />
          </div>
        </div>
      </div>

      <!-- AI批改面板 -->
      <div class="glass-card grading-panel" style="width: 100%">
        <div class="panel-header">
          <h3>AI智能批改</h3>
          <div class="status-group">
            <el-tag :color="gradingStatus.color" class="pulsing-status">
              <el-icon class="status-icon"><Loading /></el-icon>
              {{ gradingStatus.text }}
            </el-tag>
            <el-tooltip content="算法版本迭代记录">
              <el-button class="version-tag" text>
                v2.3.1 <el-icon><CaretRight /></el-icon>
              </el-button>
            </el-tooltip>
          </div>
        </div>

        <!-- 核心可视化区域 -->
        <div class="grading-visual">
          <!-- 左侧环形进度+知识点分析 -->
          <div class="analytics-left">
            <div class="accuracy-ring">
              <div class="ring-value" style="color: white;margin-top: 25px">78%</div>
            </div>
          </div>

          <div class="knowledge-analysis" style="margin-left: 70px">
            <h4>知识点掌握分析</h4>
            <div class="knowledge-progress">
              <div v-for="(point, idx) in knowledgePoints" :key="idx" class="point-item">
                <div class="point-label">{{ point.name }}</div>
                <el-progress
                    :percentage="point.accuracy"
                    :color="point.color"
                    :stroke-width="12"
                    :show-text="false"/>
                <div class="point-value">{{ point.accuracy }}%</div>
              </div>
            </div>
          </div>

          <!-- 右侧数据仪表 -->
          <div class="analytics-right" style="margin-left: 70px">
            <!-- 实时批改流 -->
            <div class="realtime-grading">
              <h4>实时批改进度 <el-icon><Refresh /></el-icon></h4>
              <div class="grading-stream">
                <div v-for="(log, idx) in gradingLogs" :key="idx" class="log-item">
                  <div class="log-time">{{ log.time }}</div>
                  <div class="log-content">
                    <span class="student-name">{{ log.student }}</span>
                    <el-tag
                        :type="log.status === 'completed' ? 'success' : 'warning'"
                        size="small">
                      {{ log.status === 'completed' ? '批改完成' : '分析中' }}
                    </el-tag>
                  </div>
                  <el-icon class="detail-btn"><View /></el-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 数据概览 -->
      <div class="glass-card metrics-panel">
        <div class="metric-grid">
          <div
              v-for="(metric, index) in metrics"
              :key="index"
              class="metric-item"
              :style="{ borderLeft: `4px solid ${metric.color}` }"
          >
            <el-icon :color="metric.color" class="metric-icon">
              <component :is="metric.icon" />
            </el-icon>
            <div class="metric-value">{{ metric.value }}</div>
            <div class="metric-label">{{ metric.label }}</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { DocumentChecked, List, Plus, Clock, User } from '@element-plus/icons-vue'

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
    label: '待批改作业',
    value: 12,
    color: variables.primary,
    icon: DocumentChecked
  },
  {
    label: '进行中作业',
    value: 5,
    color: variables.secondary,
    icon: List
  }
])

const homeworks = ref([
  {
    subject: '数学',
    title: '立体几何专题练习',
    deadline: '03/20前提交',
    submitted: 32,
    total: 40,
    color: variables.primary
  },
  {
    subject: '物理',
    title: '电磁学综合测试',
    deadline: '03/22前提交',
    submitted: 28,
    total: 40,
    color: variables.secondary
  }
])

const gradingStatus = ref({
  text: '批改进行中',
  color: variables.secondary + '20'
})

const stats = ref([
  { label: '已批改作业', value: '235份' },
  { label: '平均用时', value: '3.2秒/份' },
  { label: '错误检测', value: '98.7%' }
])

const knowledgePoints = ref([
  { name: '立体几何', accuracy: 82, color: '#4566d1' },
  { name: '电磁感应', accuracy: 75, color: '#2ecc71' },
  { name: '函数导数', accuracy: 68, color: '#e74c3c' }
])

const gradingLogs = ref([
  { time: '09:23', student: '张晓明', status: 'completed' },
  { time: '09:24', student: '李华', status: 'processing' },
  { time: '09:25', student: '王芳', status: 'completed' }
])

const commonErrors = ref([
  { name: '公式推导错误', count: 23, color: '#ff6b6b' },
  { name: '单位换算错误', count: 15, color: '#f1c40f' },
  { name: '审题偏差', count: 9, color: '#3498db' }
])
</script>

<style lang="scss" scoped>
.ai-homework-container {
  --primary: #4566d1;
  --secondary: rgb(69, 183, 209);
  --accent: #ff6b6b;
  --glass-bg: rgba(255,255,255,0.9);
  min-height: 100%;
  background: linear-gradient(150deg, #f8fbfe 0%, #ecf7ff 100%);
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

  .main-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
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
            .metric-icon {
              font-size: 1.5rem;
              margin-bottom: 0.5rem;
            }
            .metric-value {
              font-size: 24px;
              color: var(--primary);
            }
          }
        }
      }

      &.homework-list {
        grid-column: span 6;
        .list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .homework-items {
          .homework-item {
            display: flex;
            align-items: center;
            padding: 1rem;
            margin: 1rem 0;
            background: rgba(255,255,255,0.9);
            border-radius: 8px;
            .subject-tag {
              color: white;
              padding: 4px 12px;
              border-radius: 16px;
              margin-right: 1rem;
            }
            .hw-progress {
              flex: 0 0 120px;
              margin-left: auto;
            }
          }
        }
      }

      &.grading-panel {
        grid-column: span 3;
        .grading-visual {
          display: flex;
          align-items: center;
          .accuracy-ring {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: conic-gradient(
                    var(--primary) 280deg,
                    rgba(69, 102, 209, 0.1) 0deg
            );
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .ring-value {
              font-size: 24px;
              color: var(--primary);
            }
          }
          .detail-stats {
            margin-left: 1.5rem;
            .stat-item {
              margin: 1rem 0;
              .stat-value {
                font-size: 20px;
                color: var(--primary);
              }
            }
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

  .new-btn {
    background: linear-gradient(135deg, var(--primary), var(--secondary)) !important;
    border: none !important;
    border-radius: 8px !important;
    transition: transform 0.3s ease;
    &:hover {
      transform: translateY(-2px);
    }
  }
}

.grading-panel {
  .status-group {
    display: flex;
    align-items: center;
    gap: 8px;

    .pulsing-status {
      animation: pulse 1.5s infinite;
      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.6; }
        100% { opacity: 1; }
      }
    }
  }

  .grading-visual {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 1.5rem;

    .knowledge-analysis {
      margin-top: 1.5rem;
      h4 {
        color: var(--primary);
        margin-bottom: 1rem;
      }
      .point-item {
        margin: 0.8rem 0;
        .point-label {
          font-size: 0.9em;
          color: #666;
        }
        .point-value {
          text-align: right;
          font-weight: bold;
          color: var(--primary);
        }
      }
    }

    .realtime-grading {
      .grading-stream {
        max-height: 200px;
        overflow-y: auto;
        .log-item {
          display: flex;
          align-items: center;
          padding: 8px;
          background: rgba(255,255,255,0.9);
          margin: 4px 0;
          border-radius: 6px;
          .log-time {
            color: #999;
            min-width: 45px;
          }
          .log-content {
            flex: 1;
            margin: 0 1rem;
            .student-name {
              margin-right: 8px;
            }
          }
        }
      }
    }

    .error-distribution {
      margin-top: 1.5rem;
      .chart-placeholder {
        height: 180px;
        background: rgba(69,102,209,0.05);
        border-radius: 8px;
      }
      .error-legends {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
        .legend-item {
          display: flex;
          align-items: center;
          padding: 6px;
          .color-block {
            width: 12px;
            height: 12px;
            border-radius: 2px;
            margin-right: 8px;
          }
          .error-count {
            margin-left: auto;
            color: var(--primary);
          }
        }
      }
    }
  }
}
</style>
