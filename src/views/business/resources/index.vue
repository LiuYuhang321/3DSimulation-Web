<script setup lang="ts">
import {ref} from "vue"
import ResouceList from "@/views/business/resources/components/ResouceList.vue";
import SubPanel from '@/components/panel/SubPanel.vue'

const show = ref(false)
const detailData = ref()
const treePanel = ref()
const showDetail = (data) => {
  if(data){
    show.value = true;
    detailData.value = data
  }else{
    show.value = false;
    detailData.value = null
  }
}

</script>

<template>
  <ResouceList ref="treePanel" @selectItem="showDetail"></ResouceList>

  <div class="detail" v-if="show">
    <SubPanel class="detail-panel" :title="detailData?.mc" @close="showDetail(null)">
      <div class="gltf-viewer">
        <iframe style="width: 100%;height: 100%;border: none;" :src="`./viewer.html?gltf=${detailData?.path}`"></iframe>
      </div>
    </SubPanel>
  </div>
</template>

<style scoped lang="scss">
.detail{
  position: absolute;
  right: 20px;
  top: 10px;
  bottom: 20px;
  left: 460px;
  pointer-events: auto;
  .detail-panel{
    height: 100%;
  }
}

.data-info{
  width: 100%;
  display: flex;
  align-items: start;
  color: white;
  font-size: 16px;
  padding: 2px 10px;
  .label{

  }
  .value{
    flex: 1 1 0%;
  }
}
.gltf-viewer{
  height: 100%;
  width: 100%;
  background: #353551;
}
</style>
