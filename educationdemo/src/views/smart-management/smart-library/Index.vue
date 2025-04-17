<template>
  <div class="ai-library">
    <!-- 智能搜索区 -->
    <header class="glass-header">
      <div class="header-content">
        <h1 class="neon-title">
          <span class="gradient-text">AI</span>智能图书馆
          <div class="title-line"></div>
        </h1>

        <div class="search-container">
          <el-input
              v-model="searchText"
              placeholder="输入关键词或描述你的需求..."
              class="smart-search"
          >
            <template #prefix>
              <el-icon class="search-icon"><Search /></el-icon>
            </template>
            <template #suffix>
              <el-button type="primary" class="ai-search-btn">
                <el-icon><MagicStick /></el-icon>
                智能搜索
              </el-button>
            </template>
          </el-input>
        </div>
      </div>
    </header>

    <!-- 推荐书墙 -->
    <main class="book-wall">
      <div
          v-for="(book, index) in books"
          :key="book.id"
          class="book-card"
          :style="{ '--delay': index * 0.1 + 's' }"
      >
        <div class="card-inner">
          <!-- 封面面 -->
          <div class="card-front glass-layer">
            <div class="deco-line" :style="{ background: book.color }"></div>
            <img :src="book.cover" class="book-cover" />
            <div class="book-info">
              <h3>{{ book.title }}</h3>
              <el-tag class="ai-tag" :style="{
                backgroundColor: book.color + '20',
                color: book.color
              }">
                AI推荐 {{ book.score }}%
              </el-tag>
            </div>
          </div>

          <!-- 简介面 -->
          <div class="card-back glass-layer">
            <div class="ai-summary">
              <h4>AI智能简介</h4>
              <p>{{ book.summary }}</p>
              <div class="tags">
                <el-tag
                    v-for="tag in book.tags"
                    :key="tag"
                    :color="stringToColor(tag)"
                    effect="dark"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 推荐气泡 -->
    <div class="recommend-bubble glass-layer">
      <div class="bubble-content">
        <el-icon class="bubble-icon"><ChatLineRound /></el-icon>
        <span>试试问我："{{ randomQuestion }}"</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search, MagicStick, ChatLineRound } from '@element-plus/icons-vue'

// 静态展示数据
const books = ref([
  {
    id: 1,
    title: '人工智能基础',
    cover: 'https://dummyimage.com/300x400/4ECDC4/fff',
    score: 92,
    color: '#4ECDC4',
    summary: '系统讲解机器学习核心算法与深度学习基本原理，适合零基础学者快速构建知识体系',
    tags: ['机器学习', '入门必读', '算法解析']
  },
  {
    id: 2,
    title: 'Python深度学习',
    cover: 'https://dummyimage.com/300x400/FF6B6B/fff',
    score: 88,
    color: '#FF6B6B',
    summary: '结合TensorFlow实战案例，详解神经网络构建与优化技巧，配备行业级项目实战',
    tags: ['深度学习', '实战指南', 'Python']
  }
])

const randomQuestion = ref('推荐适合初学者的AI书籍')
const searchText = ref('')

// 颜色生成工具
const stringToColor = (str) => {
  const colors = ['#4566d1', '#4ECDC4', '#45B7D1', '#96CEB4']
  const index = Math.abs(str.split('').reduce((a,b) => a + b.charCodeAt(), 0)) % colors.length
  return colors[index]
}

</script>

<style lang="scss">
.ai-library {
  --primary: #4566d1;
  --secondary: rgb(69, 183, 209);
  --glass-bg: rgba(255, 255, 255, 0.9);
  min-height: 100vh;
  background: linear-gradient(150deg, #f0f9ff 0%, #fce8f4 100%);
  padding: 2rem;

  .glass-header {
    backdrop-filter: blur(12px);
    background: var(--glass-bg);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    margin-bottom: 3rem;

    .neon-title {
      font-size: 2.5rem;
      position: relative;
      margin-bottom: 2rem;

      .gradient-text {
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .title-line {
        width: 60px;
        height: 4px;
        background: var(--secondary);
        margin-top: 1rem;
        border-radius: 2px;
      }
    }

    .smart-search {
      :deep(.el-input__inner) {
        height: 50px;
        border-radius: 30px;
        padding-left: 50px;
        font-size: 1.1rem;
        transition: all 0.3s ease;

        &:focus {
          border-color: var(--primary);
          box-shadow: 0 0 15px rgba(78, 205, 196, 0.2);
        }
      }

      .ai-search-btn {
        height: 40px;
        padding: 0 25px;
        border-radius: 20px;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        transition: transform 0.3s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
        }
      }
    }
  }

  .book-wall {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    padding: 0 2rem;

    .book-card {
      perspective: 1000px;
      height: 400px;
      cursor: pointer;

      .card-inner {
        position: relative;
        width: 100%;
        height: 100%;
        transition: transform 0.6s ease;
        transform-style: preserve-3d;

        &:hover {
          transform: rotateY(10deg) rotateX(-5deg) translateY(-10px);
        }
      }

      .glass-layer {
        backdrop-filter: blur(12px);
        background: var(--glass-bg);
        border-radius: 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      }

      .card-front {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;

        .deco-line {
          height: 4px;
          width: 40px;
          border-radius: 2px;
          margin-bottom: 1rem;
        }

        .book-cover {
          height: 200px;
          width: auto;
          text-align: center;
          flex: 1;
          object-fit: cover;
          border-radius: 12px;
          margin-bottom: 1rem;
          transition: transform 0.3s ease;
        }

        .ai-tag {
          align-self: flex-start;
          border: none;
          font-weight: bold;
          letter-spacing: 1px;
        }
      }

      .card-back {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        padding: 2rem;
        transform: rotateY(180deg);

        .ai-summary {
          height: 100%;
          display: flex;
          flex-direction: column;

          h4 {
            color: var(--primary);
            margin-bottom: 1rem;
          }

          .tags {
            margin-top: auto;
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
          }
        }
      }
    }
  }

  .recommend-bubble {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    padding: 1rem 2rem;
    border-radius: 30px;
    display: flex;
    align-items: center;
    animation: float 3s ease-in-out infinite;

    .bubble-icon {
      color: var(--primary);
      font-size: 1.5rem;
      margin-right: 1rem;
    }
  }
}

@keyframes float {
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
}
</style>
