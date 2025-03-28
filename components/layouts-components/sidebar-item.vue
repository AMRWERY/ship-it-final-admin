<template>
  <div>
    <li>
      <nuxt-link-locale :to="item.route"
        class="flex items-center px-3 py-2.5 text-gray-300 rounded-lg transition-all duration-200 group hover:bg-gray-700 hover:text-white"
        :class="{
          'bg-indigo-600 text-white hover:bg-indigo-700': isActive,
        }" @click.prevent="handleItemClick">
        <div class="flex items-center flex-1">
          <span
            class="flex items-center justify-center w-6 h-6 text-gray-400 transition-colors me-3 group-hover:text-white"
            :class="{ 'text-white': isActive }">
            <icon :name="item.icon" class="w-5 h-5" />
          </span>
          <span class="text-sm font-medium">{{ $t(item.label) }}</span>
        </div>

        <icon v-if="item.children" name="material-symbols:keyboard-arrow-down"
          class="w-5 h-5 transition-transform duration-200"
          :class="{ 'rotate-180': sidebarStore.page === item.label }" />
      </nuxt-link-locale>

      <!-- Dropdown Menu -->
      <div v-if="item.children" class="overflow-hidden transition-all duration-300" :class="{
        'max-h-0 opacity-0': sidebarStore.page !== item.label,
        'max-h-96 opacity-100 mt-1': sidebarStore.page === item.label
      }">
        <sidebar-dropdown v-if="item.children" :items="item.children" :currentPage="currentPage" :page="item.label" />
      </div>
    </li>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const sidebarStore = useSidebarStore();
const localePath = useLocalePath();

const props = defineProps({
  item: Object,
  index: Number
});

const currentPage = useRoute().name;

// Check if the current route matches this item's route
const isActive = computed(() => {
  // Match exact path for home, partial path for others to account for sub-routes
  if (props.item.route === '/') {
    return route.path === props.item.route || route.path === localePath('/');
  }
  return route.path.startsWith(props.item.route) || route.path.startsWith(localePath(props.item.route));
});

const handleItemClick = () => {
  // If the item has children, toggle dropdown
  if (props.item.children) {
    const pageName = sidebarStore.page === props.item.label ? '' : props.item.label;
    sidebarStore.page = pageName;
    return;
  }

  // Make sure the route has proper format with locale prefix
  const localizedPath = localePath(props.item.route);

  // Navigate to the route
  try {
    router.push(localizedPath);

    // Close sidebar on mobile
    if (window.innerWidth < 1024) {
      sidebarStore.isSidebarOpen = false;
    }
  } catch (error) {
    console.error('Navigation error:', error);
  }
};
</script>

<style scoped>
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>