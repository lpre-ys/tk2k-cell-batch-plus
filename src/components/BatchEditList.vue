<script setup lang="ts">
import type { BatchEdit } from '@/types/batchEdit'
import { cellTargetLabel, effectTargetLabel, typeLabel } from '@/utils/labels'
import { ref, watchEffect } from 'vue'
import draggable from 'vuedraggable'
import HoverValue from './batchEdit/HoverValue.vue'

const props = defineProps<{
  batchEdits: BatchEdit[]
}>()

const emits = defineEmits(['update-batch-edits'])

const localBatchEdits = ref<BatchEdit[]>([...props.batchEdits])

watchEffect(() => {
  localBatchEdits.value = [...props.batchEdits]
})

const onEnd = () => {
  emits('update-batch-edits', localBatchEdits.value)
}

const updateValue = (index: number, value: number) => {
  const updated = localBatchEdits.value[index]
  updated.value = value

  emits('update-batch-edits', localBatchEdits.value)
}

const targetLabel = Object.assign({}, cellTargetLabel, effectTargetLabel)
</script>

<template>
  <div class="batch-edit-list grabbing">
    <h3>変更リスト</h3>
    <p>※上から順番に処理します</p>
    <button class="clear-button" @click="$emit('clear')">一括削除</button>
    <ol>
      <draggable
        v-model="localBatchEdits"
        group="edits"
        item-key="key"
        animation="150"
        @end="onEnd"
      >
        <template #item="{ element, index }">
          <li>
            {{ typeLabel[(element as BatchEdit).type] }}
            <small>の</small>
            {{ targetLabel[(element as BatchEdit).target] }}
            <HoverValue :batchEdit="element" :index="index" @update-value="updateValue" />
            <div class="close-button" @click="$emit('delete', index)">
              <font-awesome-icon :icon="['far', 'circle-xmark']" />
            </div>
          </li>
        </template>
      </draggable>
    </ol>
    <!-- <ol>
      <li v-for="(batchEdit, index) in batchEdits" :key="index">
        {{ typeLabel[batchEdit.type] }}
        <small>の</small>
        {{ targetLabel[batchEdit.target] }}
        <span class="operator">{{ getOperator(batchEdit) }}</span>
        {{ getValue(batchEdit) }}
        <div class="close-button" @click="$emit('delete', index)">
          <font-awesome-icon :icon="['far', 'circle-xmark']" />
        </div>
      </li>
    </ol> -->
  </div>
</template>

<style scoped>
.batch-edit-list {
  flex-grow: 2;
  position: relative;
}
p {
  margin-left: 1em;
}
.clear-button {
  position: absolute;
  top: 16px;
  left: 24em;
  color: white;
  background: #e57373;
  border-radius: 4px;
  border: none;
  font-size: 1em;
  padding: 0.5em;
  cursor: pointer;
}
.clear-button:hover {
  background: #e53935;
}
ol {
  margin: 1em;
  padding: 0em;
}
li {
  font-size: 1.2rem;
  border-bottom: 1px solid #ce93d8;
  list-style-position: inside;
  margin: 0.5em;
  padding-left: 0.5em;
  position: relative;
  width: 440px;
  cursor: grab;
}

li:hover {
  background: #f3e5f5;
}

li:active {
  cursor: grabbing;
}

.close-button {
  background: none;
  border: none;
  position: absolute;
  top: 2px;
  font-size: 0.9em;
  right: 8px;
  cursor: pointer;
}

h3 {
  font-weight: bold;
  font-size: 1.2rem;
  margin-top: 0.5rem;
}
</style>
