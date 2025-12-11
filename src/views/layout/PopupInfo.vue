<template>
    <div class="popup-panel" v-if="isShow==true">
        <sub-panel :title="地址信息">
            <span>x:{{ zuob.x }}</span>
            <hr>
            <span>y:{{ zuob.y }}</span>
            <hr>
            <span>z:{{ zuob.z }}</span>
            <hr>
            <span>lng:{{ lnglat.lng }}</span>
            <hr>
            <span>lat:{{ lnglat.lat }}</span>
            <hr>
            <span>alt:{{ lnglat.alt }}</span>
            <hr>
        </sub-panel>
    </div>
</template>

<script setup lang="ts">
import SubPanel from '@/components/panel/SubPanel.vue'
import {computed, onMounted, reactive, ref} from "vue";
import {useStore} from "vuex";

const store = useStore();
let a = computed(() => store.state.isShow)
let isShow = ref(a)

let zuob = reactive({})
let lnglat = reactive({})
onMounted(() => {
    cf3d.registerEventByMars3D('click', (e) => {
        let zb = e.cartesian
        let ll = cf3d.getLnglatFromPosition(e.cartesian)
        Object.assign(zuob, zb)
        Object.assign(lnglat, ll)
    });

})
</script>

<style scoped lang="scss">
.popup-panel {
    width: 400px;
    height: 276px;
    left: 25px;
    bottom: 50px;
    margin-top: 65px;
    position: absolute;
    z-index: 100;
    color: white;
    font-weight: 700;

    .popup-panel span {
        margin-top: 10px;
        display: block;
    }

}
</style>
