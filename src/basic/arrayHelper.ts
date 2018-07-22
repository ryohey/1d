import _ from "lodash"

type ReduceFunc = (values: number[]) => number

const arrayFunc = (
  func: (values: number[]) => number | undefined
): ReduceFunc => values => {
  if (values.length === 0) {
    throw new Error("empty values")
  }
  const m = func(values)
  if (m === undefined) {
    throw new Error("gets undefined")
  }
  return m
}

export const strictMin = arrayFunc(_.min)
export const strictMax = arrayFunc(_.max)
