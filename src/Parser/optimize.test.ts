import optimize from "./optimize"
import { ICommand } from "./ICommand"

it("merges translate", () => {
  const commands: ICommand[] = [
    {
      action: "translate",
      options: ["1", "3"],
      target: null,
      lineNumber: 0
    },
    {
      action: "translate",
      options: ["5", "7"],
      target: null,
      lineNumber: 1
    }
  ]
  const result = optimize(commands)
  expect(result.length).toEqual(1)
  expect(result[0].action).toEqual("translate")
  expect(result[0].options[0]).toEqual("6")
  expect(result[0].options[1]).toEqual("10")
})

it("reduces translateTo", () => {
  const commands = [
    {
      action: "translateTo",
      options: ["1", "3"],
      target: null,
      lineNumber: 0
    },
    {
      action: "translateTo",
      options: ["5", "7"],
      target: null,
      lineNumber: 1
    }
  ]
  const result = optimize(commands)
  expect(result.length).toEqual(1)
  expect(result[0].action).toEqual("translateTo")
  expect(result[0].options[0]).toEqual("5")
  expect(result[0].options[1]).toEqual("7")
})

it("reduces deselect", () => {
  const commands = [
    {
      action: "deselect",
      options: ["aaa"],
      target: null,
      lineNumber: 0
    },
    {
      action: "deselect",
      options: ["aaa"],
      target: null,
      lineNumber: 1
    }
  ]
  const result = optimize(commands)
  expect(result.length).toEqual(1)
  expect(result[0].action).toEqual("deselect")
  expect(result[0].options[0]).toEqual("aaa")
})

it("reduces fill", () => {
  const commands = [
    {
      action: "fill",
      options: ["red"],
      target: null,
      lineNumber: 0
    },
    {
      action: "fill",
      options: ["blue"],
      target: null,
      lineNumber: 1
    }
  ]
  const result = optimize(commands)
  expect(result.length).toEqual(1)
  expect(result[0].action).toEqual("fill")
  expect(result[0].options[0]).toEqual("blue")
})

it("reduces stroke", () => {
  const commands = [
    {
      action: "stroke",
      options: ["red"],
      target: null,
      lineNumber: 0
    },
    {
      action: "stroke",
      options: ["blue"],
      target: null,
      lineNumber: 1
    }
  ]
  const result = optimize(commands)
  expect(result.length).toEqual(1)
  expect(result[0].action).toEqual("stroke")
  expect(result[0].options[0]).toEqual("blue")
})

it("reduces resize", () => {
  const commands = [
    {
      action: "resize",
      options: ["11px", "44px"],
      target: null,
      lineNumber: 0
    },
    {
      action: "resize",
      options: ["4px", "6px"],
      target: null,
      lineNumber: 1
    }
  ]
  const result = optimize(commands)
  expect(result.length).toEqual(1)
  expect(result[0].action).toEqual("resize")
  expect(result[0].options[0]).toEqual("4px")
  expect(result[0].options[1]).toEqual("6px")
})

it("removes deselectAll", () => {
  const commands = [
    {
      action: "deselectAll",
      options: [],
      target: null,
      lineNumber: 0
    },
    {
      action: "deselectAll",
      options: [],
      target: null,
      lineNumber: 1
    }
  ]
  const result = optimize(commands)
  expect(result.length).toEqual(1)
  expect(result[0].action).toEqual("deselectAll")
})
