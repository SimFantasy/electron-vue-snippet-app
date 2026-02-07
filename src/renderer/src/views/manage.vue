<script lang="ts" setup name="Manage"></script>

<template>
  <div class="size-full grid grid-cols-5 bg-card/90">
    <div class="col-span-1 bg-stone-500/20">category</div>
    <div class="col-span-4">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
