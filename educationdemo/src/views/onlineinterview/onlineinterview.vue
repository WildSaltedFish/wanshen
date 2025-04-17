<template>
  <div class="quiz-container">
    <!-- 头部区域 -->
    <div class="quiz-header">
      <h1>编程能力测评</h1>
      <div class="progress-bar">
        <div
            class="progress-fill"
            :style="{ width: (currentQuestionIndex + 1) / questions.length * 100 + '%' }"
        ></div>
      </div>
    </div>

    <!-- 题目区域 -->
    <div v-if="!submitted" class="question-wrapper">
      <!-- 视频区域 -->
      <div class="video-wrapper">
        <video
            class="question-video"
            :src="questions[currentQuestionIndex].videoUrl"
            controls
            autoplay
            muted
        ></video>
      </div>

      <!-- 题目内容 -->
      <div class="question-card">
        <div class="question-header">
          <span class="question-number">题目 {{ currentQuestionIndex + 1 }}</span>
          <span class="question-tag">Java基础</span>
        </div>
        <p class="question-text">{{ questions[currentQuestionIndex].text }}</p>

        <!-- 选项区域 -->
        <div class="options-grid">
          <label
              v-for="(option, idx) in questions[currentQuestionIndex].options"
              :key="idx"
              class="option-card"
              :class="{ 'selected': questions[currentQuestionIndex].selectedAnswer === option }"
          >
            <input
                v-model="questions[currentQuestionIndex].selectedAnswer"
                type="radio"
                :value="option"
                :name="'question-' + currentQuestionIndex"
                class="hidden-radio"
            />
            <span class="option-marker"></span>
            <span class="option-text">{{ option }}</span>
          </label>
        </div>

        <!-- 导航按钮 -->
        <div class="nav-buttons">
          <button
              class="nav-btn prev-btn"
              :disabled="currentQuestionIndex === 0"
              @click="goToPreviousQuestion"
          >
            ← 上一题
          </button>
          <button
              v-if="currentQuestionIndex < questions.length - 1"
              class="nav-btn next-btn"
              @click="goToNextQuestion"
          >
            下一题 →
          </button>
          <button
              v-else
              class="submit-btn"
              @click="submitAnswers"
          >
            🎯 提交答案
          </button>
        </div>
      </div>
    </div>

    <!-- 结果区域 -->
    <div v-if="submitted" class="result-wrapper">
      <div class="score-card">
        <h2>测评结果</h2>
        <div class="score-circle">
          <span class="score-number">{{ score }}</span>
          <span class="score-total">/ {{ questions.length }}</span>
        </div>
        <div class="score-message">
          {{ score === questions.length ? '🎉 完美通关！' : '💪 继续加油！' }}
        </div>
      </div>

      <div class="wrong-answers">
        <h3>错题解析（{{ questions.length - score }}）</h3>
        <div
            v-for="(question, index) in questions"
            :key="index"
            class="wrong-card"
            v-if="question.selectedAnswer !== question.correctAnswer"
        >
          <div class="wrong-header">
            <span class="wrong-number">题目 {{ index + 1 }}</span>
            <span class="wrong-status">❌ 回答错误</span>
          </div>
          <p class="wrong-question">{{ question.text }}</p>
          <div class="answer-comparison">
            <div class="answer-box your-answer">
              <span>你的答案</span>
              <span class="answer-text">{{ question.selectedAnswer ?? "未选择" }}</span>
            </div>
            <div class="answer-box correct-answer">
              <span>正确答案</span>
              <span class="answer-text">{{ question.correctAnswer }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // 数据部分保持不变
  data() {
    return {
      questions: [
        {
          text: "Java中，哪个关键字可以用来声明一个只读的常量？",
          options: ["static", "final", "const", "readonly"],
          selectedAnswer: null,
          correctAnswer: "final",
          videoUrl:
              "http://10.88.188.21:9000/videos/Java中，哪个关键字可以用来声明一个只读的常量？.mp4",
        },
        {
          text: "在Java中，下列哪个类是所有Java类的根类？",
          options: [
            "java.lang.Object",
            "java.lang.Class",
            "java.lang.String",
            "java.lang.System",
          ],
          selectedAnswer: null,
          correctAnswer: "java.lang.Object",
          videoUrl:
              "http://10.88.188.21:9000/videos/在Java中，下列哪个类是所有Java类的根类？.mp4",
        },
        {
          text: "Java中，哪个接口定义了close()方法，用于关闭资源？",
          options: [
            "java.io.Closeable",
            "java.io.Flushable",
            "java.io.Serializable",
            "java.io.Externalizable",
          ],
          selectedAnswer: null,
          correctAnswer: "java.io.Closeable",
          videoUrl:
              "http://10.88.188.21:9000/videos/Java中，哪个接口定义了close()方法，用于关闭资源？.mp4",
        },
        {
          text: "Java中，下列哪个注解用来标记一个方法可能抛出的异常？",
          options: ["@Override", "@Deprecated", "@SuppressWarnings", "@throws"],
          selectedAnswer: null,
          correctAnswer: "@throws",
          videoUrl:
              "http://10.88.188.21:9000/videos/Java中，下列哪个注解用来标记一个方法可能抛出的异常？.mp4",
        },
        {
          text: "在Java中，下列哪个关键字用于定义一个线程安全的单例类？",
          options: ["synchronized", "volatile", "transient", "final"],
          selectedAnswer: null,
          correctAnswer: "volatile",
          videoUrl:
              "http://10.88.188.21:9000/videos/在Java中，下列哪个关键字用于定义一个线程安全的单例类？.mp4",
        },
        // ... 可以添加更多问题
      ],
      currentQuestionIndex: 0,
      submitted: false,
      score: 0
    };
  },
  methods: {
    // 更新视频URL并重载视频播放器
    updateVideoUrl(url) {
      console.log("updateVideoUrl", url);
      this.videoUrl = url;
      // 重置视频播放器，以便加载新的视频URL
      const videoPlayer = url;
      // console.log('videoPlayerurl', url);
      // videoPlayer.load();
    },
    // 更新视频URL并重载视频播放器
    getVideoUrl(text) {
      console.log("getVideoUrl", CONFIG.videoAddress + text + ".mp4");
      console.log("getVideoUrl", CONFIG.videoAddress + text + ".mp4");
      return CONFIG.videoAddress + text + ".mp4";
    },

    getFirstVideoUrl() {
      console.log("getFirstVideoUrl", this.questions[0].videoUrl);
      return CONFIG.videoAddress + this.questions[0].text + ".mp4";
    },

    goToPreviousQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
        this.updateVideoUrl(
            this.getVideoUrl(this.questions[this.currentQuestionIndex].text)
        );
      }
    },
    goToNextQuestion() {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        this.updateVideoUrl(this.questions[this.currentQuestionIndex].videoUrl);
      } else {
        // 如果是最后一题，直接提交
        this.submitAnswers();
      }
    },
    showType(type) {},
    submitAnswers() {
      this.calculateScore();
      this.submitted = true;
    },
    calculateScore() {
      this.score = this.questions.reduce((acc, question) => {
        return question.selectedAnswer === question.correctAnswer
            ? acc + 1
            : acc;
      }, 0);
    },
  },
};
</script>

