// DOM Elements
const generateBtn = document.getElementById("generateBtn");
const generateGradientBtn = document.getElementById("generateGradientBtn");
const generatePaletteBtn = document.getElementById("generatePaletteBtn");
const copyBtn = document.getElementById("copyBtn");
const ttsBtn = document.getElementById("ttsBtn");
const toggleFormatBtn = document.getElementById("toggleFormat");
const toggleModeBtn = document.getElementById("toggleMode");
const resetBtn = document.getElementById("resetBtn");
const downloadPaletteBtn = document.getElementById("downloadPaletteBtn");
const savePaletteBtn = document.getElementById("savePaletteBtn");
const applySearchBtn = document.getElementById("applySearchBtn");

const colorBox = document.getElementById("colorBox");
const colorCode = document.getElementById("colorCode");
const hslInfo = document.getElementById("hslInfo");
const contrastInfo = document.getElementById("contrastInfo");

const gradientSection = document.getElementById("gradientSection");
const gradientBox = document.getElementById("gradientBox");
const gradientCode = document.getElementById("gradientCode");

const paletteBox = document.getElementById("paletteBox");
const savedPalettes = document.getElementById("savedPalettes");

const searchInput = document.getElementById("searchInput");

const colorHistory = document.getElementById("colorHistory");

const complementaryColor = document.getElementById("complementaryColor");
const analogousColor = document.getElementById("analogousColor");
const triadicColor = document.getElementById("triadicColor");

let useHex = false;
let history = [];
let currentColor = null;

// Utility Functions
function getRandomColorRGB() {
  const r = Math.floor(Math.random() * 256),
        g = Math.floor(Math.random() * 256),
        b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

function rgbToHex(rgb) {
  const [r, g, b] = rgb.match(/\d+/g).map(Number);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function rgbToHSL(rgb) {
  let [r, g, b] = rgb.match(/\d+/g).map(x => x / 255);
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if(max === min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / d + 2); break;
      case b: h = ((r - g) / d + 4); break;
    }
    h *= 60;
  }
  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function getContrastYIQ(rgb) {
  const [r, g, b] = rgb.match(/\d+/g).map(Number);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? 'black' : 'white';
}

function updateDisplay(color) {
  const displayColor = useHex ? rgbToHex(color) : color;
  const hsl = rgbToHSL(color);

  currentColor = color;
  colorBox.style.backgroundColor = color;
  colorBox.style.color = getContrastYIQ(color);
  colorCode.textContent = displayColor;
  hslInfo.textContent = `H: ${hsl.h} | S: ${hsl.s}% | L: ${hsl.l}%`;
  contrastInfo.textContent = `Contrast: ${getContrastYIQ(color)}`;

  updateHistory(displayColor);
  updateColorTheory(hsl);
}

function updateHistory(color) {
  history.unshift(color);
  if (history.length > 10) history.pop();

  colorHistory.innerHTML = "";
  history.forEach(c => {
    const li = document.createElement("li");
    li.style.backgroundColor = c;
    li.title = c;
    li.addEventListener("click", () => {
      const rgb = useHex ? hexToRgb(c) : c;
      updateDisplay(rgb);
    });
    colorHistory.appendChild(li);
  });
}

function hexToRgb(hex) {
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map(x => x + x).join("");
  const bigint = parseInt(c, 16);
  return `rgb(${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255})`;
}

function updateColorTheory({ h, s, l }) {
  complementaryColor.style.backgroundColor = `hsl(${(h + 180) % 360}, ${s}%, ${l}%)`;
  analogousColor.style.backgroundColor = `hsl(${(h + 30) % 360}, ${s}%, ${l}%)`;
  triadicColor.style.backgroundColor = `hsl(${(h + 120) % 360}, ${s}%, ${l}%)`;
}

// Main Functionalities
generateBtn.addEventListener("click", () => {
  const color = getRandomColorRGB();
  updateDisplay(color);
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(colorCode.textContent);
  copyBtn.textContent = "✅ Copied!";
  setTimeout(() => copyBtn.textContent = "📋 Copy Color", 1500);
});

toggleFormatBtn.addEventListener("click", () => {
  useHex = !useHex;
  toggleFormatBtn.textContent = useHex ? "🔁 Switch to RGB" : "🔁 Switch to HEX";
  if (currentColor) updateDisplay(currentColor);
});

toggleModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

ttsBtn.addEventListener("click", () => {
  const utter = new SpeechSynthesisUtterance(colorCode.textContent);
  speechSynthesis.speak(utter);
});

resetBtn.addEventListener("click", () => {
  colorBox.style.backgroundColor = "#eee";
  colorCode.textContent = "rgb(---, ---, ---)";
  hslInfo.textContent = "H: -- | S: -- | L: --";
  contrastInfo.textContent = "Contrast: --";
  colorHistory.innerHTML = "";
  history = [];
});

// Gradient Generator
generateGradientBtn.addEventListener("click", () => {
  const color1 = getRandomColorRGB();
  const color2 = getRandomColorRGB();
  const gradient = `linear-gradient(135deg, ${color1}, ${color2})`;

  gradientBox.style.background = gradient;
  gradientCode.textContent = gradient;
  gradientSection.style.display = "block";
});

// Palette Generator
generatePaletteBtn.addEventListener("click", () => {
  paletteBox.innerHTML = "";
  const palette = Array.from({ length: 5 }, () => getRandomColorRGB());
  palette.forEach(color => {
    const box = document.createElement("div");
    box.style.backgroundColor = color;
    box.title = color;
    box.addEventListener("click", () => updateDisplay(color));
    paletteBox.appendChild(box);
  });
});

downloadPaletteBtn.addEventListener("click", () => {
  html2canvas(paletteBox).then(canvas => {
    const link = document.createElement("a");
    link.download = "palette.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});

savePaletteBtn.addEventListener("click", () => {
  const colors = Array.from(paletteBox.children).map(box => box.style.backgroundColor);
  colors.forEach(color => {
    const swatch = document.createElement("div");
    swatch.style.backgroundColor = color;
    savedPalettes.appendChild(swatch);
  });
});

// Search Color
applySearchBtn.addEventListener("click", () => {
  let input = searchInput.value.trim().toLowerCase();
  if (!input) return;

  if (input.startsWith("#") || input.startsWith("rgb")) {
    const color = input.startsWith("rgb") ? input : hexToRgb(input);
    updateDisplay(color);
  } else {
    const fakeDiv = document.createElement("div");
    fakeDiv.style.color = input;
    document.body.appendChild(fakeDiv);
    const computed = getComputedStyle(fakeDiv).color;
    document.body.removeChild(fakeDiv);
    if (computed !== "rgb(0, 0, 0)" || input === "black") updateDisplay(computed);
    else alert("Color not recognized!");
  }
});
