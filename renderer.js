const remote = require('electron').remote
const main = remote.require('./main.js')

var button = document.createElement('button')
button.textContent = 'Download File'
button.id = 'btnDownload'
button.className += "btn btn-success"
button.addEventListener('click', () => {
  main.downloadFiles()
}, false)
document.getElementById('downloadFile').appendChild(button)
