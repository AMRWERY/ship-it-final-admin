export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  // Skip middleware execution on the server
  if (process.server) return;

  // Wait for auth initialization on the client
  await authStore.init();

  // Redirect unauthenticated users trying to access protected routes
  if (!authStore.isAuthenticated && to.path !== "/login") {
    return navigateTo("/login");
  }

  if (authStore.isAuthenticated) {
    // Redirect from login page based on role
    if (to.path === "/login") {
      return authStore.user?.email === "admin@ship.com"
        ? navigateTo("/")
        : navigateTo("/dashboard");
    }

    // Admin-only route protection
    if (to.path === "/" && authStore.user?.email !== "admin@ship.com") {
      return navigateTo("/dashboard");
    }
  }
});
