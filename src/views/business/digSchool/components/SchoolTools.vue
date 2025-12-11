<template>
  <div class="map-toolbar">
    <div class="item-tool" title="重置"
         @click="clickTool('重置')">
      <n-icon :component="ReloadOutline"></n-icon>
    </div>
    <div class="item-tool" title="2D/3D"
         @click="clickTool('2D/3D')">
      <span class="item-tool-text">{{ is3D }}</span>
    </div>
    <div class="item-tool" title="指北针"
         @click="clickTool('指北针')">
      <n-icon id="compass" :component="NavigateOutline"></n-icon>
    </div>
    <div :class="['item-tool',toolActived === '定点旋转'?'item-tool-actived':'']" title="定点旋转"
         @click="clickTool('定点旋转')">
      <n-icon :component="SyncOutline"></n-icon>
    </div>
    <div :class="['item-tool',toolActived === '点查'?'item-tool-actived':'']" title="点查"
         @click="clickTool('点查')">
      <n-icon :component="Search"></n-icon>
    </div>
    <div class="item-tool" title="截图"
         @click="clickTool('截图')">
      <n-icon :component="CropOutline"></n-icon>
    </div>
    <div :class="['item-tool',toolActived === '测量'?'item-tool-actived':'']" title="测量"
         @click="clickTool('测量')">
      <n-icon :component="AnalyticsOutline"></n-icon>
    </div>
    <div class="item-tool" title="退出全屏"
         @click="clickTool('退出全屏')" v-if="isfullscreen">
      <n-icon :component="ContractOutline"></n-icon>
    </div>
    <div class="item-tool" title="全屏"
         @click="clickTool('全屏')" v-if="!isfullscreen">
      <n-icon :component="ExpandOutline"></n-icon>
    </div>
  </div>
  <!--    量测-->
  <div class="measure" v-if="toolActived === '测量'">
    <measure-tools @close="clickTool('')"></measure-tools>
  </div>
  <Teleport to="body" v-if="toolActived === '截图'">
    <image-editor :imageData="imageEditorData" @close="clickTool('')"></image-editor>
  </Teleport>


</template>

<script setup lang="ts">
import MeasureTools from '@/views/layout/MeasureTools.vue'
import ImageEditor from '@/views/component/ImageEditor/index.vue'
import {onMounted, ref, onBeforeUnmount, watch} from "vue"
import {NIcon, NButton, NInput} from "naive-ui"
import {
  ReloadOutline, NavigateOutline, FlagOutline,
  CubeOutline, BarChartOutline, SyncOutline, Search,
  CropOutline, ExpandOutline, ContractOutline,
  SendOutline, AnalyticsOutline
} from "@vicons/ionicons5"
import {
  reset, fullScreen, cancelScreen, screenShot,
  startRotate, stopRotate, to2D, to3D,
  resetCompass, getFullScreenStatus
} from "../../practice/components/maptools.ts";
import store from "@/store";

const is3D = ref('3D')
const isfullscreen = ref(false)
const checkFullScreen = () => {
  isfullscreen.value = getFullScreenStatus()
}
const toolActived = ref('');

//子传父
const emit = defineEmits(['hammer'])

const getoolactive = (val: string) => {
  toolActived.value = val
}

const imageEditorData = ref(null)

const clickTool = (item: any) => {
  switch (item) {
    case '重置': {
      reset()
      break;
    }
    case '2D/3D': {
      if (is3D.value === '3D') {
        is3D.value = '2D'
        to2D()
      } else {
        is3D.value = '3D'
        to3D()
      }
      break;
    }
    case '指北针': {
      resetCompass();
      break;
    }
    case '定点旋转': {
      if (toolActived.value !== item) {
        startRotate()
      } else {
        stopRotate();
      }
      break;
    }
    case '测量': {
      break;
    }
    case '点查': {
      break;
    }
    case '截图': {
      screenShot((res) => {
        imageEditorData.value = res.image;
      });
      break;
    }
    case '全屏': {
      fullScreen()
      break;
    }
    case '退出全屏': {
      cancelScreen()
      break;
    }
  }
  if (toolActived.value === item) {
    toolActived.value = '';
  } else {
    toolActived.value = item;
  }
}


onMounted(() => {
  cf3d.addMeasure({
    label: {
      color: "#ffffff",
      font_family: "楷体",
      font_size: 20
    }
  });
  cf3d.addMapRotateEvent((deg) => {
    store.dispatch("changeazimuth", deg)
    if (document.getElementById('compass')) {
      document.getElementById('compass').style.transform = `rotate(-${deg}deg)`;
    }
  }, 45);
  window.addEventListener('fullscreenchange', checkFullScreen)
})

onBeforeUnmount(() => {
  cf3d.removeMapRotateEvent();
  window.removeEventListener('fullscreenchange', checkFullScreen);
})

watch(() => store.getters.gettoolItem, (newval) => {
  toolActived.value = newval
})


</script>

<style scoped lang="scss">
.map-toolbar {
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: auto;
  height: 60px;
  padding-left: 60px;
  padding-right: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("./assets/images/map/maptool/mapbar_bg.webp");
  background-size: 100% 100%;

  .item-tool {
    margin-left: 8px;
    margin-right: 8px;
    height: 40px;
    width: 40px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-size: 100% 100%;
    background-image: url("./assets/images/map/maptool/maptool_icon_bg.webp");
    color: #71DCE3;
    font-size: 24px;
    cursor: pointer;
  }

  .item-tool-actived {
    color: white;
    background-image: url("./assets/images/map/maptool/maptool_icon_bg_actived.webp");
  }

  .item-tool-text {
    font-size: 16px;
  }
}

.measure {
  pointer-events: auto;
  position: absolute;
  right: 24px;
  top: 12px;
}

.flag {
  pointer-events: auto;
  position: absolute;
  right: 24px;
  top: 12px;
}

.elev {
  pointer-events: auto;
  position: absolute;
  right: 24px;
  top: 12px;
}


.entity {
  pointer-events: auto;
  position: absolute;
  right: 24px;
  top: 12px;
}

.azimuth {
  pointer-events: auto;
  position: absolute;
  right: 24px;
  top: 12px;
}


</style>
