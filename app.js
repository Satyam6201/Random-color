const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const modeToggle = document.getElementById("modeToggle");
const resetBtn = document.getElementById("resetBtn");

const colorBox = document.getElementById("colorBox");
const rgbCode = document.getElementById("rgbCode");
const hexCode = document.getElementById("hexCode");
const historyList = document.getElementById("colorHistory");
const toast = document.getElementById("toast");

let colorHistory = [];

generateBtn.addEventListener("click", () => {
  const rgb = getRandomRGB();
  const hex = rgbToHex(rgb);

  colorBox.style.backgroundColor = rgb;
  colorBox.style.color = getContrastColor(rgb);

  rgbCode.innerText = rgb;
  hexCode.innerText = hex;

  showToast("🎨 New color generated!");
  updateHistory(rgb);
});

copyBtn.addEventListener("click", () => {
  const copyText = `${rgbCode.innerText} / ${hexCode.innerText}`;
  navigator.clipboard.writeText(copyText).then(() => {
    showToast("📋 Color code copied!");
  });
});

modeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  modeToggle.innerText = document.body.classList.contains("dark-mode")
    ? "☀️ Light Mode"
    : "🌙 Dark Mode";
  showToast("🔄 Theme Toggled");
});

resetBtn.addEventListener("click", () => {
  colorHistory = [];
  updateHistory();
  showToast("🧹 History Cleared");
});

// Generate RGB Color
function getRandomRGB() {
  const r = Math.floor(Math.random() * 256),
        g = Math.floor(Math.random() * 256),
        b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

// Convert RGB to HEX
function rgbToHex(rgb) {
  const [r, g, b] = rgb
    .match(/\d+/g)
    .map((num) => parseInt(num).toString(16).padStart(2, "0"));
  return `#${r}${g}${b}`;
}

// Calculate Contrast Text Color (for visibility)
function getContrastColor(rgb) {
  const [r, g, b] = rgb.match(/\d+/g).map(Number);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 140 ? "#000" : "#fff";
}

// Update Color History
function updateHistory(newColor = null) {
  if (newColor) {
    colorHistory.unshift(newColor);
    if (colorHistory.length > 10) colorHistory.pop();
  }

  historyList.innerHTML = "";
  colorHistory.forEach((color) => {
    const li = document.createElement("li");
    li.style.backgroundColor = color;
    li.title = color;
    li.classList.add("history-item");

    li.addEventListener("click", () => {
      colorBox.style.backgroundColor = color;
      colorBox.style.color = getContrastColor(color);
      rgbCode.innerText = color;
      hexCode.innerText = rgbToHex(color);
      showToast(`🎯 Selected ${color}`);
    });

    historyList.appendChild(li);
  });
}

// Toast Notification
function showToast(message) {
  toast.innerText = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}
