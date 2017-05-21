import React, { Component } from "react"
import _ from "lodash"

import optimize from "./Parser/optimize"
import renderCommand from "./Parser/renderCommand"
import parseCommands from "./Parser/parser"
import commandToText from "./Parser/commandToText"

import MouseHandler from "./MouseHandler/MouseHandler"
import SelectionRect from "./SelectionRect"

import svgToCommands from "./helpers/svgToCommands"
import { rgbaString } from "./helpers/color"
import { downloadBlob } from "./helpers/downloadBlob"
import { rectIntersects } from "./helpers/rect"

import MainToolbar from "./components/MainToolbar"
import ShapePropsForm from "./components/ShapePropsForm"
import AlignmentToolbar from "./components/AlignmentToolbar"

import './App.css'

const defaultScript = `
grid 16
stroke rgba(0,0,0,0.03)

move 1 1
line 4 3
line -2 1
close
fill blue
name tri

moveTo 10 4
rect 3 5
fill yellow
name rect

moveTo 5 15
circle 2
fill orange

move 3 0
copy
fill lightgreen

move 3 0
copy
strokeWidth 4px
stroke lightgray

move 3 0
copy
fill lightblue
resize 5 2 0 0

select1 tri
copy
stroke red

move 0 5
@rect copy
stroke green

translate -12 1
@rect resize 50px 10px
translate 1 0
translate 1 1
translate 10 10

deselectAll
select 1 3 4 5 6 7
dist x

moveTo 2 2
text "Hello World!"
fontSize 2
deselectAll
`

function cleanupText(text) {
  return text.replace(/[ \t]{2,}/g, "")
}

class App extends Component {
  constructor(props) {
    super(props)
    this.mouseHandler = new MouseHandler(
      t => this.addScript(t),
      t => this.previewScript(t),
      rect => this.getShapesInsideRect(rect),
      rect => this.setState({ selectionRect: rect }),
      (mode, opts) => this.changeMouseMode(mode, opts)
    )

    this.state = {
      scriptHistory: [defaultScript],
      undoHistory: [],
      tempScript: "",
      mouseMode: "default"
    }

    this.onKeyDown = this.onKeyDown.bind(this)
  }

  changeMouseMode(mode, options) {
    this.setState({ mouseMode: mode })
    this.mouseHandler.mode = mode
    this.mouseHandler.options = options
  }

  previewScript(line) {
    this.setState({
      tempScript: line.split("\n").map(cleanupText).join("\n")
    })
  }

  get currentScript() {
    return _.last(this.state.scriptHistory)
  }

  setScript(script) {
    this.setState({
      scriptHistory: [...this.state.scriptHistory, script]
    })
  }

  addScript(line) {
    this.setScript(this.currentScript + "\n" + cleanupText(line))
  }

  addScriptLines(lines) {
    this.setScript(this.currentScript + "\n" + lines.map(cleanupText).join("\n"))
  }

  undoScript() {
    const { scriptHistory, undoHistory } = this.state
    if (scriptHistory.length <= 1) {
      return
    }
    this.setState({
      scriptHistory: _.dropRight(scriptHistory),
      undoHistory: [...undoHistory, this.currentScript]
    })
  }

  redoScript() {
    const { scriptHistory, undoHistory } = this.state
    if (undoHistory.length < 1) {
      return
    }
    this.setState({
      scriptHistory: [...scriptHistory, _.last(undoHistory)],
      undoHistory: _.dropRight(undoHistory)
    })
  }

  getShapesInsideRect(rect) {
    if (!this.svgComponent) {
      return []
    }

    function toRect(bbox) {
      return {
        origin: { x: bbox.x, y: bbox.y },
        size: { x: bbox.width, y: bbox.height }
      }
    }

    const shapeElements = Array.from(this.svgComponent.querySelectorAll("g"))

    return shapeElements
      .filter(e => e.attributes["data-shape-id"] !== undefined)
      .filter(e => rectIntersects(rect, toRect(e.getBBox())))
      .map(e => e.attributes["data-shape-id"].value)
  }

  onKeyDown(e) {
    const d = e.shiftKey ? 10 : 1
    const translate = (dx, dy) => {
      this.addScript(`translate ${dx} ${dy}`)
    }
    switch(e.key) {
      case "ArrowLeft": return translate(-d, 0)
      case "ArrowRight": return translate(d, 0)
      case "ArrowUp": return translate(0, -d)
      case "ArrowDown": return translate(0, d)
      case "Escape": {
        this.addScript("deselectAll")
        this.changeMouseMode("default")
        return
      }
      case "Backspace":
      case "Delete":
        this.addScript("remove")
        return
      case "z":
        if (e.ctrlKey) {
          if (e.shiftKey) {
            this.redoScript()
          } else {
            this.undoScript()
          }
        }
        return
      case "y":
        if (e.ctrlKey) {
          this.redoScript()
        }
        return
      case "a":
        if (e.ctrlKey) {
          this.addScript("selectAll")
        }
        return
      default: break
    }
  }

