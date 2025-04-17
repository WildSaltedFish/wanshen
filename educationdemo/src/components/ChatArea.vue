<!--
 * @Author: bc-ax 1542650614@qq.com
 * @Date: 2025-03-07 13:37:55
 * @LastEditors: bc-ax 1542650614@qq.com
 * @LastEditTime: 2025-03-19 19:53:01
 * @FilePath: \demo\src\components\ChatArea.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useChatStore, type Message } from "../stores/chat";
import MarkdownView from "./markdown/MarkdownView.vue";
import SidebarPanel from "./SidebarPanel.vue";
import { Teleport } from "vue";
import ChatLayout from "./ChatLayout.vue";

// 获取聊天store
const chatStore = useChatStore();

// 引用消息容器元素
const messagesContainer = ref<HTMLElement | null>(null);

// 输入框内容
const inputMessage = ref("");

// 是否显示欢迎页面
const showWelcome = computed(() => !chatStore.currentChat);

// 侧边栏面板显示状态
const showSidebarPanel = ref(false);

// 关闭侧边栏面板
const closeSPanel = () => {
  showSidebarPanel.value = false;
};

// 处理来自欢迎页面的快捷提示
const handleUsePrompt = (prompt: string) => {
  chatStore.setCurrentModel("护理");
  chatStore.startNewChat();
  chatStore.sendMessage(prompt);
};
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
      // showSidebarPanel.value = true;
      // 标记该消息已经显示过面板
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

  chatStore.sendMessage(inputMessage.value);

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
    // TODO: 处理文件上传逻辑
    console.log("上传文件:", input.files[0]);
  }
};

// 添加按钮提示文本
const tooltips = {
  more: "更多功能",
  upload: "上传文件",
  send: "发送消息 (Enter)",
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
    }, 50); // 短暂延迟确保DOM已更新
  }
};

// 监听消息变化
watch(
  () => chatStore.messages,
  (messages) => {
    // 当有新消息时，处理最后一条消息
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === "ai") {
        processMessageContent(lastMessage.content, lastMessage);
      }
    }
  },
  { deep: true }
);

// 监听最后一条消息的内容变化，处理AI流式输出的情况
watch(
  () => {
    if (chatStore.messages.length > 0) {
      return chatStore.messages[chatStore.messages.length - 1].content;
    }
    return "";
  },
  () => {
    // 如果最后一条消息是AI消息且正在输出，则滚动到底部
    if (chatStore.messages.length > 0) {
      const lastMessage = chatStore.messages[chatStore.messages.length - 1];
      if (lastMessage.sender === "ai") {
        // 实时处理思考内容
        if (lastMessage.content.includes("<think>")) {
          scrollToBottom();
        }
      }
    }
  }
);

// 在组件挂载时启动打字动画并滚动到底部
let typingInterval: ReturnType<typeof setInterval> | null = null;
onMounted(() => {
  typingInterval = updateTypingDots();
  scrollToBottom(); // 初始化时滚动到底部
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
    // TODO: 可以添加一个复制成功的提示
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
  // TODO: 实现喜欢消息的逻辑
  console.log("喜欢消息:", message);
};

// 不喜欢消息
const dislikeMessage = (message: any) => {
  // TODO: 实现不喜欢消息的逻辑
  console.log("不喜欢消息:", message);
};

// 添加默认导出
defineOptions({
  name: "ChatArea",
});

const expandedGroups = ref({
  today: true,
  yesterday: true,
  earlier: true,
});
</script>

<template>
  <!--  class="chat-area-container" -->
  <div>
    <ChatLayout />
  </div>
</template>

<style lang="scss" scoped>
.chat-area-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f8f9fa;
  overflow: hidden;
}
</style>
