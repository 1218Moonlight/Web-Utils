<template>
    <v-container id="container">
        <v-flex>
            <v-label>base64 -> Hex</v-label>

            <v-textarea
                    @change="change"
                    label="Base64"
                    full-width
                    outlined
            ></v-textarea>
            <template v-if="targetBase64 !== '' && targetBase64 !== null">
                <v-btn @click="Convert">Convert</v-btn>
            </template>
            <template v-if="targetHex !== '' && targetHex !== null">
                <v-textarea
                        :value="targetHex"
                        label="Binary"
                        disabled
                        full-width
                        outlined
                ></v-textarea>
                <v-btn @click="Copy">Copy</v-btn>
            </template>
        </v-flex>
    </v-container>
</template>

<script>
    export default {
        name: "Base64toHex",
        data() {
            return {
                targetBase64: "",
                targetHex: ""
            }
        },
        methods: {
            change(e) {
                this.targetBase64 = e
            },
            Convert() {
                let raw = atob(this.targetBase64);
                let HEX = '';
                for (let i = 0; i < raw.length; i++) {
                    let _hex = raw.charCodeAt(i).toString(16);
                    HEX += (_hex.length === 2 ? _hex : '0' + _hex);
                }
                this.targetHex = HEX.toUpperCase()
            },
            Copy(){
                let t = document.createElement("textarea");
                document.body.appendChild(t);
                t.value = this.targetHex;
                t.select();
                document.execCommand('copy');
                document.body.removeChild(t);
            }
        }
    }
</script>

<style scoped>
    #container {
        border: thick double chartreuse;
        margin-top: 20px;
    }

    @media (max-width: 600px) {
        #container {
            border: thick double blue;
            margin-top: 10px;
        }
    }
</style>
