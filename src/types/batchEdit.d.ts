export type Operator = 'Assign' | 'Plus' | 'Rate'

export type TargetType = 'Cell' | 'Effect'

export type CellTarget =
  | 'Frame'
  | 'Pattern'
  | 'X'
  | 'Y'
  | 'Scale'
  | 'Alpha'
  | 'R'
  | 'G'
  | 'B'
  | 'Sat'
// TODO 色の一括指定

export type EffectTarget =
  | 'Frame'
  | 'Area'
  | 'R'
  | 'G'
  | 'B'
  // TODO 色の一括指定
  | 'FlashVolume'
  // | 'File' // TODO
  | 'SoundVolume'
  | 'Pitch'
  | 'Pan'
  | 'Shake'

export type BatchEdit = {
  key: number
  type: TargetType
  target: CellTarget | EffectTarget
  operator: Operator
  value: number
}
