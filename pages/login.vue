<template>
  <div>
    <div class="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div class="w-full max-w-md p-4 space-y-8 bg-white shadow-xl dark:bg-gray-800 rounded-xl">
        <div class="text-center">
          <img src="@/public/shopping-bags.svg" alt="shopping-bags" class="w-auto h-24 mx-auto" />
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            {{ $t('form.sign_in_to_your_account') }}
          </h2>
        </div>

        <div class="mt-8 space-y-6">
          <div class="space-y-5">
            <div>
              <dynamic-inputs :label="t('form.email')" :placeholder="t('form.enter_your_email')" type="email"
                name="email" :rules="'required|email'" :required="true" prefixIcon="material-symbols:alternate-email"
                v-model="email" class="w-full" />
            </div>

            <div>
              <dynamic-inputs :label="t('form.password')" :placeholder="t('form.enter_your_password')" type="password"
                name="password" :rules="'required|minLength:7'" :required="true" prefixIcon="ri:lock-password-fill"
                v-model="password" class="w-full" />
            </div>
          </div>

          <div>
            <button type="submit" :disabled="loading" @click="handleLogin"
              class="relative flex justify-center w-full px-4 py-3 text-sm font-medium text-white transition-colors duration-200 bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed dark:bg-indigo-700 dark:hover:bg-indigo-600">
              <div class="flex items-center justify-center" v-if="loading">
                <span class="text-center me-2">{{ $t('btn.logging') }}...</span>
                <icon name="svg-spinners:90-ring" />
              </div>
              <span v-else>{{ $t('btn.login') }}</span>
            </button>
          </div>
        </div>

        <div v-if="errorMessage"
          class="p-3 mt-4 text-sm text-center text-red-500 rounded-md bg-red-50 dark:bg-red-900/20">
          {{ errorMessage }}
        </div>
      </div>

      <!-- dynamic-toast component  -->
      <div class="fixed z-50 pointer-events-none bottom-5 start-5 sm:w-96 w-full max-w-[calc(100%-2rem)] mx-2 sm:mx-0">
        <div class="pointer-events-auto">
          <dynamic-toast v-if="showToast" :message="toastMessage" :toastType="toastType" :duration="5000"
            :toastIcon="toastIcon" @toastClosed="showToast = false" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const themeStore = useThemeStore();
const { t } = useI18n()
const { showToast, toastMessage, toastType, toastIcon, triggerToast } = useToast();

const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    await authStore.loginUser(email.value, password.value);
    triggerToast({
      message: t('toast.successfully_logged_in'),
      type: 'success',
      icon: 'mdi-check-circle',
    });
    setTimeout(() => {
      navigateTo('/');
    }, 2000);
  } catch (error) {
    errorMessage.value = t('toast.failed_to_login');
    triggerToast({
      message: errorMessage.value,
      type: 'error',
      icon: 'material-symbols:error-outline-rounded',
    });
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await authStore.init();
  themeStore.loadTheme();

  // Auto-focus email field
  setTimeout(() => {
    const emailInput = document.querySelector('input[name="email"]');
    if (emailInput) emailInput.focus();
  }, 100);
});

useHead({
  titleTemplate: () => t("head.login"),
});
</script>