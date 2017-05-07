export default function commandToText(commands) {
  return commands.map(c => `${c.target ? `@${c.target} ` : ""}${c.action} ${c.options.join(" ")}`).join("\n")
}
