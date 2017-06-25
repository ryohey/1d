import React from "react"
import Shape from "./Shape"
import { pointAdd, pointSub, pointDot, pointDiv, toSVGPath, pointsMax, pointsMin, pointMul, rect } from "../helpers/point"
import ShapeControl from "../components/ShapeControl"
import _ from "lodash"

const HANDLE_SIZE = 3
const COLOR = "rgb(37, 129, 255)"
const COLOR2 = "rgb(255, 129, 37)"

// c1, c2 を持つ object だけにする
function filterControlPoints(points) {
  return points.filter(p => p.c1 !== undefined && p.c2 !== undefined)
}

function CurveControl({ point }) {
  const c1 = point.c1
  const c2 = point.c2
  return <g>
    <path d={toSVGPath([point, c1])} stroke={COLOR} strokeWidth={1} />
    <path d={toSVGPath([point, c2])} stroke={COLOR2} strokeWidth={1} />
    <ControlRect center={c1} />
    <ControlRect center={c2} />
  </g>
}

function ControlRect({ center, onMouseDown }) {
  return <path
    d={toSVGPath(rect(center, HANDLE_SIZE), true)}
    stroke={COLOR}
    fill="white"
    cursor="pointer"
    onMouseDown={onMouseDown}
  />
}

export default class PathShape extends Shape {
  constructor(pos = { x: 0, y: 0 }, path = [], closed = false) {
    super(pos)
    this.path = path
    this.closed = closed
  }

  resize(size, anchor) {
    // TODO: support curveto
    const leftTop = pointsMin(this.path)
    const rightBottom = pointsMax(this.path)
    const originalSize = pointSub(rightBottom, leftTop)
    const scale = pointDiv(size, originalSize)
    this.path = this.path.map(p =>
      pointAdd(pointDot(pointSub(p, leftTop), scale), leftTop)
    )
    const delta = pointSub(originalSize, size)
    this.pos = pointAdd(this.pos, pointDot(delta, anchor))
  }

  get size() {
    return pointSub(pointsMax(this.path), pointsMin(this.path))
  }

  get origin() {
    return pointAdd(this.pos, pointsMin(this.path))
  }

  render() {
    const { pos, closed, mouseHandler, brush, selected, bounds, rotation } = this
    const path = toSVGPath(this.path, closed)
    const controlPoints = filterControlPoints(this.path)

    return <g
      data-shape-id={this.id}
      onMouseDown={e => mouseHandler.onMouseDown(e, this)}>
      <g
        transform={`translate(${pos.x}, ${pos.y}) rotate(${rotation})`}
        cursor="move">
        <path
          d={path}
          strokeWidth={brush.strokeWidth || 1}
          stroke={brush.stroke || "none"}
          fill={brush.fill || "none"}
        />
        {selected && controlPoints.map(p => <CurveControl point={p} />)}
        {/* 当たり判定用の透明なパスシェイプ */}
        <path
          d={path}
          strokeWidth={10 /* 当たり判定を広げる */ }
          stroke="rgba(0,0,0,0)"
          fill="rgba(0,0,0,0)"
        />
      </g>
      {selected && <ShapeControl
        rect={bounds}
        rotation={rotation}
        anchor={pos}
        onMouseDown={(e, anchor) => {
          mouseHandler.onMouseDown(e, this, anchor)
        }} />
      }
    </g>
  }
}
