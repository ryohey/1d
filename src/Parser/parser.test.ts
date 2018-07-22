import parse from "./parser"

it("parses single line", () => {
  const result = parse("foobar hoge fuga")
  expect(result.length).toEqual(1)
  const com = result[0]
  expect(com.action).toEqual("foobar")
  expect(com.options).toEqual(["hoge", "fuga"])
})

it("parses multiple lines", () => {
  const result = parse("foo 1 2\nbar 3 4")
  expect(result.length).toEqual(2)
  expect(result[0].action).toEqual("foo")
  expect(result[0].options).toEqual(["1", "2"])
  expect(result[0].lineNumber).toEqual(0)
  expect(result[1].action).toEqual("bar")
  expect(result[1].options).toEqual(["3", "4"])
  expect(result[1].lineNumber).toEqual(1)
})

it("parses target", () => {
  const result = parse("@foo bar")
  expect(result.length).toEqual(1)
  const com = result[0]
  expect(com.target).toEqual("foo")
  expect(com.action).toEqual("bar")
})

it("parses quoted string", () => {
  const result = parse(`foo "hoge fuga"`)
  expect(result.length).toEqual(1)
  const com = result[0]
  expect(com.action).toEqual("foo")
  // TODO: not to include quotation
  expect(com.options).toEqual(["\"hoge fuga\""])
})
