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
var hex_1 = require("../utils/hex");
var jpeg_utils_1 = require("./jpeg_utils");
// Todo: Header 정보 Html에 표기. Header情報をHTMLに表示
var JPEG = /** @class */ (function (_super) {
    __extends(JPEG, _super);
    function JPEG() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JPEG.prototype.header = function () {
        console.log("=== [ Image Headers ] ===");
        while (true) {
            this.marker = this.getMarker();
            if (this.markerCheck("SOI")) {
                // Always FFD8 (first 2byte)
            }
            else if (this.markerCheck("APP0") || this.markerCheck("APP1")) {
                this.APPn();
            }
            else if (this.markerCheck("SOF0") || this.markerCheck("SOF1") || this.markerCheck("SOF2")) {
                this.SOFn();
            }
            else if (this.markerCheck("DHT")) {
                this.DHT();
            }
            else if (this.markerCheck("DQT")) {
                this.DQT();
            }
            else if (this.markerCheck("SOS")) {
                this.SOS();
            }
            else if (this.markerCheck("EOI")) {
                break;
            }
            else {
                console.log("[ ERROR ]", "marker doesn't match. [value]", this.marker);
                break;
            }
        }
    };
    JPEG.prototype.Decode = function () {
        var imageData = this.imageData();
        this.VLD(imageData);
    };
    JPEG.prototype.imageData = function () {
        console.log("=== [ Image Data ] ===");
        this.fake_offset = this.offset;
        var hexKeep = [];
        var imageData = "";
        while (true) {
            if (hexKeep.length === 3) {
                hexKeep[0] = hexKeep[1];
                hexKeep[1] = hexKeep[2];
                hexKeep.pop();
                this.fake_marker = "" + hexKeep[0] + hexKeep[1];
                if (this.fake_markerCheck("SOS")) {
                    // console.log(toHexString(this.buffer.slice(this.fake_offset-2, this.fileSize)));
                    console.log("segment: ", hex_1.toHexString(this.buffer.slice(this.fake_offset - 2, this.fileSize - 2)));
                    // FFDA 이후 12byte, FFDA以降の12byte
                    console.log("additional data : ", hex_1.toHexString(this.buffer.slice(this.fake_offset, this.fake_offset + 12)));
                    // VLD를 할 실제 데이터, VLDをする実際のデータ
                    imageData = hex_1.toHexString(this.buffer.slice(this.fake_offset + 12, this.fileSize - 2));
                    console.log("Image Data : ", hex_1.toHexString(this.buffer.slice(this.fake_offset + 12, this.fileSize - 2)));
                    break;
                }
            }
            else if (this.fileSize < this.fake_offset) {
                console.log("[ ERROR ]", "marker doesn't match. [value]", this.fake_marker);
                break;
            }
            hexKeep.push(this.headerView(1));
        }
        // FF는 JPEG에서 마커로 사용. 하지만 뒤에 00이 붙으면 마커가 아님을 표시.
        // FFはJPEGでMarkerとして使用。でもその次に00が付いたらMarkerではない！
        return imageData.replace("FF00", "FF");
    };
    JPEG.prototype.VLD = function (imageData) {
        // console.log(imageData);
        // console.log(hex2bin("FC"));
        var imageDataBinaryArray = this.hex2bin(imageData);
        console.log(imageDataBinaryArray); // todo: Huffman table...
    };
    JPEG.prototype.APPn = function () {
        this.segmentDataLength();
        this.JFIF();
    };
    JPEG.prototype.JFIF = function () {
        console.log("=== [ JFIF ] ===");
        this.offsetLog("Identifier", this.headerSlice(5), "-> JFIF (content Type)");
        var majorVersionId = this.headerSlice(1);
        var minerVersionId = this.headerSlice(1);
        this.offsetLog("JFIF version", hex_1.hex2dec(majorVersionId) + "." + hex_1.hex2dec(minerVersionId));
        var units = this.headerSlice(1);
        this.offsetDecLog("Density units", units);
        var Xdensity = this.headerSlice(2);
        var Ydensity = this.headerSlice(2);
        this.offsetDecLog("Xdensity", Xdensity);
        this.offsetDecLog("Ydensity", Ydensity);
        var Xthumbnail = this.headerSlice(1);
        var Ythumbnail = this.headerSlice(1);
        this.offsetDecLog("Xthumbnail", Xthumbnail);
        this.offsetDecLog("Ythumbnail", Ythumbnail);
        if (hex_1.hex2dec(Xthumbnail) !== 0 && hex_1.hex2dec(Ythumbnail) !== 0) {
            // TODO...
            var thumbnail = 3 * hex_1.hex2dec(Xthumbnail) * hex_1.hex2dec(Ythumbnail);
            this.offsetDecLog("Thumbnail", this.headerSlice(thumbnail));
        }
    };
    JPEG.prototype.DQT = function () {
        var dataLength = this.headerSlice(2);
        var content_length = hex_1.hex2dec(dataLength) - 2;
        this.offsetDataLengthLog("Data length", dataLength, content_length);
        this.offsetLog("Quantization table", this.headerSlice(content_length));
    };
    JPEG.prototype.SOFn = function () {
        this.segmentDataLength();
        this.offsetLog("sampling precision", this.headerSlice(1));
        this.offsetDecLog("Image height", this.headerSlice(2));
        this.offsetDecLog("Image width", this.headerSlice(2));
        this.offsetLog("No fo components", this.headerSlice(1));
        this.getYCbCr();
    };
    JPEG.prototype.DHT = function () {
        this.segmentDataLength();
        this.getHuffmanTable();
    };
    JPEG.prototype.SOS = function () {
        this.segmentDataLength();
        var componentcount = this.getComponentCount();
        this.getScanDescription(componentcount);
        this.offsetDecLog("Spectral selection start", this.headerSlice(1));
        this.offsetDecLog("Spectral selection end", this.headerSlice(1));
        this.offsetLog("Successive approximation", this.headerSlice(1));
        this.getHuffmanCodedData();
    };
    return JPEG;
}(jpeg_utils_1.default));
exports.default = JPEG;
