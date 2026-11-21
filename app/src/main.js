import { drawCover } from './cover.js';
import { runShot } from './shots.js';

const canvas = document.getElementById('cover');
const status = document.getElementById('status');
const sizeSelect = document.getElementById('size-preset');
const captionInput = document.getElementById('caption');
const gradeRadios = document.getElementsByName('grade');
const resetBtn = document.getElementById('reset-photos');
const exportBtn = document.getElementById('export');

const state = {
  photos: [null, null, null],
  zooms: [1, 1, 1],
  pans: [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }],
  caption: 'VICE CITY',
  grade: 'sunset',
  size: '1080x1080'
};

function redraw() {
  drawCover(canvas, state);
}

export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function handleFile(index, file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async (e) => {
    const img = await loadImage(e.target.result);
    state.photos[index] = img;
    state.zooms[index] = 1;
    state.pans[index] = { x: 0, y: 0 };
    const zoomInput = document.getElementById(`zoom${index + 1}`);
    if (zoomInput) zoomInput.value = 1;
    redraw();
  };
  reader.readAsDataURL(file);
}

// Event Listeners for inputs
[1, 2, 3].forEach(i => {
  const fileInput = document.getElementById(`photo${i}`);
  const zoomInput = document.getElementById(`zoom${i}`);
  
  fileInput.addEventListener('change', (e) => handleFile(i-1, e.target.files[0]));
  zoomInput.addEventListener('input', (e) => {
    state.zooms[i-1] = parseFloat(e.target.value);
    redraw();
  });
});

captionInput.addEventListener('input', (e) => {
  state.caption = e.target.value;
  redraw();
});

gradeRadios.forEach(r => {
  r.addEventListener('change', (e) => {
    state.grade = e.target.value;
    redraw();
  });
});

sizeSelect.addEventListener('change', (e) => {
  state.size = e.target.value;
  const [w, h] = state.size.split('x').map(Number);
  canvas.width = w;
  canvas.height = h;
  redraw();
});

resetBtn.addEventListener('click', () => {
  state.zooms = [1, 1, 1];
  state.pans = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];
  [1, 2, 3].forEach(i => {
    const z = document.getElementById(`zoom${i}`);
    if (z) z.value = 1;
  });
  redraw();
});

exportBtn.addEventListener('click', () => {
  canvas.toBlob((blob) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `gta-cover-${state.size}.png`;
    a.click();
    status.textContent = `Exported ${state.size} PNG`;
    setTimeout(() => status.textContent = '', 3000);
  }, 'image/png');
});

// Canvas Drag / Pan interaction
let isDragging = false;
let activePanelIndex = 0;
let startX = 0;
let startY = 0;

function getPanelIndexAt(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (clientX - rect.left) * scaleX;
  const y = (clientY - rect.top) * scaleY;

  const w = canvas.width;
  const h = canvas.height;
  const heroWidth = Math.floor(w * 0.6);
  const sideHeight = Math.floor(h * 0.5);

  if (x < heroWidth) return 0;
  if (y < sideHeight) return 1;
  return 2;
}

canvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  activePanelIndex = getPanelIndexAt(e.clientX, e.clientY);
  startX = e.clientX - state.pans[activePanelIndex].x;
  startY = e.clientY - state.pans[activePanelIndex].y;
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  state.pans[activePanelIndex].x = e.clientX - startX;
  state.pans[activePanelIndex].y = e.clientY - startY;
  redraw();
});

window.addEventListener('mouseup', () => {
  isDragging = false;
});

// Touch support for panning
canvas.addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) {
    isDragging = true;
    const touch = e.touches[0];
    activePanelIndex = getPanelIndexAt(touch.clientX, touch.clientY);
    startX = touch.clientX - state.pans[activePanelIndex].x;
    startY = touch.clientY - state.pans[activePanelIndex].y;
  }
});

window.addEventListener('touchmove', (e) => {
  if (!isDragging || e.touches.length !== 1) return;
  const touch = e.touches[0];
  state.pans[activePanelIndex].x = touch.clientX - startX;
  state.pans[activePanelIndex].y = touch.clientY - startY;
  redraw();
});

window.addEventListener('touchend', () => {
  isDragging = false;
});

// Drag and Drop files onto canvas or app
document.addEventListener('dragover', (e) => e.preventDefault());
document.addEventListener('drop', (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file) {
    const panelIdx = getPanelIndexAt(e.clientX, e.clientY);
    handleFile(panelIdx, file);
  }
});

// Init
const shot = new URLSearchParams(location.search).get('shot');
if (shot) {
  runShot(shot, new URLSearchParams(location.search), async (samples, text) => {
    for (let i = 0; i < samples.length; i++) {
      if (samples[i]) state.photos[i] = await loadImage(samples[i]);
    }
    state.caption = text;
    captionInput.value = text;
    redraw();
  });
} else {
  // Wait for font to load before first draw
  document.fonts.ready.then(redraw);
}
