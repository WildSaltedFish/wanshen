<template>
  <div class="ai-blackboard-container">
    <!-- 导航区 -->
    <el-header class="glass-nav">
      <div class="nav-content">
        <h1 class="logo">
          <span style="color: var(--primary)">AI</span>
          <span style="color: var(--secondary)">智慧黑板</span>
          <div class="nav-line"></div>
        </h1>
        <div class="nav-tools">
          <el-button class="flat-btn" style="color: var(--primary)">
            <el-icon><User /></el-icon>
            32人协作中
          </el-button>
          <el-button class="flat-btn" style="color: var(--secondary)">
            <el-icon><Clock /></el-icon>
            01:28:45
          </el-button>
        </div>
      </div>
    </el-header>

    <!-- 核心黑板区 -->
    <main class="main-grid">
      <!-- 主黑板 -->
      <div class="glass-board">
        <div class="board-header">
          <h3>高三数学 - 立体几何</h3>
          <div class="ai-status">
            <span class="dot"></span>
            <span>AI识别中</span>
          </div>
        </div>
        <div class="board-content">
          <!-- 手写公式识别 -->
          <div class="formula-box">
            <span class="handwriting">V = πr²h</span>
            <div class="ai-annotation" style="left: 30%; top: 20%"></div>
          </div>
          <!-- 3D模型占位 -->
          <div class="model-preview"></div>
        </div>
      </div>

      <!-- 工具栏 -->
      <div class="tools-panel">
        <div class="tool-grid">
          <el-button
              v-for="(tool, index) in tools"
              :key="index"
              class="tool-btn"
              :style="{ color: tool.color }"
          >
            <el-icon><component :is="tool.icon" /></el-icon>
          </el-button>
        </div>
        <div class="color-picker">
          <div
              v-for="(color, index) in colors"
              :key="index"
              class="color-item"
              :style="{ backgroundColor: color }"
          ></div>
        </div>
      </div>

      <!-- 协作面板 -->
      <div class="collab-panel">
        <div class="panel-header">
          <h4>实时协作</h4>
          <el-tag type="success">在线</el-tag>
        </div>
        <div class="user-avatars">
          <div
              v-for="(user, index) in users"
              :key="index"
              class="avatar"
              :style="{
              backgroundColor: stringToColor(user.name),
              left: index * 40 + 'px'
            }"
          >
            {{ user.name.charAt(0) }}
          </div>
        </div>
        <div class="chat-box">
          <div class="message-item" v-for="(msg, index) in messages" :key="index">
            <div class="message-bubble">{{ msg.content }}</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  MagicStick,
  Brush,
  Download,
  User,
  Clock, Collection
} from '@element-plus/icons-vue'

const variables = {
  primary: '#4566d1',
  secondary: 'rgb(69, 183, 209)',
  accent: '#ff6b6b'
}

const tools = ref([
  { icon: Brush, color: variables.primary },
  { icon: Clock, color: variables.secondary },
  { icon: MagicStick, color: variables.accent },
  { icon: Download, color: variables.primary }
])

const colors = ref([variables.primary, variables.secondary, '#000', '#fff'])

const users = ref([
  { name: '张老师' }, { name: '李同学' }, { name: '王助教' }
])

const messages = ref([
  { content: 'AI已识别手写公式' },
  { content: '李同学加入了协作' }
])

const stringToColor = (str) => {
  const colors = [variables.primary, variables.secondary, variables.accent]
  const index = Math.abs(str.split('').reduce((a,b) => a + b.charCodeAt(), 0)) % colors.length
  return colors[index]
}
</script>

<style lang="scss" scoped>
.ai-blackboard-container {
  --primary: #4566d1;
  --secondary: rgb(69, 183, 209);
  --accent: #ff6b6b;
  --glass-bg: rgba(255,255,255,0.9);
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
    grid-template-columns: 1fr 80px 300px;
    gap: 1.5rem;

    .glass-board {
      background: var(--glass-bg);
      backdrop-filter: blur(8px);
      border-radius: 16px;
      padding: 1.5rem;
      border: 1px solid rgba(69, 102, 209, 0.1);

      .board-content {
        height: 600px;
        background: #fff;
        border-radius: 8px;
        position: relative;
        .formula-box {
          position: absolute;
          left: 20%;
          top: 30%;
          .handwriting {
            font-family: cursive;
            font-size: 2.5rem;
            color: var(--primary);
          }
          .ai-annotation {
            width: 16px;
            height: 16px;
            background: var(--accent);
            border-radius: 50%;
            position: absolute;
            animation: pulse 1.5s infinite;
          }
        }
        .model-preview {
          position: absolute;
          right: 2rem;
          top: 2rem;
          width: 200px;
          height: 200px;
          background: rgba(69, 183, 209, 0.1);
          border-radius: 8px;
        }
      }
    }

    .tools-panel {
      background: var(--glass-bg);
      backdrop-filter: blur(8px);
      border-radius: 16px;
      padding: 1rem;
      .tool-btn {
        width: 48px;
        height: 48px;
        margin: 0.5rem 0;
        border: none !important;
        transition: transform 0.3s ease;
        &:hover {
          transform: translateY(-3px);
        }
      }
      .color-picker {
        margin-top: 1rem;
        .color-item {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          margin: 0.5rem 0;
          border: 2px solid rgba(0,0,0,0.1);
        }
      }
    }

    .collab-panel {
      background: var(--glass-bg);
      backdrop-filter: blur(8px);
      border-radius: 16px;
      padding: 1.5rem;
      .user-avatars {
        height: 48px;
        position: relative;
        margin: 1rem 0;
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          transition: all 0.3s ease;
        }
      }
      .chat-box {
        height: 200px;
        .message-bubble {
          background: rgba(69, 102, 209, 0.05);
          padding: 0.5rem 1rem;
          border-radius: 16px;
          margin: 0.5rem 0;
        }
      }
    }
  }

  @keyframes pulse {
    0% { transform: scale(1); opacity: 0.8 }
    100% { transform: scale(1.5); opacity: 0 }
  }
}
</style>
