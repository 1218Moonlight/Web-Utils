import jpeg_init from "./jpeg_init";
import {hex2bin, hex2dec, toHexString} from "../utils/hex";

export default class jpeg_utils extends jpeg_init {
    protected offsetLog(tag: string, hexMsg: string, info: string = "") {
        console.log("[ offset ]", this.offset, "{ " + tag + " }", hexMsg, info);
    }

    protected offsetDecLog(tag: string, hexMsg: string) {
        console.log("[ offset ]", this.offset, "{ " + tag + " }", hexMsg, "decimal", hex2dec(hexMsg))
    }

    protected offsetDataLengthLog(tag: string, hexMsg: string, contentLength: number) {
        console.log("[ offset ]", this.offset, "{ " + tag + " }", hexMsg, "decimal", hex2dec(hexMsg), "content length", contentLength)
    }

    protected headerSlice(endOffset: number): string {
        let v = toHexString(this.buffer.slice(this.offset, this.offset + endOffset));
        this.offset += endOffset;
        return v
    }

    protected headerView(endOffset: number): string {
        let v = toHexString(this.buffer.slice(this.fake_offset, this.fake_offset + endOffset));
        this.fake_offset += endOffset;
        return v
    }

    protected markerCheck(target: string): boolean {
        return this.marker === this.markerStr2Hex.get(target);
    }

    protected fake_markerCheck(target: string): boolean {
        return this.fake_marker === this.markerStr2Hex.get(target)
    }

    protected checkFF00(target: string) {
        return target === "FF00"
    }

    protected getMarker(): string {
        let marker = this.headerSlice(2);
        console.log("=== [ " + this.markerHex2Str.get(marker) + " ] ===");
        this.offsetLog("Marker", marker);
        return marker
    }

    protected segmentDataLength() {
        let dataLength = this.headerSlice(2);
        let content_length = hex2dec(dataLength) - 2;
        this.offsetDataLengthLog("Data length", dataLength, content_length);
    }

    protected getYCbCr() {
        console.log("=== [ Y ] ===");
        this.getComponentSpecific();
        console.log("=== [ Cb ] ===");
        this.getComponentSpecific();
        console.log("=== [ Cr ] ===");
        this.getComponentSpecific();
    }

    protected getComponentSpecific() {
        this.offsetLog("Component ID", this.headerSlice(1));
        this.offsetLog("Sampling Frequency", this.headerSlice(1));
        this.offsetLog("Quantization table ID", this.headerSlice(1));
    }

    protected getHuffmanTable() {
        let tableId = this.headerSlice(1);
        this.offsetDecLog("table id", tableId);
        let symbolscount = this.getHuffmanCodeCounts();
        this.offsetLog("symbols", this.headerSlice(symbolscount))
    }

    protected getHuffmanCodeCounts(): number {
        console.log("=== [ huffman code counts ] ===");
        let symbolsCount = 0;
        for (let i = 1; i <= 16; i++) {
            let count = this.headerSlice(1);
            this.offsetLog(`${i}bit`, ` -> ${count}`);
            symbolsCount += hex2dec(count)
        }
        console.log("[total symbolsCount]", symbolsCount);
        return symbolsCount
    }

    protected getComponentCount(): number {
        let componentCount = this.headerSlice(1);
        this.offsetDecLog("component count", componentCount);
        return hex2dec(componentCount)
    }


    protected getScanDescription(componentCount: number) {
        for (let i = 1; i <= componentCount; i++) {
            console.log(`=== [ Scan Description${i} ] ===`);
            this.offsetLog("Component ID", this.headerSlice(1));
            this.offsetLog("Huffman table ID", this.headerSlice(1))
        }
    }

    protected getHuffmanCodedData() {
        this.offsetLog("huffman code data", this.headerSlice(this.nextTargetMarker()))
    }

    protected nextTargetMarker(): number {
        this.fake_offset = this.offset;
        let hexKeep = [];
        while (true) {
            if (hexKeep.length === 3) {
                hexKeep[0] = hexKeep[1];
                hexKeep[1] = hexKeep[2];
                hexKeep.pop();
                this.fake_marker = `${hexKeep[0]}${hexKeep[1]}`;
                if (this.fake_markerCheck("SOI")) {
                    break
                } else if (this.fake_markerCheck("APP0") || this.fake_markerCheck("APP1")) {
                    break
                } else if (this.fake_markerCheck("SOF0") || this.fake_markerCheck("SOF1") || this.fake_markerCheck("SOF2")) {
                    break
                } else if (this.fake_markerCheck("DHT")) {
                    break
                } else if (this.fake_markerCheck("DQT")) {
                    break
                } else if (this.fake_markerCheck("SOS")) {
                    break
                } else if (this.fake_markerCheck("EOI")) {
                    break
                }
            }
            hexKeep.push(this.headerView(1));
        }
        return this.fake_offset - this.offset - 2;
    }

    protected hex2bin(hexString: string): Array<string> {
        let check2hex: Array<string> = [];
        let binalry: Array<string> = [];
        let count: number = 0;
        while (true) {
            if (check2hex.length === 2) {
                let target = `${check2hex[0]}${check2hex[1]}`;
                binalry.push(hex2bin(target));
                check2hex = []
            } else if (count > hexString.length) {
                break
            }
            check2hex.push(hexString[count]);
            count++
        }
        return binalry
    }
}
