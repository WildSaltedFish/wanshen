<script setup lang="tsx">
import { ref, onMounted, onUnmounted, computed, reactive } from "vue";
import { useRoute } from "vue-router";
import ChatLayout from "../../components/ChatLayout.vue";
import { useChatStore } from "../../stores/chat";
import { promises as fs } from "fs";
import axios from 'axios';
import FormData from 'form-data';

// 声明 window 的扩展类型
// declare global {
//   interface Window {
    // difyChatbotConfig: {
    //   token: string;
    //   isDev: boolean;
    //   baseUrl: string;
    // };
//   }
// }

// 定义文件类型接口
interface FileDetail {
  id: string;
  title: string;
  date: string;
  tags: string[];
  type: string;
  path: string;
  content: string;
}

const route = useRoute();
const fileId =
  typeof route.params.id === "string"
    ? route.params.id
    : Array.isArray(route.params.id)
    ? route.params.id[0]
    : "";
const chatStore = useChatStore();

// 文件聊天消息
const fileMessages = ref([]);

// 存储需要清理的元素引用
// const difyScript = ref<HTMLScriptElement | null>(null);
// const difyStyle = ref<HTMLStyleElement | null>(null);

// 文件上传状态
const isUploading = ref(false);
const uploadProgress = ref(0);
const uploadError = ref<string | null>(null);
const title = ref('请对这份文件进行分析，并告诉我这份文件的主要内容是什么？')
// 添加新的状态
const uploadFileId = ref<string>('');
const conversationId = ref<string>('');
// 添加错误提示自动隐藏定时器
let errorTimer: ReturnType<typeof setTimeout> | null = null;

// 在 script setup 部分添加新的函数和 ref
const chatContainer = ref<HTMLElement | null>(null);

