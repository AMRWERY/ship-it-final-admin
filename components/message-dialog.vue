<template>
  <div>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
      <div class="flex flex-col w-full max-w-3xl p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div v-if="messages?.length" class="flex flex-col gap-4 md:flex-row space-s-6">
          <!-- Customer Info Section -->
          <div class="flex-1 p-6 rounded-lg shadow-md bg-gray-50 dark:bg-gray-700">
            <h3 class="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-300">
              {{ message.name }} {{ $t('dashboard.s_information') }}
            </h3>
            <div class="space-y-3">
              <p class="text-sm text-gray-700 dark:text-gray-200">
                <span class="font-semibold">{{ $t('dashboard.customer_name') }}:</span>
                {{ message.name }}
              </p>
              <p class="text-sm text-gray-700 dark:text-gray-200">
                <span class="font-semibold">{{ $t('dashboard.email') }}:</span>
                {{ message.email }}
              </p>
            </div>
          </div>

          <!-- Customer message Section with Hidden Scroll -->
          <div class="flex-1 p-6 bg-gray-100 rounded-lg shadow-md dark:bg-gray-700">
            <h3 class="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-300">
              {{ $t('head.customer_messages') }}
            </h3>
            <div class="space-y-4 overflow-y-auto max-h-96 custom-scroll">
              <div class="flex-1">
                <p class="text-base font-normal text-gray-900 dark:text-gray-200">
                  {{ message.message }}
                </p>
              </div>
            </div>

            <!-- reply message -->
            <div class="mt-4">
              <button @click="toggleReply"
                class="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-100 dark:text-blue-400 dark:border-blue-400">
                {{ $t('btn.reply') }}
              </button>
              <div v-if="showReply" class="mt-3">
                <textarea v-model="replyMessage" placeholder="Write your reply here..." rows="4"
                  class="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-400"></textarea>
                <button @click="sendReply" :disabled="loading"
                  class="px-4 py-2 mt-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700">
                  <div class="flex items-center justify-center" v-if="loading">
                    <span class="text-center me-2">{{ $t('btn.sending_reply') }}...</span>
                    <icon name="svg-spinners:270-ring-with-bg" />
                  </div>
                  <span v-else>{{ $t('btn.send_reply') }}</span>
                </button>
              </div>
            </div>

            <div v-if="replySentSuccessfully" class="w-full mt-2">
              <p class="font-normal text-center text-green-800">{{ $t('toast.your_message_sent_successfully') }}</p>
            </div>
          </div>
        </div>

        <!-- Close Button -->
        <div class="flex justify-end mt-6">
          <button class="px-6 py-2.5 btn-style" @click="closeDialog">
            {{ $t('btn.close') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  message: Object
});

const emit = defineEmits(['close']);

const contactStore = useContactStore();
const messages = computed(() => contactStore?.messages || []);

const closeDialog = () => {
  emit('close');
};

const showReply = ref(false);
const replyMessage = ref('');
const replySentSuccessfully = ref(false)
const loading = ref(false)

const toggleReply = () => {
  showReply.value = !showReply.value;
};

const sendReply = () => {
  if (!replyMessage.value.trim()) {
    return;
  }
  const messageId = props.message.id;
  if (!messageId) {
    return;
  }
  loading.value = true
  contactStore.replyToMessage(messageId, replyMessage.value)
    .then((result) => {
      if (result) {
        replySentSuccessfully.value = true
        replyMessage.value = "";
        showReply.value = false;
        setTimeout(() => {
          replySentSuccessfully.value = false;
        }, 3000);
      } else {
        replySentSuccessfully.value = false
      }
    })
    .catch((error) => {
      replySentSuccessfully.value = false
      return error
    }).finally(() => {
      loading.value = false;
    });
};
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  display: none;
}

.custom-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>