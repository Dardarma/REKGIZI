<template>
  <AppSidebar :menu-groups="userMenuGroups" :show-widget="true" />
</template>

<script setup>
import AppSidebar from '../AppSidebar.vue'
import { userMenuGroups } from '@/config/userMenu'
</script>
