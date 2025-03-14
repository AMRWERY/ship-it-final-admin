<template>
  <div>
    <!-- breadcrumb component -->
    <breadcrumb />

    <div class="flex flex-col items-start justify-between mb-8 md:flex-row md:items-center">
      <h3 class="py-2 mt-5 text-2xl font-bold text-start">
        {{ $t('dashboard.customer_messages') }}
      </h3>
      <div class="flex items-end space-s-4">
        <div class="flex flex-col">
          <span class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-100">
            {{ $t('form.start_date') }}
          </span>
          <!-- Date-picker component -->
          <date-picker v-model="startDate" />
        </div>
        <div class="flex flex-col">
          <span class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-100">
            {{ $t('form.end_date') }}
          </span>
          <!-- Date-picker component -->
          <date-picker v-model="endDate" />
        </div>
        <button @click="filterOrdersByDate" class="px-4 py-2 btn-style">
          {{ $t('btn.filter') }}
        </button>
      </div>
    </div>

    <div
      class="relative flex flex-col w-full h-full overflow-scroll overflow-y-hidden text-gray-700 bg-white rounded-lg shadow-md bg-clip-border dark:bg-black dark:text-gray-200">
      <table class="w-full table-auto text-start min-w-max">
        <thead>
          <tr>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-normal leading-none text-slate-500 dark:text-gray-100">
                #
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-normal leading-none text-slate-500 dark:text-gray-100">
                {{ $t('dashboard.email') }}
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-normal leading-none text-slate-500 dark:text-gray-100">
                {{ $t('dashboard.customer_name') }}
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-normal leading-none text-slate-500 dark:text-gray-100">
                {{ $t('dashboard.date') }}
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
            </th>
          </tr>
        </thead>

        <tbody v-if="contactStore.paginatedMessages.length === 0">
          <tr>
            <td colspan="10" class="p-4 text-center">
              <p class="text-xl font-semibold text-gray-800 dark:text-white">{{ $t('dashboard.no_meesages_found') }}</p>
            </td>
          </tr>
        </tbody>

        <tbody v-else>
          <tr class="border-b hover:bg-slate-50 border-slate-200 dark:hover:bg-slate-600"
            v-for="(message, index) in contactStore.paginatedMessages" :key="message.id">
            <td class="p-4 py-5">
              <p class="block text-sm font-semibold text-slate-800 dark:text-slate-200">{{ (contactStore.currentPage -
                1) *
                contactStore.messagesPerPage +
                index +
                1 }}</p>
            </td>
            <td class="p-4 py-5">
              <p class="block text-sm text-slate-500 dark:text-slate-100">{{ message.email }}</p>
            </td>
            <td class="p-4 py-5">
              <p class="text-sm text-slate-500 dark:text-slate-100">{{ message.name }}</p>
            </td>
            <td class="p-4 py-5">
              <p class="text-sm text-slate-500 dark:text-slate-100">{{ message.date }}</p>
            </td>
            <td class="p-4 py-5">
              <nuxt-link to="" role="button" class="text-sm text-blue-700 cursor-pointer dark:text-blue-400"
                @click="openMessageDetails(message)">
                <div class="flex items-center justify-center">
                  <icon name="svg-spinners:tadpole" v-if="message.loadingView" />
                  <span v-else>{{ $t('btn.view_message') }}</span>
                </div>
              </nuxt-link>
            </td>
            <td class="p-4 py-5">
              <tooltip :text="$t('tooltip.delete_message')" position="bottom">
                <button type="button" @click="deleteMessage(message.id)">
                  <icon name="svg-spinners:tadpole" class="text-blue-500" v-if="message.loadingDelete" />
                  <icon name="material-symbols:delete-sharp" class="text-red-700 dark:text-red-400" v-else />
                </button>
              </tooltip>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="flex items-center px-4 py-3" v-if="contactStore.paginatedMessages.length > 0">
        <div class="flex mt-3 space-s-1 ms-auto">
          <button @click="contactStore.changePage(contactStore.currentPage - 1)"
            :disabled="contactStore.currentPage === 1"
            class="px-3 py-1 text-sm font-normal transition duration-200 bg-white border rounded dark:bg-slate-800 dark:text-white min-w-9 min-h-9 text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-400 ease">
            {{ $t('pagination.previous') }}
          </button>
          <button v-for="page in contactStore.totalPages" :key="page" @click="contactStore.changePage(page)" :class="{
            'bg-slate-800 text-white': page === contactStore.currentPage,
            'bg-white text-slate-500': page !== contactStore.currentPage,
          }"
            class="px-3 py-1 text-sm font-normal transition duration-200 border rounded min-w-9 min-h-9 border-slate-200 hover:bg-slate-50 hover:border-slate-400 ease">
            {{ page }}
          </button>
          <button @click="contactStore.changePage(contactStore.currentPage + 1)"
            :disabled="contactStore.currentPage === contactStore.totalPages"
            class="px-3 py-1 text-sm font-normal transition duration-200 bg-white border rounded dark:bg-slate-800 dark:text-white min-w-9 min-h-9 text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-400 ease">
            {{ $t('pagination.next') }}
          </button>
        </div>
      </div>
    </div>

    <!-- order-details-dialog component -->
    <transition name="dialog">
      <message-dialog v-if="isDialogOpen" :message="selectedMessage" @close="closeDialog" />
    </transition>

    <!-- dynamic-toast component -->
    <div class="fixed z-50 pointer-events-none bottom-5 start-5 w-96">
      <div class="pointer-events-auto">
        <dynamic-toast v-if="showToast" :message="toastMessage" :toastType="toastType"
          :duration="5000" :toastIcon="toastIcon" @toastClosed="showToast = false" />
      </div>
    </div>
  </div>
