<script setup lang="ts">
import type { Effect } from '@/types/animeData'
import type { BatchEdit, CellTarget, EffectTarget } from '@/types/batchEdit'
import calcEditedEffects from '@/utils/calcEditedEffects'
import { computed, ref } from 'vue'
import EditedValue from './EditedValue.vue'

const props = defineProps<{
  effects: Effect[]
  batchEdits: BatchEdit[]
}>()

const editedEffects = computed(() => {
  return calcEditedEffects(props.effects, props.batchEdits)
})

const updateColumns = computed(() => {
  const result: Set<CellTarget | EffectTarget> = new Set()

  props.batchEdits.forEach((batchEdit) => {
    if (batchEdit.type === 'Effect') {
      result.add(batchEdit.target)
    }
  })

  return result
})

const checkEdited = (key: EffectTarget) => {
  return updateColumns.value.has(key)
}

const areaLabel: Record<number, string> = {
  0: 'なし',
  1: '対象',
  2: '画面'
}

const isShowData = ref(true)

const toggleShow = () => {
  isShowData.value = !isShowData.value
}
</script>

<template>
  <div class="effect-info" :class="{ 'is-show': isShowData }">
    <h3 @click="toggleShow">
      効果音とフラッシュ:
      <font-awesome-icon v-if="isShowData" class="header-icon" :icon="['fas', 'minus']" />
      <font-awesome-icon v-else class="header-icon" :icon="['fas', 'plus']" />
    </h3>
    <div class="wrapper" v-if="isShowData">
      <table>
        <thead>
          <tr>
            <th rowspan="2" class="header-line">Fr</th>
            <th colspan="4" class="header-line">効果音</th>
            <th colspan="5">フラッシュ</th>
          </tr>
          <tr>
            <th>ファイル</th>
            <th>音量</th>
            <th>ピッチ</th>
            <th class="header-line">ﾊﾞﾗﾝｽ</th>
            <th>範囲</th>
            <th>赤</th>
            <th>緑</th>
            <th>青</th>
            <th>強さ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(effect, index) in editedEffects" :key="index">
            <EditedValue
              class="number line"
              :pre-value="effects[index].frame"
              :value="effect.frame"
              :is-edited="checkEdited('Frame')"
            />
            <template v-if="effect.sound.file === '(OFF)'">
              <td colspan="4" class="line hidden">(OFF)</td>
            </template>
            <template v-else>
              <td class="file">{{ effect.sound.file }}</td>
              <EditedValue
                class="number"
                :pre-value="effects[index].sound.volume"
                :value="effect.sound.volume"
                :is-edited="checkEdited('SoundVolume')"
              />
              <EditedValue
                class="number"
                :pre-value="effects[index].sound.pitch"
                :value="effect.sound.pitch"
                :is-edited="checkEdited('Pitch')"
              />
              <EditedValue
                class="number line"
                :pre-value="effects[index].sound.pan"
                :value="effect.sound.pan"
                :is-edited="checkEdited('Pan')"
              />
            </template>
            <template v-if="effect.flash.area === 0">
              <td colspan="5" class="hidden">{{ areaLabel[effect.flash.area] }}</td>
            </template>
            <template v-else>
              <td>{{ areaLabel[effect.flash.area] }}</td>
              <EditedValue
                class="number"
                :pre-value="effects[index].flash.r"
                :value="effect.flash.r"
                :is-edited="checkEdited('R')"
              />
              <EditedValue
                class="number"
                :pre-value="effects[index].flash.g"
                :value="effect.flash.g"
                :is-edited="checkEdited('G')"
              />
              <EditedValue
                class="number"
                :pre-value="effects[index].flash.b"
                :value="effect.flash.b"
                :is-edited="checkEdited('B')"
              />
              <EditedValue
                class="number"
                :pre-value="effects[index].flash.volume"
                :value="effect.flash.volume"
                :is-edited="checkEdited('FlashVolume')"
              />
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.effect-info {
  overflow: hidden;
}

.is-show {
  max-height: 30%;
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
  max-height: 80%;
  margin: 0.5em 1em 1em 1em;
}

table {
  font-size: 0.8rem;
  border-spacing: 0;
}
thead {
  font-weight: bold;
  background: #9575cd;
  color: white;
  text-align: center;
}
thead th {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 1;
  background: #9575cd;
  text-align: center;
}
thead tr:nth-child(2) th {
  top: 22px;
}
tbody tr:nth-child(odd) {
  background: #eceff1;
}
.number {
  text-align: right;
  min-width: 3em;
}
.file {
  min-width: 5em;
}
.line {
  border-right: 1px solid #9575cd;
}
.header-line {
  border-right: 1px solid white;
}
.hidden {
  color: #9e9e9e;
  text-align: center;
}
</style>
