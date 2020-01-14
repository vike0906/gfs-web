import * as types from './mutation-types'
import getters from './getters'

const state = {
  asidebarCollapse:false,
  siderShow:true,
  screenSize:0
};

const mutations = {
  [types.ASIDEBAR_COLLAPSE](state){
    state.asidebarCollapse = state.asidebarCollapse?false:true;
  },
  [types.SIDER_SHOW](state){
    state.siderShow = state.siderShow?false:true;
  },
  [types.SCREEN_SIZE](state,size){
    state.screenSize = size;
  }
};

export default {
  state,
  mutations,
  getters
}