<template>
  <Page class="page">
    <SlideContainer id="slides" class="action-bar" pageIndicators="true" ref="slider" @changed="onFinish()">
      <Slide>
        <FlexboxLayout flexDirection="column">
          <Label text="Faça Login"/>
          <Image src="~/images/tour_boas_vindas_login.jpg" height="70%" />
          <Button class="btn btn-rounded-lg clear" text="Niceee" scaleX="10" scaleY="10" ref="btn1" @loaded="onLoaded($refs.btn1)" @tap="proximo()"></Button>
        </FlexboxLayout>
      </Slide>
      <Slide >
        <FlexboxLayout flexDirection="column">
          <Label text="Faça Login" />
          <Image src="~/images/tour_boas_vindas_preenchimento_lista.png" height="70%" />
          <Button  v-if="currentIndex === 1" class="btn btn-rounded-lg clear" text="wow" scaleX="10" scaleY="10" ref="btn2" @loaded="onLoaded($refs.btn2)" @tap="proximo()"></Button>
        </FlexboxLayout>
      </Slide>
      <Slide >
        <FlexboxLayout flexDirection="column">
          <Label text="Faça Login" />
          <Image src="~/images/tour_boas_vindas_preenchimento_previa.png" height="70%" />
          <Button  v-if="currentIndex === 2" class="btn btn-rounded-lg clear" text="iei" scaleX="10" scaleY="10" ref="btn3" @loaded="onLoaded($refs.btn3)" @tap="proximo()"></Button>
        </FlexboxLayout>
      </Slide>
      <Slide >
        <FlexboxLayout flexDirection="column">
          <Label text="Faça Login"  />
          <Image src="~/images/tour_boas_vindas_refresh.png" height="70%" />
          <Button  v-if="currentIndex === 3" class="btn btn-rounded-lg clear" text="adios" scaleX="10" scaleY="10" ref="btn4" @loaded="onLoaded($refs.btn4)" @tap="$modal.close()"></Button>
        </FlexboxLayout>
      </Slide>
    </SlideContainer>
  </Page>
</template>

<script>

    import Vue from 'nativescript-vue';
    Vue.registerElement("SlideContainer", () => require("nativescript-slides").SlideContainer);
    Vue.registerElement("Slide", () => require("nativescript-slides").Slide);

    export default {
        data () {
            return {
                currentIndex:0
            };
        },
        methods: {
            onFinish: function(){
                this.currentIndex = this.$refs.slider.nativeView.currentIndex;
            },
            proximo: function () {
                this.$refs.slider.nativeView.nextSlide();
            },
            onLoaded: function (btn) {
            btn.nativeView.animate({
                    scale: { x: 1.0, y: 1.0 },
                    opacity:1,
                    duration: 500
                });
            }
        }
    };
</script>

<style scoped>
  .slide-1{
    background-color: darkslateblue;
  }

  Label{
    text-align: center;
    width: 100%;
    font-size: 35;
    margin-top: 35;
  }

  .clear{
    opacity: 0;
  }
</style>
