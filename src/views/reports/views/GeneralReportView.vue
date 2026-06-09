<template>
  <ReportsDashboard :data="reportData" />
</template>

<script setup lang="ts">
import ReportsDashboard from '../components/ReportsDashboard.vue'
import { useReports } from '@/composables/useReports'

const { reportData } = useReports()
</script>
