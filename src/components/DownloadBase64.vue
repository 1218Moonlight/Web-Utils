<template>
    <v-container id="container">
        <v-flex>
            <v-label>Download Base64</v-label>

            <v-textarea
                    @change="change"
                    label="ContentType + Base64"
                    full-width
                    outlined
            ></v-textarea>
            <template v-if="targetImg.src !== '' && targetImg.src !== null">
                <v-btn @click="downloadImg">Download</v-btn>
            </template>
        </v-flex>
    </v-container>
</template>

<script>
    import down from 'downloadjs'

    export default {
        name: "DownloadBase64",
        data() {
            return {
                targetImg: new Image(),
            }
        },
        methods: {
            change(e) {
                let img = new Image();
                img.src = e;
                this.targetImg = img
            },
            downloadImg() {
                let srcArr = this.targetImg.src.split(',');
                let type = srcArr[0];
                // let base64 = srcArr[1];
                let base64 = this.targetImg.src.replace(/^data:image\/[^;]+/, 'data:application/octet-stream');
                let fileName = "image";

                if (type.indexOf("png") !== -1) {
                    down(base64, fileName+'.png', "image/png")
                } else if (type.indexOf("jpeg") !== -1 || type.indexOf("jpg") !== -1) {
                    down(base64, fileName+'.jpg', "image/jpg")
                } else if (type.indexOf("webp") !== -1) {
                    down(base64, fileName+'.webp', "image/webp")
                } else {
                    console.log(null)
                }
            },
        }
    }
</script>

<style scoped>

    #container {
        border: thick double coral;
        margin-top: 20px;
    }

    @media (max-width: 600px) {
        #container {
            border: thick double cadetblue;
            margin-top: 10px;
        }
    }
</style>
