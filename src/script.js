const jsonStorage = window.myAPI.getJsonStorage()
const path = window.myAPI.getPath()
jsonStorage.setDataPath(path)

//HTML elements gathered from the DOM
const amountInput = document.querySelector("#input-amount")
const passSafetyText = document.querySelector("#pass-safety")
const includeSymbolsToggle = document.querySelector("#input-symbols")
const includeNumbersToggle = document.querySelector("#input-numbers")
const includeUppercaseToggle = document.querySelector("#input-uppercase")
const includeLowercaseToggle = document.querySelector("#input-lowercase")
const excludeSimilarToggle = document.querySelector("#input-exclude-similar")
const excludeAmbiguousToggle = document.querySelector("#input-exclude-ambiguous")
const generateButton = document.querySelector("#button-generate")
const copyButton = document.querySelector("#button-copy")
const resultTextarea = document.querySelector("#textarea-result")

//Characters
const originalSymbols = "`~!@#$%^&*()-_=+[{]}\\;:',<.>/?"
const originalNumbers = "1234567890"
const originalUppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const originalLowercase = "abcdefghijklmnopqrstuvwxyz"
const similar = ["i", "l", "1", "L", "o", "O", "0"]
const ambiguous = ["[","]","{","}","(",")","/","\\","'","\"","`","~",",",";",":",".","<",">",]
let symbols = "`~!@#$%^&*()-_=+[{]}\\;:',<.>/?"
let numbers = "1234567890"
let lettersUppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
let lettersLowercase = "abcdefghijklmnopqrstuvwxyz"
let completeCharset

//The generated pass
let password

//Colors and text for the pass safety
const passWeakText = "WEAK"
const passWeakColor = "rgb(255, 51, 0)"
const passWeakNumber = 7
const passMediumText = "MEDIUM"
const passMediumColor = "rgb(255, 115, 0)"
const passMediumNumber = 15
const passStrongText = "STRONG"
const passStrongColor = "rgb(128, 255, 0)"
const passStrongNumber = 23
const passVeryStrongText = "VERY STRONG"
const passVeryStrongColor = "rgb(0, 255, 238)"
const passVeryStrongNumber = 63
const passOverkillText = "OK, THIS IS GETTING OUT OF CONTROL"
const passOverkillColor = "rgb(255, 56, 202)"
const passOverkillNumber = 2047
const passMaximumText = "STORING NUCLEAR CODES, I SEE..."
const passMaximumColor = "rgb(0,0,0)"

//Variables that will store the parameters to be used directly by the Generate algorithm
let amount
let includeSymbols
let includeNumbers
let includeUppercase
let includeLowercase
let excludeSimilar
let excludeAmbiguous
let chosenCategories

initialSetup()

//Sets the input and checkboxes of the interface with the default values
function initialSetup() {

	//Amount
	amountInput.value = 16
	passSafetyText.innerText = "STRONG"
	jsonStorage.get("dpgLocalStorageAmount", function (error, data){
		if (error) throw error
		if (data) {
			let i = data.amount
			if(i != undefined) amountInput.value = i
			else amountInput.value = 16
			changePassSafetyText()
		}
	})
	
	//Include Symbols
	includeSymbolsToggle.checked = true
	jsonStorage.get("dpgLocalStorageIncludeSymbols", function (error, data){
		if (error) throw error
		if (data) {
			let i = data.includeSymbols
			if(i != undefined) includeSymbolsToggle.checked = i
			else includeSymbolsToggle.checked = true
		}
	})

	//Include Numbers
	includeNumbersToggle.checked = true
	jsonStorage.get("dpgLocalStorageIncludeNumbers", function (error, data){
		if (error) throw error
		if (data) {
			let i = data.includeNumbers
			if(i != undefined) includeNumbersToggle.checked = i
			else includeNumbersToggle.checked = true
		}
	})

	//Include Uppercase
	includeUppercaseToggle.checked = true
	jsonStorage.get("dpgLocalStorageIncludeUppercase", function (error, data){
		if (error) throw error
		if (data) {
			let i = data.includeUppercase
			if(i != undefined) includeUppercaseToggle.checked = i
			else includeUppercaseToggle.checked = true
		}
	})

	//Include Lowercase
	includeLowercaseToggle.checked = true
	jsonStorage.get("dpgLocalStorageIncludeLowercase", function (error, data){
		if (error) throw error
		if (data) {
			let i = data.includeLowercase
			if(i != undefined) includeLowercaseToggle.checked = i
			else includeLowercaseToggle.checked = true
		}
	})

	//Exclude Similar
	excludeSimilarToggle.checked = true
	jsonStorage.get("dpgLocalStorageExcludeSimilar", function (error, data){
		if (error) throw error
		if (data) {
			let i = data.excludeSimilar
			if(i != undefined) excludeSimilarToggle.checked = i
			else excludeSimilarToggle.checked = true
		}
	})

	//Exclude Ambiguous
	excludeAmbiguousToggle.checked = true
	jsonStorage.get("dpgLocalStorageExcludeAmbiguous", function (error, data){
		if (error) throw error
		if (data) {
			let i = data.excludeAmbiguous
			if(i != undefined) excludeAmbiguousToggle.checked = i
			else excludeAmbiguousToggle.checked = true
		}
	})

	copyButton.disabled = true
}

