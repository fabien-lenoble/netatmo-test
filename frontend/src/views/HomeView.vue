<template>
    <div class="p-4 bg-slate-100 h-full">
      <div class="flex w-full gap-x-10 h-full">
        <div class="basis-1/6">
          <home-menu />
        </div>
        <div class="grow">
          <home-graph />
        </div>
        <div class="basis-1/4">
          <home-rooms />
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { useApi } from "@/composables/api";
import { useHome } from "@/composables/home";
const { getHomesData, getCurrentHomeMeasures, getCurrentHomeStatus } = useHome();

import HomeGraph from "@/components/Home/GraphComponent.vue";
import HomeMenu from "@/components/Home/MenuComponent.vue";
import HomeRooms from "@/components/Home/RoomsComponent.vue";
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const { token } = useApi();

onMounted(async () => {
  if (!token.value) {
    router.push({ name: 'login' });
  } else {
    await getHomesData()
    await getCurrentHomeMeasures()
    await getCurrentHomeStatus()
  }
})
</script>