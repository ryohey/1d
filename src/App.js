import React, { Component } from 'react';
import _ from "lodash"
import renderCommand from "./helpers/renderCommand"
import MouseHandler from "./MouseHandler"
import ColorButton from "./ColorButton"
import svgToCommands from "./helpers/svgToCommands"

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

select tri
copy
stroke red

move 0 5
@rect copy
stroke green

translate -12 1
@rect resize 50px 10px
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
</svg>
`

function cleanupText(text) {
  return text.replace(/[ \t]{2,}/g, "")
}

class App extends Component {
  constructor(props) {
    super(props)
    this.mouseHandler = new MouseHandler(this)

    this.state = {
      scriptText: defaultScript + "\n" + svgToCommands(testSvg).join("\n"),
      tempScript: ""
    }
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

  render() {
    const { mouseHandler } = this
    const { scriptText, tempScript } = this.state

    const shapes = renderCommand(scriptText + "\n" + tempScript, mouseHandler)
    const selectedShape = shapes.filter(s => s.selected)[0]
    const selectedShapeSize = selectedShape && selectedShape.size()
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
        svgToCommands(reader.result).forEach(c =>
          this.addScript(c)
        )
      }

      const file = e.target.files[0]
      reader.readAsText(file)
    }

    return (
      <div className="App">
        <div className="toolbar">
          <label className="button">open
            <input style={{display: "none"}} type="file" onChange={onFileOpen} accept=".svg" />
          </label>
          <div className="button" onClick={onClickRect}>rect</div>
          <div className="button" onClick={onClickCircle}>circle</div>
        </div>
        <div className="content">
          <div className="alpha">
            <textarea value={scriptText} onChange={onChangeText} />
            <div className="tempScript">{tempScript}</div>
          </div>
          <div className="beta">
            <svg id="svg"
              onMouseUp={e => mouseHandler.onMouseUp(e)}
              onMouseMove={e => mouseHandler.onMouseMove(e)}>
              {svgContent}
            </svg>
          </div>
          <div className="gamma">
            {selectedShape &&
              <div className="form">
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
