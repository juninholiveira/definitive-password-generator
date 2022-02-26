const { ipcRenderer } = require("electron")
const ipc = ipcRenderer
const close = document.getElementById("close-button")
const min = document.getElementById("min-button")

//Close app here
close.addEventListener("click", () => {
	ipc.send("closeApp")
})

//Minimize app here //
min.addEventListener("click", () => {
	ipc.send("minApp")
})
