function wrapQuote(text) {
  if (text.match(" ")) {
    return `"${text}"`
  }
  return text
}

function flatJoin(arr, sep) {
  return arr.filter(x => x).join(sep)
}

function restoreComment(action) {
  if (action === "comment") {
    return null
  }
  return action
}

export default function commandToText(commands) {
  return commands
    .map(c => flatJoin([
      c.target && `@${c.target}`,
      restoreComment(c.action),
      ...c.options.map(wrapQuote)
    ], " "))
    .join("\n")
}
