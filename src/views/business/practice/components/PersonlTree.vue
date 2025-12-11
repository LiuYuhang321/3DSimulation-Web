<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <div class="layer-tree">
      <div class="layer-tree-panel" clearable>
        <div class="input-panel">
          <n-input placeholder="快速检索" v-model:value="pattern" clearable>
            <template #clear-icon v-if="pattern && pattern.length > 0">
              <n-icon :component="TrashBinOutline"/>
            </template>
          </n-input>
        </div>
        <div class="tree-panel-line"></div>
        <div class="tree-panel">
          <n-tree
              block-line
              cascade
              checkable
              accordion
              key-field="id"
              label-field="name"
              children-field="child"
              :data="dataTree"
              :pattern="pattern"
              :show-irrelevant-nodes="false"
              @update:checked-keys="checkTree"
              @update:selected-keys="updateNode"
              check-strategy="child"
              :render-suffix="renderSuffix"
              :node-props="treeNodeProps"
          />
        </div>
      </div>
    </div>
  </n-config-provider>
  <teleport to="body">
    <div class="position" v-if="tool==='标注'">
      <Annotation @onclose="close"/>
    </div>
  </teleport>


  <teleport to="body">
    <div class="dialog" v-if="tool==='点标注'">
      <PointDialog @on-close="close"/>
    </div>

  </teleport>
  <teleport to="body">
    <div class="dialog" v-if="tool==='线标注'">
      <PolylineDialog @on-close="close"/>
    </div>
  </teleport>

  <teleport to="body">
    <div class="dialog" v-if="tool==='面标注'">
      <PolygonDialog @on-close="close"/>
    </div>
  </teleport>

  <teleport to="body">
    <div class="dialog" v-if="tool==='字标注'">
      <TextDialog @on-close="close"/>
    </div>
  </teleport>


</template>

<script setup lang="ts">
import {ref, h, onBeforeMount, reactive, provide,onUnmounted} from "vue"
import {NInput, NIcon, NConfigProvider, GlobalThemeOverrides, NTree, NPopconfirm, NButton, TreeOption} from "naive-ui"
import {TrashBinOutline, SettingsOutline, FolderOutline, FlagOutline, TrashSharp} from "@vicons/ionicons5"
import {httpRequest, ApiConfig} from "@/api";
import {
  setPositionToLayer,
  addPersonalLayerByKeys,
  removePersonalLayerByKeys,
  changeTreeData
} from "@/views/business/practice/components/layertree.js";
import {useStore} from "vuex"
import stores from '@/store'
import Annotation from '@/views/business/practice/Annotation/index.vue'
import PointDialog from '../Annotation/PointDialog.vue'
import PolylineDialog from '../Annotation/PolylineDialog.vue'
import PolygonDialog from '../Annotation/PolygonDialog.vue'
import TextDialog from '../Annotation/TextDialog.vue'


const themeOverrides: GlobalThemeOverrides = {
  Input: {
    textColor: "#FFFFFF",
    color: "rgba(57,57,57,0.24)",
    colorFocus: "rgba(57,57,57,0.24)",
    border: "none",
    borderFocus: "none",
    borderHover: "none"
  },
  Tree: {
    nodeTextColor: '#FFFFFF',
    arrowColor: '#FFFFFF',
    nodeColorHover: 'rgba(26,165,172,0.3)',
    nodeColorActive: 'null',
    nodeColorPressed: 'rgba(26,165,172,0.3)'
  },
  Checkbox: {
    color: 'rgba(255,255,255,0)',
    colorChecked: 'rgba(255,255,255,1)',
    checkMarkColor: 'rgba(0,0,0,0.8)',
    boxShadowFocus: 'none'
  },
  Popover: {
    color: "rgba(157,154,154,0.88)"
  }
}


const tool = ref<string>('')

const type = ref("layer-tree");
const changeType = (val) => {
  type.value = val
}


//显示子组件
const treeId = ref<string>('');

const close = (val: string) => {
  tool.value = val
}


const dataTree = ref([]);
let getChangedKeys = [];

