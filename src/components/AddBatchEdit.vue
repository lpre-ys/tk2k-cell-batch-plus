<script setup lang="ts">
import type { BatchEdit, CellTarget, EffectTarget, Operator, TargetType } from '@/types/batchEdit'
import { cellTargetLabel, effectTargetLabel, typeLabel, operatorLabel } from '@/utils/labels'
import { computed, ref, watch } from 'vue'

const emits = defineEmits<{ (e: 'add-batch-edit', value: BatchEdit): void }>()

const type = ref<TargetType>('Cell')
const target = ref<CellTarget | EffectTarget>('X')
const operator = ref<Operator>('Plus')
const value = ref<number>(0)

const targetList = computed(() => {
  return type.value === 'Cell' ? cellTargetLabel : effectTargetLabel
})

const operatorList = computed(() => {
  if (target.value === 'Frame') {
    return { Plus: '+' }
  }

  return operatorLabel
})

watch(type, (newType, oldType) => {
  if (newType !== oldType) {
    // type更新時、targetの初期値も更新する
    if (newType === 'Cell') {
      target.value = 'X'
    } else {
      target.value = 'Frame'
    }
  }
})

watch(target, (newTarget, oldTarget) => {
  if (newTarget !== oldTarget) {
    // 初期値更新
    operator.value = 'Plus'
    value.value = 0
  }
})

const add = () => {
  const batchEdit: BatchEdit = {
    key: Date.now(),
    type: type.value,
    target: target.value,
    operator: operator.value,
    value: Math.round(value.value)
  }
  emits('add-batch-edit', batchEdit)
}
</script>

<template>
  <div class="add-batch-edit">
    <h3 class="edit-header">変更内容</h3>
    <div class="row">
      <select v-model="type">
        <option v-for="(value, key) in typeLabel" :value="key" :key="key">
          {{ value }}
        </option>
      </select>
      <small>の</small>
    </div>
    <div class="row">
      <select v-model="target" class="target">
        <option v-for="(value, key) in targetList" :value="key" :key="key">
          {{ value }}
        </option>
      </select>
      <select v-model="operator" class="operator">
        <option v-for="(value, key) in operatorList" :value="key" :key="key">
          {{ value }}
        </option>
      </select>
      <input type="number" v-model="value" step="1" />
      <button @click="add">追加</button>
    </div>
  </div>
</template>

<style scoped>
.add-batch-edit {
  font-size: 1.4rem;
}

h3 {
  font-weight: bold;
  font-size: 1.2rem;
  margin-top: 0.5rem;
}

input {
  width: 3em;
  font-size: 1.4rem;
}

select {
  font-size: 1.4rem;
}

button {
  font-size: 1.2rem;
  margin-left: 0.5em;
}

.row {
  margin: 1em;
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.operator {
  width: 2em;
}
.target {
  width: 8em;
}
</style>
