import React, { Component } from 'react';
import _ from "lodash"
import renderCommand from "./helpers/renderCommand"
import MouseHandler from "./MouseHandler"
import ColorButton from "./ColorButton"
import SVG from "svg.js"
import svgPathParser from "svg-path-parser"

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

select tri
copy
stroke red

move 0 5
@rect copy
stroke green

translate -12 1
@rect resize 50px 10px
`

function walkElements(element, callback) {
  for (let e of element.children) {
    walkElements(e, callback)
  }
  callback(element)
}

function cleanupText(text) {
  return text.replace(/[ \t]{2,}/g, "")
}

class App extends Component {
  constructor(props) {
    super(props)
    this.mouseHandler = new MouseHandler(this)
    this.state = {
      scriptText: defaultScript,
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

    const onFileOpen = e => {
      const reader = new FileReader()

      reader.onload = () => {
        const canvas = document.createElement("canvas")
        const draw = SVG(canvas)
        draw.svg(reader.result)
        walkElements(draw.node, e => {
          if (e.nodeName === "path") {
            const path = svgPathParser(e.attributes.d.value)
            console.log(path)
            const commands = _.flatMap(path, p => {
              switch (p.command) {
              case "moveto":
                return `moveTo ${p.x} ${p.y}`
              case "lineto":
                return `lineTo ${p.x} ${p.y}`
              case "curveto":
              case "closepath":
                return `fill ${e.parentNode.fill || "none"}`
              default:
                return null
              }
            })
            commands.forEach(c =>
              this.addScript(c)
            )
            // TODO: このパスを使って PathShape を作るコマンドを追加する
          }
        })
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
                  <label>position</label>
                  <div className="input-group">
                    <div className="named-input">
                      <label>x</label>
                      <input
                        type="number"
                        value={selectedShape.pos.x}
                        onChange={onChangePositionX} />
                    </div>
                    <div className="named-input">
                      <label>y</label>
                      <input
                        type="number"
                        value={selectedShape.pos.y}
                        onChange={onChangePositionY} />
                    </div>
                    </div>
                </div>
                <div className="row">
                  <label>fill</label>
                  <ColorButton
                    color={selectedShape.brush.fill}
                    onChange={onChangeFillColor}
                    onChangeComplete={onChangeFillColorComplete}  />
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
