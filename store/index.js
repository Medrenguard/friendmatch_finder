import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    currentView: 'Friend',
    currentFriendId: 62765169,
    users: [],
    friendsPull: [],
    markedUsers: []
  },
  getters: {
    USERS: state => {
      return state.users
    },
    FRIENDS: state => {
      return state.friendsPull
    },
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
    pushUser (state, newValue) {
      state.users.push(newValue)
    },
    deleteMarkedUser (state, deletedValue) {
      state.markedUsers.splice(state.markedUsers.indexOf(deletedValue), 1)
    },
    deleteUser (state, deletedValue) {
      state.users.splice(deletedValue, 1)
    },
    pushFriend (state, newValue) {
      state.friendsPull.push(newValue)
    },
    addFriendsMatch (state, index) {
      state.friendsPull[index]['match']++
    },
    clearFriends (state) {
      state.friendsPull = Array.from([])
    },
    changeView (state, newView) {
      state.currentView = newView
    },
    changeFriendId (state, newId) {
      state.currentFriendId = newId
    }
  },
  actions: {
    passToProfile (context, id) {
      context.commit('changeView', 'Friend')
      context.commit('changeFriendId', id)
    },
    passToHome (context) {
      context.commit('changeView', 'Home')
      context.commit('changeFriendId', 0)
    }
  }
})
