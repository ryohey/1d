import React, { Component } from "react"
import ShapeControl from "../ShapeControl"
import Shape from "./Shape"

class TextWrapper extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  textComponentDidMount = (c) => {
    this.setState({ textComponent: c })
  }

  render() {
    const { shape } = this.props

    const { textComponent } = this.state
    if (textComponent) {
      const bbox = textComponent.getBBox()
      shape._size = {
        x: bbox.width,
        y: bbox.height
      }
    }

    const { pos, text, fontSize, brush, mouseHandler, selected, bounds, rotation } = shape

    return <g
      data-shape-id={this.id}
      cursor="move"
      onMouseOver={e => mouseHandler.onMouseOver(e, shape)}
      onMouseDown={e => mouseHandler.onMouseDown(e, shape)}>
      <text
        ref={this.textComponentDidMount}
        transform={`rotate(${rotation})`}
        dominantBaseline="text-before-edge"
        x={pos.x}
        y={pos.y}
        fontSize={fontSize}
        stroke={brush.stroke || "none"}
        strokeWidth={brush.strokeWidth || 1}
        fill={brush.fill || "black"}>
        {text.replace(/\\n/g, "\n")}
      </text>
      {selected && <ShapeControl
        pos={bounds.origin}
        size={bounds.size}
        anchor={pos}
        onMouseDown={(e, anchor) => {
          mouseHandler.onMouseDown(e, shape, anchor)
        }} />
      }
    </g>
  }
}

export default class TextShape extends Shape {
  constructor(pos = { x: 0, y: 0 }, text = "") {
    super(pos)
    this.text = text
    this.fontSize = 0
    this._size = { x: 0, y: 0 }
  }

  get size() {
    return this._size
  }

  get origin() {
    return this.pos
  }

  resize(size, anchor) {
    this.fontSize = size.y / 1.2
  }

  render() {
    return <TextWrapper shape={this} />
  }
}
