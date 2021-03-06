"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toHexString(byteArray) {
    return Array.from(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2).toUpperCase();
    }).join('');
}
exports.toHexString = toHexString;
function hex2dec(hexString) {
    return parseInt(hexString, 16);
}
exports.hex2dec = hex2dec;
function hex2bin(hex) {
    return ("00000000" + (parseInt(hex, 16)).toString(2)).substr(-8);
}
exports.hex2bin = hex2bin;
