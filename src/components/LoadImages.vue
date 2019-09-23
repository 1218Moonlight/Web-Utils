<template>
    <v-form>
        <v-container id="container">
            <v-flex>
                <v-col cols="12" sm="6" md="3">
                    <v-text-field
                            label="Enter Directory Path for Images"
                            solo
                            @change="directoryPath"
                    ></v-text-field>
                </v-col>
            </v-flex>
        </v-container>
    </v-form>
</template>

<script>
    export default {
        name: "LoadImages",
        data() {
            return {
                directory_path: ""
            }
        },
        methods: {
            directoryPath(e) {
                console.log(e);
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
