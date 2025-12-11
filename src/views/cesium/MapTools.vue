<template>
    <div class="map-toolbar">
        <div class="map-toolbar-group" v-for="group in tools" :key="tools.id">
            <div class="map-toolbar-group-button" v-for="button in group.buttons" :key="button.id"
                 @click="clickTool(button)">
                <img :id="button.type === 'compass'?'compass': button.id" height="28"
                     :width="button.type === 'compass'?12:28" :src="button.actived ? button.activeIcon : button.icon"
                     :title="button.title"/>
            </div>
        </div>
    </div>
    <!--  <layer-tree-->
    <!--        v-show="displayLayerTree"-->
    <!--        v-if="showLayerTree"-->
    <!--        @layerChange="layerChange"-->
    <!--        @clickNode="clickNode"-->
    <!--        @changeOpacity="changeOpacity"-->
    <!--        :style="{ zIndex: zIndexLayerTree }"-->
    <!--      />-->
    <base-map v-show="showBaseMap" :style="{ zIndex: zIndexBasemap }" :class="[{ a: showBaseMap }]"/>
</template>

<script setup lang="ts">
import LayerTree from "./map-tools/layer-tree/index.vue";
import BaseMap from "./map-tools/base-map/index.vue";
import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {useStore} from "vuex";
import {
    changeLayerTree,
    clickTreeNode,
    changeLayerOpacity,
} from "@/utils/LayerTreeUtil";

const is3D = ref(true);
const store = useStore();
const tools = ref([]);
import {useRouter} from "vue-router";
import {
    flyToViewpoint,
    switchMode,
    startDraw,
    clearDraw,
    startRoma,
    stopRoma,
} from "@/utils/CesiumUtil";
import {flyToByModule} from "@/utils/ModulesInit";

const router = useRouter();
const compass1 = ref();
const compass2 = ref();
const showLayerTree = computed(() => store.getters["basemap/getLayerTree"]);
const displayLayerTree = ref(false);
const showBaseMap = ref(false);
//显示弹窗
const showPopup = ref(false);

const zIndexBasemap = ref(9000);
const zIndexLayerTree = ref(9000);
const layerChange = (item, checked) => {
    changeLayerTree(item, checked);
};

const clickNode = (d) => {
    clickTreeNode(d);
};

const changeOpacity = (opacity, item) => {
    changeLayerOpacity(opacity, item);
};

const clickTool = (item) => {
    item.actived = !item.actived;
    switch (item.type) {
        case "layer-tree": {
            zIndexLayerTree.value <= zIndexBasemap.value &&
            (zIndexLayerTree.value = zIndexBasemap.value + 1);
            // showBaseMap.value = false;
            displayLayerTree.value = !displayLayerTree.value;
            break;
        }
        case "base-map": {
            zIndexLayerTree.value >= zIndexBasemap.value &&
            (zIndexBasemap.value = zIndexLayerTree.value + 1);
            // displayLayerTree.value = false;
            showBaseMap.value = !showBaseMap.value;
            break;
        }
        case "reset": {
            if (item.baseOnRoute) {
                flyToByModule(router.currentRoute.value.fullPath);
            } else {
                flyToViewpoint(item.viewpoint);
            }
            break;
        }
        case "2d-3d": {
            item.is3D = !item.is3D;
            switchMode(item.is3D);
            stopRoma();
            break;
        }
        case "compass": {
            cf3d.resetMapRotate();
            break;
        }
        case "rotate": {
            if (item.actived) {
                cf3d.startRotate();
            } else {
                cf3d.stopRotate();
            }
            break;
        }
        case "draw": {
            // clearDraw();
            if (item.actived) {
                startDraw({
                    type: "rectangle",
                    callback: (d) => {
                        store.commit("basemap/updateDrawObject", d.points);
                    },
                });
            } else {
                store.commit("basemap/updateDrawObject", []);
            }
            break;
        }
        case "eraser": {
            tools.value.forEach((i) => {
                i.buttons.forEach((button) => {
                    if (button.type === "draw") {
                        button.actived = false;
                    }
                });
            });
            clearDraw();
            cf3d.removeContourLine();
            store.commit("basemap/updateDrawObject", []);
            break;
        }
        case "edit": {
            if (item.actived) {
                // startRoma();
                cf3d.openEdit();
            } else {
                // stopRoma();
                cf3d.closeEdit();
            }
            // cf3d.contextMenu();
            break;
        }

        case "fullscreen": {
            if (item.actived) {
                cf3d.fullScreen();
            } else {
                cf3d.cancelScreen();
            }
            break;
        }
        case "screenshot": {
            cf3d.screenShot();
            break;
        }
        case "contour": {
            if (item.actived) {
                cf3d.btnDrawExtent();
                cf3d.addContourLine();
            } else {
                cf3d.removeContourLine();
            }
            break;
        }
        case "query": {
            if (item.actived) {
                store.commit("isshow", true);
            } else {
                store.commit("isshow", false);
            }
            break;
        }
        case "profile": {
            if (item.actived) {
                store.commit('updateEcharts', true)
                cf3d.addMeasure();
                cf3d.measureSection();
            } else {
                store.commit('updateEcharts', false)
            }
            break;
        }

    }
};

const allActiveStatus = () => {
    showBaseMap.value = false;
    displayLayerTree.value = false;
    cf3d.stopRotate();
    stopRoma();
};

watch(
    () => store.getters["basemap/getMaptools"],
    (d) => {
        let _tools = [];
        d.forEach((item) => {
            _tools.push({
                ...item,
                buttons: item.buttons.map((button) => ({...button})),
            });
        });
        tools.value = _tools;
        allActiveStatus()
    }
);
onMounted(() => {
    cf3d.addMeasure();
    cf3d.addMapRotateEvent((data) => {
        if (document.getElementById("compass")) {
            document.getElementById("compass").style.transform = data;
        }
    });
});

onBeforeUnmount(() => {
    cf3d.removeMapRotateEvent();
})
</script>

<style scoped lang="scss">
.map-toolbar {
    position: absolute;
    top: 80px;
    right: 20px;

    &-group {
        background: #b0b5be;
        border-radius: 2px;

        &-button {
            height: 36px;
            width: 36px;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;

            &:hover {
                background: rgba(0, 0, 0, 0.05);
            }
        }

        &-button + &-button {
            border-top: 1px solid #ddd;
        }
    }

    &-group + &-group {
        margin-top: 10px;
    }

    z-index: 200;
}
</style>
