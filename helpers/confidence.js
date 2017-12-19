import React from 'react';
import {std, mean} from 'mathjs'
import pdf from 'distributions-normal-pdf'
import jimp from 'jimp'

const ERRO = -1;

const GAUSSIAN_FILTER = [
    [0.0625, 0.125, 0.0625],
    [0.125,  0.25,  0.125],
    [0.0625, 0.125, 0.0625]
];

function createArray(length) {
    let arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        let args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
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
    if(ii > 0 && jj > 0){
      upperPixelsCoordinates.push([ii-1, jj-1])
    }
    //upper
    if(jj > 0){
      upperPixelsCoordinates.push([ii, jj-1])
    }
    //upper right
    if(ii < M.bitmap.width && jj > 0){
      upperPixelsCoordinates.push([ii+1, jj-1])
    }

    //left
    if(ii > 0){
      middlePixelsCoordinates.push([ii-1, jj])
    }

    //the pixel
    middlePixelsCoordinates.push([ii, jj])

    //right
    if(ii < M.bitmap.width){
      middlePixelsCoordinates.push([ii+1, jj])
    }

    //bottom left
    if(ii > 0 && j < M.bitmap.height){
      bottomPixelsCoordinates.push([ii-1, jj+1])
    }

    //bottom
    if(j < M.bitmap.height){
      bottomPixelsCoordinates.push([ii, jj+1])
    }

    //botom right
    if(ii < M.bitmap.width && j < M.bitmap.height){
      bottomPixelsCoordinates.push([ii+1, jj+1])
    }

    //retorna matriz com valores RGBA dos pixels
    return [
      upperPixelsCoordinates.map( [x,y] => jimp.intToRGBA( M.getPixelColor(x,y) ) ),
      middlePixelsCoordinates.map( [x,y] => jimp.intToRGBA( M.getPixelColor(x,y) ) ),
      bottomPixelsCoordinates.map( [x,y] => jimp.intToRGBA( M.getPixelColor(x,y) ) ),
    ]

}

function inverse(number) {
    if (number == 0) {
        return 1;
    }
    else {
        return 0;
    }
}

function rgbToWhiteBlack(tuple) {
    if (tuple.r == 255 && tuple.g == 255 && tuple.b == 255) {
        return 1;
    } 
    else {
        return 0;
    }
}

function beta(alphaMatte, i, j) {
    
    let color = jimp.intToRGBA(alphaMatte.getPixelColor(i,j));

    if (rgbToWhiteBlack(color)) {
        return 1;
    }
    else {
        let N = neighborhood(alphaMatte, i, j);
        N = N.reduce( (a,b) => a.concat(b));
        
        N = N.map(function(tuple){return rgbToWhiteBlack(tuple)});
        
        let G = GAUSSIAN_FILTER.reduce( (a,b) => a.concat(b));
        for(let i = 0; i < N.length; i++){ 
            sum += N[i] * G[i];
        } 
    }
}

export function confidenceMap(alphaMatte) {
    let confidence = createArray(alphaMatte.bitmap.width, alphaMatte.bitmap.height);
    for (let j = 0; j < alphaMatte.bitmap.width; j++) {
        for (let i = 0; i < alphaMatte.bitmap.height; i++) {
            confidence[i][j] = beta(alphaMatte, i, j);
        }
    }

}
