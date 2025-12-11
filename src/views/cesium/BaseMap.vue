<template>
    <div id="cesiumContainer" class="cesium-map"></div>
</template>

<script setup lang="ts">
import {onMounted} from 'vue'
import {AppGlobalConfig} from '@/const/index'
import {useStore} from 'vuex'

const store = useStore();

onMounted(() => {
    cf3d.initMap('cesiumContainer');
    cf3d.flyTo(AppGlobalConfig.initViewer);
    //默认关闭右键菜单
    cf3d.closeEdit();
    cf3d.registerEventByMars3D('click', (e) => {
        console.log('================================LEFT_CLICK111', e)
        console.log('================================LEFT_CLICK111', cf3d.getLnglatFromPosition(e.cartesian))
        console.log('================================Camera', {
            ...cf3d.viewer.camera.position,
            h: cf3d.viewer.camera.heading,
            p: cf3d.viewer.camera.pitch,
            r: cf3d.viewer.camera.roll
        })
    });

})
</script>

<style scoped lang="scss">
.cesium-map {
    width: 100%;
    height: 100%;
}

.popup-div {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 110;
    display: none;
}
</style>
