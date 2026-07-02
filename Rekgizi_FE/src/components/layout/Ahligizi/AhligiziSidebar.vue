<template>
  <AppSidebar :menu-groups="ahliGiziMenuGroup" :show-widget="true" />
</template>

<script setup>
import AppSidebar from '../AppSidebar.vue'
import { ahliGiziMenuGroup } from '@/config/ahliGiziMenu'
</script>
