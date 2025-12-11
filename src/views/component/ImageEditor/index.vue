<template>
  <div class="drawing-container">
    <div ref="editor"></div>
    <div class="action-button">
      <n-button text-color="#FFFFFF" round @click="save">
        <template #icon>
          <n-icon color="#FFFFFF">
            <save-outline />
          </n-icon>
        </template>
        保存
      </n-button>
      &nbsp;&nbsp;
      <n-button text-color="#FFFFFF" round @click="close">
        <template #icon>
          <n-icon color="#FFFFFF">
            <close-outline />
          </n-icon>
        </template>
        退出
      </n-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import {NButton, NIcon} from "naive-ui"
import 'tui-image-editor/dist/tui-image-editor.css'
import 'tui-color-picker/dist/tui-color-picker.css'
import ImageEditor from 'tui-image-editor'
import {onMounted, ref, onBeforeUnmount, watch} from "vue";
import { CloseOutline,SaveOutline } from "@vicons/ionicons5"

const props = defineProps({
  imageData:{
    type: String,
    default: null
  }
})
const watcher = watch(()=>props.imageData, (data)=>{
  loadImage(data);
})
const editor = ref();
const emit = defineEmits(['close','editorReady'])
const locale_zh = {
  ZoomIn: '放大',
  ZoomOut: '缩小',
  Hand: '手掌',
  History: '历史',
  Resize: '调整宽高',
  Crop: '裁剪',
  DeleteAll: '全部删除',
  Delete: '删除',
  Undo: '撤销',
  Redo: '反撤销',
  Reset: '重置',
  Flip: '镜像',
  Rotate: '旋转',
  Draw: '画',
  Shape: '形状标注',
  Icon: '图标标注',
  Text: '文字标注',
  Mask: '遮罩',
  Filter: '滤镜',
  Bold: '加粗',
  Italic: '斜体',
  Underline: '下划线',
  Left: '左对齐',
  Center: '居中',
  Right: '右对齐',
  Color: '颜色',
  'Text size': '字体大小',
  Custom: '自定义',
  Square: '正方形',
  Apply: '应用',
  Cancel: '取消',
  'Flip X': 'X 轴',
  'Flip Y': 'Y 轴',
  Range: '区间',
  Stroke: '描边',
  Fill: '填充',
  Circle: '圆',
  Triangle: '三角',
  Rectangle: '矩形',
  Free: '曲线',
  Straight: '直线',
  Arrow: '箭头',
  'Arrow-2': '箭头2',
  'Arrow-3': '箭头3',
  'Star-1': '星星1',
  'Star-2': '星星2',
  Polygon: '多边形',
  Location: '定位',
  Heart: '心形',
  Bubble: '气泡',
  'Custom icon': '自定义图标',
  'Load Mask Image': '加载蒙层图片',
  Grayscale: '灰度',
  Blur: '模糊',
  Sharpen: '锐化',
  Emboss: '浮雕',
  'Remove White': '除去白色',
  Distance: '距离',
  Brightness: '亮度',
  Noise: '噪音',
  'Color Filter': '彩色滤镜',
  Sepia: '棕色',
  Sepia2: '棕色2',
  Invert: '负片',
  Pixelate: '像素化',
  Threshold: '阈值',
  Tint: '色调',
  Multiply: '正片叠底',
  Blend: '混合色',
  Width: '宽度',
  Height: '高度',
  'Lock Aspect Ratio': '锁定宽高比例'
}

const blackTheme = {
  'common.bi.image': '',
  'common.bisize.width': '0',
  'common.bisize.height': '0',
  'common.backgroundImage': 'none',
  'common.backgroundColor': '#1e1e1e',
  'common.border': '0px',

  // header
  'header.backgroundImage': 'none',
  'header.backgroundColor': 'transparent',
  'header.border': '0px',

  // load button
  'loadButton.display': 'none',

  // download button
  'downloadButton.display': 'none',

  // main icons
  'menu.normalIcon.color': '#8a8a8a',
  'menu.activeIcon.color': '#555555',
  'menu.disabledIcon.color': '#434343',
  'menu.hoverIcon.color': '#e9e9e9',
  'menu.iconSize.width': '24px',
  'menu.iconSize.height': '24px',

  // submenu icons
  'submenu.normalIcon.color': '#8a8a8a',
  'submenu.activeIcon.color': '#e9e9e9',
  'submenu.iconSize.width': '32px',
  'submenu.iconSize.height': '32px',

  // submenu primary color
  'submenu.backgroundColor': '#1e1e1e',
  'submenu.partition.color': '#3c3c3c',

  // submenu labels
  'submenu.normalLabel.color': '#8a8a8a',
  'submenu.normalLabel.fontWeight': 'lighter',
  'submenu.activeLabel.color': '#fff',
  'submenu.activeLabel.fontWeight': 'lighter',

  // checkbox style
  'checkbox.border': '0px',
  'checkbox.backgroundColor': '#fff',

  // range style
  'range.pointer.color': '#fff',
  'range.bar.color': '#666',
  'range.subbar.color': '#d1d1d1',

  'range.disabledPointer.color': '#414141',
  'range.disabledBar.color': '#282828',
  'range.disabledSubbar.color': '#414141',

  'range.value.color': '#fff',
  'range.value.fontWeight': 'lighter',
  'range.value.fontSize': '11px',
  'range.value.border': '1px solid #353535',
  'range.value.backgroundColor': '#151515',
  'range.title.color': '#fff',
  'range.title.fontWeight': 'lighter',

  // colorpicker style
  'colorpicker.button.border': '1px solid #1e1e1e',
  'colorpicker.title.color': '#fff',
};

onMounted(() => {
  console.log('==============================onMounted editor', props.imageData, editor.value);
  if(props.imageData){
    createEditorInstance();
  }
})
let instance: any = null
const createEditorInstance = () => {
  instance = new ImageEditor(editor.value, {
    includeUI: {
      loadImage: {
        path: props.imageData,
        name: 'image'
      },
      menu: ['resize', 'crop', 'rotate', 'draw', 'shape', 'icon', 'text', 'filter'], // 底部菜单按钮列表 隐藏镜像flip和遮罩mask
      // initMenu: 'crop', // 默认打开的菜单项
      menuBarPosition: 'bottom', // 菜单所在的位置
      locale: locale_zh, // 本地化语言为中文
      theme: blackTheme // 自定义样式
    },
    cssMaxWidth: 1410, // canvas 最大宽度
    cssMaxHeight: 1200,// canvas 最大高度
    selectionStyle: {
      cornerSize: 20,
      rotatingPointOffset: 70
    }
  })
  document.getElementsByClassName('tui-image-editor-main')[0].style.top = '45px' // 调整图片显示位置
  // document.getElementsByClassName('tie-btn-reset tui-image-editor-item help')[0].style.display = 'none' // 隐藏顶部重置按钮
}

// 保存图片，并上传
const save = () => {
  const a = document.createElement("a")
  a.href = instance.toDataURL();
  a.download = new Date().getTime() + '' // 这里填保存成的文件名
  a.click()
  URL.revokeObjectURL(a.href)
  a.remove();
}
const close = () => {
  emit('close', '')
}

const loadImage = (image)=>{
  if(!instance){
    createEditorInstance();
  }
  instance.addImageObject(image);
}

onBeforeUnmount(()=>{
  watcher();
  instance.destroy();
  instance = null;
})
</script>

<style lang="scss" scoped>
.drawing-container {
  pointer-events: auto;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1000;
  .action-button{
    position: absolute;
    right: 50px;
    top: 15px;
  }
}
</style>
