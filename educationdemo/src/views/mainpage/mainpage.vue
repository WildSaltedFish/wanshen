<template>
    <!-- 顶部标题区 -->
    <div class="app">
      <!-- 全新设计的标题区 -->
      <div class="modern-header">
        <div class="header-content">
          <div class="logo-container">
            <span class="main-logo">万申</span>
            <span class="sub-logo">智能AI系统</span>
          </div>
          <div class="header-decoration">
            <div class="decoration-circle circle-1"></div>
            <div class="decoration-circle circle-2"></div>
            <div class="decoration-circle circle-3"></div>
          </div>
        </div>
        <div class="header-wave">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>

    <!-- 主要内容区 -->
    <div class="ins-content">
      <div v-for="(row, rowIndex) in categorylist" :key="rowIndex" class="ins-category">
        <h2 class="ins-category-title">{{ row.title }}</h2>
        <div class="ins-card-grid">
          <div
              v-for="item in row.items"
              :key="item.index"
              class="ins-card"
              @click="handleModelSelect(item.label)"
          >
            <div class="ins-card-image-container">
              <img :src="item.img" :alt="item.label" class="ins-card-image" />
            </div>
            <div class="ins-card-content">
              <h3 class="ins-card-title">{{ truncatedLabel(item.label) }}</h3>
              <p class="ins-card-description">{{ truncatedLabel(item.description) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import chatroomListData from "../../assets/json/chatroomList.json";
import { useChatStore } from "../../stores/chat";

export default defineComponent({
  name: "InsStyleMainPage",

  setup() {
    const chatStore = useChatStore();
    const router = useRouter();
    const categorylist = ref(chatroomListData.list);

    const handleModelSelect = (title: string) => {
      console.log("选择了:", title);
      chatStore.currentTheme = title;
      console.log("当前:", chatStore.currentTheme);
      chatStore.startNewChat();
      router.push("/chat");
    };

    onMounted(() => {
      categorylist.value = chatroomListData.list;
    });

    return {
      categorylist,
      handleModelSelect,
    };
  },
  computed: {
    truncatedLabel() {
      return (label: string) => {
        return label.length > 20 ? label.slice(0, 20) + "..." : label;
      };
    },
  },
});
</script>

<style>
/* Ins风格主题变量 */
:root {
  --ins-pink: #FF9AA2;
  --ins-light-pink: #FFB7B2;
  --ins-peach: #FFDAC1;
  --ins-mint: #E2F0CB;
  --ins-dark: #191970;
  --ins-white: #FFFFFF;
  --ins-gray: #F5F5F5;
  --ins-light-gray: #FAFAFA;
  --ins-text: #333333;
  --ins-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.ins-app {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  background-color: var(--ins-light-gray);
  min-height: 100vh;
}

/* 头部样式 */
.ins-header {
  background: linear-gradient(45deg,
  rgba(11, 51, 217, 0.6),
  rgba(237, 187, 216, 0.9),
  rgba(215, 234, 255, 0));
  padding: 40px 60px 0;
  position: relative;
}

.ins-title-area {
  text-align: left;
  padding-bottom: 40px;
}

.ins-main-title {
  font-size: 50px;
  font-weight: 900;
  color: var(--ins-dark);
  margin: 0;
  line-height: 1.2;
}

.ins-subtitle {
  font-size: 40px;
  font-weight: 700;
  color: var(--ins-white);
  margin: 10px 0 0;
}

.ins-header-gradient {
  width: 100%;
  height: 80px;
  background: linear-gradient(to bottom, rgba(0,0,0,0), var(--ins-light-gray));
}

/* 内容区样式 */
.ins-content {
  padding: 20px 60px 60px;
}

.ins-category {
  margin-bottom: 40px;
}

.ins-category-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--ins-dark);
  margin: 30px 0 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--ins-peach);
}

/* 卡片网格布局 */
.ins-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* 卡片样式 */
.ins-card {
  background: var(--ins-white);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--ins-shadow);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.ins-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.ins-card-image-container {
  height: 160px;
  overflow: hidden;
}

.ins-card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.ins-card:hover .ins-card-image {
  transform: scale(1.05);
}

.ins-card-content {
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.ins-card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--ins-text);
  margin: 0 0 8px;
}

.ins-card-description {
  font-size: 14px;
  color: #666;
  margin: 0;
  flex-grow: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ins-header {
    padding: 30px 20px 0;
  }

  .ins-main-title {
    font-size: 36px;
  }

  .ins-subtitle {
    font-size: 28px;
  }

  .ins-content {
    padding: 20px;
  }

  .ins-card-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

@media (max-width: 480px) {
  .ins-card-grid {
    grid-template-columns: 1fr;
  }
}

.modern-header {
  position: relative;
  background: linear-gradient(135deg, #3f60e3 0%, rgba(31, 72, 241, 0.79) 100%);
  color: white;
  padding: 40px 0 0;
  overflow: hidden;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 60px;
  position: relative;
  z-index: 2;
}

.logo-container {
  padding-bottom: 60px;
}

.main-logo {
  display: block;
  font-size: 72px;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 10px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.sub-logo {
  display: block;
  font-size: 32px;
  font-weight: 500;
  opacity: 0.9;
  text-align: center;
}

.header-decoration {
  position: absolute;
  right: 60px;
  top: 40px;
}

.decoration-circle {
  border-radius: 50%;
  position: absolute;
  opacity: 0.2;
}

.circle-1 {
  width: 120px;
  height: 120px;
  background: #ffffff;
  top: -40px;
  right: -20px;
}

.circle-2 {
  width: 80px;
  height: 80px;
  background: #ff9a9e;
  top: 20px;
  right: 100px;
}

.circle-3 {
  width: 60px;
  height: 60px;
  background: #fbc2eb;
  top: 60px;
  right: 40px;
}

.header-wave {
  height: 120px;
  width: 100%;
  color: white;
  transform: rotate(180deg);
}

.header-wave svg {
  display: block;
  width: 100%;
  height: 100%;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .header-content {
    padding: 0 30px;
  }

  .main-logo {
    font-size: 48px;
  }

  .sub-logo {
    font-size: 24px;
  }

  .header-decoration {
    right: 30px;
    top: 30px;
  }

  .circle-1 {
    width: 80px;
    height: 80px;
  }

  .circle-2 {
    width: 50px;
    height: 50px;
  }

  .circle-3 {
    width: 40px;
    height: 40px;
  }
}
</style>
