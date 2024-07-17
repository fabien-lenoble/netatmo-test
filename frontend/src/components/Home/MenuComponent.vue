<template>
    <div class="h-full flex flex-col gap-y-2 font-medium">
        <div class="text-xl pb-6">Home Weather</div>
        <div class="bg-blue-100 text-blue-400  mb-2 py-2 px-4 rounded">Control</div>
        <hr>
        <div class="hover:bg-blue-100 hover:text-blue-400 mt-2 py-2 px-4">Paramètres</div>
        <div class="hover:bg-blue-100 hover:text-blue-400 py-2 px-4">Aide</div>
        <button class="text-start hover:bg-blue-100 hover:text-blue-400 py-2 px-4 rounded" @click="handleLogout">Déconnexion</button>
    </div>
</template>

<script setup lang="ts">
import { useLogin } from "@/composables/login";
import { useRouter } from 'vue-router';
const router = useRouter();
const { logout } = useLogin();

async function handleLogout() {
    await logout();
    router.push({ name: 'login' });
}
</script>