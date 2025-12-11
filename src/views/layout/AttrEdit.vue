<template>
    <sub-panel :title="'标注信息'" @close="removeMarker">
      <div class="mark-content">
        <div class="draw-type">
          <div>标注类型： </div>
          <n-radio-group v-model:value="drawType" name="radiogroup">
            <n-space>
              <n-radio value="tubiaopoint">图标</n-radio>
              <n-radio value="point">点</n-radio>
              <n-radio value="polyline">线</n-radio>
              <n-radio value="polygon">面</n-radio>
              <n-radio value="label">文本</n-radio>
            </n-space>
          </n-radio-group>
        </div>

        <div class="style-setting" v-if="drawType === 'point'">
          <div class="txt">颜色:</div>
          <n-color-picker :modes="['rgba']" v-model:value="attrMarker.color" @update:value="changePointStyle"/>
          <div class="txt">圆点大小（像素）:</div>
          <n-input-number v-model:value="attrMarker.pixelSize" :max="50" :min="1" @update:value="changePointStyle" placement="请输入圆点大小"/>
          <div class="txt">外边线颜色:</div>
          <n-color-picker :modes="['rgba']" v-model:value="attrMarker.outlineColor" @update:value="changePointStyle"/>
          <div class="txt">外边线宽度:</div>
          <n-input-number v-model:value="attrMarker.outlineWidth" :max="50" :min="0" @update:value="changePointStyle" placement="请输入外边线宽度"/>
        </div>

        <div class="style-setting" v-if="drawType === 'tubiaopoint'">
      
        <div class="txt">大小比例:</div>
          <n-input-number v-model:value="billboard.scale" :max="50" :min="1" @update:value="changePointStyle" placement="请输入比例大小"/>
        </div>

        <div class="style-setting" v-show="drawType === 'polyline'">
          <div class="txt">线宽（像素）:</div>
          <n-input-number v-model:value="polylineSetting.width" :max="50" :min="1" @update:value="changePolylineStyle" placement="请输入线宽"/>
          <div class="txt">填充色:</div>
          <n-color-picker :modes="['rgba']" v-model:value="polylineSetting.color" @update:value="changePolylineStyle"/>
          <div class="txt">是否贴地:&nbsp;&nbsp;{{ polylineSetting.clampToGround ? '是': '否' }}</div>
          <div>
            <n-switch v-model:value="polylineSetting.clampToGround" @update:value="changePolylineStyle"/>
          </div>
        </div>

        <div class="style-setting" v-show="drawType === 'polygon'">
          <div class="txt">填充色:</div>
          <n-color-picker :modes="['rgba']" v-model:value="polygonSetting.color" @update:value="changePolygonStyle"/>
            <div class="txt">边线宽度（像素，需创建前设置）: </div>
          <n-input-number v-model:value="polygonSetting.outlineWidth" :max="50" :min="1" @update:value="changePolygonStyle" placement="请输入线宽"/>
          <div class="txt">透明度: </div>
          <n-input-number v-model:value="polygonSetting.opacity" :max="1" :min="0" @update:value="changePolygonStyle" :step="0.1" placement="请输入透明度"/>
          <div class="txt">边线颜色（需创建前设置）: </div>
          <n-color-picker :modes="['rgba']" v-model:value="polygonSetting.outlineColor" @update:value="changePolygonStyle"/>
<!--          <div class="txt">是否贴地:&nbsp;&nbsp;{{ polygonSetting.clampToGround ? '是': '否' }}</div>
          <div>
            <n-switch v-model:value="polygonSetting.clampToGround" @update:value="changePolygonStyle"/>
          </div>-->
        </div>

        <div class="style-setting" v-show="drawType === 'label'">
          <div class="txt">内容:</div>
          <n-input v-model:value="textSetting.text" type="text" @update:value="changeTextStyle" placement="请输入文本内容"/>
          <div class="txt">字体大小(像素):</div>
          <n-input-number v-model:value="textSetting.font_size" :max="50" :min="1" @update:value="changeTextStyle"/>
          <div class="txt">字体颜色:</div>
          <n-color-picker :modes="['rgba']" v-model:value="textSetting.color" @update:value="changeTextStyle"/>
<!--          <div class="txt">背景景色:</div>
          <n-color-picker :modes="['hex']" v-model:value="textSetting.backgroundColor" @update:value="changeTextStyle"/>-->
        </div>

        <div class="action-buttons">
          <div class="type-button" @click="addMarker"><n-icon :size="16" :component="AddOutline"></n-icon>&nbsp;添加</div>
          <div class="type-button" @click="clearMarker"><n-icon :size="16" :component="TrashBinOutline"></n-icon>&nbsp;清除</div>
        </div>
      </div>
    </sub-panel>
