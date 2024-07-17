import { computed, ref } from "vue";

import { useApi } from "@/composables/api";
import type { Status } from "./types";
const { callApi } = useApi();

const homesData = ref();
const currentHomeId = ref();
const homeMeasures = ref();
const homeStatus = ref();

const currentHome = computed(() => {
    if (!homesData.value || currentHomeId.value === null) {
        return null;
    }

    return homesData.value.find(home => home.id === currentHomeId.value);
})

const currentRooms = computed(() => {
    if (!currentHome.value) {
        return []
    }
    const rooms = currentHome.value.rooms.map(room => {
        // for now get the first module of the room, unsure if there is supposed to be only one module everytime
        // or if I need to get the average for each status (humidity, temperature, etc) for every module in the room
        const firstModuleId = room.modules[0]
        const moduleStatus = homeStatus.value?.modules.find(module => module.id === firstModuleId)
        if (!moduleStatus) {
            return room
        }
        // remove the id from the module status
        const { id, ...status } = moduleStatus;
        return {
            ...room,
            status: status,
            moduleId: id
        }
    })
    return rooms;
})

const selectedStatusReferences = ref()
const selectedStatusData = computed(() => {
    if (!selectedStatusReferences.value) {
        return null
    }

    const moduleData = homeMeasures.value.modules.find((_module) => {
        return _module.id === selectedStatusReferences.value.moduleId
    })

    if (!moduleData) {
        return null
    }

    const moduleStatusData = moduleData[selectedStatusReferences.value.statusType.toLowerCase()]
    if (!moduleStatusData) {
        return null
    }
    return {
        x: moduleStatusData.map((data) => data.x),
        y: moduleStatusData.map((data) => data.y)
    }
})

async function getHomesData() {
    try {
        const res = await callApi('homesData', 'GET', null);
        homesData.value = res.body.homes;
        currentHomeId.value = homesData.value[0]?.id;
    } catch (error) {
        console.error(error);
    }
}

async function getCurrentHomeMeasures() {
    try {
        if (!currentHomeId.value) {
            return
        }
        const res = await callApi('homeMeasures', 'GET', { home_id: currentHomeId.value });
        homeMeasures.value = res.body.home;
    } catch (error) {
        console.error(error);
    }
}

async function getCurrentHomeStatus() {
    try {
        if (!currentHomeId.value) {
            return
        }
        const res = await callApi('homeStatus', 'GET', { home_id: currentHomeId.value });
        homeStatus.value = res.body.home;
        const room = currentHome.value.rooms[0]
        setSelectedStatusReferences(room.id, 'Temperature', room.modules[0])
    } catch (error) {
        console.error(error);
    }
}

function setSelectedStatusReferences(roomId: number, statusType: Status, moduleId: number) {
    selectedStatusReferences.value = {
        roomId,
        moduleId,
        statusType,
    }
}

export function useHome() {
    return {
        getHomesData,
        homesData,
        getCurrentHomeMeasures,
        homeMeasures,
        getCurrentHomeStatus,
        homeStatus,
        currentRooms,
        selectedStatusReferences,
        setSelectedStatusReferences,
        selectedStatusData
    };
  }