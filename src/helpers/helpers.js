function limit (min, max, val) {
  if (val < min) return min
  if (val > max) return max
  return val
}
export {limit}
