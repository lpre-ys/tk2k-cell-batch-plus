<script setup lang="ts">
import { computed } from 'vue'
import EditedValue from './EditedValue.vue'
const props = defineProps<{
  isEdited: boolean
  preValue: number
  value: number
  min: number
  max: number
}>()

const isRed = computed(() => {
  return props.value < props.min || props.value > props.max
})

const showValue = computed(() => {
  let result = props.value

  if (result < props.min) return props.min

  if (result > props.max) return props.max

  return result
})
</script>

<template>
  <EditedValue
    :is-edited="isEdited"
    :pre-value="preValue"
    :value="showValue"
    :class="{ warn: isRed }"
  />
</template>
