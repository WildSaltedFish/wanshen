<!--
 * @Author: bc-ax 1542650614@qq.com
 * @Date: 2025-03-14 17:15:16
 * @FilePath: \demo\src\components\ChatLayout.vue
 * @Description: 聊天界面布局组件
-->
<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useChatStore, type Message } from "@/stores/chat";
import MarkdownView from "@/components/markdown/MarkdownView.vue";
import { Teleport } from "vue";
import { useRouter } from "vue-router";
import ChatSidebar from "./ChatSidebar.vue";
const router = useRouter();

// 获取聊天store
const chatStore = useChatStore();

// 引用消息容器元素
const messagesContainer = ref<HTMLElement | null>(null);

// 输入框内容
const inputMessage = ref("");


// 添加 emits 定义
const emits = defineEmits(["send-message"]);

// 更新 props 定义
const props = defineProps<{
  messages?: Message[];
  showNewChatButton?: boolean;
  showHeader?: boolean;
  standalone?: boolean;
  placeholder?: string;
}>();
// 聊天列表展开状态
const expandedGroups = ref({
  today: true,
  yesterday: true,
  earlier: true,
});

// 获取聊天消息列表
const chatMessages = computed(() => {
  return props.standalone ? props.messages || [] : chatStore.messages;
});


// 修改处理消息内容的函数，检测 Markdown 格式
const processMessageContent = (content: string, message: Message) => {
  let hasMarkdown = false;

  // 检测是否包含 Markdown 格式
  if (
    content.includes("##") ||
    content.includes("**") ||
    content.includes("```") ||
    content.includes("- ") ||
    content.includes("> ") ||
    content.match(/\[.+\]\(.+\)/)
  ) {
    hasMarkdown = true;
    // 只有当消息是新的且状态为 'sent' 时才打开侧边栏
    if (message.status === "sent" && !message.hasShownPanel) {
      message.hasShownPanel = true;
    }
  }

  // 处理未闭合的<think>标签情况
  if (content.includes("<think>")) {
    // 分割内容，处理每个<think>标签
    let result = "";
    let currentPos = 0;
    let thinkStartPos = content.indexOf("<think>", currentPos);

    while (thinkStartPos !== -1) {
      // 添加<think>标签前的内容
      result += content.substring(currentPos, thinkStartPos);

      // 找到<think>标签后的内容起始位置
      const contentStartPos = thinkStartPos + "<think>".length;

      // 查找</think>结束标签
      const thinkEndPos = content.indexOf("</think>", contentStartPos);

      if (thinkEndPos !== -1) {
        // 如果找到结束标签，提取思考内容
        const thinkContent = content.substring(contentStartPos, thinkEndPos);
        if (thinkContent.trim()) {
          // 去除第一个和最后一个换行符
          const processedContent = thinkContent
            .trim()
            .replace(/^\n+|\n+$/g, "");
          result += `<div class="thinking-content">${processedContent}</div>`;
        }
        currentPos = thinkEndPos + "</think>".length;
      } else {
        // 如果没有找到结束标签，说明是正在输入的思考内容
        const thinkContent = content.substring(contentStartPos);
        if (thinkContent.trim()) {
          // 去除第一个和最后一个换行符
          const processedContent = thinkContent
            .trim()
            .replace(/^\n+|\n+$/g, "");
          result += `<div class="thinking-content">${processedContent}</div>`;
        }
        currentPos = content.length;
      }

      // 查找下一个<think>标签
      thinkStartPos = content.indexOf("<think>", currentPos);
    }

    // 添加剩余内容
    if (currentPos < content.length) {
      result += content.substring(currentPos);
    }

    return result;
  }

  return content;
};

// 发送消息
const sendMessage = () => {
  if (!inputMessage.value.trim()) return;

  if (props.standalone && props.messages) {
    // 独立聊天模式，发送消息到传入的消息列表
    const newMessage = {
      id: Date.now().toString(),
      content: inputMessage.value,
      sender: "user" as const,
      timestamp: Date.now(),
      status: "sent" as const,
    };

    // 向父组件发送消息
    emits("send-message", inputMessage.value);
  } else {
    // 正常聊天模式，使用 store
    chatStore.sendMessage(inputMessage.value);
  }

  // 清空输入框
  inputMessage.value = "";
};

