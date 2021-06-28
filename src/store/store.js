import Vue from 'vue'
import Vuex from 'vuex'
import { READER, ADMIN,  LIBRARIAN } from '../constant'
Vue.use(Vuex)

const getCommon = (key, state) => (state.originDictionary[key] || []).reduce((res, item) => {
  const option = {
    value: item[0],
    label: item[1]
  }
  res.push(option)
  return res
}, [])

const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))

const store = new Vuex.Store({
  state: {
    originDictionary: {},
    user,
    identity: user && user.role || READER
  },
  getters:{
    // 参数列表state指的是state数据
    getBindingsOptions (state) {
      return getCommon('BINDINGS', state)
    },
    getSubjectsOptions (state) {
      return getCommon('BOOK_SUBJECTS', state)
    },
    getBookStatus (state) {
      return getCommon('BOOK_COPY_STATUS', state)
    },
    getBookMediaTypes (state) {
      return getCommon('BOOK_MEDIA_TYPE', state)
    },
    getLanguages (state) {
      return getCommon('LANGUAGES', state)
    },
    getNationsOptions (state) {
      return getCommon('NATIONALITY', state)
    },
    getGendersOptions (state) {
      return getCommon('GENDERS', state)
    },
    getRoleOptions (state) {
      return getCommon('ROLES', state)
    },
    getIdentity (state) {
      return state.identity
    },
    getUserInfo (state) {
      return state.user
    },
    isReader (state) {
      return state.identity === READER
    },
    isLibrarian (state) {
      return state.identity === LIBRARIAN
    },
    isAdmin (state) {
      return state.identity === ADMIN
    }
  },
  mutations: {
    setDic (state, payload) {
      state.originDictionary = payload
    },
    setUserInfo (state, payload) {
      state.user = payload
      state.identity = payload.role || READER
    }
  },
  actions: {
    
  }
})

export default store