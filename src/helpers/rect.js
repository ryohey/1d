import { Point } from "paper"

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

export function rectIntersects(a, b) {
  return a.origin.x <= b.origin.x + b.size.x
      && b.origin.x <= a.origin.x + a.size.x
      && a.origin.y <= b.origin.y + b.size.y
      && b.origin.y <= a.origin.y + a.size.y
}

export function rectUnion(a, b) {
  const x = Math.min(a.origin.x, b.origin.x)
  const y = Math.min(a.origin.y, b.origin.y)
  return {
    origin: new Point(x, y),
    size: new Point(
      Math.max(getRectRight(a), getRectRight(b)) - x,
      Math.max(getRectBottom(a), getRectBottom(b)) - y,
    )
  }
}

export function rectPoints(rect) {
  const rt = new Point(
    getRectRight(rect),
    rect.origin.y
  )

  const rb = new Point(
    rt.x,
    getRectBottom(rect)
  )

  const lb = new Point(
    rect.origin.x,
    rb.y
  )

  return [rect.origin, rt, rb, lb]
}
