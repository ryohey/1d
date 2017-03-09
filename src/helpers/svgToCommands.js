import SVG from "svg.js"
import svgPathParser from "svg-path-parser"
import _ from "lodash"

function walkElements(element, callback) {
  for (let e of element.children) {
    walkElements(e, callback)
  }
  callback(element)
}

function getValue(obj, def) {
  return _.isNil(obj) ? def : obj.value
}

function pathConverter(e) {
  if (e.nodeName !== "path") {
    return
  }
  const path = svgPathParser(e.attributes.d.value)
  return _.flatMap(path, p => {
    switch (p.command) {
    case "moveto":
      return `moveTo ${p.x} ${p.y}`
    case "lineto":
      return `lineTo ${p.x} ${p.y}`
    case "curveto":
      return `curveTo ${p.x} ${p.y} ${p.x1} ${p.y1} ${p.x2} ${p.y2}`
    case "closepath":
      return `fill ${e.parentNode.fill || "black"}`
    default:
      return null
    }
  })
}

function circleConverter({ nodeName, attributes }) {
  if (nodeName !== "circle") {
    return
  }
  const a = attributes
  return [
    `moveTo ${a.cx.value} ${a.cy.value}`,
    `circle ${a.r.value}`,
    `fill ${getValue(a.fill, "none")}`,
    `stroke ${getValue(a.stroke, "none")}`,
    `strokeWidth ${getValue(a["stroke-width"], 0)}`
  ]
}

function ellipseConverter({ nodeName, attributes }) {
  if (nodeName !== "ellipse") {
    return
  }
  const a = attributes
  return [
    `moveTo ${a.cx.value} ${a.cy.value}`,
    `circle ${a.rx.value} ${a.ry.value}`,
    `fill ${getValue(a.fill, "none")}`,
    `stroke ${getValue(a.stroke, "none")}`,
    `strokeWidth ${getValue(a["stroke-width"], 0)}`
  ]
}

function textConverter({ nodeName, attributes, textContent }) {
  if (nodeName !== "text") {
    return
  }
  const a = attributes
  return [
    `moveTo ${a.x.value} ${a.y.value}`,
    `text "${textContent.replace(/\n/g, "\\n")}"`,
    `fontSize ${getValue(a["font-size"], 0)}`
  ]
}

const plugins = [pathConverter, circleConverter, ellipseConverter, textConverter]

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
  const canvas = document.createElement("canvas")
  const draw = SVG(canvas)
  draw.svg(svgText)
  let commands = []

  walkElements(draw.node, e => {
    commands = commands.concat(findMap(plugins, p => p(e)))
  })

  return commands
}
