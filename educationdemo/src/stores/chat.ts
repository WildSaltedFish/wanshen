import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { Ollama } from "ollama";
import axios from "axios";

// 创建自定义的 SSE 解析器
const createParser = (
  onMessage: (event: { type: string; text?: string }) => void
) => {
  const decoder = new TextDecoder();
  let buffer = "";

  const processLine = (line: string) => {
    if (line.startsWith("data: ")) {
      const data = line.slice(6);
      if (data === "[DONE]") {
        onMessage({ type: "done" });
        return;
      }
      try {
        const json = JSON.parse(data);
        if (json.choices?.[0]?.delta?.content) {
          onMessage({ type: "text", text: json.choices[0].delta.content });
        }
      } catch (e) {
        console.error("Error parsing SSE message:", e);
      }
    }
  };

  return {
    feed(chunk: Uint8Array) {
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        processLine(line.trim());
      }
    },
    done() {
      if (buffer) {
        processLine(buffer.trim());
      }
    },
  };
};

// SiliconFlow API 配置
const API_KEY = "sk-lygsmdevavjnjnlizkxxyvfdvvqclkhhcqljrcvkdiwpfljm";
const API_URL = "http://127.0.0.1:5001/questions/v3/护理/";

// 可选模型列表
export const AVAILABLE_MODELS = [
  {
    id: "deepseek-ai/DeepSeek-R1",
    name: "DeepSeek-R1",
    description: "功能最强大的模型",
  },
  {
    id: "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",
    name: "DeepSeek-R1-Distill-Qwen-7B",
    description: "轻量级模型",
  },
  {
    id: "Qwen/Qwen2.5-7B-Instruct",
    name: "Qwen2.5-7B",
    description: "通义千问2.5",
  },
] as const;

export const LOCAL_MODELS = [
  {
    id: "deepseek-r1:1.5b",
    name: "DeepSeek-R1",
    description: "Ollama本地部署版本",
  },
] as const;

// 消息类型
export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: number;
  status?: "sending" | "sent" | "error" | "typing";
  hasShownPanel?: boolean; // 标记是否已显示过侧边栏面板
}

// 聊天类型
export interface Chat {
  id: string;
  title: string;
  preview: string;
  timestamp: number;
  messages: Message[];
  modelId: string;
}

