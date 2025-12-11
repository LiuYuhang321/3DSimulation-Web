<template>
  <div class="layer-setting-panel">
    <div>{{layerSetting.label}}</div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    layerSetting: Object
  })
</script>

<style scoped lang="scss">
.layer-setting-panel{

}
</style>
