import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const getCommon = (key, state) => (state.originDictionary[key] || []).reduce((res, item) => {
  const option = {
    value: item[0],
    label: item[1]
  }
  res.push(option)
  return res
}, [])

const store = new Vuex.Store({
  state: {
    originDictionary: {}
  },
  getters:{
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
    }
  },
  mutations: {
    setDic (state, payload) {
      state.originDictionary = payload
    }
  },
  actions: {
    
  }
})

export default store