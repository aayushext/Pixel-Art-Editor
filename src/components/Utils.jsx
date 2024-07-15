export const hex2rgb = (hex) => {
  const rgbChar = ["r", "g", "b"];

  const normal = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (normal) {
    return normal.slice(1).reduce((a, e, i) => {
      a[rgbChar[i]] = parseInt(e, 16);
      return a;
    }, {});
  }

  const shorthand = hex.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
  if (shorthand) {
    return shorthand.slice(1).reduce((a, e, i) => {
      a[rgbChar[i]] = 0x11 * parseInt(e, 16);
      return a;
    }, {});
  }

  return null;
};
