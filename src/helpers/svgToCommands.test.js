import svgToCommands from "./svgToCommands"

function createSvgText(content) {
 return `
<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2000/CR-SVG-20001102/DTD/svg-20001102.dtd">
<svg xml:space="default" width="300" height="200">
${content}
</svg>
`
}

it("parses circle", () => {
  const commands = svgToCommands(createSvgText(`<circle cx="150" cy="120" r="60" fill="white" stroke="red" stroke-width="5"/>`))
  expect(commands.length).toEqual(5)
  expect(commands[0]).toEqual("moveTo 150 120")
  expect(commands[1]).toEqual("circle 60")
  expect(commands[2]).toEqual("fill white")
  expect(commands[3]).toEqual("stroke red")
  expect(commands[4]).toEqual("strokeWidth 5")
})

it("parses ellipse", () => {
  const commands = svgToCommands(createSvgText(`<ellipse cx="150" cy="120" rx="80" ry="30" fill="lightblue" stroke="green" stroke-width="5"/>`))
  expect(commands[0]).toEqual("moveTo 150 120")
  expect(commands[1]).toEqual("circle 80 30")
  expect(commands[2]).toEqual("fill lightblue")
  expect(commands[3]).toEqual("stroke green")
  expect(commands[4]).toEqual("strokeWidth 5")
})

it("parses text", () => {
  const commands = svgToCommands(createSvgText(`<text x="10" y="30" font-size="15pt">1d test svg file content\nnewline</text>`))
  expect(commands.length).toEqual(3)
  expect(commands[0]).toEqual("moveTo 10 30")
  expect(commands[1]).toEqual("text \"1d test svg file content\\nnewline\"")
  expect(commands[2]).toEqual("fontSize 15pt")
})
