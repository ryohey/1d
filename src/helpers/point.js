import _ from "lodash"

function doWithKey(a, b, key, func) {
  if (a[key] !== undefined) {
    return func(a[key], b[key])
  }
  return undefined
}

// x, y をもつオブジェクトに対する関数を曲線のコントロールポイントにも適用する関数に拡張する
function extendCurve(func) {
  return function(a, b) {
    const p = func(a, b)
    p.c = doWithKey(a, b, "c", func)
    p.c1 = doWithKey(a, b, "c1", func)
    p.c2 = doWithKey(a, b, "c2", func)
    return p
  }
}

export const pointAdd = extendCurve((a, b) => {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  }
})

// a - b
export const pointSub = extendCurve((a, b) => {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  }
})

export function pointCopy(a) {
  return _.clone(a)
}

export const pointMul = extendCurve((p, s) => {
  return {
    x: p.x * s,
    y: p.y * s
  }
})

export const pointDot = extendCurve((a, b) => {
  return {
    x: a.x * b.x,
    y: a.y * b.y
  }
})

export const pointDiv = extendCurve((a, b) => {
  return {
    x: a.x / b.x,
    y: a.y / b.y
  }
})

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

function conform(obj, keys) {
  return keys.filter(key => !_.has(obj, key)).length === 0
}

function toPathCommand(p) {
  if (p.command === "curveto") {
    if (conform(p, ["x1", "y1", "x2", "y2"])) {
      return `C${p.x1} ${p.y1} ${p.x2} ${p.y2} ${p.x} ${p.y}`
    } else {
      console.warn("invalid curve: ", p)
    }
  }
  return `L${p.x} ${p.y}`
}

/**
  [{ x: 10, y: 20 }, { x: 40, y: 30 }, { x: 9, y: 54 }]
  => M10 20 L40 30 L9 54
*/
export function toSVGPath(points, closed = false) {
  const path = [`M${points[0].x} ${points[0].y}`, ..._.tail(points).map(toPathCommand)]
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