// 添加更多功能选项
const showMoreOptions = ref(false);
const moreOptions = [
  { id: "image", icon: "🖼️", label: "图片" },
  { id: "file", icon: "📎", label: "文件" },
  { id: "code", icon: "💻", label: "代码" },
  { id: "draw", icon: "✏️", label: "绘图" },
];

// 处理文件上传
const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    console.log("上传文件:", input.files[0]);
  }
};

// 添加打字动画组件
const typingDots = ref("...");
const updateTypingDots = () => {
  const dots = [".", "..", "..."];
  let index = 0;
  return setInterval(() => {
    typingDots.value = dots[index];
    index = (index + 1) % dots.length;
  }, 500);
};

// 滚动到底部函数
const scrollToBottom = () => {
  if (messagesContainer.value) {
    setTimeout(() => {
      messagesContainer.value!.scrollTop =
        messagesContainer.value!.scrollHeight;
    }, 50);
  }
};

// 在组件挂载时启动打字动画并滚动到底部
let typingInterval: ReturnType<typeof setInterval> | null = null;
onMounted(() => {
  typingInterval = updateTypingDots();
  scrollToBottom();
});

// 在组件卸载时清除定时器
onUnmounted(() => {
  if (typingInterval !== null) {
    clearInterval(typingInterval);
  }
});

// 复制消息内容
const copyMessage = async (content: string) => {
  try {
    await navigator.clipboard.writeText(content);
  } catch (err) {
    console.error("复制失败:", err);
  }
};

// 重新生成消息
const regenerateMessage = (message: Message) => {
  chatStore.regenerateResponse(message);
};

// 喜欢消息
const likeMessage = (message: any) => {
  console.log("喜欢消息:", message);
};

// 不喜欢消息
const dislikeMessage = (message: any) => {
  console.log("不喜欢消息:", message);
};

// 添加 handleNewChat 函数
const handleNewChat = () => {
  chatStore.setCurrentModel("护理");
  chatStore.startNewChat();
};
// 模型选择区域展开状态
const modelSelectorExpanded = ref(true);
// 切换模型选择区域展开状态
const toggleModelSelector = () => {
  modelSelectorExpanded.value = !modelSelectorExpanded.value;
};
// 切换展开状态
const toggleGroup = (group: any) => {
  if (group.isGroup) {
    group.expanded = !group.expanded;
  }
};

// 处理聊天选择
const handleChatSelect = (chatId: string) => {
  chatStore.selectChat(chatId);
  router.push("/chat");
};
const goToWelcome = () => {
  router.push("/welcome");
};
// 添加默认导出
defineOptions({
  name: "ChatLayout",
});
</script>

