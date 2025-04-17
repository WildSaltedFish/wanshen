<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

interface ReportItem {
  id: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
}

const reportList = ref<ReportItem[]>([
  {
    id: '1',
    title: '机械设备行业研究报告',
    date: '2024-03-14',
    tags: ['机械设备', '行业研究'],
    content: '本报告深入分析了机械设备行业的发展现状、市场趋势和未来机遇...'
  },
  {
    id: '2',
    title: '新能源汽车产业分析',
    date: '2024-03-13',
    tags: ['新能源', '汽车', '产业分析'],
    content: '详细探讨了新能源汽车产业的技术创新、市场格局和投资机会...'
  },
  {
    id: '3',
    title: '半导体行业深度报告',
    date: '2024-03-12',
    tags: ['半导体', '科技', '深度研究'],
    content: '从技术、市场、竞争格局等多个维度解析半导体行业的发展现状与趋势...'
  }
]);

const handleReportClick = (reportId: string) => {
  router.push(`/report/${reportId}`);
};
</script>

<template>
  <div class="report-list">
    <div class="list-header">
      <h1>研报列表</h1>
    </div>
    <div class="list-content">
      <div 
        v-for="report in reportList" 
        :key="report.id" 
        class="report-item"
        @click="handleReportClick(report.id)"
      >
        <div class="report-icon">
          <svg width="48px" height="48px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <rect fill="#2196F3" x="4" y="2" width="24" height="28" rx="2"/>
              <path d="M10,8 L22,8 M10,12 L22,12 M10,16 L18,16" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
              <text x="8" y="26" fill="#FFFFFF" font-family="Arial" font-size="8" font-weight="bold">PDF</text>
            </g>
          </svg>
        </div>
        <div class="report-info">
          <h2 class="report-title">{{ report.title }}</h2>
          <div class="report-meta">
            <span class="report-date">{{ report.date }}</span>
            <div class="report-tags">
              <span 
                v-for="(tag, index) in report.tags" 
                :key="index"
                class="tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          <p class="report-desc">{{ report.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.report-list {
  padding: 24px;
  height: 100%;
  overflow-y: auto;
  background-color: #f5f5f5;

  .list-header {
    margin-bottom: 24px;

    h1 {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      margin: 0;
    }
  }

  .list-content {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
  }

  .report-item {
    background: white;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    gap: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .report-icon {
      flex-shrink: 0;
    }

    .report-info {
      flex: 1;
      min-width: 0;

      .report-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin: 0 0 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .report-meta {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
        flex-wrap: wrap;

        .report-date {
          color: #666;
          font-size: 14px;
        }

        .report-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;

          .tag {
            background: rgba(33, 150, 243, 0.1);
            color: #2196F3;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
          }
        }
      }

      .report-desc {
        color: #666;
        font-size: 14px;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
}
</style> 