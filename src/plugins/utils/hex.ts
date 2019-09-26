export function toHexString(byteArray: Buffer) {
    return Array.from(byteArray, function (byte: number) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2).toUpperCase();
    }).join('')
}

export function hex2dec(hexString: string) {
    return parseInt(hexString, 16);
}

export function hex2bin(hex: string):string{
    return ("00000000" + (parseInt(hex, 16)).toString(2)).substr(-8);
}

