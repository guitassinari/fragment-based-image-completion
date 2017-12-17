import jimp from 'jimp'
const RGB = ['r', 'g', 'b']

function forEachRgbIn(pixel, operation){
  let resultPixel = RGB.reduce((newPixel, colorKey) => {
    newPixel[colorKey] = operation(colorKey)
    return newPixel
  }, {})
  resultPixel.a = pixel.a
  return resultPixel
}

export function sumImages(image, otherImage){
  return pixelWiseOperation(image, otherImage, (pixel, otherPixel) => {
    return forEachRgbIn(pixel, colorKey => {
      return Math.min(pixel[colorKey] + otherPixel[colorKey], 255)
    })
  })
}

export function negativeImage(image){
  return pixelWiseOperation(image, image, (pixel, otherPixel) => {
    return forEachRgbIn(pixel, colorKey => {
      return Math.max(255 - pixel[colorKey], 0)
    })
  })
}

export function multiplyImages(image, otherImage){
  return pixelWiseOperation(image, otherImage, (pixel, otherPixel) => {
    return forEachRgbIn(pixel, colorKey => {
      return Math.round((pixel[colorKey]*otherPixel[colorKey])/255)
    })
  })
}

export function pixelWiseOperation(image, otherImage, operation){
  validateImageSizes(image, otherImage)
  let result = newImageOfSameSizeAs(image)
  image.scan(0,0, image.bitmap.width, image.bitmap.height, (x, y, dx) => {
    const pixelColor = operation(
      jimp.intToRGBA(image.getPixelColor(x,y)),
      jimp.intToRGBA(otherImage.getPixelColor(x,y))
    )
    result.setPixelColor(jimp.rgbaToInt(pixelColor.r, pixelColor.g, pixelColor.b, pixelColor.a),x,y)
  })

  return result
}

export function newImageOfSameSizeAs(image, pixelDefaultColor = 0){
  return new jimp(
    image.bitmap.height,
    image.bitmap.height,
    pixelDefaultColor
  )
}

export function validateImageSizes(image, otherImage){
  if(!image || !otherImage){
    throw 'Imagem indefinida'
  }
  if(image.bitmap.height !== otherImage.bitmap.height){
    throw `Imagens com alturas diferentes: ${image.bitmap.height} VS ${otherImage.bitmap.height}`
  }
  if(image.bitmap.width !== otherImage.bitmap.width){
    throw 'Imagens com larguras diferentes : ${image.bitmap.width} VS ${otherImage.bitmap.width}'
  }
}
