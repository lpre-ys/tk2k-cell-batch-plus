import type { Area } from '@/types/animeData'
import type { CellTarget, EffectTarget, Operator, TargetType } from '@/types/batchEdit'

const operatorLabel: Record<Operator, string> = {
  Plus: '+',
  Assign: '=',
  Rate: '%'
}

const typeLabel: Record<TargetType, string> = {
  Cell: 'セル',
  Effect: '効果音とフラッシュ'
}

const cellTargetLabel: Record<CellTarget, string> = {
  Frame: 'フレーム',
  Pattern: 'パターン番号',
  X: 'X座標',
  Y: 'Y座標',
  Scale: '拡大率',
  Alpha: '透明度',
  R: '色調(赤)',
  G: '色調(緑)',
  B: '色調(青)',
  Sat: '色調(彩度)'
}

const effectTargetLabel: Record<EffectTarget, string> = {
  Frame: 'フレーム',
  // File: '音のファイル名',
  SoundVolume: 'ボリューム',
  Pitch: 'テンポ',
  Pan: 'バランス',
  Area: '範囲',
  R: '赤',
  G: '緑',
  B: '青',
  FlashVolume: '強さ'
}

const areaLabel: Record<Area, string> = {
  0: 'なし',
  1: '対象',
  2: '画面'
}
export { operatorLabel, typeLabel, cellTargetLabel, effectTargetLabel, areaLabel }
