<template>
    <!--<MapView :latitude="latitude" :ongitude="longitude" mapAnimationsEnabled="true" mapReady="onMapReady()", ref="map" v-model="map"  />-->
</template>

<script>
    import Vue from 'nativescript-vue';

    //Vue.registerElement("MapView", () => require("nativescript-google-maps-sdk").MapView);

    export default {
        name: "mapa",
        data(){
            return {
                latitude: -25.3894267,
                longitude: -49.2722997
            }

        },
        methods: {
            onMapReady: function () {
                console.log("map created");
            }
        }
    }
</script>