<template>
  <div class="chat-interface">
    <div class="chat-interface-left">
      <div class="ai-title">
        <div class="ai-title-content">
          <span>AI模型</span>
          <!-- <el-icon class="arrow-icon" :class="{ 'is-rotate': showAiList }">
          <arrow-down />
        </el-icon> -->
        </div>
      </div>
      <!-- 模型选择 -->
      <div class="model-selector">
        <div class="model-selector-header" @click="toggleModelSelector">
          <el-icon
            class="group-arrow"
            :class="{ 'is-expanded': modelSelectorExpanded }"
          >
            <caret-right />
          </el-icon>
          模型选择
        </div>

        <!-- 模型选择内容区域 -->
        <div v-if="modelSelectorExpanded" class="model-selector-content">
          <!-- 云端/本地模型选择 -->
          <div class="model-type-selector">
            <label class="radio-label">
              <input
                type="radio"
                name="modelType"
                :value="false"
                v-model="chatStore.useLocalModel"
                @change="chatStore.setUseLocalModel(false)"
              />
              云端模型
            </label>
            <label class="radio-label">
              <input
                type="radio"
                name="modelType"
                :value="true"
                v-model="chatStore.useLocalModel"
                @change="chatStore.setUseLocalModel(true)"
              />
              本地模型
            </label>
          </div>

          <!-- 云端模型下拉框 -->
          <select
            v-if="!chatStore.useLocalModel"
            v-model="chatStore.currentModelId"
            @change="chatStore.setCurrentModel($event.target.value)"
            class="model-select"
          >
            <option
              v-for="model in chatStore.AVAILABLE_MODELS"
              :key="model.id"
              :value="model.id"
            >
              {{ model.name }}
            </option>
          </select>

          <!-- 本地模型下拉框 -->
          <select
            v-else
            v-model="chatStore.currentLocalModelId"
            @change="chatStore.setCurrentLocalModel($event.target.value)"
            class="model-select"
          >
            <option
              v-for="model in chatStore.LOCAL_MODELS"
              :key="model.id"
              :value="model.id"
            >
              {{ model.name }}
            </option>
          </select>

          <div class="model-description">
            {{
              chatStore.useLocalModel
                ? chatStore.LOCAL_MODELS.find(
                    (m) => m.id === chatStore.currentLocalModelId
                  )?.description
                : chatStore.AVAILABLE_MODELS.find(
                    (m) => m.id === chatStore.currentModelId
                  )?.description
            }}
          </div>
        </div>
      </div>

      <!-- 探索按钮 -->
      <div class="explore-btn" @click="goToWelcome">
        <span class="icon">🔍</span>
        <span class="text">探索功能</span>
      </div>

      <!-- 新建聊天按钮 -->
      <div class="new-chat-btn" @click="handleNewChat">
        <span class="icon">+</span>
        <span class="text">新建聊天</span>
      </div>

      <!-- 聊天列表 -->
      <div class="chat-list-container">
        <!-- 今天 -->
        <div v-if="chatStore.groupedChats.today.length > 0" class="chat-group">
          <div class="group-header" @click="toggleGroup('today')">
            <el-icon
              class="group-arrow"
              :class="{ 'is-expanded': expandedGroups.today }"
            >
              <caret-right />
            </el-icon>
            今天
          </div>
          <div v-if="expandedGroups.today" class="chat-items">
            <div
              v-for="chat in chatStore.groupedChats.today"
              :key="chat.id"
              class="chat-item"
              :class="{ active: chatStore.currentChatId === chat.id }"
              @click="handleChatSelect(chat.id)"
            >
              <div class="chat-icon">💬</div>
              <div class="chat-info">
                <div class="chat-title">{{ chat.title }}</div>
                <div class="chat-preview">{{ chat.preview }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 昨天 -->
        <div
          v-if="chatStore.groupedChats.yesterday.length > 0"
          class="chat-group"
        >
          <div class="group-header" @click="toggleGroup('yesterday')">
            <el-icon
              class="group-arrow"
              :class="{ 'is-expanded': expandedGroups.yesterday }"
            >
              <caret-right />
            </el-icon>
            昨天
          </div>
          <div v-if="expandedGroups.yesterday" class="chat-items">
            <div
              v-for="chat in chatStore.groupedChats.yesterday"
              :key="chat.id"
              class="chat-item"
              :class="{ active: chatStore.currentChatId === chat.id }"
              @click="handleChatSelect(chat.id)"
            >
              <div class="chat-icon">💬</div>
              <div class="chat-info">
                <div class="chat-title">{{ chat.title }}</div>
                <div class="chat-preview">{{ chat.preview }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 更早 -->
        <div
          v-if="chatStore.groupedChats.earlier.length > 0"
          class="chat-group"
        >
          <div class="group-header" @click="toggleGroup('earlier')">
            <el-icon
              class="group-arrow"
              :class="{ 'is-expanded': expandedGroups.earlier }"
            >
              <caret-right />
            </el-icon>
            更早
          </div>
          <div v-if="expandedGroups.earlier" class="chat-items">
            <div
              v-for="chat in chatStore.groupedChats.earlier"
              :key="chat.id"
              class="chat-item"
              :class="{ active: chatStore.currentChatId === chat.id }"
              @click="handleChatSelect(chat.id)"
            >
              <div class="chat-icon">💬</div>
              <div class="chat-info">
                <div class="chat-title">{{ chat.title }}</div>
                <div class="chat-preview">{{ chat.preview }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 左侧聊天界面 -->
    <div class="chat-interface-right">
      <div class="chat-header" v-if="showHeader">
        <div class="header-left">
          <h2>{{ chatStore.currentTheme || "新对话" }}</h2>
        </div>
        <button
          v-if="showNewChatButton"
          class="new-chat-btn"
          @click="handleNewChat"
        >
          新对话
        </button>
      </div>
      <!-- 消息区域 -->
      <div class="messages-container" ref="messagesContainer">
        <div v-if="chatMessages.length === 0" class="empty-chat">
          <p>开始新的对话吧！</p>
        </div>

        <div v-else class="message-list">
          <div
            v-for="message in chatMessages"
            :key="message.id"
            class="message-item"
            :class="{
              'user-message': message.sender === 'user',
              'ai-message': message.sender === 'ai',
              typing: message.status === 'typing',
            }"
          >
            <div class="message-avatar">
              {{ message.sender === "user" ? "👤" : "🤖" }}
            </div>
            <div class="message-content">
              <div class="message-text">
                <div
                  v-if="message.status === 'typing'"
                  class="typing-indicator"
                >
                  <span class="typing-text">
                    <MarkdownView
                      :content="processMessageContent(message.content, message)"
                    />
                  </span>
                  <span class="typing-dots">{{ typingDots }}</span>
                </div>
                <div v-else>
                  <MarkdownView
                    :content="processMessageContent(message.content, message)"
                  />
                </div>
              </div>
              <div class="message-time">
                {{ new Date(message.timestamp).toLocaleTimeString() }}
              </div>
              <!-- AI消息操作按钮 -->
              <div
                v-if="message.sender === 'ai' && message.status === 'sent'"
                class="message-actions"
              >
                <button
                  class="action-btn tooltip"
                  data-tooltip="复制到剪贴板"
                  @click="copyMessage(message.content)"
                >
                  <span class="action-icon">📋</span>
                </button>
                <button
                  class="action-btn tooltip"
                  data-tooltip="重新生成"
                  @click="regenerateMessage(message)"
                >
                  <span class="action-icon">🔄</span>
                </button>
                <button
                  class="action-btn tooltip"
                  data-tooltip="喜欢"
                  @click="likeMessage(message)"
                >
                  <span class="action-icon">👍</span>
                </button>
                <button
                  class="action-btn tooltip"
                  data-tooltip="不喜欢"
                  @click="dislikeMessage(message)"
                >
                  <span class="action-icon">👎</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="input-container">
        <div class="input-wrapper">
          <!-- 更多功能按钮 -->
          <div class="more-options">
            <button
              class="icon-btn tooltip"
              data-tooltip="更多功能"
              @click="showMoreOptions = !showMoreOptions"
            >
              <span class="icon">+</span>
            </button>
            <!-- 更多功能下拉菜单 -->
            <div v-if="showMoreOptions" class="options-dropdown">
              <div
                v-for="option in moreOptions"
                :key="option.id"
                class="option-item"
              >
                <span class="option-icon">{{ option.icon }}</span>
                <span class="option-label">{{ option.label }}</span>
              </div>
            </div>
          </div>

          <!-- 文件上传按钮 -->
          <div class="file-upload">
            <input
              type="file"
              id="file-input"
              class="file-input"
              @change="handleFileUpload"
              multiple
            />
            <label
              for="file-input"
              class="icon-btn tooltip"
              data-tooltip="上传文件"
            >
              <span class="icon">📎</span>
            </label>
          </div>

          <!-- 消息输入框 -->
          <textarea
            v-model="inputMessage"
            class="message-input"
            :placeholder="placeholder || '输入消息...'"
            @keydown.enter.prevent="sendMessage"
          ></textarea>

          <!-- 发送按钮 -->
          <button
            class="send-btn tooltip"
            data-tooltip="发送消息 (Enter)"
            @click="sendMessage"
            :disabled="!inputMessage.trim()"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 变量定义
$colors: (
  primary: #f59520,
  primary-hover: #d48f2b,
  text-primary: #2c3e50,
  text-secondary: #7f8c8d,
  border: #e9ecef,
  bg-primary: #f8f9fa,
  bg-white: #fff,
  disabled: #cccccc,
  thinking: #8b8b8b,
);

$shadows: (
  sm: 0 1px 2px rgba(0, 0, 0, 0.1),
  md: 0 4px 6px rgba(0, 0, 0, 0.1),
  lg: 0 2px 10px rgba(0, 0, 0, 0.1),
);

$spacing: (
  xs: 4px,
  sm: 8px,
  md: 15px,
  lg: 20px,
  xl: 40px,
);

// Mixins
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin button-base {
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

@mixin hover-transform {
  &:hover {
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
}

@mixin dropdown-base {
  position: absolute;
  background-color: map-get($colors, bg-white);
  border-radius: 8px;
  box-shadow: map-get($shadows, lg);
  z-index: 1000;
}

// 聊天布局
.chat-layout {
  display: flex;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 0 map-get($spacing, lg);
  justify-content: center;
  overflow: hidden;
  background-color: var(--theme-primary);
}
.chat-interface {
  display: flex; /* 设置为flex容器 */
  align-items: center; /* 垂直居中 */
  height: 100%;
  margin-left: 30px;
}
.chat-interface-left {
  height: 100%;
  max-width: 300px;
}
// 聊天界面
.chat-interface-right {
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1024px;
  background-color: map-get($colors, bg-white);
  // box-shadow: map-get($shadows, sm);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-left: 30px;
  // 聊天头部
  .chat-header {
    padding: map-get($spacing, sm) map-get($spacing, lg);
    border-bottom: 1px solid var(--theme-primary-dark);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--theme-primary);
    color: #ffffff;

    .header-left {
      display: flex;
      align-items: center;
      gap: map-get($spacing, md);

      h2 {
        font-size: 16px;
        font-weight: 600;
        color: map-get($colors, text-primary);
        margin: 0;
      }
    }
  }
}

// 按钮样式
.new-chat-btn {
  @include button-base;
  padding: map-get($spacing, sm) map-get($spacing, md);
  background-color: map-get($colors, primary);
  color: white;

  &:hover {
    background-color: map-get($colors, primary-hover);
  }
}

// 消息容器
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: map-get($spacing, lg);
  width: 100%;
  height: 0;

  .empty-chat {
    height: 100%;
    @include flex-center;
    color: map-get($colors, text-secondary);
  }

  .message-list {
    display: flex;
    flex-direction: column;
    gap: map-get($spacing, md);
    padding: 0 map-get($spacing, lg);
  }
}

// 消息项
.message-item {
  display: flex;
  // max-width: 80%;

  &.user-message {
    align-self: flex-end;
    flex-direction: row-reverse;

    .message-content {
      background-color: map-get($colors, primary);
      color: white;

      :deep(pre),
      :deep(code) {
        background-color: rgba(0, 0, 0, 0.1);
        color: white;
      }

      :deep(blockquote) {
        border-left-color: rgba(255, 255, 255, 0.3);
        color: rgba(255, 255, 255, 0.9);
      }
    }

    .message-time {
      color: rgba(255, 255, 255, 0.8);
    }
  }

  &.ai-message {
    align-self: flex-start;

    .message-content {
      padding-bottom: map-get($spacing, sm);
    }
  }

  &.typing {
    .message-content {
      background-color: map-get($colors, bg-primary);
    }
  }
}

// 消息头像
.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  @include flex-center;
  font-size: 1.5rem;
  margin: 0 map-get($spacing, sm);
}

// 消息内容
.message-content {
  background-color: white;
  padding: map-get($spacing, md);
  border-radius: 10px;
  box-shadow: map-get($shadows, sm);
  min-width: 150px;

  .message-text {
    margin-bottom: map-get($spacing, xs);
    line-height: 1.4;
  }

  .message-time {
    font-size: 0.7rem;
    color: map-get($colors, text-secondary);
    text-align: right;
  }

  // Markdown 样式
  :deep {
    pre {
      background-color: map-get($colors, bg-primary);
      padding: 1em;
      border-radius: 4px;
      overflow-x: auto;
      margin: 0.5em 0;
    }

    code {
      font-family: monospace;
      background-color: map-get($colors, bg-primary);
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-size: 0.9em;
    }

    blockquote {
      border-left: 4px solid map-get($colors, border);
      margin: 0;
      padding-left: 1em;
      color: map-get($colors, text-secondary);
    }

    ul,
    ol {
      padding-left: 1.5em;
      margin: 0.5em 0;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin: 0.5em 0;
      line-height: 1.2;
    }

    p {
      margin: 0.5em 0;
    }

    table {
      border-collapse: collapse;
      width: 100%;
      margin: 0.5em 0;

      th,
      td {
        border: 1px solid map-get($colors, border);
        padding: 0.5em;
        text-align: left;
      }

      th {
        background-color: map-get($colors, bg-primary);
      }
    }

    .thinking-content {
      color: map-get($colors, thinking);
      font-size: 14px;
      padding-left: map-get($spacing, md);
      border-left: 3px solid map-get($colors, thinking);
      margin: map-get($spacing, sm) 0;
    }
  }
}

// 打字指示器
.typing-indicator {
  display: flex;
  align-items: center;
  gap: map-get($spacing, sm);

  .typing-text {
    flex: 1;
    white-space: pre-wrap;
  }

  .typing-dots {
    color: map-get($colors, text-secondary);
    font-style: italic;
    min-width: 24px;
  }
}

// 消息操作按钮
.message-actions {
  display: flex;
  gap: map-get($spacing, sm);
  margin-top: map-get($spacing, sm);

  .action-btn {
    @include button-base;
    padding: map-get($spacing, xs);
    border-radius: 6px;
    @include flex-center;
    color: map-get($colors, text-secondary);
    @include hover-transform;

    &:hover {
      background-color: map-get($colors, border);
      color: map-get($colors, text-primary);
    }

    .action-icon {
      font-size: 1.1rem;
    }
  }
}

// 输入区域
.input-container {
  padding: map-get($spacing, sm) map-get($spacing, lg);
  border-top: 1px solid map-get($colors, border);
  background-color: map-get($colors, bg-white);
  flex-shrink: 0;

  .input-wrapper {
    max-width: 1024px;
    margin: 0 auto;
    display: flex;
    gap: map-get($spacing, sm);
    align-items: center;
    position: relative;
  }
}

// 更多选项
.more-options {
  position: relative;

  .options-dropdown {
    @include dropdown-base;
    bottom: 100%;
    left: 0;
    padding: map-get($spacing, sm);
    margin-bottom: map-get($spacing, sm);
    min-width: 150px;

    .option-item {
      display: flex;
      align-items: center;
      padding: map-get($spacing, sm);
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.2s ease;

      &:hover {
        background-color: map-get($colors, bg-primary);
        transform: translateX(4px);
      }

      .option-icon {
        margin-right: map-get($spacing, sm);
        font-size: 1.2rem;
      }

      .option-label {
        color: map-get($colors, text-primary);
        font-size: 0.9rem;
      }
    }
  }
}

// 文件上传
.file-upload {
  position: relative;

  .file-input {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
  }
}

// 按钮样式
.icon-btn {
  @include button-base;
  background: none;
  padding: map-get($spacing, sm);
  font-size: 1.2rem;
  color: map-get($colors, text-secondary);
  @include flex-center;
  @include hover-transform;

  &:hover {
    background-color: map-get($colors, border);
    color: map-get($colors, text-primary);
  }
}

// 发送按钮
.send-btn {
  @include button-base;
  padding: 0 map-get($spacing, lg);
  height: 30px;
  background-color: map-get($colors, primary);
  color: white;
  font-size: 1rem;
  white-space: nowrap;
  position: relative;
  overflow: hidden;

  &:hover:not(:disabled) {
    background-color: map-get($colors, primary-hover);
    @include hover-transform;
    box-shadow: map-get($shadows, sm);
  }

  &:disabled {
    background-color: map-get($colors, disabled);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
}

// 输入框
.message-input {
  flex: 1;
  padding: map-get($spacing, md);
  border: 1px solid map-get($colors, border);
  border-radius: 5px;
  resize: none;
  height: 30px;
  min-height: 30px;
  max-height: 30px;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1px;
  transition: border-color 0.2s;
  overflow-y: hidden;

  &:focus {
    outline: none;
    border-color: map-get($colors, primary);
  }
}

// 工具提示
.tooltip {
  position: relative;

  &::before {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: map-get($spacing, sm);
    padding: 6px 10px;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    font-size: 0.8rem;
    white-space: nowrap;
    border-radius: 4px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;
    pointer-events: none;
    z-index: 1000;
  }

  &:hover::before {
    opacity: 1;
    visibility: visible;
  }
}

// 响应式样式
@media (max-width: 768px) {
  .input-wrapper {
    gap: map-get($spacing, sm);
  }

  .icon-btn {
    padding: map-get($spacing, xs);
  }

  .message-input {
    font-size: 0.9rem;
  }

  .send-btn {
    padding: 0 map-get($spacing, md);
    font-size: 0.9rem;
  }

  .tooltip::before {
    font-size: 0.75rem;
    padding: map-get($spacing, xs) map-get($spacing, sm);
  }

  .message-item {
    max-width: 90%;
  }
}

// 变量定义
$colors: (
  primary: #2c3e50,
  accent: #f59520,
  border: #e9ecef,
  text: #606266,
  hover-bg: rgba(255, 255, 255, 0.1),
  active-bg: rgba(255, 255, 255, 0.2),
);

$spacing: (
  xs: 4px,
  sm: 8px,
  md: 16px,
  lg: 24px,
  xl: 32px,
);

$transitions: (
  default: all 0.3s ease,
  fast: all 0.15s ease,
);

// Mixins
@mixin button-reset {
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;

  &:focus {
    outline: none;
  }
}

@mixin flex-center {
  display: flex;
  align-items: center;
}

@mixin hover-effect {
  transition: map-get($transitions, fast);
  cursor: pointer;

  &:hover {
    background-color: map-get($colors, hover-bg);
  }
}
// ai列表
.ai-list {
  position: absolute;
  width: 200px;
  left: -200px;
  top: 0;
  height: 100%;
  background-color: #2c3e50;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 9999;
  color: #fff;

  .ai-list-content {
    height: 100%;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.3);
      border-radius: 2px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }
  }

  .ai-model-item {
    .ai-model-header {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      cursor: pointer;
      transition: background-color 0.3s;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      &.is-group {
        font-weight: 500;
      }

      &.is-selected {
        background-color: rgba(64, 158, 255, 0.2);
        color: #409eff;
      }

      .model-header-content {
        display: flex;
        align-items: center;
        width: 100%;
      }

      .model-icon {
        margin-right: 8px;
        font-size: 16px;
      }

      .model-title {
        flex: 1;
        font-size: 14px;
        color: #fff;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .group-arrow {
        font-size: 12px;
        transition: transform 0.3s;
        color: rgba(255, 255, 255, 0.7);

        &.is-expanded {
          transform: rotate(90deg);
        }
      }
    }

    .ai-model-children {
      .ai-model-child {
        display: flex;
        align-items: center;
        padding: 8px 16px 8px 32px;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        &.is-selected {
          background-color: rgba(64, 158, 255, 0.2);
          color: #409eff;
        }

        .child-content {
          display: flex;
          align-items: center;
          width: 100%;
        }

        .model-icon {
          margin-right: 8px;
          font-size: 14px;
        }

        .model-name {
          flex: 1;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.9);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
// 主要样式
.sidebar-container {
  position: fixed;
  left: 200px;
  top: 60px;
  height: calc(100% - 60px);
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  color: map-get($colors, text);
  z-index: 100;
  border-right: 1px solid map-get($colors, border);
  @media (max-width: 1200px) {
    display: none;
  }
}

.sidebar-header {
  padding: map-get($spacing, md);
  @include flex-center;
  border-bottom: 1px solid map-get($colors, border);

  h1 {
    font-size: 1.2rem;
    margin: 0;
  }
}

.model-selector {
  padding: map-get($spacing, md);
  border-bottom: 1px solid map-get($colors, border);
  background-color: rgba(255, 255, 255, 0.03);

  .model-selector-header {
    margin-bottom: map-get($spacing, md);
    color: map-get($colors, text);
    font-size: 0.9rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    user-select: none;

    &:hover {
      opacity: 0.8;
      background-color: rgba(255, 255, 255, 0.05);
    }

    .group-arrow {
      margin-right: map-get($spacing, xs);
      font-size: 14px;
      transition: transform 0.3s;

      &.is-expanded {
        transform: rotate(90deg);
      }
    }
  }

  .model-selector-content {
    .model-type-selector {
      margin-bottom: map-get($spacing, md);
      display: flex;
      gap: map-get($spacing, md);
      justify-content: center;
    }

    .radio-label {
      color: map-get($colors, text);
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 8px 16px;
      border-radius: 4px;
      transition: all 0.3s ease;

      &:hover {
        background-color: rgba(255, 255, 255, 0.05);
      }

      input[type="radio"] {
        margin-right: map-get($spacing, xs);
        width: 16px;
        height: 16px;
        cursor: pointer;

        &:checked + span {
          color: map-get($colors, accent);
        }
      }
    }
  }
}

.model-select {
  width: 100%;
  padding: map-get($spacing, sm) 32px map-get($spacing, sm)
    map-get($spacing, sm);
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid map-get($colors, border);
  border-radius: 6px;
  color: map-get($colors, text);
  font-size: 0.9rem;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M2.293 4.293a1 1 0 0 1 1.414 0L6 6.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  transition: map-get($transitions, fast);

  &:hover {
    border-color: map-get($colors, accent);
    background-color: rgba(255, 255, 255, 0.1);
  }

  &:focus {
    outline: none;
    border-color: map-get($colors, accent);
    background-color: rgba(255, 255, 255, 0.1);
  }

  option {
    background-color: map-get($colors, primary);
    color: map-get($colors, text);
    padding: map-get($spacing, sm);
  }
}

.model-description {
  margin-top: map-get($spacing, sm);
  color: map-get($colors, text);
  font-size: 0.85rem;
  opacity: 0.7;
  line-height: 1.4;
}

// 探索按钮样式
.explore-btn,
.new-chat-btn {
  display: flex;
  align-items: center;
  gap: map-get($spacing, sm);
  padding: map-get($spacing, md);
  margin: map-get($spacing, sm) map-get($spacing, md);
  border-radius: 8px;
  cursor: pointer;
  transition: map-get($transitions, default);
  font-size: 14px;

  .icon {
    font-size: 16px;
  }

  .text {
    flex: 1;
  }
}

.explore-btn {
  background-color: transparent;
  border: 1px solid map-get($colors, accent);
  color: map-get($colors, text);

  &:hover {
    background-color: rgba(245, 149, 32, 0.1);
  }
}

.new-chat-btn {
  background-color: map-get($colors, accent);
  border: none;
  color: map-get($colors, text);

  &:hover {
    background-color: darken(map-get($colors, accent), 10%);
  }
}

.chat-list-container {
  flex: 1;
  overflow-y: auto;
  padding: map-get($spacing, sm) 0;
  border-top: 1px solid map-get($colors, border);

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: map-get($colors, border);
    border-radius: 2px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
}

.chat-group {
  .group-header {
    padding: map-get($spacing, xs) map-get($spacing, md);
    color: map-get($colors, text);
    opacity: 0.6;
    font-size: 0.9rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    user-select: none;

    &:hover {
      opacity: 0.8;
      background-color: rgba(255, 255, 255, 0.05);
    }

    .group-arrow {
      margin-right: map-get($spacing, xs);
      font-size: 14px;
      transition: transform 0.3s;

      &.is-expanded {
        transform: rotate(90deg);
      }
    }
  }

  .chat-items {
    transition: all 0.3s ease;
  }

  .chat-item {
    @include flex-center;
    @include hover-effect;
    padding: map-get($spacing, sm) map-get($spacing, md);

    &.active {
      background-color: map-get($colors, active-bg);
    }

    .chat-icon {
      margin-right: map-get($spacing, sm);
    }

    .chat-info {
      flex: 1;
      min-width: 0;

      .chat-title {
        color: map-get($colors, text);
        font-size: 0.95rem;
        margin-bottom: 2px;
      }

      .chat-preview {
        color: map-get($colors, text);
        opacity: 0.6;
        font-size: 0.85rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}

.sidebar-footer {
  border-top: 1px solid map-get($colors, border);

  .settings-list {
    padding: map-get($spacing, sm) 0;
  }

  .settings-item {
    @include flex-center;
    @include hover-effect;
    padding: map-get($spacing, sm) map-get($spacing, md);
    color: map-get($colors, text);

    .settings-icon {
      margin-right: map-get($spacing, sm);
    }
  }
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

// ai标题
.ai-title {
  padding: map-get($spacing, md);
  cursor: pointer;
  border-bottom: 1px solid map-get($colors, border);
  background-color: #fff;

  .ai-title-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: map-get($colors, text);
    font-size: 1rem;
    font-weight: 500;

    .arrow-icon {
      transition: transform 0.3s;
      font-size: 16px;
      color: #909399;

      &.is-rotate {
        transform: rotate(90deg);
      }
    }
  }

  &:hover {
    background-color: #f5f7fa;
  }
}
</style>
