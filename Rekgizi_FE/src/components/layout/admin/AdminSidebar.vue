<template>
  <AppSidebar :menu-groups="adminMenuGroup" :show-widget="true" />
</template>

<script setup>
import AppSidebar from '../AppSidebar.vue'
import { adminMenuGroup } from '@/config/adminMenu'
</script>
