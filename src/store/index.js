import Vue from 'nativescript-vue';
import Vuex from 'vuex';

import counter from './modules/counter';

Vue.use(Vuex);

const state = {
    token: null,
    user: {},
    menuOpen: false
}

const mutations = {
    SET_TOKEN (state, token) {
        state.token = token
    },
    REMOVE_TOKEN (state) {
        state.token = null
    },
    SET_USER (state, user) {
        state.user = user
    },
    SET_MENU (state, open) {
        state.menuOpen = open
    }
}

const store = new Vuex.Store({
    state,
    mutations
})

Vue.prototype.$store = store;

module.exports = store;