function limit (min, max, val) {
  if (val < min) return min
  if (val > max) return max
  return val
}
export {limit}

function lerp (v0, v1, t) {
  return v0 * (1 - t) + v1 * t
}
export {lerp}
