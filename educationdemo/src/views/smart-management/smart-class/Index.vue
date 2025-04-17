<template>
  <div class="schedule-container">
    <!-- 毛玻璃背景效果 -->
    <div class="glass-background"></div>

    <div class="schedule-content">
      <!-- 顶部标题和操作区 -->
      <div class="header-section">
        <h1 class="title">AI智能排课系统</h1>
        <div class="action-buttons">
          <el-button type="primary" @click="generateSchedule" class="generate-btn">
            <el-icon><MagicStick /></el-icon> AI智能排课
          </el-button>
          <el-button @click="resetSchedule" class="reset-btn">
            <el-icon><Refresh /></el-icon> 重置
          </el-button>
        </div>
      </div>

      <!-- 参数设置卡片 -->
      <el-card class="settings-card" shadow="hover">
        <div slot="header" class="card-header">
          <span class="card-title">排课参数设置</span>
          <el-tag type="info" effect="dark">AI优化</el-tag>
        </div>
        <div class="settings-form">
          <el-form :model="settings" label-position="top">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="学期开始日期">
                  <el-date-picker
                      v-model="settings.startDate"
                      type="date"
                      placeholder="选择日期"
                      class="flat-date-picker"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="每周上课天数">
                  <el-input-number
                      v-model="settings.daysPerWeek"
                      :min="1"
                      :max="7"
                      controls-position="right"
                      class="flat-input-number"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="每天课时数">
                  <el-input-number
                      v-model="settings.lessonsPerDay"
                      :min="1"
                      :max="10"
                      controls-position="right"
                      class="flat-input-number"
                  ></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>

            <el-divider class="styled-divider"></el-divider>

            <el-form-item label="优化优先级">
              <el-checkbox-group v-model="settings.priorities" class="priority-checkboxes">
                <el-checkbox label="教师时间均衡" name="type"></el-checkbox>
                <el-checkbox label="教室利用率" name="type"></el-checkbox>
                <el-checkbox label="学生课表连贯性" name="type"></el-checkbox>
                <el-checkbox label="特殊课程要求" name="type"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </div>
      </el-card>

      <!-- 排课结果展示 -->
      <div class="result-section">
        <el-tabs v-model="activeTab" class="flat-tabs">
          <el-tab-pane label="课表视图" name="schedule">
            <div class="schedule-table-container">
              <div class="schedule-table">
                <div class="table-header">
                  <div class="header-cell corner"></div>
                  <div
                      v-for="day in days"
                      :key="day"
                      class="header-cell day-header"
                  >
                    {{ day }}
                  </div>
                </div>
                <div class="table-body">
                  <div
                      v-for="time in times"
                      :key="time"
                      class="table-row"
                  >
                    <div class="row-header time-header">{{ time }}</div>
                    <div
                        v-for="day in days"
                        :key="day"
                        class="table-cell"
                        @click="handleCellClick(day, time)"
                    >
                      <div
                          v-if="getCourse(day, time)"
                          class="course-card"
                          :style="{ backgroundColor: getCourseColor(day, time) }"
                      >
                        <div class="course-name">{{ getCourse(day, time).name }}</div>
                        <div class="course-info">
                          <span class="teacher">{{ getCourse(day, time).teacher }}</span>
                          <span class="classroom">{{ getCourse(day, time).classroom }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="冲突检测" name="conflicts">
            <div class="conflict-list" v-if="conflicts.length > 0">
              <el-alert
                  title="检测到以下冲突需要解决"
                  type="warning"
                  show-icon
                  class="conflict-alert"
              >
              </el-alert>
              <el-table :data="conflicts" style="width: 100%">
                <el-table-column prop="type" label="冲突类型"></el-table-column>
                <el-table-column prop="description" label="描述"></el-table-column>
                <el-table-column prop="suggestion" label="建议解决方案"></el-table-column>
              </el-table>
            </div>
            <el-empty description="未检测到冲突" v-else></el-empty>
          </el-tab-pane>
          <el-tab-pane label="统计信息" name="stats">
            <div class="stats-container">
              <el-row :gutter="20">
                <el-col :span="8" v-for="stat in statistics" :key="stat.title">
                  <div class="stat-card">
                    <div class="stat-value">{{ stat.value }}</div>
                    <div class="stat-title">{{ stat.title }}</div>
                    <div class="stat-trend">
                      <i :class="stat.trendIcon" :style="{ color: stat.trendColor }"></i>
                      <span>{{ stat.trendText }}</span>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

// 排课设置
const settings = reactive({
  startDate: new Date(),
  daysPerWeek: 5,
  lessonsPerDay: 6,
  priorities: ['教师时间均衡', '学生课表连贯性']
})

// 星期几数据
const days = computed(() => {
  const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  return dayNames.slice(0, settings.daysPerWeek)
})

// 时间数据
const times = computed(() => {
  return Array.from({ length: settings.lessonsPerDay }, (_, i) => `第${i+1}节`)
})

// 课程数据
const courses = ref([])
const conflicts = ref([])
const activeTab = ref('schedule')

// 统计信息
const statistics = ref([
  { title: '教师平均课时', value: '4.2', trendIcon: 'top', trendColor: '#67C23A', trendText: '较均衡' },
  { title: '教室使用率', value: '78%', trendIcon: 'bottom', trendColor: '#F56C6C', trendText: '可提升' },
  { title: '课程冲突数', value: '2', trendIcon: 'warning', trendColor: '#E6A23C', trendText: '需处理' }
])

// 生成随机课程数据
const generateSchedule = () => {
  // 模拟AI生成排课结果
  const sampleCourses = [
    { name: '数学', teacher: '张老师', classroom: 'A201', day: '周一', time: '第1节' },
    { name: '语文', teacher: '李老师', classroom: 'B102', day: '周一', time: '第2节' },
    { name: '英语', teacher: '王老师', classroom: 'C305', day: '周二', time: '第1节' },
    { name: '物理', teacher: '赵老师', classroom: 'D204', day: '周三', time: '第3节' },
    { name: '化学', teacher: '刘老师', classroom: 'A201', day: '周四', time: '第2节' },
    { name: '生物', teacher: '陈老师', classroom: 'B102', day: '周五', time: '第4节' }
  ]

  // 模拟一些冲突
  conflicts.value = [
    { type: '教师冲突', description: '张老师周一第1节同时在A201和B102有课', suggestion: '调整数学或语文课程时间' },
    { type: '教室冲突', description: 'A201周四第2节同时安排了化学和物理', suggestion: '调整其中一门课程到其他教室' }
  ]

  courses.value = sampleCourses
}

// 重置排课
const resetSchedule = () => {
  courses.value = []
  conflicts.value = []
}

// 获取某时间段的课程
const getCourse = (day, time) => {
  return courses.value.find(c => c.day === day && c.time === time)
}

// 获取课程卡片颜色
const getCourseColor = (day, time) => {
  const course = getCourse(day, time)
  if (!course) return 'transparent'

  const colors = ['#FF9E9E', '#FFD166', '#06D6A0', '#118AB2', '#073B4C', '#EF476F']
  const index = course.name.charCodeAt(0) % colors.length
  return colors[index]
}

// 处理单元格点击
const handleCellClick = (day, time) => {
  const course = getCourse(day, time)
  if (course) {
    ElMessage.info(`点击了${day}${time}: ${course.name} - ${course.teacher}`)
  } else {
    ElMessage.info(`点击了${day}${time}: 可安排课程`)
  }
}
</script>

<style scoped>
/* 基础样式 */
.schedule-container {
  position: relative;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  overflow: hidden;
}

/* 毛玻璃背景效果 */
.glass-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  z-index: 0;
}

