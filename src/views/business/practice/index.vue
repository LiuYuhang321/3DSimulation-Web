<template>
  <TreeComponent/>
  <map-tools @hammer="hammer"></map-tools>

  <div :class="['panorama-content',showPanorama && showPanorama.show?'panorama-content-show':'']"
       v-show="showPanorama?.show">
    <div class="exit-panorama" title="退出全景" @click="exitPanorama">
      <n-icon :size="40" :component="ExitOutline"></n-icon>
    </div>
    <iframe style="width: 100%;height: 100%" :src="showPanorama?.panoramaUrl"></iframe>
  </div>
</template>

<script setup lang="ts">
import TreeComponent from '@/views/business/practice/components/TreeComponent.vue'
import MapTools from "@/views/business/practice/components/MapTools.vue";
import {computed, onBeforeUnmount, onMounted} from "vue";
import {goLastviewPoint} from "@/views/business/practice/components/layertree.js";
import {useStore} from "vuex";
import {NIcon} from "naive-ui"
import {ExitOutline} from "@vicons/ionicons5"

const dbwTerrainUrl = import.meta.env.VITE_APP_DBW_TERRAIN_URL;

const store = useStore();
const hammer = (value: any) => {
  if (value == true) {
    document.querySelector('body').style.cssText = "cursor:url(./assets/images/marker/hammer.ico), auto;"
  } else {
    document.querySelector('body').style.cssText = "cursor: auto;"
  }
}
const showPanorama = computed(() => store.getters["basemap/getPanorama"])
const exitPanorama = () => {
  goLastviewPoint();
  store.commit("basemap/updatePanorama", null);
}

onMounted(()=>{
  cf3d.ready(()=>{
    cf3d.loadTerrainProvider({url: dbwTerrainUrl});
  })
})

onBeforeUnmount(()=>{
  cf3d.removeTerrainProvider();
})
</script>

<style scoped lang="scss">
.panorama-content {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .exit-panorama {
    position: absolute;
    top: 20px;
    right: 20px;
    color: white;
    cursor: pointer;
  }
}

.panorama-content-show {
  pointer-events: auto;
}

.flag {
  pointer-events: auto;
  position: absolute;
  right: 24px;
  top: 12px;
}

.dialog {
  pointer-events: auto;
  position: absolute;
  right: 24px;
  top: 12px;
}
</style>
