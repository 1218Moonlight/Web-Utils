<template>
    <v-container id="container">
        <v-flex>
            <v-label>Image Header Viewer</v-label>

            <v-textarea
                    @change="change"
                    label="Only Base64"
                    full-width
                    outlined
            ></v-textarea>
            <!--    <v-textarea-->
            <!--            :value="targetHeader"-->
            <!--            label="Binary"-->
            <!--            disabled-->
            <!--            full-width-->
            <!--            outlined-->
            <!--    ></v-textarea>-->
        </v-flex>
    </v-container>
</template>

<script>
    export default {
        name: "ImageHeaderViewer",
        data() {
            return {
                // targetHeader: ""
            }
        },
        methods: {
            change(e) {
                let buffer = Buffer.from(e, 'base64');
                console.log("[ SOI marker ]", this.toHexString(buffer.slice(0, 2))); // 항상 FF D8
                console.log("[ APP0 marker ]", this.toHexString(buffer.slice(2, 4))); // 항상 FF E0
                console.log("[ Data length ]", this.toHexString(buffer.slice(4, 6)));
                console.log("[ Identifier ]", this.toHexString(buffer.slice(6, 11)));
                console.log("[ JFIF version ]", this.toHexString(buffer.slice(11, 13)));
                console.log("[ Density units ]", this.toHexString(buffer.slice(13, 14)));
                console.log("[ Xdensity ]", this.toHexString(buffer.slice(14, 16)));
                console.log("[ Ydensity ]", this.toHexString(buffer.slice(16, 18)));
                let Xthumbnail = buffer.slice(18, 19);
                let Ythumbnail = buffer.slice(19, 20);
                console.log("[ Xthumbnail ]", this.toHexString(Xthumbnail));
                console.log("[ Ythumbnail ]", this.toHexString(Ythumbnail));
                if (Xthumbnail[0] !== 0 && Ythumbnail[0] !== 0) {
                    let thumbnail = 3 * Xthumbnail * Ythumbnail;
                    console.log("[ Thumbnail Data ]", this.toHexString(buffer.slice(20, (20+thumbnail))));
                } else {
                    console.log("[ DQT marker ]", this.toHexString(buffer.slice(20, 22))); // 항상 FF DB
                    console.log("[ Data length ]", this.toHexString(buffer.slice(22, 24)));
                    console.log("[ Quantization table ]", this.toHexString(buffer.slice(24, 89)));
                    console.log("[ Table Identifier ]", this.toHexString(buffer.slice(89, 91)));
                }


            },
            toHexString(byteArray) {
                return Array.from(byteArray, function (byte) {
                    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
                }).join('')
            },

        },
    }
</script>

<style scoped>
    #container {
        border: thick double steelblue;
        margin-top: 20px;
    }

    @media (max-width: 600px) {
        #container {
            border: thick double darkmagenta;
            margin-top: 10px;
        }
    }
</style>