// 添加滚动到底部的函数
const scrollToBottom = () => {
  if (chatContainer.value) {
    const container = chatContainer.value.querySelector('.messages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
};

// 读取 Markdown 文件内容
const readMarkdownFile = async (fileId: string) => {
  try {
    const response = await fetch(`/md/${fileId}.md`);
    if (!response.ok) throw new Error("Failed to fetch markdown file");
    const content = await response.text();
    return content;
  } catch (error) {
    console.error("Error reading markdown file:", error);
    return "";
  }
};

// 发送聊天消息
const sendChatMessage = async (fileId: string, query: string = title.value) => {
  try {
    // 添加用户消息
    const userMessage = {
      id: Date.now().toString(),
      content: query,
      sender: "user" as const,
      timestamp: Date.now(),
      status: "sent" as const,
    };
    fileMessages.value.push(userMessage);

    // 创建一个 AI 消息占位
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage = {
      id: aiMessageId,
      content: "",
      sender: "ai" as const,
      timestamp: Date.now() + 1,
      status: "typing" as const,
    };
    fileMessages.value.push(aiMessage);

    const data = {
      query: query,
      inputs: {
        file: {
          type: "document",
          transfer_method: "local_file",
          upload_file_id: fileId
        }
      },
      user: "lucas",
      response_mode: "streaming",
      conversation_id: conversationId.value || undefined
    };

    const response = await fetch('http://10.88.88.133:5001/v1/chat-messages', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer app-LjOVF9fPMN8RN1sISKf6gysJ',
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // 解码新的数据块
        buffer += decoder.decode(value, { stream: true });
        
        // 处理完整的 SSE 消息
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // 保存不完整的行

        for (const line of lines) {
          if (line.trim().startsWith('data: ')) {
            try {
              const jsonStr = line.substring(6); // 移除 'data: ' 前缀
              if (jsonStr.trim() === '[DONE]') {
                // 处理流结束
                const messageIndex = fileMessages.value.findIndex(msg => msg.id === aiMessageId);
                if (messageIndex !== -1) {
                  fileMessages.value[messageIndex].status = 'sent';
                }
                continue;
              }

              const data = JSON.parse(jsonStr);
              const messageIndex = fileMessages.value.findIndex(msg => msg.id === aiMessageId);
              
              if (messageIndex !== -1) {
                // 处理不同类型的消息
                if (data.event === 'error') {
                  // 处理错误事件
                  fileMessages.value[messageIndex].content = "等候超时，请稍后再试";
                  fileMessages.value[messageIndex].status = "error";
                  fileMessages.value[messageIndex].sender = 'ai';
                  setTimeout(scrollToBottom, 100);
                } else if (data.answer) {
                  // 处理文本回答 - 去除可能的前后空行
                  const trimmedAnswer = data.answer.replace(/^\n+|\n+$/g, '');
                  fileMessages.value[messageIndex].content += trimmedAnswer;
                  fileMessages.value[messageIndex].sender = 'ai';
                  // 添加延时滚动，确保内容已更新
                  setTimeout(scrollToBottom, 100);
                } else if (data.text) {
                  // 处理流式文本 - 去除可能的前后空行
                  const trimmedText = data.text.replace(/^\n+|\n+$/g, '');
                  fileMessages.value[messageIndex].content += trimmedText;
                  fileMessages.value[messageIndex].sender = 'ai';
                  // 添加延时滚动，确保内容已更新
                  setTimeout(scrollToBottom, 100);
                } else if (data.conversation_id && !conversationId.value) {
                  // 保存会话ID
                  conversationId.value = data.conversation_id;
                }
              }
            } catch (e) {
              console.error('解析消息失败：', e, '原始数据：', line);
            }
          }
        }
      }
    }

    return response;
  } catch (error) {
    console.error('发送聊天消息失败：', error);
    const errorMessage = {
      id: Date.now().toString(),
      content: "抱歉，消息发送失败，请稍后重试。",
      sender: "ai" as const,
      timestamp: Date.now(),
      status: "error" as const,
    };
    fileMessages.value.push(errorMessage);
    throw error;
  }
};

// 修改上传文件方法
const uploadFile = async (filePath: string) => {
  try {
    // 清除之前的定时器
    if (errorTimer) {
      clearTimeout(errorTimer);
      errorTimer = null;
    }
    
    isUploading.value = true;
    uploadError.value = null;
    
    // 创建 FormData 对象
    const formData = new FormData();
    
    // 从 public 目录获取文件
    const response = await fetch(filePath);
    const blob = await response.blob();
    
    // 从路径中提取文件名
    const fileName = filePath.split('/').pop() || 'file.pdf';
    
    // 将文件添加到 FormData
    formData.append('file', blob, fileName);

    // 发送上传请求
    const uploadResponse = await axios({
      method: 'post',
      url: 'http://10.88.88.133:5001/v1/files/upload',
      headers: { 
        'Authorization': 'Bearer app-LjOVF9fPMN8RN1sISKf6gysJ',
        'Content-Type': 'multipart/form-data'
      },
      data: formData,
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        uploadProgress.value = percentCompleted;
      }
    });

    console.log('文件上传成功：', uploadResponse.data);
    
    // 保存上传文件的ID
    if (uploadResponse.data.id) {
      uploadFileId.value = uploadResponse.data.id;
      // 上传成功后立即发送聊天消息
      await sendChatMessage(uploadResponse.data.id);
    }

    return uploadResponse.data;
  } catch (error) {
    console.error('文件上传失败：', error);
    uploadError.value = error.message || '文件上传失败';
    
    // 设置5秒后自动隐藏错误提示
    errorTimer = setTimeout(() => {
      uploadError.value = null;
    }, 5000);
    
    const errorMessage = {
      id: Date.now().toString(),
      content: "文件上传失败，请稍后重试。",
      sender: "ai" as const,
      timestamp: Date.now(),
      status: "error" as const,
    };
    fileMessages.value.push(errorMessage);
    throw error;
  } finally {
    // 无论成功还是失败，都关闭上传状态窗口
    isUploading.value = false;
    uploadProgress.value = 0;
  }
};

