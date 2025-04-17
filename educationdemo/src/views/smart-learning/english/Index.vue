<template>
  <div class="ai-english-container">
    <!-- 导航区 -->
    <el-header class="glass-nav">
      <div class="nav-content">
        <h1 class="logo">
          <span style="color: var(--primary)">AI</span>
          <span style="color: var(--secondary)">英语听说</span>
          <div class="title-line"></div>
        </h1>
        <div class="nav-actions">
          <el-button class="flat-btn" :style="{ color: variables.primary }">
            <el-icon><Notebook /></el-icon>
            我的练习
          </el-button>
        </div>
      </div>
    </el-header>

    <!-- 核心功能区 -->
    <main class="main-grid">
      <!-- 听说主面板 -->
      <div class="glass-card main-panel">
        <div class="practice-header">
          <h3>日常会话练习</h3>
          <el-tag :color="variables.primary + '20'">中级难度</el-tag>
        </div>

        <!-- 语音波形图 -->
        <div class="wave-container">
          <div
              v-for="(bar, index) in waveBars"
              :key="index"
              class="wave-bar"
              :style="{ height: bar.height + 'px', backgroundColor: variables.primary }"
          ></div>
        </div>

        <!-- 录音控制 -->
        <div class="control-section">
          <el-button
              class="record-btn"
              :style="{
              backgroundColor: isRecording ? variables.accent : variables.primary,
              transform: `scale(${isRecording ? 1.1 : 1})`
            }"
              circle
              @click="toggleRecording"
          >
            <el-icon :size="24" style="color:white"><Microphone /></el-icon>
          </el-button>
          <div class="time-indicator">{{ recordingTime }}</div>
        </div>

        <!-- AI评分 -->
        <div class="score-panel">
          <div class="score-ring" :style="{ borderColor: variables.primary }">
            <span class="score-text">{{ aiScore }}</span>
          </div>
          <div class="feedback-list">
            <div
                v-for="(feedback, index) in aiFeedback"
                :key="index"
                class="feedback-item"
            >
              <el-icon :color="variables.primary"><CircleCheck /></el-icon>
              {{ feedback }}
            </div>
          </div>
        </div>
      </div>

      <!-- 侧边栏 -->
      <div class="glass-card sidebar">
        <div class="sidebar-section">
          <h4>实时反馈</h4>
          <div class="feedback-bubbles">
            <div
                v-for="(word, index) in pronunciationTips"
                :key="index"
                class="bubble"
                :style="{ borderColor: word.correct ? variables.primary : variables.accent }"
            >
              {{ word.text }}
            </div>
          </div>
        </div>

        <div class="sidebar-section">
          <h4>历史表现</h4>
          <el-progress
              :percentage="progressData.accuracy"
              :color="variables.primary"
              class="progress-bar"
          />
          <div class="progress-labels">
            <span>发音准确率</span>
            <span>{{ progressData.accuracy }}%</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Microphone, Notebook, CircleCheck } from '@element-plus/icons-vue'

const variables = {
  primary: '#4566d1',
  secondary: 'rgb(69, 183, 209)',
  accent: '#ff6b6b'
}

const isRecording = ref(false)
const recordingTime = ref('00:00')
const aiScore = ref(88)
const waveBars = ref(Array.from({length: 50}, () => ({ height: Math.random() * 30 + 10 })))

const aiFeedback = reactive([
  '发音清晰度优秀',
  '语调自然度待提升',
  '语速控制良好'
])

const pronunciationTips = reactive([
  { text: 'th', correct: false },
  { text: 'er', correct: true },
  { text: 'ing', correct: true }
])

const progressData = reactive({
  accuracy: 82
})

const toggleRecording = () => {
  isRecording.value = !isRecording.value
}
</script>

<style lang="scss" scoped>
.ai-english-container {
  --primary: #4566d1;
  --secondary: rgb(69, 183, 209);
  --accent: #ff6b6b;
  --glass-bg: rgba(255,255,255,0.9);
  min-height: 100%;
  background: linear-gradient(150deg, #f8fbfe 0%, #e6f4ff 100%);
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
    gap: 1.5rem;

    .glass-card {
      background: var(--glass-bg);
      backdrop-filter: blur(8px);
      border-radius: 16px;
      padding: 1.5rem;
      border: 1px solid rgba(69, 102, 209, 0.1);

      &.main-panel {
        .practice-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .wave-container {
          height: 120px;
          background: rgba(69, 102, 209, 0.05);
          border-radius: 8px;
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          padding: 1rem;
          .wave-bar {
            width: 4px;
            border-radius: 2px;
            transition: height 0.3s ease;
          }
        }

        .control-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 2rem 0;
          .record-btn {
            width: 64px;
            height: 64px;
            transition: all 0.3s ease;
            border: none;
            box-shadow: 0 4px 12px rgba(69, 102, 209, 0.2);
          }
          .time-indicator {
            color: var(--primary);
            margin-top: 1rem;
            font: 500 18px monospace;
          }
        }

        .score-panel {
          display: flex;
          align-items: center;
          justify-content: space-around;
          .score-ring {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            border: 4px solid;
            display: flex;
            align-items: center;
            justify-content: center;
            .score-text {
              font: 500 24px 'Helvetica Neue';
              color: var(--primary);
            }
          }
        }
      }

      &.sidebar {
        .feedback-bubbles {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          .bubble {
            padding: 4px 12px;
            border-radius: 16px;
            border: 2px solid;
            background: rgba(255,255,255,0.9);
          }
        }

        .progress-bar {
          margin: 1rem 0;
        }
      }
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
