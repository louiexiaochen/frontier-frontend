<template>
  <svg
    :width="size"
    :height="size * 1.6667" 
    viewBox="0 0 15 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :style="style"
    class="back-icon-svg"
  >
    <path
      id="Union"
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M13.1497 24.7483C11.9102 25.208 10.189 24.7836 9.30519 23.8004L0.512313 14.0185C0.0546436 13.5094 -0.0886774 12.9502 0.0516548 12.4656C-0.0886774 11.9809 0.0546436 11.4218 0.512313 10.9126L9.30519 1.13078C10.189 0.147606 11.9102 -0.276798 13.1497 0.182846C14.3893 0.64249 14.6776 1.81212 13.7939 2.79529L5.10129 12.4656L13.7939 22.1359C14.6776 23.119 14.3893 24.2887 13.1497 24.7483Z"
      fill="currentColor"
    />
  </svg>
</template>

<script>
export default {
  name: 'BackIcon',
  props: {
    size: {
      type: [Number, String],
      default: 15
    },
    style: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>

<style scoped>
.back-icon-svg {
  transition: transform 0.3s ease;
}
.back-icon-svg:hover {
  transform: scale(1.1);
}
</style> 