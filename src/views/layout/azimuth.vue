<template>
    <sub-panel :title="'方位角'" @close="closePanel">
         <div class="mark-content">
            <div class="angle-content">
                <angle style="width:250px;height:200px" :data="fwj"></angle>
               <!--  <div class="circle">

                </div>
                <div class="yline" id="line" :style="{transform:`rotate(-${360-fwj}deg)`}"></div>
                <div class="xline"></div>
                <div class="circle"></div> -->
            </div>
         <!--     <n-icon id="compass" :component="ArrowUp"  size="100"></n-icon> -->
         </div>
    </sub-panel>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, watch, onUnmounted,onBeforeUnmount} from "vue";
import { NIcon,NInput,NSpace,NButton,NColorPicker,NInputNumber,NSwitch } from "naive-ui";
import { CloseOutline,ArrowUp } from "@vicons/ionicons5";
import SubPanel from '@/components/panel/SubPanel.vue';
import angle from '../component/chart/angle.vue'
import store from "@/store";

const title = ref('方位角');
let fwj = computed(()=>store.getters.getazimuth)

onMounted(()=>{
store.commit('updatedToolitem', '方位角')
})


const closePanel=()=>{

     store.commit('updatedToolitem', '')
}

watch(()=>store.getters.getazimuth,(newval)=>{
    if(document.getElementById('line')){
      document.getElementById('line').style.transform = `rotate(-${newval}deg)`;
    }
})







</script>
<style scoped lang='scss'>
.mark-content{
  padding: 20px;
  display: flex;
  flex-direction: column;
  .angle-content{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    .yline{
        background: black;
        width: 1px;
        height: 100px;
        transform-origin:bottom left;
    }
    .xline{
        background: black;
        width: 1px;
        height: 100px;
    }
  }
}

</style>