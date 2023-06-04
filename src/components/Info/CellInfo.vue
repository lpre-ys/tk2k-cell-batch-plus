<script setup lang="ts">
import type { Cell } from '@/types/animeData'
import type { BatchEdit, CellTarget, EffectTarget } from '@/types/batchEdit'
import calcEditedCells from '@/utils/calcEditedCells'
import { computed, ref } from 'vue'
import EditedFrameValue from './EditedFrameValue.vue'
import EditedMinMaxValue from './EditedMinMaxValue.vue'
import EditedValue from './EditedValue.vue'

const props = defineProps<{
  cells: Cell[]
  batchEdits: BatchEdit[]
}>()

const editedCells = computed(() => {
  return calcEditedCells(props.cells, props.batchEdits).sort((a: Cell, b: Cell) => {
    // Noでソートしてから表示する
    const diff = a.no - b.no
    if (diff !== 0) {
      return diff
    }
    return a.frame - b.frame
  })
})

const updateColumns = computed(() => {
  const result: Set<CellTarget | EffectTarget> = new Set()

  props.batchEdits.forEach((batchEdit) => {
    if (batchEdit.type === 'Cell') {
      result.add(batchEdit.target)
    }
  })

  return result
})

const checkEdited = (key: CellTarget) => {
  return updateColumns.value.has(key)
}

const isShowData = ref(true)

const toggleShow = () => {
  isShowData.value = !isShowData.value
}
</script>

<template>
  <div class="cell-info" v-bind:class="{ 'is-show': isShowData }">
    <h3 @click="toggleShow">
      セル:
      <font-awesome-icon v-if="isShowData" class="header-icon" :icon="['fas', 'minus']" />
      <font-awesome-icon v-else class="header-icon" :icon="['fas', 'plus']" />
    </h3>
    <div class="wrapper" v-if="isShowData">
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Fr</th>
            <th>ﾊﾟﾀｰﾝ</th>
            <th>X</th>
            <th>Y</th>
            <th>拡大率</th>
            <th>透明度</th>
            <th>赤</th>
            <th>緑</th>
            <th>青</th>
            <th>彩度</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(cell, index) in editedCells"
            :key="index"
            v-bind:class="cell.no !== editedCells[index + 1]?.no ? 'line' : ''"
          >
            <td class="number">{{ cell.no }}</td>
            <EditedFrameValue
              :pre-value="cells[index].frame"
              :value="cell.frame"
              :is-edited="checkEdited('Frame')"
            />
            <template v-if="cell.visible">
              <EditedMinMaxValue
                :pre-value="cells[index].pattern"
                :value="cell.pattern"
                :is-edited="checkEdited('Pattern')"
                :min="1"
                :max="25"
              />
              <EditedValue
                :pre-value="cells[index].x"
                :value="cell.x"
                :is-edited="checkEdited('X')"
              />
              <EditedValue
                :pre-value="cells[index].y"
                :value="cell.y"
                :is-edited="checkEdited('Y')"
              />
              <EditedMinMaxValue
                :pre-value="cells[index].scale"
                :value="cell.scale"
                :is-edited="checkEdited('Scale')"
                :min="0"
                :max="Infinity"
              />
              <EditedMinMaxValue
                :pre-value="cells[index].alpha"
                :value="cell.alpha"
                :is-edited="checkEdited('Alpha')"
                :min="0"
                :max="100"
              />
              <EditedMinMaxValue
                :pre-value="cells[index].r"
                :value="cell.r"
                :is-edited="checkEdited('R')"
                :min="0"
                :max="200"
              />
              <EditedMinMaxValue
                :pre-value="cells[index].g"
                :value="cell.g"
                :is-edited="checkEdited('G')"
                :min="0"
                :max="200"
              />
              <EditedMinMaxValue
                :pre-value="cells[index].b"
                :value="cell.b"
                :is-edited="checkEdited('B')"
                :min="0"
                :max="200"
              />
              <EditedMinMaxValue
                :pre-value="cells[index].sat"
                :value="cell.sat"
                :is-edited="checkEdited('Sat')"
                :min="0"
                :max="200"
              />
            </template>
            <template v-else>
              <td colspan="9" class="hidden">非表示</td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.cell-info {
  overflow: hidden;
}
.is-show {
  flex: 1;
}
h3 {
  font-weight: bold;
  font-size: 1.2rem;
  cursor: pointer;
  user-select: none;
  position: relative;
  min-width: 462px;
}

.header-icon {
  position: absolute;
  top: 4px;
  left: 26rem;
}

.wrapper {
  overflow-y: scroll;
  width: fit-content;
  height: 88%;
  margin: 0.5em 0 0 1em;
}

table {
  font-size: 0.8rem;
  border-spacing: 0;
}
thead {
  font-weight: bold;
  color: white;
}

thead th {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 1;
  background: #9575cd;
  text-align: center;
}

tbody tr:nth-child(odd) {
  background: #eceff1;
}
.number {
  text-align: right;
  min-width: 3em;
}

.hidden {
  color: #9e9e9e;
  text-align: center;
}
.line td {
  border-bottom: 1px solid #9575cd;
}
</style>
