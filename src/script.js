//HTML elements gathered from the DOM
const amountInput               = document.querySelector('#input-amount')
const passSafetyText            = document.querySelector('#pass-safety')
const includeSymbolsToggle      = document.querySelector('#input-symbols')
const includeNumbersToggle      = document.querySelector('#input-numbers')
const includeUppercaseToggle    = document.querySelector('#input-uppercase')
const includeLowercaseToggle    = document.querySelector('#input-lowercase')
const excludeSimilarToggle      = document.querySelector('#input-exclude-similar')
const excludeAmbiguousToggle    = document.querySelector('#input-exclude-ambiguous')
const generateButton            = document.querySelector('#button-generate')
const copyButton                = document.querySelector('#button-copy')
const resultTextarea            = document.querySelector('#textarea-result')

//Characters
const symbols   = "`~!@#$%^&*()-_=+[{]}\|;:',<.>/?"
const numbers   = "1234567890"
const letters   = "abcdefghighijklmnopqrstuvwxyz"
const similar   = "il1LoO0"
const ambiguous = "[]{}()/\\'\"`~,;:.<>"

//The generated pass
let password

//Colors and text for the pass safety
const passWeakText          = "WEAK"
const passWeakColor         = "rgb(191,63,63)"
const passMediumText        = "MEDIUM"
const passMediumColor       = "rgb(191,112,63)"
const passStrongText        = "STRONG"
const passStrongColor       = "rgb(191,172,63)"
const passVeryStrongText    = "VERY STRONG"
const passVeryStrongColor   = "rgb(101,191,63)"
const passOverkillText      = "OK, THIS IS GETTING OUT OF CONTROL"
const passOverkillColor     = "rgb(187,63,191)"
const passMaximumText       = "STORING NUCLEAR CODES, I SEE..."
const passMaximumColor      = "rgb(0,0,0)"

//Booleans for the inputs
let amount              = 16
let includeSymbols      = true
let includeNumbers      = true
let includeUppercase    = true
let includeLowercase    = true
let excludeSimilar      = true
let excludeAmbiguous    = true

initialSetup()
getValuesFromInterface()

//Sets the input and checkboxes of the interface with the default values
function initialSetup()
{
    amountInput.setAttribute("value", 16)
    passSafetyText.innerText = "STRONG"
    includeSymbolsToggle.checked = true
    includeNumbersToggle.checked = true
    includeUppercaseToggle.checked = true
    includeLowercaseToggle.checked = true
    excludeSimilarToggle.checked = true
    excludeAmbiguousToggle.checked = true
}

//Get the values setted on the interface and store in the variables used by the generatePass()
function getValuesFromInterface()
{
    amount = Number(amountInput.getAttribute("value"))
    includeSymbols = includeSymbolsToggle.checked
    includeNumbers = includeNumbersToggle.checked
    includeUppercase = includeUppercaseToggle.checked
    includeLowercase = includeLowercaseToggle.checked
    excludeSimilar = excludeSimilarToggle.checked
    excludeAmbiguous = excludeAmbiguousToggle.checked
}

//create the events when the actions are performed in the GUI
generateButton.addEventListener("click", () => {
    generatePass()
})

//Main function to generate the random password based on the parameters
function generatePass()
{
    //Updates the parameters
    getValuesFromInterface()

    //Erases the password in memory
    let password = ""

    //Adds a random char in the new password
    for (var i = 0; i < amount; i++)
    {
        password += letters.charAt(Math.floor(Math.random() * letters.length))
    }

    //Places the result password in the interface
    resultTextarea.innerText = password
}

//Copies the generated password to the clipboard
function copyPass()
{

}