<template>
  <n-form
      ref="formRef"
      :model="textSetting"
      label-placement="left"
      label-width="auto"
      require-mark-placement="right-hanging"
      size="medium"
      :style="{
      maxWidth: '640px'
    }"
  >

    <n-form-item label="名称:">
      <n-input v-model:value="textSetting.name" @update:value="changeTextStyle"/>
    </n-form-item>
    <n-form-item label="所在图层:">
      <n-input v-model:value="textSetting.layer" @update:value="changeTextStyle"/>
    </n-form-item>
    <n-form-item label="样式类型:">
      <n-input v-model:value="textSetting.styleType" @update:value="changeTextStyle"/>
    </n-form-item>
    <n-form-item label="内容:">
      <n-input v-model:value="textSetting.text" type="text" @update:value="changeTextStyle"
               placement="请输入文本内容"/>
    </n-form-item>
    <n-form-item label="按视距缩放:">
      <n-switch v-model:value="textSetting.scaleByDistance" @update:value="changeTextStyle"/>
    </n-form-item>
    <n-form-item label="字体大小:">
      <n-input-number v-model:value="textSetting.font_size" :max="50" :min="1"
                      @update:value="changeTextStyle"/>
    </n-form-item>
    <n-form-item label="字体颜色:">
      <n-color-picker v-model:value="textSetting.color"
                      @update:value="changeTextStyle"/>
    </n-form-item>

    <n-form-item label="上限:">
      <n-input-number v-model:value="textSetting.scaleByDistance_far"
                      @update:value="changeTextStyle"/>
    </n-form-item>
    <n-form-item label="比例值:">
      <n-input-number v-model:value="textSetting.scaleByDistance_farValue"
                      @update:value="changeTextStyle"/>
    </n-form-item>

    <n-form-item label="下限:">
      <n-input-number v-model:value="textSetting.scaleByDistance_near"
                      @update:value="changeTextStyle"/>
    </n-form-item>
    <n-form-item label="比例值:">
      <n-input-number v-model:value="textSetting.scaleByDistance_nearValue"
                      @update:value="changeTextStyle"/>
    </n-form-item>


    <n-form-item label="操作:">
      <n-button @click="addMarker">添加</n-button>&nbsp;&nbsp;&nbsp;&nbsp;
      <n-button @click="saveMarker">保存</n-button>&nbsp;&nbsp;&nbsp;&nbsp;
      <n-button @click="clearMarker">清除</n-button>
    </n-form-item>
  </n-form>

</template>

<script setup lang="ts">
import {NInput, NInputNumber, NColorPicker, NButton, NForm, NFormItem, NSwitch} from "naive-ui"
import {
  removeMarker,
  addMarkerText,
  updateLabelStyle
} from "@/views/business/practice/components/maptools.js";
import {ref, h, computed, reactive, inject, Ref} from "vue";
import stores from "@/store";
import {ApiConfig, httpRequest} from "@/api";

const updateTree = inject('updateTree') as Function
const treeId = inject<Ref<string>>('treeId')

const textSetting = reactive({
  type: 'Label',
  name: ' ',
  layer: ' ',
  styleType: '文本',
  scaleByDistance: true,
  text: ' ',
  font_size: 20,
  color: '#FF0000',
  scaleByDistance_far: 1000000,
  scaleByDistance_farValue: 0.1,
  scaleByDistance_near: 1000,
  scaleByDistance_nearValue: 1,
  geo: {
    type: '',
    coordinates: {}
  }
});
const layerid = computed(() => stores.state.catalogueId)


const formValue = reactive({
  name: ' ',
  layertreeid: '',
  categoriestype: '',
  remark: 'Label',
  datastyle: '',
  geo: {
    type: '',
    coordinates: []
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
  addMarkerText(textSetting, (res) => {
    textSetting.geo.type = res.geometry.type
    textSetting.geo.coordinates = res.geometry.coordinates
  });
}

const saveMarker = () => {
  addMarkerText(textSetting, (res) => {
    console.log(res)
    formValue.name = res.properties.style.name
    formValue.remark = res.properties.style.remark
    //添加图层样式
    const datastyle = `{
      "type":"${res.properties.style.type}",
      "name":"${res.properties.style.name}",
      "layer":"${res.properties.style.layer}",
      "color":"${res.properties.style.color}",
      "text":"${res.properties.style.text}",
      "font_size":"${res.properties.style.font_size}",
      "scaleByDistance":"${res.properties.style.scaleByDistance}",
      "scaleByDistance_far":"${res.properties.style.scaleByDistance_far}",
      "scaleByDistance_farValue":"${res.properties.style.scaleByDistance_farValue}",
      "scaleByDistance_near":"${res.properties.style.scaleByDistance_near}",
      "scaleByDistance_nearValue":"${res.properties.style.scaleByDistance_nearValue}",
    }`

    formValue.datastyle = datastyle
    //添加图层类型和坐标
    formValue.geo.type = res.geometry.type
    formValue.geo.coordinates = res.geometry.coordinates
    formValue.remark = res.properties.style.type
    catalogueData.name = formValue.name
    catalogueData.parentid = treeId!.value
    catalogueData.Remark = formValue.remark
    httpRequest(ApiConfig.TreeNode.treenode, {bodyParams: catalogueData})?.then(res => {
      formValue.layertreeid = res.data.id
      httpRequest(ApiConfig.TreeNode.nodedata, {bodyParams: formValue})?.then((node) => {
        console.log('==========================addNode', node);
        updateTree()
      })
    })
  });
}


const clearMarker = () => {
  removeMarker();
}


const changeTextStyle = () => {
  updateLabelStyle(textSetting);
}

</script>

