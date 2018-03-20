<template>
    <StackLayout ref="mainContainer" class="main-container" >


        <DockLayout  stretchLastChild="false" >
            <Label dock="left" text="x" @tap="$emit('close')" ></Label>
            <Label dock="right"   text="A" @tap="avancado = !avancado" ></Label>
        </DockLayout>

        <Label class="main-label" text="CheckObras" :color="isLoggingIn? 'black' : 'white'"></Label>

        <!-- form controls -->
        <TextField hint="E-mail" keyboardType="email" returnKeyType="next" @returnPress="focusPassword()"
                v-model="user.email" :iEnabled="!isAuthenticating" autocorrect="false" autocapitalizationType="none"
                :class="{ light: !isLoggingIn}" ></TextField>
        <TextField ref="password" hint="Senha" secure="true" returnKeyType="done" @returnPress="submit()"
                   v-model="user.password" :isEnabled="!isAuthenticating" :class="{ light: !isLoggingIn }" ></TextField>
        <TextField ref="empresa" hint="Empresa" returnKeyType="done" @returnPress="submit()"
                   v-model="user.company" v-if="avancado === true" :isEnabled="!isAuthenticating" :class="{ light: !isLoggingIn }"></TextField>

        <ActivityIndicator :busy="isAuthenticating"></ActivityIndicator>

        <!-- login / sign up button -->
        <Button
                :text="isLoggingIn ? 'Login' : 'Registrar'"
                :isEnabled="!isAuthenticating"
                class="submit-button"
                @tap="submit()"></Button>

        <!-- forgot password button -->
        <Label
                class="forgot-password-label"
                text="Esqueceu a senha?"
                @tap="forgotPassword()"
                :opacity="isLoggingIn ? 1 : 0"></Label>

        <!-- forgot password button
        <StackLayout ref="signUpStack" class="sign-up-stack" @tap="toggleDisplay()" >
            <Label :text="isLoggingIn ? 'Registre-se aqui' : 'Voltar ao Login'"></Label>
        </StackLayout>-->
    </StackLayout>
</template>

<script>
    import { Animation } from 'ui/animation'
    import { prompt } from "ui/dialogs"
    import { Color } from 'tns-core-modules/color'

    import * as http from 'tns-core-modules/http'

    export default {
        name: 'login-main',

        props: {
            visible: Boolean
        },

        data() {
            return {
                isLoggingIn: true,
                isAuthenticating: false,
                user: {},
                avancado: false
            }
        },

        watch: {
            visible: function(val) {
                // when element turns visible, start animations
                if (val) {
                    const animations = []

                    animations.push({ target: this.$refs.mainContainer.nativeView, opacity: 1, duration: 500 })

                    // Slide up the form controls and sign up container.
                    animations.push({ target: this.$refs.signUpStack.nativeView, translate: { x: 0, y: 0 }, opacity: 1, delay: 500, duration: 150 })
                    animations.push({ target: this.$refs.formControls.nativeView, translate: { x: 0, y: 0 }, opacity: 1, delay: 650, duration: 150 })

                    // Kick off the animation queue
                    new Animation(animations, false).play()
                }
            }
        },

        methods: {
            toggleDisplay() {
                this.isLoggingIn = !this.isLoggingIn;
                let mainContainer = this.$refs.mainContainer.nativeView
                mainContainer.animate({
                    backgroundColor: this.isLoggingIn ? new Color("white") : new Color("#301217"),
                    duration: 200
                });
            },

            focusPassword() {
                this.$refs.password.nativeView.focus();
            },

            submit() {
                console.log('submit', this.user)

                this.isAuthenticating = true;
                if (this.isLoggingIn) {
                    this.login();
                } else {
                    this.signUp();
                }
            },

            login() {
                this.$aura.callCommand('Login', [this.$aura.param('USERNAME', this.user.email), this.$aura.param('PASSWORD', this.user.password), this.$aura.param('REMEMBER_ME','1')]).then((result) => {
                    this.$aura.updateToken(result.RAIZ.AUTH_TOKEN);
                    this.$aura.verificaUsuarioLogado(this.$router, this.$store);
                    this.$emit('close');
                }).catch((error) => {
                    this.isAuthenticating = false;
                });

            },

            signUp() {

            },

            forgotPassword() {
                prompt({
                    title: "Esqueceu a senha",
                    message: "Digite o seu e-mail para enviarmos para você reiniciar a senha.",
                    defaultText: "",
                    okButtonText: "Ok",
                    cancelButtonText: "Cancel"
                }).then((data) => {

                });

            }
        },

        mounted() {
            console.log('LoginOrSignup mounted')
        }
    }
</script>

<style lang="scss">
    .login {
        .main-container {
            height: 425;
            margin-left: 30;
            margin-right: 30;
            background-color: white;
        }

        .main-label {
            horizontal-align: center;
            color: black;
        }

        /* Hide a bunch of things to setup the initial animations */
        .form-controls,
        .sign-up-stack {

        }

        Image {
            margin-top: 5;
            margin-bottom: 20;
        }

        Button,
        TextField {
            margin-left: 16;
            margin-right: 16;
            margin-bottom: 10;
        }

        TextField {
            color: black;
            placeholder-color: #ACA6A7;
            margin-bottom: 10;

            &.light {
                color: #C4AFB4;
                placeholder-color: #C4AFB4;
            }
        }

        .submit-button {
            background-color: #CB1D00;
            color: white;
            margin-top: 15;
        }

        .forgot-password-label {
            font-size: 13;
            margin-left: 20;
            margin-bottom: 45;
            color: black;
        }

        .sign-up-stack {
            background-color: #311217;

            label {
                width: 100%;
                color: white;
                horizontal-align: center;
                text-align: center;
                font-size: 15;
                height: 48;
            }
        }
    }

    .platform-ios .login {
        .main-container {
            width: 300;
        }

        .main-label {
            color: #311217;
            font-size: 32;
            margin-top: 30;
            margin-bottom: 30;
            letter-spacing: 0.2;
        }

        TextField {
            border-width: 1;
            border-color: #6E595C;
            margin-bottom: 20;

            &.light {
                border-color: #C4AFB4;
            }
        }

        .submit-button {
            height: 40;
        }
    }

    .platform-android .login {
        .main-container {
            width: 275;
            height: 394;
        }

        .main-label {
            font-size: 28;
            margin-top: 30;
            margin-bottom: 30;
            letter-spacing: 0.3;
        }

        .sign-up-stack label {
            margin-top: 15;
            text-transform: uppercase;
        }

        .forgot-password-label {
            font-size: 13;
            text-transform: uppercase;
        }
    }

</style>