const inputValue = ref('')
const clickTree = (data) => {
  setPositionToLayer(data.key);
}
const treeNodeProps = ({option}) => {
  if (option.children && option.children.length > 0) {
    return {}
  } else {
    return {
      ondblclick() {
        clickTree(option);

      }
    }
  }
}

const loadtree = () => {
  httpRequest(ApiConfig.Getree.getree).then(res => {
    dataTree.value = changeTreeData(res.data, 'type', 'createTime')
  })
}


provide("updateTree", loadtree)
provide("treeId", treeId)

onBeforeMount(() => {
  loadtree()
})

onUnmounted(()=>{
  removePersonalLayerByKeys(getChangedKeys)
})

defineExpose({
  loadtree
})
const pattern = ref('');

let _selectedLayerKeys = new Set();
const checkTree = (keys, checkedNodes) => {
  let changedKeys = [];
  let nodes = [];
  if (keys.length >= _selectedLayerKeys.size) {
    keys.forEach((key, index) => {
      if (!_selectedLayerKeys.has(key)) {
        _selectedLayerKeys.add(key);
        changedKeys.push(key);
        getChangedKeys.push(key);
        nodes.push(checkedNodes[index] ? checkedNodes[index] : getNodeByKey(key));
      }
    })
    // console.log(changedKeys, nodes)
    addPersonalLayerByKeys(changedKeys, nodes);
  } else {
    _selectedLayerKeys.forEach(key => {
      if (!keys.includes(key)) {
        _selectedLayerKeys.delete(key);
        changedKeys.push(key);
        getChangedKeys.push(key);
      }
    })
    removePersonalLayerByKeys(changedKeys)
  }
}

const setNodeChecked = (id) => {
  getNodeByKey(dataTree.value, id).checked = true
}

const getNodeByKey = (_treeData, key) => {
  let res = null;
  if (_treeData) {
    for (let i = 0; i < _treeData.length; i++) {
      const item = _treeData[i];
      if (item.key && item.key === key) {
        res = item;
        break;
      }
      if (item.children && item.children.length > 0) {
        res = getNodeByKey(item.children, key)
        if (res) {
          break;
        }
      }
    }
  }
  return res;
}

const updateNode = (keys, checkedNodes) => {

}

const catalogueData = reactive({
  name: '',
  parentid: '',
  type: 1,
  Index: 0.00,
  Remark: '',
})

