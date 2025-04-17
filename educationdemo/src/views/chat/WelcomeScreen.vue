<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const startChat = () => {
  router.push('/chat')
}
</script>

<template>
  <div class="welcome-screen">
    <div class="welcome-content">
      <h1>欢迎使用 AI 助手</h1>
      <p>开始一段智能对话，探索无限可能</p>
      <div class="features">
        <div class="feature-item">
          <h3>智能对话</h3>
          <p>与 AI 进行自然、流畅的对话交流</p>
        </div>
        <div class="feature-item">
          <h3>知识探索</h3>
          <p>获取丰富的知识内容，拓展认知边界</p>
        </div>
        <div class="feature-item">
          <h3>高效协作</h3>
          <p>提供智能建议，提升工作效率</p>
        </div>
      </div>
      <button class="start-button" @click="startChat">开始对话</button>
    </div>
  </div>
</template>

<style scoped>
.welcome-screen {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a2a3a 0%, #2c3e50 100%);
  color: #fff;
}

.welcome-content {
  text-align: center;
  max-width: 800px;
  padding: 2rem;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #F59520, #ff7b00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

p {
  font-size: 1.2rem;
  color: #ccc;
  margin-bottom: 3rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
}

.feature-item {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  transition: transform 0.3s;
}

.feature-item:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.1);
}

.feature-item h3 {
  color: #F59520;
  margin-bottom: 1rem;
}

.feature-item p {
  font-size: 1rem;
  margin-bottom: 0;
}

.start-button {
  background: #F59520;
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s;
}

.start-button:hover {
  background: #ff7b00;
  transform: scale(1.05);
}
</style> 