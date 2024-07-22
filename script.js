const inputSlider = document.querySelector("[data-lengthSlider]");
const inputDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copyBtn]");
const copyMsg = document.querySelector("[data-copiedMsg]");
const upperCaseChecker = document.querySelector("#uppercase");
const lowerCaseChecker = document.querySelector("#lowercase");
const numbersChecker = document.querySelector("#number");
const symbolsChecker = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const genrateBtn = document.querySelector(".genrateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const Symbol = "!@#$%^&&*(){[}]/";
let password = "";
let passwordLength = 10;
upperCaseChecker.checked=true;
let checkCount = 1;
inputDisplay.innerHTML=passwordLength;
// Set indicator color to grey
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    // Add shadow
    indicator.style.boxShadow = `0 0 10px 5px ${color}`;
}

// Get random integer
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate random number
function genrateRandomNumber() {
    return getRandomInt(0, 9);
}

// Generate lower case
function genrateLowerCase() {
    return String.fromCharCode(getRandomInt(97, 122));
}

// Generate upper case
function genrateUpperCase() {
    return String.fromCharCode(getRandomInt(65, 90));
}

// Generate Symbol
function genrateSymbol() {
    const randomNum = getRandomInt(0, Symbol.length - 1);
    return Symbol.charAt(randomNum);
}

// Calculate strength
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (upperCaseChecker.checked) hasUpper = true;
    if (lowerCaseChecker.checked) hasLower = true;
    if (numbersChecker.checked) hasNum = true;
    if (symbolsChecker.checked) hasSym = true;
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

// Copy content
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied"; 
    } catch (e) {
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.innerText = "";
        copyMsg.classList.remove("active");
    }, 5000);
}



// Event listener to slider
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    inputDisplay.innerHTML = passwordLength;
});

// Checkbox handler
function handlecheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) checkCount++;
    });
    // Special condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        inputSlider.value = passwordLength;
        inputDisplay.innerHTML = passwordLength;
    }
}

// Add event listener to checkbox
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handlecheckBoxChange);
});

// Generate password
genrateBtn.addEventListener('click', () => {
    if (checkCount <= 0) return;
    // Remove old password
    password = "";
    let funcArr = [];
    if (upperCaseChecker.checked) funcArr.push(genrateUpperCase);
    if (lowerCaseChecker.checked) funcArr.push(genrateLowerCase);
    if (numbersChecker.checked) funcArr.push(genrateRandomNumber);
    if (symbolsChecker.checked) funcArr.push(genrateSymbol);
    // Compulsory addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randomIdx = getRandomInt(0, funcArr.length - 1);
        password += funcArr[randomIdx]();
    }
    // Shuffle the password
    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
    // Calculate the strength
    calcStrength();
});

// Shuffel password
function shufflePassword(array) {
    // Fisher-Yates shuffle method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

// Handle checkbox initially
handlecheckBoxChange();
