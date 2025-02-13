<template>
  <div>
    <div class="relative inline-block group" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false">
      <!-- Slot for any element -->
      <slot />

      <!-- Tooltip -->
      <Transition name="fade">
        <div v-show="showTooltip"
          class="absolute z-50 px-3 whitespace-nowrap py-1.5 text-sm text-white transition-all duration-300 rounded-lg shadow-md"
          :class="tooltipClasses" ref="tooltip">
          {{ text }}
          <div class="absolute w-2 h-2 rotate-45" :class="arrowClasses"></div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  text: { type: String, required: true },
  position: { type: String, default: "top" },
  color: { type: String, default: "bg-gray-800" },
});

const showTooltip = ref(false);

const tooltipClasses = computed(() => ({
  "top-[-40px] left-1/2 -translate-x-1/2": props.position === "top",
  "top-[30px] left-1/2 -translate-x-1/2": props.position === "bottom",
  "left-[-100%] top-1/2 -translate-y-1/2": props.position === "left",
  "right-[-100%] top-1/2 -translate-y-1/2": props.position === "right",
  [props.color]: true,
}));

const arrowClasses = computed(() => ({
  "bottom-[-4px] left-1/2 -translate-x-1/2 bg-gray-800": props.position === "top",
  "top-[-4px] left-1/2 -translate-x-1/2 bg-gray-800": props.position === "bottom",
  "right-[-4px] top-1/2 -translate-y-1/2 bg-gray-800": props.position === "left",
  "left-[-4px] top-1/2 -translate-y-1/2 bg-gray-800": props.position === "right",
}));
</script>

<style scoped>
div[v-show="true"] {
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}

div[v-show="false"] {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>