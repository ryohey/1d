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

/**
  ctx に設定された座標系に変換する
  value は数値か座標
*/
export function project(ctx, value) {
  const scale = ctx.scale
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