const renderSuffix = ({option}: { option: TreeOption }) => {
  if (option.type === 1) {
    return h(
        'div',
        null,
        [
          h(
              NPopconfirm,
              {
                onPositiveClick: () => {
                  //添加子目录点击事件
                  console.log(option.id)
                  catalogueData.name = inputValue.value
                  catalogueData.parentid = option.id
                  httpRequest(ApiConfig.TreeNode.treenode, {bodyParams: catalogueData})?.then(res => {
                    console.log(res)
                  })
                  loadtree()
                },
                onNegativeClick: () => {
                  return null
                },
                negativeText: "取消",
                positiveText: '确认'
              },
              {
                trigger: () => h(
                    NButton,
                    {size: "tiny"},
                    {icon: () => h(NIcon, {component: FolderOutline, size: 16})}),
                default: () => h(NInput, {
                      placeholder: '请输入图层名称', value: inputValue.value,
                      ["onUpdate:value"]: (value) => {
                        inputValue.value = value
                      },
                    },
                    {
                      default: () => {
                      }
                    })
              }
          ),
          h(
              NButton,
              {
                size: "tiny",
                onClick: () => {
                  treeId.value = option.id
                  stores.commit('updatecatalogueId', option.id)
                  console.log(option.id)
                  //添加标注图层信息(属性编辑,弹出标注类型框)
                  tool.value = '标注'
                }
              },
              {icon: () => h(NIcon, {component: FlagOutline, size: 16})}
          ),
          h(
              NPopconfirm,
              {
                onPositiveClick: () => {
                  console.log(option.id)
                  httpRequest(ApiConfig.DeleteTreeNode.deleteTreenode, {pathParams: {id: option.id}})?.then((res) => {
                    loadtree()
                  })
                },
                onNegativeClick: () => {
                  return null
                },
                negativeText: "取消",
                positiveText: '确认'
              },
              {
                trigger: () => h(
                    NButton,
                    {size: "tiny"},
                    {icon: () => h(NIcon, {component: TrashSharp, size: 16})}),
                default: () => h('div', {}, {default: () => '确认删除?'})
              }
          )
        ]
    )
  } else {
    return h(
        'div',
        null,
        [
          h(
              NButton,
              {
                size: "tiny",
                onClick: () => {
                  const ID = JSON.parse(JSON.stringify(option.nodeDatas))[0]
                  stores.commit('updateoptionId', ID)
                  // console.log(ID)
                  switch (ID.geo.type) {
                    case 'Point': {
                      if (ID.remark === "Label") {
                        tool.value = '字标注'
                      } else {
                        tool.value = '点标注'
                      }

                      break;
                    }
                    case "LineString": {
                      tool.value = '线标注'
                      break;
                    }
                    case "Polygon": {
                      tool.value = '面标注'
                      break;
                    }
                  }

                }
              },
              {icon: () => h(NIcon, {component: SettingsOutline, size: 16})}
          ),
          h(
              NPopconfirm,
              {
                onPositiveClick: () => {
                  console.log(option.id)
                  //删除操作
                  httpRequest(ApiConfig.DeleteTreeNode.deleteTreenode, {pathParams: {id: option.id}},)?.then(res => {
                    loadtree()
                  })
                },
                onNegativeClick: () => {
                  return null
                },
                negativeText: "取消",
                positiveText: '确认'
              },
              {
                trigger: () => h(
                    NButton,
                    {size: "tiny"},
                    {icon: () => h(NIcon, {component: TrashSharp, size: 16})}),
                default: () => h('div', {}, {default: () => '确认删除?'})
              }
          )
        ]
    )
  }
}


</script>

<style scoped lang="scss">
.layer-tree {
  pointer-events: auto;
  display: flex;
  flex-direction: column;

  .icon {
    cursor: pointer;
    padding: 5px;
    left: 350px;
  }
}

.layer-tree-panel {
  width: 400px;
  display: flex;
  flex-direction: column;
  padding: 10px 20px 20px 20px;
}

.input-panel {
  width: 352px;
  border-radius: 4px;
  border: 1px solid;
  border-image: linear-gradient(360deg, rgba(255, 255, 255, 0.69), rgba(44, 197, 216, 0.6)) 1 1;
}

.tabs-panel {
  width: 352px;
  display: flex;
  align-items: center;

  .tab-item {
    flex: 1;
    height: 40px;
    cursor: pointer;
    background: rgba(94, 94, 94, 0.52);
    border-radius: 4px;
    border: 1px solid;
    border-image: linear-gradient(360deg, rgba(255, 255, 255, 0.69), rgba(44, 197, 216, 0.6)) 1 1;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
    font-family: SourceHanSansCN-Medium, SourceHanSansCN;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.5);
  }

  .tab-item-left {
    border-radius: 4px 0px 0px 4px;
  }

  .tab-item-right {
    border-radius: 0px 4px 4px 0px;
  }

  .tab-item-actived {
    background: #00AEB6 linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%);
    border: 1px solid;
    border-image: linear-gradient(360deg, rgba(255, 255, 255, 0.65), rgba(44, 197, 216, 0.24)) 1 1;
    color: #FFFFFF;
  }
}

.tree-panel-line {
  margin-top: 4px;
  width: 352px;
  height: 0;
  opacity: 0.52;
  border: 1px solid #B7F8FF;
}

.tree-panel {
  width: 352px;
  max-height: 560px;
  overflow: auto;
}

.position {
  position: absolute;
  pointer-events: auto;
  z-index: 100;
  right: 24px;
  top: 110px;
}

.dialog {
  position: absolute;
  pointer-events: auto;
  z-index: 100;
  right: 24px;
  top: 110px;
}
</style>
