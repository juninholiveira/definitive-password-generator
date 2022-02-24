const { app, BrowserWindow} = require('electron')

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
        resizable: false,
        titleBarOverlay: false
    })
    mainWindow.removeMenu()
    mainWindow.loadURL(`file://${__dirname}/index.html`)
}