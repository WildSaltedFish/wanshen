<template>
  <div class="ai-exam-container">
    <!-- 导航区 -->
    <el-header class="glass-nav">
      <div class="nav-content">
        <h1 class="logo">
          <span style="color: var(--primary)">AI</span>
          <span style="color: var(--secondary)">智能排考</span>
          <div class="nav-line"></div>
        </h1>
        <div class="nav-actions">
          <el-button class="flat-btn" :style="{ color: variables.primary }">
            <el-icon><Calendar /></el-icon>
            新建排考
          </el-button>
        </div>
      </div>
    </el-header>

    <!-- 核心内容区 -->
    <main class="main-grid">
      <!-- 排考概览 -->
      <div class="glass-card overview-panel">
        <div class="panel-header">
          <h3>考试安排概览</h3>
          <el-select
              v-model="selectedGrade"
              placeholder="选择年级"
              class="modern-select"
          >
            <el-option
                v-for="item in grades"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </div>
        <div class="schedule-grid" style="margin-top: 20px">
          <div
              v-for="day in schedule"
              :key="day.date"
              class="schedule-day"
              :style="{ borderColor: day.hasExam ? variables.primary : '#eee' }"
          >
            <div class="date-label">{{ day.date }}</div>
            <div class="exam-count">{{ day.exams }}场考试</div>
          </div>
        </div>
      </div>

      <!-- 时间轴 -->
      <div class="glass-card timeline-panel">
        <div class="panel-header" style="display: flex">
          <h3>考试时间轴</h3>
          <el-tag :color="variables.primary + '20'" style="margin-top: 3px;margin-left: 5px">当前周</el-tag>
        </div>
        <div class="timeline" style="margin-top: 10px">
          <div
              v-for="(exam, index) in exams"
              :key="index"
              class="timeline-item"
              :style="{ width: exam.duration + '%', backgroundColor: exam.color }"
          >
            <div class="exam-subject">{{ exam.subject }}</div>
            <div class="exam-time">{{ exam.time }}</div>
          </div>
        </div>
      </div>

      <!-- 考场分布 -->
      <div class="glass-card classroom-panel">
        <div class="panel-header">
          <h3>考场分布图</h3>
          <el-button class="flat-btn" :icon="Refresh" circle />
        </div>
        <div class="classroom-grid">
          <div
              v-for="n in 20"
              :key="n"
              class="classroom"
              :class="{ occupied: n % 3 === 0 }"
          >
            <el-icon v-if="n % 3 === 0"><User /></el-icon>
          </div>
        </div>
      </div>

      <!-- AI检测 -->
      <div class="glass-card detection-panel">
        <div class="panel-header">
          <h3>智能检测</h3>
          <el-progress
              :percentage="detectionProgress"
              :color="variables.primary"
              class="detection-progress"
          />
        </div>
        <div class="detection-list">
          <div
              v-for="(item, index) in detections"
              :key="index"
              class="detection-item"
          >
            <el-icon :color="item.type === 'warning' ? variables.accent : variables.primary">
              <component :is="item.icon" />
            </el-icon>
            <div class="detection-text">{{ item.text }}</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Calendar, Refresh, User, Warning } from '@element-plus/icons-vue'

const variables = {
  primary: '#4566d1',
  secondary: 'rgb(69, 183, 209)',
  accent: '#ff6b6b'
}

const selectedGrade = ref('grade1')
const grades = ref([
  { label: '高三年级', value: 'grade1' },
  { label: '高二年级', value: 'grade2' }
])

const schedule = ref([
  { date: '03/20', exams: 2, hasExam: true },
  { date: '03/21', exams: 3, hasExam: true },
  { date: '03/22', exams: 0, hasExam: false },
  // { date: '03/23', exams: 1, hasExam: true }
])

const exams = ref([
  {
    subject: '数学',
    time: '09:00-11:00',
    duration: 15,
    color: 'rgba(69, 102, 209, 0.2)'
  },
  {
    subject: '英语',
    time: '14:00-16:00',
    duration: 15,
    color: 'rgba(69, 183, 209, 0.2)'
  }
])

const detectionProgress = ref(85)
const detections = ref([
  { text: '检测到2处时间冲突', icon: Warning, type: 'warning' },
  { text: '考场分配已优化', icon: Refresh, type: 'success' }
])
</script>

<style lang="scss" scoped>
.ai-exam-container {
  --primary: #4566d1;
  --secondary: rgb(69, 183, 209);
  --accent: #ff6b6b;
  --glass-bg: rgba(255,255,255,0.9);
  min-height: 100%;
  background: linear-gradient(150deg, #f8fbfe 0%, #eaf5ff 100%);
  padding: 2rem;

  .glass-nav {
    background: var(--glass-bg) !important;
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(69, 102, 209, 0.1);
    margin: -2rem -2rem 2rem -2rem;
    padding: 0 2rem;

    .nav-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 64px;

      .logo {
        font: 500 24px 'Helvetica Neue';
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
    grid-template-columns: repeat(12, 1fr);
    gap: 1.5rem;

    .glass-card {
      background: var(--glass-bg);
      backdrop-filter: blur(8px);
      border-radius: 16px;
      padding: 1.5rem;
      border: 1px solid rgba(69, 102, 209, 0.1);

      &.overview-panel {
        grid-column: span 4;
        .schedule-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          .schedule-day {
            padding: 1rem;
            border: 2px solid;
            border-radius: 8px;
            text-align: center;
            .date-label {
              color: var(--primary);
              font-weight: 500;
            }
          }
        }
      }

      &.timeline-panel {
        grid-column: span 8;
        .timeline {
          height: 120px;
          background: rgba(69, 102, 209, 0.05);
          border-radius: 8px;
          position: relative;
          display: flex;
          align-items: center;
          padding: 0 1rem;
          .timeline-item {
            height: 60px;
            border-radius: 8px;
            padding: 0.5rem;
            margin-right: 1%;
            .exam-subject {
              color: var(--primary);
              font-weight: 500;
            }
          }
        }
      }

      &.classroom-panel {
        grid-column: span 5;
        .classroom-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.5rem;
          .classroom {
            aspect-ratio: 1;
            background: rgba(69, 102, 209, 0.05);
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            &.occupied {
              background: rgba(69, 183, 209, 0.2);
            }
          }
        }
      }

      &.detection-panel {
        grid-column: span 7;
        .detection-list {
          .detection-item {
            display: flex;
            align-items: center;
            padding: 1rem;
            margin: 0.5rem 0;
            background: rgba(255,255,255,0.9);
            border-radius: 8px;
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

  .flat-btn {
    background: none !important;
    border: none !important;
    transition: all 0.3s ease;
    &:hover {
      transform: translateY(-2px);
    }
  }
}
</style>
