function wrapQuote(text) {
  if (text.match(" ")) {
    return `"${text}"`
  }
  return text
}

function flatJoin(arr, sep) {
  return arr.filter(x => x).join(sep)
}

export default function commandToText(commands) {
  return commands.map(c => flatJoin([c.target && `@${c.target}`, c.action, ...c.options.map(wrapQuote)], " ")).join("\n")
}
