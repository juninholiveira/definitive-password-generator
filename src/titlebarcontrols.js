//Gets the exposed ipcRenderer in the preload.js
const ipc = window.myAPI.getIpcRenderer()

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