//Changes the pass safety label with the appropriate text and color
function changePassSafetyText() {
	if (amountInput.value <= passWeakNumber) {
		passSafetyText.innerText = passWeakText
		passSafetyText.style.color = passWeakColor
	} else if (amountInput.value <= passMediumNumber) {
		passSafetyText.innerText = passMediumText
		passSafetyText.style.color = passMediumColor
	} else if (amountInput.value <= passStrongNumber) {
		passSafetyText.innerText = passStrongText
		passSafetyText.style.color = passStrongColor
	} else if (amountInput.value <= passVeryStrongNumber) {
		passSafetyText.innerText = passVeryStrongText
		passSafetyText.style.color = passVeryStrongColor
	} else if (amountInput.value <= passOverkillNumber) {
		passSafetyText.innerText = passOverkillText
		passSafetyText.style.color = passOverkillColor
	} else {
		passSafetyText.innerText = passMaximumText
		passSafetyText.style.color = passMaximumColor
	}
}

//Get the parameters setted on the interface and store in the variables used by the generatePass()
function getValuesFromInterface() {
	//Get the parameters from the interface
	amount = amountInput.value
	includeSymbols = includeSymbolsToggle.checked
	includeNumbers = includeNumbersToggle.checked
	includeUppercase = includeUppercaseToggle.checked
	includeLowercase = includeLowercaseToggle.checked
	excludeSimilar = excludeSimilarToggle.checked
	excludeAmbiguous = excludeAmbiguousToggle.checked

	//Resets the previous configured values
	symbols = originalSymbols
	numbers = originalNumbers
	lettersUppercase = originalUppercase
	lettersLowercase = originalLowercase
	chosenCategories = []
	completeCharset = ""

	if (excludeSimilar) {
		//exclude the similar chars from the charset groups
		similar.forEach((item) => {
			symbols = symbols.replace(item.toString(), "")
			numbers = numbers.replace(item.toString(), "")
			lettersUppercase = lettersUppercase.replace(item.toString(), "")
			lettersLowercase = lettersLowercase.replace(item.toString(), "")
		})
	}
	if (excludeAmbiguous) {
		//exclude the ambiguous chars from the charset groups
		ambiguous.forEach((item) => {
			symbols = symbols.replace(item.toString(), "")
			numbers = numbers.replace(item.toString(), "")
			lettersUppercase = lettersUppercase.replace(item.toString(), "")
			lettersLowercase = lettersLowercase.replace(item.toString(), "")
		})
	}

	if (includeSymbols) {
		chosenCategories.push("symbols")
		completeCharset += symbols
	}
	if (includeNumbers) {
		chosenCategories.push("numbers")
		completeCharset += numbers
	}
	if (includeUppercase) {
		chosenCategories.push("uppercase")
		completeCharset += lettersUppercase
	}
	if (includeLowercase) {
		chosenCategories.push("lowercase")
		completeCharset += lettersLowercase
	}
}

