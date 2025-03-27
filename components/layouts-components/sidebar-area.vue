  <template>
    <div>
      <!-- Overlay Component -->
      <overlay :visible="authStore.isOverlayVisible" />

      <aside
        class="fixed top-0 z-50 flex h-screen w-[230px] flex-col overflow-y-hidden bg-black duration-300 ease-linear lg:static lg:translate-x-0"
        :class="[
          localeStore.isRTL ? 'right-0' : 'left-0',
          {
            'translate-x-0': sidebarStore.isSidebarOpen,
            '-translate-x-full': !sidebarStore.isSidebarOpen && !localeStore.isRTL,
            'translate-x-full': !sidebarStore.isSidebarOpen && localeStore.isRTL,
            'lg:translate-x-0': true
          }
        ]" ref="target">
        <!-- SIDEBAR HEADER -->
        <div class="flex items-center justify-between gap-3 px-6 py-[1.375rem] lg:py-6.5">
          <nuxt-link-locale to="/">
            <p class="text-3xl font-semibold text-white capitalize opacity-100 max-h-7 head">Ship-IT</p>
          </nuxt-link-locale>

          <button class="block lg:hidden" @click="sidebarStore.isSidebarOpen = false">
            <icon name="ic:baseline-keyboard-arrow-left" class="fill-current w-5 h-[18px]" />
          </button>
        </div>
        <!-- SIDEBAR HEADER -->

        <div class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
          <!-- Sidebar Menu -->
          <nav class="px-4 py-4 mt-5 lg:mt-9 lg:px-6">
            <template v-for="menuGroup in menuGroups" :key="menuGroup.name">
              <div>
                <h3 class="mb-4 text-sm font-medium text-white ms-4">{{ menuGroup.name }}</h3>
                <ul class="mb-6 flex flex-col gap-1.5">
                  <sidebar-item v-for="(menuItem, index) in menuGroup.menuItems" :item="menuItem" :key="index"
                    :index="index" />
                </ul>
              </div>
            </template>
          </nav>
          <!-- Sidebar Menu -->
        </div>

        <div class="px-4 pb-6 mt-auto">
          <nuxt-link role="button" to="" @click="logout"
            class="block py-2 text-center text-white transition-all duration-300 bg-transparent border-2 border-white rounded-md hover:bg-white hover:text-black">
            {{ $t('btn.logout') }}
          </nuxt-link>
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