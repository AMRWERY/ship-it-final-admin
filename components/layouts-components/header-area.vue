<template>
  <div>
    <!-- Overlay Component -->
    <overlay :visible="localeStore.isOverlayVisible" />

    <header class="sticky top-0 flex w-full bg-white z-999 drop-shadow-1">
      <div class="flex items-center justify-between flex-grow px-4 py-4 shadow-2 md:px-6">
        <div class="flex items-center gap-2 sm:gap-4 lg:hidden">
          <!-- Hamburger Toggle BTN -->
          <button class="z-50 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm lg:hidden" @click="() => {
            toggleSidebar()
          }">
            <span class="relative block h-[1.375rem] w-[1.375rem] cursor-pointer">
              <icon name="meteor-icons:bars" class="text-gray-800" />
            </span>
          </button>
        </div>

        <div class="flex items-center space-s-5 ms-auto">
          <!-- profile -->
          <tooltip :text="$t('tooltip.profile')" position="bottom">
            <nuxt-link to="/profile" type="button" class="relative flex text-white rounded-full" v-if="isAuthenticated">
              <span class="absolute -inset-1.5" />
              <span class="sr-only">View Profile</span>
              <img src="https://justfields.com/storage/projects/7M5rV059/vector-avatar-02.jpg" alt="profile-img"
                class="rounded-full h-7 w-7">
            </nuxt-link>
          </tooltip>

          <nuxt-link class="text-neutral-600" to="" role="button" v-if="localeStore.isRTL">
            <span class="[&>svg]:w-5" @click="switchLocale('en')">
              En
            </span>
          </nuxt-link>
          <nuxt-link class="text-neutral-600" to="" role="button" v-else>
            <span class="[&>svg]:w-5" @click="switchLocale('ar')">
              العربية
            </span>
          </nuxt-link>

          <!--toggle theme -->
          <tooltip :text="$t('tooltip.toggle_theme')" position="bottom">
            <nuxt-link to="" type="button" class="relative flex text-white rounded-full cursor-pointer"
              @click="$emit('toggle-theme')">
              <span class="absolute -inset-1.5" />
              <span class="sr-only">toggle theme</span>
              <icon :name="isDark ? 'heroicons-solid:sun' : 'heroicons-solid:moon'" class="text-neutral-600" />
            </nuxt-link>
          </tooltip>

          <nuxt-link to="/login" class="text-neutral-600" v-if="!isAuthenticated">login</nuxt-link>
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