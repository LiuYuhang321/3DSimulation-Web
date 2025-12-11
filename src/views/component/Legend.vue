<template>
  <div class="legend">
      <div class="title">
        {{title}}
     </div>
     <slot></slot>
  </div>
</template>

<script setup lang="ts">

 defineProps({
     title: String,
  })

</script>
<style scoped lang="scss">

.legend {
    position: absolute;
    z-index: 200;
    width: 176px;
    height: 256px;
    background: #18243A;
    opacity: 0.9;
    border: 1px solid #485282;
    bottom:24px;
    right:24px;
    .title{
    width: 176px;
    height: 40px;
    background: #2E3F50;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #E0E9F6;
    text-align: center;
    margin-bottom:24px;
    line-height: 40px;
    }
}
</style>