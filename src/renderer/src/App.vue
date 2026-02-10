<script setup lang="ts">
const UApp = resolveComponent('UApp')
</script>

<template>
  <UApp :toaster="{ position: 'top-right', duration: 3000 }">
    <RouterView />
  </UApp>
</template>
