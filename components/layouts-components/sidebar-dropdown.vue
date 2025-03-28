<template>
  <div>
    <ul class="pt-1 pb-1 ps-6">
      <li v-for="(childItem, index) in items" :key="index" class="mt-1">
        <nuxt-link-locale :to="childItem.route" @click.prevent="handleItemClick(childItem, index)"
          class="flex items-center px-4 py-2 text-sm text-gray-400 transition-all duration-200 rounded-lg group hover:bg-gray-700 hover:text-white"
          :class="{
            'bg-gray-700 text-white': isActive(childItem)
          }">
          <span class="w-1.5 h-1.5 me-3 bg-gray-500 rounded-full group-hover:bg-white"
            :class="{ 'bg-white': isActive(childItem) }"></span>
          {{ $t(childItem.label) }}
        </nuxt-link-locale>
      </li>
    </ul>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const sidebarStore = useSidebarStore();
const localePath = useLocalePath();

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  page: {
    type: String,
    default: ''
  },
  currentPage: {
    type: String,
    default: ''
  }
});

// Check if the current route matches an item's route
const isActive = (item) => {
  return route.path.startsWith(item.route) || route.path.startsWith(localePath(item.route));
};

const handleItemClick = (item, index) => {
  const pageName = sidebarStore.selected === props.items[index].label ? '' : props.items[index].label;
  sidebarStore.selected = pageName;

  // Get localized path with correct prefix
  const localizedPath = localePath(item.route);

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