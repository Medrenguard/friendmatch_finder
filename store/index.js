import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    currentView: 'Friend',
    currentFriendId: 62765169,
    markedUsers: []
  },
  getters: {
    MARKED_USERS: state => {
      return state.markedUsers
    },
    CURRENT_VIEW: state => {
      return state.currentView
    },
    ID: state => {
      return state.currentFriendId
    }
  },
  mutations: {
    pushMarkedUser (state, newValue) {
      state.markedUsers.push(newValue)
    },
    deleteMarkedUser (state, newValue) {
      state.markedUsers.splice(state.markedUsers.indexOf(newValue), 1)
    },
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
    },
    passToHome (context) {
      context.commit('changeView', 'Home')
      context.commit('changeFriendId', 0)
    }
  }
})
