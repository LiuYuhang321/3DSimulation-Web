<template>
  <div ref="chartContainer"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted, ref, watch, shallowRef, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
const instance = getCurrentInstance();
const store = useStore();
const props = defineProps({
  options: Object,
});

/* const emit = defineEmits */

const chart = shallowRef(null);
const chartContainer = ref(null);

const emit = defineEmits('clickChart');

const $_init = () => {
  chart.value = echarts.init(chartContainer.value);
  chart.value.on('click', params => {
    emit('clickChart', params);
  });
  setOption();
  resize();
};

const setOption = () => {
  if (chart.value && props.options) {
    console.log('🚀 ~ props.options', props.options);
    chart.value.setOption(props.options, true);
  }
};

const resize = () => {
  try {
    chart.value.resize();
  } catch (e) {
    console.log('======================e resize', e);
  }
};

defineExpose({
  setOption,
});

onMounted(() => {
  $_init();
});

watch(
  () => store.getters.getWindowResize,
  () => {
    resize();
  }
);

watch(
  () => props.options,
  () => {
    setOption();
  }
);
</script>

<style scoped></style>
