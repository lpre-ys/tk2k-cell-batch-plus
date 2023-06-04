<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  isEdited: boolean
  preValue: number
  value: number
}>()

const isShowPre = ref(false)

const showPre = () => {
  isShowPre.value = true
}

const hidePre = () => {
  isShowPre.value = false
}
</script>

<template>
  <td
    v-if="isEdited"
    class="number edited"
    :class="{ pre: isShowPre }"
    @mouseover="showPre"
    @mouseleave="hidePre"
  >
    {{ isShowPre ? preValue : value }}
  </td>
  <td v-else class="number">{{ value }}</td>
</template>

<style scoped>
.edited {
  font-weight: bold;
  color: #7e57c2;
  cursor: pointer;
}

.warn {
  color: #f06292;
}

.pre {
  font-weight: normal;
  color: black;
}
</style>
