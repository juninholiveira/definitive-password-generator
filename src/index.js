const { app, Tray, Menu, nativeImage, ipcMain } = require("electron")
const path = require("path")
const ipc = ipcMain
const { BrowserWindow } = require("electron-acrylic-window")

let mainWindow
let tray
let isQuiting
let icon

app.whenReady().then(() => {
	createWindow()
	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
	createTray()
})

app.on("activate", () => {
	//On macOS it's common to re-create a window in the app when the
	//dock icon is clicked and there are no other windows open.
	if (mainWindow === null) createWindow()
})

app.on("before-quit", function () {
	isQuiting = true
})

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 500,
		height: 800,
		backgroundColor: "#FFF",
		icon: "././build/icon.png",
		frame: false,

		//Bug causing the mainWindow to not have rounded corners in case Resizable is false
		resizable: true,
		minWidth: 500,
		maxWidth: 500,
		minHeight: 800,
		maxHeight: 800,

		//Stops F11 from working and putting the windows in the top-left corner
		fullscreen: false,
		fullscreenable: false,

		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			preload: path.join(__dirname, "preload.js"),
		},
	})

	//This event will hide the app, and not close it for good (to close it you need to right-click on tray and Quit)
	ipc.on("hideApp", (event) => {
		event.preventDefault()
		mainWindow.hide()
	})

	//This event will minimize the MainWindow to the tasbar
	ipc.on("minApp", () => {
		mainWindow.minimize()
	})

	//Loads the index.html page on the mainWindow, which is the main page of this app
	mainWindow.loadURL(`file://${__dirname}/index.html`)
}

function createTray() {
	//Gets the icon to use in the tray
	icon = nativeImage.createFromPath(path.join(__dirname, "icons", "32x32.png"))

	//Creates the tray
	tray = new Tray(icon)

	//Creates the context menu
	const contextMenu = Menu.buildFromTemplate([
		{
			label: "Generate and Copy Password",
			type: "normal",
			click: () => {
				mainWindow.webContents.send("quickGeneration")
			},
		},
		{ type: "separator" },
		{
			label: "Quit",
			type: "normal",
			click: () => {
				if (!isQuiting) app.quit()
			},
		},
	])

	//Adds the newly created ContextMenu to the tray
	tray.setContextMenu(contextMenu)

	tray.setToolTip("Definitive Password Generator")
	tray.setTitle("Definitive Password Generator") //MacOS

	//When the icon on tray is clicked, opens the mainWindow again
	tray.on("click", () => {
		mainWindow.show()
	})
}
