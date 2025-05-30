<template>
  <div class="min-h-screen bg-black text-white p-6">
    <div class="max-w-4xl mx-auto">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center items-center h-[60vh]">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="text-center py-10">
        <p class="text-red-500 text-xl">{{ error }}</p>
        <button 
          @click="fetchWords" 
          class="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          重试
        </button>
      </div>

      <!-- 单词列表 -->
      <div v-else class="space-y-6">
        <div v-for="word in words" :key="word.id" class="bg-gray-800 rounded-lg p-6">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-2xl font-bold">{{ word.word }}</h3>
              <p class="text-gray-400 mt-1">{{ word.phonetic }}</p>
            </div>
          </div>
          
          <div class="mt-4 space-y-2">
            <p class="text-gray-300"><span class="font-semibold">释义：</span>{{ word.definition }}</p>
            <p class="text-gray-300"><span class="font-semibold">翻译：</span>{{ word.translation }}</p>
            <p v-if="word.example" class="text-gray-300">
              <span class="font-semibold">例句：</span>{{ word.example }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getUnitWords } from '@/api/unit';

const route = useRoute();
const words = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchWords = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // 从路由参数获取课程ID
    const courseId = route.params.id;
    const response = await getUnitWords(courseId);
    
    if (response && response.code === 0 && response.data) {
      words.value = response.data.words || [];
    } else {
      error.value = response.msg || '获取单词列表失败';
    }
  } catch (err) {
    console.error('获取单词失败:', err);
    error.value = '获取单词列表时发生错误';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchWords();
});
</script> 