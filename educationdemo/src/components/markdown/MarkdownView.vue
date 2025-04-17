<template>
  <div class="markdown-content">
    <VueMarkdown
      :source="content"
      :options="options"
    />
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue';
import VueMarkdown from 'vue-markdown-render';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

defineProps<{
  content: string;
}>();

const options = {
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
  highlight: function (str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return '';
  }
};
</script>

<script lang="ts">
export default defineComponent({
  name: 'MarkdownView'
});
</script>

<style>

.markdown-content h1 {
  font-size: 1.875rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.markdown-content h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.markdown-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.markdown-content a {
  color: #3b82f6;
}

.markdown-content a:hover {
  text-decoration: underline;
}

.markdown-content ul,
.markdown-content ol {
  list-style: decimal;
  list-style-position: outside;
  margin-left: 1rem;
}

.markdown-content li {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.markdown-content pre {
  background-color: #18181b;
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem 0;
  overflow-x: auto;
}

.markdown-content code {
  font-family: monospace;
  font-size: 0.875rem;
}

.markdown-content p {
  margin: 1rem 0;
}

.markdown-content strong {
  font-weight: 600;
}
</style>