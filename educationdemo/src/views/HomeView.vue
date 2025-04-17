<script setup lang="ts">
import Sidebar from "../components/Sidebar.vue";
import ChatArea from "../components/ChatArea.vue";
</script>

<template>
  <div class="app-container">
    <Sidebar class="sidebar" />
    <ChatArea class="chat-area" />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
