import optimize from "./optimize"

it("merges translate", () => {
  const commands = [
    {
      action: "translate",
      options: [1, 3]
    },
    {
      action: "translate",
      options: [5, 7]
    }
  ]
  const result = optimize(commands)
  expect(result.length).toEqual(1)
  expect(result[0].action).toEqual("translate")
  expect(result[0].options[0]).toEqual("6")
  expect(result[0].options[1]).toEqual("10")
})
