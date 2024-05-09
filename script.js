const SECONDS = 60;
const NUMBERWORDS = 300;
const DISPLAYEDAMMOUNT = 24;
const keySounds = [];
const deleteKeySound = new Audio("audio/BACKSPACE.mp3");
let   keySoundIndex = 0;

let stoppage = 0;
let finished = 0;
let timeoutId;
let inputedText = "";

let started = 0;
let filledParags = 0;

for (let i = 0; i < 5; i++) {
    keySounds[i] = new Audio(`audio/key${i + 1}.mp3`);
}

function initSpans() {
    const spans = document.getElementsByClassName("span");
    for (let i = 0; i < spans.length && i < DISPLAYEDAMMOUNT; i++) {
        spans[i].classList.add("visible");
    }
}

//
function displaySpans() {
    const spans = document.getElementsByClassName("span");
    const completed = document.getElementsByClassName("completed");
    if (completed.length === spans.length) {
        return ;
    }
    for (let i = 0; i < completed.length; i++) {
        if (spans[i].classList.contains("visible")) {
            spans[i].classList.remove("visible");
        }
    }
    for (let i = completed.length - 1; i < completed.length + DISPLAYEDAMMOUNT && i < spans.length; i++) {
        spans[i].classList.add("visible");
    }
}

// Add the i tag to each letter in each span (for styling purposes)
function appendSpanContent(span, value) {
    value.split("").map((letter) => {
        const i = document.createElement("i");
        i.textContent = letter;
        i.classList.add("letters");
        span.appendChild(i);
    });
}

// Split the input entered and loop through each span checking if their value corresponds
function checkFilledWords(inputedText) {
    const words = inputedText.split(" ");
    const span = document.getElementsByClassName("span");
    for (let i = 0; i < span.length; i++) {
        if (i < words.length) {
            if (words[i] === span[i].textContent.trim()) {
                span[i].classList.add("completed");
                if (span[i + 1] !== undefined) {
                    span[i + 1].classList.add("highlighted");
                }
            }
        }
    }
}

// Loop through the i tags and check if their values corresponds to the value of input[index] (also for styling purposes)
function checkLetters(value) {
    const   letterTags = document.getElementsByClassName("letters");
    for (let i = 0; i < value.length && i < letterTags.length; i++) {
        if (letterTags[i].textContent == value[i]) {
            if (!letterTags[i].classList.contains("wrong"))
                letterTags[i].classList.add("correct");
            letterTags[i].classList.replace("wrong", "correct");
        }
        else {
            if (letterTags[i].textContent === " ")
                stoppage = 1;
            if (!letterTags[i].classList.contains("correct"))
                letterTags[i].classList.add("wrong");
            letterTags[i].classList.replace("correct", "wrong");
        }
    }
}

// Call the random words api, you can specify how many random words you want
// const fillWithRandom = async (wordLength) => {
//     try {
//         const response = await fetch(`https://random-word-api.herokuapp.com/word?number=${NUMBERWORDS}`);
//         if (!response.ok) {
//             console.log(response);
//         }
//         const words = await response.json();
//         const parag = document.getElementById("parag");
//         words.map((value, key) => {
//             if (value.length <= wordLength) {
//                 let span = document.createElement("span");
//                 span.classList.add("span");
//                 if (key === 0) {
//                     span.classList.add("highlighted");
//                 }
//                 if (key != words.length - 1)
//                     appendSpanContent(span, value + " ");
//                 else
//                     appendSpanContent(span, value);
//                 parag.appendChild(span);
//             }
//         })
//         initSpans();
//         filledParags = 1;
//     } catch (error) {
//         const errorSvg = document.getElementById("errorSvg");
//         const keyboardSvg = document.getElementById("keyboardSvgPlaceholder");
//         const timeHeader = document.getElementById("timeHeader");
//         errorSvg.style.display = "block";
//         keyboardSvg.style.display = "none";
//         timeHeader.style.display = "none";
//     }
// };

function playSound(sound) {
    if (sound === "delete") {
        deleteKeySound.play();
    } else {
        if (keySoundIndex > 4) {
            keySoundIndex = 0;
        }
        keySounds[keySoundIndex].play();
        keySoundIndex++;
    }
}

