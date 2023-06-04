<script setup lang="ts">
import type { AnimeData } from '@/types/animeData'
import type { BatchEdit } from '@/types/batchEdit'
import calcEditedCells from '@/utils/calcEditedCells'
import { computed } from 'vue'
import CellInfo from './Info/CellInfo.vue'
import EffectInfo from './Info/EffectInfo.vue'

const props = defineProps<{
  animeData: AnimeData | null
  batchEdits: BatchEdit[]
}>()

const targetLabels: Record<number, string> = {
  0: '単体',
  1: '全体'
}
const yLineLabels: Record<number, string> = {
  0: '頭上',
  1: '中心',
  2: '足元'
}

const editedFrame = computed(() => {
  if (!props.animeData) {
    return 0
  }
  const editedCells = calcEditedCells(props.animeData.cells, props.batchEdits)
  const frames = editedCells.map((cell) => {
    return cell.frame
  })
  return frames ? Math.max(...frames) : props.animeData.frame
})
</script>

<template>
  <div class="component" v-if="animeData !== null">
    <dl>
      <dt>名前:</dt>
      <dd>{{ animeData?.title }}</dd>
      <dt>画像:</dt>
      <dd>{{ animeData?.material }}</dd>
      <dt>適用範囲:</dt>
      <dd>{{ targetLabels[animeData?.target] }}</dd>
      <dt>Y座標:</dt>
      <dd>{{ yLineLabels[animeData?.yLine] }}</dd>
      <dt>フレーム数:</dt>
      <dd v-if="animeData.frame >= editedFrame">{{ animeData.frame }}</dd>
      <dd v-else>
        {{ animeData.frame }} → <span class="edited">{{ editedFrame }}</span>
      </dd>
    </dl>
    <EffectInfo :effects="animeData.effects" :batchEdits="batchEdits" />
    <CellInfo :cells="animeData.cells" :batchEdits="batchEdits" />
  </div>
</template>

<style scoped>
dl {
  display: grid;
  grid-template: auto / auto 1fr;
}
dt {
  font-weight: bold;
  margin-right: 0.5em;
  text-align: right;
}
.component {
  font-size: 1.2rem;
  padding: 1rem;
  display: flex;
  flex-flow: column;
  min-width: 460px;
}
.edited {
  font-weight: bold;
  color: #7e57c2;
}
</style>