// 在组件挂载时添加默认消息
onMounted(async () => {
  // 清空之前的消息
  fileMessages.value = [];

  // 注释掉默认消息
  // const defaultMessage = {
  //   id: Date.now().toString(),
  //   content: `让我来为您解读《${fileDetail.value.title}》的内容：

  // 1. 这是一份${
  //     Array.isArray(fileDetail.value.tags)
  //       ? fileDetail.value.tags.join("、")
  //       : ""
  //   }相关的研究报告。

  // 2. 主要内容：
  // ${fileDetail.value.content}

  // 3. 我可以帮您：
  // - 总结报告的关键要点
  // - 解答您对报告内容的疑问
  // - 提供更深入的行业分析

  // 您想了解哪些具体内容？`,
  //   sender: "ai" as const,
  //   timestamp: Date.now(),
  //   status: "sent" as const,
  // };

  // // 初始化文件聊天消息
  // fileMessages.value = [defaultMessage];

  // // 读取对应的 Markdown 文件内容
  // const markdownContent = await readMarkdownFile(fileId);

  // // 添加文件内容消息
  // const fileContentMessage = {
  //   id: (Date.now() + 1).toString(),
  //   content: `以下是文件的具体内容：

  // ${markdownContent}

  // 我可以帮您：
  // 1. 解释任何不理解的概念
  // 2. 分析文档的重点内容
  // 3. 探讨具体的应用场景

  // 请问您想了解哪些具体内容？`,
  //   sender: "ai" as const,
  //   timestamp: Date.now() + 1,
  //   status: "sent" as const,
  // };

  // fileMessages.value.push(fileContentMessage);

  try {
    if (fileDetail.value.path) {
      await uploadFile(fileDetail.value.path);
    }
  } catch (error) {
    console.error('文件处理失败：', error);
  }
});

// 在组件卸载时清理
onUnmounted(() => {
  // 清除错误提示定时器
  if (errorTimer) {
    clearTimeout(errorTimer);
    errorTimer = null;
  }
  
  // 移除脚本
  // if (difyScript.value && document.head.contains(difyScript.value)) {
  //   document.head.removeChild(difyScript.value);
  // }
  
  // // 移除样式
  // if (difyStyle.value && document.head.contains(difyStyle.value)) {
  //   document.head.removeChild(difyStyle.value);
  // }
});

// 文件列表数据
const fileList: FileDetail[] = [
  {
    id: "1",
    title: "东莞证券机械设备行业双周报：关注机器人短期波动风险",
    date: "今日 00:40",
    tags: ["行业研究", "东莞证券", "机械设备"],
    type: "pdf",
    path: "/files/2025-03-14_东莞证券_机械设备行业双周报：关注机器人短期波动风险.pdf",
    content:
      "本报告对机械设备行业的最新发展趋势进行深入分析，重点关注机器人领域的短期市场波动风险。",
  },
  {
    id: "2",
    title: "贵州茅台(600519)25年经销商大会召开，预计量增带动增长",
    date: "2025-01-06",
    tags: ["公司研究", "天风证券", "贵州茅台"],
    type: "pdf",
    path: "/files/2025-01-06_天风证券_贵州茅台(600519)25年经销商大会召开，预计量增带动增长.pdf",
    content:
      "本报告深入分析贵州茅台25 年经销商大会召开，预计量增带动增长。",
  },
  {
    id: "3",
    title: "FinRobot: An Open-Source AI Agent Platform",
    date: "03-12 15:19",
    tags: ["技术研究", "AI Agent", "FinRobot"],
    type: "pdf",
    path: "/files/FinRobot An Open-Source AI Agent Platform.pdf",
    content:
      "这是一个开源的 AI Agent 平台，专注于金融领域的应用，使用大型语言模型实现智能交互。",
  },
];

