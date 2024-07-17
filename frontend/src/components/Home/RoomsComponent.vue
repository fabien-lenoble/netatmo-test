<template>
    <div class="flex flex-col gap-y-6">
        <div
            v-for="room in currentRooms"
            :key="room.id"
            class="bg-white rounded-xl flex flex-col pt-2"
        >
            <div class="flex flex-row py-4 px-8 font-bold justify-between border-b border-slate-100">
                <div class="">{{ room.name }}</div>
                <div class="">{{ room.status?.Temperature }} {{ getStatusTypeUnit("Temperature") }}</div>
            </div>
            <div
                v-for="(value, statusType) in room.status"
                :key="statusType"
                class="py-3 px-6 border-b border-slate-100"
                :class="{ 'bg-blue-100': isSelected(room.id, statusType) }"
                @click="setSelectedStatusReferences(room.id, statusType, room.moduleId)"
            >
                <div class="font-medium pb-2">
                    {{ statusType }}
                </div>
                <span class="font-medium text-blue-500">
                    {{ value }}
                </span>
                <span class="font-medium text-slate-400">
                {{ getStatusTypeUnit(statusType) }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useHome } from "@/composables/home";
import type { Status } from "@/composables/types";
const { currentRooms, selectedStatusReferences, setSelectedStatusReferences } = useHome();

function isSelected(roomId: string, statusType: "Temperature" | "Humidity" | "Pressure") {
    return selectedStatusReferences.value?.roomId === roomId.toString() && selectedStatusReferences.value?.statusType === statusType;
}

function getStatusTypeUnit(statusType: Status) {
    switch (statusType) {
        case "Temperature":
            return "°C";
        case "Humidity":
            return "%";
        case "Pressure":
            return "ppm";
    }
}
</script>