import jimp from 'jimp'

const GAUSSIAN_FILTER = [
  [0.0625, 0.125, 0.0625],
  [0.125, 0.25, 0.125],
  [0.0625, 0.125, 0.0625],
];

function createArray(length) {
  let arr = new Array(length || 0),
    i = length;

  if (arguments.length > 1) {
    let args = Array.prototype.slice.call(arguments, 1);
    while (i--) arr[length - 1 - i] = createArray.apply(this, args);
  }

  return arr;
}

//M = imagem jimp
//ii =
// jj =
function neighborhood(M, ii, jj) {
  if (ii > M.bitmap.width || ii < 0 || jj > M.bitmap.height || jj < 0) {
    throw 'pixel fora dos limites da imagem'
  }

  let upperPixelsCoordinates = [],
    middlePixelsCoordinates = [],
    bottomPixelsCoordinates = []


  //upper left
  if (ii > 0 && jj > 0) {
    upperPixelsCoordinates.push([ii - 1, jj - 1])
  }
  //upper
  if (jj > 0) {
    upperPixelsCoordinates.push([ii, jj - 1])
  }
  //upper right
  if (ii < M.bitmap.width && jj > 0) {
    upperPixelsCoordinates.push([ii + 1, jj - 1])
  }

  //left
  if (ii > 0) {
    middlePixelsCoordinates.push([ii - 1, jj])
  }

  //the pixel
  middlePixelsCoordinates.push([ii, jj])

  //right
  if (ii < M.bitmap.width) {
    middlePixelsCoordinates.push([ii + 1, jj])
  }

  //bottom left
  if (ii > 0 && jj < M.bitmap.height) {
    bottomPixelsCoordinates.push([ii - 1, jj + 1])
  }

  //bottom
  if (jj < M.bitmap.height) {
    bottomPixelsCoordinates.push([ii, jj + 1])
  }

  //botom right
  if (ii < M.bitmap.width && jj < M.bitmap.height) {
    bottomPixelsCoordinates.push([ii + 1, jj + 1])
  }

  //retorna matriz com valores RGBA dos pixels
  return [
    upperPixelsCoordinates.map(([x, y]) => jimp.intToRGBA(M.getPixelColor(x, y))),
    middlePixelsCoordinates.map(([x, y]) =>  jimp.intToRGBA(M.getPixelColor(x, y))),
    bottomPixelsCoordinates.map(([x, y]) =>  jimp.intToRGBA(M.getPixelColor(x, y))),
  ]

}

function rgbToWhiteBlack(tuple) {
  if (tuple.r == 255 && tuple.g == 255 && tuple.b == 255) {
    return 1;
  }
  return Math.round(((tuple.g + tuple.g + tuple.b)/3)/255);
}

function beta(alphaMatte, i, j) {
  const pixel = jimp.intToRGBA(alphaMatte.getPixelColor(i, j))
  if (rgbToWhiteBlack(pixel)) {
    return pixel
  }
  let N = neighborhood(alphaMatte, i, j);
  N = N.reduce((a, b) => a.concat(b), []);

  N = N.map(function (tuple) {
    return rgbToWhiteBlack(tuple)
  });

  let G = GAUSSIAN_FILTER.reduce((a, b) => a.concat(b), []);

  const value = N.reduce((sum, curr, index) =>  sum + curr*G[index], 0)
  return { r: value, g: value, b: value, a: pixel.a }
}

export function confidenceMap(alphaMatte) {
  let confidence = alphaMatte.clone()

  alphaMatte.scan(0, 0, alphaMatte.bitmap.width, alphaMatte.bitmap.height,
    (x, y) => {
    const pixel = beta(alphaMatte, x, y)
    const hex = jimp.rgbaToInt(pixel.r, pixel.g, pixel.b, pixel.a)
    confidence.setPixelColor(hex, x, y)
  })

  return confidence
}
