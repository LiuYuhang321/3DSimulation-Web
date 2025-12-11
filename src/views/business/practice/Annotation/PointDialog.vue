<template>
  <sub-dialog :title="'属性编辑'" @close="removeDialog">

    <n-form
        ref="formRef"
        :model="attrPoint"
        label-placement="left"
        label-width="100"
        require-mark-placement="right-hanging"
        size="medium"
        :style="{
      maxWidth: '640px',

    }"
    >
      <n-form-item label="名称:">
        <n-input v-model:value="attrPoint.pointName" placeholder="请输入名称"/>
      </n-form-item>

      <n-form-item label="所在图层:">
        <n-input v-model:value="attrPoint.layerName" placeholder="请输入所在图层"/>
      </n-form-item>

      <n-form-item label="样式类型:">
        <n-input v-model:value="attrPoint.graphicType" @update:value="changePointStyle"
                 placeholder="请选择样式类型"/>
      </n-form-item>

      <n-form-item label="符号大小:">
        <n-input-number v-model:value="attrPoint.pixelSize" :max="50" :min="1"
                        @update:value="changePointStyle"
                        placement="请输入圆点大小"/>
      </n-form-item>

      <n-form-item label="颜色:">
        <n-color-picker v-model:value="attrPoint.color"
                        @update:value="changePointStyle"/>
      </n-form-item>

      <n-form-item label="边线颜色:">
        <n-color-picker v-model:value="attrPoint.outlineColor"
                        @update:value="changePointStyle"/>
      </n-form-item>

      <n-form-item label="边框宽度:">
        <n-input-number v-model:value="attrPoint.outlineWidth" :max="50" :min="0"
                        @update:value="changePointStyle" placement="请输入外边线宽度"/>
      </n-form-item>

      <n-form-item label="符号操作:">
        <n-button @click="changeMarker">确认修改</n-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <n-button @click="cancelMarker">取消修改</n-button>
      </n-form-item>
    </n-form>

  </sub-dialog>
</template>

<script setup lang="ts">
import SubDialog from '@/components/panel/SubDialog.vue'
import {NInput, NInputNumber, NButton, NColorPicker, NForm, NFormItem, FormInst} from "naive-ui"
import {
  updatePointStyle
} from "@/views/business/practice/components/maptools.js";
import {computed, inject, onMounted, reactive} from "vue";

import stores from "@/store";
import {ApiConfig, httpRequest} from "@/api";


const emit = defineEmits(['on-close'])

const attrPoint = reactive({
  pointName: ' ',
  layerName: ' ',
  graphicType: '点',
  color: "",
  pixelSize: ' ',
  outlineColor: '',
  outlineWidth: ' '
})
const ID = computed(() => stores.state.optionId)
const updateTree = inject("updateTree") as Function

const formValue = reactive({
  name: ' ',
  datastyle: '',
});

const removeDialog = () => {
  emit('on-close', '')
}
onMounted(() => {
  showMarker()
})

let res = JSON.parse(JSON.stringify(ID.value))

// console.log(res)

// console.log(res.geo.coordinates)
let str = JSON.parse(res.dataStyle)
// console.log(str)
let obj = eval('(' + str + ')')
console.log(obj)

const showMarker = () => {
  attrPoint.pointName = obj.name
  attrPoint.layerName = obj.layer
  attrPoint.color = obj.color
  attrPoint.pixelSize = obj.pixelSize
  attrPoint.outlineWidth = obj.outlineWidth
  attrPoint.outlineColor = obj.outlineColor
}


//确认修改
const changeMarker = () => {
  formValue.name = attrPoint.pointName
  //添加图层样式
  const datastyle = `{
      "name":"${attrPoint.pointName}",
      "layer":"${attrPoint.layerName}",
      "color":"${attrPoint.color}",
      "pixelSize":"${attrPoint.pixelSize}",
      "outlineColor":"${attrPoint.outlineColor}",
      "outlineWidth":"${attrPoint.outlineWidth}"
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
const changePointStyle = () => {
  updatePointStyle(attrPoint);
}

</script>