// 文件详情数据
const fileDetail = ref<FileDetail>(
  fileList.find((file) => file.id === fileId) || {
    id: fileId,
    title: "未知文件",
    date: "-",
    tags: [],
    type: "pdf",
    path: "",
    content: "文件信息不存在",
  }
);

// 默认消息
const defaultMessage = computed(() => ({
  id: Date.now().toString(),
  content: `让我来为您解读《${fileDetail.value.title}》的内容：

1. 这是一份${
    Array.isArray(fileDetail.value.tags) ? fileDetail.value.tags.join("、") : ""
  }相关的研究报告。

2. 主要内容：
${fileDetail.value.content}

3. 我可以帮您：
- 总结报告的关键要点
- 解答您对报告内容的疑问
- 提供更深入的行业分析

您想了解哪些具体内容？`,
  sender: "ai" as const,
  timestamp: Date.now(),
  status: "sent" as const,
}));

console.log('fileMessages2', fileMessages.value);
// 处理用户发送消息
const handleSendMessage = async (message: string) => {
  console.log('接收到用户消息：', message);
  try {
    // 更新 title 值
    title.value = message;
    
    // 调用 sendChatMessage 发送消息
    if (uploadFileId.value) {
      await sendChatMessage(uploadFileId.value, message);
    } else {
      console.error('文件未上传或上传ID不存在');
      const errorMessage = {
        id: Date.now().toString(),
        content: "请先上传文件才能发送消息",
        sender: "ai" as const,
        timestamp: Date.now(),
        status: "error" as const,
      };
      fileMessages.value.push(errorMessage);
    }
  } catch (error) {
    console.error('发送消息失败：', error);
    const errorMessage = {
      id: Date.now().toString(),
      content: "抱歉，消息发送失败，请稍后重试。",
      sender: "ai" as const,
      timestamp: Date.now(),
      status: "error" as const,
    };
    fileMessages.value.push(errorMessage);
  }
};

// 添加默认导出
defineOptions({
  name: "FileDetail",
});
</script>

<template>
  <div class="file-detail-container">
    <!-- 左侧PDF预览区域 -->
    <div class="preview-section">
      <div v-if="isUploading && uploadProgress < 100" class="upload-overlay">
        <div class="upload-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${uploadProgress}%` }"></div>
          </div>
          <div class="progress-text">上传中... {{ uploadProgress }}%</div>
        </div>
      </div>
      <div v-if="uploadError" class="upload-error">
        {{ uploadError }}
      </div>
      <iframe
        :src="fileDetail.path"
        frameborder="0"
        class="pdf-viewer"
      ></iframe>
    </div>

    <!-- 右侧信息和聊天区域 -->
    <div class="info-section">
      <!-- 文件信息卡片 -->
      <div class="file-card">
        <div class="file-header">
          <div class="file-icon">
            <svg width="48px" height="48px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <rect fill="#E74C3C" x="4" y="2" width="24" height="28" rx="2"/>
                <path d="M10,8 L22,8 M10,12 L22,12 M10,16 L18,16" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
                <text x="8" y="26" fill="#FFFFFF" font-family="Arial" font-size="8" font-weight="bold">PDF</text>
              </g>
            </svg>
          </div>
          <div class="file-info">
            <h1 class="file-title">{{ fileDetail.title }}</h1>
            <div class="file-meta">
              <span class="date">{{ fileDetail.date }}</span>
              <div class="tags">
                <span 
                  v-for="(tag, index) in fileDetail.tags" 
                  :key="index"
                  class="tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="file-description">
          <p>{{ fileDetail.content }}</p>
        </div>
      </div>
      
      <!-- AI 助手聊天区域 -->
      <div class="chat-container" ref="chatContainer">
        <div class="chat-header">
          <h2>AI 助手</h2>
          <span class="status">在线</span>
        </div>
        <ChatLayout 
          :messages="fileMessages" 
          :show-new-chat-button="false"
          :show-header="false"
          :standalone="true"
          :placeholder="'请输入您的问题，按回车键发送'"
          @send-message="handleSendMessage"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 变量定义
