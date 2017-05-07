import React, { Component } from 'react';
import _ from "lodash"
import renderCommand from "./Parser/renderCommand"
import parseCommands from "./Parser/parser"
import optimize from "./Parser/optimize"
import MouseHandler from "./MouseHandler"
import ColorButton from "./ColorButton"
import svgToCommands from "./helpers/svgToCommands"
import commandToText from "./Parser/commandToText"
import Icon from "./Icon"

import './App.css';

const defaultScript = `
translate 1 0
translate 1 1
translate 10 10
`

const testSvg = `
<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2000/CR-SVG-20001102/DTD/svg-20001102.dtd">
<svg xml:space="default" width="300" height="200">
<text x="10" y="30" font-size="15pt">
1d test svg file content
newline
</text>
<circle cx="150" cy="120" r="60" fill="white" stroke="red" stroke-width="5"/>
<ellipse cx="150" cy="120" rx="80" ry="30" fill="lightblue" stroke="green" stroke-width="5"/>
<text x="10" y="30" font-size="15pt">
1d test svg file content
newline
</text>
</svg>
`

function cleanupText(text) {
  return text.replace(/[ \t]{2,}/g, "")
}

class App extends Component {
  constructor(props) {
    super(props)
    this.mouseHandler = new MouseHandler(
      t => this.addScript(t),
      t => this.previewScript(t)
    )

    this.state = {
      scriptText: defaultScript + "\n" + svgToCommands(testSvg).join("\n"),
      tempScript: ""
    }

    this.onKeyDown = this.onKeyDown.bind(this)
  }

  previewScript(line) {
    this.setState({
      tempScript: cleanupText(line)
    })
  }

  addScript(line) {
    this.setState({
      scriptText: this.state.scriptText + "\n" + cleanupText(line)
    })
  }

  addScriptLines(lines) {
    this.setState({
      scriptText: this.state.scriptText + "\n" + lines.join("\n")
    })
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
      default: break
    }
  }

  render() {
    const { mouseHandler } = this
    const { scriptText, tempScript } = this.state

    const script = scriptText + "\n" + tempScript
    const commands = parseCommands(script)
    const shapes = renderCommand(commands, mouseHandler)
    const selectedShape = shapes.filter(s => s.selected)[0]
    const selectedShapeSize = selectedShape && selectedShape.size
    const svgContent = shapes.map(s => s.render())

    const onChangeText = e => {
      const scriptText = e.target.value
      this.setState({ scriptText })
    }

    const onClickRect = () => {
      this.addScript(`
        rect 30px 30px
        fill white
        stroke gray
      `)
    }

    const onClickCircle = () => {
      this.addScript(`
        circle 30px 30px
        fill white
        stroke gray
      `)
    }

    const onChangeFillColor = color => {
      this.previewScript(`fill ${color}`)
    }

    const onChangeFillColorComplete = color => {
      this.addScript(`fill ${color}`)
      this.previewScript("")
    }

    const onChangeStrokeColor = color => {
      this.previewScript(`stroke ${color}`)
    }

    const onChangeStrokeColorComplete = color => {
      this.addScript(`stroke ${color}`)
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
      const { scriptText } = this.state
      const optimized = commandToText(optimize(parseCommands(scriptText)))
      this.setState({
        scriptText: optimized
      })
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

    return (
      <div className="App">
        <div className="toolbar">
          <label className="button">open
            <input style={{display: "none"}} type="file" onChange={onFileOpen} accept=".svg" />
          </label>
          <div className="button" onClick={onClickRect}>rect</div>
          <div className="button" onClick={onClickCircle}>circle</div>
          <div className="button" onClick={onClickOptimize}>clean up</div>
        </div>
        <div className="content">
          <div className="alpha">
            <textarea value={scriptText} onChange={onChangeText} />
            <div className="tempScript">{tempScript}</div>
          </div>
          <div className="beta">
            <svg id="svg"
              tabIndex="0"
              onKeyDown={this.onKeyDown}
              onMouseDown={e => mouseHandler.onMouseDownStage(e)}>
              {svgContent}
            </svg>
          </div>
          <div className="gamma">
            {selectedShape &&
              <div className="form">
                <div className="row buttons">
                  <div className="button" onClick={onClickAlignLeft}><Icon name="format-horizontal-align-left" /></div>
                  <div className="button" onClick={onClickAlignCenter}><Icon name="format-horizontal-align-center" /></div>
                  <div className="button" onClick={onClickAlignRight}><Icon name="format-horizontal-align-right" /></div>
                  <div className="button" onClick={onClickAlignTop}><Icon name="format-vertical-align-top" /></div>
                  <div className="button" onClick={onClickAlignMiddle}><Icon name="format-vertical-align-center" /></div>
                  <div className="button" onClick={onClickAlignBottom}><Icon name="format-vertical-align-bottom" /></div>
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
