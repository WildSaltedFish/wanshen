<template>
  <div class="ai-resource-generator">
    <!-- 导航区 -->
    <el-header class="glass-nav">
      <div class="nav-content">
        <h1 class="logo">
          <span style="color: var(--primary)">AI</span>
          <span style="color: var(--secondary)">智教</span>
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
      <!-- 生成控制台 -->
      <div class="glass-panel generate-console">
        <div class="deco-line"></div>
        <h2>智能资源生成</h2>

        <div class="control-group">
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

          <el-slider
              v-model="difficulty"
              :marks="difficultyMarks"
              class="difficulty-slider"
          />

          <el-button
              type="primary"
              class="generate-btn"
              @click="startGeneration"
          >
            <el-icon><MagicStick /></el-icon>
            立即生成
          </el-button>
        </div>
      </div>

      <!-- 预览面板 -->
      <div class="glass-panel preview-panel">
        <div class="panel-header">
          <h3>资源预览</h3>
          <el-tag :color="previewStatus.color">
            {{ previewStatus.text }}
          </el-tag>
        </div>
        <div class="preview-content">
          <div class="resource-mock">
            <div class="mock-header" style=" background-color: #4566d1 "></div>
            <div class="mock-body">
              <div
                  v-for="n in 5"
                  :key="n"
                  class="mock-line"
                  :style="{ width: lineWidths[n] }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 生成记录 -->
      <div class="glass-panel history-panel">
        <div class="panel-header">
          <h3>生成记录</h3>
          <el-button text class="refresh-btn">
            <el-icon><Refresh /></el-icon>
          </el-button>
        </div>
        <div class="history-list">
          <div
              v-for="(item, index) in history"
              :key="index"
              class="history-item"
          >
            <div class="resource-type" :style="{ color: item.color }">
              <el-icon><component :is="item.icon" /></el-icon>
            </div>
            <div class="resource-info">
              <div class="title">{{ item.title }}</div>
              <div class="meta">
                <span>{{ item.subject }}</span>
                <el-divider direction="vertical" />
                <span>{{ item.time }}</span>
              </div>
            </div>
            <el-progress
                :percentage="item.progress"
                :color="item.color"
                class="gen-progress"
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { MagicStick, Notebook, Picture, Refresh } from '@element-plus/icons-vue'

const variables = {
  primary: '#4566d1',
  secondary: 'rgb(69, 183, 209)',
  accent: '#ff6b6b',
  white: '#FFFFFF'
}

const actions = ref([
  { label: '课件生成', icon: Notebook, color: variables.primary },
  { label: '图片生成', icon: Picture, color: variables.secondary }
])

const subjects = ref([
  { label: '高中数学', value: 'math' },
  { label: '大学物理', value: 'physics' }
])

const difficulty = ref(50)
const difficultyMarks = reactive({
  0: '基础',
  50: '中等',
  100: '进阶'
})

const previewStatus = reactive({
  text: '等待生成',
  color: variables.white
})

const lineWidths = ['90%', '70%', '85%', '60%', '75%']

const history = ref([
  {
    title: '立体几何课件',
    subject: '数学',
    time: '10:24',
    progress: 100,
    color: variables.primary,
    icon: Notebook
  },
  {
    title: '电路图集',
    subject: '物理',
    time: '09:45',
    progress: 80,
    color: variables.secondary,
    icon: Picture
  }
])

const startGeneration = () => {
  previewStatus.text = '生成中...'
  previewStatus.color = variables.accent
}
</script>

<style lang="scss" scoped>
.ai-resource-generator {
  --primary: #4566d1;
  --secondary: rgb(69, 183, 209);
  --accent: #ff6b6b;
  --glass-bg: rgba(255,255,255,0.85);
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
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    grid-template-rows: auto 1fr;

    .glass-panel {
      background: var(--glass-bg);
      backdrop-filter: blur(8px);
      border-radius: 16px;
      padding: 2rem;
      border: 1px solid rgba(69, 102, 209, 0.1);

      &.generate-console {
        grid-column: 1 / 3;
        .deco-line {
          width: 60px;
          height: 3px;
          background: var(--primary);
          margin: 1rem 0 2rem;
        }
        .control-group {
          display: grid;
          gap: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }
      }

      &.preview-panel {
        .resource-mock {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          .mock-header {
            height: 120px;
            background: var(--primary);
          }
          .mock-body {
            padding: 1.5rem;
            .mock-line {
              height: 8px;
              background: rgba(0,0,0,0.05);
              margin: 1rem 0;
              border-radius: 4px;
              transition: width 0.5s ease;
            }
          }
        }
      }

      &.history-panel {
        .history-item {
          display: flex;
          align-items: center;
          padding: 1rem;
          margin: 1rem 0;
          background: rgba(255,255,255,0.9);
          border-radius: 8px;
          .resource-type {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 1rem;
          }
          .gen-progress {
            flex: 0 0 120px;
            margin-left: auto;
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
      height: 48px;
    }
  }

  .difficulty-slider {
    :deep(.el-slider__marks-text) {
      color: var(--primary);
    }
    :deep(.el-slider__button) {
      border-color: var(--primary);
    }
  }

  .generate-btn {
    background: linear-gradient(135deg, var(--primary), var(--secondary)) !important;
    border: none !important;
    border-radius: 8px !important;
    height: 48px;
    font-size: 16px;
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-2px);
    }
  }

  .flat-btn {
    background: transparent !important;
    border: none !important;
    transition: all 0.3s ease;

    &:hover {
      color: var(--primary) !important;
      transform: translateY(-2px);
    }
  }
}
</style>
