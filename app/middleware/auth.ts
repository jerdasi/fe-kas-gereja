export default defineNuxtRouteMiddleware((to, from) => {
  const { accessToken } = useAuth();

  if (!accessToken.value) {
    return navigateTo("/admin/login");
  }
});
