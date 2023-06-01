import type { Cell } from '@/types/animeData'
import type { BatchEdit } from '@/types/batchEdit'
import calcNumber from './calcNumber'

export default function (cells: Cell[], batchEdits: BatchEdit[]) {
  return cells.map((cell) => {
    return batchEdits.reduce((preCell, { type, target, operator, value }) => {
      if (type !== 'Cell') {
        return preCell // 処理無し
      }
      if (!preCell.visible) {
        return preCell //処理無し
      }
      const key = target.toLowerCase() as keyof Cell
      if (key === 'visible') {
        return preCell //処理無し
      }
      const newCell = Object.assign({}, preCell)
      if (key === 'frame') {
        // TODO 特殊処理！！！
        return newCell
      }
      newCell[key] = calcNumber(newCell[key] as number, operator, value)
      return newCell
    }, cell)
  })
}
