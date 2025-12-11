<template>
  <n-form
      ref="formRef"
      :model="attrPoint"
      label-placement="left"
      label-width="auto"
      require-mark-placement="right-hanging"
      size="medium"
      :style="{
      maxWidth: '640px'
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
      <n-button @click="addMarker">添加</n-button>&nbsp;&nbsp;&nbsp;&nbsp;
      <n-button @click="saveMarker">保存</n-button>&nbsp;&nbsp;&nbsp;&nbsp;
      <n-button @click="clearMarker">清除</n-button>
    </n-form-item>
  </n-form>

</template>

<script setup lang="ts">
import {NInput, NInputNumber, NButton, NColorPicker, NForm, NFormItem} from "naive-ui"
import {
  addMarkerPoint,
  removeMarker,
  updatePointStyle
} from "@/views/business/practice/components/maptools.js";
import {inject, markRaw, reactive, Ref} from "vue";

import {ApiConfig, httpRequest} from "@/api";

const updateTree = inject('updateTree') as Function
const treeId = inject<Ref<string>>('treeId')


const attrPoint = reactive({
  pointName: ' ',
  layerName: ' ',
  graphicType: '点',
  color: "#00ffff",
  pixelSize: '16',
  outlineColor: "#ffffff",
  outlineWidth: '2',
  hasEdit: true,
  geo: {
    type: '',
    coordinates: {}
  }
})
const formValue = reactive({
  name: ' ',
  layertreeid: '',
  categoriestype: '',
  remark: '',
  datastyle: '',
  geo: {
    type: '',
    coordinates: {
      x: '',
      y: ''
    }
  }
});
const catalogueData = reactive({
  name: '',
  parentid: '',
  type: 2,
  Index: 0.00,
  Remark: '',
})
const addMarker = () => {
  addMarkerPoint(attrPoint, (res) => {
    attrPoint.geo.type = res.geometry.type
    attrPoint.geo.coordinates = res.geometry.coordinates
  })
}

const saveMarker = () => {
  //添加图层样式
  const datastyle = `{
      "name":"${attrPoint.pointName}",
      "layer":"${attrPoint.layerName}",
      "color":"${attrPoint.color}",
      "pixelSize":"${attrPoint.pixelSize}",
      "outlineColor":"${attrPoint.outlineColor}",
      "outlineWidth":"${attrPoint.outlineWidth}"
    }`
  // console.log(eval('(' + datastyle + ')'))
  formValue.name = attrPoint.pointName
  formValue.remark = attrPoint.layerName
  formValue.datastyle = datastyle

  formValue.geo.type = attrPoint.geo.type
  // formValue.geo.coordinates = attrPoint.geo.coordinates
  // console.log(attrPoint.geo.coordinates[0], attrPoint.geo.coordinates[1])
  formValue.geo.coordinates = [
    formValue.geo.coordinates.x = attrPoint.geo.coordinates[0],
    formValue.geo.coordinates.y = attrPoint.geo.coordinates[1],
  ]


  catalogueData.name = formValue.name
  catalogueData.parentid = treeId!.value
  catalogueData.Remark = formValue.remark
  console.log(formValue)
  httpRequest(ApiConfig.TreeNode.treenode, {bodyParams: catalogueData})?.then(res => {
    console.log("====>第一次请求成功")
    console.log(res.data.id)
    formValue.layertreeid = res.data.id
    httpRequest(ApiConfig.TreeNode.nodedata, {bodyParams: formValue})?.then((node) => {
      console.log('==========================addNode', node);
      updateTree()
    })
  })


  // addMarkerPoint(attrPoint, (res) => {
  //   //添加图层样式
  //   const datastyle = `{
  //     "name":"${res.properties.style.pointName}",
  //     "layer":"${res.properties.style.layerName}",
  //     "color":"${res.properties.style.color}",
  //     "pixelSize":"${res.properties.style.pixelSize}",
  //     "outlineColor":"${res.properties.style.outlineColor}",
  //     "outlineWidth":"${res.properties.style.outlineWidth}"
  //   }`
  //   formValue.name = res.properties.style.pointName
  //   formValue.remark = res.properties.style.layerName
  //   console.log(eval('(' + datastyle + ')'))
  //   formValue.datastyle = datastyle
  //   //添加图层类型和坐标
  //   formValue.geo.type = res.geometry.type
  //   formValue.geo.coordinates = res.geometry.coordinates
  //   //     [
  //   //   formValue.geo.coordinates.x = res.geometry.coordinates[0],
  //   //   formValue.geo.coordinates.y = res.geometry.coordinates[1],
  //   // ]
  //   catalogueData.name = formValue.name
  //   catalogueData.parentid = treeId!.value
  //   catalogueData.Remark = formValue.remark
  //   // console.log(treeID!.value)
  //   console.log(formValue)
  //   httpRequest(ApiConfig.TreeNode.treenode, {bodyParams: catalogueData})?.then(res => {
  //     formValue.layertreeid = res.data.id
  //     httpRequest(ApiConfig.TreeNode.nodedata, {bodyParams: formValue})?.then((node) => {
  //       console.log('==========================addNode', node);
  //       updateTree()
  //     })
  //   })
  // })
}


const clearMarker = () => {
  removeMarker();
}


const changePointStyle = () => {
  updatePointStyle(attrPoint);
}

</script>

