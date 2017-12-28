import { getEnumsMap as getApiEnumsMap } from '@/api/global'
import { setEnumsMap, getEnumsMap } from '@/utils/global'
const enums = {
  state: {
    map: getEnumsMap()
  },

  mutations: {
    SET_ENUMS_MAP: (state, map) => {
      state.map = map
    }
  },

  actions: {
    // 获取全局const-label定义
    RequestEnumsMap({ commit }) {
      return new Promise((resolve, reject) => {
        getApiEnumsMap().then(response => {
          setEnumsMap(1)
          commit('SET_ENUMS_MAP', response.data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default enums
