<template>
    <Line-chart class="max-w-[1024px] height-full" :data="data" :options="options" />
  </template>

<script setup lang="ts">
import {
CategoryScale,
Chart as ChartJS,
Legend,
LinearScale,
LineElement,
PointElement,
Title,
Tooltip
} from 'chart.js';
import { computed } from 'vue';
import { Line as LineChart } from 'vue-chartjs';

import { useHome } from "@/composables/home";
const { selectedStatusData, selectedStatusReferences } = useHome();

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const data = computed(() => {
  return {
    labels: selectedStatusData.value?.x,
    datasets: [
      {
        label: selectedStatusReferences.value?.statusType,
        backgroundColor: '#f87979',
        data: selectedStatusData.value?.y
      }
    ]
  }
})

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: {
        callback: function(index) {
          const timestamp = selectedStatusData.value?.x[index];
          console.log(timestamp);

          const date = new Date(timestamp * 1000);
          // if date is round hour, return date else return nothing so that it does not show on x axis
          if (date.getMinutes() === 0) {
            return date.toLocaleTimeString("fr-FR", { hour: 'numeric', minute: 'numeric' });
          }
        }
      }
    }
  }
}

</script>
