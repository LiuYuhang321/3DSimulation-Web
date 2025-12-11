<template>
  <div class="box">
    <div class="box-header">
      <div class="box-header-name">
        登录
      </div>
      <div @click="Cancel" class="box-header-cancel">
        <n-icon>
          <Close/>
        </n-icon>
      </div>
    </div>
    <n-form
        class="form"
        ref="formRef"
        inline
        :label-width="80"
        :model="formValue"
        :rules="rules"
        label-placement ="left"
        size="medium"
    >
      <n-form-item class="form-name" label="用户名" label-align="left" :label-style="labelStyle" path="user.name">
        <n-input v-model:value="formValue.username" placeholder="请输入用户名"/>
      </n-form-item>
      <n-form-item class="form-password" label="密码" label-align="left" :label-style="labelStyle" path="user.age">
        <n-input v-model:value="formValue.password" placeholder="请输入密码"/>
      </n-form-item>
      <n-form-item class="formbutton">
        <n-button class="formbutton-login" attr-type="button" @click="handleValidateClick">
          登录
        </n-button>
        <n-button class="formbutton-cancel" attr-type="button" @click="Cancel">
          取消
        </n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive} from 'vue'
import {useStore} from "vuex"
import {NForm, NInput, NButton, NFormItem, FormInst, FormRules, useMessage} from 'naive-ui'
import {Close} from '@vicons/ionicons5'
import {ApiConfig, httpRequest, setAuthToken} from '@/api/index'

const store = useStore()
const message = useMessage();

const cancel = false
const formRef = ref<FormInst | null>(null);

const realName = ref()
const formValue = reactive({
  username: '',
  password: ''
});
const rules: FormRules = {
  username: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur'
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur'
  }
};

const emit = defineEmits(['on-click']);
const Cancel = () => {
  emit('on-click', cancel)
}

const handleValidateClick = (e: MouseEvent) => {
  httpRequest(ApiConfig.Login.login, {bodyParams: formValue}, {noAuth: true})?.then(res => {
    console.log('==========================login', res);
    if (res.code === 0) {
      message.error('用户名或密码不正确');
    } else {
      setAuthToken(res);
      httpRequest(ApiConfig.Login.getUser)?.then(userValue => {
        console.log(userValue.data.f_RealName);
        realName.value = userValue.data.f_RealName;
        emit('on-click', [cancel, realName.value]);
        message.success('登录成功！')
        store.commit('updateLoginStates', true)
      })
    }
  })
}
</script>


<style scoped lang="scss">
.box {
  display: flex;
  flex-direction: column;
  background: rgba(57, 57, 57, 0.24);
  border-radius: 6px;
  border: 1px solid;
  border-image: linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.42), rgba(255, 255, 255, 0)) 1 1;
  backdrop-filter: blur(10px);
  pointer-events: auto;
  width: 40vh;
  height: 30vh;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -20vh;
  margin-top: -15vh;
  z-index: 100;

  .login-form {
    margin-top: 45px;
  }

  .box-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    border-bottom: 1px rgba(255, 255, 255, 0.3) solid;

    .box-header-name {
      font-family: SourceHanSansCN-Medium, SourceHanSansCN;
      font-size: 20px;
      color: #cccccc;
    }

    .box-header-cancel {
      width: 25px;
      color: rgba(255, 255, 255, 0.3);
      cursor: pointer;
    }
  }
  .form{
    flex:1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    .formbutton{
      .formbutton-cancel{
        margin-left: 80px;
      }
    }
  }
}
</style>
