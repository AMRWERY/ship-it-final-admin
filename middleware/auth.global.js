export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  // Wait for auth initialization on client
  if (process.client) {
    await authStore.init();
  }

  // Redirect unauthenticated users trying to access protected routes
  if (!authStore.isAuthenticated && to.path !== "/login") {
    return navigateTo("/login");
  }

  // Redirect authenticated users away from login
  if (authStore.isAuthenticated && to.path === "/login") {
    return navigateTo("/");
  }
});
