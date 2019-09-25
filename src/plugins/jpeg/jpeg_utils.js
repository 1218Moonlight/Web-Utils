"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var jpeg_init_1 = require("./jpeg_init");
var hex_1 = require("../utils/hex");
var jpeg_utils = /** @class */ (function (_super) {
    __extends(jpeg_utils, _super);
    function jpeg_utils() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    jpeg_utils.prototype.offsetLog = function (tag, hexMsg, info) {
        if (info === void 0) { info = ""; }
        console.log("[ offset ]", this.offset, "{ " + tag + " }", hexMsg, info);
    };
    jpeg_utils.prototype.offsetDecLog = function (tag, hexMsg) {
        console.log("[ offset ]", this.offset, "{ " + tag + " }", hexMsg, "decimal", hex_1.hex2dec(hexMsg));
    };
    jpeg_utils.prototype.offsetDataLengthLog = function (tag, hexMsg, contentLength) {
        console.log("[ offset ]", this.offset, "{ " + tag + " }", hexMsg, "decimal", hex_1.hex2dec(hexMsg), "content length", contentLength);
    };
    jpeg_utils.prototype.headerSlice = function (endOffset) {
        var v = hex_1.toHexString(this.buffer.slice(this.offset, this.offset + endOffset));
        this.offset += endOffset;
        return v;
    };
    jpeg_utils.prototype.headerView = function (endOffset) {
        var v = hex_1.toHexString(this.buffer.slice(this.fake_offset, this.fake_offset + endOffset));
        this.fake_offset += endOffset;
        return v;
    };
    jpeg_utils.prototype.markerCheck = function (target) {
        return this.marker === this.markerStr2Hex.get(target);
    };
    jpeg_utils.prototype.fake_markerCheck = function (target) {
        return this.fake_marker === this.markerStr2Hex.get(target);
    };
    jpeg_utils.prototype.getMarker = function () {
        var marker = this.headerSlice(2);
        console.log("=== [ " + this.markerHex2Str.get(marker) + " ] ===");
        this.offsetLog("Marker", marker);
        return marker;
    };
    jpeg_utils.prototype.segmentDataLength = function () {
        var dataLength = this.headerSlice(2);
        var content_length = hex_1.hex2dec(dataLength) - 2;
        this.offsetDataLengthLog("Data length", dataLength, content_length);
    };
    jpeg_utils.prototype.getYCbCr = function () {
        console.log("=== [ Y ] ===");
        this.getComponentSpecific();
        console.log("=== [ Cb ] ===");
        this.getComponentSpecific();
        console.log("=== [ Cr ] ===");
        this.getComponentSpecific();
    };
    jpeg_utils.prototype.getComponentSpecific = function () {
        this.offsetLog("Component ID", this.headerSlice(1));
        this.offsetLog("Sampling Frequency", this.headerSlice(1));
        this.offsetLog("Quantization table ID", this.headerSlice(1));
    };
    jpeg_utils.prototype.getHuffmanTable = function () {
        var tableId = this.headerSlice(1);
        this.offsetDecLog("table id", tableId);
        var symbolscount = this.getHuffmanCodeCounts();
        this.offsetLog("symbols", this.headerSlice(symbolscount));
    };
    jpeg_utils.prototype.getHuffmanCodeCounts = function () {
        console.log("=== [ huffman code counts ] ===");
        var symbolsCount = 0;
        for (var i = 1; i <= 16; i++) {
            var count = this.headerSlice(1);
            this.offsetLog(i + "bit", " -> " + count);
            symbolsCount += hex_1.hex2dec(count);
        }
        console.log("[total symbolsCount]", symbolsCount);
        return symbolsCount;
    };
    jpeg_utils.prototype.getComponentCount = function () {
        var componentCount = this.headerSlice(1);
        this.offsetDecLog("component count", componentCount);
        return hex_1.hex2dec(componentCount);
    };
    jpeg_utils.prototype.getScanDescription = function (componentCount) {
        for (var i = 1; i <= componentCount; i++) {
            console.log("=== [ Scan Description" + i + " ] ===");
            this.offsetLog("Component ID", this.headerSlice(1));
            this.offsetLog("Huffman table ID", this.headerSlice(1));
        }
    };
    jpeg_utils.prototype.getHuffmanCodedData = function () {
        this.offsetLog("huffman code data", this.headerSlice(this.nextTargetMarker()));
    };
    jpeg_utils.prototype.nextTargetMarker = function () {
        this.fake_offset = this.offset;
        var hexKeep = [];
        while (true) {
            if (hexKeep.length === 3) {
                hexKeep[0] = hexKeep[1];
                hexKeep[1] = hexKeep[2];
                hexKeep.pop();
                this.fake_marker = "" + hexKeep[0] + hexKeep[1];
                if (this.fake_markerCheck("SOI")) {
                    break;
                }
                else if (this.fake_markerCheck("APP0") || this.fake_markerCheck("APP1")) {
                    break;
                }
                else if (this.fake_markerCheck("SOF0") || this.fake_markerCheck("SOF1") || this.fake_markerCheck("SOF2")) {
                    break;
                }
                else if (this.fake_markerCheck("DHT")) {
                    break;
                }
                else if (this.fake_markerCheck("DQT")) {
                    break;
                }
                else if (this.fake_markerCheck("SOS")) {
                    break;
                }
                else if (this.fake_markerCheck("EOI")) {
                    break;
                }
            }
            hexKeep.push(this.headerView(1));
        }
        return this.fake_offset - this.offset - 2;
    };
    return jpeg_utils;
}(jpeg_init_1.default));
exports.default = jpeg_utils;
