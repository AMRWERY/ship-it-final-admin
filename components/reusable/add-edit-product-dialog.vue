<template>
  <div>
    <nuxt-link to="" role="button" class="flex items-center justify-center w-full px-5 py-2.5 btn-style"
      @click="openDialog">
      <icon name="material-symbols:add" class="w-5 h-5 -ms-2 me-2" aria-hidden="true" />
      <span>{{ $t('btn.add_product') }}</span>
    </nuxt-link>

    <transition name="dialog">
      <div v-if="isDialogOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div class="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <!-- Dialog header -->
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold">Add Product</h3>
            <button @click="closeDialog" class="text-gray-500 hover:text-gray-700">
              <icon name="material-symbols:close" class="w-6 h-6" />
            </button>
          </div>
          <!-- Dialog content (form or other content) -->
          <div>
            <p>Product form goes here...</p>
            <!-- Example form field -->
            <input type="text" placeholder="Product Name"
              class="w-full px-4 py-2 mt-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <!-- More form fields as needed -->
          </div>
          <!-- Dialog footer -->
          <div class="mt-6 flex justify-end">
            <button @click="closeDialog" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Close
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
const isDialogOpen = ref(false)

const openDialog = () => {
  isDialogOpen.value = true
}

const closeDialog = () => {
  isDialogOpen.value = false
}
</script>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}
</style>