<template>
  <div>
    <!-- breadcrumb component -->
    <breadcrumb />

    <div class="max-w-full mx-auto sm:px-6 lg:px-8">
      <div class="flex flex-col p-6 bg-white sm:flex-row dark:bg-[#181a1b]">
        <div class="w-full pe-4 sm:w-2/3">
          <div class="grid grid-cols-1 mt-10 gap-x-6 gap-y-8 sm:grid-cols-6">
            <ClientOnly>
              <div class="sm:col-span-3" v-if="authStore.user">
                <dynamic-inputs :label="t('form.first_name')" :placeholder="t('form.enter_your_first_name')" type="text"
                  name="first_name" :rules="'required|alpha_spaces'" :required="true" :readonly="true"
                  prefixIcon="material-symbols:person" v-model="authStore.user.firstName" />
              </div>

              <div class="sm:col-span-3" v-if="authStore.user">
                <dynamic-inputs :label="t('form.last_name')" :placeholder="t('form.enter_your_last_name')" type="text"
                  name="last name" :rules="'required|alpha_spaces'" :required="true" :readonly="true"
                  prefixIcon="material-symbols:person" v-model="authStore.user.lastName" />
              </div>

              <div class="sm:col-span-full" v-if="authStore.user">
                <dynamic-inputs :label="t('form.email')" :placeholder="t('form.enter_your_email')" type="email"
                  name="email" :rules="'required|email'" :required="true" :readonly="true"
                  prefixIcon="material-symbols:alternate-email" v-model="authStore.user.email" />
              </div>

              <div class="sm:col-span-3" v-if="authStore.user">
                <dynamic-inputs :label="t('form.password')" :placeholder="t('form.enter_your_password')" type="password"
                  name="password" :rules="'minLength:7'" prefixIcon="ri:lock-password-fill" v-model="currentPassword" />
              </div>

              <div class="sm:col-span-3" v-if="authStore.user">
                <dynamic-inputs :label="t('form.new_password')" :placeholder="t('form.enter_your_new_password')"
                  type="password" name="password" :rules="'required'" prefixIcon="ri:lock-password-fill"
                  v-model="newPassword" />
              </div>
            </ClientOnly>

          </div>
          <div class="flex items-center justify-end gap-x-6">
            <button type="submit" class="px-4 py-2 mt-5 btn-style" @click="saveProfile">
              <div class="flex items-center justify-center" v-if="loading">
                <span class="text-center me-2">{{ $t('btn.saving') }}</span>
                <icon name="svg-spinners:270-ring-with-bg" />
              </div>
              <span v-else>{{ $t('btn.save') }}</span>
            </button>
          </div>
        </div>

        <div class="w-full mt-4 sm:w-1/3 sm:mt-0">
          <div
            class="max-w-2xl mx-4 mt-6 text-gray-900 bg-white rounded-lg shadow-xl sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto dark:bg-[#181a1b]">
            <div class="h-32 overflow-hidden rounded-t-lg">
              <img class="object-cover object-top w-full"
                src="https://justfields.com/storage/projects/7M5rV059/Mountain.jpg" alt="Mountain" />
            </div>
            <div class="relative w-32 h-32 mx-auto -mt-16 overflow-hidden border-4 border-white rounded-full">
              <img class="object-cover object-center h-32"
                src="https://justfields.com/storage/projects/7M5rV059/vector-avatar-02.jpg" alt="Profile" />
            </div>
            <div class="mt-2 text-center" v-if="authStore.user">
              <h2 class="font-semibold dark:text-gray-200">{{ authStore.user?.firstName }} {{ authStore.user?.lastName
                }}</h2>
              <p class="pb-4 text-gray-500 dark:text-gray-100">{{ authStore.user?.role }}</p>
            </div>
          </div>
        </div>
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
const { t } = useI18n()
const authStore = useAuthStore();
const currentPassword = ref("");
const newPassword = ref("");
const loading = ref(false);
const { showToast, toastTitle, toastMessage, toastType, toastIcon, triggerToast } = useToast();

onMounted(() => {
  if (authStore.user) {
    authStore.fetchUserData(authStore.user.uid);
  } else {
    authStore.init();
  }
});

const saveProfile = () => {
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
      triggerToast({
        title: t('toast.successfully_updated'),
        message: t('toast.your_profile_has_been_successfully_updated'),
        type: 'success',
        icon: 'mdi-check-circle',
      });
    })
    .catch((error) => {
      console.error("Update error:", error);
      triggerToast({
        title: t('toast.error'),
        message: t('toast.failed_to_update_profile'),
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