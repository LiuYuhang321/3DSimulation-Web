<template>
  <MainPanel :title="'图层资源'">
    <n-config-provider :theme-overrides="themeOverrides">
      <div class="layer-tree">
        <div>
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
                  :data="dataTree"
                  :pattern="pattern"
                  :show-irrelevant-nodes="false"
                  @update:checked-keys="checkTree"
                  check-strategy="child"
                  :render-suffix="renderSuffix"
                  :node-props="treeNodeProps"
              />
            </div>
          </div>
        </div>
      </div>

      <teleport to="body">
        <div class="practice">
          <practice-point></practice-point>
        </div>
      </teleport>

    </n-config-provider>
  </MainPanel>
</template>

<script setup lang="ts">
import {h, ref, onBeforeMount, onUnmounted} from "vue"
import MainPanel from "@/components/panel/MainPanel.vue";
import {NInput, NIcon, NConfigProvider, GlobalThemeOverrides, NTree, NPopover} from "naive-ui"
import {TrashBinOutline, SettingsOutline} from "@vicons/ionicons5"
import LayerSetting from "@/components/panel/LayerSetting.vue";
import {httpRequest, ApiConfig} from "@/api";
import {
  addLayerByKeys,
  removeLayerByKeys,
  setPositionToLayer
} from "@/views/business/practice/components/layertree.js";
import {useStore} from "vuex"
import PracticePoint from "@/views/business/practice/components/PracticePoint.vue";

const store = useStore();

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

const type = ref("layer-tree");
const changeType = (val) => {
  type.value = val
}

const dataTree = ref([]);
let getChangedKeys = [];

const clickTree = (data) => {
  setPositionToLayer(data.key);
}

const setNodeChecked = (id) => {
  getNodeByKey(dataTree.value, id).checked = true
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

onBeforeMount(() => {
  httpRequest(ApiConfig.SchoolTree.schoolTree)?.then(res => {
    dataTree.value = res;
  })
})

onUnmounted(() => {
  removeLayerByKeys(getChangedKeys)
  store.commit("basemap/updatePracticePointData", null);
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
        getChangedKeys.push(key)
        nodes.push(checkedNodes[index] ? checkedNodes[index] : getNodeByKey(key));
      }
    })
    addLayerByKeys(changedKeys, nodes);
  } else {
    _selectedLayerKeys.forEach(key => {
      if (!keys.includes(key)) {
        _selectedLayerKeys.delete(key);
        changedKeys.push(key);
        getChangedKeys.push(key)
      }
    })
    removeLayerByKeys(changedKeys)
  }
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

const renderSuffix = (nodeData) => {
  return null;
  if (!nodeData.option.children || nodeData.option.children.length === 0) {
    return h(
        NPopover,
        {trigger: 'click', placement: 'left'},
        {
          trigger: () => h(
              NIcon,
              {component: SettingsOutline, size: 16},
              {default: () => ''}
          ),
          default: () => h(LayerSetting, {layerSetting: nodeData.option})
        }
    )
  } else {
    return null
  }
}

</script>

<style scoped lang="scss">
.main-panel {
  background: rgba(57, 57, 57, 0.24);
  border-radius: 6px;
  border: 1px solid;
  border-image: linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.42), rgba(255, 255, 255, 0)) 1 1;
  backdrop-filter: blur(10px);
  pointer-events: auto;
  position: absolute;
  left: 24px;
  top: 12px;
}

.layer-tree {
  pointer-events: auto;
  //position: absolute;
  //left: 24px;
  //top: 12px;
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

.practice {
  position: absolute;
  pointer-events: auto;
  z-index: 100;
  right: 24px;
  top: 110px;
}
</style>
