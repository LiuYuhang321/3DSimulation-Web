<template>
    <div class="sub-panel">
        <div class="panel-header">
            <div class="header-icon"></div>
            <div class="header-text">{{title}}</div>
            <div class="close-button" @click="close()" >
                <n-icon :component="CloseOutline"></n-icon>
            </div>
        </div>
        <div class="panel-content">
            <n-space vertical >
                <div class="txt">经度:</div>
                <n-input v-model:value="ellipsoidconfig.longitude" type="text" :disabled="true"  placeholder=0 />
                <div class="txt">纬度:</div>
                <n-input v-model:value="ellipsoidconfig.latitude" type="text" :disabled="true"  placeholder=0 />
                <div class="txt">高程(米):</div>
                <n-input-number v-model:value="height" @update:value="heightchange" :step="0.1" type="text"  placeholder=0 />
                <div class="txt">半径(米):</div>
                <n-input-number v-model:value="ellipsoidconfig.r" :step="0.1" type="text"  placeholder=0 />
                <div class="txt">颜色:</div>
                <n-color-picker :modes="['hex']" v-model:value="ellipsoidconfig.color"   />
            </n-space>
            <n-button @click="createEntity()" style="color: #FFFFFF">
                创建
            </n-button>
            <n-button @click="remove()" style="color: #FFFFFF">
                清除
            </n-button>
            移动:<n-switch v-model:value="move"  @update:value="changeMove()" />
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, watch, onUnmounted} from "vue";
import { NIcon,NInput,NSpace,NButton,NColorPicker,NInputNumber,NSwitch } from "naive-ui";
import { CloseOutline } from "@vicons/ionicons5";
import {CreateEllipsoid,removeEntity,moveEntity,ChangeEllipsoid,removeSetmoveEntityAction} from '@/views/business/practice/components/maptools.ts'

const title = ref('添加参照物');
const active = ref(false)
const move = ref(false)

let Ellipsoid = null;
let id = null;
let en = null;

const emit = defineEmits(['on-click'])

const ellipsoidconfig = ref({
    longitude : 117.11226361249327,
    latitude : 34.23368643186155,
    height : 176.02645250969758,
    r:10.0,
    color:'＃1E90FF'
})

const height = ref(Number(ellipsoidconfig.value.height.toFixed(1)))

onMounted(()=>{
    openRegister()
})

onUnmounted(()=>{
    EventListner()
})

const heightchange = () => {
  console.log(height.value)
  ellipsoidconfig.value.height = height.value
}

const createEntity = () => {
    Ellipsoid = CreateEllipsoid(
        ellipsoidconfig.value.longitude,
        ellipsoidconfig.value.latitude,
        ellipsoidconfig.value.height,
        ellipsoidconfig.value.r,
        ellipsoidconfig.value.color,
    );
    cf3d.removeEventByMars3D(id);
    id=null
}

const remove = () => {
  removeEntity();
  openRegister();
}

const close = () => {
  removeEntity();
  emit('on-click','')
}

const openRegister = () => {
    if(id === null){
      console.log('register again')
        id = cf3d.registerEventByMars3D('click', (e) => {
            console.log('=====>开启注册',e.cartesian)
            const position = cf3d.getLnglatFromPosition(e.cartesian)
            ellipsoidconfig.value.latitude = position.lat
            ellipsoidconfig.value.longitude = position.lng
            // ellipsoidconfig.value.height = position.alt + ellipsoidconfig.value.r
          ellipsoidconfig.value.height = position.alt
        });
    }
}
const changeMove = () => {
    if(move.value === true){
        // if(!id) {
        //     console.log('=====>取消失败')
        //     return
        // }
        // else{
            console.log('========>取消注册')
            cf3d.removeEventByMars3D(id);
            en = moveEntity(Ellipsoid,ellipsoidconfig.value.r,(realtimeposition)=>{
                console.log(realtimeposition)
                ellipsoidconfig.value.latitude = realtimeposition.lat
                ellipsoidconfig.value.longitude = realtimeposition.lng
                // ellipsoidconfig.value.height = realtimeposition.alt + ellipsoidconfig.value.r
              ellipsoidconfig.value.height = realtimeposition.alt
              height.value = Number(realtimeposition.alt.toFixed(1))
            })
            id = null
        // }
    }else {
        // openRegister()
        removeSetmoveEntityAction(en)
    }
}

const EventListner = watch(
    //进行深拷贝
    ()=>JSON.parse(JSON.stringify(ellipsoidconfig.value)),
    (newVal,oldVal)=>{
        ChangeEllipsoid(Ellipsoid,newVal.longitude, newVal.latitude, newVal.height,newVal.r,newVal.color)
      height.value = Number(newVal.height.toFixed(1))
    },{deep:true})

</script>

<style scoped lang="scss">
.sub-panel{
    display: flex;
    position: absolute;
    flex-direction: column;
    pointer-events: auto;
    width: 400px;
    background: rgba(57,57,57,0.24);
    border-radius: 6px;
    border: 1px solid;
    border-image: linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.42), rgba(255, 255, 255, 0)) 1 1;
    backdrop-filter: blur(10px);
    right: 24px;
    top: 12px;
    .panel-header{
        width: 100%;
        height: 32px;
        background: linear-gradient(270deg, rgba(98,240,237,0) 0%, rgba(3,111,143,0.27) 100%);
        border-radius: 4px 4px 0px 0px;
        border: 1px solid;
        border-image: linear-gradient(270deg, rgba(253, 251, 251, 0), rgba(193, 253, 254, 0.56), rgba(175, 249, 255, 0.9)) 1 1;
        display: flex;
        align-items: center;
        position: relative;
        .header-icon{
            width: 5px;
            height: 32px;
            background: linear-gradient(180deg, #00E5FF 0%, rgba(0,198,255,0) 100%);
            border-radius: 3px 0px 0px 0px;
        }
        .header-text{
            margin-left: 8px;
            font-size: 16px;
            font-family: PangMenZhengDao SimSun-ExtB;
            color: #FFFFFF;
            text-shadow: 0px 1px 3px #183E4D;
        }
        .close-button{
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
    .panel-content{
        width: 100%;
        color: #FFFFFF;
        padding: 20px;

    }
}
</style>
