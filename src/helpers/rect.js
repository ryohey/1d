
export function getRectCenter(rect) {
  return rect.origin.x + rect.size.x / 2
}

export function getRectMiddle(rect) {
  return rect.origin.y + rect.size.y / 2
}

export function getRectRight(rect) {
  return rect.origin.x + rect.size.x
}

export function getRectBottom(rect) {
  return rect.origin.y + rect.size.y
}
