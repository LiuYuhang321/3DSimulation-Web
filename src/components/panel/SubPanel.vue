<template>
  <div class="sub-panel" v-if="isOpen">
    <div class="panel-header">
      <div class="header-icon"></div>
      <div class="header-text">{{ title }}</div>
      <div class="close-button" @click="close" v-if="closeable">
        <n-icon :component="CloseOutline"></n-icon>
      </div>
    </div>
    <div class="panel-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {NIcon} from "naive-ui";
import {CloseOutline} from "@vicons/ionicons5";

defineProps({
  title: {
    type: String,
    default: null
  },
  closeable: {
    type: Boolean,
    default: true
  }
});
const isOpen = ref(true);

const emits = defineEmits(['close']);

const close = () => {
  isOpen.value = false;
  emits('close');
}

</script>

<style scoped lang="scss">
.sub-panel {
  display: flex;
  flex-direction: column;
  min-width: 300px;
  background: rgba(57, 57, 57, 0.24);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.42);
  //border-image: linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.42), rgba(255, 255, 255, 0)) 1 1;
  backdrop-filter: blur(10px);

  .panel-header {

    width: 100%;
    height: 32px;
    background: linear-gradient(270deg, rgba(98, 240, 237, 0) 0%, rgba(3, 111, 143, 0.27) 100%);
    border-radius: 4px 4px 0px 0px;
    border: 1px solid;
    border-image: linear-gradient(270deg, rgba(253, 251, 251, 0), rgba(193, 253, 254, 0.56), rgba(175, 249, 255, 0.9)) 1 1;
    display: flex;
    align-items: center;
    position: relative;

    .header-icon {
      width: 5px;
      height: 32px;
      background: linear-gradient(180deg, #00E5FF 0%, rgba(0, 198, 255, 0) 100%);
      border-radius: 3px 0px 0px 0px;
    }

    .header-text {
      margin-left: 8px;
      font-size: 16px;
      font-family: PangMenZhengDao SimSun-ExtB;
      color: #FFFFFF;
      text-shadow: 0px 1px 3px #183E4D;
    }

    .close-button {
      position: absolute;
      color: white;
      top: 4px;
      right: 6px;
      cursor: pointer;
      font-size: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .panel-content {
    //padding-right: 16px;
    min-height: calc(100% - 32px);
    width: 100%;
  }
}
</style>
