import calcNumber from './calcNumber'

describe('Operator: Assign', () => {
  test('base is 0, value is 10, then return 10', () => {
    const result = calcNumber(0, 'Assign', 10)
    expect(result).toBe(10)
  })
  test('base is 0, value is -25, then return 25', () => {
    const result = calcNumber(0, 'Assign', -25)
    expect(result).toBe(-25)
  })
  test('base is 42, value is 10, then return 10', () => {
    const result = calcNumber(42, 'Assign', 10)
    expect(result).toBe(10)
  })
})

describe('Operator: Plus', () => {
  test('base is 0, value is 10, then return 10', () => {
    const result = calcNumber(0, 'Plus', 10)
    expect(result).toBe(10)
  })
  test('base is 0, value is -25, then return 25', () => {
    const result = calcNumber(0, 'Plus', -25)
    expect(result).toBe(-25)
  })
  test('base is 42, value is 10, then return 52', () => {
    const result = calcNumber(42, 'Plus', 10)
    expect(result).toBe(52)
  })
})

describe('Operator: Rate', () => {
  test('base is 42, value is 10, then return 4', () => {
    const result = calcNumber(42, 'Rate', 10)
    expect(result).toBe(4)
  })
  test('base is 42, value is 100, then return 42', () => {
    const result = calcNumber(42, 'Rate', 100)
    expect(result).toBe(42)
  })
  test('base is 42, value is 200, then return 84', () => {
    const result = calcNumber(42, 'Rate', 200)
    expect(result).toBe(84)
  })
})
