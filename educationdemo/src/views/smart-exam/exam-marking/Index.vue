<template>
  <div class="ai-marking-container">
    <!-- 头部毛玻璃效果 -->
    <header class="glassmorphism">
      <h1>AI智能阅卷系统</h1>
      <div class="status-bar">
        <el-tag effect="dark" type="info">模型就绪</el-tag>
        <el-progress :percentage="75" :color="secondary" :show-text="false" />
      </div>
    </header>

    <!-- 主体内容 -->
    <main>
      <el-row :gutter="20">
        <!-- 左侧控制区 -->
        <el-col :span="8">
          <el-card class="glassmorphism upload-area">
            <el-upload
                drag
                action="#"
                accept=".pdf,.docx"
                class="modern-upload"
            >
              <el-icon :size="60" :color="primary"><UploadFilled /></el-icon>
              <div class="upload-tip">
                <p>拖拽或点击上传试卷</p>
                <p class="sub-text">支持PDF/DOCX格式</p>
              </div>
            </el-upload>

            <!-- 批改结果概览 -->
            <div class="result-overview">
              <h3>本次批改统计</h3>
              <el-row class="stats-grid">
                <el-col :span="12" v-for="(item, index) in stats" :key="index">
                  <div class="stat-item">
                    <div class="stat-value" :style="{color: primary}">{{ item.value }}</div>
                    <div class="stat-label">{{ item.label }}</div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>

        <!-- 右侧展示区 -->
        <el-col :span="16">
          <el-tabs type="border-card" class="demo-tabs">
            <el-tab-pane label="试卷视图">
              <div class="paper-preview glassmorphism">
                <!-- 试卷缩略图 -->
                <div class="thumbnail" :style="{borderColor: primary}"></div>

                <!-- AI批注可视化 -->
                <div class="mark-visualization">
                  <div
                      v-for="mark in aiMarks"
                      :key="mark.id"
                      class="mark-line"
                      :style="{backgroundColor: primary}"
                  ></div>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="批改详情">
              <div class="marking-details">
                <el-scrollbar height="500px">
                  <div
                      v-for="detail in markingDetails"
                      :key="detail.id"
                      class="detail-card glassmorphism"
                  >
                    <div class="question-title">{{ detail.title }}</div>
                    <div class="accuracy-chart">
                      <div class="chart-circle" :style="{borderColor: secondary}"></div>
                      <span class="accuracy-value">{{ detail.accuracy }}%</span>
                    </div>
                    <el-tag
                        :type="detail.score >= 60 ? 'success' : 'danger'"
                        effect="plain"
                    >得分：{{ detail.score }}</el-tag>
                  </div>
                </el-scrollbar>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'

const primary = '#4566d1'
const secondary = 'rgb(69, 183, 209)'

const stats = ref([
  { label: '平均正确率', value: '86%' },
  { label: '最高得分', value: '98' },
  { label: '批改耗时', value: '23s' },
  { label: '异常题目', value: '2' }
])

const aiMarks = ref([...Array(15)].map((_,i) => ({ id: i })))
const markingDetails = ref([
  { id: 1, title: '简答题：简述Vue3响应式原理', accuracy: 82, score: 28 },
  { id: 2, title: '编程题：实现双向数据绑定', accuracy: 91, score: 45 }
])
</script>

<style scoped>
.ai-marking-container {
  min-height: 100%;
  background: linear-gradient(135deg, #f5f9ff 0%, #e8f4ff 100%);
  padding: 20px;
}

.glassmorphism {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

header {
  padding: 20px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    color: v-bind(primary);
    font-family: 'Segoe UI', sans-serif;
    margin: 0;
  }
}

.upload-area {
  :deep(.el-upload-dragger) {
    background: rgba(255,255,255,0.6);
    border: 2px dashed v-bind(primary);
    transition: all 0.3s;

    &:hover {
      border-color: v-bind(secondary);
      transform: translateY(-2px);
    }
  }
}

.result-overview {
  margin-top: 20px;

  .stats-grid {
    margin-top: 15px;

    .stat-item {
      padding: 12px;
      text-align: center;

      .stat-value {
        font-size: 24px;
        font-weight: 700;
      }

      .stat-label {
        color: #666;
        font-size: 12px;
        margin-top: 6px;
      }
    }
  }
}

.paper-preview {
  height: 600px;
  padding: 20px;
  position: relative;

  .thumbnail {
    height: 100%;
    background: rgba(255,255,255,0.9);
    border: 2px solid;
    border-radius: 8px;
  }
}

.mark-visualization {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;

  .mark-line {
    position: absolute;
    height: 2px;
    width: 40px;
    transform: rotate(-45deg);
    opacity: 0.6;

    @for $i from 1 through 15 {
      &:nth-child(#{$i}) {
        top: random(100) + %;
        left: random(100) + %;
      }
    }
  }
}

.detail-card {
  padding: 15px;
  margin-bottom: 12px;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-3px);
  }

  .question-title {
    color: v-bind(primary);
    font-weight: 500;
    margin-bottom: 10px;
  }

  .accuracy-chart {
    position: relative;
    width: 80px;
    height: 80px;

    .chart-circle {
      width: 100%;
      height: 100%;
      border: 3px solid;
      border-radius: 50%;
      clip-path: inset(0 50% 0 0);
    }

    .accuracy-value {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: v-bind(secondary);
      font-weight: bold;
    }
  }
}

.modern-upload {
  :deep(.el-upload-dragger) {
    padding: 30px;
  }

  .upload-tip {
    .sub-text {
      color: v-bind(secondary);
      font-size: 12px;
    }
  }
}

.status-bar {
  display: flex;
  align-items: center;
  gap: 15px;

  :deep(.el-progress) {
    width: 120px;
  }
}
</style>
