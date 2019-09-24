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
                console.log(e)
            }
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
