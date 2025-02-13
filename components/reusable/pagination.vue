<template>
  <div>
    <div class="flex justify-center mt-6">
      <nav class="inline-flex">
        <button
          class="px-4 py-2 mx-1 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          {{ $t('pagination.previous') }}
        </button>
        <button
          class="px-4 py-2 mx-1 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          1
        </button>
        <button
          class="px-4 py-2 mx-1 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          2
        </button>
        <button
          class="px-4 py-2 mx-1 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          3
        </button>
        <button
          class="px-4 py-2 mx-1 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          {{ $t('pagination.next') }}
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>

</script>