import React, { Component } from 'react';
import _ from "lodash"
import renderCommand from "./helpers/renderCommand"

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
    this.state = {
      scriptText: defaultScript,
    }
  }
  render() {
    const onChangeText = e => {
      const scriptText = e.target.value
      this.setState({ scriptText })
    }
    const { scriptText } = this.state

    const addScript = (line) => {
      this.setState({
        scriptText: scriptText + "\n" + line
      })
    }

    const mouseHandler = {
      onMouseOver: (e, shape) => {
        console.log("onMouseOver", e, shape)
      },
      onMouseUp: (e, shape) => {
        console.log("onMouseUp", e, shape)
        addScript(`@${shape.name || shape.id} translate 1 5`)
      },
      onMouseDown: (e, shape) => {
        console.log("onMouseDown", e, shape)
      },
      onMouseMove: (e, shape) => {
        console.log("onMouseMove", e, shape)
      },
    }
    const svgContent = renderCommand(scriptText, mouseHandler)
    return (
      <div className="App">
        <div>
          <textarea value={scriptText} onChange={onChangeText} />
        </div>
        <div>
          <svg id="svg">{svgContent}</svg>
        </div>
      </div>
    )
  }
}

export default App;
