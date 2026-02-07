<script setup lang="ts">
const UApp = resolveComponent('UApp')
</script>

<template>
  <UApp :toaster="{ position: 'top-right' }">
    <RouterView />
  </UApp>
</template>
