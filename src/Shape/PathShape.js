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

  size() {
    return pointSub(pointsMax(this.path), pointsMin(this.path))
  }

  render() {
    const { pos, closed, mouseHandler, brush, selected } = this
    const points = this.path.map(p => pointAdd(p, pos))
    const path = toSVGPath(points, closed)
    const leftTop = pointsMin(points)
    return <g
      onMouseOver={e => mouseHandler.onMouseOver(e, this)}
      onMouseDown={e => mouseHandler.onMouseDown(e, this)}>
      <path
        d={path}
        stroke={brush.stroke || "none"}
        strokeWidth={brush.strokeWidth || 1}
        fill={brush.fill || "none"}
        cursor="move"
      />
      {selected && <ShapeControl
        pos={leftTop}
        size={this.size()}
        onMouseDown={(e, anchor) => {
          mouseHandler.onMouseDown(e, this, anchor)
        }} />
      }
    </g>
  }
}
