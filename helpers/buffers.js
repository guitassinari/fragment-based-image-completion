import jimp from 'jimp'


export function bufferToUrl(buffer){
  let blob = new Blob( [ buffer ], { type: "image/jpeg" } );
  let urlCreator = window.URL || window.webkitURL;
  let imageUrl = urlCreator.createObjectURL( blob );
  return imageUrl
}

export function removeBase64Prefix(url){
  const firstComma = url.indexOf(',')+1
  return url.slice(firstComma)
}

export function urlToJimp(image){
  const buffer = Buffer.from(removeBase64Prefix(image), 'base64')
  return jimp.read(buffer)
}
