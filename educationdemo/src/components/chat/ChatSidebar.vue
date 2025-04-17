<script setup lang="ts">
import { ref } from "vue";
import { useChatStore } from "@/stores/chat";
import { useRouter } from "vue-router";

const chatStore = useChatStore();
const router = useRouter();

const expandedGroups = ref({
  today: true,
  yesterday: true,
  earlier: true,
});

const modelSelectorExpanded = ref(true);
const toggleModelSelector = () => {
  modelSelectorExpanded.value = !modelSelectorExpanded.value;
};
const toggleGroup = (group: string) => {
  expandedGroups.value[group] = !expandedGroups.value[group];
};
const handleChatSelect = (chatId: string) => {
  chatStore.selectChat(chatId);
  router.push("/chat");
};
const handleNewChat = () => {
  chatStore.setCurrentModel("护理");
  chatStore.startNewChat();
};
const goToWelcome = () => {
  router.push("/welcome");
};
</script>
<template>
  <div class="chat-interface-left">
    <div class="ai-title">
      <div class="ai-title-content">
        <span>AI模型</span>
      </div>
    </div>
    <!-- 模型选择 -->
    <div class="model-selector">
      <div class="model-selector-header" @click="toggleModelSelector">
        <el-icon class="group-arrow" :class="{ 'is-expanded': modelSelectorExpanded }">
          <caret-right />
        </el-icon>
        模型选择
      </div>
      <div v-if="modelSelectorExpanded" class="model-selector-content">
        <div class="model-type-selector">
          <label class="radio-label">
            <input type="radio" name="modelType" :value="false" v-model="chatStore.useLocalModel" @change="chatStore.setUseLocalModel(false)" />
            云端模型
          </label>
          <label class="radio-label">
            <input type="radio" name="modelType" :value="true" v-model="chatStore.useLocalModel" @change="chatStore.setUseLocalModel(true)" />
            本地模型
          </label>
        </div>
        <select v-if="!chatStore.useLocalModel" v-model="chatStore.currentModelId" @change="chatStore.setCurrentModel($event.target.value)" class="model-select">
          <option v-for="model in chatStore.AVAILABLE_MODELS" :key="model.id" :value="model.id">{{ model.name }}</option>
        </select>
        <select v-else v-model="chatStore.currentLocalModelId" @change="chatStore.setCurrentLocalModel($event.target.value)" class="model-select">
          <option v-for="model in chatStore.LOCAL_MODELS" :key="model.id" :value="model.id">{{ model.name }}</option>
        </select>
        <div class="model-description">
          {{
            chatStore.useLocalModel
              ? chatStore.LOCAL_MODELS.find((m) => m.id === chatStore.currentLocalModelId)?.description
              : chatStore.AVAILABLE_MODELS.find((m) => m.id === chatStore.currentModelId)?.description
          }}
        </div>
      </div>
    </div>
    <div class="explore-btn" @click="goToWelcome">
      <span class="icon">🔍</span>
      <span class="text">探索功能</span>
    </div>
    <div class="new-chat-btn" @click="handleNewChat">
      <span class="icon">+</span>
      <span class="text">新建聊天</span>
    </div>
    <div class="chat-list-container">
      <div v-if="chatStore.groupedChats.today.length > 0" class="chat-group">
        <div class="group-header" @click="toggleGroup('today')">
          <el-icon class="group-arrow" :class="{ 'is-expanded': expandedGroups.today }">
            <caret-right />
          </el-icon>
          今天
        </div>
        <div v-if="expandedGroups.today" class="chat-items">
          <div v-for="chat in chatStore.groupedChats.today" :key="chat.id" class="chat-item" :class="{ active: chatStore.currentChatId === chat.id }" @click="handleChatSelect(chat.id)">
            <div class="chat-icon">💬</div>
            <div class="chat-info">
              <div class="chat-title">{{ chat.title }}</div>
              <div class="chat-preview">{{ chat.preview }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="chatStore.groupedChats.yesterday.length > 0" class="chat-group">
        <div class="group-header" @click="toggleGroup('yesterday')">
          <el-icon class="group-arrow" :class="{ 'is-expanded': expandedGroups.yesterday }">
            <caret-right />
          </el-icon>
          昨天
        </div>
        <div v-if="expandedGroups.yesterday" class="chat-items">
          <div v-for="chat in chatStore.groupedChats.yesterday" :key="chat.id" class="chat-item" :class="{ active: chatStore.currentChatId === chat.id }" @click="handleChatSelect(chat.id)">
            <div class="chat-icon">💬</div>
            <div class="chat-info">
              <div class="chat-title">{{ chat.title }}</div>
              <div class="chat-preview">{{ chat.preview }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="chatStore.groupedChats.earlier.length > 0" class="chat-group">
        <div class="group-header" @click="toggleGroup('earlier')">
          <el-icon class="group-arrow" :class="{ 'is-expanded': expandedGroups.earlier }">
            <caret-right />
          </el-icon>
          更早
        </div>
        <div v-if="expandedGroups.earlier" class="chat-items">
          <div v-for="chat in chatStore.groupedChats.earlier" :key="chat.id" class="chat-item" :class="{ active: chatStore.currentChatId === chat.id }" @click="handleChatSelect(chat.id)">
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
</template>