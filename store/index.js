import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    currentView: 'Home',
    currentFriendId: undefined,
    users: [],
    friendsPull: [],
    markedUsers: [],
    loading: false,
    buildCompleted: false,
    brokenBuild: false,
    access_token: 'hide for repo'
  },
  getters: {
    TOKEN: state => {
      return state.access_token
    },
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
    },
    BUILDCOMPLETED: state => {
      return state.buildCompleted
    },
    BROKENBUILD: state => {
      return state.brokenBuild
    },
    LOADING: state => {
      return state.loading
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
    deleteUser (state, deletedId) {
      state.users.splice(state.users.findIndex(user => user.id === deletedId), 1)
    },
    updateFriendsPull (state, newValue) {
      state.friendsPull = newValue
    },
    clearFriendsPull (state) {
      state.friendsPull = Array.from([])
    },
    changeBuildCompleted (state, newValue) {
      state.buildCompleted = newValue
    },
    changeBuildBroken (state, newValue) {
      state.brokenBuild = newValue
    },
    changeView (state, newView) {
      state.currentView = newView
    },
    changeFriendId (state, newId) {
      state.currentFriendId = newId
    },
    changeLoading (state, newValue) {
      state.loading = newValue
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
    },
    clearFriends (context) {
      context.commit('clearFriendsPull')
      context.commit('changeBuildBroken', false)
      context.commit('changeBuildCompleted', false)
    },
    startBuild (context) {
      context.commit('clearFriendsPull')
      context.commit('changeBuildBroken', false)
      context.commit('changeBuildCompleted', false)
      context.commit('changeLoading', true)
    },
    finishBuild (context, newValue) {
      context.commit('updateFriendsPull', newValue)
      context.commit('changeBuildCompleted', true)
      context.commit('changeLoading', false)
    },
    breakBuild (context) {
      context.commit('changeBuildBroken', true)
      context.commit('changeLoading', false)
    }
  }
})
