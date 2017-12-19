import React from 'react';
import {std, mean} from 'mathjs'
import pdf from 'distributions-normal-pdf'

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
                    return [[M[ii - 1][jj-1], M[ii-1][jj], M[ii-1][jj+1]], [M[ii][jj-1], M[ii][jj], M[ii][jj+1]], [M[ii+1][jj-1], M[ii+1][jj], M[ii+1][jj+1]]]; // 1 1
                } 
                else {
                    return [[M[ii - 1][jj-1], M[ii-1][jj]], [M[ii][jj-1], M[ii][jj]], [M[ii+1][jj-1], M[ii+1][jj]]]; // 1 2
                }
            } 
            else {
               return [[M[ii-1][jj], M[ii-1][jj+1]], [M[ii][jj], M[ii][j+1]], [M[ii+1][jj], M[ii+1][jj+1]]]; // 1 0         
            }
        } 
        else {
            if (jj > 0) {
                if (jj < (M[ii].length - 1)) {
                    return [[M[ii - 1][jj-1], M[ii-1][jj], M[ii-1][jj+1]], [M[ii][jj-1], M[ii][jj], M[ii][jj+1]]]; // 2 1
                } 
                else {
                    return [[M[ii - 1][jj-1], M[ii-1][jj]], [M[ii][jj-1], M[ii][jj]]]; // 2 2
                }
            }
            else {
               return [[M[ii-1][jj], M[ii-1][jj+1]], [M[ii][jj], M[ii][j+1]]]; // 2 0         
            }
        }
    } 
    else {
        if (jj > 0) {
            if (jj < (M[ii].length - 1)) {
                return [[M[ii][jj-1], M[ii][jj], M[ii][jj+1]], [M[ii+1][jj-1], M[ii+1][jj], M[ii+1][jj+1]]]; // 0 1
            } 
            else {
                return [[M[ii][jj-1], M[ii][jj]], [M[ii+1][jj-1], M[ii+1][jj]]]; // 0 2
            }
        }
        else {
            return [[M[ii][jj], M[ii][j+1]], [M[ii+1][jj], M[ii+1][jj+1]]]; // 0 0         
        }
    }
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