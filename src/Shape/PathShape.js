import React from "react"
import Shape from "./Shape"
import { pointAdd, pointSub, pointDot, pointDiv, toSVGPath } from "../helpers/point"
import renderPathHandle from "../helpers/renderPathHandle"
import _ from "lodash"

export default class PathShape extends Shape {
  constructor(pos = { x: 0, y: 0 }, path = [], closed = false) {
    super(pos)
    this.path = path
    this.closed = closed
  }

  resize(size, anchor) {
    const leftTop = {
      x: _.min(this.path.map(p => p.x)),
      y: _.min(this.path.map(p => p.y))
    }
    const rightBottom = {
      x: _.max(this.path.map(p => p.x)),
      y: _.max(this.path.map(p => p.y))
    }
    const originalSize = pointSub(rightBottom, leftTop)
    const scale = pointDiv(size, originalSize)
    this.path = this.path.map(p =>
      pointAdd(pointDot(pointSub(p, leftTop), scale), leftTop)
    )
    const delta = pointSub(originalSize, size)
    this.pos = pointAdd(this.pos, pointDot(delta, anchor))
  }

  render() {
    const { pos, closed, mouseHandler, brush, selected } = this
    const points = this.path.map(p => pointAdd(p, pos))
    const path = toSVGPath(points, closed)
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
      {selected && renderPathHandle(points)}
    </g>
  }
}
