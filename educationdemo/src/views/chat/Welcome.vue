<template>
  <div class="welcome-view">
    <ChatLayout 
      :show-new-chat-button="true"
      :show-header="true"
    />
  </div>
</template>

<script setup lang="ts">
import ChatLayout from '../../components/ChatLayout.vue';
</script>

<style lang="scss" scoped>
.welcome-view {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}
</style> 