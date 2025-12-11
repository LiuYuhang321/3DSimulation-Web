<template>
  <div class="base-map-panel">
    <div class="base-map-header">
      <span>底图管理</span>
    </div>
    <div class="base-map-list">
      <div
        class="base-map-list-item"
        v-for="(obj, key) in scenes"
        :class="{ active: key === type }"
        :key="obj"
        @click="switchType(key)"
      >
        <span
          class="base-map-list-item-label"
          :class="{ active: key === type }"
          >{{ key }}</span
        >
        <img
          :src="obj.smallIcon"
          class="base-map-list-item-icon"
          :class="{ active: key === type }"
          height="50"
          width="50"
          alt=""
        />
        <!-- <img :src="" /> -->
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {ref, onMounted, watch, computed} from "vue";
import { useStore } from "vuex";
import { getCesiumScenes } from "@/config/cesium";

const type = ref();
const store = useStore();
const scenes = computed(()=>{
  const obj = getCesiumScenes();
  const _obj = {};
  Object.keys(obj).forEach(k=>{
    if(obj[k].show){
      _obj[k] = obj[k]
    }
  })
  return _obj;
});
watch(
  () => store.getters["basemap/getBaseMapType"],
  (maptype) => {
    type.value = maptype;
  }
);
const switchType = (t: string) => {
  store.dispatch("basemap/changeBaseMapType", t);
};
const showAlphaController = ref(false);

watch(
  () => store.getters["basemap/getBaseMapType"],
  (type) => {
    showAlphaController.value = !!getCesiumScenes()[type].enableAlphaFor3Dtiles;
  }
);

const alpha = ref(100);

const changeAlpha = (val) => {
  store.dispatch("basemap/changeThreeDTilesAlpha", {
    type: type.value,
    alpha: val,
  });
};
onMounted(() => {});
</script>

<style lang="scss" scoped>
.base-map-panel {
  position: absolute;
  top: 80px;
  right: 70px;
  z-index: 9999;
  width: 300px;
  font-size: 14px;
  background: white;
  color: black;
  box-shadow: 0 1.5px 2px 1px #ccc;
  &:after {
    content: "";
    position: absolute;
    top: 5px;
    right: -5px;
    width: 10px;
    height: 10px;
    -ms-transform: rotate(90deg);
    transform: rotate(135deg);
    box-shadow: -2px -2px 0 0 rgb(211 210 210 / 50%);
    border: 7px solid rgba(0, 0, 0, 0);
    border-color: #3385ff rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) #3385ff;
    border-style: solid;
    border-width: 7px;
    z-index: -1;
  }
  .base-map-header {
    height: 40px;
    background: #3385ff;
    color: white;
    display: flex;
    align-items: center;
    padding-left: 20px;
  }
  .base-map-list {
    display: flex;
    padding: 20px;
    &-item {
      width: 33.33%;
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 1px solid transparent;
    }
    &-item {
      cursor: pointer;
      &-label {
        &.active {
          color: #3385ff;
        }
      }
      &-icon {
        width: 50px;
        height: 50px;
        background-position: center center;
        background-size: cover;
        background-repeat: no-repeat;
        border: 2px solid transparent;
        &.active {
          border: 2px solid #3385ff;
        }
      }
    }
  }
}
</style>
