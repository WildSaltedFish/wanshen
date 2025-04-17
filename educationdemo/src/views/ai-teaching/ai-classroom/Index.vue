<template>
  <div class="ai-classroom-container">
    <!-- 导航区 -->
    <el-header class="glass-nav">
      <div class="nav-content">
        <h1 class="logo">
          <span style="color: var(--primary)">AI</span>
          <span style="color: var(--secondary)">智慧课堂</span>
          <div class="nav-line"></div>
        </h1>
        <div class="nav-status">
          <el-tag type="success">在线</el-tag>
          <span class="live-status">实时教学中</span>
        </div>
      </div>
    </el-header>

    <!-- 核心功能展示 -->
    <main class="main-grid">
      <!-- 课堂概览 -->
      <div class="glass-card overview-panel">
        <div class="deco-line"></div>
        <div class="overview-content">
          <div class="metric-item">
            <el-icon :color="variables.primary" class="metric-icon"><User /></el-icon>
            <div class="metric-value">32</div>
            <div class="metric-label">在线学生</div>
          </div>
          <el-divider direction="vertical" />
          <div class="metric-item">
            <el-icon :color="variables.secondary" class="metric-icon"><Clock /></el-icon>
            <div class="metric-value">58:24</div>
            <div class="metric-label">课堂时长</div>
          </div>
        </div>
        <div class="overview-content" style="margin-top: 150px">
          <div class="metric-item">
            <el-icon :color="variables.primary" class="metric-icon"><DataLine /></el-icon>
            <div class="metric-value">32</div>
            <div class="metric-label">课程进度</div>
          </div>
          <el-divider direction="vertical" />
          <div class="metric-item">
            <el-icon :color="variables.secondary" class="metric-icon"><Loading /></el-icon>
            <div class="metric-value">58:24</div>
            <div class="metric-label">课程效率</div>
          </div>
        </div>

      </div>

      <!-- 智能白板 -->
      <div class="glass-card whiteboard-panel">
        <div class="panel-header">
          <h3>AI智能白板</h3>
          <el-button class="flat-btn" :style="{ color: variables.primary }">
            <el-icon><MagicStick /></el-icon>
            智能批注
          </el-button>
        </div>
        <div class="whiteboard-mock">
          <div class="math-formula">
            <span class="math-symbol">∫</span>
            <div class="formula-text">f(x)dx = F(x) + C</div>
          </div>
          <div class="annotation-point" style="left: 30%; top: 40%"></div>
          <div class="annotation-point" style="left: 60%; top: 70%"></div>
        </div>
      </div>

      <!-- 学生动态 -->
      <div class="glass-card student-panel">
        <div class="panel-header">
          <h3>学生动态</h3>
          <el-select
              placeholder="选择状态"
              class="status-select"
              popper-class="modern-select-dropdown"
          >
            <el-option label="全部" value="all" />
            <el-option label="专注" value="focus" />
            <el-option label="分心" value="distracted" />
          </el-select>
        </div>
        <div class="student-grid">
          <div
              v-for="student in students"
              :key="student.id"
              class="student-card"
              :style="{ borderColor: student.statusColor }"
          >
            <div class="avatar" :style="{ backgroundColor: stringToColor(student.name) }">
              {{ student.name.charAt(0) }}
            </div>
            <div class="student-info">
              <div class="name">{{ student.name }}</div>
              <el-progress
                  :percentage="student.engagement"
                  :color="student.statusColor"
                  class="engagement-bar"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 互动面板 -->
      <div class="glass-card interaction-panel">
        <div class="panel-header">
          <h3>实时互动</h3>
          <el-tag :color="variables.primary + '20'" effect="dark">
           <span style="color: rgba(10,10,10,0.64)"> 新消息: {{ newMessages }}</span>
          </el-tag>
        </div>
        <div class="message-list">
          <div
              v-for="(msg, index) in messages"
              :key="index"
              class="message-item"
          >
            <div class="message-bubble" :style="{ background: msg.type === 'ai' ? variables.secondary + '20' : '#fff' }">
              <div class="sender">{{ msg.sender }}</div>
              <div class="content">{{ msg.content }}</div>
            </div>
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
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { User, Clock, MagicStick, Promotion,DataLine,Loading } from '@element-plus/icons-vue'

const variables = {
  primary: '#4566d1',
  secondary: 'rgb(69, 183, 209)',
  accent: '#ff6b6b'
}

const students = ref([
  { id: 1, name: '张三', engagement: 88, statusColor: '#4566d1' },
  { id: 2, name: '李四', engagement: 65, statusColor: '#ff6b6b' },
  { id: 3, name: '王五', engagement: 92, statusColor: '#4566d1' }
])

const messages = ref([
  { sender: 'AI助教', content: '检测到3位同学需要重点关注', type: 'ai' },
  { sender: '李老师', content: '请打开教材第35页', type: 'teacher' }
])

const newMessages = ref(3)

const stringToColor = (str) => {
  const colors = [variables.primary, variables.secondary, variables.accent]
  const index = Math.abs(str.split('').reduce((a,b) => a + b.charCodeAt(), 0)) % colors.length
  return colors[index]
}
</script>

<style lang="scss" scoped>
.ai-classroom-container {
  --primary: #4566d1;
  --secondary: rgb(69, 183, 209);
  --accent: #ff6b6b;
  --glass-bg: rgba(255,255,255,0.9);
  min-height: 100vh;
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
      align-items: center;
      justify-content: space-between;
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

      .live-status {
        color: var(--secondary);
        margin-left: 1rem;
      }
    }
  }

  .main-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    grid-template-areas:
      "overview overview whiteboard whiteboard"
      "students students interaction interaction";

    .glass-card {
      background: var(--glass-bg);
      backdrop-filter: blur(8px);
      border-radius: 16px;
      padding: 2rem;
      border: 1px solid rgba(69, 102, 209, 0.1);

      &.overview-panel {
        grid-area: overview;
        .overview-content {
          display: flex;
          justify-content: space-around;
          align-items: center;
          .metric-item {
            text-align: center;
            .metric-icon {
              font-size: 2.5rem;
              margin-bottom: 1rem;
            }
            .metric-value {
              font-size: 2rem;
              color: var(--primary);
            }
          }
        }
      }

      &.whiteboard-panel {
        grid-area: whiteboard;
        .whiteboard-mock {
          height: 400px;
          background: #fff;
          border-radius: 8px;
          position: relative;
          .math-formula {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            .math-symbol {
              font-size: 4rem;
              color: var(--primary);
            }
          }
          .annotation-point {
            width: 16px;
            height: 16px;
            background: var(--accent);
            border-radius: 50%;
            position: absolute;
            animation: pulse 1.5s infinite;
          }
        }
      }

      &.student-panel {
        grid-area: students;
        .student-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          margin-top: 20px;
          gap: 1.5rem;
          .student-card {
            padding: 1rem;
            border-left: 4px solid;
            background: rgba(255,255,255,0.9);
            border-radius: 8px;
            .avatar {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 1rem;
            }
          }
        }
      }

      &.interaction-panel {
        grid-area: interaction;
        .message-list {
          height: 300px;
          overflow-y: auto;
          .message-bubble {
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
            .sender {
              color: var(--primary);
              font-weight: 500;
            }
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
      color: var(--primary) !important;
      transform: translateY(-2px);
    }
  }

  .engagement-bar {
    :deep(.el-progress-bar) {
      padding-right: 0;
    }
  }

  @keyframes pulse {
    0% { transform: scale(1); opacity: 0.8 }
    100% { transform: scale(1.5); opacity: 0 }
  }
}
</style>
