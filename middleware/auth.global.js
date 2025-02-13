export default defineNuxtRouteMiddleware((to) => {
  if (to.path === "/") {
    const authStore = useAuthStore();

    // On the client side, if the store is not yet populated, attempt to load user data from localStorage.
    if (process.client && !authStore.user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          authStore.user = JSON.parse(storedUser);
        } catch (e) {
          console.error("Failed to parse user data from localStorage", e);
        }
      }
    }

    // If still not authenticated, redirect to /login.
    if (!authStore.isAuthenticated) {
      return navigateTo("/login");
    }
  }
});
