<template lang="html">
  <div class="app-container">
    <el-form :model="goods.data" label-position="top">
      <el-row>
        <el-col :span="4">
          <el-button native-type="submit" type="primary" size="mini" @click="handleSubmitCreate">提交商品</el-button>
        </el-col>
      </el-row>
      <el-tabs v-model="goods.currentTabName">
        <el-tab-pane name="baseGoods" label="基本信息">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item :label="getLabel('g_primary_name')">
                <el-input size="small" v-model="goods.data.g_primary_name"></el-input>
              </el-form-item>
              <el-form-item :label="getLabel('g_secondary_name')">
                <el-input size="small" v-model="goods.data.g_secondary_name"></el-input>
              </el-form-item>
              <el-row :gutter="12">
                <el-col :span="12">
                  <el-form-item :label="getLabel('g_status')">
                    <el-select
                    size="small"
                    v-model="goods.data.g_status"
                     placeholder="请选择"
                    >
                       <el-option
                         v-for="item in getEnumMap('g_status')"
                         :key="item.value"
                         :label="item.text"
                         :value="item.value">
                       </el-option>
                     </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="getLabel('g_start_at')">
                <el-date-picker
                  size="small"
                  v-model="goods.data.g_start_at"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item :label="getLabel('g_end_at')">
                <el-date-picker
                  size="small"
                  v-model="goods.data.g_start_at"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>

<script>
import { getEnumMap, getLabel } from '@/utils/global'

export default {
  data() {
    return {
      goods: {
        currentTabName: 'baseGoods',
        data: {
          g_primary_name: '',
          g_secondary_name: '',
          g_status: '',
          g_start_at: '',
          g_end_at: ''
        }
      }
    }
  },
  methods: {
    handleSubmitCreate() {

    },
    getEnumMap,
    getLabel
  }
}
</script>

<style lang="scss">
</style>
