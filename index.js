const { app, BrowserWindow} = require('electron')

let mainWindow

app.on('ready', () => {

    mainWindow = new BrowserWindow({
        width: 500,
        height: 800,
        resizable: false,
        titleBarOverlay: false
    })
    mainWindow.removeMenu()
    mainWindow.loadURL(`file://${__dirname}/index.html`)
})