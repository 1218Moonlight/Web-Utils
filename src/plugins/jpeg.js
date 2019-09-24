"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hex_1 = require("./utils/hex");
var JPEG = /** @class */ (function () {
    function JPEG(base64) {
        this.buffer = Buffer.from(base64, 'base64');
        this.offset = 0;
    }
    JPEG.prototype.header = function () {
        console.log("offset:", this.offset, "[ SOI marker ]", this.headerSlice(2)); // Always FFD8 (first 2byte)
        console.log("offset:", this.offset, "[ APP0 marker ]", this.headerSlice(2)); // Always FFE0 (2byte)
        var hex_dataLength = this.headerSlice(2);
        var dec_dataLength = hex_1.hex2dec(hex_dataLength);
        var content_length = dec_dataLength - 2;
        console.log("offset:", this.offset, "[ Data length ]", "hex:", hex_dataLength, "decimal:", dec_dataLength, "content length:", content_length);
        console.log("offset:", this.offset, "[ Identifier ]", this.headerSlice(5), "-> JFIF", "(content Type)"); // Always 4A46494600 -> (JFIF)
        var majorVersionId = this.headerSlice(1);
        var minerVersionId = this.headerSlice(1);
        console.log("offset:", this.offset, "[ JFIF version ]", hex_1.hex2dec(majorVersionId) + "." + hex_1.hex2dec(minerVersionId));
        var units = this.headerSlice(1);
        console.log("offset:", this.offset, "[ Density units ]", units, "decimal:", hex_1.hex2dec(units));
        var Xdensity = this.headerSlice(2);
        var Ydensity = this.headerSlice(2);
        console.log("offset:", this.offset, "[ Xdensity ]", Xdensity, "decimal:", hex_1.hex2dec(Xdensity));
        console.log("offset:", this.offset, "[ Ydensity ]", Ydensity, "decimal:", hex_1.hex2dec(Ydensity));
        var Xthumbnail = this.headerSlice(1);
        var Ythumbnail = this.headerSlice(1);
        console.log("offset:", this.offset, "[ Xthumbnail ]", Xthumbnail, "decimal:", hex_1.hex2dec(Xthumbnail));
        console.log("offset:", this.offset, "[ Ythumbnail ]", Ythumbnail, "decimal:", hex_1.hex2dec(Ythumbnail));
        if (hex_1.hex2dec(Xthumbnail) !== 0 && hex_1.hex2dec(Ythumbnail) !== 0) {
            // TODO...
            var thumbnail = 3 * hex_1.hex2dec(Xthumbnail) * hex_1.hex2dec(Ythumbnail);
            console.log("[ Thumbnail Data ]", this.headerSlice(thumbnail));
        }
        else {
            console.log("[ DQT marker ]", this.headerSlice(2)); // 항상 FF DB
            var dataLength = this.headerSlice(2);
            var content_length_1 = hex_1.hex2dec(dataLength) - 2;
            console.log("offset:", this.offset, "[ Data length ]", dataLength, "decimal:", hex_1.hex2dec(dataLength), "content length:", content_length_1);
            console.log("[ Quantization table ]", this.headerSlice(content_length_1));
            // console.log("offset:", this.offset, "[ Table Identifier ]", this.headerSlice(1));
            // TODO sof...
            console.log("offset:", this.offset, "[ SOF marker ]", this.headerSlice(2));
            var hex_dataLength_1 = this.headerSlice(2);
            var dec_dataLength_1 = hex_1.hex2dec(hex_dataLength_1);
            var content_length2 = dec_dataLength_1 - 2;
            console.log("offset:", this.offset, "[ Data length ]", "hex:", hex_dataLength_1, "decimal:", dec_dataLength_1, "content length:", content_length2);
        }
    };
    JPEG.prototype.headerSlice = function (endoffset) {
        var v = hex_1.toHexString(this.buffer.slice(this.offset, this.offset + endoffset));
        this.offset += endoffset;
        return v;
    };
    return JPEG;
}());
exports.default = JPEG;
