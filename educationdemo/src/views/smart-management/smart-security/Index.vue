<template>
  <div class="ai-dashboard">
    <!-- 主内容区 -->
    <main class="container">
      <!-- 标题区 -->
      <header class="header">
        <h1>智能安防系统</h1>
        <div class="status">
          <span class="dot"></span>
          <span>实时监控中</span>
        </div>
      </header>

      <!-- 数据卡片 -->
      <div class="card-grid">
        <div
            v-for="(item, index) in metrics"
            :key="index"
            class="data-card"
        >
          <div class="card-icon" :style="{color: colors[index]}">
            <el-icon>
              <component
              :is="item.icon">
              </component>
            </el-icon>
          </div>
          <div class="card-content">
            <h2>{{ item.value }}</h2>
            <p>{{ item.label }}</p>
          </div>
        </div>
      </div>

      <!-- 核心区域 -->
      <div class="main-content">
        <!-- 监控画面 -->
        <div class="video-panel">
          <div class="video-header">
            <span>实时监控画面</span>
            <el-tag type="success">AI分析中</el-tag>
          </div>
          <div class="video-container">
            <div class="overlay-grid"></div>
            <div
                v-for="(alert, index) in alerts"
                :key="index"
                class="alert-point"
                :style="alert.style"
            >
              <div class="ripple"></div>
            </div>
          </div>
        </div>

        <!-- 事件列表 -->
        <div class="event-panel">
          <h3>最新事件</h3>
          <div class="event-list">
            <div
                v-for="(event, index) in events"
                :key="index"
                class="event-item"
            >
              <div class="event-icon" :style="{background: colors[index%4]}">
                <el-icon>
                  <component
                      :is="event.icon">
                  </component>
                </el-icon>
              </div>
              <div class="event-text">
                <div class="event-time">{{ event.time }}</div>
                <div class="event-desc">{{ event.desc }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const colors = ['#FF6B6B', '#45B7D1', '#96CEB4', '#FFD700']

const metrics = ref([
  { icon: 'camera', value: '24', label: '在线设备' },
  { icon: 'aim', value: '98.7%', label: '识别准确率' },
  { icon: 'lock', value: '12', label: '今日预警' },
  { icon: 'cpu', value: '健康', label: '系统状态' }
])

const alerts = ref([
  { style: { left: '30%', top: '40%' } },
  { style: { left: '65%', top: '70%' } }
])

const events = ref([
  { time: '14:32:45', desc: '检测到未授权访问', icon: 'warning' },
  { time: '14:30:12', desc: '3号门禁异常开启', icon: 'unlock' },
  { time: '14:28:01', desc: '消防通道占用预警', icon: 'bell' }
])
</script>

<style scoped>
.ai-dashboard {
  --primary: #4566d1;
  --secondary: rgb(69, 183, 209);
  --accent-1: #ff9f4d;
  --accent-2: #96ceb4;
  --bg-color: #f5f7fa;
  --glass-bg: rgba(255,255,255,0.8);
  --text-primary: #2c3e50;
}

.colors {
  --colors: var(--primary), var(--secondary), var(--accent-1), var(--accent-2);
}
.header h1 {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 基础布局 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* 标题区 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  color: var(--text-primary);
  font-weight: 300;
  letter-spacing: 1px;
}

.status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--secondary);
}

.dot {
  width: 10px;
  height: 10px;
  background: currentColor;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

/* 数据卡片 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.data-card {
  backdrop-filter: blur(8px);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  transition: transform 0.2s;
  border: 1px solid rgba(69, 102, 209, 0.1);
  background: linear-gradient(
      145deg,
      rgba(255,255,255,0.9),
      rgba(245, 247, 250, 0.8)
  );
}

.data-card:hover {
  transform: translateY(-3px);
}

.card-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
  background: rgba(69, 102, 209, 0.1);
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 视频区域 */
.video-panel {
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 2rem;
  border: 2px solid rgba(69, 102, 209, 0.1);
}

.video-container {
  position: relative;
  height: 400px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.overlay-grid {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image:
      linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
  background-size: 20px 20px;
}

.alert-point {
  position: absolute;
  transform: translate(-50%, -50%);
}

.ripple {
  width: 16px;
  height: 16px;
  background: var(--primary);
  box-shadow: 0 0 10px rgba(69, 102, 209, 0.3);
  border-radius: 50%;
  animation: ripple 1.5s infinite;
}

/* 事件列表 */
.event-panel {
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  padding: 1.5rem;
}

.event-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  margin: 0.5rem 0;
  background: rgba(255,255,255,0.8);
  border-radius: 8px;
}

.event-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 1rem;
  background: linear-gradient(
      135deg,
      var(--primary),
      var(--secondary)
  ) !important;
}

@keyframes pulse {
  0% { opacity: 0.6 }
  50% { opacity: 1 }
  100% { opacity: 0.6 }
}

@keyframes ripple {
  0% { transform: scale(1); opacity: 0.8 }
  100% { transform: scale(2); opacity: 0 }
}
.event-item:hover {
  box-shadow: 0 4px 12px rgba(69, 102, 209, 0.1);
}
@keyframes gradient-pulse {
  0% { opacity: 0.9 }
  50% { opacity: 1 }
  100% { opacity: 0.9 }
}

.data-card:hover {
  animation: gradient-pulse 2s infinite;
}
</style>
