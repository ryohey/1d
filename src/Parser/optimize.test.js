import optimize from "./optimize"

it("merges translate", () => {
  const commands = [
    {
      action: "translate",
      options: ["1", "3"]
    },
    {
      action: "translate",
      options: ["5", "7"]
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
      options: ["1", "3"]
    },
    {
      action: "translateTo",
      options: ["5", "7"]
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
      options: ["aaa"]
    },
    {
      action: "deselect",
      options: ["aaa"]
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
      options: ["red"]
    },
    {
      action: "fill",
      options: ["blue"]
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
      options: ["red"]
    },
    {
      action: "stroke",
      options: ["blue"]
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
      options: ["11px", "44px"]
    },
    {
      action: "resize",
      options: ["4px", "6px"]
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
      action: "deselectAll"
    },
    {
      action: "deselectAll"
    }
  ]
  const result = optimize(commands)
  expect(result.length).toEqual(1)
  expect(result[0].action).toEqual("deselectAll")
})
