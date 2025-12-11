<script setup lang="ts">
import MainPanel from "@/components/panel/MainPanel.vue";
import {NTabs, NTabPane, NTree, NIcon, NInput} from "naive-ui"
import {onMounted, ref} from "vue"
import {httpGetJSON} from "@/api";
import {TrashBinOutline} from "@vicons/ionicons5";
import {guid} from "@/utils/CommUtil";

const tabValue = ref('古生物')

const gswData = ref([])
const kwysData = ref([])
const pattern1 = ref('')
const pattern2 = ref('')

const processTreeData = (data) => {
  const temp = Array.from(new Set(data.map((t: any)=>t.dl))).map((t:any)=>{

    return {
      title: t,
      key: guid(),
      children: Array.from(new Set(data.filter((s:any)=>s.dl === t && s.xl).map((s:any)=>s.xl))).map((r:any)=>{
        return {
          title: r,
          key: guid(),
          children: data.filter(i=>i.dl===t && i.xl === r).map(i=>{
            return {
              key: guid(),
              title: i.mc,
              ...i,
              path: i.dz + '.gltf',
              isLeaf: true
            }
          })
        }
      }).concat(data.filter((s:any)=>s.dl===t && !s.xl).map((s:any)=>{
        return {
          title: s.mc,
          key: guid(),
          ...s,
          path: s.dz + '.gltf',
          isLeaf: true
        }
      }))
    }
  })
  return temp;
}
onMounted(()=>{
  httpGetJSON('./config/resources/data.json').then((res:any)=>{
    gswData.value = processTreeData(res.filter(t=>t.lb === '古生物'))
    kwysData.value = processTreeData(res.filter(t=>t.lb === '矿物岩石'))
  })
})

const emiters = defineEmits(['selectItem'])

const selectItem = (keys, option, meta)=>{
  if(option && option.length > 0 && option[0].isLeaf){
    emiters('selectItem',option[0])
  }
}
</script>

<template>
  <MainPanel title="数字化资源">
    <div class="panel">
      <n-tabs type="segment" animated v-model:value="tabValue">
        <n-tab-pane name="古生物" tab="古生物">
        </n-tab-pane>
        <n-tab-pane name="矿物岩石" tab="矿物岩石">
        </n-tab-pane>
      </n-tabs>
      <div style="width: 100%" v-show="tabValue === '古生物'">
        <div class="input-panel">
          <n-input placeholder="快速检索" v-model:value="pattern1" clearable>
            <template #clear-icon v-if="pattern1 && pattern1.length > 0">
              <n-icon :component="TrashBinOutline"/>
            </template>
          </n-input>
        </div>
        <div class="tree-panel">
          <n-tree
            block-line
            accordion
            :data="gswData"
            label-field="title"
            children-field="children"
            selectable
            :pattern="pattern1"
            :expand-on-click="true"
            @update:selected-keys="selectItem"
            :show-irrelevant-nodes="false"
          />
        </div>
      </div>
      <div style="width: 100%" v-show="tabValue === '矿物岩石'">
        <div class="input-panel">
          <n-input placeholder="快速检索" v-model:value="pattern2" clearable>
            <template #clear-icon v-if="pattern2 && pattern2.length > 0">
              <n-icon :component="TrashBinOutline"/>
            </template>
          </n-input>
        </div>
        <div class="tree-panel">
          <n-tree
            block-line
            accordion
            :data="kwysData"
            label-field="title"
            children-field="children"
            selectable
            @update:selected-keys="selectItem"
            :pattern="pattern2"
            :expand-on-click="true"
            :show-irrelevant-nodes="false"
          />
        </div>
      </div>
    </div>
  </MainPanel>
</template>

<style scoped lang="scss">
.main-panel {
  background: rgba(57, 57, 57, 0.24);
  border-radius: 6px;
  border: 1px solid;
  border-image: linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.42), rgba(255, 255, 255, 0)) 1 1;
  backdrop-filter: blur(10px);
  pointer-events: auto;
  position: absolute;
  left: 24px;
  top: 12px;
}

.panel{
  width: 400px;
  min-height: 400px;
  padding: 10px;
}

:deep(.n-collapse .n-collapse-item .n-collapse-item){
  margin-left: 10px;
}

:deep(.n-collapse .n-collapse-item .n-collapse-item__content-wrapper .n-collapse-item__content-inner){
  padding-top: 4px;
}

.res-item{
  margin-left: 16px;
}

.input-panel {
  width: 100%;
  border-radius: 4px;
  border: 1px solid;
  border-image: linear-gradient(360deg, rgba(255, 255, 255, 0.69), rgba(44, 197, 216, 0.6)) 1 1;
  margin-bottom: 6px;
}

.tree-panel{
  width: 100%;
  max-height: 600px;
  overflow: auto;
}

:deep(.n-tab-pane){
  padding-top: 4px;
}
</style>
