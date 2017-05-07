/**
  連続するコマンドをまとめる
*/
export default function optimize(commands) {
  let prev
  const result = []

  commands.forEach((c, i) => {
    if (i === 0) {
      prev = c
      return
    }

    let optimized = false

    // 連続していたら前回のコマンドとマージ
    if (prev
        && c.target === prev.target
        && c.action === prev.action) {
      if (c.action === "translate") {
        prev.options[0] = `${parseFloat(prev.options[0]) + parseFloat(c.options[0])}`
        prev.options[1] = `${parseFloat(prev.options[1]) + parseFloat(c.options[1])}`
        optimized = true
      }
    }

    // 連続していなかったらコマンドをそのまま追加
    if (!optimized) {
      result.push(prev)
      prev = c
    }

    // 最後なら prev を追加して終了
    if (i === commands.length - 1) {
      result.push(prev)
    }
  })

  return result
}
