/**

text -> [parseCommands] -> commands -> [buildSVG] -> svg

*/

/* helpers */

function warn(value, message) {
  if (value) {
    console.warn(message)
  }
}

function attr(name, value, defaultValue = "") {
  return `${name}="${value || defaultValue}"`
}

function pointAdd(a, b) {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  }
}

function pointCopy(a) {
  return {
    x: a.x,
    y: a.y
  }
}

/**
  [{ x: 10, y: 20 }, { x: 40, y: 30 }, { x: 9, y: 54 }]
  => M10 20 L40 30 L9 54
*/
function toSVGPath(points, closed = false) {
  const path = [`M${points[0].x} ${points[0].y}`, ..._.tail(points).map(p => `L${p.x} ${p.y}`)]
  return `${path.join(" ")}${closed ? " Z" : ""}`
}

/**
  ctx に設定された座標系に変換する
  value は数値か座標
*/
function project(ctx, value) {
  const scale = ctx.scale
  if (!scale) {
    return value
  }
  if (_.isNumber(value)) {
    return value * scale
  } else if (value instanceof Object && value.x !== undefined && value.y !== undefined) {
    return {
      x: value.x * scale,
      y: value.y * scale
    }
  }
  return value
}

/* Shapes */

class Shape {
  constructor(pos = { x: 0, y: 0 }) {
    this.pos = pointCopy(pos)
  }

  render() {
    throw "not implemented"
  }

  clone() {
    return _.clone(this)
  }
}

class PathShape extends Shape {
  constructor(pos = { x: 0, y: 0 }, path = []) {
    super(pos)
    this.path = path
    this.closed = false
  }

  render(ctx) {
    const path = toSVGPath(this.path.map(p => project(ctx, pointAdd(p, this.pos))), this.closed)
    const d = attr("d", path)
    const st = attr("stroke", ctx.stroke, "none")
    const fl = attr("fill", ctx.fill, "none")
    return `<path ${d} ${st} ${fl} />`
  }
}

class RectShape extends Shape {
  constructor(pos = { x: 0, y: 0 }, w = 0, h = 0) {
    super(pos)
    this.pathShape = new PathShape(pos, [
      { x: 0, y: 0 },
      { x: w, y: 0 },
      { x: w, y: h },
      { x: 0, y: h },
    ])
    this.pathShape.closed = true
  }

  render(ctx) {
    return this.pathShape.render(ctx)
  }
}

class CircleShape extends Shape {
  constructor(pos = { x: 0, y: 0 }, radius = 0) {
    super(pos)
    this.radius = radius
  }

  render(ctx) {
    const st = attr("stroke", ctx.stroke, "none")
    const fl = attr("fill", ctx.fill, "none")
    const r = attr("r", project(ctx, this.radius))
    const pos = project(ctx, this.pos)
    const cx = attr("cx", pos.x)
    const cy = attr("cy", pos.y)
    return `<circle ${r} ${st} ${fl} ${cx} ${cy} />`
  }
}

class GroupShape extends Shape {
  constructor(pos = { x: 0, y: 0 }, shapes = []) {
    super(pos)
    this.shapes = shapes
  }

  render(ctx) {
    // TODO: support this.pos
    return "<g>"
      + this.shapes.map(s => s.render(ctx)).join("")
      + "</g>"
  }
}

class GridShape extends Shape {
  constructor(pos = { x: 0, y: 0 }, scale = 1) {
    super(pos)
    this.scale = scale
  }

  render(ctx) {
    const paths = []
    const far = 9999
    for (let x = 0; x < 100; x++) {
      paths.push([{ x, y: 0 }, { x, y: far }])
    }
    for (let y = 0; y < 100; y++) {
      paths.push([{ x: 0, y }, { x: far, y }])
    }
    const paths2 = paths.map(path => path.map(p => project(ctx, pointAdd(p, this.pos))))
    const d = attr("d", paths2.map(toSVGPath).join(" "))
    const st = attr("stroke", ctx.stroke, "none")
    const fl = attr("fill", ctx.fill, "none")
    return `<path ${d} ${st} ${fl} />`
  }
}

