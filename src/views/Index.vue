<template>
  <div class="main-container">
    <Index></Index>
  </div>
</template>

<script setup lang="ts">
  import Index from "@/views/layout/Index.vue"
</script>

<style scoped lang="scss">
.main-container{
  position: absolute;
  top: 0;
  left: 0;
  background-color: black;
  width: 100%;
  height: 100%;
}
</style>
