<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :style="style"
    class="vocabulary-icon"
  >
    <g id="记单词 1">
      <path
        id="Vector"
        d="M14.7377 1.12415H1.7795C1.41862 1.12415 1.12524 1.41665 1.12524 1.77735V16.2141C1.12524 16.5748 1.41862 16.8673 1.7795 16.8673H14.7377C15.9181 16.8673 16.8784 15.9075 16.8784 14.7279V3.26358C16.8784 2.08391 15.9179 1.12415 14.7377 1.12415ZM2.43376 2.43055H5.04587C5.04534 2.44268 5.03884 2.45305 5.03884 2.46553V15.5609H2.43376V2.43055ZM15.5699 14.7279C15.5699 15.1868 15.1962 15.5609 14.7376 15.5609H6.466V2.46536C6.466 2.45305 6.45968 2.44268 6.45897 2.43038H14.7377C15.1964 2.43038 15.5701 2.80444 15.5701 3.2634V14.7279H15.5699Z"
        fill="currentColor"
      />
      <path
        id="Vector_2"
        d="M10.5227 4.74731L7.53564 13.2282H8.85453L9.48541 11.3314H12.6027L13.2394 13.2282H14.5535L11.5656 4.74731H10.5227ZM9.84629 10.1925L11.036 6.48192H11.0581L12.2478 10.1925H9.84629Z"
        fill="currentColor"
      />
    </g>
  </svg>
</template>

<script>
export default {
  name: 'VocabularyIcon',
  props: {
    size: {
      type: [Number, String],
      default: 18
    },
    style: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>

<style scoped>
.vocabulary-icon {
  transition: transform 0.3s ease;
}
.vocabulary-icon:hover {
  transform: scale(1.1);
}
</style> 