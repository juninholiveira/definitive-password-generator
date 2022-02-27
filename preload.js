const { ipcRenderer, shell, contextBridge } = require("electron")

contextBridge.exposeInMainWorld("myAPI", {
	//Used to open links in the default browser
	getShell: () => {
		return shell
	},
	//Used on the titlebar controls to minimize and close the app
	getIpcRenderer: () => {
		return ipcRenderer
	}
})