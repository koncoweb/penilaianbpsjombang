export function calculateRenakPercentage(actual: number, target: number): number {
  if (target === 0) {
    return actual === 0 ? 100 : 0
  }
  return (actual / target) * 100
}

export function averageQuarter(values: Array<number | null | undefined>): number {
  const nums = values.filter((v): v is number => typeof v === 'number' && !isNaN(v))
  if (nums.length === 0) return 0
  const sum = nums.reduce((a, b) => a + b, 0)
  return sum / nums.length
}

export function formatIdDecimal2(value: number | string | null | undefined): string {
  const num = typeof value === 'string' ? parseFloat(value) : value ?? 0
  const fixed = isNaN(num) ? 0 : Number(num)
  return fixed.toFixed(2).replace('.', ',')
}


