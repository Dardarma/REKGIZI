<template>
  <ThemeProvider>
    <SidebarProvider>
      <RouterView />
      <LanguageSwitcher />
    </SidebarProvider>
  </ThemeProvider>
</template>

<script setup lang="ts">
import ThemeProvider from './components/layout/ThemeProvider.vue'
import SidebarProvider from './components/layout/SidebarProvider.vue'
import LanguageSwitcher from './components/common/LanguageSwitcher.vue'
</script>
