/**

text -> [parseCommands] -> commands -> [buildSVG] -> svg

*/

function attr(name, value, defaultValue = "") {
  return `${name}="${value || defaultValue}"`
}

function warn(value, message) {
  if (value) {
    console.warn(message)
  }
}

class Shape {
  render() {
    throw "not implemented"
  }
}

class PathShape extends Shape {
  constructor(path = []) {
    super()
    this.path = path
    this.closed = false
  }

  render(ctx) {
    const lines = this.path.slice(1, this.path.length).map(p => `L${p.x} ${p.y}`).join(" ")
    const startPos = this.path[0]
    const d = attr("d", `M${startPos.x} ${startPos.y} ${lines} ${this.closed ? "Z" : ""}`)
    const st = attr("stroke", ctx.stroke, "none")
    const fl = attr("fill", ctx.fill, "none")
    return `<path ${d} ${st} ${fl} />`
  }
}

class RectShape extends Shape {
  constructor(pos, w, h) {
    super()
    this.pathShape = new PathShape([
      {
        x: pos.x,
        y: pos.y
      },
      {
        x: pos.x + w,
        y: pos.y
      },
      {
        x: pos.x + w,
        y: pos.y + h
      },
      {
        x: pos.x,
        y: pos.y + h
      },
    ])
    this.pathShape.closed = true
  }

  render(ctx) {
    return this.pathShape.render(ctx)
  }
}

class CircleShape extends Shape {
  constructor() {
    super()
    this.radius = 0
  }

  render(ctx) {
    const st = attr("stroke", ctx.stroke, "none")
    const fl = attr("fill", ctx.fill, "none")
    const r = attr("r", this.radius)
    const cx = attr("cx", ctx.pos.x)
    const cy = attr("cy", ctx.pos.y)
    return `<circle ${r} ${st} ${fl} ${cx} ${cy} />`
  }
}

function buildSVG(commands) {
  const ctx = {
    pos: { x: 0, y: 0 },
    shape: undefined,
    stroke: undefined,
    fill: undefined
  }
  const svg = []

  function add(element) {
    svg.push(element)
  }

  function draw() {
    add(ctx.shape.render(ctx))
    ctx.stroke = undefined
    ctx.fill = undefined
    ctx.shape = undefined
  }

  for (com of commands) {
    const opts = com.options
    switch (com.action) {
      case "moveTo":
        ctx.pos.x = parseInt(opts[0])
        ctx.pos.y = parseInt(opts[1])
        break
      case "move":
        ctx.pos.x += parseInt(opts[0])
        ctx.pos.y += parseInt(opts[1])
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
        ctx.pos.x += parseInt(opts[0])
        ctx.pos.y += parseInt(opts[1])
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
        ctx.shape = new RectShape(ctx.pos, parseInt(opts[0]), parseInt(opts[1]))
        break
      case "circle":
        warn(ctx.shape, "invalid state: context already has a shape")
        ctx.shape = new CircleShape
        ctx.shape.radius = parseInt(opts[0])
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
      target = words[0].slice(1, words[0].length)
      action = words[1]
      options = words.slice(2, words.length)
      list.push(...objs)
    } else {
      action = words[0]
      options = words.slice(1, words.length)
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
