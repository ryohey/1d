import _ from "lodash"
import { Point } from "paper"
import { ICurvedPoint } from "../basic/ICurvedPoint"
import { ITransform } from "../basic/ITransform"
import { IPoint } from "../basic/IPoint"

export const pointRound = (p: Point) =>
  new Point(Math.round(p.x), Math.round(p.y))

function projectValue(transform: ITransform, value) {
  return value * (transform.scale || 1)
}

function resolveDimension(
  transform: ITransform,
  value: string | number | null
) {
  if (_.isNil(value)) {
    return 0
  }
  if (_.isString(value)) {
    const v = parseFloat(value)
    if (value.endsWith("px")) {
      return v
    }
    if (!_.isNaN(v)) {
      return projectValue(transform, v)
    }
  }
  return 0
}

// transform に設定された座標系に変換する
export function project(
  transform: ITransform,
  value: string | number | null
): number {
  return resolveDimension(transform, value)
}

export function projectXY(
  transform: ITransform,
  x: string | number | null,
  y: string | number | null
): Point {
  return new Point(
    resolveDimension(transform, x),
    resolveDimension(transform, y)
  )
}

export function projectPoint(transform: ITransform, point: Point): Point {
  return projectXY(transform, point.x, point.y)
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
function fixCurve(points: ICurvedPoint[]) {
  return points.map((p, i) => {
    const prev = points[i - 1]
    const result: ICurvedPoint = {
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
export function toSVGPath(points: IPoint[], closed = false) {
  const path = [
    `M${points[0].x} ${points[0].y}`,
    ...fixCurve(_.tail(points)).map(toPathCommand)
  ]
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
    _.defaultTo(_.min(points.map(p => p.x)), 0),
    _.defaultTo(_.min(points.map(p => p.y)), 0)
  )
}

export function pointsMax(points) {
  return new Point(
    _.defaultTo(_.max(points.map(p => p.x)), 0),
    _.defaultTo(_.max(points.map(p => p.y)), 0)
  )
}

export function pointsCenter(points) {
  const min = pointsMin(points)
  return pointsMax(points)
    .subtract(min)
    .multiply(0.5)
    .add(min)
}
