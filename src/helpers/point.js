import _ from "lodash"

export function pointAdd(a, b) {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  }
}

export function pointCopy(a) {
  return {
    x: a.x,
    y: a.y
  }
}

export function pointMul(p, s) {
  return {
    x: p.x * s,
    y: p.y * s
  }
}

/**
  transform に設定された座標系に変換する
  value は数値か座標
*/
export function project(transform, value) {
  const { scale } = transform
  if (!scale) {
    return value
  }
  if (_.isNumber(value)) {
    return value * scale
  } else if (value instanceof Object && value.x !== undefined && value.y !== undefined) {
    return {
      x: value.x * scale,
      y: value.y * scale
    }
  }
  return value
}

/**
  [{ x: 10, y: 20 }, { x: 40, y: 30 }, { x: 9, y: 54 }]
  => M10 20 L40 30 L9 54
*/
export function toSVGPath(points, closed = false) {
  const path = [`M${points[0].x} ${points[0].y}`, ..._.tail(points).map(p => `L${p.x} ${p.y}`)]
  return `${path.join(" ")}${closed ? " Z" : ""}`
}

export function rect(center, size) {
  return [
    { x: center.x - size, y: center.y - size },
    { x: center.x + size, y: center.y - size },
    { x: center.x + size, y: center.y + size },
    { x: center.x - size, y: center.y + size }
  ]
}
