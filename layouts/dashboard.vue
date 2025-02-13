<template>
  <div>
    <!-- Overlay Component -->
    <overlay :visible="themeStore.showOverlay" />
    
    <div :dir="isRTL ? 'rtl' : 'ltr'" :class="{ 'rtl': isRTL, 'ltr': !isRTL }">
      <div class="flex h-screen overflow-hidden">
        <!-- ===== Sidebar Start ===== -->
        <sidebar-area />
        <!-- ===== Sidebar End ===== -->

        <!-- ===== Content Area Start ===== -->
        <div class="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
          <!-- ===== Header Start ===== -->
          <header-area :is-dark="themeStore.isDark" @toggle-theme="themeStore.toggleTheme" />
          <!-- ===== Header End ===== -->

          <!-- ===== Main Content Start ===== -->
          <main>
            <div class="p-4 mx-auto max-w-screen-2xl md:p-6 2xl:p-10">
              <slot />
            </div>
          </main>
          <!-- ===== Main Content End ===== -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { locale } = useI18n();

const isRTL = computed(() => {
  return locale.value === 'ar';
});

//toggle themes
const themeStore = useThemeStore();

onMounted(() => {
  themeStore.loadTheme();
});
</script>