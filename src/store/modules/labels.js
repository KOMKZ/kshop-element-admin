import { getLabelsMap as getApiLabelsMap } from '@/api/global'
import { setLabelsMap, getLabelsMap } from '@/utils/global'
const labels = {
  state: {
    map: getLabelsMap()
  },

  mutations: {
    SET_LABELS_MAP: (state, map) => {
      state.map = map
    }
  },

  actions: {
    // 获取全局const-label定义
    RequestLabelsMap({ commit }) {
      return new Promise((resolve, reject) => {
        getApiLabelsMap().then(response => {
          setLabelsMap(JSON.stringify(response.data))
          commit('SET_LABELS_MAP', response.data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default labels
