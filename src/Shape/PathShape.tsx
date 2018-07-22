import React, { SFC } from "react"
import { Rectangle, Point } from "paper"
import { toSVGPath, pointsMax, pointsMin, rect } from "../helpers/point"
import ShapeControl from "../components/ShapeControl"
import Shape from "./Shape"
import { ICurvedPoint } from "../basic/ICurvedPoint"

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
  return (
    <g>
      <path d={toSVGPath([point, c1])} stroke={COLOR} strokeWidth={1} />
      <path d={toSVGPath([point, c2])} stroke={COLOR2} strokeWidth={1} />
      <ControlRect center={c1} />
      <ControlRect center={c2} />
    </g>
  )
}

const ControlRect: SFC<{ center: Point; onMouseDown?: any }> = ({
  center,
  onMouseDown
}) => {
  return (
    <path
      d={toSVGPath(rect(center, HANDLE_SIZE), true)}
      stroke={COLOR}
      fill="white"
      cursor="pointer"
      onMouseDown={onMouseDown}
    />
  )
}

export default class PathShape extends Shape {
  path: ICurvedPoint[]
  closed: boolean

  constructor(pos?: Point, path: Point[] = [], closed = false) {
    super(pos)
    this.path = path
    this.closed = closed
  }

  resize(size: Point, anchor: Point) {
    // TODO: support curveto
    const leftTop = pointsMin(this.path)
    const rightBottom = pointsMax(this.path)
    const originalSize = rightBottom.subtract(leftTop)
    const scale = size.divide(originalSize)
    this.path = this.path.map(p =>
      new Point(p)
        .subtract(leftTop)
        .multiply(scale)
        .add(leftTop)
    )
    this.pos = originalSize
      .subtract(size)
      .multiply(anchor)
      .add(this.pos)
  }

  get bounds() {
    return new Rectangle(
      pointsMin(this.path).add(this.pos),
      pointsMax(this.path).add(this.pos)
    )
  }

  render() {
    const {
      pos,
      closed,
      mouseHandler,
      brush,
      selected,
      bounds,
      rotation
    } = this
    const path = toSVGPath(this.path, closed)
    const controlPoints = filterControlPoints(this.path)

    return (
      <g
        data-shape-id={this.id}
        onMouseDown={e => mouseHandler.onMouseDown(e, this)}
      >
        <g
          transform={`translate(${pos.x}, ${pos.y}) rotate(${rotation})`}
          cursor="move"
        >
          <path
            d={path}
            strokeWidth={brush.strokeWidth || 1}
            stroke={brush.stroke || "none"}
            fill={brush.fill || "none"}
          />
          {selected &&
            controlPoints.map((p, i) => <CurveControl point={p} key={i} />)}
          {/* 当たり判定用の透明なパスシェイプ */}
          <path
            d={path}
            strokeWidth={10 /* 当たり判定を広げる */}
            stroke="rgba(0,0,0,0)"
            fill="rgba(0,0,0,0)"
          />
        </g>
        {selected && (
          <ShapeControl
            rect={bounds}
            rotation={rotation}
            anchor={pos}
            onMouseDown={(e, anchor) => {
              mouseHandler.onMouseDown(e, this, anchor)
            }}
          />
        )}
      </g>
    )
  }
}
