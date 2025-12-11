<template>
  <sub-dialog :title="'属性编辑'" @close="removeDialog">
    <n-form
        ref="formRef"
        :model="attrPolyline"
        label-placement="left"
        label-width="100"
        require-mark-placement="right-hanging"
        size="medium"
        :style="{
      maxWidth: '640px'
    }"
    >
      <n-form-item label="名称:">
        <n-input v-model:value="attrPolyline.name" placeholder="请输入名称"/>
      </n-form-item>

      <n-form-item label="所在图层:">
        <n-input v-model:value="attrPolyline.layer" placeholder="请输入所在图层"/>
      </n-form-item>
      <n-form-item label="样式类型:">
        <n-input v-model:value="attrPolyline.styleType" @update:value="changePolylineStyle"
                 placeholder="请输入绘制线所在图层"/>
      </n-form-item>

      <n-form-item label="显示贴地:">
        <n-switch v-model:value="attrPolyline.clampToGround" @update:value="changePolylineStyle"/>
      </n-form-item>

      <n-form-item label="线宽:">
        <n-input-number v-model:value="attrPolyline.width" :max="50" :min="1"
                        @update:value="changePolylineStyle" placeholder="请输入线宽"/>
      </n-form-item>
      <n-form-item label="线型:">
        <n-select :options="options" @update:value="handleUpdateValue"
                  placeholder="请输入绘制线类型"/>
      </n-form-item>
      <n-form-item label="颜色:">
        <n-color-picker v-model:value="attrPolyline.materialOptions.color"
                        @update:value="changePolylineStyle"/>
      </n-form-item>

      <n-form-item label="操作:">
        <n-button @click="changeMarker">确认修改</n-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <n-button @click="cancelMarker">取消修改</n-button>
      </n-form-item>
    </n-form>

  </sub-dialog>
</template>
<script setup lang="ts">
import SubDialog from '@/components/panel/SubDialog.vue'
import {NInput, NColorPicker, NInputNumber, NSwitch, NSelect, NButton, NForm, NFormItem} from "naive-ui"
import {
  updatePolylineStyle,
} from "@/views/business/practice/components/maptools.js";
import {reactive, onMounted, computed, inject} from "vue";
import stores from "@/store";
import {ApiConfig, httpRequest} from "@/api";

const ID = computed(() => stores.state.optionId)

const emit = defineEmits(['on-close'])

const removeDialog = () => {
  emit('on-close', '')
}
const updateTree = inject("updateTree") as Function
const attrPolyline = reactive({
  name: ' ',
  layer: ' ',
  styleType: '线',
  width: '3',
  materialType: '',
  materialOptions: {
    color: '',
    dashLength: ''
  },
  clampToGround: true,

});
const options = [
  {label: '实线', value: false},
  {label: '虚线', value: true}
]

onMounted(() => {
  showMarker()
})


const handleUpdateValue = (value: string) => {
  if (value) {
    attrPolyline.materialType = mars3d.MaterialType.PolylineDash
    attrPolyline.materialOptions.dashLength = 8.0
  } else {
    attrPolyline.materialType = mars3d.MaterialType.LineFlow
  }
}

let res = JSON.parse(JSON.stringify(ID.value))
// console.log(res)
let str = JSON.parse(res.dataStyle)
// console.log(str)
let obj = eval('(' + str + ')')
console.log(obj)


//显示标记
const showMarker = () => {
  attrPolyline.name = obj.name
  attrPolyline.layer = obj.layer
  attrPolyline.materialOptions.color = obj.materialcolor
  attrPolyline.width = obj.width
}
const formValue = reactive({
  name: ' ',
  datastyle: '',
});

//确认修改
const changeMarker = () => {
  formValue.name = attrPolyline.name
  //添加图层样式
  const datastyle = `{
      "name":"${attrPolyline.name}",
      "layer":"${attrPolyline.layer}",
      "width":"${attrPolyline.width}",
      "clampToGround":"${attrPolyline.materialOptions.clampToGround}",
      "materialType":"${attrPolyline.materialType}",
      "materialcolor":"${attrPolyline.materialOptions.color}",
      "materialdashLength":"${attrPolyline.materialOptions.dashLength}",
  }`
  formValue.datastyle = datastyle
  httpRequest(ApiConfig.Editree.editreedata, {
    bodyParams: formValue,
    pathParams: {id: res.id}
  })?.then((res) => {
    console.log('========>修改成功', res)
    updateTree()
  })
}

//取消修改
const cancelMarker = () => {
  emit('on-close', '')
}

const changePolylineStyle = () => {
  updatePolylineStyle(attrPolyline);
}
</script>