// 调用 SiliconFlow API
async function callChatAPI(
  messages: { role: string; content: string }[],
  modelId: string
): Promise<string> {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelId,
        messages: messages,
        stream: false,
        max_tokens: 512,
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        frequency_penalty: 0.5,
        n: 1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `API调用失败: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("API调用错误:", error);
    throw new Error("AI响应出错，请稍后重试。");
  }
}

export const useChatStore = defineStore("chat", () => {
  // 状态
  const chats = ref<Chat[]>([]);
  const currentChatId = ref<string | null>(null);
  const currentModelId = ref(AVAILABLE_MODELS[0].id);
  const currentTheme = ref<string | null>(null);

  const useLocalModel = ref(false); // 默认使用云端模型
  const currentLocalModelId = ref(LOCAL_MODELS[0].id);

  // 计算属性
  const currentChat = computed(() =>
    currentChatId.value
      ? chats.value.find((chat) => chat.id === currentChatId.value)
      : null
  );

  const messages = computed(() => currentChat.value?.messages || []);

  const groupedChats = computed(() => {
    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();
    const yesterday = today - 24 * 60 * 60 * 1000;

    return {
      today: chats.value.filter((chat) => chat.timestamp >= today),
      yesterday: chats.value.filter(
        (chat) => chat.timestamp >= yesterday && chat.timestamp < today
      ),
      earlier: chats.value.filter((chat) => chat.timestamp < yesterday),
    };
  });

  // 方法
  const generateId = () => Math.random().toString(36).substring(2, 15);

  const createNewChat = () => {
    const chatId = generateId();
    const newChat: Chat = {
      id: chatId,
      title: "新对话",
      preview: "",
      timestamp: Date.now(),
      messages: [],
      modelId: currentModelId.value,
    };
    chats.value.unshift(newChat);
    return chatId;
  };

  const startNewChat = () => {
    const chatId = createNewChat();
    currentChatId.value = chatId;
  };

  const selectChat = (chatId: string) => {
    const chat = chats.value.find((c) => c.id === chatId);
    if (chat) {
      currentChatId.value = chatId;
      currentModelId.value = chat.modelId;
    }
  };
  const setCurrentModel = (modelId: string) => {
    currentModelId.value = modelId;
    if (currentChat.value) {
      currentChat.value.modelId = modelId;
    }
  };

  const updateChatPreview = (chatId: string, lastMessage: string) => {
    const chat = chats.value.find((c) => c.id === chatId);
    if (chat) {
      chat.preview =
        lastMessage.slice(0, 50) + (lastMessage.length > 50 ? "..." : "");
    }
  };

  const setUseLocalModel = (value: boolean) => {
    useLocalModel.value = value;
    if (currentChat.value) {
      if (value) {
        currentModelId.value = currentLocalModelId.value;
      } else {
        currentModelId.value = AVAILABLE_MODELS[0].id;
      }
      currentChat.value.modelId = currentModelId.value;
    }
  };

  const setCurrentLocalModel = (modelId: string) => {
    currentLocalModelId.value = modelId;
    if (useLocalModel.value && currentChat.value) {
      currentModelId.value = modelId;
      currentChat.value.modelId = modelId;
    }
  };

  // 发送消息
  const sendMessage = async (content: string) => {
    if (!currentChat.value) {
      currentChatId.value = createNewChat();
    }

    // 添加用户消息
    const userMessageId = generateId();
    const userMessage: Message = {
      id: userMessageId,
      content,
      sender: "user",
      timestamp: Date.now(),
    };
    currentChat.value!.messages.push(userMessage);
    updateChatPreview(currentChat.value!.id, content);

    // 添加AI消息（初始状态为typing）
    const aiMessageId = generateId();
    const aiMessage: Message = {
      id: aiMessageId,
      content: "",
      sender: "ai",
      timestamp: Date.now(),
      status: "typing",
    };
    currentChat.value!.messages.push(aiMessage);

    // try {
    // if (useLocalModel.value) {
    //   // 使用 ollama 库处理本地模型
    //   const ollama = new Ollama({ host: "http://localhost:11434" });

    //   const stream = await ollama.chat({
    //     model: currentLocalModelId.value,
    //     messages: [{ role: "user", content }],
    //     stream: true,
    //   });

    //   for await (const chunk of stream) {
    //     const currentMessage = currentChat.value!.messages.find(
    //       (m) => m.id === aiMessageId
    //     );
    //     if (currentMessage) {
    //       currentMessage.content += chunk.message.content;
    //       currentMessage.status = "typing";
    //     }
    //   }

    //   // 完成后更新状态
    //   const finalMessage = currentChat.value!.messages.find(
    //     (m) => m.id === aiMessageId
    //   );
    //   if (finalMessage) {
    //     finalMessage.status = "sent";
    //     updateChatPreview(currentChat.value!.id, finalMessage.content);
    //   }
    // } else {
    // 云端模型处理
    const apiUrl = API_URL;
    try {
      const response = await axios.get(
        "/api/questions/v3/" +
          `${currentTheme.value ? currentTheme.value : "all"}` +
          "/" +
          `${content}`
      );
      console.log("Response:", response.data);
      for await (const chunk of response.data) {
        const currentMessage = currentChat.value!.messages.find(
          (m) => m.id === aiMessageId
        );
        if (currentMessage) {
          currentMessage.content += chunk;
          currentMessage.status = "typing";
        }
      }

      // 完成后更新状态
      const finalMessage = currentChat.value!.messages.find(
        (m) => m.id === aiMessageId
      );
      if (finalMessage) {
        finalMessage.status = "sent";
        updateChatPreview(currentChat.value!.id, finalMessage.content);
      }
      // answer: response.data,
    } catch (error) {
      console.error("Error:", error);
      alert("查询失败，请检查网络连接");
    } finally {
    }

    // const headers: Record<string, string> = {
    //   "Content-Type": "application/json",
    //   Authorization: `Bearer ${API_KEY}`,
    // };

    // const requestBody = {
    //   model: currentChat.value!.modelId,
    //   messages: [{ role: "user", content }],
    //   stream: true,
    //   max_tokens: 512,
    //   temperature: 0.7,
    //   top_p: 0.95,
    //   top_k: 50,
    //   frequency_penalty: 0,
    //   n: 1,
    // };

    // const response = await fetch(apiUrl, {
    //   method: "POST",
    //   headers,
    //   body: JSON.stringify(requestBody),
    // });

    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }

    // const parser = createParser((event) => {
    //   if (event.type === "done") {
    //     const finalMessage = currentChat.value!.messages.find(
    //       (m) => m.id === aiMessageId
    //     );
    //     if (finalMessage) {
    //       finalMessage.status = "sent";
    //       updateChatPreview(currentChat.value!.id, finalMessage.content);
    //     }
    //     return;
    //   }

    //   if (event.type === "text") {
    //     const currentMessage = currentChat.value!.messages.find(
    //       (m) => m.id === aiMessageId
    //     );
    //     if (currentMessage) {
    //       currentMessage.content += event.text;
    //       currentMessage.status = "typing";
    //     }
    //   }
    // });

    // for await (const chunk of response.body as any) {
    //   parser.feed(chunk);
    // }
    // }
    // }
    // catch (error) {
    //   console.error("Error sending message:", error);
    //   const errorMessage = currentChat.value!.messages.find(
    //     (m) => m.id === aiMessageId
    //   );
    //   if (errorMessage) {
    //     errorMessage.status = "error";
    //     errorMessage.content = "消息发送失败，请重试";
    //   }
    // }
  };

  // 重新生成回复
  const regenerateResponse = async (message: Message) => {
    if (!currentChat.value) return;

    const messageIndex = currentChat.value.messages.findIndex(
      (m) => m.id === message.id
    );
    if (messageIndex === -1) return;

    // 找到上一条用户消息
    let userMessageContent = "";
    for (let i = messageIndex - 1; i >= 0; i--) {
      if (currentChat.value.messages[i].sender === "user") {
        userMessageContent = currentChat.value.messages[i].content;
        break;
      }
    }

    if (!userMessageContent) return;

    // 删除当前AI消息
    currentChat.value.messages.splice(messageIndex, 1);

    // 重新发送消息
    await sendMessage(userMessageContent);
  };

  return {
    chats,
    currentChatId,
    currentModelId,
    currentChat,
    messages,
    groupedChats,
    AVAILABLE_MODELS,
    LOCAL_MODELS,
    useLocalModel,
    currentLocalModelId,
    currentTheme,
    startNewChat,
    selectChat,
    sendMessage,
    setCurrentModel,
    setUseLocalModel,
    setCurrentLocalModel,
    regenerateResponse,
  };
});
