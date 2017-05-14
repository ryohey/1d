import React, { Component } from 'react';
import _ from "lodash"
import renderCommand from "./Parser/renderCommand"
import parseCommands from "./Parser/parser"
import optimize from "./Parser/optimize"
import MouseHandler from "./MouseHandler/MouseHandler"
import ColorButton from "./ColorButton"
import svgToCommands from "./helpers/svgToCommands"
import commandToText from "./Parser/commandToText"
import Icon from "./Icon"
import SelectionRect from "./SelectionRect"
import { downloadBlob } from "./helpers/downloadBlob"
import { rectIntersects } from "./helpers/rect"
import { rgbaString } from "./helpers/color"

import './App.css';

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

text "Hello World!"
fontSize 2
`

function cleanupText(text) {
  return text.replace(/[ \t]{2,}/g, "")
}

function ToolbarButton({ title, onClick, selected = false }) {
  return <div
    className={`button ${selected ? "selected" : ""}`}
    onClick={onClick}>{title}</div>
}

class App extends Component {
  constructor(props) {
    super(props)
    this.mouseHandler = new MouseHandler(
      t => this.addScript(t),
      t => this.previewScript(t),
      rect => this.getShapesInsideRect(rect),
      rect => this.setState({ selectionRect: rect }),
      mode => this.changeMouseMode(mode)
    )

    this.state = {
      scriptHistory: [defaultScript],
      undoHistory: [],
      tempScript: "",
      mouseMode: "default"
    }

    this.onKeyDown = this.onKeyDown.bind(this)
  }

  changeMouseMode(mode) {
    this.setState({ mouseMode: mode })
    this.mouseHandler.mode = mode
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
    const { tempScript, selectionRect } = this.state

    const script = currentScript + "\n" + tempScript
    const commands = parseCommands(script)
    const shapes = renderCommand(commands, mouseHandler)
    const selectedShape = shapes.filter(s => s.selected)[0]
    const selectedShapeSize = selectedShape && selectedShape.size
    const svgContent = shapes.map(s => s.render())

    const onChangeText = e => {
      this.setScript(e.target.value)
    }

    const onClickSave = () => {
      downloadBlob(this.currentScript, "noname.1d", "text/plain")
    }

    const onClickExport = () => {
      const { svgComponent } = this
      downloadBlob(svgComponent.outerHTML, "noname.svg", "image/svg+xml")
    }

    const onClickRect = () => {
      this.changeMouseMode("rect")
    }

    const onClickCircle = () => {
      this.changeMouseMode("circle")
    }

    const onClickLine = () => {
      this.changeMouseMode("line")
    }

    const onChangeFillColor = color => {
      this.previewScript(`fill ${rgbaString(color)}`)
    }

    const onChangeFillColorComplete = color => {
      this.addScript(`fill ${rgbaString(color)}`)
      this.previewScript("")
    }

    const onChangeStrokeColor = color => {
      this.previewScript(`stroke ${rgbaString(color)}`)
    }

    const onChangeStrokeColorComplete = color => {
      this.addScript(`stroke ${rgbaString(color)}`)
      this.previewScript("")
    }

    const onChangeLineWidth = e => {
      this.previewScript(`strokeWidth ${e.target.value}px`)
    }

    const onChangeLineWidthComplete = e => {
      this.addScript(`strokeWidth ${e.target.value}px`)
    }

    const onChangePositionX = e => {
      this.addScript(`translateTo ${e.target.value}px ${selectedShape.pos.y}px`)
    }

    const onChangePositionY = e => {
      this.addScript(`translateTo ${selectedShape.pos.x}px ${e.target.value}px`)
    }

    const onChangeSizeWidth = e => {
      this.addScript(`resize ${e.target.value}px ${selectedShapeSize.y}px`)
    }

    const onChangeSizeHeight = e => {
      this.addScript(`resize ${selectedShapeSize.y}px ${e.target.value}px`)
    }

    const onChangeRotation = e => {
      this.addScript(`rotateTo ${e.target.value}`)
    }

    const onFileOpen = e => {
      const reader = new FileReader()

      reader.onload = () => {
        const commands = svgToCommands(reader.result)
        this.addScriptLines(commands)
      }

      const file = e.target.files[0]
      reader.readAsText(file)
    }

    const onClickOptimize = () => {
      const optimized = commandToText(optimize(parseCommands(this.currentScript)))
      this.setScript(optimized)
    }

    const onClickAlignLeft = () => {
      this.addScript(`align left`)
    }

    const onClickAlignCenter = () => {
      this.addScript(`align center`)
    }

    const onClickAlignRight = () => {
      this.addScript(`align right`)
    }

    const onClickAlignTop = () => {
      this.addScript(`align top`)
    }

    const onClickAlignMiddle = () => {
      this.addScript(`align middle`)
    }

    const onClickAlignBottom = () => {
      this.addScript(`align bottom`)
    }

    const onClickDistX = () => {
      this.addScript(`dist x`)
    }

    const onClickDistY = () => {
      this.addScript(`dist y`)
    }

    return (
      <div className="App">
        <div className="toolbar">
          <ToolbarButton onClick={onClickSave} title="save" />
          <ToolbarButton onClick={onClickExport} title="export" />
          <label className="button">open
            <input style={{display: "none"}} type="file" onChange={onFileOpen} accept=".svg" />
          </label>
          <ToolbarButton onClick={onClickRect} title="rect" selected={this.state.mouseMode === "rect"} />
          <ToolbarButton onClick={onClickCircle} title="circle" selected={this.state.mouseMode === "circle"} />
          <ToolbarButton onClick={onClickLine} title="line" selected={this.state.mouseMode === "line"} />
          <ToolbarButton onClick={onClickOptimize} title="clean up" />
        </div>
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
              <div className="form">
                <div className="row buttons">
                  <Icon name="reorder-vertical" onClick={onClickDistX} />
                  <Icon name="reorder-horizontal" onClick={onClickDistY} />
                  <Icon name="format-horizontal-align-left" onClick={onClickAlignLeft} />
                  <Icon name="format-horizontal-align-center" onClick={onClickAlignCenter} />
                  <Icon name="format-horizontal-align-right" onClick={onClickAlignRight} />
                  <Icon name="format-vertical-align-top" onClick={onClickAlignTop} />
                  <Icon name="format-vertical-align-center" onClick={onClickAlignMiddle} />
                  <Icon name="format-vertical-align-bottom" onClick={onClickAlignBottom} />
                </div>
                <div className="separator" />
                <div className="row">
                  <label>size</label>
                  <div className="input-group">
                    <div className="named-input">
                      <input
                        type="number"
                        value={selectedShapeSize.x}
                        onChange={onChangeSizeWidth} />
                      <label>width</label>
                    </div>
                    <div className="named-input">
                      <input
                        type="number"
                        value={selectedShapeSize.y}
                        onChange={onChangeSizeHeight} />
                      <label>height</label>
                    </div>
                    </div>
                </div>
                <div className="row">
                  <label>position</label>
                  <div className="input-group">
                    <div className="named-input">
                      <input
                        type="number"
                        value={selectedShape.pos.x}
                        onChange={onChangePositionX} />
                      <label>x</label>
                    </div>
                    <div className="named-input">
                      <input
                        type="number"
                        value={selectedShape.pos.y}
                        onChange={onChangePositionY} />
                      <label>y</label>
                    </div>
                    </div>
                </div>
                <div className="row">
                  <label>transform</label>
                  <div className="input-group">
                    <div className="named-input">
                      <input
                        type="number"
                        value={selectedShape.rotation}
                        onChange={onChangeRotation} />
                      <label>rotate</label>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <label>fill</label>
                  <ColorButton
                    color={selectedShape.brush.fill}
                    onChange={onChangeFillColor}
                    onChangeComplete={onChangeFillColorComplete} />
                </div>
                <div className="row">
                  <label>stroke</label>
                  <ColorButton
                    color={selectedShape.brush.stroke}
                    onChange={onChangeStrokeColor}
                    onChangeComplete={onChangeStrokeColorComplete} />
                </div>
                <div className="row">
                  <label>line width</label>
                  <input
                    type="range"
                    min={0} max={10}
                    value={selectedShape.brush.strokeWidth || 0}
                    onInput={onChangeLineWidth}
                    onMouseUp={onChangeLineWidthComplete} />
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default App;
