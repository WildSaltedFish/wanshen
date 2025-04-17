<!--
 * @Author: bc-ax 1542650614@qq.com
 * @Date: 2025-03-14 17:01:16
 * @FilePath: \demo\src\views\file\List.vue
 * @Description: 文件列表视图
-->
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 搜索关键词
const searchKeyword = ref('')

// 模拟数据
const fileList = ref([
  {
    id: 1,
    title: '东莞证券机械设备行业双周报：关注机器人短期波动风险',
    date: '2025-03-14',
    tags: ['行业研究', '东莞证券', '机械设备'],
    type: 'pdf',
    path: '/files/2025-03-14_东莞证券_机械设备行业双周报：关注机器人短期波动风险.pdf'
  },
  {
    id: 2,
    title: '贵州茅台(600519)25年经销商大会召开，预计量增带动增长',
    date: '2025-01-06',
    tags: ['公司研究', '天风证券', '贵州茅台'],
    type: 'pdf',
    path: '/files/2025-01-06_天风证券_贵州茅台(600519)25年经销商大会召开，预计量增带动增长.pdf'
  },
  // {
  //   id: 2,
  //   title: '中银证券：软通动力(301236)华为核心合作伙伴，开启人形机器人新篇章',
  //   date: '2025-03-14',
  //   tags: ['公司研究', '中银证券', '软通动力'],
  //   type: 'pdf',
  //   path: '/files/2025-03-14_中银证券_软通动力(301236)华为核心合作伙伴，开启人形机器人新篇章.pdf'
  // },
  {
    id: 3,
    title: 'FinRobot: An Open-Source AI Agent Platform',
    date: '2025-03-14',
    tags: ['技术研究', 'AI Agent', 'FinRobot'],
    type: 'pdf',
    path: '/files/FinRobot An Open-Source AI Agent Platform.pdf'
  }
])

// 标签分类
const categories = [
  { name: '全部', active: true },
  { name: '公告', active: false },
  { name: '研报', active: false },
  { name: '会议', active: false },
  { name: '资讯', active: false }
]

// 时间分类
const timePeriods = [
  { name: '最新', active: true },
  { name: '三天前', active: false },
  { name: '一周前', active: false }
]

// 切换分类
const toggleCategory = (category: { name: string, active: boolean }) => {
  categories.forEach(c => c.active = false)
  category.active = true
}

// 切换时间
const toggleTimePeriod = (period: { name: string, active: boolean }) => {
  timePeriods.forEach(p => p.active = false)
  period.active = true
}

// 处理文件点击
const handleFileClick = (fileId: number) => {
  router.push(`/file/${fileId}`)
}

// 添加默认导出
defineOptions({
  name: 'FileList'
})
</script>

<template>
  <div class="file-list-container">
    <!-- 搜索区域 -->
    <div class="search-area">
      <div class="search-box">
        <i class="search-icon">🔍</i>
        <input 
          type="text" 
          v-model="searchKeyword"
          placeholder="请输入您想要搜索的内容"
          class="search-input"
        >
      </div>
    </div>

    <!-- 分类导航 -->
    <div class="category-nav">
      <div class="category-group">
        <button 
          v-for="category in categories" 
          :key="category.name"
          :class="{ active: category.active }"
          @click="toggleCategory(category)"
          class="category-btn"
        >
          {{ category.name }}
        </button>
      </div>
      <div class="time-group">
        <button 
          v-for="period in timePeriods" 
          :key="period.name"
          :class="{ active: period.active }"
          @click="toggleTimePeriod(period)"
          class="time-btn"
        >
          {{ period.name }}
        </button>
      </div>
    </div>

    <!-- 文件列表 -->
    <div class="file-table">
      <div 
        v-for="file in fileList" 
        :key="file.id"
        class="file-item"
        @click="handleFileClick(file.id)"
      >
        <div class="file-icon">
          <div class="pdf-icon">
            <svg width="32px" height="32px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <rect fill="#E74C3C" x="4" y="2" width="24" height="28" rx="2"/>
                <path d="M10,8 L22,8 M10,12 L22,12 M10,16 L18,16" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
                <text x="8" y="26" fill="#FFFFFF" font-family="Arial" font-size="8" font-weight="bold">PDF</text>
              </g>
            </svg>
          </div>
        </div>
        <div class="file-info">
          <div class="file-title">{{ file.title }}</div>
          <div class="file-meta">
            <span class="file-date">{{ file.date }}</span>
            <span 
              v-for="(tag, index) in file.tags" 
              :key="index"
              class="file-tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.file-list-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100%;
}

.search-area {
  margin-bottom: 20px;
  
  .search-box {
    background: white;
    border-radius: 8px;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    
    .search-icon {
      margin-right: 12px;
      font-size: 20px;
    }
    
    .search-input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 16px;
      color: #333;
      
      &::placeholder {
        color: #999;
      }
    }
  }
}

.category-nav {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  
  .category-group, .time-group {
    display: flex;
    gap: 12px;
  }
  
  .category-btn, .time-btn {
    padding: 6px 16px;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: #666;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
    
    &.active {
      background: #2c3e50;
      color: white;
    }
  }
}

.file-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  
  .file-item {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #eee;
    transition: all 0.3s ease;
    cursor: pointer;
    
    &:hover {
      background-color: #f8f9fa;
    }
    
    &:last-child {
      border-bottom: none;
    }
    
    .file-icon {
      margin-right: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .pdf-icon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    
    .file-info {
      flex: 1;
      min-width: 0;
      
      .file-title {
        font-size: 15px;
        color: #333;
        margin-bottom: 6px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .file-meta {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .file-date {
          color: #999;
          font-size: 13px;
        }
        
        .file-tag {
          padding: 2px 8px;
          background: #f5f7fa;
          border-radius: 4px;
          font-size: 12px;
          color: #666;
        }
      }
    }
  }
}
</style>

