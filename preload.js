const { ipcRenderer, shell, contextBridge } = require("electron")
const jsonStorage = require("electron-json-storage")
const getAppDataPath = require("appdata-path")

contextBridge.exposeInMainWorld("myAPI", {
	//Used to open links in the default browser
	getShell: () => {
		return shell
	},
	//Used on the titlebar controls to minimize and close the app
	getIpcRenderer: () => {
		return ipcRenderer
	},
	onQuickGeneration: (fn) => {
		ipcRenderer.on("quickGeneration", () => fn())
	},
	//Used to save to JSON the current parameters
	getJsonStorage: () => {
		return jsonStorage
	},
	//Used to get the AppData/Roaming folder on Windows
	getPath: () => {
		return getAppDataPath("Definitive Password Generator")
	}
})