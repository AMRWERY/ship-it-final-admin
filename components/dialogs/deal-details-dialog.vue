<template>
  <div>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
    <div class="w-full max-w-xl p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold">{{ $t('dashboard.deal_details') }}</h3>
        <button @click="closeDialog" class="text-gray-500 hover:text-gray-700">
          <icon name="material-symbols:close" class="w-6 h-6" />
        </button>
      </div>
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <img :src="deal.imageUrl1" class="object-cover w-24 h-24 rounded-lg" />
          <div>
            <h4 class="text-lg font-semibold">{{ deal.title }}</h4>
            <p class="text-sm text-gray-500">{{ deal.brand }}</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
            <p class="text-sm text-gray-500">{{ $t('dashboard.original_price') }}</p>
            <p class="text-lg font-semibold">{{ $n(parseFloat(deal.price) || 0, 'currency', currencyLocale) }}</p>
          </div>
          <div class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
            <p class="text-sm text-red-500">{{ $t('dashboard.discounted_price') }}</p>
            <p class="text-lg font-semibold text-red-600">{{ $n(parseFloat(deal.discountedPrice) || 0, 'currency', currencyLocale) }}</p>
          </div>
        </div>
        <div class="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
          <p class="text-sm text-blue-500">{{ $t('dashboard.discount') }}</p>
          <p class="text-lg font-semibold text-blue-600">{{ deal.discount }}%</p>
        </div>
        <div class="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
          <p class="text-sm text-green-500">{{ $t('dashboard.stock') }}</p>
          <p class="text-lg font-semibold text-green-600">{{ deal.stock }}</p>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
const { currencyLocale } = useCurrencyLocale();

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  deal: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close']);

const closeDialog = () => {
  emit('close');
};
</script> 