// Elements
const colorBox = document.getElementById("colorBox");
const colorCode = document.getElementById("colorCode");
const generateBtn = document.getElementById("generateBtn");
const gradientBtn = document.getElementById("gradientBtn");
const gradientBox = document.getElementById("gradientBox");
const gradientCode = document.getElementById("gradientCode");
const paletteBtn = document.getElementById("paletteBtn");
const paletteBox = document.getElementById("paletteBox");
const copyBtn = document.getElementById("copyBtn");
const modeBtn = document.getElementById("modeBtn");

let currentColor = null;

// Helper Functions
const randomRGB = () => `rgb(${rand()}, ${rand()}, ${rand()})`;
const rand = () => Math.floor(Math.random() * 256);

const rgbToHex = (rgb) => {
  const [r, g, b] = rgb.match(/\d+/g).map(Number);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

// Update Color Display
function updateColor(color) {
  colorBox.style.backgroundColor = color;
  colorCode.textContent = `${color} | ${rgbToHex(color)}`;
  currentColor = color;
}

// Event: Generate Random Color
generateBtn.addEventListener("click", () => {
  const color = randomRGB();
  updateColor(color);
});

// Event: Copy Color
copyBtn.addEventListener("click", () => {
  if (!currentColor) return;
  navigator.clipboard.writeText(colorCode.textContent);
  copyBtn.textContent = "✅ Copied!";
  setTimeout(() => (copyBtn.textContent = "📋 Copy Color"), 1500);
});

// Event: Generate Gradient
gradientBtn.addEventListener("click", () => {
  const c1 = randomRGB();
  const c2 = randomRGB();
  const gradient = `linear-gradient(135deg, ${c1}, ${c2})`;
  gradientBox.style.background = gradient;
  gradientCode.textContent = gradient;
});

// Event: Generate Palette
paletteBtn.addEventListener("click", () => {
  paletteBox.innerHTML = "";
  const colors = Array.from({ length: 5 }, randomRGB);
  colors.forEach((color) => {
    const div = document.createElement("div");
    div.style.backgroundColor = color;
    div.title = color;
    div.addEventListener("click", () => updateColor(color));
    paletteBox.appendChild(div);
  });
});

// Event: Toggle Dark/Light Mode
modeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});