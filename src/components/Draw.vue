<template>
    <AbsoluteLayout>
        <Image top="0" left="0" src="~/images/NativeScript-Vue.png" stretch="none" ref="imagem" @loaded="addGesture()" />
        <DrawingPad top="0" left="0"
                    height="200" width="400"
                    id="drawingPad"
                    penColor="#ff4081" penWidth="3"   />

    </AbsoluteLayout>
</template>

<script>
    import Vue from 'nativescript-vue';
    import * as gestures from "tns-core-modules/ui/gestures";

    Vue.registerElement("DrawingPad", () => require("nativescript-drawingpad").DrawingPad);

    export default {
        name: "draw",
        methods: {
            addGesture: function(){
                console.log('imagem carregada')
                this.$refs.imagem.addEventListener(gestures.GestureTypes.touch, function (args) {
                    console.log("Touch: x: " + args.getX() + " y: " + args.getY());
                });
            },
        }
    }
</script>

<style scoped>

</style>