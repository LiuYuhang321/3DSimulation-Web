<template>
  <div class="map-toolbar">
    <div class="item-tool" title="复位"
         @click="clickTool('复位')">
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
    <div :class="['item-tool',toolActived === '标注'?'item-tool-actived':'']" title="标注"
         @click="clickTool('标注')">
      <n-icon :component="FlagOutline"></n-icon>
    </div>
    <div :class="['item-tool',toolActived === '剖面线分析'?'item-tool-actived':'']" title="剖面线分析"
         @click="clickTool('剖面线分析')">
      <n-icon :component="BarChartOutline"></n-icon>
    </div>
    <div :class="['item-tool',toolActived === '定点旋转'?'item-tool-actived':'']" title="定点旋转"
         @click="clickTool('定点旋转')">
      <n-icon :component="SyncOutline"></n-icon>
    </div>
    <!--        <div :class="['item-tool',toolActived === '地质锤'?'item-tool-actived':'']" title="地质锤"
                 @click="clickTool('地质锤')">
                <n-icon :component="HammerOutline"></n-icon>
            </div>-->
    <div class="item-tool" title="方位角" :class="['item-tool',toolActived === '方位角'?'item-tool-actived':'']"
         @click="clickTool('方位角')">
      <n-icon :component="SendOutline"></n-icon>
    </div>
    <div :class="['item-tool',toolActived === '参照物'?'item-tool-actived':'']" title="参照物"
         @click="clickTool('参照物')">
      <n-icon :component="CubeOutline"></n-icon>
    </div>
    <div :class="['item-tool',toolActived === '测量'?'item-tool-actived':'']" title="测量"
         @click="clickTool('测量')">
      <n-icon :component="AnalyticsOutline"></n-icon>
    </div>
    <div class="item-tool" title="截图"
         @click="clickTool('截图')">
      <n-icon :component="CropOutline"></n-icon>
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
  <!--    标注-->
  <div class="flag" v-if="toolActived === '标注'">
    <attr-edit @close="clickTool('')"></attr-edit>
  </div>
  <!--    剖面线-->
  <div class="elev" v-if="toolActived === '剖面线分析'">
    <elev-info @close="clickTool('')"></elev-info>
  </div>
  <div class="entity" v-if="toolActived === '参照物'">
    <CreateEllipsoids @on-click="getoolactive"/>
  </div>
  <div class="azimuth" v-if="toolActived === '方位角'">
    <azimuth></azimuth>
  </div>
  <Teleport to="body" v-if="toolActived === '截图'">
    <!--        <screen-shot ref="imageEditor" @close="clickTool('')"></screen-shot>-->
    <image-editor :imageData="imageEditorData" @close="clickTool('')"></image-editor>
  </Teleport>


</template>

<script setup lang="ts">
import ElevInfo from '@/views/layout/ElevInfo.vue'
import CreateEllipsoids from '@/views/layout/CreateEllipsoids.vue'
import AttrEdit from '@/views/layout/AttrEdit.vue'
import MeasureTools from '@/views/layout/MeasureTools.vue'
import azimuth from '@/views/layout/azimuth.vue'
import ImageEditor from '@/views/component/ImageEditor/index.vue'
import {onMounted, ref, onBeforeUnmount, watch, nextTick} from "vue"
import {NIcon, NButton, NInput} from "naive-ui"
import {
  ReloadOutline, NavigateOutline, FlagOutline,
  CubeOutline, BarChartOutline, SyncOutline, HammerOutline,
  CropOutline, ExpandOutline, ContractOutline,
  SendOutline, AnalyticsOutline
} from "@vicons/ionicons5"
import {
  reset, fullScreen, cancelScreen, screenShot,
  startRotate, stopRotate, to2D, to3D,
  resetCompass, removeEntity, measureClear, getFullScreenStatus
} from "./maptools.ts";
import store from "@/store";

const imageEditorInstance = ref(null);
const is3D = ref('3D')
const isfullscreen = ref(false)
const checkFullScreen = () => {
  isfullscreen.value = getFullScreenStatus()
}
const toolActived = ref('');

//子传父
const showHammer = ref(false)
const emit = defineEmits(['hammer'])

const getoolactive = (val: string) => {
  toolActived.value = val
}

const imageEditorData = ref(null)

const clickTool = (item: any) => {
  switch (item) {
    case '复位': {
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
    case '标注': {
      if (!toolActived.value) {
        // openEdit();
      } else {
        // closeEdit();
      }

      break;
    }
    case '参照物': {
      console.log(123456789)
      if (toolActived.value !== item) {
        console.log("添加参照物")
      } else {
        removeEntity()
      }
      break;
    }
    case '剖面线分析': {
      if (!toolActived.value) {
        // store.commit('updateEcharts', true)
      } else {
        // store.commit('updateEcharts', false)
        measureClear();
      }
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
    case '地质锤': {
      if (!toolActived.value) {
        // emit('hammer', !showHammer.value)
        // showHammer.value = !showHammer.value
        // store.commit("updateisShow", true);
      } else {
        // store.commit("updateisShow", false);
      }
      break;
    }
    case '方位角': {
      if (!toolActived.value) {
        console.log("展开面板")
      } else {
        console.log("关闭面板")
      }
      break;
    }
    case '测量': {
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
