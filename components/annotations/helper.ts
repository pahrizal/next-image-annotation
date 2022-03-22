/**
 * find linear interpolation point between two points
 * @param x0 x coordinate for starting point
 * @param y0 y coorinate for starting point
 * @param x1 x coordinate for end point
 * @param y1 y coordinate for end point
 * @param frac value of fraction we need
 * @returns interpolation points
 */
export function interpolate(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  frac: number = 0.5
) {
  // points A and B, frac between 0 and 1
  // we set default to 0.5 (center of linear line)
  var nx = x0 + (x1 - x0) * frac
  var ny = y0 + (y1 - y0) * frac
  return [nx, ny]
}

/**
 * 
 * @param x0 x-coordinate of source point
 * @param y0 y-coordinate of source point
 * @param r0 radius of source point
 * @param x1 x-coordinate of target point
 * @param y1 y-coorinate of target point
 * @param r1 radius of target point
 * @returns true if source is intersection with target
 */
export function intersection(
  x0: number,
  y0: number,
  r0: number,
  x1: number,
  y1: number,
  r1: number
) {
  var a, dx, dy, d, h, rx, ry
  var x2, y2

  /* dx and dy are the vertical and horizontal distances between
   * the circle centers.
   */
  dx = x1 - x0
  dy = y1 - y0

  /* Determine the straight-line distance between the centers. */
  d = Math.sqrt(dy * dy + dx * dx)

  /* Check for solvability. */
  if (d > r0 + r1) {
    /* no solution. circles do not intersect. */
    return false
  }

  if (d < Math.abs(r0 - r1)) {
    /* one circle is contained in the other */
    return true
  }
  return false
}
