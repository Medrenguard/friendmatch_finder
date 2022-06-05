import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    currentView: 'Home',
    currentFriendId: 0
  },
  getters: {
    CURRENT_VIEW: state => {
      return state.currentView
    },
    ID: state => {
      return state.currentFriendId
    }
  },
  mutations: {
    changeView (state, newView) {
      state.currentView = newView
    },
    changeFriendId (state, newId) {
      state.currentFriendId = newId
    }
  },
  actions: {
    passToProfile (context, payload) {
      context.commit('changeView', payload.view)
      context.commit('changeFriendId', payload.id)
    }
  }
})
