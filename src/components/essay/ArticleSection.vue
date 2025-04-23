<template>
  <div class="article-section" :style="{ width: width + '%' }">
    <div class="article-title">{{ title }}</div>
    <div class="article-content">
      <p v-for="(paragraph, index) in paragraphs" :key="index" class="paragraph">
        {{ paragraph }}
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  width: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  paragraphs: {
    type: Array,
    required: true
  }
});
</script>

<style scoped>
.article-section {
  background-color: white;
  color: #333;
  border-radius: 0.5rem 0 0 0.5rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 100%;
  transition: width 0.2s ease;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.article-section::-webkit-scrollbar {
  width: 6px;
}

.article-section::-webkit-scrollbar-track {
  background: transparent;
}

.article-section::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.article-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  color: #222;
}

.article-content {
  font-size: 1.05rem;
  line-height: 1.7;
}

.paragraph {
  margin-bottom: 1.2rem;
  text-align: justify;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .article-section {
    width: 100% !important;
    border-radius: 0.5rem 0.5rem 0 0;
    max-height: 50vh;
  }
}
</style>