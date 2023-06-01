export type AnimeData = {
  title: string
  material: string
  target: number
  yLine: number
  frame: number
  cells: Cell[]
  effects: Effect[]
}

export type Cell = {
  frame: number
  no: number
  visible: boolean
  pattern: number
  x: number
  y: number
  scale: number
  r: number
  g: number
  b: number
  sat: number
  alpha: number
}

export type Effect = {
  frame: number
  flash: Flash
  sound: Sound
}

export type Flash = {
  area: number
  r: number
  g: number
  b: number
  volume: number
}

export type Sound = {
  file: string
  volume: number
  pitch: number
  pan: number
}
