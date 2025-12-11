<template>
    <div id="cursor">
    </div>
    <div id="base-map">
        <BaseMap></BaseMap>
    </div>
    <!--    <div class="map-tools">
            <MapTools></MapTools>
        </div>-->
    <Header v-show="showHeader"></Header>
    <div class="router-view">
        <router-view></router-view>
    </div>
<!--    <ElevInfo></ElevInfo>-->
<!--    <create-ellipsoid></create-ellipsoid>-->
    <popup-info></popup-info>
</template>

<script setup lang="ts">
import BaseMap from "@/views/cesium/BaseMap.vue"
import Header from "@/views/layout/Header.vue";
// import MapTools from "@/views/cesium/SchoolTools.vue";
import ElevInfo from "./ElevInfo.vue"
import CreateEllipsoid from './CreateEllipsoids.vue'
import PopupInfo from './PopupInfo.vue'
import {onBeforeMount, ref} from "vue";

const showHeader = ref(true);
onBeforeMount(() => {
    if (window.location.href.includes('#/hiddenroute?bdcdyh=')) {
        showHeader.value = false
    } else {
        showHeader.value = true
    }
    ;
})
var handler = new Cesium.ScreenSpaceEventHandler();
handler.setInputAction(function (event) {
    document.getElementById("base-map").style.cssText = "cursor:url(./assets/images/marker/cursor.png), auto;"
    handler.setInputAction(function (event) {
        document.getElementById("base-map").style.cssText = "cursor: auto;"
    }, Cesium.ScreenSpaceEventType.MIDDLE_UP);
}, Cesium.ScreenSpaceEventType.MIDDLE_DOWN);

</script>

<style scoped lang="scss">
.detail-panel {
    position: absolute;
    top: 104px;
    left: 434px;
    bottom: 24px;
    z-index: 200;
    width: 400px;
    height: 400px;
}

.comp-panel {
    height: 400px;
    width: 340px;
}

.map-tools {
    position: relative;
    top: 200px;
    left: 10px;
}

.router-view {
    position: absolute;
    z-index: 200;
    top: 98px;
    height: calc(100% - 98px);
    width: 100%;
    pointer-events: none;
}
</style>
