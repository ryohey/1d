const MARK = String.fromCharCode(0)

export default function shlex(str) {
  const quotedWords = []
  const words = str.replace(/"(.+?)"/, (_, word) => {
    quotedWords.push(word)
    return MARK
  }).split(" ")

  return words.map(word => {
    if (word === MARK) {
      const head = quotedWords[0]
      quotedWords.splice(1)
      return head
    }
    return word
  })
}
