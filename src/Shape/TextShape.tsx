import React, { Component } from "react"
import { Rectangle, Size, Point } from "paper"
import ShapeControl from "../components/ShapeControl"
import Shape from "./Shape"
import ResizeObserver from "resize-observer-polyfill"

import "./TextShape.css"

function strokeStyle(color = "transparent", strokeWidth = 0) {
  const c = color
  const s = strokeWidth
  return {
    textShadow: `${s}px 0px 0px ${c}, 0px ${s}px 0px ${c}, ${-s}px 0px 0px ${c}, 0px ${-s}px 0px ${c}`
  }
}

interface TextWrapperProps {
  shape: TextShape
}

interface TextWrapperState {
  shapeSize: Size
}

class TextWrapper extends Component<TextWrapperProps, TextWrapperState> {
  private ro: ResizeObserver
  private textComponent: SVGTextElement | null

  state = {
    shapeSize: new Size(0, 0)
  }

  componentDidMount() {
    this.ro = new ResizeObserver((entries, observer) => {
      const { width, height } = entries[0].contentRect
      this.setState({
        shapeSize: new Size(width, height)
      })
    })
    if (this.textComponent === null) {
      throw new Error("text element is not mounted")
    }
    this.ro.observe(this.textComponent)
  }

  componentWillUnmount() {
    this.ro.disconnect()
  }

  render() {
    const { shape } = this.props
    const { shapeSize } = this.state

    // shape は毎回再生成されるので size をセットしなおす
    shape._size = shapeSize

    const {
      pos,
      text,
      fontSize,
      fontFamily,
      brush,
      mouseHandler,
      selected,
      bounds,
      rotation,
      editing,
      id
    } = shape

    const isEditing = editing && selected

    return (
      <g
        data-shape-id={id}
        cursor="move"
        onDoubleClick={e => mouseHandler.onDoubleClick(e, shape)}
        onMouseDown={e => mouseHandler.onMouseDown(e, shape)}
      >
        <text
          ref={c => (this.textComponent = c)}
          transform={`rotate(${rotation} ${pos.x} ${pos.y})`}
          dominantBaseline="text-before-edge"
          x={pos.x}
          y={pos.y}
          fontSize={fontSize}
          fontFamily={fontFamily}
          stroke={brush.stroke || "none"}
          strokeWidth={brush.strokeWidth || 1}
          fill={brush.fill || "black"}
          style={isEditing ? { opacity: 0 } : {}}
        >
          {text.replace(/\\n/g, "\n")}
        </text>
        {isEditing && (
          <foreignObject
            x={bounds.x}
            y={bounds.y}
            width={bounds.width}
            height={bounds.height}
          >
            <div className="input-container">
              <input
                style={{
                  fontSize,
                  fontFamily,
                  color: brush.fill || "black",
                  ...strokeStyle(brush.stroke, brush.strokeWidth)
                }}
                onChange={e => mouseHandler.onChangeTextInput(e, shape)}
                onKeyDown={e => mouseHandler.onKeyDownTextInput(e, shape)}
                onMouseDown={e => e.stopPropagation()}
                onMouseMove={e => e.stopPropagation()}
                onMouseUp={e => e.stopPropagation()}
                value={text}
              />
            </div>
          </foreignObject>
        )}
        {!editing &&
          selected && (
            <ShapeControl
              rect={bounds}
              anchor={pos}
              onMouseDown={(e, anchor) => {
                mouseHandler.onMouseDown(e, shape, anchor)
              }}
            />
          )}
      </g>
    )
  }
}

export default class TextShape extends Shape {
  text: string
  fontSize: number
  fontFamily: string | undefined
  _size: Size

  constructor(pos: Point, text = "") {
    super(pos)
    this.text = text
    this.fontSize = 0
    this._size = new Size(0, 0)
  }

  get bounds() {
    return new Rectangle(this.pos, this._size)
  }

  resize(size: Point, anchor: Point) {
    this.fontSize = size.y / 1.2
  }

  render() {
    return <TextWrapper shape={this} />
  }
}
