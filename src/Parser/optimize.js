/**
  連続するコマンドをまとめる
*/
export default optimize(commands) {
  let prev
  const result = []

  commands.forEach((c, i) => {
    let optimized = false

    // 連続していたら前回のコマンドとマージ
    if (c.target === prev.target
        && c.action === prev.action) {
      if (c.action === "translate") {
        prev.options[0] = parseFloat(prev.options[0]) + parseFloat(c.options[0])
        prev.options[1] = parseFloat(prev.options[1]) + parseFloat(c.options[1])
        optimized = true
      }
    }

    // 連続していなかったらコマンドをそのまま追加
    if (!optimized) {
      result.push(prev)
      prev = c
    }
  })

  return result
}
