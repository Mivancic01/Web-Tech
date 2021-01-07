export function adaptColor(elementID) {
  console.log(elementID)
  const element =  document.getElementById(elementID);
  console.log(element);
  const rgb = element.style.backgroundColor;

  let r, g, b;
  if (rgb.match(/^rgb/)) {
    const a = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/)
    r = a[1];
    g = a[2];
    b = a[3];
  }
  console.log(r);
  console.log(g);
  console.log(b);
  const hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
  );

  if (hsp > 127.5) {
    element.classList.add('dark-color');
  } else {
    element.classList.add('light-color');
  }
};