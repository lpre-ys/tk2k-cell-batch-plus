import type { Operator } from '@/types/batchEdit'

export default function (base: number, operator: Operator, value: number): number {
  switch (operator) {
    case 'Assign':
      return value
    case 'Plus':
      return base + value
    case 'Rate':
      return Math.floor((base * value) / 100)
  }
}
