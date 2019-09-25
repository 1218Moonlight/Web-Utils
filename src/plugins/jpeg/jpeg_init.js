"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jpeg_nit = /** @class */ (function () {
    function jpeg_nit(base64) {
        this.buffer = Buffer.from(base64, 'base64');
        this.offset = 0;
        this.fileSize = this.buffer.length;
        this.markerStr2Hex = new Map();
        this.markerStr2Hex.set("SOI", "FFD8");
        this.markerStr2Hex.set("APP0", "FFE0");
        this.markerStr2Hex.set("APP1", "FFE1");
        this.markerStr2Hex.set("SOF0", "FFC0");
        this.markerStr2Hex.set("SOF1", "FFC1");
        this.markerStr2Hex.set("SOF2", "FFC2");
        this.markerStr2Hex.set("DHT", "FFC4");
        this.markerStr2Hex.set("DQT", "FFDB");
        this.markerStr2Hex.set("SOS", "FFDA");
        this.markerStr2Hex.set("EOI", "FFD9");
        this.markerHex2Str = new Map();
        this.markerHex2Str.set("FFD8", "SOI");
        this.markerHex2Str.set("FFE0", "APP0");
        this.markerHex2Str.set("FFE1", "APP1");
        this.markerHex2Str.set("FFC0", "SOF0");
        this.markerHex2Str.set("FFC1", "SOF1");
        this.markerHex2Str.set("FFC2", "SOF2");
        this.markerHex2Str.set("FFC4", "DHT");
        this.markerHex2Str.set("FFDB", "DQT");
        this.markerHex2Str.set("FFDA", "SOS");
        this.markerHex2Str.set("FFD9", "EOI");
    }
    return jpeg_nit;
}());
exports.default = jpeg_nit;
