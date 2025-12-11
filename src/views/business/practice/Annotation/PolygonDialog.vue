<template>
  <sub-dialog :title="'属性编辑'" @close="removeDialog">

    <n-form
        ref="formRef"
        :model="attrPolygon"
        label-placement="left"
        label-width="100"
        require-mark-placement="right-hanging"
        size="medium"
        :style="{
      maxWidth: '640px'
    }"
    >

      <n-form-item label="名称:">
        <n-input v-model:value="attrPolygon.name" @update:value="changePolygonStyle" placeholder="请输入绘制面名称"/>
      </n-form-item>

      <n-form-item label="所在图层:">
        <n-input v-model:value="attrPolygon.layer" @update:value="changePolygonStyle"
                 placeholder="请输入绘制面所在图层"/>
      </n-form-item>

      <n-form-item label="样式类型:">
        <n-input v-model:value="attrPolygon.styleType" @update:value="changePolygonStyle"/>
      </n-form-item>

      <n-form-item label="填充颜色:">
        <n-color-picker v-model:value="attrPolygon.fillColor"
                        @update:value="changePolygonStyle"/>
      </n-form-item>

      <n-form-item label="边框宽度:">
        <n-input-number v-model:value="attrPolygon.outlineWidth" :max="50" :min="1"
                        @update:value="changePolygonStyle" placement="请输入线宽"/>
      </n-form-item>

      <n-form-item label="边框颜色:">
        <n-color-picker v-model:value="attrPolygon.outlineColor"
                        @update:value="changePolygonStyle"/>
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
import {NInputNumber, NColorPicker, NInput, NForm, NFormItem, NButton} from "naive-ui"
import {
  updatePolygonStyle,
} from "@/views/business/practice/components/maptools.js";
import {computed, inject, onMounted, reactive} from "vue";
import stores from "@/store";
import {ApiConfig, httpRequest} from "@/api";


const attrPolygon = reactive({
  name: ' ',
  layer: ' ',
  styleType: '面',
  fillColor: '',
  outlineWidth: 3,
  outlineColor: '',
  clampToGround: null
});
const ID = computed(() => stores.state.optionId)

const updateTree = inject("updateTree") as Function
const emit = defineEmits(['on-close'])
const removeDialog = () => {
  emit('on-close', '')
}
onMounted(() => {
  showMarker()
})

const formValue = reactive({
  name: ' ',
  datastyle: '',
})
// console.log(ID.value)
let res = JSON.parse(JSON.stringify(ID.value))

// console.log(res)
let str = JSON.parse(res.dataStyle)
// console.log(str)
let obj = eval('(' + str + ')')
console.log(obj)

const showMarker = () => {
  attrPolygon.name = obj.name
  attrPolygon.layer = obj.layer
  attrPolygon.fillColor = obj.color
  attrPolygon.outlineWidth = obj.outlineWidth
  attrPolygon.outlineColor = obj.outlineColor
}
//确认修改
const changeMarker = () => {
  formValue.name = attrPolygon.name
  //添加图层样式
  const datastyle = `{
      "name":"${attrPolygon.name}",
      "layer":"${attrPolygon.layer}",
      "outlineColor":"${attrPolygon.outlineColor}",
      "outlineWidth":"${attrPolygon.outlineWidth}",
      "clampToGround":"${attrPolygon.clampToGround}",
      "color":"${attrPolygon.fillColor}"
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

const changePolygonStyle = () => {
  updatePolygonStyle(attrPolygon);
}


</script>

