

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
const originalSymbols   = "`~!@#$%^&*()-_=+[{]}\;:',<.>/?"
const originalNumbers   = "1234567890"
const originalUppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const originalLowercase = "abcdefghijklmnopqrstuvwxyz"
const similar           = ["i","l","1","L","o","O","0"]
const ambiguous         = ["[","]","{","}","(",")","/","\\","'","\"","`","~",",",";",":",".","<",">"]

let symbols           = "`~!@#$%^&*()-_=+[{]}\;:',<.>/?"
let numbers           = "1234567890"
let lettersUppercase  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
let lettersLowercase  = "abcdefghijklmnopqrstuvwxyz"
let categories          = ["symbols","numbers","uppercase","lowercase"]
let completeCharset

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
let chosenCategories   = ["symbols","numbers","uppercase","lowercase"]

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
    chosenCategories   = ["symbols","numbers","uppercase","lowercase"]
}

//Get the parameters setted on the interface and store in the variables used by the generatePass()
function getValuesFromInterface()
{
    //Get the parameters from the interface
    amount = Number(amountInput.getAttribute("value"))
    includeSymbols = includeSymbolsToggle.checked
    includeNumbers = includeNumbersToggle.checked
    includeUppercase = includeUppercaseToggle.checked
    includeLowercase = includeLowercaseToggle.checked
    excludeSimilar = excludeSimilarToggle.checked
    excludeAmbiguous = excludeAmbiguousToggle.checked

    //Resets the previous configured values
    symbols             = originalSymbols
    numbers             = originalNumbers
    lettersUppercase    = originalUppercase
    lettersLowercase    = originalLowercase
    chosenCategories    = []
    completeCharset     = ""

    if(excludeSimilar)
    {
        //exclude the similar chars from the charset groups
        similar.forEach(item => {
            symbols             = symbols.replace(item.toString(), "")
            numbers             = numbers.replace(item.toString(), "")
            lettersUppercase    = lettersUppercase.replace(item.toString(), "")
            lettersLowercase    = lettersLowercase.replace(item.toString(), "")
        })
    }
    if(excludeAmbiguous)
    {
        //exclude the ambiguous chars from the charset groups
        ambiguous.forEach(item => {
            symbols             = symbols.replace(item.toString(), "")
            numbers             = numbers.replace(item.toString(), "")
            lettersUppercase    = lettersUppercase.replace(item.toString(), "")
            lettersLowercase    = lettersLowercase.replace(item.toString(), "")
        })
    }
    if(includeSymbols)
    {
        chosenCategories.push("symbols")
        completeCharset += symbols
    }
    if(includeNumbers)
    {
        chosenCategories.push("numbers")
        completeCharset += numbers
    }
    if(includeUppercase)
    {
        chosenCategories.push("uppercase")
        completeCharset += lettersUppercase
    }
    if(includeLowercase)
    {
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

//Main function to generate the random password based on the parameters
function generatePass()
{
    //Updates the parameters
    getValuesFromInterface()

    //Erases the password in memory
    password = ""

    //Shuffle the chosenCategories to avoid the biginning of the password to always have the same categorie order
    shuffle(chosenCategories)

    //I place one char of each categorie on the beginning of the password to make sure that every password will have at least one of each chosen categorie
    for (var i = 0; i < chosenCategories.length; i++)
    {
        switch (chosenCategories[i])
        {
            case "symbols":
                password += symbols.charAt(Math.floor(Math.random() * symbols.length))
                break
            case "numbers":
                password += numbers.charAt(Math.floor(Math.random() * numbers.length))
                break
            case "uppercase":
                password += lettersUppercase.charAt(Math.floor(Math.random() * lettersUppercase.length))
                break
            case "lowercase":
                password += lettersLowercase.charAt(Math.floor(Math.random() * lettersLowercase.length))
                break
            default:
                console.log("No categories selected")
        }
    }

    //Now, for the rest of the password, i get one random char from the complete charset (with exclusions)
    for (var i = chosenCategories.length - 1; i < amount; i++)
    {
        password += completeCharset.charAt(Math.floor(Math.random() * completeCharset.length))
    }

    //Places the result password in the interface
    resultTextarea.innerText = password
}

//Copies the generated password to the clipboard
function copyPass()
{
    //I use the function exposed in the preload.js, that uses the clipboard API to write the text to clipboard
    if(password != "")
        window.clipboard.copyToClipboard(password)
}

function shuffle(array)
{
    var m = array.length, t, i;
    // While there remain elements to shuffle…
    while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);
        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}