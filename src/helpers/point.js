import _ from "lodash"

export function pointAdd(a, b) {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  }
}

// a - b
export function pointSub(a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
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

export function pointDot(a, b) {
  return {
    x: a.x * b.x,
    y: a.y * b.y
  }
}

export function pointDiv(a, b) {
  return {
    x: a.x / b.x,
    y: a.y / b.y
  }
}

function projectValue(transform, value) {
  return value * (transform.scale || 1)
}

function resolveDimension(transform, value) {
  if (_.isNil(value)) {
    return 0
  }
  const v = parseFloat(value)
  if (value.endsWith("px")) {
    return v
  }
  if (!_.isNaN(v)) {
    return projectValue(transform, v)
  }
  return 0
}

/**
  transform に設定された座標系に変換する
  value: Number or Point Object
}
*/
export function project(transform, value) {
  if (value instanceof Object) {
    return {
      x: resolveDimension(transform, value.x),
      y: resolveDimension(transform, value.y)
    }
  }
  return resolveDimension(transform, value)
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

export function pointFromEvent(e) {
  return {
    x: e.clientX,
    y: e.clientY
  }
}

export function pointsMin(points) {
  return {
    x: _.min(points.map(p => p.x)),
    y: _.min(points.map(p => p.y))
  }
}

export function pointsMax(points) {
  return {
    x: _.max(points.map(p => p.x)),
    y: _.max(points.map(p => p.y))
  }
}