function handleKeys(e) {
    const regex = /^[a-zA-Z ]/;
    if (e.key == "Backspace" || e.key == "Delete") {
        const   letterTags = document.getElementsByClassName("letters");
        if (inputedText.length > 0 && inputedText.length <= letterTags.length) {
            letterTags[inputedText.length - 1].classList.remove("correct", "wrong");
            if (stoppage)
                stoppage = 0;
        }
        inputedText = inputedText.substring(0, inputedText.length - 1);
        playSound();
        animateKeyboard("delete");
    } else if (e.key.length === 1 && regex.test(e.key) && !stoppage) {
        initTimer();
        inputedText += e.key;
        playSound();
        if (e.key !== " ") {
            animateKeyboard(e.key);
        } else {
            animateKeyboard("space");
        }
    }
}

function animateKeyboard (key) {
    const pressedKey = document.getElementById(`${key}Key`);
    const keyDetail = document.getElementById(`${key}Detail`);

    if (key == "delete") {
        pressedKey.children[0].style.fill = "#FF6E6A";
        keyDetail.children[0].style.fill = "red";
    } else if (key == "space") {
        pressedKey.children[0].style.fill = "#F1FAFF";
        keyDetail.children[0].style.fill = "#0097FA";
    } else {
        pressedKey.children[0].style.fill = "#F1FAFF";
        keyDetail.children[0].style.fill = "#9299A4";
    }
    setTimeout(() => {
        pressedKey.children[0].style.fill = "#222831";
        keyDetail.children[0].style.fill = "#222831";
    }, 200);
}

function endGame(time) {
    finished = 1;
    const header = document.getElementById("timeHeader");
    const parag = document.getElementById("parag");
    parag.style.opacity = "0";
    header.textContent = `${document.getElementsByClassName("completed").length / time} WPM`;
    clearTimeout(timeoutId);
}

function timer() {
    const header = document.getElementById("timeHeader");
    const currentTime = new Date();
    const distanceInSeconds = Math.floor((currentTime - startTime) / 1000);
    if (distanceInSeconds >= SECONDS) {
        endGame(1);
    } else {
        const time = SECONDS - distanceInSeconds - 1;
        header.textContent = `00:${time >= 10 ? time : "0" + time}`;
        timeoutId = setTimeout(timer, 1000);
    }
}

function initTimer() {
    if (!started) {
        started++;
        startTime = new Date();
        timer();
    }
}

function keyDownHandler(e) {
    if (!finished && filledParags) {
        handleKeys(e);
        checkFilledWords(inputedText);
        checkLetters(inputedText);

        const completedWords = document.getElementsByClassName("completed");
        if (completedWords.length === document.getElementsByTagName("span").length) {
            endGame(1);
        }
        if (completedWords.length > 0 && completedWords.length % DISPLAYEDAMMOUNT === 0) {
            displaySpans();
        }
    }
}

//

function shuffleWords(words) {
    const arr = [];
    let added = 0;
    while (added < words.length && added < NUMBERWORDS) {
        const randomNumber = Math.floor(Math.random() * words.length);
        const randomWord = words[randomNumber];
        if (!arr.includes(randomWord)) {
            arr.push(randomWord);
        } 
        added++;
    }
    return arr;
}

const fetchJson = async (type) => {
    try {
        const response = await fetch(`database/database.json`);
        if (!response.ok) {
            console.log(response);
        }
        const database = await response.json();
        let words = [];
        if (type == "other" || type === undefined) {
            const {fruits, foods, animals, difficultLexical, easyLexical, nature, other} = database;
            words = [...fruits, ...foods, ...animals, ...difficultLexical, ...easyLexical, ...nature, ...other];
        } else {
            words = database[type];
        }
        const shuffledWords = shuffleWords(words);
        const parag = document.getElementById("parag");
        shuffledWords.map((value, key) => {
            let span = document.createElement("span");
            span.classList.add("span");
            if (key === 0) {
                span.classList.add("highlighted");
            }
            if (key != words.length - 1)
                appendSpanContent(span, value + " ");
            else
                appendSpanContent(span, value);
            parag.appendChild(span);
        })
        initSpans();
        filledParags = 1;
    } catch (error) {
        console.log(error);
        const errorSvg = document.getElementById("errorSvg");
        const keyboardSvg = document.getElementById("keyboardSvgPlaceholder");
        const timeHeader = document.getElementById("timeHeader");
        errorSvg.style.display = "block";
        keyboardSvg.style.display = "none";
        timeHeader.style.display = "none";
    }
};

function init() {
    fetchJson();
    document.addEventListener("keydown", (e) => {
        keyDownHandler(e);
    });
}

init();