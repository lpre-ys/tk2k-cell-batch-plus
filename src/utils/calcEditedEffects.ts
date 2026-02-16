import type { Effect, Flash, Sound, Shake } from '@/types/animeData'
import type { BatchEdit } from '@/types/batchEdit'
import calcNumber from './calcNumber'

export default function (effects: Effect[], batchEdits: BatchEdit[]) {
  return effects.map((effect) => {
    return batchEdits.reduce((preEffect, { type, target, operator, value }) => {
      if (type !== 'Effect') {
        return preEffect
      }
      const newEffect: Effect = JSON.parse(JSON.stringify(preEffect))
      const key = target.toLowerCase() as keyof (Effect | Flash | Sound)
      if (key === 'frame') {
        newEffect.frame = calcNumber(newEffect.frame, operator, value)
        return newEffect
      }

      // Sound
      if (!['', '(OFF)'].includes(preEffect.sound.file)) {
        if (Object.keys(newEffect.sound).includes(key)) {
          const soundKey = key as keyof Sound
          if (soundKey === 'file') {
            // TODO 特殊処理やる…？
            return newEffect
          }
          newEffect.sound[soundKey] = calcNumber(newEffect.sound[soundKey], operator, value)
        }
        if (key === 'soundvolume') {
          newEffect.sound.volume = calcNumber(newEffect.sound.volume, operator, value)
        }
      }

      // Flash
      if (preEffect.flash.area !== 0) {
        if (Object.keys(effect.flash).includes(key)) {
          const flashKey = key as keyof Flash
          newEffect.flash[flashKey] = calcNumber(newEffect.flash[flashKey], operator, value)
        }
        if (key === 'flashvolume') {
          newEffect.flash.volume = calcNumber(newEffect.flash.volume, operator, value)
        }
      }
      if (key === 'shake') {
        newEffect.shake = calcNumber(newEffect.shake, operator, value) as Shake
      }
      return newEffect
    }, effect)
  })
}
