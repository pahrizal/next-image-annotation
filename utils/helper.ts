export type Vector2d = {
  x: number
  y: number
}

export function getDistance(p1: Vector2d, p2: Vector2d) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
}

export function getCenter(p1: Vector2d, p2: Vector2d): Vector2d {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  }
}

export function isTouchEnabled() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export const preloadImage = async (
  imgPath: string
): Promise<HTMLImageElement> =>
  new Promise((res) => {
    const newImg = new Image()
    newImg.onload = function () {
      res(newImg)
    }
    newImg.src = imgPath
  })
