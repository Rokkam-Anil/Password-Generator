const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyMsg = document.querySelector("[data-copyMSG]");
const copybtn = document.querySelector("[data-copy]");
const indicator = document.querySelector("[data-indicator]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const inputSlider = document.querySelector("[data-lengthSlider]");
const uppercase = document.querySelector("#uppercase");
const lowercase = document.querySelector("#lowercase");
const symbols = document.querySelector("#symbols");
const numbers = document.querySelector("#numbers");
const generatebtn = document.querySelector(".GenBtn");
const allcheckbox = document.querySelectorAll("input[type=checkbox]");
const allSymbols = '~!`@#$%^&*()-+*/{[]}|\<>,.?:;';

//Initially
let password = "";
let passwordLength = 7;
let checkCount = 0;
handleSlider(); 
 // set circle color grey
 setIndicator("#ccc");

// set password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min) + "% 100%");
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 15px 1px${color}`;
}

function getRanInteger(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateNumbers(){
    return getRanInteger(0, 9);
}

function generateUppercase(){
    return String.fromCharCode(getRanInteger(65, 91));
}

function generateLowercase(){
    return String.fromCharCode(getRanInteger(97, 123));
}

function generateSymbols(){
    const randomNum = getRanInteger(0, allSymbols.length);
    return allSymbols.charAt(randomNum);
}

function calcStrength(){
    let hasNumbers = false;
    let hasUppercase = false;
    let hasLowercase = false;
    let hasSymbols = false;

    if(numbers.checked) hasNumbers = true;
    if(symbols.checked) hasSymbols = true;
    if(uppercase.checked) hasUppercase = true;
    if(lowercase.checked) hasLowercase = true;

    if(
        hasUppercase &&
        hasLowercase &&
        (hasNumbers || hasSymbols) &&
        passwordLength >= 8
    ){
        setIndicator("#0f0");
    }else if(
        (hasLowercase || hasUppercase) &&
        (hasNumbers || hasSymbols) &&
        passwordLength >= 6
    ){
        setIndicator("#ff0");
    }else{
        setIndicator("#f00");
    }
    
}

async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="failed";
    }
    copyMsg.classList.add("active");

    setTimeout(()=>{
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array){
    // Fisher Yates method;
    for(let i=array.length-1; i>0; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str="";
    array.forEach((ele)=>(str+=ele));
    return str;
}

//Handle checkbox count
function handleCheckboxChange(){
    checkCount = 0;
    allcheckbox.forEach((checkbox) =>{
        if(checkbox.checked)
            checkCount++;
    });

    //Special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allcheckbox.forEach((checkbox)=>{
    checkbox.addEventListener('change', handleCheckboxChange);
});

inputSlider.addEventListener('input', (e) =>{
    passwordLength = e.target.value;
    handleSlider();
});

copybtn.addEventListener('click', () =>{
    if(passwordDisplay.value){
        copyContent();
    }
});

generatebtn.addEventListener("click", ()=>{
    console.log("Just entered to generate btn ");
    if(checkCount == 0) {
        console.log("Inside checkcount condition");
        return;
    }
    console.log("Anil");
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
        console.log("After checkcount condition");
    }

    console.log("Starting our journey");
    password = "";

    let funcArr = [];

    if(uppercase.checked)
        funcArr.push(generateUppercase);
    if(lowercase.checked)
        funcArr.push(generateLowercase);
    if(numbers.checked)
        funcArr.push(generateNumbers);
    if(symbols.checked)
        funcArr.push(generateSymbols);


    // compulsory addition
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }
    console.log("Compulsory Addition done...")
    // Remaining Addition
    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randIndex = getRanInteger(0, funcArr.length);
        console.log("RandomIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining Addition done...");

    // Shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Suffling done...");
    // show in UI
    passwordDisplay.value = password;
    console.log("UI done!...");
    // calculate the strength
    calcStrength();
});
