<template>
    <v-container id="container">
        <v-flex>
            <v-label>Image -> Base64</v-label>
            <v-file-input accept="image/*" @change="changeImg" prepend-icon="mdi-camera"
                          small-chips show-size filled></v-file-input>
            <template v-if="targetImg.src !== '' && targetImg.src !== null">
                <v-img id="image" :src="targetImg.src" :height="targetImg.height" :width="targetImg.width"/>
                <v-textarea
                        :value="targetImg.src"
                        label="Base64"
                        disabled
                        full-width
                        outlined
                ></v-textarea>
                <v-btn @click="copyBase64all">Copy(all)</v-btn>
                <v-btn @click="copyBase64contentType">Copy(only content Type)</v-btn>
                <v-btn @click="copyBase64">Copy(only base64)</v-btn>
            </template>
        </v-flex>
    </v-container>
</template>

<script>
    export default {
        name: "ConvertBase64",
        data() {
            return {
                targetImg: new Image(),
            }
        },
        methods: {
            changeImg(e) {
                if (e === null) {
                    this.targetImg = new Image();
                } else {
                    let reader = new FileReader();
                    let img = new Image();

                    reader.onload = function (el) {
                        img.onload = function () {
                            this.targetImg = img;
                        }.bind(this);

                        img.src = el.currentTarget.result;
                        img.title = img.alt = e.name
                    }.bind(this);

                    reader.readAsDataURL(e);
                }
            },
            copyBase64all() {
                let t = document.createElement("textarea");
                document.body.appendChild(t);
                t.value = this.targetImg.src;
                t.select();
                document.execCommand('copy');
                document.body.removeChild(t);
            },
            copyBase64contentType() {
                let t = document.createElement("textarea");
                document.body.appendChild(t);
                t.value = this.targetImg.src.split(",")[0];
                t.select();
                document.execCommand('copy');
                document.body.removeChild(t);
            },
            copyBase64() {
                let t = document.createElement("textarea");
                document.body.appendChild(t);
                t.value = this.targetImg.src.split(",")[1];
                t.select();
                document.execCommand('copy');
                document.body.removeChild(t);
            },
        }
    }
</script>

<style scoped>
    #image {
        max-width: 500px;
        max-height: 300px;
        margin-bottom: 20px;
    }

    #container {
        border: thick double cadetblue;
        margin-top: 20px;
    }

    @media (max-width: 600px) {
        #image {
            max-width: 300px;
            max-height: 100px;
            margin-bottom: 10px;
        }

        #container {
            border: thick double coral;
            margin-top: 10px;
        }
    }
</style>
