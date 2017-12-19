import jimp from 'jimp'
import {
  validateImageSizes,
  sumImages,
  negativeImage,
  multiplyImages,
} from '../helpers/image'

const DIFF_THRESHOLD = 0
const SCALE_FACTOR = 2
const RESIZE_MODE = jimp.HERMITE_RESIZE
const MAX_LEVELS = 8

export function approximate(originalImage, inverseMatte){
  validateImageSizes(originalImage, inverseMatte)
  let matte = negativeImage(inverseMatte)
  let imageWithoutSelectedArea = multiplyImages(originalImage, inverseMatte)
  let initialApproximation = sumImages(imageWithoutSelectedArea, matte)
  const log2 = Math.floor(Math.min(Math.log2(originalImage.bitmap.height, originalImage.bitmap.width))) - 1
  let pyramidLevel = Math.min(log2, MAX_LEVELS)
  let currentSample = initialApproximation
  let previousSample

  while(pyramidLevel > 0) {
    do{
      previousSample = currentSample
      let previousSampleSelectedArea = multiplyImages(previousSample, matte)
      currentSample = sumImages(previousSampleSelectedArea, imageWithoutSelectedArea)
      currentSample = resample(currentSample, pyramidLevel)
    }while(jimp.diff(currentSample, previousSample, DIFF_THRESHOLD).percent > 0)
    pyramidLevel--
  }
  return currentSample
}

function resample(image, times){
  let timesCounter = times
  while(timesCounter > 0){
    image.scale(1/SCALE_FACTOR, RESIZE_MODE)
    timesCounter--
  }
  while(timesCounter < times){
    image.scale(SCALE_FACTOR, RESIZE_MODE)
    timesCounter++
  }
  return image
}
