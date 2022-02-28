const { ipcRenderer, shell, contextBridge } = require("electron")
const path = require("path")
const jsonStorage = require("electron-json-storage")
const getAppDataPath = require("appdata-path")

//const defaultAppDataPath = app.getAppPath

contextBridge.exposeInMainWorld("myAPI", {
	//Used to open links in the default browser
	getShell: () => {
		return shell
	},
	//Used on the titlebar controls to minimize and close the app
	getIpcRenderer: () => {
		return ipcRenderer
	},
	getJsonStorage: () => {
		return jsonStorage
	},
	getPath: () => {
		return getAppDataPath("Definitive Password Generator")
	}

})

