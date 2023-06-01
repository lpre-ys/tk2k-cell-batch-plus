<script setup lang="ts">
import type { AnimeData } from '@/types/animeData'
import type { BatchEdit } from '@/types/batchEdit'
import { ref } from 'vue'
import AddBatchEdit from './components/AddBatchEdit.vue'
import AnimeInfo from './components/AnimeInfo.vue'
import BatchEditList from './components/BatchEditList.vue'
import devData from './devData'
import calcEditedCells from './utils/calcEditedCells'
import calcEditedEffects from './utils/calcEditedEffects'

const animeData = ref<AnimeData | null>(null)

const batchEdits = ref<BatchEdit[]>([])

const isLoading = ref<boolean>(false)

const isShowError = ref<boolean>(false)

const addBatchEdit = (batchEdit: BatchEdit) => {
  batchEdits.value.push(batchEdit)
}
const clearBatchEdit = () => {
  batchEdits.value = []
}

const deleteBatchEdit = (index: number) => {
  batchEdits.value.splice(index, 1)
}

const updateBatchEdits = (newBatchEdits: BatchEdit[]) => {
  batchEdits.value = newBatchEdits
}

const loadData = () => {
  if (import.meta.env.MODE === 'development') {
    animeData.value = JSON.parse(devData)
  }
  if (window.tk2k === undefined || typeof window.tk2k.readInfo !== 'function') {
    return
  }
  isLoading.value = true
  window.tk2k
    .readInfo()
    .then((result) => {
      isLoading.value = false
      isShowError.value = false
      if (!result) {
        return // 処理無し
      }
      animeData.value = {
        title: result.title,
        material: result.material,
        target: result.target,
        yLine: result.yLine,
        frame: result.frame,
        cells: result.cells,
        effects: result.effects
      }
      // FOR debug
      // console.log(JSON.stringify(animeData, null, '  '))
    })
    .catch((error) => {
      console.log(error)
      isShowError.value = true
      isLoading.value = false
    })
}

const clearData = () => {
  animeData.value = null
  batchEdits.value = []
}

const writeData = () => {
  if (!animeData.value) {
    return
  }
  // データ整形
  const editedAnimeData = Object.assign({}, animeData.value)
  const { cells, effects } = animeData.value
  editedAnimeData.effects = calcEditedEffects(effects, batchEdits.value)
  editedAnimeData.cells = calcEditedCells(cells, batchEdits.value)

  if (import.meta.env.MODE === 'development') {
    console.log('DEV: writed')
    console.log(JSON.stringify(editedAnimeData, null, '  '))
    return
  }
  if (window.tk2k === undefined || typeof window.tk2k.writeData !== 'function') {
    return
  }
  window.tk2k.writeData(JSON.stringify(editedAnimeData)).then((result: boolean) => {
    isShowError.value = !result
  })
}

const hideError = () => {
  isShowError.value = false
}
</script>

<template>
  <nav>
    <button @click="loadData" :disabled="isLoading">読み込み</button>
    <button @click="clearData" class="clear">クリア</button>
    <button @click="writeData" :disabled="!animeData">書き出し</button>
  </nav>
  <aside v-if="isShowError">
    <h4>エラーで読み込み・書き込みが出来ない場合</h4>
    <p>
      セキュリティ設定が原因の可能性があります。下記手順をお試しください。<br />
      別のツールでの案内ですが、同様の手順で問題ありません。<br />
      <font-awesome-icon icon="link" /><a
        href="https://github.com/lpre-ys/tk2k-effect-conductor/blob/main/doc/security.md"
        target="_blank"
        rel="noreferrer"
      >
        セキュリティ設定手順
      </a>
    </p>
    <div class="close" @click="hideError">
      <font-awesome-icon :icon="['far', 'circle-xmark']" />
    </div>
  </aside>
  <main :class="{ 'main-error': isShowError }">
    <div class="edit">
      <AddBatchEdit @add-batch-edit="addBatchEdit" />
      <BatchEditList
        @clear="clearBatchEdit"
        @delete="deleteBatchEdit"
        @update-batch-edits="updateBatchEdits"
        :batch-edits="batchEdits"
      />
    </div>
    <AnimeInfo :animeData="animeData" :batch-edits="batchEdits" />
  </main>
</template>

<style scoped>
nav {
  display: flex;
  padding: 0em 1em 1em 1em;
  gap: 0 2em;
  align-items: flex-end;
  height: 80px;
}

button {
  padding: 0.5em 1em;
  font-size: 1.5rem;
}

button:last-child {
  margin-left: auto;
}

.clear {
  font-size: 1.2rem;
  padding: 0.5em;
  height: 50px;
}

aside {
  height: 130px;
  border: 1px solid #c62828;
  background: #ffebee;
  padding: 1em 4em 1em 2em;
  margin: 0 3em;
  width: fit-content;
  position: relative;
  border-radius: 0.5em;
}

.close {
  position: absolute;
  right: 8px;
  top: 2px;
  font-size: 1.2rem;
  cursor: pointer;
}

h4 {
  font-size: 1.1rem;
  font-weight: bold;
}

aside p {
  padding: 0 0 1em 0.5em;
}

main {
  display: flex;
  height: calc(100vh - 80px - 4rem);
  border-top: 1px dotted #7b1fa2;
}

.main-error {
  height: calc(100vh - 80px - 130px - 4rem);
}

.edit-header {
  padding: 1rem 1rem 0 1rem;
}

.edit {
  display: flex;
  flex-direction: column;
  min-width: 500px;
  border-right: 1px dotted #7b1fa2;
}

@media (max-width: 1080px) {
  main {
    flex-direction: column;
  }
  .edit {
    border-bottom: 1px dotted #7b1fa2;
    border-right: none;
  }
}
</style>
