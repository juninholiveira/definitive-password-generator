//Gets the exposed shell in the preload.js
const shell = window.myAPI.getShell()

//create the events when the actions are performed in the menu
const menuButton = document.querySelector("#menu")
const buycoffeeButton = document.querySelector("#menu-grid-buycoffee")
const githubButton = document.querySelector("#menu-grid-github")

//Activate and deactive the menuButton
menuButton.addEventListener("click", () => {
	menuButton.classList.toggle("active")
})

buycoffeeButton.addEventListener("click", () => {
	shell.openExternal("https://www.buymeacoffee.com/leandrojunior")
})

githubButton.addEventListener("click", () => {
	shell.openExternal("https://github.com/juninholiveira")
})