</template>

<script setup>
const contactStore = useContactStore();
const { showToast, toastMessage, toastType, toastIcon, triggerToast } = useToast();

onMounted(() => {
  contactStore.fetchMessages()
})

const isDialogOpen = ref(false);
const selectedMessage = ref({});

const openMessageDetails = (message) => {
  message.loadingView = true;
  selectedMessage.value = message;
  new Promise((resolve) => setTimeout(resolve, 2000))
    .then(() => {
      message.loadingView = false;
      isDialogOpen.value = true;
    });
};

const closeDialog = () => {
  isDialogOpen.value = false;
  selectedMessage.value = {};
};

const { t } = useI18n()

const deleteMessage = (messageId) => {
  const message = contactStore.paginatedMessages.find(o => o.id === messageId);
  if (message) {
    message.loadingDelete = true;
  }
  contactStore.deleteMessage(messageId)
    .then(() => {
      contactStore.paginatedMessages = contactStore.paginatedMessages.filter(message => message.id !== messageId);
      triggerToast({
        message: t('toast.message_deleted'),
        type: 'success',
        icon: 'mdi:check-circle',
      });
    })
    .catch(() => {
      triggerToast({
        message: t('toast.message_deletion_failed'),
        type: 'error',
        icon: 'mdi:alert-circle',
      });
    })
    .finally(() => {
      setTimeout(() => {
        if (message) {
          message.loadingDelete = false;
        }
      }, 3000);
    });
};

const startDate = ref('');
const endDate = ref('');

const filterOrdersByDate = () => {
  if (!startDate.value || !endDate.value) {
    alert('Please select both start and end dates');
    return;
  }
  const filteredMessages = contactStore.messages.filter(message => {
    const messageDate = new Date(message.date);
    return messageDate >= new Date(startDate.value) && messageDate <= new Date(endDate.value);
  });
  contactStore.paginatedMessages = filteredMessages;
};

definePageMeta({
  layout: 'dashboard'
})

useHead({
  titleTemplate: () => t("head.customer_messages"),
});
</script>