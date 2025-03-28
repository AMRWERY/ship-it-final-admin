<template>
  <div>
    <!-- Overlay Component -->
    <overlay :visible="authStore.isOverlayVisible" />

    <aside
      class="fixed top-0 z-50 flex flex-col w-64 h-screen overflow-hidden transition-all duration-300 ease-in-out bg-gradient-to-b from-gray-900 to-gray-800 lg:static lg:translate-x-0"
      :class="[
        localeStore.isRTL ? 'right-0' : 'left-0',
        {
          'translate-x-0 shadow-2xl': sidebarStore.isSidebarOpen,
          '-translate-x-full': !sidebarStore.isSidebarOpen && !localeStore.isRTL,
          'translate-x-full': !sidebarStore.isSidebarOpen && localeStore.isRTL,
        }
      ]" ref="target">
      <!-- Sidebar Header -->
      <div class="flex items-center justify-between px-6 py-5 border-b border-gray-700">
        <nuxt-link-locale to="/" class="flex items-center">
          <icon name="material-symbols:local-shipping-outline-sharp" class="w-8 h-8 text-indigo-400 me-2" />
          <span class="text-xl font-bold tracking-wide text-white">Ship-IT</span>
        </nuxt-link-locale>

        <button
          class="p-1.5 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition-colors lg:hidden focus:outline-none focus:ring-2 focus:ring-gray-600"
          @click="sidebarStore.isSidebarOpen = false" aria-label="Close sidebar">
          <icon
            :name="localeStore.isRTL ? 'material-symbols:arrow-forward-rounded' : 'material-symbols:arrow-back-rounded'"
            class="w-5 h-5" />
        </button>
      </div>

      <!-- Sidebar Content -->
      <div class="flex-grow overflow-y-auto">
        <nav class="px-4 py-6">
          <template v-for="menuGroup in menuGroups" :key="menuGroup.name">
            <div class="mb-6">
              <h3 v-if="menuGroup.name" class="px-4 mb-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                {{ menuGroup.name }}
              </h3>
              <ul class="space-y-1">
                <sidebar-item v-for="(menuItem, index) in menuGroup.menuItems" :item="menuItem" :key="index"
                  :index="index" />
              </ul>
            </div>
          </template>
        </nav>
      </div>

      <!-- Sidebar Footer -->
      <div class="px-4 py-5 border-t border-gray-700">
        <button @click="logout"
          class="flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5 me-2" />
          {{ $t('btn.logout') }}
        </button>
      </div>
    </aside>
  </div>
</template>

<script setup>
const sidebarStore = useSidebarStore()
const authStore = useAuthStore();
const localeStore = useLocaleStore()
const localePath = useLocalePath()
const target = ref(null)

onClickOutside(target, () => {
  sidebarStore.isSidebarOpen = false
})

const logout = async () => {
  try {
    await authStore.logoutUser();
    setTimeout(() => {
      navigateTo(localePath('/login'))
    }, 3000);
  } catch (err) {
    console.error('Error during logout:', err);
  }
};

const route = useRoute()

watch(() => route.path, () => {
  if (sidebarStore.isSidebarOpen) {
    sidebarStore.isSidebarOpen = false
  }
})

const isLargeScreen = useMediaQuery('(min-width: 1024px)')

watch(isLargeScreen, (isLarge) => {
  if (isLarge) {
    sidebarStore.isSidebarOpen = true
  } else {
    sidebarStore.isSidebarOpen = false
  }
})

const menuGroups = computed(() => [
  {
    menuItems: [
      {
        icon: 'material-symbols:bar-chart-4-bars-rounded',
        label: 'layout.dashboard',
        route: '/',
      },
      {
        icon: 'material-symbols:category-rounded',
        label: 'layout.categories',
        route: '/categories',
      },
      {
        icon: 'lsicon:management-stockout-filled',
        label: 'layout.items_stock',
        route: '/items-stock'
      },
      {
        icon: 'material-symbols:shopping-cart-rounded',
        label: 'layout.orders',
        route: '/orders'
      },
      {
        icon: 'streamline:discount-percent-fire',
        label: 'layout.deals',
        route: '/deals',
      },
      {
        icon: 'gridicons:multiple-users',
        label: 'layout.users',
        route: '/users',
      },
      {
        icon: 'ph:envelope-simple-bold',
        label: 'layout.customer_messages',
        route: '/customer-messages',
      },
    ],
  },
]);
</script>