import React, { Component } from 'react';
import _ from "lodash"
import renderCommand from "./helpers/renderCommand"
import MouseHandler from "./MouseHandler"

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

class App extends Component {
  constructor(props) {
    super(props)
    this.mouseHandler = new MouseHandler(this)
    this.state = {
      scriptText: defaultScript,
      tempScript: ""
    }
  }
  render() {
    const onChangeText = e => {
      const scriptText = e.target.value
      this.setState({ scriptText })
    }
    const { mouseHandler } = this
    const { scriptText, tempScript } = this.state

    const svgContent = renderCommand(scriptText + "\n" + tempScript, mouseHandler)
    return (
      <div className="App">
        <div>
          <textarea value={scriptText} onChange={onChangeText} />
          <div className="tempScript">{tempScript}</div>
        </div>
        <div>
          <svg id="svg"
            onMouseUp={e => mouseHandler.onMouseUp(e)}
            onMouseMove={e => mouseHandler.onMouseMove(e)}>
            {svgContent}
          </svg>
        </div>
      </div>
    )
  }
}

export default App;
