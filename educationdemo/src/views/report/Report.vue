<script setup lang="ts">
import { ref } from 'vue';
import ChatLayout from '../../components/ChatLayout.vue';

defineOptions({
  name: 'Report',
});
</script>

<template>
  <div class="report-view">
    <ChatLayout 
      :show-new-chat-button="true"
      :show-header="true"
    />
  </div>
</template>

<style lang="scss" scoped>
.report-view {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style> 