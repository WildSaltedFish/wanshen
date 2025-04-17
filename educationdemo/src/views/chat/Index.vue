<!--
 * @Author: bc_ax 1542650614@qq.com
 * @Date: 2025-04-10 12:08:19
 * @LastEditors: bc_ax 1542650614@qq.com
 * @LastEditTime: 2025-04-16 17:07:15
 * @FilePath: \report_platform\src\views\wanzhi\advisory\ai-assistant\Index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: bc-ax 1542650614@qq.com
 * @Description: AI助手组件
-->
<script setup lang="ts">
import { defineComponent } from 'vue'
import Sidebar from '@/components/chat/ChatSidebar.vue'
import ChatArea from '@/components/chat/ChatLayout.vue'
import Welcome from '@/components/chat/WelcomeScreen.vue'
defineComponent({
  name: 'AIAssistant',
  components: {
    Sidebar,
    ChatArea
  }
})
</script>

<template>
  <div class="chat-container">
    <Sidebar class="sidebar" />
    <!-- <Welcome class="welcome" /> -->
    <router-view />
    <!-- <ChatArea class="chat-area" :messages="[]" /> -->
  </div>
</template>

<style scoped>
.chat-container {
  display: flex;
  height: 100%;
  width: 100%;
  padding: 10px 20px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.06);
}

.sidebar {
  width: 280px;
  min-width: 280px;
  max-width: 280px;
  background-color: #2c3e50;
  color: white;
  transition: width 0.3s ease;
  height: 100%;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 60px;
  min-width: 60px;
  max-width: 60px;
}

.chat-area {
  flex: 1;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  min-width: 0;
}

@media (max-width: 768px) {
  .sidebar {
    position: absolute;
    z-index: 1000;
    width: 60px;
    min-width: 60px;
    max-width: 60px;
  }

  .sidebar.expanded {
    width: 280px;
    min-width: 280px;
    max-width: 280px;
  }

  .chat-area {
    margin-left: 60px;
  }
}
</style>