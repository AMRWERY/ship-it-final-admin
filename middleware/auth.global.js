export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  const localePath = useLocalePath();

  if (process.server) return;

  await authStore.init();

  const loginPath = localePath("/login");
  const isLoginPage = to.path === loginPath;

  // Handle unauthenticated users
  if (!authStore.isAuthenticated) {
    if (!isLoginPage) {
      return navigateTo(loginPath);
    }
    return;
  }

  // Handle authenticated users
  if (isLoginPage) {
    const redirectPath =
      authStore.user?.email === "admin@ship.com"
        ? localePath("/")
        : localePath("/dashboard");
    return navigateTo(redirectPath);
  }

  // Admin protection
  if (
    to.path === localePath("/") &&
    authStore.user?.email !== "admin@ship.com"
  ) {
    return navigateTo(localePath("/dashboard"));
  }
});
