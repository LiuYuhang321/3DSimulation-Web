<template>
  <n-form
      ref="formRef"
      :model="attrPolyline"
      label-placement="left"
      label-width="auto"
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
      <n-button @click="addMarker">添加</n-button>&nbsp;&nbsp;&nbsp;&nbsp;
      <n-button @click="saveMarker">保存</n-button>&nbsp;&nbsp;&nbsp;&nbsp;
      <n-button @click="clearMarker">清除</n-button>
    </n-form-item>
  </n-form>

</template>

<script setup lang="ts">
import {
  NInput,
  NColorPicker,
  NInputNumber,
  NSwitch,
  NSelect,
  NButton,
  NForm,
  NFormItem
} from "naive-ui"
import {
  addMarkerPolyline,
  removeMarker, updatePolylineStyle,
} from "@/views/business/practice/components/maptools.js";
import {ref, h, reactive, computed, inject, Ref} from "vue";
import store from "@/store";
import {ApiConfig, httpRequest} from "@/api";
import stores from "@/store";

const updateTree = inject('updateTree') as Function
const treeId = inject<Ref<string>>('treeId')


const attrPolyline = reactive({
  name: ' ',
  layer: ' ',
  styleType: '线',
  width: '3',
  materialType: '',
  materialOptions: {
    color: '#ff0000',
    dashLength: ''
  },
  clampToGround: true,
  geo: {
    type: '',
    coordinates: {}
  }

});
const options = [
  {label: '实线', value: false},
  {label: '虚线', value: true}
]

const handleUpdateValue = (value: string) => {
  if (value) {
    attrPolyline.materialType = mars3d.MaterialType.PolylineDash
    attrPolyline.materialOptions.dashLength = 8.0
  } else {
    attrPolyline.materialType = mars3d.MaterialType.LineFlow
  }
}

const formValue = reactive({
  name: ' ',
  layertreeid: ' ',
  categoriestype: '',
  remark: '',
  datastyle: '',
  geo: {
    type: '',
    coordinates: {}
  }
});
const layerid = computed(() => stores.state.catalogueId)
const catalogueData = reactive({
  name: '',
  parentid: '',
  type: 2,
  Index: 0.00,
  Remark: '',
})


const addMarker = () => {
  addMarkerPolyline(attrPolyline, (res) => {
    attrPolyline.geo.type = res.geometry.type
    attrPolyline.geo.coordinates = res.geometry.coordinates
  })
}
const saveMarker = () => {
  //添加图层样式
  const datastyle = `{
      "name":"${attrPolyline.name}",
      "layer":"${attrPolyline.layer}",
      "width":"${attrPolyline.width}",
      "clampToGround":"${attrPolyline.clampToGround}",
      "materialType":"${attrPolyline.materialType}",
      "materialcolor":"${attrPolyline.materialOptions.color}",
      "materialdashLength":"${attrPolyline.materialOptions.dashLength}",
    }`
  // console.log(eval('(' + datastyle + ')'))
  formValue.name = attrPolyline.name
  formValue.remark = attrPolyline.layer
  formValue.datastyle = datastyle

  formValue.geo.type = attrPolyline.geo.type
  formValue.geo.coordinates = attrPolyline.geo.coordinates

  catalogueData.name = formValue.name
  catalogueData.parentid = treeId!.value
  catalogueData.Remark = formValue.remark
  console.log(formValue)
  httpRequest(ApiConfig.TreeNode.treenode, {bodyParams: catalogueData})?.then(res => {
    console.log(res.data.id)
    formValue.layertreeid = res.data.id
    httpRequest(ApiConfig.TreeNode.nodedata, {bodyParams: formValue})?.then((node) => {
      console.log('==========================addNode', node);
      updateTree()
    })
  })


  // addMarkerPolyline(attrPolyline, (res) => {
  //   console.log(res)
  //   formValue.name = res.properties.style.name
  //   formValue.remark = res.properties.style.layerName
  //   const datastyle = `{
  //     "name":"${res.properties.style.name}",
  //     "layer":"${res.properties.style.layer}",
  //     "width":"${res.properties.style.width}",
  //     "clampToGround":"${res.properties.style.clampToGround}",
  //     "materialType":"${res.properties.style.materialType}",
  //     "materialcolor":"${res.properties.style.materialOptions.color}",
  //     "materialdashLength":"${res.properties.style.materialOptions.dashLength}",
  // }`
  //   console.log(eval('(' + datastyle + ')'))
  //   //添加图层样式
  //   formValue.datastyle = datastyle
  //   //添加图层类型和坐标
  //   formValue.geo.type = res.geometry.type
  //
  //   const arr1 = res.geometry.coordinates[0]
  //   const arr2 = res.geometry.coordinates[1]
  //   const arr = [arr1, arr2]
  //   console.log(arr)
  //   formValue.geo.coordinates = arr
  //   catalogueData.name = formValue.name
  //   catalogueData.parentid = treeId!.value
  //   catalogueData.Remark = formValue.remark
  //   httpRequest(ApiConfig.TreeNode.treenode, {bodyParams: catalogueData})?.then(res => {
  //     formValue.layertreeid = res.data.id
  //     httpRequest(ApiConfig.TreeNode.nodedata, {bodyParams: formValue})?.then((node) => {
  //       console.log('==========================addNode', node);
  //       updateTree()
  //     })
  //   })
  // });

}
const clearMarker = () => {
  removeMarker();
}
const changePolylineStyle = () => {
  updatePolylineStyle(attrPolyline);
}
</script>
