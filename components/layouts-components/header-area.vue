<template>
  <div>
    <!-- Overlay Component -->
    <overlay :visible="localeStore.isOverlayVisible" />

    <header
      class="sticky top-0 z-50 w-full transition-all duration-300 shadow-md backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
      <div class="flex items-center justify-between px-4 py-3 mx-auto md:px-6 max-w-screen-2xl">
        <!-- Mobile hamburger menu -->
        <div class="flex items-center lg:hidden">
          <button
            class="p-1.5 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600"
            @click="toggleSidebar" aria-label="Toggle menu">
            <icon name="meteor-icons:bars" class="w-6 h-6" />
          </button>
        </div>

        <!-- Logo for mobile (if needed) -->
        <div class="mx-auto lg:hidden">
          <nuxt-link-locale to="/" class="flex items-center">
            <span class="text-xl font-bold text-gray-900 dark:text-white">Ship-IT</span>
          </nuxt-link-locale>
        </div>

        <!-- Right side actions -->
        <div class="flex items-center ms-auto space-s-2">
          <!-- Profile -->
          <div class="relative" v-if="isAuthenticated">
            <tooltip :text="$t('tooltip.profile')" position="bottom">
              <nuxt-link-locale to="/profile"
                class="relative flex items-center justify-center overflow-hidden text-gray-700 transition-all duration-300 bg-gray-100 rounded-full w-7 h-7 hover:bg-indigo-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                <span class="sr-only">View Profile</span>
                <img src="https://justfields.com/storage/projects/7M5rV059/vector-avatar-02.jpg" alt="Profile"
                  class="object-cover w-full h-full" />
              </nuxt-link-locale>
            </tooltip>
          </div>

          <!-- Language toggle -->
          <div class="relative">
            <button
              class="flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              @click="switchLocale(localeStore.isRTL ? 'en' : 'ar')">
              <span v-if="localeStore.isRTL" class="flex items-center">
                <icon name="heroicons:language" class="w-4 h-4 me-1.5" />
                En
              </span>
              <span v-else class="flex items-center">
                <icon name="heroicons:language" class="w-4 h-4 me-1.5" />
                العربية
              </span>
            </button>
          </div>

          <!-- Theme toggle -->
          <div class="relative">
            <tooltip :text="$t('tooltip.toggle_theme')" position="bottom">
              <button
                class="flex items-center justify-center text-gray-700 transition-colors rounded-lg w-9 h-9 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600"
                @click="$emit('toggle-theme')" aria-label="Toggle theme">
                <template v-if="isDark">
                  <icon name="heroicons:sun-solid" class="w-5 h-5 text-yellow-400" />
                </template>
                <template v-else>
                  <icon name="heroicons:moon-solid" class="w-5 h-5" />
                </template>
              </button>
            </tooltip>
          </div>

          <!-- Login button for non-authenticated users -->
          <div v-if="!isAuthenticated">
            <nuxt-link-locale to="/login"
              class="px-4 py-2 text-sm font-medium text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-700 dark:hover:bg-indigo-600">
              {{ $t('btn.login') }}
            </nuxt-link-locale>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script setup>
const { toggleSidebar } = useSidebarStore()
const localeStore = useLocaleStore();
const { setLocale } = useI18n();

const switchLocale = (value) => {
  localeStore.updateLocale(value);
  setLocale(value)
};

// const authStore = useAuthStore();
const isAuthenticated = computed(() => localStorage.getItem('user'));

//toggle themes
defineProps({
  isDark: Boolean,
});
</script>

<style scoped>
.backdrop-blur-sm {
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}
</style>