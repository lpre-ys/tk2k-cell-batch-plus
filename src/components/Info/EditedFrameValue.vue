<script setup lang="ts">
import { computed } from 'vue'
import EditedValue from './EditedValue.vue'
const props = defineProps<{
  isEdited: boolean
  preValue: number
  value: number
}>()

const isRed = computed(() => {
  return props.value < 1
})
</script>

<template>
  <EditedValue
    :is-edited="isEdited"
    :pre-value="preValue"
    :value="value"
    :class="{ warn: isRed }"
  />
</template>
