import React from "react"
import Shape from "./Shape"
import { pointAdd, pointSub, pointDot, pointDiv, toSVGPath, pointsMax, pointsMin } from "../helpers/point"
import ShapeControl from "../ShapeControl"
import _ from "lodash"

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
        {/* 当たり判定用の透明なパスシェイプ */}
        <path
          d={path}
          strokeWidth={10 /* 当たり判定を広げる */ }
          stroke="rgba(0,0,0,0)"
          fill="rgba(0,0,0,0)"
        />
      </g>
      {selected && <ShapeControl
        pos={bounds.origin}
        size={bounds.size}
        anchor={pos}
        onMouseDown={(e, anchor) => {
          mouseHandler.onMouseDown(e, this, anchor)
        }} />
      }
    </g>
  }
}
