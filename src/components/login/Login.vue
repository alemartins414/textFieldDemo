<template>
    <Page ref="page" :class="pageClasses" actionBarHidden="true" backgroundSpanUnderStatusBar="true">
        <GridLayout class='login'>

            <!-- background -->
            <GridLayout ref="background" scaleX="1.4" scaleY="1.4" backgroundImage="~/images/bg_login.jpg" class="background" @loaded="startBackgroundAnimation()"></GridLayout>
            <LoginMain ref="loginMain" @close="closeModal()"></LoginMain>
        </GridLayout>
    </Page>
</template>
<script>
    import * as platformModule from 'tns-core-modules/platform'
    import LoginMain from './LoginMain.vue'

    export default {
        components: {
            LoginMain
        },
        computed: {
            pageClasses: function () {
                return {
                    'platform-ios': platformModule.isIOS,
                    'platform-android': platformModule.isAndroid
                }
            }
        },
        methods: {
            startBackgroundAnimation: function() {
                console.log('starting bg animation...')
                this.$refs.background.nativeView.animate({
                    scale: { x: 1.0, y: 1.0 },
                    duration: 10000
                });
            },
            closeModal: function(){
                this.$modal.close();
            }
        },
        mounted() {
            console.log('LOGIN mounted')
        }
    }
</script>

<style lang="scss">
    .login {
        .background {
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
            background-color: #AAAAAA;
        }

        .logo-container {
            horizontal-align: center;
            height: 80;
        }
    }
</style>