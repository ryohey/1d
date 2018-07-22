import xml from "node-xml-lite"

import svgPathParser from "svg-path-parser"
import _ from "lodash"
import { notEmpty } from "./typeHelper"

function walkElements(element, callback) {
  if (!(element instanceof Object)) {
    return
  }
  for (let e of element.childs || []) {
    walkElements(e, callback)
  }
  callback(element)
}

function getValue(obj, def) {
  return _.isNil(obj) ? def : obj
}

function pathConverter({ name, attrib }) {
  if (name !== "path") {
    return
  }
  const path = svgPathParser(attrib.d)
  return _.flatMap(path, p => {
    switch (p.command) {
      case "moveto":
        return `moveTo ${p.x} ${p.y}`
      case "lineto":
        return `lineTo ${p.x} ${p.y}`
      case "curveto":
        return `curveTo ${p.x} ${p.y} ${p.x1} ${p.y1} ${p.x2} ${p.y2}`
      case "closepath":
        return `fill ${"black"}` // TODO: use current fill color
      default:
        return null
    }
  })
}

function circleConverter({ name, attrib }) {
  if (name !== "circle") {
    return
  }
  const a = attrib
  return [
    `moveTo ${a.cx} ${a.cy}`,
    `circle ${a.r}`,
    `fill ${getValue(a.fill, "none")}`,
    `stroke ${getValue(a.stroke, "none")}`,
    `strokeWidth ${getValue(a["stroke-width"], 0)}`
  ]
}

function ellipseConverter({ name, attrib }) {
  if (name !== "ellipse") {
    return
  }
  const a = attrib
  return [
    `moveTo ${a.cx} ${a.cy}`,
    `circle ${a.rx} ${a.ry}`,
    `fill ${getValue(a.fill, "none")}`,
    `stroke ${getValue(a.stroke, "none")}`,
    `strokeWidth ${getValue(a["stroke-width"], 0)}`
  ]
}

function textConverter({ name, attrib, childs }) {
  if (name !== "text") {
    return
  }
  const a = attrib
  const text = childs[0].replace(/\n/g, "\\n")
  return [
    `moveTo ${a.x} ${a.y}`,
    `text "${text}"`,
    `fontSize ${getValue(a["font-size"], 0)}`
  ]
}

const plugins = [
  pathConverter,
  circleConverter,
  ellipseConverter,
  textConverter
]

function findMap(arr, func) {
  for (let a of arr) {
    const result = func(a)
    if (result) {
      return result
    }
  }
  return null
}

export default function svgToCommands(svgText) {
  const root = xml.parseString(svgText)
  let commands = []

  walkElements(root, e => {
    commands = commands.concat(findMap(plugins, p => p(e)))
  })
  return commands.filter(notEmpty)
}
