<template>
  <div>
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div
        class="flex flex-col w-full max-w-3xl bg-white rounded-xl shadow-2xl dark:bg-gray-800 max-h-[90vh] overflow-hidden">
        <!-- Header with close button -->
        <div class="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-200">
            {{ $t('head.customer_messages') }}
          </h2>
          <button @click="closeDialog"
            class="p-1 transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <icon name="material-symbols:close" class="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div class="overflow-y-auto no-scrollbar">
          <div v-if="messages?.length" class="flex flex-col gap-4 p-2 md:flex-row">
            <!-- Customer Info Section -->
            <div class="flex-1 p-3 rounded-lg shadow-md bg-gray-50 dark:bg-gray-600">
              <div class="flex items-center mb-4 space-s-2">
                <icon name="mdi:account" class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-300">
                  {{ $t('dashboard.customer_info') }}
                </h3>
              </div>

              <div class="space-y-4">
                <div class="flex items-start space-s-3">
                  <icon name="mdi:account-circle" class="w-5 h-5 mt-0.5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('dashboard.customer_name') }}
                    </p>
                    <p class="text-base text-gray-700 dark:text-gray-200">{{ message.name }}</p>
                  </div>
                </div>

                <div class="flex items-start space-s-3">
                  <icon name="mdi:email" class="w-5 h-5 mt-0.5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('dashboard.email') }}</p>
                    <p class="text-base text-gray-700 dark:text-gray-200">{{ message.email }}</p>
                  </div>
                </div>

                <div class="flex items-start space-s-3" v-if="message.date">
                  <icon name="mdi:calendar" class="w-5 h-5 mt-0.5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('dashboard.date') }}</p>
                    <p class="text-base text-gray-700 dark:text-gray-200">{{ message.date }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Customer message Section -->
            <div class="flex-1 p-3 bg-white rounded-lg shadow-md dark:bg-gray-600">
              <div class="flex items-center mb-4 space-s-2">
                <icon name="mdi:message-text" class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-300">
                  {{ $t('dashboard.message') }}
                </h3>
              </div>

              <div
                class="p-4 mb-6 border-2 border-gray-200 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-500 dark:border-gray-300">
                <p class="text-base text-gray-700 whitespace-pre-line dark:text-gray-200">
                  {{ message.message }}
                </p>
              </div>

              <!-- Reply section -->
              <div class="pt-4 mt-6 border-t dark:border-gray-600">
                <button @click="toggleReply"
                  class="flex items-center px-4 py-2 mb-4 text-sm font-medium text-indigo-600 transition-colors bg-white border border-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white dark:bg-gray-700 dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-indigo-500 dark:hover:text-white">
                  <icon name="mdi:reply" class="w-4 h-4 me-2" />
                  {{ $t('btn.reply') }}
                </button>

                <div v-if="showReply" class="mt-3 space-y-3">
                  <ClientOnly>
                    <dynamic-inputs :placeholder="t('form.write_your_reply_here')" type="textarea"
                      :rules="'required|length:100'" name="your_reply" v-model="replyMessage" />
                  </ClientOnly>

                  <button @click="sendReply" :disabled="loading"
                    class="w-full px-4 py-2 text-sm font-medium text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed">
                    <div class="flex items-center justify-center" v-if="loading">
                      <span class="text-center me-2">{{ $t('btn.sending_reply') }}...</span>
                      <icon name="svg-spinners:6-dots-rotate" />
                    </div>
                    <span v-else class="flex items-center justify-center">
                      <icon name="mdi:send" class="w-4 h-4 me-2" />
                      {{ $t('btn.send_reply') }}
                    </span>
                  </button>
                </div>

                <div v-if="replySentSuccessfully" class="p-3 mt-4 rounded-lg bg-green-50 dark:bg-green-900/30">
                  <div class="flex items-center">
                    <icon name="mdi:check-circle" class="w-5 h-5 text-green-600 me-2 dark:text-green-400" />
                    <p class="text-green-700 dark:text-green-400">{{ $t('toast.your_message_sent_successfully') }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()

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