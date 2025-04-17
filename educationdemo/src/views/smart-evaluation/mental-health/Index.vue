<template>
  <div class="mental-health-container">
    <!-- 头部状态栏 -->
    <header class="status-header">
      <div class="header-content">
        <div class="mood-summary">
          <div class="mood-score">
            <div class="score-value">72</div>
            <div class="score-label">当前心情指数</div>
          </div>
        </div>

        <div class="stats-container" >
          <div class="stat-item">
            <div class="stat-value" :style="{color: primary}">68</div>
            <div class="stat-label">本周情绪指数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value" :style="{color: secondary}">7.5h</div>
            <div class="stat-label">平均睡眠</div>
          </div>
          <div class="stat-item">
            <div class="stat-value" :style="{color: primary}">83%</div>
            <div class="stat-label">计划完成率</div>
          </div>
        </div>
      </div>
    </header>

    <!-- 主体内容 -->
    <main>
      <el-row :gutter="20">
        <!-- 左侧功能区 -->
        <el-col :span="8">
          <el-card class="glassmorphism function-card">
            <div class="ai-chat-section">
              <div class="chat-bubble left">最近有什么困扰吗？</div>
              <div class="chat-bubble right">睡眠质量不太好</div>
              <el-input
                  placeholder="和AI心理助手聊聊..."
                  class="chat-input"
              >
                <template #append>
                  <el-button :icon="Promotion" :color="primary"/>
                </template>
              </el-input>
            </div>

            <div class="quick-tools">
              <el-tag
                  v-for="tool in quickTools"
                  :key="tool"
                  effect="plain"
                  :color="white"
                  class="tool-tag"
                  style="margin-top: 10px;margin-left: 3px"
              >{{ tool }}</el-tag>
            </div>
          </el-card>
        </el-col>

        <!-- 右侧数据区 -->
        <el-col :span="16">
          <el-tabs type="border-card" class="data-tabs" style="height: 470px">
            <el-tab-pane label="情绪波动分析">
              <div class="emotion-chart glassmorphism">
                <div
                    v-for="(item, index) in emotionData"
                    :key="index"
                    class="chart-bar"
                    :style="{
                    height: item.value + '%',
                    backgroundColor: index%2 ? primary : secondary
                  }"
                ></div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="健康建议">
              <el-scrollbar height="400px">
                <div
                    v-for="(advice, index) in healthAdvice"
                    :key="index"
                    class="advice-card"
                    :style="{borderLeftColor: primary}"
                >
                  <el-icon class="advice-icon"><StarFilled /></el-icon>
                  <div class="advice-content">
                    <h3>{{ advice.title }}</h3>
                    <p>{{ advice.desc }}</p>
                  </div>
                </div>
              </el-scrollbar>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>

      <!-- 数据概览 -->
      <el-row :gutter="20" class="overview-row">
        <el-col
            v-for="(item, index) in overviewData"
            :key="index"
            :span="6"
        >
          <div class="data-card glassmorphism" style="margin-top: 20px">
            <div class="data-icon" :style="{backgroundColor: primary}">
              <component :is="item.icon" style="color: white"/>
            </div>
            <div class="data-content">
              <div class="data-value">{{ item.value }}</div>
              <div class="data-title">{{ item.title }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  Promotion,
  StarFilled,
  Sunny,
  MoonNight,
  Clock,
  Histogram
} from '@element-plus/icons-vue'

import bar from '../../../components/charts/barChart.vue';

const primary = '#4566d1'
const secondary = 'rgb(69, 183, 209)'

const quickTools = ref(['压力测试', '睡眠分析', '情绪日记', '放松训练'])
const emotionData = ref([...Array(14)].map(() => ({ value: Math.floor(Math.random()*30)+20 })))
const healthAdvice = ref([
  { title: '正念呼吸练习', desc: '每天进行5分钟深呼吸训练' },
  { title: '睡眠改善计划', desc: '建议保持规律作息时间' }
])
const overviewData = ref([
  { icon: Sunny, value: '6.2h', title: '日均日照' },
  { icon: MoonNight, value: '7.5h', title: '平均睡眠' },
  { icon: Clock, value: '83%', title: '计划完成率' },
  { icon: Histogram, value: 'B+', title: '心理指数' }
])


</script>

<style scoped>
.mental-health-container {
  background: linear-gradient(135deg, #f0f5ff 0%, #e3ecff 100%);
  min-height: 100%;
  padding: 20px;
}

.glassmorphism {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.status-header {

  align-items: center;
  padding: 20px;
  margin-bottom: 24px;

  .mood-indicator {
    position: relative;
    width: 120px;
    height: 120px;

    .wave-container {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;

      .wave {
        width: 200%;
        height: 200%;
        background: rgba(255,255,255,0.3);
        animation: wave 3s infinite linear;
      }
    }

    .mood-value {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 32px;
      font-weight: bold;
    }
  }
}

.ai-chat-section {
  .chat-bubble {
    max-width: 80%;
    padding: 12px 18px;
    margin: 10px;
    border-radius: 18px;

    &.left {
      background: rgba(69, 183, 209, 0.1);
      border: 1px solid v-bind(secondary);
    }

    &.right {
      background: rgba(69, 102, 209, 0.1);
      border: 1px solid v-bind(primary);
      margin-left: auto;
    }
  }

  .chat-input {
    margin-top: 20px;

    :deep(.el-input-group__append) {
      background: v-bind(primary);

      .el-button {
        color: white;
      }
    }
  }
}

.emotion-chart {
  height: 400px;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  padding: 20px;

  .chart-bar {
    width: 4%;
    transition: height 0.5s;
    border-radius: 4px 4px 0 0;
  }
}

.advice-card {
  display: flex;
  align-items: center;
  padding: 16px;
  margin: 10px;
  border-left: 4px solid;

  .advice-icon {
    color: v-bind(secondary);
    font-size: 24px;
    margin-right: 15px;
  }
}

.data-card {
  display: flex;
  align-items: center;
  padding: 15px;

  .data-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      color: white;
      font-size: 20px;
    }
  }

  .data-content {
    margin-left: 15px;

    .data-value {
      color: v-bind(primary);
      font-size: 24px;
      font-weight: bold;
    }
  }
}

@keyframes wave {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.mental-health-container {
  background: linear-gradient(135deg, #f0f5ff 0%, #e3ecff 100%);
  min-height: 100%;
  padding: 20px;
}

.status-header {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mood-summary {
  display: flex;
  align-items: center;
  gap: 20px;
}

.mood-score {
  text-align: center;

  .score-value {
    font-size: 36px;
    font-weight: bold;
    color: v-bind(primary);
    line-height: 1;
  }

  .score-label {
    font-size: 14px;
    color: #666;
    margin-top: 4px;
  }
}

.stats-container {
  display: flex;
  gap: 30px;
}

.stat-item {
  text-align: center;
  padding: 0 15px;
  position: relative;

  &:not(:last-child)::after {
    content: "";
    position: absolute;
    right: -15px;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 40px;
    background: #eee;
  }

  .stat-value {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 4px;
  }

  .stat-label {
    font-size: 14px;
    color: #666;
  }
}

/* 保留原有的其他样式 */
.glassmorphism {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

</style>
