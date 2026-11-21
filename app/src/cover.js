/** 
 * Draws the GTA 6 style cover art.
 * Multi-panel layout: 1 big hero on the left, 2 smaller stacked on the right.
 */
export function drawCover(canvas, state) {
  const ctx = canvas.getContext('2d');
  const { width: w, height: h } = canvas;
  const { photos, caption, grade, zooms, pans } = state;

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);

  // Define panels: [x, y, width, height]
  const heroWidth = Math.floor(w * 0.6);
  const sideWidth = w - heroWidth;
  const sideHeight = Math.floor(h * 0.5);

  const panels = [
    { x: 0, y: 0, w: heroWidth, h: h, photo: photos[0], zoom: zooms[0], pan: pans[0] },
    { x: heroWidth, y: 0, w: sideWidth, h: sideHeight, photo: photos[1], zoom: zooms[1], pan: pans[1] },
    { x: heroWidth, y: sideHeight, w: sideWidth, h: h - sideHeight, photo: photos[2], zoom: zooms[2], pan: pans[2] }
  ];

  // Draw photos
  panels.forEach((p, i) => {
    ctx.save();
    ctx.beginPath();
    ctx.rect(p.x, p.y, p.w, p.h);
    ctx.clip();

    if (p.photo) {
      const img = p.photo;
      const baseScale = Math.max(p.w / img.naturalWidth, p.h / img.naturalHeight);
      const scale = baseScale * p.zoom;
      const pw = img.naturalWidth * scale;
      const ph = img.naturalHeight * scale;
      const dx = p.x + (p.w - pw) / 2 + (p.pan?.x || 0);
      const dy = p.y + (p.h - ph) / 2 + (p.pan?.y || 0);
      ctx.drawImage(img, dx, dy, pw, ph);
    } else {
      ctx.fillStyle = '#111';
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = '#333';
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Panel ${i + 1}`, p.x + p.w / 2, p.y + p.h / 2);
    }
    ctx.restore();
  });

  // Draw borders
  ctx.strokeStyle = '#000';
  ctx.lineWidth = Math.max(4, w * 0.005);
  ctx.strokeRect(0, 0, w, h);
  ctx.beginPath();
  ctx.moveTo(heroWidth, 0);
  ctx.lineTo(heroWidth, h);
  ctx.moveTo(heroWidth, sideHeight);
  ctx.lineTo(w, sideHeight);
  ctx.stroke();

  // Apply Color Grade
  if (grade !== 'none') {
    ctx.save();
    const g = ctx.createLinearGradient(0, 0, w, h);
    if (grade === 'sunset') {
      g.addColorStop(0, 'rgba(255, 100, 0, 0.2)');
      g.addColorStop(0.5, 'rgba(255, 0, 150, 0.1)');
      g.addColorStop(1, 'rgba(50, 0, 100, 0.3)');
      ctx.globalCompositeOperation = 'overlay';
    } else if (grade === 'neon') {
      g.addColorStop(0, 'rgba(0, 255, 255, 0.2)');
      g.addColorStop(0.5, 'rgba(255, 0, 255, 0.1)');
      g.addColorStop(1, 'rgba(0, 0, 255, 0.2)');
      ctx.globalCompositeOperation = 'color';
    }
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  // Draw Caption
  const text = caption.trim().toUpperCase();
  if (text) {
    ctx.save();
    const fontSize = Math.floor(h * 0.12);
    ctx.font = `italic ${fontSize}px "Anton", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const tx = w / 2;
    const ty = h * 0.85;

    // Outer glow/shadow
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 10;
    ctx.shadowOffsetY = 10;

    // Thick outline
    ctx.strokeStyle = '#000';
    ctx.lineWidth = fontSize * 0.15;
    ctx.lineJoin = 'round';
    ctx.strokeText(text, tx, ty);

    // Inner outline/stroke
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = fontSize * 0.05;
    ctx.strokeText(text, tx, ty);

    // Gradient fill
    const textG = ctx.createLinearGradient(0, ty - fontSize/2, 0, ty + fontSize/2);
    textG.addColorStop(0, '#fff');
    textG.addColorStop(0.5, '#eee');
    textG.addColorStop(1, '#ccc');
    ctx.fillStyle = textG;
    ctx.fillText(text, tx, ty);

    ctx.restore();
  }
}
