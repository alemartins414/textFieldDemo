<template>
  <Page class="page">
    <ActionBar title="Login" class="action-bar">
      <ActionItem text="Menu" class="action-item" @tap="$refs.drawer.nativeView.showDrawer()" />
    </ActionBar>
    <RadSideDrawer ref="drawer" showOverNavigation="true" class="sidedrawer">
      <StackLayout class="sidedrawer-left" ~drawerContent >
        <StackLayout class="sidedrawer-header">
          <Image class="sidedrawer-header-image img-circle" :src="$store.state.user.image_url"></Image>
          <Label class="sidedrawer-header-brand" :text="$store.state.user.name"></Label>
        </StackLayout>
        <StackLayout >
            <Label class="sidedrawer-list-item" text="Primary" padding="10" backgroundColor="lightgray"/>
            <Label class="sidedrawer-list-item" text="Social" padding="10"/>
            <Label text="Promotions" padding="10" />
            <Label text="Labels" padding="10" backgroundColor="lightgray" />
            <Label text="Important" padding="10" />
            <Label text="Starred" padding="10" />
            <Label text="Sent Mail" padding="10" />
            <Label text="Drafts" padding="10" />
        </StackLayout>
      </StackLayout>
      <StackLayout   ~mainContent orientation="vertical"  >
          <Button class="btn btn-primary" @tap="$showModal(login,{fullscreen: true})" @loaded="verificaLogado()">Login</Button>
          <Button class="btn btn-primary" @tap="$navigateTo(mapa)">Mapa</Button>
          <Button class="btn btn-primary" @tap="$navigateTo(draw)">Desenho</Button>
          <Button class="btn btn-primary" @tap="downloadDatabase()">Download</Button>
          <Button class="btn btn-primary" @tap="openDatabase()">Base de Dados</Button>
          <Button class="btn btn-primary" @tap="tirarFoto()">Foto</Button>
          <Button class="btn btn-primary" @tap="$navigateTo(lista)">Lista</Button>
          <Button class="btn btn-primary" @tap="$showModal(tour,{fullscreen: true})">Tour</Button>
          <Progress :value="currentProgress" />


          <!--<CardView class="blackCard" radius="5" loaded="cardLoaded" elevation="20" margin="10" v-for="item in items">
            <GridLayout rows="auto, auto, auto" columns="auto, auto, *">
              <Label :text="item.NOME" class="info" textWrap="true" row="1" colSpan="3" />
            </GridLayout>
          </CardView>-->
      </StackLayout>
    </RadSideDrawer>
  </Page>
</template>
<script>

    import Vue from 'nativescript-vue';

    import Login from './login/Login';
    import Mapa from './Mapa';
    import Draw from './Draw';
    import Lista from './Lista';
    import Tour from './Tour';
    import * as platformModule from 'tns-core-modules/platform'

    Vue.registerElement('RadSideDrawer', () => require('nativescript-ui-sidedrawer').RadSideDrawer);
    Vue.registerElement("CardView", () => require("nativescript-cardview").CardView);

    import { Downloader, ProgressEventData, DownloadEventData, DownloadEventError } from 'nativescript-downloader';

    //import {DownloadProgress} from "nativescript-download-progress";
    import * as fs from "tns-core-modules/file-system";

    import * as camera from "nativescript-camera";


    export default {
        data () {
            return {
                login: Login,
                mapa: Mapa,
                currentProgress: 0,
                surprise: false,
                db: null,
                draw:Draw,
                lista:Lista,
                tour:Tour
            };
        },
        mounted(){
            this.$aura.loadConfigDB();
        },
        methods: {

            verificaLogado: function () {
                var vm = this;
                setTimeout(function(){
                    vm.$aura.loadToken();
                },200);

                setTimeout(function(){
                    vm.$aura.verificaUsuarioLogado(vm,vm.$store);
                },500);

            },

            tirarFoto: function () {
                var options = { width: 300, height: 300, keepAspectRatio: false, saveToGallery: true };
                camera.takePicture(options)
                    .then(function (imageAsset) {
                        console.log("Size: " + imageAsset.options.width + "x" + imageAsset.options.height);
                        console.log("keepAspectRatio: " + imageAsset.options.keepAspectRatio);
                        console.log("Photo saved in Photos/Gallery for Android or in Camera Roll for iOS");
                    }).catch(function (err) {
                    console.log("Error -> " + err.message);
                });
            },

            downloadDatabase: function(){
                var vm = this;
                var downloader = new Downloader();
                var imageDownloaderId = downloader.createDownload({url:'http://exati.com.br/base_versionada.db'});

                this.$aura.showWarning("Download Iniciado!");
                downloader
                    .start(imageDownloaderId, progressData => {
                        vm.currentProgress = Math.round(progressData.value);
                    })
                    .then(completed => {
                        console.log('Image :' + completed.path);
                        var sourceFile = fs.File.fromPath(completed.path);
                        var destinationFile = null;
                        if(platformModule.isAndroid){
                            destinationFile = fs.knownFolders.documents().parent.getFolder("databases").getFile("base_versionada.db");
                        }else{
                            destinationFile = fs.knownFolders.documents().getFile("base_versionada.db");
                        }

                        var source = sourceFile.readSync(e=> { error = e; });

                        destinationFile.writeSync(source, e=> { error = e; });
                        console.log("Base copiada");

                        console.log(destinationFile.path);
                        vm.openDatabase();
                    })
                    .catch(error => {
                        console.log('error:' +  error.message);
                    });
            },
            openDatabase: function(){
                console.log("Opening database");
                var Sqlite = require( "nativescript-sqlite" );
                var vm = this;

                if(Sqlite.exists("base_versionada.db")) {
                    this.$aura.showSuccess("Base Encontrada!");
                    new Sqlite("base_versionada.db", function(err, db) {
                        console.log(err);
                        vm.db = db;
                        vm.queryData();
                    });
                }else{
                    this.$aura.showError("Base não existe");
                    console.log("database doesnt exist");
                }

            },
            queryData: function(){
                var vm = this;
                vm.items.length = 0;
                var promise = this.db.all('select nome from PESSOA');
                promise.then(function(resultSet) {
                    for(var i = 0; i < resultSet.length; i++){
                        var item = {};
                        item.NOME = resultSet[i][0];
                        vm.items.push(item);
                    }
                    console.log("Result set is:", JSON.stringify(resultSet));
                });
            }
        }
    };
</script>
<style>
  .blue {
    color: #6A78C5;
  }
  .blackCard {
    background-color: #333;
    color: white;
  }

  .whiteCard {
    background-color:#fff;
  }

</style>
