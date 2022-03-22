export function interpolate(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  frac: number = 0.5
) {
  // points A and B, frac between 0 and 1
  var nx = x0 + (x1 - x0) * frac
  var ny = y0 + (y1 - y0) * frac
  return [nx, ny]
}
