import React from 'react';
import {std, mean} from 'mathjs'
import pdf from 'distributions-normal-pdf'
import jimp from 'jimp'

const ERRO = -1;

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

function beta(alphaMatte, i, j) {
    if (alphaMatte[i][j] == 0) {
        return 1;
    }
    else {
        let N = neighborhood(alphaMatte, i, j);
        let mu = mean(N);
        let sdeviation = std(N);
        let sum = 0;

        for (let count_i = 0; count_i < N.length; count_i++) {
            for (let count_j = 0; count_j < N[0].length; count_j++) {
                sum += (pdf(N[count_i][count_j], mu, sdeviation) * inverse(N[count_i][count_j]));
            }
        }
    }
}

export function confidenceMap(alphaMatte) {
    let confidence = createArray(alphaMatte.length, alphaMatte[0].length);
    for (let j = 0; j < alphaMatte.length; j++) {
        for (let i = 0; i < alphaMatte[j].length; i++) {
            confidence[i][j] = beta(alphaMatte, i, j);
        }
    }

}
