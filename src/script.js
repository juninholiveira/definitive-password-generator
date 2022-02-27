//HTML elements gathered from the DOM
const amountInput = document.querySelector("#input-amount")
const passSafetyText = document.querySelector("#pass-safety")
const includeSymbolsToggle = document.querySelector("#input-symbols")
const includeNumbersToggle = document.querySelector("#input-numbers")
const includeUppercaseToggle = document.querySelector("#input-uppercase")
const includeLowercaseToggle = document.querySelector("#input-lowercase")
const excludeSimilarToggle = document.querySelector("#input-exclude-similar")
const excludeAmbiguousToggle = document.querySelector(
	"#input-exclude-ambiguous"
)
const generateButton = document.querySelector("#button-generate")
const copyButton = document.querySelector("#button-copy")
const resultTextarea = document.querySelector("#textarea-result")

//Characters
const originalSymbols = "`~!@#$%^&*()-_=+[{]}\\;:',<.>/?"
const originalNumbers = "1234567890"
const originalUppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const originalLowercase = "abcdefghijklmnopqrstuvwxyz"
const similar = ["i", "l", "1", "L", "o", "O", "0"]
const ambiguous = [
	"[",
	"]",
	"{",
	"}",
	"(",
	")",
	"/",
	"\\",
	"'",
	"\"",
	"`",
	"~",
	",",
	";",
	":",
	".",
	"<",
	">",
]

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

//Booleans for the inputs
let amount
let includeSymbols = true
let includeNumbers = true
let includeUppercase = true
let includeLowercase = true
let excludeSimilar = true
let excludeAmbiguous = true
let chosenCategories = ["symbols", "numbers", "uppercase", "lowercase"]

initialSetup()
getValuesFromInterface()

//Sets the input and checkboxes of the interface with the default values
function initialSetup() {
	amountInput.setAttribute("value", 16)
	passSafetyText.innerText = "STRONG"
	includeSymbolsToggle.checked = true
	includeNumbersToggle.checked = true
	includeUppercaseToggle.checked = true
	includeLowercaseToggle.checked = true
	excludeSimilarToggle.checked = true
	excludeAmbiguousToggle.checked = true
	chosenCategories = ["symbols", "numbers", "uppercase", "lowercase"]
	copyButton.disabled = true
}

//Get the parameters setted on the interface and store in the variables used by the generatePass()
function getValuesFromInterface() {
	//Get the parameters from the interface
	//amount = Number(amountInput.getAttribute("value"))
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
	amount = amountInput.value

	//Changes the pass safety label with the appropriate text and color
	if (amount <= passWeakNumber) {
		passSafetyText.innerText = passWeakText
		passSafetyText.style.color = passWeakColor
	} else if (amount <= passMediumNumber) {
		passSafetyText.innerText = passMediumText
		passSafetyText.style.color = passMediumColor
	} else if (amount <= passStrongNumber) {
		passSafetyText.innerText = passStrongText
		passSafetyText.style.color = passStrongColor
	} else if (amount <= passVeryStrongNumber) {
		passSafetyText.innerText = passVeryStrongText
		passSafetyText.style.color = passVeryStrongColor
	} else if (amount <= passOverkillNumber) {
		passSafetyText.innerText = passOverkillText
		passSafetyText.style.color = passOverkillColor
	} else {
		passSafetyText.innerText = passMaximumText
		passSafetyText.style.color = passMaximumColor
	}
})

//Main function to generate the random password based on the parameters
function generatePass() {
	//Updates the parameters
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
