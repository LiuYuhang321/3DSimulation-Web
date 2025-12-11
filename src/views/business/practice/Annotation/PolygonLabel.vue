<template>

  <n-form
      ref="formRef"
      :model="attrPolygon"
      label-placement="left"
      label-width="auto"
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
    <!--      <n-form-item label="显示贴地:">-->
    <!--        <n-switch v-model:value="attrPolygon.clampToGround" @update:value="changePolygonStyle"/>-->
    <!--      </n-form-item>-->
    <n-form-item label="填充颜色:">
      <n-color-picker v-model:value="attrPolygon.color"
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
    <n-form-item label="操作:">
      <n-button @click="addMarker">添加</n-button>&nbsp;&nbsp;&nbsp;&nbsp;
      <n-button @click="saveMarker">保存</n-button>&nbsp;&nbsp;&nbsp;&nbsp;
      <n-button @click="clearMarker">清除</n-button>
    </n-form-item>
  </n-form>

</template>

<script setup lang="ts">
import {NInputNumber, NColorPicker, NInput, NForm, NFormItem, NButton} from "naive-ui"
import {
  removeMarker,
  updatePolygonStyle,
  addMarkerPolygon
} from "@/views/business/practice/components/maptools.js";
import {computed, inject, reactive, Ref, ref, watch} from "vue";
import store from "@/store";
import {ApiConfig, httpRequest} from "@/api";
import stores from "@/store";

const updateTree = inject('updateTree') as Function
const treeId = inject<Ref<string>>('treeId')

const attrPolygon = reactive<string[] | any>({
  name: ' ',
  layer: ' ',
  styleType: '面',
  color: '#FF0000',
  // material: '#FF0000',
  outlineWidth: 3,
  outlineColor: '#FFFF00',
  clampToGround: true,
  geo: {
    type: '',
    coordinates: {
      x: [],
      y: []
    }
  }
});
const layerid = computed(() => stores.state.catalogueId)
const formValue = reactive({
  name: ' ',
  layertreeid: '',
  categoriestype: '',
  remark: '',
  datastyle: '',
  geo: {
    type: '',
    coordinates: {
      x: [],
      y: []
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
  addMarkerPolygon(attrPolygon, (res) => {
    attrPolygon.geo.type = res.geometry.type
    attrPolygon.geo.coordinates = res.geometry.coordinates
  })

}
const saveMarker = () => {
  //添加图层样式
  const datastyle = `{
      "name":"${attrPolygon.name}",
      "layer":"${attrPolygon.layer}",
      "outlineColor":"${attrPolygon.outlineColor}",
      "outlineWidth":"${attrPolygon.outlineWidth}",
      "clampToGround":"${attrPolygon.clampToGround}",
      "color":"${attrPolygon.color}"
    }`
  formValue.datastyle = datastyle
  //添加图层类型和坐标
  formValue.geo.type = attrPolygon.geo.type
  const arr1 = attrPolygon.geo.coordinates
  const arr2 = attrPolygon.geo.coordinates[0]
  const arr = arr1[0].concat([[...arr2][0]])
  console.log([arr])
  formValue.geo.coordinates = [arr]
  catalogueData.name = formValue.name
  catalogueData.parentid = treeId!.value
  catalogueData.Remark = formValue.remark
  httpRequest(ApiConfig.TreeNode.treenode, {bodyParams: catalogueData})?.then(res => {
    formValue.layertreeid = res.data.id
    httpRequest(ApiConfig.TreeNode.nodedata, {bodyParams: formValue})?.then((node) => {
      console.log('==========================addNode', eval('(' + node.data.dataStyle + ')'));
      updateTree()
    })
  })

// addMarkerPolygon(attrPolygon, (res) => {
//
//   console.log(res)
//   formValue.name = res.properties.style.name
//   formValue.remark = res.properties.style.remark
//   //添加图层样式
//   const datastyle = `{
//     "name":"${res.properties.style.name}",
//     "layer":"${res.properties.style.layer}",
//     "outlineColor":"${res.properties.style.outlineColor}",
//     "outlineWidth":"${res.properties.style.outlineWidth}",
//     "clampToGround":"${res.properties.style.clampToGround}",
//     "color":"${res.properties.style.color}"
//   }`
//
//   // console.log(eval('(' + datastyle + ')'))
//
//   formValue.datastyle = datastyle
//   //添加图层类型和坐标
//   formValue.geo.type = res.geometry.type
//   const arr1 = res.geometry.coordinates
//   const arr2 = res.geometry.coordinates[0]
//   const arr = arr1[0].concat([[...arr2][0]])
//   console.log([arr])
//   formValue.geo.coordinates = [arr]
//   catalogueData.name = formValue.name
//   catalogueData.parentid = treeId!.value
//   catalogueData.Remark = formValue.remark
//   httpRequest(ApiConfig.TreeNode.treenode, {bodyParams: catalogueData})?.then(res => {
//     formValue.layertreeid = res.data.id
//     httpRequest(ApiConfig.TreeNode.nodedata, {bodyParams: formValue})?.then((node) => {
//       console.log('==========================addNode', eval('(' + node.data.dataStyle + ')'));
//       updateTree()
//     })
//   })
// })
}
const clearMarker = () => {
  removeMarker();
}

const changePolygonStyle = () => {
  updatePolygonStyle(attrPolygon);
}


</script>

