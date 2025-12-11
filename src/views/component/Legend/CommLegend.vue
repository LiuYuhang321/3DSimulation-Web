<template>
  <div class="legend" v-if="!!legends">
    <div class="title">
      {{ legends.title }}
    </div>
    <div class="content">
      <div class="item" v-for="(item,key) in legends.list" :key="key">
        <div class="icon">
          <img :src="item.icon">
        </div>
        <div class="text" :style="{color:item.color?item.color:''}">{{item.text}}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { useStore } from "vuex"
import {computed} from "vue";
const store = useStore();

const legends = computed(()=>store.getters["basemap/getLegend"])

</script>

<style scoped lang="scss">
.legend{
  display: flex;
  flex-direction: column;
  background: rgba(24, 36, 58, 0.9);
  border: 1px solid #485282;
  min-width: 170px;
  .title{
    width: 100%;
    height: 40px;
    background: #2E3F50;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #E0E9F6;
    text-align: center;
    line-height: 40px;
  }
  .content{
    width: 100%;
    padding: 10px 30px;
    .item {
      position: relative;
      display: flex;
      align-items: center;
      height: 50px;
      .icon {
        display: flex;
        align-items: center;
        width: 24px;
        height: 36px;
        >img{
          width: 100%;
          height:100%
        }
      }
      .text {
        margin-left: 10px;
        flex: 1;
        height: 19px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #979FB0;
      }
    }
  }

}

</style>
