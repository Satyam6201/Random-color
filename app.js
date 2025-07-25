const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const toggleModeBtn = document.getElementById("toggleMode");
const toggleFormatBtn = document.getElementById("toggleFormat");
const resetBtn = document.getElementById("resetBtn");
const colorBox = document.getElementById("colorBox");
const colorCode = document.getElementById("colorCode");
const colorHistory = document.getElementById("colorHistory");
const hslInfo = document.getElementById("hslInfo");

let colorList = [];
let useHex = false;

function getRandomColorRGB() {
  const r = Math.floor(Math.random() * 256),
        g = Math.floor(Math.random() * 256),
        b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

function rgbToHex(rgb) {
  const [r, g, b] = rgb.match(/\d+/g).map(Number);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

function rgbToHSL(rgb) {
  let [r, g, b] = rgb.match(/\d+/g).map(x => x / 255);
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if(max == min){
      h = s = 0;
  } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max){
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function updateHistory(color) {
  colorList.unshift(color);
  if (colorList.length > 6) colorList.pop();
  colorHistory.innerHTML = "";
  colorList.forEach(c => {
    const li = document.createElement("li");
    li.style.backgroundColor = c;
    li.title = c;
    colorHistory.appendChild(li);
  });
}

generateBtn.addEventListener("click", () => {
  let rgbColor = getRandomColorRGB();
  let displayColor = useHex ? rgbToHex(rgbColor) : rgbColor;

  colorBox.style.backgroundColor = rgbColor;
  colorBox.style.color = "#fff";
  colorCode.textContent = displayColor;

  let hsl = rgbToHSL(rgbColor);
  hslInfo.textContent = `H: ${hsl.h} | S: ${hsl.s}% | L: ${hsl.l}%`;

  updateHistory(displayColor);
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(colorCode.textContent);
  copyBtn.innerText = "✅ Copied!";
  setTimeout(() => copyBtn.innerText = "Copy", 1500);
});

toggleModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

toggleFormatBtn.addEventListener("click", () => {
  useHex = !useHex;
  toggleFormatBtn.textContent = useHex ? "Switch to RGB" : "Switch to HEX";
});

resetBtn.addEventListener("click", () => {
  colorBox.style.backgroundColor = "#eee";
  colorCode.textContent = "rgb(---, ---, ---)";
  hslInfo.textContent = "H: -- | S: -- | L: --";
  colorHistory.innerHTML = "";
  colorList = [];
});
