<template>
  <div>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Breadcrumb component -->
      <breadcrumb />

      <div class="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h1 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">{{ $t('head.profile') }}</h1>

        <div class="grid gap-8 md:grid-cols-12">
          <!-- Profile Card -->
          <div class="md:col-span-4 lg:col-span-3">
            <div class="overflow-hidden bg-white rounded-lg shadow dark:bg-gray-800">
              <!-- Cover Image -->
              <div class="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

              <!-- Profile Picture and Info -->
              <div class="px-4 pb-6 -mt-12">
                <div class="flex flex-col items-center">
                  <div class="relative inline-block">
                    <img
                      class="object-cover w-24 h-24 border-4 border-white rounded-full dark:border-gray-800 sm:w-32 sm:h-32"
                      src="https://justfields.com/storage/projects/7M5rV059/vector-avatar-02.jpg" alt="Profile" />
                  </div>

                  <div class="mt-4 text-center" v-if="authStore.user">
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                      {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
                    </h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ authStore.user?.role || $t('form.admin')
                      }}</p>
                    <div class="flex items-center justify-center mt-3 space-s-2">
                      <span
                        class="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-200">
                        {{ $t('form.active') }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Profile Form -->
          <div class="md:col-span-8 lg:col-span-9">
            <div class="overflow-hidden bg-white rounded-lg shadow dark:bg-gray-800">
              <div class="px-4 py-5 border-b dark:border-gray-700 sm:px-6">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                    {{ $t('form.account_information') }}
                  </h3>
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                    {{ $t('form.admin') }}
                  </span>
                </div>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {{ $t('form.personal_details_and_password') }}
                </p>
              </div>

              <div class="px-4 py-5 sm:p-6">
                <div class="grid grid-cols-1 gap-y-6 gap-x-4">
                  <ClientOnly>
                    <!-- Personal Information Section -->
                    <div class="col-span-1">
                      <h4 class="mb-4 text-base font-medium text-gray-900 dark:text-white">
                        {{ $t('form.personal_information') }}
                      </h4>
                    </div>

                    <div class="grid grid-cols-1 col-span-1 md:grid-cols-2 gap-y-6 gap-x-4" v-if="authStore.user">
                      <div class="col-span-1">
                        <dynamic-inputs :label="t('form.first_name')" :placeholder="t('form.enter_your_first_name')"
                          type="text" name="first_name" :rules="'required|alpha_spaces'" :required="true"
                          :readonly="true" prefixIcon="material-symbols:person" v-model="authStore.user.firstName"
                          class="w-full dark:text-gray-300" />
                      </div>

                      <div class="col-span-1">
                        <dynamic-inputs :label="t('form.last_name')" :placeholder="t('form.enter_your_last_name')"
                          type="text" name="last_name" :rules="'required|alpha_spaces'" :required="true"
                          :readonly="true" prefixIcon="material-symbols:person" v-model="authStore.user.lastName"
                          class="w-full dark:text-gray-300" />
                      </div>

                      <div class="col-span-1 md:col-span-2">
                        <dynamic-inputs :label="t('form.email')" :placeholder="t('form.enter_your_email')" type="email"
                          name="email" :rules="'required|email'" :required="true" :readonly="true"
                          prefixIcon="material-symbols:alternate-email" v-model="authStore.user.email"
                          class="w-full dark:text-gray-300" />
                      </div>
                    </div>

                    <!-- Password Section -->
                    <div class="col-span-1 pt-6 mt-2 border-t dark:border-gray-700">
                      <h4 class="mb-4 text-base font-medium text-gray-900 dark:text-white">
                        {{ $t('form.change_password') }}
                      </h4>
                    </div>

                    <div class="grid grid-cols-1 col-span-1 md:grid-cols-2 gap-y-6 gap-x-4" v-if="authStore.user">
                      <div class="col-span-1">
                        <dynamic-inputs :label="t('form.password')" :placeholder="t('form.enter_your_password')"
                          type="password" name="password" :rules="'minLength:7'" prefixIcon="ri:lock-password-fill"
                          v-model="currentPassword" class="w-full dark:text-gray-300" />
                      </div>

                      <div class="col-span-1">
                        <dynamic-inputs :label="t('form.new_password')" :placeholder="t('form.enter_your_new_password')"
                          type="password" name="new_password" :rules="'required'" prefixIcon="ri:lock-password-fill"
                          v-model="newPassword" class="w-full dark:text-gray-300" />
                      </div>
                    </div>
                  </ClientOnly>
                </div>
              </div>

              <div class="px-4 py-4 border-t dark:border-gray-700 sm:px-6">
                <div class="flex justify-end">
                  <button type="button"
                    class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">
                    {{ $t('btn.cancel') }}
                  </button>
                  <button type="submit"
                    class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm ms-3 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                    @click="saveProfile" :disabled="loading">
                    <div class="flex items-center justify-center" v-if="loading">
                      <span class="text-center me-2">{{ $t('btn.saving') }}</span>
                      <icon name="svg-spinners:270-ring-with-bg" />
                    </div>
                    <span v-else>{{ $t('btn.save') }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Dynamic toast component -->
      <div class="fixed z-50 pointer-events-none bottom-5 start-5 w-96">
        <div class="pointer-events-auto">
          <dynamic-toast v-if="showToast" :message="toastMessage" :toastType="toastType" :duration="5000"
            :toastIcon="toastIcon" @toastClosed="showToast = false" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const authStore = useAuthStore();
const currentPassword = ref("");
const newPassword = ref("");
const loading = ref(false);
const { showToast, toastMessage, toastType, toastIcon, triggerToast } = useToast();

onMounted(() => {
  if (authStore.user) {
    authStore.fetchUserData(authStore.user.uid);
  } else {
    authStore.init();
  }
});

const saveProfile = () => {
  if (!currentPassword.value && newPassword.value) {
    triggerToast({
      message: t('toast.current_password_required'),
      type: 'error',
      icon: 'material-symbols:error-outline-rounded',
    });
    return;
  }

  loading.value = true;
  authStore
    .saveProfile()
    .then(() => {
      if (currentPassword.value && newPassword.value) {
        return authStore.changePassword(currentPassword.value, newPassword.value);
      }
      return Promise.resolve();
    })
    .then(() => {
      currentPassword.value = "";
      newPassword.value = "";
      triggerToast({
        message: t('toast.your_profile_has_been_successfully_updated'),
        type: 'success',
        icon: 'mdi-check-circle',
      });
    })
    .catch((error) => {
      console.error("Update error:", error);
      triggerToast({
        message: t('toast.failed_to_update_profile') + (error.message ? `: ${error.message}` : ''),
        type: 'error',
        icon: 'material-symbols:error-outline-rounded',
      });
    })
    .finally(() => {
      loading.value = false;
    });
};

definePageMeta({
  layout: 'dashboard'
})

useHead({
  titleTemplate: () => t("head.profile"),
});
</script>