<template>
  <div class="practice-point" v-if="practicePointData">
    <sub-panel :title="practicePointData?.MC" @close="closePracticePointDetails">
      <div class="point-content">
        <div class="item-name">名称：</div>
        <div>{{practicePointData?.MC}}</div>
        <div class="item-name">所属场景：</div>
        <div>{{practicePointData?.SSCJ}}</div>
        <div class="item-name">经纬度：</div>
        <div>{{practicePointData?.JD + ", " +practicePointData?.WD}}</div>
        <div class="item-name">类型：</div>
        <div>{{practicePointData?.LX}}</div>
        <div class="item-name">构造描述：</div>
        <div>{{practicePointData?.GZMS}}</div>
      </div>
    </sub-panel>
  </div>
</template>

<script setup lang="ts">
import SubPanel from "@/components/panel/SubPanel.vue";
import {computed} from "vue";
import { useStore } from "vuex"

const store = useStore();

const practicePointData = computed(()=>store.getters["basemap/getPracticePointData"])

const closePracticePointDetails = () => {
  store.commit("basemap/updatePracticePointData", null);
}

</script>

<style scoped lang="scss">
.practice-point{
  position: absolute;
  right: 20px;
  top: 12px;
  width: 460px;
  pointer-events: auto;
  max-height: 500px;
  .point-content{
    display: grid;
    grid-template-columns: 80px 1fr;
    grid-template-rows: 30px 30px 30px 30px;
    padding: 20px;
    color: white;
    .item-name{
      text-align: right;
    }
  }
}
</style>

