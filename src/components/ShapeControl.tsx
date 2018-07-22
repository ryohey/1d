import React from "react"
import { Point } from "paper"
import { toSVGPath, rect, pointRound } from "../helpers/point"

const HANDLE_SIZE = 3
const DOT_SIZE = 3
const COLOR = "rgb(37, 129, 255)"

const anchors = [
  new Point(0, 0),
  new Point(0.5, 0),
  new Point(1, 0),
  new Point(1, 0.5),
  new Point(1, 1),
  new Point(0.5, 1),
  new Point(0, 1),
  new Point(0, 0.5)
]

function ControlRect({ center, onMouseDown }) {
  return <path
    d={toSVGPath(rect(center, HANDLE_SIZE), true)}
    stroke={COLOR}
    fill="white"
    cursor="pointer"
    onMouseDown={onMouseDown}
  />
}

function ControlDot({ center }) {
  return <path
    d={toSVGPath(rect(center, DOT_SIZE), true)}
    fill={COLOR}
    style={{pointerEvents: "none"}}
  />
}

export default function ShapeControl({ rect, anchor, rotation = 0, onMouseDown }) {
  const corners = anchors.map(a => [a, pointRound(a.multiply(rect.size).add(rect.point))])
  return <g transform={`translate(0.5 0.5) rotate(${rotation})`}>
    {corners.map((c, i) => {
      const next = corners[(i + 1) % corners.length]
      return <path
        key={i}
        d={toSVGPath([c[1], next[1]])}
        stroke={COLOR}
      />
    })}
    {corners.map((c, i) =>
      <ControlRect
        key={i}
        center={c[1]}
        onMouseDown={e => {
          onMouseDown(e, c[0])
        }}
      />
    )}
    {anchor && <ControlDot center={anchor} />}
  </g>
}