$primary-color: #2196F3;
$secondary-color: #607D8B;
$text-primary: #333333;
$text-secondary: #666666;
$border-color: #E0E0E0;
$background-light: #F5F7FA;
$background-white: #FFFFFF;
$spacing-unit: 16px;
$border-radius: 8px;
$box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

// Mixins
@mixin flex-center {
  display: flex;
  align-items: center;
}

@mixin card {
  background: $background-white;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
}

// 容器样式
.file-detail-container {
  display: flex;
  height: 100%;
  width: 100%;
  background-color: $background-light;
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
  // height: 100vh;
  display: flex;
  flex-direction: column;
  gap: $spacing-unit;
  padding: 0 $spacing-unit;
  overflow: hidden;

  // 文件卡片和聊天容器占满剩余空间
  .file-card {
    flex-shrink: 0;
  }

  .chat-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
}

// 文件卡片
.file-card {
  @include card;
  padding: $spacing-unit;
  
  .file-header {
    display: flex;
    gap: $spacing-unit;
    padding-bottom: $spacing-unit;
    border-bottom: 1px solid $border-color;
    
    .file-icon {
      flex-shrink: 0;
    }
    
    .file-info {
      flex: 1;
      min-width: 0;
      
      .file-title {
        font-size: 20px;
        font-weight: 600;
        color: $text-primary;
        margin: 0 0 $spacing-unit/2;
        line-height: 1.4;
        word-wrap: break-word;
      }
      
      .file-meta {
        @include flex-center;
        gap: $spacing-unit;
        flex-wrap: wrap;
        
        .date {
          color: $text-secondary;
          font-size: 14px;
        }
        
        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          
          .tag {
            padding: 4px 12px;
            background: rgba($primary-color, 0.1);
            color: $primary-color;
            border-radius: 16px;
            font-size: 13px;
            font-weight: 500;
          }
        }
      }
    }
  }
  
  .file-description {
    padding-top: $spacing-unit;
    color: $text-secondary;
    font-size: 14px;
    line-height: 1.6;
  }
}

// 聊天区域
.chat-container {
  @include card;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  
  .chat-header {
    flex-shrink: 0;
    padding: 5px 16px;
    border-bottom: 1px solid $border-color;
    @include flex-center;
    justify-content: space-between;
  }
  
  :deep(.chat-layout) {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    border-radius: 0;
    box-shadow: none;
    overflow: hidden;
    .chat-interface{
      box-shadow: none;
    }
    .messages-container {
      flex: 1;
      overflow-y: auto;
      padding: $spacing-unit;
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
@media (max-width: 1280px) {
  .info-section {
    min-width: 480px;
  }
}

@media (max-width: 1024px) {
  .file-detail-container {
    flex-direction: column-reverse;
    height: auto;
  }
  
  .info-section {
    width: 100%;
    max-width: none;
  }
  
  .preview-section {
    height: 600px;
  }
}

@media (max-width: 768px) {
  .file-detail-container {
    padding: $spacing-unit/2;
    gap: $spacing-unit/2;
  }
  
  .file-card {
    .file-header {
      flex-direction: column;
      
      .file-icon {
        align-self: center;
      }
    }
  }
  
  .preview-section {
    height: 400px;
  }
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: opacity 0.3s ease;
}

.upload-progress {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 400px;
  transition: transform 0.3s ease;

  .progress-bar {
    height: 8px;
    background: #eee;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 10px;

    .progress-fill {
      height: 100%;
      background: #F59520;
      transition: width 0.3s ease;
    }
  }

  .progress-text {
    text-align: center;
    color: #666;
    font-size: 14px;
  }
}

.upload-error {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #ff4444;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  z-index: 11;
}
</style>
