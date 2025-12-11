<template>
    <canvas class="model-container" ref="container"></canvas>
</template>

<script setup lang="ts">
import {addModel} from "./index.ts";
import {ref, onMounted} from "vue";
const container = ref(null);

onMounted(() => {
    addModel(container.value);
    console.log('=========================replace')
})
</script>

<style scoped lang="scss">
.model-container {
    position: absolute;
    top: 100px;
    right: 30px;

    z-index: 100;
    pointer-events: auto;
}
</style>
