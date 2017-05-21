import React, { Component } from "react"
import ShapeControl from "../ShapeControl"
import Shape from "./Shape"

import "./TextShape.css"

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

    const { pos, text, fontSize, fontFamily, brush, mouseHandler, selected, bounds, rotation, editing, id } = shape

    const isEditing = editing && selected

    return <g
      data-shape-id={id}
      cursor="move"
      onDoubleClick={e => mouseHandler.onDoubleClick(e, shape)}
      onMouseDown={e => mouseHandler.onMouseDown(e, shape)}>
      <text
        ref={this.textComponentDidMount}
        transform={`rotate(${rotation} ${pos.x} ${pos.y})`}
        dominantBaseline="text-before-edge"
        x={pos.x}
        y={pos.y}
        fontSize={fontSize}
        fontFamily={fontFamily}
        stroke={brush.stroke || "none"}
        strokeWidth={brush.strokeWidth || 1}
        fill={brush.fill || "black"}
        style={isEditing ? { opacity: 0 } : {}}>
        {text.replace(/\\n/g, "\n")}
      </text>
      {isEditing &&
        <foreignObject
          x={bounds.origin.x}
          y={bounds.origin.y}
          width={bounds.size.x}
          height={bounds.size.y}>
          <div xmlns="http://www.w3.org/1999/xhtml" className="input-container">
            <input
              style={{ fontSize, fontFamily, color: brush.fill || "black" }}
              onChange={e => mouseHandler.onChangeTextInput(e, shape)}
              onKeyDown={e => mouseHandler.onKeyDownTextInput(e, shape)}
              onMouseDown={e => e.stopPropagation()}
              onMouseMove={e => e.stopPropagation()}
              onMouseUp={e => e.stopPropagation()}
              value={text} />
          </div>
        </foreignObject>
      }
      {!editing && selected && <ShapeControl
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
