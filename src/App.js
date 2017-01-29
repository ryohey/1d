import React, { Component } from 'react';
import _ from "lodash"
import renderCommand from "./helpers/renderCommand"
import MouseHandler from "./MouseHandler"
import ColorButton from "./ColorButton"

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
`

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

    const shapes = renderCommand(scriptText + "\n" + tempScript, mouseHandler)
    const selectedShape = shapes.filter(s => s.selected)[0]
    const svgContent = shapes.map(s => s.render())

    return (
      <div className="App">
        <div className="toolbar">
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
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default App;
