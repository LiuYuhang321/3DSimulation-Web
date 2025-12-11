<template>
  <MainPanel :title="'图层资源'">
    <div class="panal">
      <div class="header" @click="switchCom(item)" v-for="(item,index) in data" :key="index" v-if="loginState">
        <n-button v-if="item.power" class="header-button">{{ item.name }}</n-button>
      </div>
      <n-popconfirm
          v-if="current.showIcon"
          @positive-click="handlePositiveClick"
          @negative-click="handleNegativeClick"
          negative-text="取消"
          positive-text="确认"
      >
        <template #trigger>
          <n-button class="button">
            <template #icon>
              <n-icon class="icon">
                <Folder/>
              </n-icon>
            </template>
          </n-button>
        </template>
        <n-input v-model:value="inputValue" type="text" placeholder="请输入图层名称"/>
      </n-popconfirm>
    </div>
    <KeepAlive>
      <component ref="Child" :is="current.comName"/>
    </KeepAlive>
  </MainPanel>
</template>

<script setup lang="ts">
import {reactive, markRaw, computed, ref, provide} from 'vue'
import {useStore} from "vuex";
import MainPanel from "@/components/panel/MainPanel.vue";
import PersonalTree from '@/views/business/practice/components/PersonlTree.vue'
import LayerTree from '@/views/business/practice/components/LayerTree.vue'
import {Folder} from "@vicons/ionicons5"
import {NButton, NPopconfirm, NInput, NIcon} from "naive-ui"
import {ApiConfig, httpRequest} from "@/api";

const store = useStore();
const Child = ref()
const inputValue = ref('')
const formValue = reactive({
  name: '',
  parentid: '',
  type: 1,
  Index: 0.00,
  Remark: ''
})
//添加图层树目录
const handlePositiveClick = () => {
  formValue.name = inputValue.value
  httpRequest(ApiConfig.TreeNode.treenode, {bodyParams: formValue})?.then(res => {
    Child.value.loadtree()
    console.log(res)
  })
}
let loginState = computed(() => store.state.loginStates)

type Tabs = {
  name: string,
  comName: any,
  showIcon: boolean,
  power: boolean
}

//获取Tabs里的comName及show
type Com = Pick<Tabs, 'comName' | 'showIcon'>

//可以通过markRaw去避免组件再去进行代理
const data = reactive<Tabs[]>([
  {
    name: "公共图层资源",
    comName: markRaw(LayerTree),
    showIcon: false,
    power: true
  },
  {
    name: "个人图层资源",
    comName: markRaw(PersonalTree),
    showIcon: true,
    power: loginState
  }
])

let current = reactive<Com>({
  comName: data[0].comName,
  showIcon: data[0].showIcon
})

const switchCom = (item: Tabs) => {
  current.comName = item.comName;
  current.showIcon = item.showIcon;
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

.panal {
  width: 400px;
  display: flex;
  flex-direction: row;
  align-items: center;

  .header {
    display: flex;
    flex-direction: row;
    margin: 10px 0 0 15px;
  }

  .button {
    width: 30px;
    height: 25px;
    color: rgba(255, 255, 255, 0.5);
    position: absolute;
    right: 30px;
    top: 65px;
    cursor: pointer;

    .icon {
      width: 25px;
    }
  }
}

.tree-panel {
  width: 352px;
  max-height: 560px;
  overflow: auto;
}
</style>
