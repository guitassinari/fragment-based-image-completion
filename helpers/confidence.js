import React from 'react';
import {std, mean} from 'mathjs'

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

function neighborhood(M, ii, jj) {
    if (ii >= M.length || ii < 0 || jj >= M[0].length || jj < 0) {
        return ERRO; //This will probabily cause 
    }

    if (ii > 0) {
        if (ii < (M.length - 1)) {
            if (jj > 0) {
                if (jj < (M[ii].length - 1)) {
                    return [[M[ii - 1][jj-1], M[ii-1][jj], M[ii-1][jj+1]], [M[ii][jj-1], M[ii][jj], M[ii][jj+1]], [M[ii+1][jj-1], M[ii+1][jj], M[ii+1][jj+1]]];
                } 
                else {
                    return [M[ii - 1][jj-1], M[ii-1][jj], M[ii][jj-1], M[ii][jj], M[ii+1][jj-1], M[ii+1][jj]];
                }
            } 
            else {
            
            }
        } 
        else {

        }
    } 
    else {

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
    }
}

export function confidenceMap(alphaMatte) {
    let confidence = createArray(alphaMatte.length, alphaMatte[0].length);
    for (var j = 0; j < alphaMatte.length; j++) {
        for (var i = 0; i < alphaMatte[j].length; i++) {
            confidence[i][j] = beta(alphaMatte, i, j);
        }
    }
    	
}