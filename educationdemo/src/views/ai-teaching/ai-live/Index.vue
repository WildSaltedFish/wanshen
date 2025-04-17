<template>
  <div class="ai-live-container">
    <!-- 导航区 -->
    <el-header class="glass-header">
      <div class="header-content">
        <h1 class="logo">
          <span style="color: var(--primary)">AI</span>
          <span style="color: var(--secondary)">直播课堂</span>
          <div class="title-line"></div>
        </h1>
        <div class="live-status">
          <el-tag type="success">直播中</el-tag>
          <div class="viewer-count">
            <el-icon :color="variables.primary"><User /></el-icon>
            1.2K
          </div>
        </div>
      </div>
    </el-header>

    <!-- 核心直播区 -->
    <main class="main-grid">
      <!-- 视频主区域 -->
      <div class="glass-card video-main">
        <div class="video-container">
          <div class="video-overlay">
<!--            <iframe src="//player.bilibili.com/player.html?isOutside=true&aid=48624233&bvid=BV1Eb411u7Fw&cid=122452656&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>-->

            <div class="ai-subtitle">
              <span>正在讲解：立体几何体积公式推导</span>
              <div class="wave-effect"></div>
            </div>
            <div class="annotation-marker" style="left: 30%; top: 40%"></div>
          </div>
        </div>
        <div class="control-bar">
          <el-button class="flat-btn" :style="{ color: variables.primary }">
            <el-icon><VideoCamera /></el-icon>
          </el-button>
          <el-button class="flat-btn" :style="{ color: variables.secondary }">
            <el-icon><Microphone /></el-icon>
          </el-button>
          <div class="live-time">01:28:45</div>
        </div>
      </div>

      <!-- 互动侧边栏 -->
      <div class="glass-card interaction-panel">
        <div class="panel-header">
          <h3>实时互动</h3>
          <el-tag :color="variables.primary + '20'">新消息+23</el-tag>
        </div>
        <div class="chat-list">
          <div v-for="(msg, index) in messages" :key="index" class="chat-item">
            <div class="user-avatar" :style="{ backgroundColor: stringToColor(msg.user) }">
              {{ msg.user.charAt(0) }}
            </div>
            <div class="chat-bubble">{{ msg.text }}</div>
          </div>
        </div>
        <div class="input-area">
          <el-input placeholder="输入问题..." class="chat-input">
            <template #append>
              <el-button :color="variables.primary">
                <el-icon><Promotion /></el-icon>
              </el-button>
            </template>
          </el-input>
        </div>
      </div>

      <!-- 数据看板 -->
      <div class="glass-card data-panel">
        <div class="metric-grid">
          <div class="metric-item">
            <div class="metric-value">86%</div>
            <div class="metric-label">参与度</div>
            <el-progress
                :percentage="86"
                :color="variables.primary"
                class="metric-progress"
            />
          </div>
          <div class="metric-item">
            <div class="metric-value">92</div>
            <div class="metric-label">互动次数</div>
            <div class="spark-line"></div>
          </div>
        </div>
        <div class="qna-section">
          <h4>热门问题</h4>
          <div v-for="(q, index) in questions" :key="index" class="qna-item">
            <div class="votes">{{ q.votes }}</div>
            <div class="question">{{ q.text }}</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { User, VideoCamera, Microphone, Promotion } from '@element-plus/icons-vue'

const variables = {
  primary: '#4566d1',
  secondary: 'rgb(69, 183, 209)',
  accent: '#ff6b6b'
}

const messages = ref([
  { user: '张三', text: '公式推导步骤能再讲一遍吗？' },
  { user: '李老师', text: '请同学们打开课本第35页' }
])

const questions = ref([
  { votes: 23, text: '圆柱和圆锥的体积关系？' },
  { votes: 15, text: '如何计算旋转体体积？' }
])

const stringToColor = (str) => {
  const colors = [variables.primary, variables.secondary, variables.accent]
  const index = Math.abs(str.split('').reduce((a,b) => a + b.charCodeAt(), 0)) % colors.length
  return colors[index]
}
</script>

<style lang="scss" scoped>
.ai-live-container {
  --primary: #4566d1;
  --secondary: rgb(69, 183, 209);
  --accent: #ff6b6b;
  --glass-bg: rgba(255,255,255,0.9);
  min-height: 100%;
  background: linear-gradient(150deg, #f8fbfe 0%, #e6f4ff 100%);
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

      .viewer-count {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-left: 1.5rem;
      }
    }
  }

  .main-grid {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 1.5rem;

    .video-main {
      grid-row: span 2;
      .video-container {
        height: 600px;
        background: #fff;
        border-radius: 8px;
        position: relative;
        .video-overlay {
          position: absolute;
          width: 100%;
          height: 100%;
          .ai-subtitle {
            position: absolute;
            bottom: 1rem;
            left: 1rem;
            background: rgba(255,255,255,0.9);
            padding: 0.5rem 1rem;
            border-radius: 24px;
            display: flex;
            align-items: center;
            .wave-effect {
              width: 20px;
              height: 20px;
              background: var(--primary);
              margin-left: 0.5rem;
              border-radius: 50%;
              animation: pulse 1.5s infinite;
            }
          }
          .annotation-marker {
            width: 16px;
            height: 16px;
            background: var(--accent);
            border-radius: 50%;
            position: absolute;
            animation: ripple 1.5s infinite;
          }
        }
      }
      .control-bar {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 1rem;
        .live-time {
          color: var(--secondary);
          margin-left: 2rem;
        }
      }
    }

    .interaction-panel {
      .chat-list {
        height: 400px;
        overflow-y: auto;
        .chat-item {
          display: flex;
          align-items: start;
          margin: 1rem 0;
          .user-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            margin-right: 0.5rem;
          }
          .chat-bubble {
            background: rgba(69, 102, 209, 0.05);
            padding: 0.5rem 1rem;
            border-radius: 12px;
            max-width: 80%;
          }
        }
      }
    }

    .data-panel {
      .metric-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        .metric-progress {
          margin-top: 0.5rem;
        }
      }
      .qna-section {
        margin-top: 1rem;
        .qna-item {
          display: flex;
          align-items: center;
          margin: 0.5rem 0;
          .votes {
            width: 32px;
            color: var(--primary);
            font-weight: 500;
          }
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

  @keyframes pulse {
    0% { transform: scale(1); opacity: 0.6 }
    50% { transform: scale(1.2); opacity: 1 }
    100% { transform: scale(1); opacity: 0.6 }
  }

  @keyframes ripple {
    0% { transform: scale(1); opacity: 0.8 }
    100% { transform: scale(2); opacity: 0 }
  }
}
</style>
