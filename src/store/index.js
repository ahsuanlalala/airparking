import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // 宣告變數 類似data
  state: {
    userName: localStorage.getItem('userName') || ""
  },
  // 資料顯現 類似computed
  getters: {
    userName: (state) => state.userName 
  },
  // 同步處理 methods
  mutations: {
    clear(state){
      state.userName=""
    },
    setUserName(state,loginData){
      state.userName=loginData
    }
  },
  // 非同步處理 api放這
  actions: {
  }
})