</template>

<script setup lang="ts">
import { TrashBinOutline,AddOutline } from "@vicons/ionicons5"
import SubPanel from '@/components/panel/SubPanel.vue'
import { NInput, NInputNumber, NColorPicker, NIcon, NSwitch, NDataTable,NButton,NRadioGroup,NRadio } from "naive-ui"
import {
  addbillboard,
  addMarkerPoint,
  addMarkerPolyline,
  removeMarker,
  addMarkerText,
  updatePointStyle,
  updatePolylineStyle,
  updateLabelStyle, updatePolygonStyle,
  addMarkerPolygon
} from "../business/practice/components/maptools.ts";
import {ref, h} from "vue";
import EditableInput from "@/components/form/EditableInput.vue"

const attrMarker = ref({
    color: "#00ffff",
    pixelSize: 16,
    outlineColor: "#ffffff",
    outlineWidth: 2
})

const billboard = ref({
  image:"./assets/images/marker/location2.png",
  scale: 1,
})

const polylineSetting = ref({
  width: 13,
  color: '#FFCD36',
  clampToGround: true
});

const polygonSetting = ref({
  opacity: 0.5,
  outlineWidth: 3,
  outlineColor: "#ffffff",
  color: "#3388ff",
  clampToGround: true
});

const textSetting = ref({
  text: '输入文本',
  font_size: 20,
  color: '#FF0000'
});

const drawType = ref('tubiaopoint');

const graphicList = ref([{
  name:"test"
}]);

const columns = [
  {
    title: '名称',
    key: 'name',
    width: 200,
    render (row, index) {
      return h(EditableInput, {
        value: row.name,
        onUpdateValue (v) {
          graphicList.value[index].name = v
        }
      })
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 100,
    render (row, index) {
      return h(
          NIcon,
          {
            size: 'small',
            title: '删除',
            component: TrashBinOutline,
            onClick: () => {}
          },
          { default: () => 'Send Email' }
      )
    }
  }
];

const addMarker = () => {
  switch (drawType.value){
    case 'point':{
      addMarkerPoint(attrMarker.value);
      break;
    }
    case 'tubiaopoint':{
      addbillboard(billboard.value);
      break
    }
    case 'polyline':{
      addMarkerPolyline(polylineSetting.value);
      break;
    }
    case 'polygon':{
      addMarkerPolygon(polygonSetting.value);
      break;
    }
    case 'label':{
      addMarkerText(textSetting.value);
      break;
    }
  }
}

const clearMarker = () => {
  removeMarker();
}

const changePointStyle = () => {
  updatePointStyle(attrMarker.value);
}

const changePolylineStyle = () => {
  updatePolylineStyle(polylineSetting.value);
}

const changePolygonStyle = () => {
  updatePolygonStyle(polygonSetting.value);
}

const changeTextStyle = () => {
  updateLabelStyle(textSetting.value);
}

</script>

<style scoped lang="scss">
:deep(.n-base-icon){
  color: white;
}
.bigBox {
    color: white;
}
.mark-content{
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.draw-type{
  width: 352px;
  display: flex;
  align-items: center;
  color: white;
  .type-button{
    height: 24px;
    width: 80px;
    cursor: pointer;
    background: rgba(94,94,94,0.52);
    border: 1px solid;
    border-image: linear-gradient(360deg, rgba(255, 255, 255, 0.69), rgba(44, 197, 216, 0.6)) 1 1;
    font-size: 16px;
    font-family: SourceHanSansCN-Medium, SourceHanSansCN;
    font-weight: 500;
    color: rgba(255,255,255,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .type-button-actived{
    background: #00AEB6 linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.2) 100%);
    border: 1px solid;
    border-image: linear-gradient(360deg, rgba(255, 255, 255, 0.65), rgba(44, 197, 216, 0.24)) 1 1;
    color: #FFFFFF;
  }
}
.style-setting{
  flex: 1;
  display: flex;
  flex-direction: column;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 10px;
}
.marker-table{
  flex: 1;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 10px;
}
.action-buttons{
  margin-top: 20px;
  width: 352px;
  display: flex;
  align-items: center;
  color: white;
  justify-content: center;
  .type-button{
    margin: 0 10px;
    height: 24px;
    width: 80px;
    cursor: pointer;
    background: rgba(94,94,94,0.52);
    border: 1px solid;
    border-image: linear-gradient(360deg, rgba(255, 255, 255, 0.69), rgba(44, 197, 216, 0.6)) 1 1;
    font-size: 16px;
    font-family: SourceHanSansCN-Medium, SourceHanSansCN;
    font-weight: 500;
    color: rgba(255,255,255,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
