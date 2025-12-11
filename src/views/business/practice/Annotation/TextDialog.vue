<template>
  <sub-dialog :title="'属性编辑'" @close="removeDialog">
    <n-form
        ref="formRef"
        :model="textSetting"
        label-placement="left"
        label-width="110"
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


      <n-form-item label="符号操作:">
        <n-button @click="changeMarker">确认修改</n-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <n-button @click="cancelMarker">取消修改</n-button>
      </n-form-item>
    </n-form>


  </sub-dialog>
</template>

<script setup lang="ts">
import SubDialog from '@/components/panel/SubDialog.vue'
import {NInput, NInputNumber, NColorPicker, NButton, NForm, NFormItem, NSwitch} from "naive-ui"
import {
  updateLabelStyle
} from "@/views/business/practice/components/maptools.js";
import {computed, reactive, onMounted, inject} from "vue";
import stores from "@/store";
import {ApiConfig, httpRequest} from "@/api";


const textSetting = reactive({
  type: 'Label',
  name: ' ',
  layer: ' ',
  styleType: '文本',
  scaleByDistance: null,
  text: ' ',
  font_size: '',
  color: '',
  scaleByDistance_far: '',
  scaleByDistance_farValue: '',
  scaleByDistance_near: '',
  scaleByDistance_nearValue: ''
});

const ID = computed(() => stores.state.optionId)

const formValue = reactive({
  name: ' ',
  datastyle: '',
});
const updateTree = inject("updateTree") as Function
const emit = defineEmits(['on-close'])
const removeDialog = () => {
  emit('on-close', '')
}
onMounted(() => {
  showMarker()
})
let res = JSON.parse(JSON.stringify(ID.value))

// console.log(res)
let str = JSON.parse(res.dataStyle)
// console.log(str)
let obj = eval('(' + str + ')')
console.log(obj)

const showMarker = () => {
  textSetting.name = obj.name
  textSetting.layer = obj.layer
  textSetting.color = obj.color
  textSetting.text = obj.text
  textSetting.font_size = obj.font_size
  textSetting.scaleByDistance = obj.scaleByDistance
  textSetting.scaleByDistance_far = obj.scaleByDistance_far
  textSetting.scaleByDistance_farValue = obj.scaleByDistance_farValue
  textSetting.scaleByDistance_near = obj.scaleByDistance_near
  textSetting.scaleByDistance_nearValue = obj.scaleByDistance_nearValue
}

//确认修改
const changeMarker = () => {
  formValue.name = textSetting.name
  //添加图层样式
  const datastyle = `{
      "type":"${textSetting.type}",
      "name":"${textSetting.name}",
      "layer":"${textSetting.layer}",
      "color":"${textSetting.color}",
      "text":"${textSetting.text}",
      "font_size":"${textSetting.font_size}",
      "scaleByDistance":"${textSetting.scaleByDistance}",
      "scaleByDistance_far":"${textSetting.scaleByDistance_far}",
      "scaleByDistance_farValue":"${textSetting.scaleByDistance_farValue}",
      "scaleByDistance_near":"${textSetting.scaleByDistance_near}",
      "scaleByDistance_nearValue":"${textSetting.scaleByDistance_nearValue}",
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

const changeTextStyle = () => {
  updateLabelStyle(textSetting);
}

</script>