<style>
/* 设计变量 */
:root {
  --primary: #6366f1;
  --secondary: #8b5cf6;
  --success: #10b981;
  --error: #ef4444;
  --background: #f8fafc;
  --text: #1e293b;
  --border: #e2e8f0;
}

/* 基础样式 */
.quiz-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: 'Inter', system-ui, sans-serif;
}

/* 头部样式 */
.quiz-header {
  text-align: center;
  margin-bottom: 2rem;
}

.quiz-header h1 {
  font-size: 2rem;
  color: var(--text);
  margin-bottom: 1rem;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  transition: width 0.3s ease;
}

/* 题目区域 */
.question-wrapper {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  overflow: hidden;
}

.video-wrapper {
  position: relative;
  padding-top: 56.25%; /* 16:9 比例 */
  background: #000;
}

.question-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px 16px 0 0;
}

.question-card {
  padding: 2rem;
}

.question-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.question-number {
  color: var(--primary);
  font-weight: 600;
}

.question-tag {
  background: #eef2ff;
  color: var(--primary);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
}

.question-text {
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

/* 选项样式 */
.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.option-card {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 2px solid var(--border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-card:hover {
  transform: translateY(-2px);
  border-color: var(--primary);
}

.option-card.selected {
  border-color: var(--primary);
  background: #eef2ff;
}

.hidden-radio {
  display: none;
}

.option-marker {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border);
  border-radius: 50%;
  margin-right: 1rem;
  position: relative;
}

.option-card.selected .option-marker::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 10px;
  height: 10px;
  background: var(--primary);
  border-radius: 50%;
}

/* 按钮样式 */
.nav-buttons {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.nav-btn, .submit-btn {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.prev-btn {
  background: #f1f5f9;
  color: var(--text);
}

.next-btn {
  background: var(--primary);
  color: white;
}

.submit-btn {
  background: var(--success);
  color: white;
}

/* 结果页面 */
.result-wrapper {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
}

.score-card {
  text-align: center;
  margin-bottom: 2rem;
}

.score-circle {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 1rem auto;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.score-number {
  font-size: 3rem;
  color: white;
  font-weight: 700;
}

.score-total {
  font-size: 1.25rem;
  color: rgba(255,255,255,0.8);
}

/* 错题样式 */
.wrong-card {
  background: #fff1f2;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.wrong-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.wrong-number {
  color: var(--error);
  font-weight: 600;
}

.answer-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
}

.answer-box {
  padding: 1rem;
  border-radius: 8px;
}

.your-answer {
  background: #ffe4e6;
  border: 2px solid var(--error);
}

.correct-answer {
  background: #dcfce7;
  border: 2px solid var(--success);
}

.answer-text {
  display: block;
  font-weight: 600;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .options-grid {
    grid-template-columns: 1fr;
  }

  .video-wrapper {
    padding-top: 75%; /* 4:3 比例 */
  }
}
</style>
