export const useAuthPage = () => {
  const route = useRoute();

  const isAuthPage = computed(() =>
    ["/sign-up", "/login"].includes(route.path)
  );

  return { isAuthPage };
};
