<template>
  <div class="h-full w-[400px] mx-auto content-center">
    <div class="flex flex-col h-[300px] justify-center border px-4">
      <div class="text-center text-3xl pb-6">Login</div>
      <form id="form" :onsubmit="login">
          <div class="">
            <label for="email">Email address</label>
          </div>
          <div class="">
            <input class="border w-full" name="email" type="email" label="email" required></input>
          </div>
          <div class="">
            <label for="password">Password</label>
          </div>
          <div class="">
            <input class="border w-full" name="password" type="password" label="password" required></input>
          </div>
        <div class="text-center py-2">
          <input class="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300 ease-in-out" type="submit" value="login" />
        </div>
    </form>
  </div>
</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import { useLogin } from '@/composables/login';
const { authenticate } = useLogin();

import { useRouter } from 'vue-router';
const router = useRouter();

onMounted(() => {
  const token = localStorage.getItem('token');
  if (token) {
    router.push({ name: 'home' });
  }
})

async function login() {
  const email = document.getElementsByName("email")[0].value
  const password = document.getElementsByName("password")[0].value
  try {
    await authenticate(email, password);

    router.push({ name: 'home' });

  } catch (error) {
    console.log(error)
  }

  // TODO: fix this part so that page does not reload etc
  return false
}
</script>