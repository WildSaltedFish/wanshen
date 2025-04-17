<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ChatLayout from '../../components/ChatLayout.vue';

const route = useRoute();
const reportId = typeof route.params.id === 'string' ? route.params.id : Array.isArray(route.params.id) ? route.params.id[0] : '';

// 研报详情数据
const reportDetail = computed(() => {
  const reports = {
    '1': {
      id: '1',
      title: '机械设备行业研究报告',
      date: '2024-03-14',
      tags: ['机械设备', '行业研究'],
      content: '本报告深入分析了机械设备行业的发展现状、市场趋势和未来机遇...',
      path: '/files/report1.pdf'
    },
    '2': {
      id: '2',
      title: '新能源汽车产业分析',
      date: '2024-03-13',
      tags: ['新能源', '汽车', '产业分析'],
      content: '详细探讨了新能源汽车产业的技术创新、市场格局和投资机会...',
      path: '/files/report2.pdf'
    },
    '3': {
      id: '3',
      title: '半导体行业深度报告',
      date: '2024-03-12',
      tags: ['半导体', '科技', '深度研究'],
      content: '从技术、市场、竞争格局等多个维度解析半导体行业的发展现状与趋势...',
      path: '/files/report3.pdf'
    }
  };
  return reports[reportId as keyof typeof reports];
});

// 聊天消息列表
const reportMessages = ref([]);

// 读取 Markdown 文件内容
const readMarkdownFile = async (reportId: string) => {
  try {
    const response = await fetch(`/md/${reportId}.md`);
    if (!response.ok) throw new Error('Failed to fetch markdown file');
    const content = await response.text();
    return content;
  } catch (error) {
    console.error('Error reading markdown file:', error);
    return '';
  }
};

// 在组件挂载时添加默认消息
onMounted(async () => {
  const defaultMessage = {
    id: Date.now().toString(),
    content: `让我来为您解读《${reportDetail.value.title}》的内容：

1. 这是一份${Array.isArray(reportDetail.value.tags) ? reportDetail.value.tags.join('、') : ''}相关的研究报告。

2. 主要内容：
${reportDetail.value.content}

3. 我可以帮您：
- 总结报告的关键要点
- 解答您对报告内容的疑问
- 提供更深入的行业分析

您想了解哪些具体内容？`,
    sender: 'ai' as const,
    timestamp: Date.now(),
    status: 'sent' as const
  };

  // 初始化研报聊天消息
  reportMessages.value = [defaultMessage];

  // 读取对应的 Markdown 文件内容
  const markdownContent = await readMarkdownFile(reportId);

  // 添加文件内容消息
  const reportContentMessage = {
    id: (Date.now() + 1).toString(),
    content: `以下是研报的具体内容：

${markdownContent}

我可以帮您：
1. 解释任何不理解的概念
2. 分析报告的重点内容
3. 探讨具体的应用场景

请问您想了解哪些具体内容？`,
    sender: 'ai' as const,
    timestamp: Date.now() + 1,
    status: 'sent' as const
  };

  reportMessages.value.push(reportContentMessage);
});
</script>

<template>
  <div class="report-detail-container">
    <!-- 左侧PDF预览区域 -->
    <div class="preview-section">
      <iframe
        :src="reportDetail.path"
        frameborder="0"
        class="pdf-viewer"
      ></iframe>
    </div>

    <!-- 右侧信息和聊天区域 -->
    <div class="info-section">
      <!-- 研报信息卡片 -->
      <div class="report-card">
        <div class="report-header">
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
            <h1 class="report-title">{{ reportDetail.title }}</h1>
            <div class="report-meta">
              <span class="date">{{ reportDetail.date }}</span>
              <div class="tags">
                <span 
                  v-for="(tag, index) in reportDetail.tags" 
                  :key="index"
                  class="tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="report-description">
          <p>{{ reportDetail.content }}</p>
        </div>
      </div>
      
      <!-- AI 助手聊天区域 -->
      <div class="chat-container">
        <div class="chat-header">
          <h2>AI 助手</h2>
          <span class="status">在线</span>
        </div>
        <ChatLayout 
          :messages="reportMessages" 
          :show-new-chat-button="false"
          :show-header="false"
          :standalone="true"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.report-detail-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #f5f5f5;
  gap: 0;
  padding: 0;
  overflow-x: hidden;
}

// 左侧预览区域
.preview-section {
  width: 40%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
  background: white;
}

// 右侧区域
.info-section {
  width: 60%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  overflow-y: auto;

  // 研报卡片
  .report-card {
    background: white;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .report-header {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;

      .report-icon {
        flex-shrink: 0;
      }

      .report-info {
        flex: 1;
        min-width: 0;

        .report-title {
          font-size: 20px;
          font-weight: 600;
          color: #333;
          margin: 0 0 12px;
        }

        .report-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;

          .date {
            color: #666;
            font-size: 14px;
          }

          .tags {
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
      }
    }

    .report-description {
      color: #666;
      font-size: 14px;
      line-height: 1.6;

      p {
        margin: 0;
      }
    }
  }

  // 聊天容器
  .chat-container {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    .chat-header {
      padding: 16px 24px;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      h2 {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin: 0;
      }

      .status {
        display: flex;
        align-items: center;
        color: #4CAF50;
        font-size: 14px;

        &::before {
          content: '';
          display: inline-block;
          width: 8px;
          height: 8px;
          background: currentColor;
          border-radius: 50%;
          margin-right: 6px;
        }
      }
    }
  }
}

.pdf-viewer {
  flex: 1;
  width: 100%;
  height: 100%;
  border: none;
}

// 响应式设计
@media (max-width: 1024px) {
  .report-detail-container {
    flex-direction: column-reverse;
    height: auto;
  }
  
  .info-section {
    width: 100%;
    height: auto;
  }
  
  .preview-section {
    width: 100%;
    height: 600px;
  }
}

@media (max-width: 768px) {
  .info-section {
    padding: 16px;
    gap: 16px;
  }
  
  .preview-section {
    height: 400px;
  }
}
</style> 