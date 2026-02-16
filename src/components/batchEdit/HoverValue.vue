<script setup lang="ts">
import type { BatchEdit } from '@/types/batchEdit'
import { areaLabel, shakeLabel, operatorLabel } from '@/utils/labels'
import { ref } from 'vue'

const props = defineProps<{
  index: number
  batchEdit: BatchEdit
}>()

const emit = defineEmits(['update-value'])

const localValue = ref<number>(props.batchEdit.value)

const onChange = () => {
  emit('update-value', props.index, localValue.value)
}
</script>

<template>
  <span class="operator">{{ operatorLabel[batchEdit.operator] }}</span>
  <select v-if="batchEdit.target === 'Area'" v-model="localValue" @change="onChange">
    <option v-for="(value, key) in areaLabel" :value="key" :key="key">
      {{ value }}
    </option>
  </select>
  <select v-else-if="batchEdit.target === 'Shake'" v-model="localValue" @change="onChange">
    <option v-for="(value, key) in shakeLabel" :value="key" :key="key">
      {{ value }}
    </option>
  </select>
  <input v-else type="number" step="1" v-model="localValue" @change="onChange" />
</template>

<style scoped>
input,
select {
  font-size: 1.3rem;
  width: 3em;
  border: none;
  border-bottom: 1px dashed #78909c;
  margin-bottom: 2px;
}
.operator {
  font-size: 1.3rem;
  font-weight: bold;
  display: inline-block;
  width: 1em;
  text-align: center;
}

.value {
  font-size: 1.3rem;
  min-width: 2em;
  display: inline-block;
  border: 1px solid gray;
}
</style>
