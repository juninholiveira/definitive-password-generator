const quantity = document.querySelector('#quantity')
const resultText = document.querySelector('#resultText')

const charsetLetters = "abcdefghijklmnopqrstuvwxyz"
const charsetNumbers = "1234567890"
const charsetSpecial = "!@#$%&()-_=+?"

function generatePass(){

    //Clears the previous password generated from the HTML
    resultText.innerText = "";

    //If there is not any number in the quantity input, ask for one
    if(quantity.value === ""){
        alert('Type the quantity of characters')
        return
    }

    //Creates or erases the password in memory
    let password = ""

    //Adds a random char in the new password
    for (var i = 0; n = charsetLetters.length; i < quantity.value){
        password += charsetLetters.charAt(Math.floor(Math.random() * n))
        i++
    }

    let result = document.createTextNode(password)
    return resultText.appendChild(result)
}