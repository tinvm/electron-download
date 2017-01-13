const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const http = require('http')
const request = require('request')
const fs = require('fs')
const child = require('child_process').execFile;
if (process.platform !== 'darwin') {
  var urlDownload = "http://app2.live2d.com/cubism/editor/bqp3eojv66q8oi4/Live2D_Cubism_Setup_2.1.16_1.pkg"
  var executablePath = __dirname+"/install.pkg"
} else {
  var urlDownload = "http://app2.live2d.com/cubism/editor/bqp3eojv66q8oi4/Live2D_Cubism_Setup_2.1.16_1_jp.exe"
  var executablePath = __dirname+"/install.exe"
}


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

exports.downloadFiles = () => {
  downloadFile(urlDownload, executablePath)
}

function downloadFile(file_url , targetPath){
    // Save variable to know progress
    var received_bytes = 0
    var total_bytes = 0

    var req = request({
        method: 'GET',
        uri: file_url
    })

    var out = fs.createWriteStream(targetPath)
    req.pipe(out)

    req.on('response', function ( data ) {
        // Change the total bytes value to get progress later.
        total_bytes = parseInt(data.headers['content-length' ])
    })

    req.on('data', function(chunk) {
        // Update the received bytes
        received_bytes += chunk.length

        showProgress(received_bytes, total_bytes)
    })

    req.on('end', function() {
      fs.readFile(executablePath, 'utf8', function (err, data) {
        if (err) return console.log(err);
      });
    })
}

function showProgress(received,total){
    var percentage = (received * 100) / total;
    console.log(percentage + "% | " + received + " bytes out of " + total + " bytes.");
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
