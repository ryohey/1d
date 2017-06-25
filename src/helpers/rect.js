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
    origin: { x, y },
    size: {
      x: Math.max(getRectRight(a), getRectRight(b)) - x,
      y: Math.max(getRectBottom(a), getRectBottom(b)) - y,
    }
  }
}

export function rectPoints(rect) {
  const rt = {
    x: getRectRight(rect),
    y: rect.origin.y
  }

  const rb = {
    x: rt.x,
    y: getRectBottom(rect)
  }

  const lb = {
    x: rect.origin.x,
    y: rb.y
  }

  return [rect.origin, rt, rb, lb]
}
