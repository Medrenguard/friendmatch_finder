import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    currentView: 'Home'
  },
  getters: {
    CURRENT_VIEW: state => {
      return state.currentView
    }
  },
  mutations: {},
  actions: {}
})
