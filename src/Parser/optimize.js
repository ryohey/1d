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
        // 値を加算
        prev.options[0] = `${parseFloat(prev.options[0]) + parseFloat(c.options[0])}`
        prev.options[1] = `${parseFloat(prev.options[1]) + parseFloat(c.options[1])}`
        optimized = true
      }

      if (c.action === "translateTo") {
        // 後の値で上書き
        prev.options[0] = c.options[0]
        prev.options[1] = c.options[1]
        optimized = true
      }

      if (c.action === "rotate") {
        // 値を加算
        prev.options[0] = `${parseFloat(prev.options[0]) + parseFloat(c.options[0])}`
        optimized = true
      }

      if (c.action === "rotateTo") {
        // 後の値で上書き
        prev.options[0] = c.options[0]
        optimized = true
      }

      if (c.action === "select1") {
        // 後の値で上書き
        prev.options[0] = c.options[0]
        optimized = true
      }

      if (c.action === "fill") {
        // 後の値で上書き
        prev.options[0] = c.options[0]
        optimized = true
      }

      if (c.action === "stroke") {
        // 後の値で上書き
        prev.options[0] = c.options[0]
        optimized = true
      }

      if (c.action === "resize"
          && c.options[2] === prev.options[2]
          && c.options[3] === prev.options[3]) {
        // 後の値で上書き
        prev.options[0] = c.options[0]
        prev.options[1] = c.options[1]
        optimized = true
      }

      if (c.action === "deselectAll") {
        // 削除
        optimized = true
      }

      if (c.action === "align" && c.options[0] === prev.options[0]) {
        // 削除
        optimized = true
      }

      if (c.action === "strokeWidth") {
        // 後の値で上書き
        prev.options[0] = c.options[0]
        optimized = true
      }
    }

    if (c.action === "deselectAll" && (prev.action === "select" || prev.action === "select1")) {
      // 選択後に選択解除していたら選択を削除する
      prev = c
      optimized = true
    }

    if (c.action === "translateTo" && prev.action === "translate") {
      prev = c
      optimized = true
    }

    if (c.action === "rotateTo" && prev.action === "rotate") {
      prev = c
      optimized = true
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
