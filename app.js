const btn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const modeBtn = document.getElementById("modeToggle");
const h1 = document.querySelector("h1");
const div = document.getElementById("colorBox");
const colorCode = document.getElementById("colorCode");
const historyList = document.getElementById("colorHistory");
let colorHistory = [];

btn.addEventListener("click", function () {
    let newColor = getRandomColor();
    h1.innerText = "Color Generated!";
    div.style.backgroundColor = newColor;
    colorCode.innerText = newColor;
    updateHistory(newColor);
});

copyBtn.addEventListener("click", function () {
    navigator.clipboard.writeText(colorCode.innerText);
    alert("Color copied to clipboard!");
});

modeBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
});

function getRandomColor() {
    let red = Math.floor(Math.random() * 256);
    let green = Math.floor(Math.random() * 256);
    let blue = Math.floor(Math.random() * 256);
    return `rgb(${red}, ${green}, ${blue})`;
}

function updateHistory(color) {
    colorHistory.unshift(color);
    if (colorHistory.length > 5) {
        colorHistory.pop();
    }

    historyList.innerHTML = "";
    colorHistory.forEach(col => {
        let li = document.createElement("li");
        li.style.backgroundColor = col;
        li.title = col;
        historyList.appendChild(li);
    });
}
