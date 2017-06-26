import _ from "lodash"
import { Point } from "paper"

// 渡された関数を1番目の引数のオブジェクトを func を適用した結果で上書きする関数にする
const applyLeft = func => (a, b) => (new Point(func(a, b)))

export const pointRound = applyLeft(p => {
  return {
    x: Math.round(p.x),
    y: Math.round(p.y)
  }
})

export const pointNorm = p => {
  return Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.y, 2))
}

export const pointDistance = (a, b) => {
  return pointNorm(a.subtract(b))
}

export const pointRotate = (point, center, angle) => {
  const delta = point.subtract(center)
  const rot = new Point(
    delta.x * Math.cos(angle) - delta.y * Math.sin(angle),
    delta.x * Math.sin(angle) + delta.y * Math.cos(angle)
  )
  return rot.add(center)
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
    return new Point(
      resolveDimension(transform, value.x),
      resolveDimension(transform, value.y)
    )
  }
  return resolveDimension(transform, value)
}

function toPathCommand(p) {
  if (isPointCurve(p)) {
    return `C${p.c1.x} ${p.c1.y} ${p.c2.x} ${p.c2.y} ${p.x} ${p.y}`
  }
  return `L${p.x} ${p.y}`
}

function isPointCurve(p) {
  return p.c1 !== undefined && p.c2 !== undefined
}

/**

 SVG の 3次ベジェ曲線は C1 が前の点のコントロールポイント、C2 が今の点のコントロールポイントになっているので、コントロールポイントを1つ分後にずらす

 [
   { x: 1, y: 2 },
   { x: 4, y: 4, c1: { x: 999, y: 111 }, c2: { x: 555, y: 22} },
   { x: 6, y: 7, c1: { x: 999, y: 111 }, c2: { x: 555, y: 22} },
 ]

 としたら出力は

  [
    { x: 1, y: 2 },
    { x: 4, y: 4, c2: { x: 999, y: 111 } },
    { x: 6, y: 7, c1: { x: 555, y: 22 }, c2: { x: 999, y: 111 } },
  ]

  となる


 */
function fixCurve(points) {
  return points.map((p, i) => {
    const prev = points[i - 1]
    const result = {
      x: p.x,
      y: p.y
    }

    // 前の点が control point をもつなら c1 をこの点に持ってくる
    if (prev && isPointCurve(prev)) {
      result.c1 = prev.c2
    }

    // この点が control point をもつなら c2 を c1 にする
    if (isPointCurve(p)) {
      result.c2 = p.c1
    }

    return result
  })
}

/**
  [{ x: 10, y: 20 }, { x: 40, y: 30 }, { x: 9, y: 54 }]
  => M10 20 L40 30 L9 54
*/
export function toSVGPath(points, closed = false) {
  const path = [`M${points[0].x} ${points[0].y}`, ...fixCurve(_.tail(points)).map(toPathCommand)]
  return `${path.join(" ")}${closed ? " Z" : ""}`
}

export function rect(center, size) {
  return [
    new Point(center.x - size, center.y - size),
    new Point(center.x + size, center.y - size),
    new Point(center.x + size, center.y + size),
    new Point(center.x - size, center.y + size)
  ]
}

export function pointFromEvent(e) {
  return new Point(e.clientX, e.clientY)
}

export function pointsMin(points) {
  return new Point(
    _.min(points.map(p => p.x)),
    _.min(points.map(p => p.y))
  )
}

export function pointsMax(points) {
  return new Point(
    _.max(points.map(p => p.x)),
    _.max(points.map(p => p.y))
  )
}

export function pointsCenter(points) {
  const min = pointsMin(points)
  return pointsMax(points).subtract(min).multiply(0.5).add(min)
}

export function rectFromPoints(start, end) {
  const lt = {
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y)
  }
  const rb = {
    x: Math.max(start.x, end.x),
    y: Math.max(start.y, end.y)
  }
  return {
    origin: new Point(lt),
    size: rb.subtract(lt)
  }
}
