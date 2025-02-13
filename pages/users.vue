<template>
  <div>
    <!-- breadcrumb component -->
    <breadcrumb />

    <h3 class="py-2 mt-5 mb-12 text-2xl font-bold text-start">{{ $t('dashboard.users') }}</h3>
    <div
      class="relative flex flex-col w-full h-full overflow-scroll overflow-y-hidden text-gray-700 bg-white rounded-lg shadow-md bg-clip-border dark:bg-black dark:text-gray-200">
      <table class="w-full table-auto text-start min-w-max">
        <thead>
          <tr>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                #
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                {{ $t('dashboard.email') }}
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                {{ $t('dashboard.first_name') }}
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                {{ $t('dashboard.last_name') }}
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
              <p class="text-sm font-semibold leading-none text-slate-500 dark:text-gray-100">
                {{ $t('dashboard.status') }}
              </p>
            </th>
            <th class="p-4 border-b border-slate-200 bg-slate-50 dark:bg-black">
            </th>
          </tr>
        </thead>

        <tbody v-if="userStore.paginatedUsers.length === 0">
          <tr>
            <td colspan="10" class="p-4 text-center">
              <!-- skeleton-loader component -->
              <skeleton-loader />
            </td>
          </tr>
        </tbody>

        <tbody v-else>
          <tr class="border-b hover:bg-slate-50 border-slate-200 dark:hover:bg-slate-600"
            v-for="(user, index) in userStore.paginatedUsers" :key="user.id">
            <td class="p-4 py-5">
              <p class="block text-sm font-semibold text-slate-800 dark:text-slate-200">{{ (userStore.currentPage - 1) *
                userStore.usersPerPage + index +
                1 }}</p>
            </td>
            <td class="p-4 py-5">
              <p class="block text-sm text-slate-500 dark:text-slate-100">{{ user.email }}</p>
            </td>
            <td class="p-4 py-5">
              <p class="text-sm text-slate-500 dark:text-slate-100">{{ user.firstName }}</p>
            </td>
            <td class="p-4 py-5">
              <p class="text-sm text-slate-500 dark:text-slate-100">{{ user.lastName }}</p>
            </td>
            <td class="p-4 py-5">
              <p class="text-sm font-semibold"
                :class="user.isBlocked ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-500'">
                {{ user.isBlocked ? $t('dashboard.blocked') : $t('dashboard.active') }}
              </p>
            </td>
            <td class="p-4 py-5">
              <div class="flex space-s-2">
                <tooltip :text="$t('tooltip.delete_user')" position="bottom">
                  <button @click="removeUser(user.id)"
                    class="flex items-center justify-center w-8 h-8 text-red-500 rounded hover:text-red-600 dark:text-red-400 dark:hover:text-red-500">
                    <icon v-if="removingUser === user.id" name="svg-spinners:6-dots-rotate" size="20px"
                      class="text-red-500" />
                    <icon name="grommet-icons:form-trash" class="w-6 h-6" v-else />
                  </button>
                </tooltip>

                <tooltip :text="user.isBlocked ? $t('tooltip.unblock_user') : $t('tooltip.block_user')"
                  position="bottom">
                  <button @click="userStore.toggleBlockUser(user.id)"
                    class="flex items-center justify-center w-8 h-8 rounded"
                    :class="user.isBlocked ? 'text-green-500 hover:text-green-700 dark:text-green-500 dark:hover:text-green-600' : 'text-yellow-500 hover:text-yellow-600 dark:text-yellow-300 dark:hover:text-yellow-400'">
                    <icon :name="user.isBlocked ? 'heroicons-solid:check-circle' : 'heroicons-solid:ban'"
                      class="w-6 h-6" />
                  </button>
                </tooltip>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- pagination -->
    <div class="flex items-center px-4 py-3">
      <div class="flex mt-3 space-x-1 ms-auto">
        <button @click="userStore.changePage(userStore.currentPage - 1)" :disabled="userStore.currentPage === 1"
          class="px-3 py-1 text-sm font-normal transition duration-200 bg-white border rounded min-w-9 min-h-9 text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-400 ease">
          {{ $t('pagination.previous') }}
        </button>
        <button v-for="page in userStore.totalPages" :key="page" @click="userStore.changePage(page)" :class="{
          'bg-slate-800 text-white': page === userStore.currentPage,
          'bg-white text-slate-500': page !== userStore.currentPage,
        }"
          class="px-3 py-1 text-sm font-normal transition duration-200 border rounded min-w-9 min-h-9 border-slate-200 ease">
          {{ page }}
        </button>
        <button @click="userStore.changePage(userStore.currentPage + 1)"
          :disabled="userStore.currentPage === userStore.totalPages"
          class="px-3 py-1 text-sm font-normal transition duration-200 bg-white border rounded min-w-9 min-h-9 text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-400 ease">
          {{ $t('pagination.next') }}
        </button>
      </div>
    </div>

    <!-- dynamic-toast component -->
    <div class="fixed z-50 pointer-events-none bottom-5 start-5 w-96">
      <div class="pointer-events-auto">
        <dynamic-toast v-if="showToast" :title="toastTitle" :message="toastMessage" :toastType="toastType"
          :duration="5000" :toastIcon="toastIcon" @toastClosed="showToast = false" />
      </div>
    </div>
  </div>
</template>

<script setup>
const userStore = useUserStore();

const removingUser = ref(null);

const { t } = useI18n()
const { showToast, toastTitle, toastMessage, toastType, toastIcon, triggerToast } = useToast();

const removeUser = (userId) => {
  if (!userId) {
    // console.error("No userId provided for removal.");
    return;
  }
  removingUser.value = userId;
  userStore
    .deleteUser(userId)
    .then(() => {
      setTimeout(() => {
        removingUser.value = null;
      }, 3000);
      triggerToast({
        title: t('toast.great'),
        message: t('toast.user_deleted_successfully'),
        type: 'success',
        icon: 'mdi-check-circle',
      });
    })
    .catch((error) => {
      console.error("Error removing user:", error);
    });
};

onMounted(() => {
  userStore.fetchUsers();
});

onMounted(async () => {
  await userStore.fetchUsers();
});

definePageMeta({
  layout: 'dashboard'
})

useHead({
  titleTemplate: () => t("head.users"),
});
</script>