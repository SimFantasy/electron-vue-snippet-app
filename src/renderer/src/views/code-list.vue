<script lang="ts" setup name="CodeList"></script>

<template>
  <div class="size-full grid grid-cols-4">
    <div class="col-span-1 bg-stone-500/10">code list</div>
    <div class="col-span-3">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
