<template>
  <div class="ai-evaluation-container">
    <!-- 导航区 -->
    <el-header class="glass-nav">
      <div class="nav-content">
        <h1 class="logo">
          <span style="color: var(--primary)">AI</span>
          <span style="color: var(--secondary)">教学评测</span>
          <div class="nav-line"></div>
        </h1>
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
    </el-header>

    <!-- 核心内容区 -->
    <main class="main-grid">
      <!-- 评测概览 -->
      <div class="glass-card overview-panel">
        <div class="panel-header">
          <h3>评测概览</h3>
          <el-tag :color="variables.primary + '20'">最新数据</el-tag>
        </div>
        <div class="metric-grid">
          <div class="metric-item">
            <div class="metric-value">86.5</div>
            <div class="metric-label">平均分</div>
            <div class="metric-line" :style="{backgroundColor: variables.primary}"></div>
          </div>
          <div class="metric-item">
            <div class="metric-value">92%</div>
            <div class="metric-label">达标率</div>
            <div class="metric-line" :style="{backgroundColor: variables.secondary}"></div>
          </div>
        </div>
      </div>

      <!-- 能力分析 -->
      <div class="glass-card analysis-panel">
        <div class="panel-header">
          <h3>能力维度分析</h3>
          <el-radio-group v-model="analysisType">
            <el-radio-button label="班级"></el-radio-button>
            <el-radio-button label="个人"></el-radio-button>
          </el-radio-group>
        </div>
        <radar-chart
            :primary-color="'#4566d1'"
            :secondary-color="'rgb(69, 183, 209)'"
            :indicators="indicators"
            :data="chartData"
        />
      </div>

      <!-- 题目解析 -->
      <div class="glass-card question-panel">
        <div class="panel-header">
          <h3>典型题目分析</h3>
          <el-button class="flat-btn" :icon="Refresh" circle />
        </div>
        <div class="question-list">
          <div
              v-for="(q, index) in questions"
              :key="index"
              class="question-item"
              :style="{borderColor: q.correct ? variables.primary : variables.accent}"
          >
            <div class="q-index">Q{{ index+1 }}</div>
            <el-progress
                :percentage="q.accuracy"
                :color="q.correct ? variables.primary : variables.accent"
                class="accuracy-bar"
            />
            <div class="q-meta">正确率 {{ q.accuracy }}%</div>
          </div>
        </div>
      </div>

      <!-- 改进建议 -->
      <div class="glass-card suggestion-panel">
        <div class="panel-header">
          <h3>AI改进建议</h3>
          <el-tag :color="variables.primary + '20'">3条新建议</el-tag>
        </div>
        <div class="suggestion-list">
          <div
              v-for="(s, index) in suggestions"
              :key="index"
              class="suggestion-item"
          >
            <el-icon :color="variables.primary"><Opportunity /></el-icon>
            <div class="suggestion-text">{{ s }}</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Refresh, Opportunity } from '@element-plus/icons-vue'
import RadarChart from '@/components/charts/radarChart.vue';

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


const abilityLabels = ref(['理解能力', '应用能力', '分析能力', '创新能力', '表达能力'])


const indicators =  ref([
  { name: '指标1', max: 100 },
  { name: '指标2', max: 100 },
  { name: '指标3', max: 100 },
  { name: '指标4', max: 100 },
  { name: '指标5', max: 100 }
])

const chartData = ref([{
  value: [85, 90, 75, 95, 80],
  name: '评分'
}])

const questions = ref([
  { accuracy: 82, correct: true },
  { accuracy: 65, correct: false },
  { accuracy: 91, correct: true }
])

const suggestions = ref([
  '加强二次函数应用的专题训练',
  '增加课堂互动问答环节',
  '优化几何证明题的讲解方式'
])

const labelPosition = (index) => {
  const positions = [
    { left: '50%', top: '5%' },
    { left: '85%', top: '30%' },
    { left: '75%', top: '80%' },
    { left: '25%', top: '80%' },
    { left: '15%', top: '30%' }
  ]
  return positions[index]
}
</script>

<style lang="scss" scoped>
.ai-evaluation-container {
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

      .modern-select {
        width: 200px !important;
        margin-left: auto; // 新增右对齐
        :deep(.el-input__inner) {
          padding: 0 10px !important;
        }
      }
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
        grid-column: span 3;
        .metric-grid {
          display: grid;
          gap: 1.5rem;
          .metric-item {
            text-align: center;
            .metric-value {
              font-size: 40px;
              color: var(--primary);
            }
            .metric-line {
              width: 40px;
              height: 3px;
              margin: 0.5rem auto;
            }
          }
        }
      }

      &.analysis-panel {
        grid-column: span 5;
        .radar-chart {
          width: 300px;
          height: 300px;
          margin: 1rem auto;
          border-radius: 50%;
          background: rgba(69, 102, 209, 0.05);
          position: relative;
          .radar-point {
            width: 8px;
            height: 8px;
            background: var(--primary);
            border-radius: 50%;
            position: absolute;
          }
          .radar-label {
            position: absolute;
            color: var(--primary);
            font-size: 12px;
          }
        }
      }

      &.question-panel {
        grid-column: span 4;
        .question-list {
          display: grid;
          gap: 1rem;
          .question-item {
            padding: 1rem;
            border: 2px solid;
            border-radius: 8px;
            .accuracy-bar {
              margin: 0.5rem 0;
            }
          }
        }
      }

      &.suggestion-panel {
        grid-column: span 12;
        .suggestion-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          .suggestion-item {
            padding: 1rem;
            background: rgba(255,255,255,0.9);
            border-radius: 8px;
            display: flex;
            align-items: center;
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