  render() {
    const { currentScript, mouseHandler } = this
    const { tempScript, selectionRect, mouseMode } = this.state

    const script = currentScript + "\n" + tempScript
    const commands = parseCommands(script)
    const shapes = renderCommand(commands, mouseHandler)
    const selectedShape = shapes.filter(s => s.selected)[0]
    const selectedShapeSize = selectedShape && selectedShape.size
    const svgContent = shapes.map(s => s.render())

    const onChangeText= e => {
      this.setScript(e.target.value)
    }

    const mainToolbar = <MainToolbar
      mouseMode={mouseMode}

      onClickSave={() => {
        downloadBlob(this.currentScript, "noname.1d", "text/plain")
      }}

      onClickExport={() => {
        const { svgComponent } = this
        downloadBlob(svgComponent.outerHTML, "noname.svg", "image/svg+xml")
      }}

      onFileOpen={e => {
        const reader = new FileReader()

        reader.onload = () => {
          const commands = svgToCommands(reader.result)
          this.addScriptLines(commands)
        }

        const file = e.target.files[0]
        reader.readAsText(file)
      }}

      onClickRect={() => {
        this.changeMouseMode("rect")
      }}

      onClickCircle={() => {
        this.changeMouseMode("circle")
      }}

      onClickLine={() => {
        this.changeMouseMode("line")
      }}

      onClickPath={() => {
        this.changeMouseMode("path")
      }}

      onClickText={() => {
        this.changeMouseMode("text")
      }}

      onClickOptimize={() => {
        const optimized = commandToText(optimize(parseCommands(this.currentScript)))
        this.setScript(optimized)
      }}
    />

    const shapePropsForm = <ShapePropsForm
      selectedShape={selectedShape}
      selectedShapeSize={selectedShapeSize}

      onChangeFillColor={color => {
        this.previewScript(`fill ${rgbaString(color)}`)
      }}

      onChangeFillColorComplete={color => {
        this.addScript(`fill ${rgbaString(color)}`)
        this.previewScript("")
      }}

      onChangeStrokeColor={color => {
        this.previewScript(`stroke ${rgbaString(color)}`)
      }}

      onChangeStrokeColorComplete={color => {
        this.addScript(`stroke ${rgbaString(color)}`)
        this.previewScript("")
      }}

      onChangeLineWidth={e => {
        this.previewScript(`strokeWidth ${e.target.value}px`)
      }}

      onChangeLineWidthComplete={e => {
        this.addScript(`strokeWidth ${e.target.value}px`)
      }}

      onChangePositionX={e => {
        this.addScript(`translateTo ${e.target.value}px ${selectedShape.pos.y}px`)
      }}

      onChangePositionY={e => {
        this.addScript(`translateTo ${selectedShape.pos.x}px ${e.target.value}px`)
      }}

      onChangeSizeWidth={e => {
        this.addScript(`resize ${e.target.value}px ${selectedShapeSize.y}px`)
      }}

      onChangeSizeHeight={e => {
        this.addScript(`resize ${selectedShapeSize.y}px ${e.target.value}px`)
      }}

      onChangeRotation={e => {
        this.addScript(`rotateTo ${e.target.value}`)
      }}

      onChangeFontSize={e => {
        this.addScript(`fontSize ${e.target.value}px`)
      }}

      onChangeFontFamily={e => {
        this.addScript(`fontFamily "${e.target.value}"`)
      }}
    />

    const alignmentToolbar = <AlignmentToolbar
      onClickAlignLeft={() => {
        this.addScript(`align left`)
      }}

      onClickAlignCenter={() => {
        this.addScript(`align center`)
      }}

      onClickAlignRight={() => {
        this.addScript(`align right`)
      }}

      onClickAlignTop={() => {
        this.addScript(`align top`)
      }}

      onClickAlignMiddle={() => {
        this.addScript(`align middle`)
      }}

      onClickAlignBottom={() => {
        this.addScript(`align bottom`)
      }}

      onClickDistX={() => {
        this.addScript(`dist x`)
      }}

      onClickDistY={() => {
        this.addScript(`dist y`)
      }}
    />

    return (
      <div className="App">
        {mainToolbar}
        <div className="content">
          <div className="alpha">
            <textarea value={currentScript} onChange={onChangeText} />
            <div className="tempScript"><pre>{tempScript}</pre></div>
          </div>
          <div className="beta">
            <svg id="svg"
              ref={c => this.svgComponent = c}
              tabIndex="0"
              onKeyDown={this.onKeyDown}
              onMouseDown={e => mouseHandler.onMouseDownStage(e)}>
              {svgContent}
              {selectionRect && <SelectionRect rect={selectionRect} />}
            </svg>
          </div>
          <div className="gamma">
            {selectedShape &&
              <div>
                {alignmentToolbar}
                <div className="separator" />
                {shapePropsForm}
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default App;
