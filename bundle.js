/**

text -> commands -> completed commands -> svg

command = {
  type: move, line, stroke, fill,
  options: [Number, ...]
}

*/

/**
  draw display object
*/
function draw(ctx, obj) {
  ctx[obj.action](...(obj.options || []))
}

function createAction(action, options = []) {
  return {
    action,
    options
  }
}

function completeCommands(commands) {
  for (com of commands) {

  }
}

/**
  convert commands to display objects
*/
function parseCommands(text) {
  function parse(words) {
    switch (words[0]) {
      case "move":
        return [
          createAction("beginPath"),
          createAction("moveTo", [words[1], words[2]])
        ]
        break;
      case "line":
        return [
          createAction("lineTo", [words[1], words[2]])
        ]
      case "close":
        return [
          createAction("closePath")
        ]
      case "stroke":
        return [
          createAction("stroke")
        ]
    }
    return []
  }
  const list = []
  for (line of text.split("\n")) {
    const words = line.split(" ")
    if (words[0].startsWith("@")) {
      // TODO: @<id> の実装
      const objs = parse(words.slice(1, words.length))
      list.push(...objs)
    } else {
      const objs = parse(words)
      list.push(...objs)
    }
  }
  return list
}

window.onload = () => {
  const { textarea, canvas } = window
  textarea.onkeyup = e => {
    console.log(e.target.value)
  }
  const ctx = canvas.getContext("2d")
  const commands = parseCommands(`
move 10 10
line 40 30
line 20 20
close
stroke
  `)
  commands.forEach(c => draw(ctx, c))
}
