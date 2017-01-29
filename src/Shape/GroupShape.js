import React from "react"
import Shape from "./Shape"

export default class GroupShape extends Shape {
  constructor(pos = { x: 0, y: 0 }, shapes = []) {
    super(pos)
    this.shapes = shapes
  }

  render() {
    // TODO: support this.pos
    return <g>
      {this.shapes.map(s => s.render())}
    </g>
  }
}
