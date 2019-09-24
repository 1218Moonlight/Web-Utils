import {toHexString, hex2dec} from "./utils/hex"

export default class JPEG {
    buffer: Buffer;
    offset: number;

    constructor(base64: string) {
        this.buffer = Buffer.from(base64, 'base64');
        this.offset = 0
    }

    header() {
        console.log("offset:", this.offset, "[ SOI marker ]", this.headerSlice(2)); // Always FFD8 (first 2byte)
        console.log("offset:", this.offset, "[ APP0 marker ]", this.headerSlice(2)); // Always FFE0 (2byte)
        let hex_dataLength = this.headerSlice(2);
        let dec_dataLength = hex2dec(hex_dataLength);
        let content_length = dec_dataLength - 2;
        console.log("offset:", this.offset, "[ Data length ]", "hex:", hex_dataLength, "decimal:", dec_dataLength, "content length:", content_length);
        console.log("offset:", this.offset, "[ Identifier ]", this.headerSlice(5), "-> JFIF", "(content Type)"); // Always 4A46494600 -> (JFIF)
        let majorVersionId = this.headerSlice(1);
        let minerVersionId = this.headerSlice(1);
        console.log("offset:", this.offset, "[ JFIF version ]", hex2dec(majorVersionId) + "." + hex2dec(minerVersionId));
        let units = this.headerSlice(1);
        console.log("offset:", this.offset, "[ Density units ]", units, "decimal:", hex2dec(units));
        let Xdensity = this.headerSlice(2);
        let Ydensity = this.headerSlice(2);
        console.log("offset:", this.offset, "[ Xdensity ]", Xdensity, "decimal:", hex2dec(Xdensity));
        console.log("offset:", this.offset, "[ Ydensity ]", Ydensity, "decimal:", hex2dec(Ydensity));
        let Xthumbnail = this.headerSlice(1);
        let Ythumbnail = this.headerSlice(1);

        console.log("offset:", this.offset, "[ Xthumbnail ]", Xthumbnail, "decimal:", hex2dec(Xthumbnail));
        console.log("offset:", this.offset, "[ Ythumbnail ]", Ythumbnail, "decimal:", hex2dec(Ythumbnail));
        if (hex2dec(Xthumbnail) !== 0 && hex2dec(Ythumbnail) !== 0) {
            // TODO...
            let thumbnail = 3 * hex2dec(Xthumbnail) * hex2dec(Ythumbnail);
            console.log("[ Thumbnail Data ]", this.headerSlice(thumbnail));
        } else {
            console.log("[ DQT marker ]", this.headerSlice(2)); // 항상 FF DB
            let dataLength = this.headerSlice(2);
            let content_length = hex2dec(dataLength) - 2;
            console.log("offset:", this.offset, "[ Data length ]", dataLength, "decimal:", hex2dec(dataLength), "content length:", content_length);
            console.log("[ Quantization table ]", this.headerSlice(content_length));
            // console.log("offset:", this.offset, "[ Table Identifier ]", this.headerSlice(1));

            // TODO sof...
            console.log("offset:", this.offset, "[ SOF marker ]", this.headerSlice(2));
            let hex_dataLength = this.headerSlice(2);
            let dec_dataLength = hex2dec(hex_dataLength);
            let content_length2 = dec_dataLength - 2;
            console.log("offset:", this.offset, "[ Data length ]", "hex:", hex_dataLength, "decimal:", dec_dataLength, "content length:", content_length2);
        }

    }

    private headerSlice(endoffset: number): string {
        let v = toHexString(this.buffer.slice(this.offset, this.offset + endoffset));
        this.offset += endoffset;
        return v
    }
}
