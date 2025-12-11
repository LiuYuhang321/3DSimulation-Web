<template>
  <sub-panel :title="'标注类型'" @close="closeLabel">
    <div class="main-panel">
      <div class="main-panel-tab">
        <n-button @click="switchCom(item)" :key="item.name"
                  v-for="item in data">
          {{ item.name }}
        </n-button>
      </div>
      <!--      <component @onclose="close" v-if="current.show" :is="current.comName"></component>-->
      <div class="main-panel-com">
        <component v-if="current.show" :is="current.comName"></component>
      </div>
    </div>
  </sub-panel>
</template>

<script setup lang="ts">
import SubPanel from '@/components/panel/SubPanel.vue'
import {NButton} from 'naive-ui'
import PointLabel from './PointLabel.vue'
import PolylineLabel from './PolylineLabel.vue'
import PolygonLabel from './PolygonLabel.vue'
import TextLabel from './TextLabel.vue'

import {markRaw, reactive} from "vue";
import {removeMarker} from "@/views/business/practice/components/maptools.js";


const emit = defineEmits(['onclose'])

const closeLabel = () => {
  removeMarker();
  emit('onclose', false)
  // store.commit('updateshowLayerLabel', false)
}
type Tabs = {
  name: string,
  comName: any,
  show: boolean
}
type Com = Pick<Tabs, 'comName' | 'show'>
const data = reactive<Tabs[]>([
  {
    name: "点",
    //markraw方法就是把响应式对象转换为普通对象
    comName: markRaw(PointLabel),
    show: false
  },
  {
    name: "线",
    comName: markRaw(PolylineLabel),
    show: false
  },
  {
    name: "面",
    comName: markRaw(PolygonLabel),
    show: false
  },
  {
    name: "文本",
    comName: markRaw(TextLabel),
    show: false
  }
])

let current = reactive<Com>({
  comName: data[0].comName,
  show: data[0].show
})
const switchCom = (item: Tabs) => {
  current.comName = item.comName
  current.show = !item.show
}

const close = (val: boolean) => {
  current.show = val
}

</script>

<style scoped lang="scss">

.main-panel {
  display: flex;
  flex-direction: column;
  min-width: 300px;
  border-radius: 6px;
  border: 1px solid;
  border-image: linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.42), rgba(255, 255, 255, 0)) 1 1;
  backdrop-filter: blur(10px);
  z-index: 1000;

  &-tab {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #cccccc;
  }

  &-com {
    margin-top: 10px;
    margin-left: 10px;
    margin-right: 10px;
  }
}


:deep(.n-base-icon) {
  color: white;
}

.bigBox {
  color: white;
}

.mark-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.draw-type {
  width: 352px;
  display: flex;
  align-items: center;
  color: white;
}

.style-setting {
  flex: 1;
  display: flex;
  flex-direction: column;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 10px;
}

.marker-table {
  flex: 1;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 10px;
}

.action-buttons {
  margin-top: 20px;
  width: 352px;
  display: flex;
  align-items: center;
  color: white;
  justify-content: center;

  .type-button {
    margin: 0 10px;
    height: 24px;
    width: 80px;
    cursor: pointer;
    background: rgba(94, 94, 94, 0.52);
    border: 1px solid;
    border-image: linear-gradient(360deg, rgba(255, 255, 255, 0.69), rgba(44, 197, 216, 0.6)) 1 1;
    font-size: 16px;
    font-family: SourceHanSansCN-Medium, SourceHanSansCN;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

