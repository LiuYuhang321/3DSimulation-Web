<script setup lang="ts">
import {NConfigProvider, GlobalThemeOverrides, darkTheme, NMessageProvider} from 'naive-ui'
import Index from "@/views/Index.vue";
import {onMounted} from "vue";

const themeOverrides: GlobalThemeOverrides = {
  Input: {
    color: 'rgba(94,94,94,0.52)',
    textColor: '#FFFFFF',
    colorFocus: 'rgba(94,94,94,0.52)',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  },
  ColorPicker: {
    color: 'rgba(94,94,94,0.52)',
    textColor: '#FFFFFF',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  },
  DataTable: {
    thColor: 'rgba(255,255,255,0)',
    tdColor: 'rgba(255,255,255,0)',
    borderColor: 'rgba(255,255,255,0.8)'
  }
}
onMounted(() => {
})
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides" :theme="darkTheme">
    <n-message-provider>
      <Index></Index>
    </n-message-provider>
  </n-config-provider>
</template>

<style>
#app {
  position: absolute;
  overflow: hidden;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
