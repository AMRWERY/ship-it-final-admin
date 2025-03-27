<template>
  <div>
    <div class="flex items-center max-w-screen-xl min-h-screen px-4 mx-auto">
      <div class="w-full max-w-md mx-auto">
        <ClientOnly>
          <div class="p-4 space-y-4 rounded-lg shadow-lg dark:shadow-2xl dark:border-gray-100 dark:border">
            <img src="@/public/shopping-bags.svg" alt="shopping-bags" class="mx-auto w-36 h-36" />
            <p class="mb-10 text-2xl font-bold text-center text-gray-800 dark:text-gray-200 sm:text-3xl">{{
              $t('form.sign_in_to_your_account')
            }}</p>
            <div>
              <dynamic-inputs :label="t('form.email')" :placeholder="t('form.enter_your_email')" type="email"
                name="email" :rules="'required|email'" :required="true" prefixIcon="material-symbols:alternate-email"
                v-model="email" />
            </div>
            <div>
              <dynamic-inputs :label="t('form.password')" :placeholder="t('form.enter_your_password')" type="password"
                name="password" :rules="'required|minLength:7'" :required="true" prefixIcon="ri:lock-password-fill"
                v-model="password" />
            </div>

            <div class="mt-6">
              <button type="submit" :disabled="loading" @click="handleLogin" class="block w-full px-4 py-2 btn-style">
                <div class="flex items-center justify-center" v-if="loading">
                  <span class="text-center me-2">{{ $t('btn.logging') }}...</span>
                  <icon name="svg-spinners:90-ring" />
                </div>
                <span v-else>{{ $t('btn.login') }}</span>
              </button>

            </div>
            <div v-if="errorMessage" class="mt-2 text-sm text-center text-red-500">
              {{ errorMessage }}
            </div>
          </div>
        </ClientOnly>
      </div>
    </div>

    <!-- dynamic-toast component  -->
    <div class="fixed z-50 pointer-events-none bottom-5 start-5 w-96">
      <div class="pointer-events-auto">
        <dynamic-toast v-if="showToast" :message="toastMessage" :toastType="toastType" :duration="5000"
          :toastIcon="toastIcon" @toastClosed="showToast = false" />
      </div>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const themeStore = useThemeStore();
const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');
const { t } = useI18n()
const { showToast, toastMessage, toastType, toastIcon, triggerToast } = useToast();

const handleLogin = async () => {
  loading.value = true;
  try {
    await authStore.loginUser(email.value, password.value);
    triggerToast({
      message: t('toast.successfully_logged_in'),
      type: 'success',
      icon: 'mdi-check-circle',
    });
    setTimeout(() => {
      navigateTo('/');
    }, 3000);
  } catch (error) {
    triggerToast({
      message: t('toast.failed_to_login'),
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
});

useHead({
  titleTemplate: () => t("head.login"),
});
</script>