.schedule-content {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
}

/* 标题区域 */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin: 0;
  background: linear-gradient(to right, #3a7bd5, #00d2ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.generate-btn {
  background: linear-gradient(45deg, #FF6B6B, #FF8E53);
  border: none;
  box-shadow: 0 4px 6px rgba(255, 107, 107, 0.3);
}

.reset-btn {
  border: 1px solid #ddd;
  background: white;
}

/* 卡片样式 */
.settings-card {
  border-radius: 12px;
  margin-bottom: 30px;
  border: none;
  background: rgba(255, 255, 255, 0.8);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
}

/* 表单元素扁平化样式 */
.flat-date-picker :deep(.el-input__inner) {
  border-radius: 8px;
  border: 1px solid #dcdfe6;
}

.flat-input-number :deep(.el-input-number__decrease),
.flat-input-number :deep(.el-input-number__increase) {
  background: #f5f7fa;
  border-radius: 8px;
}

.priority-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

/* 自定义分割线 */
.styled-divider {
  margin: 20px 0;
  background: linear-gradient(to right, transparent, #409EFF, transparent);
  height: 1px;
}

/* 课表表格样式 */
.schedule-table-container {
  overflow-x: auto;
  padding: 10px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.schedule-table {
  display: flex;
  flex-direction: column;
  min-width: 800px;
}

.table-header, .table-row {
  display: flex;
}

.header-cell, .table-cell, .row-header {
  flex: 1;
  min-width: 120px;
  padding: 12px;
  text-align: center;
  border: 1px solid #eee;
}

.corner {
  background: transparent;
  border: none !important;
}

.day-header {
  background: #3a7bd5;
  color: white;
  font-weight: bold;
}

.time-header {
  background: #f8f9fa;
  font-weight: bold;
}

.table-cell {
  min-height: 80px;
  cursor: pointer;
  transition: all 0.3s;
}

.table-cell:hover {
  background: rgba(58, 123, 213, 0.1);
}

.course-card {
  border-radius: 8px;
  padding: 8px;
  color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.course-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.course-info {
  font-size: 12px;
  display: flex;
  justify-content: space-between;
}

/* 标签页样式 */
.flat-tabs :deep(.el-tabs__nav) {
  border-bottom: 2px solid #f0f0f0;
}

.flat-tabs :deep(.el-tabs__item) {
  font-weight: 500;
  color: #666;
}

.flat-tabs :deep(.el-tabs__item.is-active) {
  color: #3a7bd5;
  font-weight: 600;
}

.flat-tabs :deep(.el-tabs__active-bar) {
  background: linear-gradient(to right, #3a7bd5, #00d2ff);
  height: 3px;
}

/* 统计卡片样式 */
.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 5px;
  background: linear-gradient(to right, #3a7bd5, #00d2ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-title {
  color: #666;
  margin-bottom: 10px;
}

.stat-trend {
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

/* 冲突提示样式 */
.conflict-alert {
  margin-bottom: 20px;
  border-radius: 8px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .settings-form .el-col {
    margin-bottom: 15px;
  }
}
</style>
