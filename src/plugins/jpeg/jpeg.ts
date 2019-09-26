import {toHexString, hex2dec, hex2bin} from "../utils/hex"
import jpeg_fun from './jpeg_utils'

// Todo: Header 정보 Html에 표기. Header情報をHTMLに表示

export default class JPEG extends jpeg_fun {
    public header() {
        console.log("=== [ Image Headers ] ===");
        while (true) {
            this.marker = this.getMarker();
            if (this.markerCheck("SOI")) {
                // Always FFD8 (first 2byte)
            } else if (this.markerCheck("APP0") || this.markerCheck("APP1")) {
                this.APPn();
            } else if (this.markerCheck("SOF0") || this.markerCheck("SOF1") || this.markerCheck("SOF2")) {
                this.SOFn();
            } else if (this.markerCheck("DHT")) {
                this.DHT();
            } else if (this.markerCheck("DQT")) {
                this.DQT();
            } else if (this.markerCheck("SOS")) {
                this.SOS();
            } else if (this.markerCheck("EOI")) {
                break
            } else {
                console.log("[ ERROR ]", "marker doesn't match. [value]", this.marker);
                break
            }
        }
    }

    public Decode() {
        let imageData = this.imageData();
        this.VLD(imageData)
    }

    private imageData(): string { // FFDA(SOS) ~ FFD9(EOI)
        console.log("=== [ Image Data ] ===");
        this.fake_offset = this.offset;
        let hexKeep: Array<string> = [];
        let imageData: string = "";
        while (true) {
            if (hexKeep.length === 3) {
                hexKeep[0] = hexKeep[1];
                hexKeep[1] = hexKeep[2];
                hexKeep.pop();
                this.fake_marker = `${hexKeep[0]}${hexKeep[1]}`;
                if (this.fake_markerCheck("SOS")) {
                    // console.log(toHexString(this.buffer.slice(this.fake_offset-2, this.fileSize)));
                    console.log("segment: ", toHexString(this.buffer.slice(this.fake_offset - 2, this.fileSize - 2)));
                    // FFDA 이후 12byte, FFDA以降の12byte
                    console.log("additional data : ", toHexString(this.buffer.slice(this.fake_offset, this.fake_offset + 12)));
                    // VLD를 할 실제 데이터, VLDをする実際のデータ
                    imageData = toHexString(this.buffer.slice(this.fake_offset + 12, this.fileSize - 2));
                    console.log("Image Data : ", toHexString(this.buffer.slice(this.fake_offset + 12, this.fileSize - 2)));
                    break
                }
            } else if (this.fileSize < this.fake_offset) {
                console.log("[ ERROR ]", "marker doesn't match. [value]", this.fake_marker);
                break
            }
            hexKeep.push(this.headerView(1));
        }
        // FF는 JPEG에서 마커로 사용. 하지만 뒤에 00이 붙으면 마커가 아님을 표시.
        // FFはJPEGでMarkerとして使用。でもその次に00が付いたらMarkerではない！
        return imageData.replace("FF00", "FF");
    }

    private VLD(imageData: string) {
        // console.log(imageData);
        // console.log(hex2bin("FC"));
        let imageDataBinaryArray: Array<string> = this.hex2bin(imageData)
        console.log(imageDataBinaryArray) // todo: Huffman table...
    }

    protected APPn() { // Always FFEn (2byte)
        this.segmentDataLength();
        this.JFIF();
    }

    private JFIF() { // Always 4A46494600 -> (JFIF)
        console.log("=== [ JFIF ] ===");
        this.offsetLog("Identifier", this.headerSlice(5), "-> JFIF (content Type)");

        let majorVersionId = this.headerSlice(1);
        let minerVersionId = this.headerSlice(1);
        this.offsetLog("JFIF version", hex2dec(majorVersionId) + "." + hex2dec(minerVersionId));

        let units = this.headerSlice(1);
        this.offsetDecLog("Density units", units);

        let Xdensity = this.headerSlice(2);
        let Ydensity = this.headerSlice(2);
        this.offsetDecLog("Xdensity", Xdensity);
        this.offsetDecLog("Ydensity", Ydensity);

        let Xthumbnail = this.headerSlice(1);
        let Ythumbnail = this.headerSlice(1);
        this.offsetDecLog("Xthumbnail", Xthumbnail);
        this.offsetDecLog("Ythumbnail", Ythumbnail);

        if (hex2dec(Xthumbnail) !== 0 && hex2dec(Ythumbnail) !== 0) {
            // TODO...
            let thumbnail = 3 * hex2dec(Xthumbnail) * hex2dec(Ythumbnail);
            this.offsetDecLog("Thumbnail", this.headerSlice(thumbnail))
        }
    }

    private DQT() { // Always FFDB
        let dataLength = this.headerSlice(2);
        let content_length = hex2dec(dataLength) - 2;
        this.offsetDataLengthLog("Data length", dataLength, content_length);
        this.offsetLog("Quantization table", this.headerSlice(content_length));
    }

    private SOFn() { // Always FFC0 ~ FFC2
        this.segmentDataLength();
        this.offsetLog("sampling precision", this.headerSlice(1));
        this.offsetDecLog("Image height", this.headerSlice(2));
        this.offsetDecLog("Image width", this.headerSlice(2));
        this.offsetLog("No fo components", this.headerSlice(1));
        this.getYCbCr()
    }

    private DHT() { // Always FFC4
        this.segmentDataLength();
        this.getHuffmanTable()
    }

    private SOS() { // Always FFDA
        this.segmentDataLength();
        let componentcount = this.getComponentCount();
        this.getScanDescription(componentcount);
        this.offsetDecLog("Spectral selection start", this.headerSlice(1));
        this.offsetDecLog("Spectral selection end", this.headerSlice(1));
        this.offsetLog("Successive approximation", this.headerSlice(1));
        this.getHuffmanCodedData();
    }
}
