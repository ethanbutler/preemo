const _toRGB = (hex) => {
  const num = parseInt(hex, 16)
  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = (num) & 255
  return { r, g, b }
}

const _toHex = (rgb) => {
  const hex = (rgb | 0).toString(16)
  return hex.length === 1 ? `0${hex}` : hex
}

const _blendAndSkew = (a, b, skew) => {
  const d = b - a
  return a + ((d * skew) / 100)
}

const _trueRandom = () => {
  return (Math.random() * 0xffffff << 0).toString(16)
}

const mix = (color1, color2, skew) => {
  const z = _toRGB(color1)
  const y = _toRGB(color2)

  const r = _toHex(_blendAndSkew(z.r, y.r, skew))
  const g = _toHex(_blendAndSkew(z.g, y.g, skew))
  const b = _toHex(_blendAndSkew(z.b, y.b, skew))
  return `${r}${g}${b}`
}

const lighten = (hex, amount) => {
  return mix(hex, 'ffffff', amount)
}

const darken = (hex, amount) => {
  return mix(hex, '000000', amount)
}

const fade = (hex, intensity) => {
  const { r, g, b } = _toRGB(hex)
  const a = intensity.toFixed(3) // 127 = max velocity
  return `rgba(${r},${g},${b},${a})`
}

const random = (base, deviation) => {
  if(!base) return  _trueRandom()
  const d     = deviation || 0
  const start = _trueRandom()
  return mix(start, base, 100 - d)
}

const colors = {
  fade,
  mix,
  lighten,
  darken,
  random
}

export default colors
