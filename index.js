const { app, BrowserWindow} = require('electron')
const path = require('path')

let mainWindow

app.whenReady().then(() => {

    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

function createWindow()
{
    mainWindow = new BrowserWindow({
        width: 500,
        height: 800,
        resizable: true,
        titleBarOverlay: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    //mainWindow.removeMenu()
    mainWindow.loadURL(`file://${__dirname}/index.html`)
}