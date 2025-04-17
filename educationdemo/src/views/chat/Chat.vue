<!--
 * @Author: bc-ax 1542650614@qq.com
 * @Date: 2025-03-19 16:39:16
 * @LastEditors: bc_ax 1542650614@qq.com
 * @LastEditTime: 2025-04-16 18:21:02
 * @FilePath: \demo\src\views\chat\Chat.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="chat-view">
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
.chat-view {
  width: 100%;
  // height: 100vh;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style> 