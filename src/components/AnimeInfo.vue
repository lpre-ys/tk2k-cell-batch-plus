<script setup lang="ts">
import type { AnimeData } from '@/types/animeData'
import type { BatchEdit } from '@/types/batchEdit'
import CellInfo from './Info/CellInfo.vue'
import EffectInfo from './Info/EffectInfo.vue'

defineProps<{
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
      <dd>{{ animeData?.frame }}</dd>
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
</style>
