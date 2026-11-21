// Fixed scenes for screenshots: ?shot=editor shows the page with sample photos; ?shot=cover shows the cover alone.
// `photo1`, `photo2`, `photo3` picks the samples (samples/<photo>.jpg) and `caption` the words.
// `size` sets the aspect ratio (1080x1080, 1080x1350, 1920x1080).
export async function runShot(shot, query, load) {
  if (shot === 'cover') document.body.classList.add('shot-cover');
  
  const size = query.get('size') || '1080x1080';
  const sizeSelect = document.getElementById('size-preset');
  if (sizeSelect) {
    sizeSelect.value = size;
    sizeSelect.dispatchEvent(new Event('change'));
  }

  const p1 = query.get('photo1') || query.get('photo') || 'pier';
  const p2 = query.get('photo2') || query.get('photo') || 'boulevard';
  const p3 = query.get('photo3') || query.get('photo') || 'pier';
  
  const samples = [
    `samples/${p1}.jpg`,
    `samples/${p2}.jpg`,
    `samples/${p3}.jpg`
  ];
  
  await load(samples, query.get('caption') ?? 'VICE CITY');
  
  // Double raf to ensure canvas paint
  requestAnimationFrame(() => requestAnimationFrame(() => { 
    window.__shotReady = true; 
  }));
}
