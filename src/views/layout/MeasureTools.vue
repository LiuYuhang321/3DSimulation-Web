<template>
    <sub-panel :title="'量测信息'" @close="clearMeasures">
        <div class="measure-content">
            <div class="draw-type">
                <n-radio-group v-model:value="drawType" name="radiogroup">
                    <n-space>
                        <n-radio value="distance">直线距离</n-radio>
                      <n-radio value="distanceSurface">贴地距离</n-radio>
                        <n-radio value="area">水平面积</n-radio>
                        <n-radio value="surface">贴地面积</n-radio>
                    </n-space>
                </n-radio-group>
            </div>

            <div class="style-setting" v-if="drawType === 'distance'">
                <div class="txt">测量长度(米):</div>
                <n-input v-model:value="distanceMeasure" placeholder=""/>
                <div class="txt">测量长度(公里):</div>
                <n-input v-model:value="changeDistance" placeholder=""/>
            </div>

          <div class="style-setting" v-if="drawType === 'distanceSurface'">
            <div class="txt">测量长度(米):</div>
            <n-input v-model:value="distanceSurMeasure" placeholder=""/>
            <div class="txt">测量长度(公里):</div>
            <n-input v-model:value="changeSurDistance" placeholder=""/>
          </div>


            <div class="style-setting" v-show="drawType === 'area'">
                <div class="txt">测量面积(平方米):</div>
                <n-input v-model:value="areaMeasure" placeholder=""/>
                <div class="txt">测量面积(平方公里):</div>
                <n-input v-model:value="changeArea" placeholder=""/>
            </div>

            <div class="style-setting" v-show="drawType === 'surface'">
                <div class="txt">测量面积(平方米):</div>
                <n-input v-model:value="surfaceMeasure" placeholder=""/>
                <div class="txt">测量面积(平方公里):</div>
                <n-input v-model:value="changeSurface" placeholder=""/>
            </div>

            <div class="action-buttons">
                <div class="type-button" @click="addMeasure">
                    <n-icon :size="16" :component="AddOutline"></n-icon>&nbsp;添加
                </div>
                <div class="type-button" @click="clearMeasures">
                    <n-icon :size="16" :component="TrashBinOutline"></n-icon>&nbsp;清除
                </div>
            </div>
        </div>
    </sub-panel>
</template>

<script setup lang="ts">
import {TrashBinOutline, AddOutline} from "@vicons/ionicons5"
import SubPanel from '@/components/panel/SubPanel.vue'
import {NInput, NInputNumber, NColorPicker, NIcon, NSwitch, NDataTable, NButton, NRadioGroup, NRadio} from "naive-ui"
import {
  removeMarker, measureLength, measureArea, measureSurface, clearMeasure, measureSurLength
} from "../business/practice/components/maptools.ts";
import {ref, h, onMounted} from "vue";
import EditableInput from "@/components/form/EditableInput.vue"

let distanceMeasure = ref('')
let changeDistance = ref('')

let distanceSurMeasure=ref('')
let changeSurDistance = ref('')

let areaMeasure = ref('')
let changeArea = ref('')

let surfaceMeasure = ref('')
let changeSurface = ref('')

const drawType = ref('distance');

const graphicList = ref([{
    name: "test"
}]);

const columns = [
    {
        title: '名称',
        key: 'name',
        width: 200,
        render(row, index) {
            return h(EditableInput, {
                value: row.name,
                onUpdateValue(v) {
                    graphicList.value[index].name = v
                }
            })
        }
    },
    {
        title: '操作',
        key: 'actions',
        width: 100,
        render(row, index) {
            return h(
                NIcon,
                {
                    size: 'small',
                    title: '删除',
                    component: TrashBinOutline,
                    onClick: () => {
                    }
                },
                {default: () => 'Send Email'}
            )
        }
    }
];

const addMeasure = () => {
    switch (drawType.value) {
        case 'distance': {
            measureLength((distance) => {
                distanceMeasure.value = distance.toFixed(1)
                let cv = distance / 1000
                changeDistance.value = cv.toFixed(2)
            });
            break;
        }
      case 'distanceSurface': {
        measureSurLength((distanceSur) => {
          distanceSurMeasure.value = distanceSur.toFixed(1)
          let cv = distanceSur / 1000
          changeSurDistance.value = cv.toFixed(2)
        });
        break;
      }
        case 'area': {
            measureArea((area) => {
                areaMeasure.value = area.toFixed(1)
                let cv = (area / 1000000)
                changeArea.value = cv.toFixed(2)
            });
            break;
        }
        case 'surface': {
            measureSurface((surface) => {
                surfaceMeasure.value = surface.toFixed(1)
                let cv = surface / 1000000
                changeSurface.value = cv.toFixed(2)
            });
            break;
        }
    }
}

const clearMeasures = () => {
    clearMeasure();
    distanceMeasure.value = ''
    changeDistance.value = ''
    areaMeasure.value = ''
    changeArea.value = ''
    surfaceMeasure.value = ''
    changeSurface.value = ''
}


</script>

<style scoped lang="scss">
:deep(.n-base-icon) {
    color: white;
}

.bigBox {
    color: white;
}

.measure-content {
    padding: 20px;
    display: flex;
    flex-direction: column;
}

.draw-type {
    width: 352px;
    display: flex;
    align-items: center;
    color: white;

    .type-button {
        height: 24px;
        width: 80px;
        cursor: pointer;
        background: rgba(94, 94, 94, 0.52);
        border: 1px solid;
        border-image: linear-gradient(360deg, rgba(255, 255, 255, 0.69), rgba(44, 197, 216, 0.6)) 1 1;
        font-size: 16px;
        font-family: SourceHanSansCN-Medium, SourceHanSansCN;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .type-button-actived {
        background: #00AEB6 linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%);
        border: 1px solid;
        border-image: linear-gradient(360deg, rgba(255, 255, 255, 0.65), rgba(44, 197, 216, 0.24)) 1 1;
        color: #FFFFFF;
    }
}

.style-setting {
    flex: 1;
    display: flex;
    flex-direction: column;
    color: rgba(255, 255, 255, 0.8);
    margin-top: 10px;
}

.marker-table {
    flex: 1;
    color: rgba(255, 255, 255, 0.8);
    margin-top: 10px;
}

.action-buttons {
    margin-top: 20px;
    width: 352px;
    display: flex;
    align-items: center;
    color: white;
    justify-content: center;

    .type-button {
        margin: 0 10px;
        height: 24px;
        width: 80px;
        cursor: pointer;
        background: rgba(94, 94, 94, 0.52);
        border: 1px solid;
        border-image: linear-gradient(360deg, rgba(255, 255, 255, 0.69), rgba(44, 197, 216, 0.6)) 1 1;
        font-size: 16px;
        font-family: SourceHanSansCN-Medium, SourceHanSansCN;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
