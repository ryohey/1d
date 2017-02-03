import React from "react"
import Shape from "./Shape"

export default class TextShape extends Shape {
  constructor(pos = { x: 0, y: 0 }, text = "") {
    super(pos)
    this.text = text
    this.fontSize = 0
  }

  render() {
    return <text x={this.pos.x} y={this.pos.y} fontSize={this.fontSize}>
      {this.text.replace(/\\n/g, "\n")}
    </text>
  }
}