/* main functions */

function buildSVG(commands) {
  const ctx = {
    pos: { x: 0, y: 0 },
    shape: undefined,
    selectedShape: undefined,
    stroke: undefined,
    fill: undefined,
    scale: 1,
    namedShapes: {} // {String: Shape}
  }
  const svg = []

  function add(element) {
    svg.push(element)
  }

  function draw() {
    add(ctx.shape.render(ctx))
    ctx.selectedShape = ctx.shape
    ctx.stroke = undefined
    ctx.fill = undefined
    ctx.shape = undefined
  }

  for (com of commands) {
    const opts = com.options
    switch (com.action) {
      case "moveTo":
        ctx.pos.x = parseFloat(opts[0])
        ctx.pos.y = parseFloat(opts[1])
        break
      case "move":
        ctx.pos.x += parseFloat(opts[0])
        ctx.pos.y += parseFloat(opts[1])
        break
      case "line":
        if (!ctx.shape) {
          ctx.shape = new PathShape
          ctx.shape.path.push({
            x: ctx.pos.x,
            y: ctx.pos.y
          })
        }
        warn(!(ctx.shape instanceof PathShape), "invalid state: the shape is not PathShape")
        const path = ctx.shape.path
        ctx.pos.x += parseFloat(opts[0])
        ctx.pos.y += parseFloat(opts[1])
        path.push({
          x: ctx.pos.x,
          y: ctx.pos.y
        })
        break
      case "close":
        warn(!(ctx.shape instanceof PathShape), "invalid state: the shape is not PathShape")
        ctx.shape.closed = true
        break
      case "rect":
        warn(ctx.shape, "invalid state: context already has a shape")
        ctx.shape = new RectShape(ctx.pos, parseFloat(opts[0]), parseFloat(opts[1]))
        break
      case "circle":
        warn(ctx.shape, "invalid state: context already has a shape")
        ctx.shape = new CircleShape(ctx.pos, parseFloat(opts[0]))
        break
      case "stroke":
        warn(!ctx.shape, "invalid state: no shapes to draw")
        ctx.stroke = opts[0]
        draw()
        break
      case "fill":
        warn(!ctx.shape, "invalid state: no shapes to draw")
        ctx.fill = opts[0]
        draw()
        break
      case "grid":
        const scale = parseFloat(opts[0])
        ctx.shape = new GridShape({x: 0, y: 0}, scale)
        ctx.scale = scale
        break
      case "name":
        warn(!ctx.selectedShape, "invalid state: no shapes to name")
        ctx.namedShapes[opts[0]] = ctx.selectedShape.clone()
        break
      case "select":
        warn(!ctx.namedShapes[opts[0]], "invalid state: no shapes to select")
        ctx.selectedShape = ctx.namedShapes[opts[0]]
        break
      case "copy":
        warn(!ctx.selectedShape, "invalid state: no shapes to copy")
        ctx.shape = ctx.selectedShape.clone()
        ctx.shape.pos = pointCopy(ctx.pos)
        break
      default:
        warn(true, `unknown action: ${com.action}`)
    }
  }

  return svg
}

/**
  convert commands to display objects
*/
function parseCommands(text) {
  const list = []
  for (line of text.split("\n")) {
    if (line.length === 0) {
      continue
    }

    const words = line.split(" ")
    let target = null
    let action
    let options

    if (words[0].startsWith("@") && words.length > 2) {
      target = _.tail(words[0])
      action = words[1]
      options = words.slice(2, words.length)
      list.push(...objs)
    } else {
      action = words[0]
      options = _.tail(words)
    }

    list.push({ target, action, options })
  }
  return list
}

window.onload = () => {
  const { textarea, svg } = window
  function update() {
    const commands = parseCommands(textarea.value)
    const svgContent = buildSVG(commands)
    console.log(commands)
    console.log(svgContent)
    svg.innerHTML = svgContent
  }
  textarea.onkeyup = update
  update()
}
