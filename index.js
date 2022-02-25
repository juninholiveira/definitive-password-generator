const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const ipc = ipcMain;

let mainWindow

app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

//Quit when all windows are closed.
app.on('window-all-closed', () => {
    //On macOS it is common for applications and their menu bar
    //to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    //On macOS it's common to re-create a window in the app when the
    //dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow();
});

function createWindow()
{
    mainWindow = new BrowserWindow({
        width: 500,
        height: 800,
        backgroundColor: "#FFF",
        icon:'./src/icons/png/128x128.png',
        frame: false,
        resizable: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    ipc.on("closeApp", () => {
        mainWindow.close();
    });

    ipc.on("minApp", () => {
        mainWindow.minimize();
    });

    ipc.on("maxApp", () => {
        if(mainWindow.isMaximized()) {
            mainWindow.webContents.send("changeIr");
            mainWindow.restore();
        } else {
            mainWindow.webContents.send("changeImx");
            mainWindow.maximize();
        }
    });

    mainWindow.loadURL(`file://${__dirname}/index.html`)

    //Emitted when the window is closed.
    mainWindow.on('closed', () => {
        //Dereference the window object, usually you would store windows
        //in an array if your app supports multi windows, this is the time
        //when you should delete the corresponding element.
        mainWindow = null;
    });
}