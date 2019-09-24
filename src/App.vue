<template>
    <v-app>
        <v-app-bar app>
            <v-toolbar-title class="headline text-uppercase">
                <span>Web-Utils</span>
            </v-toolbar-title>
        </v-app-bar>

        <v-content>
            <ConvertBase64/>
            <Base64toHex/>
            <DownloadBase64/>
            <ImageHeaderViewer/>
        </v-content>
    </v-app>
</template>

<script>
    import ConvertBase64 from "./components/ConvertBase64";
    import DownloadBase64 from "./components/DownloadBase64";
    import Base64toHex from "./components/Base64toHex";
    import ImageHeaderViewer from "./components/ImageHeaderViewer"

    export default {
        name: 'App',
        components: {
            ConvertBase64,
            DownloadBase64,
            Base64toHex,
            ImageHeaderViewer
        },
        data: () => ({
            //
        }),
    };
</script>
