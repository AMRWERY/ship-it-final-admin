<template>
  <div>
    <div v-if="loading" class="flex items-center justify-center text-red-700">
      <icon name="svg-spinners:6-dots-rotate" size="80px" />
    </div>
    <slot v-else></slot>
  </div>
</template>

<script setup>
const loading = ref(true);
const emit = defineEmits(["loaded"]);

const simulateLoading = () => {
  setTimeout(() => {
    loading.value = false;
    emit("loaded");
  }, 2000);
};

onMounted(simulateLoading);
</script>