<template>
 <div>
  <div class="p-4 bg-white rounded-lg shadow-md dark:bg-black dark:border dark:border-gray-100">
    <h3 class="mb-4 text-xl font-semibold text-center">{{ $t('dashboard.quick_actions') }}</h3>
    <div class="grid gap-4 md:grid-cols-3 sm:grid-cols-12">
      <!-- Add New Product -->
      <nuxt-link-locale to="/items-stock/add-product" class="flex flex-col items-center justify-center p-4 transition-colors rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">
        <icon name="material-symbols:add-box" class="w-8 h-8 text-gray-600 dark:text-gray-300" />
        <span class="mt-2 text-sm font-medium text-gray-700 dark:text-gray-200">{{ $t('dashboard.add_product') }}</span>
      </nuxt-link-locale>

      <!-- Manage Inventory -->
      <nuxt-link-locale to="/items-stock" class="flex flex-col items-center justify-center p-4 transition-colors rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">
        <icon name="lucide:boxes" class="w-8 h-8 text-gray-600 dark:text-gray-300" />
        <span class="mt-2 text-sm font-medium text-gray-700 dark:text-gray-200">{{ $t('dashboard.manage_inventory') }}</span>
      </nuxt-link-locale>

      <!-- User Management -->
      <nuxt-link-locale to="/users" class="flex flex-col items-center justify-center p-4 transition-colors rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">
        <icon name="ci:users-group" class="w-8 h-8 text-gray-600 dark:text-gray-300" />
        <span class="mt-2 text-sm font-medium text-gray-700 dark:text-gray-200">{{ $t('dashboard.manage_users') }}</span>
      </nuxt-link-locale>
    </div>
  </div>
 </div>
</template>

<script setup>

</script> 