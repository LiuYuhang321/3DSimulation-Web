<template>
  <div class="header-panel">
    <div class="header-menu">
      <div
          :class="['menu-item','menu-item-left-margin',menuActived==='地质实习'?'menu-item-left-actived':'menu-item-left']"
          @click="changeMenu('地质实习')">地质实习
      </div>
      <div
          :class="['menu-item',menuActived==='数字校园'?'menu-item-left-actived':'menu-item-left']"
          @click="changeMenu('数字校园')">数字校园
      </div>
      <div class="menu-black"></div>
      <div
          :class="['menu-item',menuActived==='数字化资源'?'menu-item-right-actived':'menu-item-right']"
          @click="changeMenu('数字化资源')">数字化资源
      </div>
      <div
          :class="['menu-item','menu-item-right-margin',menuActived==='综合资料'?'menu-item-right-actived':'menu-item-right']"
          @click="changeMenu('教学实践')">教学实践
      </div>
    </div>
    <div class="login">
      <n-button @click="ShowLogin" v-if="showStates" size="tiny">登录</n-button>
      <div class="userbox" v-if="!showStates">
        <div class="user">
          <n-icon size="25" depth="3">
            <Person/>
          </n-icon>
          {{ userName }}
        </div>
        <div>
          <n-button @click="removeUser" size="tiny">注销</n-button>
        </div>
      </div>
    </div>
    <teleport to="body">
      <Login @on-click="getCancel" v-if="showLogin"/>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import {computed, ref, onMounted, onUpdated} from "vue";
import {useRouter} from "vue-router"
import {useStore} from "vuex"
import {NButton, NIcon} from 'naive-ui'
import {Person} from "@vicons/ionicons5"
import Login from '@/views/layout/Login.vue'
import {ApiConfig, httpRequest, setAuthToken} from '@/api/index'

const store = useStore()
const router = useRouter();
const menuActived = computed(() => router.currentRoute.value.name);

const showLogin = ref(false)
const showStates = ref(true)
const userName = ref<string>()

const getName = ref()

const changeMenu = (name: string) => {
  switch (name) {
    case '地质实习': {
      router.push({path: '/practice'})
      break;
    }
    case '数字校园': {
      router.push({path: '/school'})
      break;
    }
    case '数字化资源': {
      router.push({path: '/resources'})
      break;
    }
    case '教学实践': {
      window.open('/spatialanalysis/','_blank')
      break;
    }
  }
}

const ShowLogin = () => {
  showLogin.value = !showLogin.value
}

const getCancel = (args: boolean | Array<any>) => {
  if (typeof args === "boolean") {
    console.log(args)
    showLogin.value = args
  } else {
    console.log(args)
    showLogin.value = args[0];
    showStates.value = args[0];
    getName.value = args[1];
  }
}

const removeUser = () => {
  localStorage.removeItem('3DSIMULATION-TOKEN')
  showStates.value = true
  store.commit('updateLoginStates', false)
}

onUpdated(() => {
  if (showStates.value === false && getName.value !== undefined) {
    userName.value = getName.value
  }
})

onMounted(async () => {
  const Token = JSON.parse(localStorage.getItem('3DSIMULATION-TOKEN'));
  if (Token !== null) {
    showStates.value = false;
    const userInfo = await httpRequest(ApiConfig.Login.getUser);
    userName.value = userInfo?.data.f_RealName
    if (showStates.value === false) {
      store.commit('updateLoginStates', true)
    }
  }
})

</script>

<style scoped lang="scss">
.header-panel {
  position: absolute;
  top: -15px;
  z-index: 200;
  height: 98px;
  width: 100%;
  background: url("./assets/images/view/top.webp");
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-right: 3px;

  .header-menu {
    position: absolute;
    width: 100%;
    bottom: 8px;
    display: flex;
    flex-direction: row;
    justify-content: center;

    .menu-black {
      width: 486px;
      height: 32px;
    }

    .menu-item {
      width: 200px;
      height: 32px;
      background-size: 100% 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      font-family: SourceHanSansCN-Medium, SourceHanSansCN;
      font-weight: 500;
      color: #FFFFFF;
      cursor: pointer;
    }

    .menu-item-not-allowed {
      cursor: not-allowed;
    }

    .menu-item-left-margin {
      margin-right: -24px;
    }

    .menu-item-left {
      background-image: url("./assets/images/view/bg_menu_left.webp");
    }

    .menu-item-left-actived {
      background-image: url("./assets/images/view/bg_menu_left_02.png");
    }

    .menu-item-right-margin {
      margin-left: -24px;
    }

    .menu-item-right {
      background-image: url("./assets/images/view/bg_menu_right.webp");
    }

    .menu-item-right-actived {
      background-image: url("./assets/images/view/bg_menu_right_02.png");
    }
  }
}

.login {
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  top: 20px;
  right: 20px;
  color: #cccccc;

  .userbox {
    display: flex;
    flex-direction: row;
    justify-content: center;

    .user {
      display: flex;
      justify-content: center;
      font-family: SourceHanSansCN-Medium, SourceHanSansCN;
      font-size: 18px;
    }
  }
}
</style>
