//Gets the exposed ipcRenderer in the preload.js
const ipc = window.myAPI.getIpcRenderer()

//Gets the custom buttons on the titlebar
const close = document.getElementById("close-button")
const min = document.getElementById("min-button")

//The X on the titlebar will only hide the mainWindow.
close.addEventListener("click", () => {
	ipc.send("hideApp")
})

//Minimize app to taskbar
min.addEventListener("click", () => {
	ipc.send("minApp")
})
