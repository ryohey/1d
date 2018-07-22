export function download(url, name = "noname") {
  var a = document.createElement("a")
  a.href = url
  a.setAttribute("download", name)
  a.setAttribute("style", "display: none;")
  document.body.appendChild(a)
  a.click()
  a.remove()
}

// http://stackoverflow.com/a/33622881/1567777
export function downloadBlob(data, fileName, mimeType) {
  var blob, url
  blob = new Blob([data], {
    type: mimeType
  })
  url = window.URL.createObjectURL(blob)
  download(url, fileName)
  setTimeout(() => {
    return window.URL.revokeObjectURL(url)
  }, 1000)
}
