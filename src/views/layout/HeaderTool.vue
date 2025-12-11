<template>
    <div class="header-tools">
        <div class="map-switcher">
            <div v-for="(obj,key) in scenes" v-bind:class="['switcher-item', type===key?'switcher-item-actived':'']"
                 @click="switchType(key)">
                <img class="icon" :src="type===key?obj.iconS:obj.icon"/>
                <div v-bind:class="['text',type===key?'text-actived':'']">{{ key }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted, watch} from "vue";
import {useStore} from "vuex"
import {getCesiumScenes} from "@/config/cesium";

const type = ref();
const store = useStore();
const scenes = ref(getCesiumScenes());

watch(() => store.getters["basemap/getBaseMapType"], (maptype) => {
    type.value = maptype;
})
const switchType = (t: string) => {
    store.dispatch('basemap/changeBaseMapType', t);
}
const showAlphaController = ref(false);

watch(() => store.getters["basemap/getBaseMapType"], (type) => {
    showAlphaController.value = !!(getCesiumScenes()[type].enableAlphaFor3Dtiles);
})

const alpha = ref(100)

onMounted(() => {

})

</script>

<style scoped lang="scss">
.header-tools {
    display: flex;
    align-items: center;
    margin-left: 380px;

    .map-switcher {
        display: flex;
        align-items: center;
        height: 44px;

        .switcher-item {
            width: 92px;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #1c5673;
            border: 1px solid #485282;
            cursor: pointer;

            .icon {
                width: 16px;
                height: 16px;
                background-size: 100% 100%;
            }

            .text {
                height: 18px;
                font-size: 14px;
                font-family: MicrosoftYaHei;
                color: #979FB0;
                line-height: 18px;
                margin-left: 8px;
            }

            .text-actived {
                font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
                font-weight: bold;
                color: #E0E9F6;
            }
        }

        .switcher-item-actived {
            background: #062b49;
        }
    }
}

.alpha-controller {
    padding-top: 20px;
    padding-bottom: 20px;
    position: fixed;
    left: 20px;
    bottom: 30px;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    border-radius: 5px;
    background: rgba(28, 38, 76, 0.9);
}
</style>
