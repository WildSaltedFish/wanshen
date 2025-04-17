<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const startChat = () => {
  router.push("/chat");
};

// 添加默认导出
defineOptions({
  name: "WelcomeScreen",
});
</script>

<template>
  <div class="welcome-screen">
    <div class="welcome-content">
      <h1>欢迎使用数字人模拟面试</h1>
      <p class="subtitle">实时数字人面试官模拟面试，探索无限可能</p>
      <div class="features">
        <div class="feature-item">
          <div class="feature-icon">💬</div>
          <h3>智能面试</h3>
          <p>与 AI面试官 进行自然、流畅的对话交流</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🔍</div>
          <h3>专业探索</h3>
          <p>获取丰富的专业知识，拓展认知边界</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">⚡</div>
          <h3>高效总结</h3>
          <p>提供智能建议，提升面试成功率</p>
        </div>
      </div>
      <button class="start-button">正在开发中，敬请期待</button>
    </div>
  </div>
</template>

<style scoped>
.welcome-screen {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  color: #333;
  padding: 20px;
}

.welcome-content {
  text-align: center;
  max-width: 1000px;
  padding: 2rem;
}

h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #2c3e50;
  font-weight: bold;
}

.subtitle {
  font-size: 1.4rem;
  color: #666;
  margin-bottom: 4rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  margin-bottom: 4rem;
}

.feature-item {
  padding: 2rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.feature-item h3 {
  color: #2c3e50;
  font-size: 1.4rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.feature-item p {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0;
}

.start-button {
  background: #f59520;
  color: white;
  border: none;
  padding: 1.2rem 3rem;
  font-size: 1.3rem;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(245, 149, 32, 0.3);
}

.start-button:hover {
  background: #ff7b00;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 149, 32, 0.4);
}

@media (max-width: 768px) {
  .features {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  h1 {
    font-size: 2.2rem;
  }

  .subtitle {
    font-size: 1.2rem;
    margin-bottom: 3rem;
  }

  .feature-item {
    padding: 1.5rem;
  }
}
</style>
