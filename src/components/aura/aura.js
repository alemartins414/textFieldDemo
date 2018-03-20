import Vue from 'nativescript-vue'
import * as http from 'tns-core-modules/http'
import { Feedback, FeedbackType, FeedbackPosition } from "nativescript-feedback";
import { TNSFancyAlert, TNSFancyAlertButton } from 'nativescript-fancyalert';
import Login from '../login/Login';

Vue.mixin({
  beforeCreate () {
    const options = this.$options
    if (options.aura) { this.$aura = options.aura } else if (options.parent && options.parent.$aura) { this.$aura = options.parent.$aura }
  }
})


function Param (key, value, changeObject) {
  this.key = key
  this.value = value
  if (!this.value) {
    this.value = null
  }

  if (typeof changeObject === 'undefined') {
    changeObject = true
  }
  this.changeObject = changeObject
}

function AuraLib () {
  var DEBUG = true

  this.token = null;
  this.feedback = new Feedback();


  this.token = null;

  var debugUrl = null
  var productionUrl = null
  var contexto = ''

  var kv = {}

  this.events = new Vue()

  this.user = {}

  this.set = function (key, value) {
    kv[key] = value
  }

  this.abrirTela = function (tela) {
    aura.events.$emit('aura.abrirTela', tela)
  }

  this.configDB = null;

  this.loadConfigDB = function(){
    if(this.configDB == null){
      var vm = this;
      var Sqlite = require( "nativescript-sqlite" );
      var existe = Sqlite.exists("config.db");

      new Sqlite("config.db", function(err, db) {
          if (err) {
              console.error("We failed to open database", err);
          } else {
              vm.configDB = db;
              if(!existe){
                  db.execSQL("CREATE TABLE CONFIG("+
                      " NOME TEXT NOT NULL,"+
                      " VALOR TEXT NOT NULL," +
                      " PRIMARY KEY (NOME) );");
                  db.execSQL("insert into CONFIG(NOME,VALOR) values('token','')")
              }
          }
      });
    }
  }

  this.setDebugUrl = function (url) {
    debugUrl = url
  }

  this.getDebugUrl = function () {
    return debugUrl
  }

  this.get = function (key) {
    return kv[key]
  }

  this.clear = function (key) {
    kv[key] = null
  }

  this.param = function (key, value, addCMD) {
    return new Param(key, value, addCMD)
  }

  this.getHTTPUrl = function () {
    if (this.debugUrl == null) {
      debugUrl = 'https://contrel.exati.com.br/guia/command/contrel'
    }
    return debugUrl;
  }

  this.getParamsURL = function (values) {
    var append = ''
    for (var i = 0; i < values.length; i++) {
      if (values[i] == null) {
        continue
      }
      if (append.length > 0) {
        append += '&'
      }
      var currentKey = values[i].key
      if (values[i].changeObject && currentKey.toUpperCase().indexOf('CMD_') === -1 && currentKey.toUpperCase().indexOf('CMD.') === -1) {
        currentKey = 'CMD.' + currentKey
      }
      append += currentKey + '=' + values[i].value
    }

    return this.getURL(append)
  }

  this.getURL = function (appendURL) {
    var url = ''

    if (this.token) {
      url += '?auth_token=' + this.token
    }
    if (appendURL != null) {
      if (url.length > 0) {
        url += '&'
      } else {
        url += '?'
      }
      url += appendURL
    }
    return this.getHTTPUrl() + url
  }

  this.verificaUsuarioLogado = function (owner, store) {
    if (!this.token) {
      owner.$showModal(Login)
    } else {
      this.callCommand('ConsultarUsuarioLogado', []).then(function successCallback (response) {
        var usu = response.RAIZ.USUARIO_LOGADO
        aura.user = {}
        aura.user.name = usu.NOME_PESSOA
        aura.user.id_pessoa = usu.ID_PESSOA
        aura.user.login = usu.LOGIN
        aura.user.contexto = usu.CONTEXTO
        aura.user.email = usu.EMAIL_PESSOA
        aura.user.image_url = aura.getHTTPUrl() + '?CMD.COMMAND=ConsultarFotoPessoa&CMD.ID_PESSOA=' + aura.user.id_pessoa + '&parser=file&auth_token=' + aura.token
        store.commit('SET_USER', aura.user)
      }, function errorCallback (response) {
        owner.$showModal(Login)
      })
    }
  }

  this.callCommand = function (commandName, parameters, silent, parser) {
    if (parameters && !(parameters.constructor === Array)) {
      var params = []
      for (const paramName in parameters) {
        if (parameters.hasOwnProperty(paramName)) {
          if (parameters[paramName] !== undefined) {
            params.push(new Param(paramName, parameters[paramName]))
          }
        }
      }
      parameters = params
    }
    parameters = this.getArray(parameters)
    parameters.push(new Param('COMMAND', commandName))
    if (parser) {
      parameters.push(new Param('parser', parser, false))
    } else {
      parameters.push(new Param('parser', 'json', false))
    }

    parameters.push(new Param('auth_token', this.token, false))

    var saida = ''
    for (var i = 0; i < parameters.length; i++) {
      if (!parameters[i].value) {
        continue
      }
      if (saida.length > 0) {
        saida += '&'
      }
      saida += (parameters[i].changeObject ? 'CMD.' : '') + parameters[i].key + '=' + encodeURIComponent(parameters[i].value)
    }

    var url = this.getHTTPUrl();
    console.log(url);

    return new Promise((resolve, reject) => {
      http.request({
        method: 'POST',
        url: url,
        content: saida,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).then(function (result) {
        result = result.content.toJSON();
        if (commandName === 'Logout') {
          aura.updateToken(null)
        }
        try {
            console.log('handling');
            if (aura.handleResult(result) > 0) {
                console.log("comando ok");
                resolve(result)
            } else {
                console.log("comando off");
                reject(result)
            }
        }catch (e){
          console.log('error:' + e);
        }

      }, function (e) {
          console.log("erro veio");
          //// Argument (e) is Error!
      })
    })
  }

  this.getArray = function (value) {
    if (value == null) {
      return []
    }
    if (value.constructor === Array) {
      return value
    }
    return [value]
  }

  this.handleResult = function (obj, silent) {
    if (!silent) {
      this.parseCommandNotifications(obj.RAIZ.MESSAGES)
    }

    if (obj.RAIZ.LOGIN_REQUEST && obj.RAIZ.RESULT === -1) {
      aura.events.$emit('aura.LoggedOff')
    }

    return obj.RAIZ.RESULT
  }

  this.logout = function (router, store) {
    this.callCommand('Logout', [])
    aura.user = {}
    store.commit('SET_USER', {})
    router.push('login')
  }

  this.updateToken = function (token) {
    this.token = token;
    var valueToken = token === null ? '' : token;
    this.configDB.execSQL("update CONFIG set VALOR = '" + valueToken + "' where NOME = 'token'");
    console.log('token update');

  };

  this.loadToken = function(){
      var vm = this;
      console.log('loading token');
      var promise = this.configDB.get("select VALOR from CONFIG where NOME = 'token'");

      promise.then(function(row) {
          vm.token = row[0] === '' ? null : row[0];
          console.log('Token: ' + vm.token);
      });
  }

  this.showError = function(title,message,btn){
      TNSFancyAlert.showError(title, message, btn, 0, 300);
  }

  this.showWarning = function(title,message){
      this.feedback.show({
          title: title,
          message: message,
          type: FeedbackType.Warning
      });
  }

  this.showSuccess = function(title,message){
      this.feedback.show({
          title: title,
          message: message,
          type: FeedbackType.Success
      });
  }

  this.parseCommandNotifications = function (notifications) {

    var errors = "";
    for(var i = 0; i < notifications.ERRORS.length; i++){
      var error = notifications.ERRORS[i];
      if(errors !== ""){
          errors += "\n";
      }
      errors += error;
    }

    var warnings = "";
    for(var i = 0; i < notifications.WARNINGS.length; i++){
        var warning = notifications.WARNINGS[i];
        if(warnings !== ""){
            warnings += "\n";
        }
        warnings += warning;
    }



    var informations = "";

    for(var i = 0; i < notifications.INFORMATIONS.length; i++){
      var information = notifications.INFORMATIONS[i];
      if(informations !== ""){
        informations += "\n";
      }
      informations += information;
    }

    if(errors !== ""){
      this.showError('Ops',errors,'OK');
    }

    if(warnings !== ""){
      this.showWarning(null,warnings);

    }

    if(informations !== ""){
      this.showSuccess(null,informations);
    }
  }
}
var aura = new AuraLib()

Vue.prototype.$aura = aura

module.exports = aura;
