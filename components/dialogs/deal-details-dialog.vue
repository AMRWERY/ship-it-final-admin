<template>
  <div>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="w-full max-w-xl p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold dark:text-white">{{ $t('dashboard.deal_details') }}</h3>
          <button @click="closeDialog"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">
            <icon name="material-symbols:close" class="w-6 h-6" />
          </button>
        </div>
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <img :src="deal.imageUrl1" class="object-cover w-24 h-24 rounded-lg" />
            <div>
              <h4 class="text-lg font-semibold dark:text-white">{{ deal.title }}</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ deal.brand }}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('dashboard.original_price') }}</p>
              <p class="text-lg font-semibold dark:text-white">{{ $n(parseFloat(deal.price) || 0, 'currency',
                currencyLocale) }}</p>
            </div>
            <div class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
              <p class="text-sm text-red-500 dark:text-red-400">{{ $t('dashboard.discounted_price') }}</p>
              <p class="text-lg font-semibold text-red-600 dark:text-red-300">{{ $n(parseFloat(deal.discountedPrice) ||
                0, 'currency',
                currencyLocale) }}</p>
            </div>
          </div>
          <div class="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <p class="text-sm text-blue-500 dark:text-blue-400">{{ $t('dashboard.discount') }}</p>
            <p class="text-lg font-semibold text-blue-600 dark:text-blue-300">{{ deal.discount }}%</p>
          </div>

          <!-- Time Period Section -->
          <div class="grid grid-cols-2 gap-4">
            <div class="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <div class="flex items-center gap-2 mb-1">
                <icon name="material-symbols:calendar-today" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <p class="text-sm text-purple-600 dark:text-purple-400">{{ $t('dashboard.start_time') }}</p>
              </div>
              <p class="text-lg font-semibold text-purple-700 dark:text-purple-300">
                {{ formatDate(deal.startTime) }}
              </p>
            </div>
            <div class="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
              <div class="flex items-center gap-2 mb-1">
                <icon name="material-symbols:calendar-month" class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <p class="text-sm text-indigo-600 dark:text-indigo-400">{{ $t('dashboard.end_time') }}</p>
              </div>
              <p class="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
                {{ formatDate(deal.endTime) }}
              </p>
            </div>
          </div>

          <!-- Deal Status -->
          <div class="p-3 rounded-lg" :class="getStatusClass(deal)">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <icon :name="getStatusIcon(deal)" class="w-5 h-5" :class="getStatusTextClass(deal)" />
                <p class="text-sm" :class="getStatusTextClass(deal)">{{ $t('dashboard.status') }}</p>
              </div>
              <p class="text-lg font-semibold" :class="getStatusTextClass(deal)">
                {{ getStatusText(deal) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { currencyLocale } = useCurrencyLocale();
const { t } = useI18n();

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

// Format date to display in a nice format
const formatDate = (timestamp) => {
  if (!timestamp) {
    console.log('No timestamp provided');
    return 'N/A';
  }
  try {
    if (timestamp instanceof Date) {
      return timestamp.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }

    if (timestamp.seconds !== undefined) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }

    if (typeof timestamp === 'string') {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }

    if (typeof timestamp.toDate === 'function') {
      const date = timestamp.toDate();
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }

    console.log('Unknown timestamp format');
    return 'N/A';
  } catch (e) {
    console.error("Error formatting date:", e);
    return 'N/A';
  }
};

// Get deal status based on start and end time
const getStatusText = (deal) => {
  if (!deal) return t('dashboard.unknown');
  const now = new Date();
  try {
    let startTime, endTime;
    // Handle different timestamp formats
    if (deal.startTime) {
      if (deal.startTime.seconds) {
        startTime = new Date(deal.startTime.seconds * 1000);
      } else if (typeof deal.startTime.toDate === 'function') {
        startTime = deal.startTime.toDate();
      } else if (typeof deal.startTime === 'string') {
        startTime = new Date(deal.startTime);
      } else if (deal.startTime instanceof Date) {
        startTime = deal.startTime;
      }
    }

    if (deal.endTime) {
      if (deal.endTime.seconds) {
        endTime = new Date(deal.endTime.seconds * 1000);
      } else if (typeof deal.endTime.toDate === 'function') {
        endTime = deal.endTime.toDate();
      } else if (typeof deal.endTime === 'string') {
        endTime = new Date(deal.endTime);
      } else if (deal.endTime instanceof Date) {
        endTime = deal.endTime;
      }
    }

    if (!startTime || !endTime) {
      return t('dashboard.unknown');
    }

    if (now < startTime) {
      return t('dashboard.upcoming');
    } else if (now > endTime) {
      return t('dashboard.ended');
    } else {
      return t('dashboard.active');
    }
  } catch (e) {
    console.error('Error determining status:', e);
    return t('dashboard.unknown');
  }
};

// Get status background class based on deal status
const getStatusClass = (deal) => {
  if (!deal) return 'bg-gray-50 dark:bg-gray-700';

  const now = new Date();

  try {
    let startTime, endTime;

    if (deal.startTime) {
      if (deal.startTime.seconds) {
        startTime = new Date(deal.startTime.seconds * 1000);
      } else if (typeof deal.startTime.toDate === 'function') {
        startTime = deal.startTime.toDate();
      } else if (typeof deal.startTime === 'string') {
        startTime = new Date(deal.startTime);
      } else if (deal.startTime instanceof Date) {
        startTime = deal.startTime;
      }
    }

    if (deal.endTime) {
      if (deal.endTime.seconds) {
        endTime = new Date(deal.endTime.seconds * 1000);
      } else if (typeof deal.endTime.toDate === 'function') {
        endTime = deal.endTime.toDate();
      } else if (typeof deal.endTime === 'string') {
        endTime = new Date(deal.endTime);
      } else if (deal.endTime instanceof Date) {
        endTime = deal.endTime;
      }
    }

    if (!startTime || !endTime) {
      return 'bg-gray-50 dark:bg-gray-700';
    }

    if (now < startTime) {
      return 'bg-yellow-50 dark:bg-yellow-900/20';
    } else if (now > endTime) {
      return 'bg-red-50 dark:bg-red-900/20';
    } else {
      return 'bg-green-50 dark:bg-green-900/20';
    }
  } catch (e) {
    return 'bg-gray-50 dark:bg-gray-700';
  }
};

// Get status text color class based on deal status
const getStatusTextClass = (deal) => {
  if (!deal) return 'text-gray-700 dark:text-gray-400';

  const now = new Date();

  try {
    let startTime, endTime;

    if (deal.startTime) {
      if (deal.startTime.seconds) {
        startTime = new Date(deal.startTime.seconds * 1000);
      } else if (typeof deal.startTime.toDate === 'function') {
        startTime = deal.startTime.toDate();
      } else if (typeof deal.startTime === 'string') {
        startTime = new Date(deal.startTime);
      } else if (deal.startTime instanceof Date) {
        startTime = deal.startTime;
      }
    }

    if (deal.endTime) {
      if (deal.endTime.seconds) {
        endTime = new Date(deal.endTime.seconds * 1000);
      } else if (typeof deal.endTime.toDate === 'function') {
        endTime = deal.endTime.toDate();
      } else if (typeof deal.endTime === 'string') {
        endTime = new Date(deal.endTime);
      } else if (deal.endTime instanceof Date) {
        endTime = deal.endTime;
      }
    }

    if (!startTime || !endTime) {
      return 'text-gray-700 dark:text-gray-400';
    }

    if (now < startTime) {
      return 'text-yellow-700 dark:text-yellow-400';
    } else if (now > endTime) {
      return 'text-red-700 dark:text-red-400';
    } else {
      return 'text-green-700 dark:text-green-400';
    }
  } catch (e) {
    return 'text-gray-700 dark:text-gray-400';
  }
};

// Get status icon based on deal status
const getStatusIcon = (deal) => {
  if (!deal) return 'material-symbols:question-mark';

  const now = new Date();

  try {
    let startTime, endTime;

    if (deal.startTime) {
      if (deal.startTime.seconds) {
        startTime = new Date(deal.startTime.seconds * 1000);
      } else if (typeof deal.startTime.toDate === 'function') {
        startTime = deal.startTime.toDate();
      } else if (typeof deal.startTime === 'string') {
        startTime = new Date(deal.startTime);
      } else if (deal.startTime instanceof Date) {
        startTime = deal.startTime;
      }
    }

    if (deal.endTime) {
      if (deal.endTime.seconds) {
        endTime = new Date(deal.endTime.seconds * 1000);
      } else if (typeof deal.endTime.toDate === 'function') {
        endTime = deal.endTime.toDate();
      } else if (typeof deal.endTime === 'string') {
        endTime = new Date(deal.endTime);
      } else if (deal.endTime instanceof Date) {
        endTime = deal.endTime;
      }
    }

    if (!startTime || !endTime) {
      return 'material-symbols:question-mark';
    }

    if (now < startTime) {
      return 'material-symbols:pending';
    } else if (now > endTime) {
      return 'material-symbols:cancel';
    } else {
      return 'material-symbols:check-circle';
    }
  } catch (e) {
    return 'material-symbols:question-mark';
  }
};
</script>