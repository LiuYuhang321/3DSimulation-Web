<template>
  <div @click="handleOnClick">
    <n-input :ref="inputRef" v-model:value="inputValue" @blur="handleChange" v-if="isEdit"></n-input>
    {{ isEdit?null:inputValue }}
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue"
import { NInput } from "naive-ui"
const props = defineProps({
    value: [String, Number],
    onUpdateValue: [Function, Array]
  })

const isEdit = ref(false)
const inputRef = ref(null)
const inputValue = ref(props.value)

const handleOnClick = ()=> {
  isEdit.value = true
  nextTick(() => {
    inputRef.value.focus()
  })
}

const handleChange = () => {
  props.onUpdateValue(inputValue.value)
  isEdit.value = false
}
</script>

<style scoped>

</style>