//create the events when the actions are performed in the GUI
generateButton.addEventListener("click", () => {

	//Updates the parameters
	getValuesFromInterface()

	//Blocks the Generate Button from working in case no category is selected
	if(chosenCategories.length == 0) return

	generatePass()
})
copyButton.addEventListener("click", () => {
	copyPass()
})
amountInput.addEventListener("change", () => {
	//Clamp the minimum and maximum allowed value
	if (amountInput.value < 4) amountInput.value = 4
	else if (amountInput.value > 2048) amountInput.value = 2048

	//Stores the new value
	//amount = Number(amountInput.value)
	amount = amountInput.value
	
	changePassSafetyText()

	//Saves the amount locally
	jsonStorage.set("dpgLocalStorageAmount", { amount : Number(amount) })

})
includeSymbolsToggle.addEventListener("change", () => {
	//Saves locally
	jsonStorage.set("dpgLocalStorageIncludeSymbols", { includeSymbols: includeSymbolsToggle.checked })
})
includeNumbersToggle.addEventListener("change", () => {
	//Saves locally
	jsonStorage.set("dpgLocalStorageIncludeNumbers", { includeNumbers: includeNumbersToggle.checked })
})
includeUppercaseToggle.addEventListener("change", () => {
	//Saves locally
	jsonStorage.set("dpgLocalStorageIncludeUppercase", { includeUppercase: includeUppercaseToggle.checked })
})
includeLowercaseToggle.addEventListener("change", () => {
	//Saves locally
	jsonStorage.set("dpgLocalStorageIncludeLowercase", { includeLowercase: includeLowercaseToggle.checked })
})
excludeSimilarToggle.addEventListener("change", () => {
	//Saves locally
	jsonStorage.set("dpgLocalStorageExcludeSimilar", { excludeSimilar: excludeSimilarToggle.checked })
})
excludeAmbiguousToggle.addEventListener("change", () => {
	//Saves locally
	jsonStorage.set("dpgLocalStorageExcludeAmbiguous", { excludeAmbiguous: excludeAmbiguousToggle.checked })
})


window.myAPI.onQuickGeneration(() => {
	generatePass()
	copyPass()
	console.log("Mensagem recebida")
	alert("teste")
})

//Main function to generate the random password based on the parameters
function generatePass() {
	
	getValuesFromInterface()

	//Erases the password in memory
	password = ""

	//Shuffle the chosenCategories to avoid the biginning of the password to always have the same categorie order
	shuffle(chosenCategories)

	//I place one char of each categorie on the beginning of the password to make sure that every password will have at least one of each chosen categorie
	for (var i = 0; i < chosenCategories.length; i++) {
		switch (chosenCategories[i]) {
		case "symbols":
			password += symbols.charAt(
				Math.floor(Math.random() * symbols.length)
			)
			break
		case "numbers":
			password += numbers.charAt(
				Math.floor(Math.random() * numbers.length)
			)
			break
		case "uppercase":
			password += lettersUppercase.charAt(
				Math.floor(Math.random() * lettersUppercase.length)
			)
			break
		case "lowercase":
			password += lettersLowercase.charAt(
				Math.floor(Math.random() * lettersLowercase.length)
			)
			break
		default:
			console.log("No categories selected")
		}
	}

	//Now, for the rest of the password, i get one random char from the complete charset (with exclusions)
	for (var a = chosenCategories.length; a < amount; a++) {
		password += completeCharset.charAt(
			Math.floor(Math.random() * completeCharset.length)
		)
	}

	//Places the result password in the interface
	resultTextarea.innerText = password

	//Activates the Copy button
	copyButton.disabled = false
}

//Copies the generated password to the clipboard
function copyPass() {
	//I use the function exposed in the preload.js, that uses the clipboard API to write the text to clipboard
	if (password != "") navigator.clipboard.writeText(password)
}

function shuffle(array) {
	var m = array.length,
		t,
		i
	// While there remain elements to shuffle…
	while (m) {
		// Pick a remaining element…
		i = Math.floor(Math.random() * m--)
		// And swap it with the current element.
		t = array[m]
		array[m] = array[i]
		array[i] = t
	}
	return array
}
