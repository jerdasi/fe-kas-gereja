<script setup lang="ts">
import { schemaLogin, type TSchemaLogin } from "~/constants/auth";

const { login, loadingLogin } = useAuth();

const dataLogin = reactive<Partial<TSchemaLogin>>({
  email: undefined,
  password: undefined
});
</script>

<template>
  <ClientOnly>
    <p>Login Page</p>
    <UForm :schema="schemaLogin" :state="dataLogin" @submit="login(dataLogin)">
      <UFormField label="Email" name="email">
        <UInput placeholder="Enter your email" size="lg" class="w-full"  v-model="dataLogin.email"/>
      </UFormField>

      <UFormField label="Password" name="password">
        <UInput placeholder="Enter your password" size="lg" class="w-full" type="password" v-model="dataLogin.password"/>
      </UFormField>

      <UButton size="lg" class="w-full" :loading="loadingLogin" type="submit">Login</UButton>
    </UForm>

  </ClientOnly>
</template>

<style scoped></style>
