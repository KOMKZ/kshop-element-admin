<template lang="html">
  <div class="app-container">
    <el-form :model="form.data" label-position="top">
      <el-row>
        <el-col :span="4">
          <el-button native-type="submit" type="primary" size="mini" @click="handleSubmitCreate">提交创建</el-button>
        </el-col>
      </el-row>
      <el-tabs v-model="form.currentTabName">
        <el-tab-pane name="base" label="基本信息">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item :label="getLabel('g_cls_name')">
                <el-input size="small" v-model="form.data.g_cls_name"></el-input>
              </el-form-item>
              <el-form-item :label="getLabel('g_cls_show_name')">
                <el-input size="small" v-model="form.data.g_cls_show_name"></el-input>
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
      form: {
        currentTabName: 'base',
        data: {
          g_cls_name: '',
          g_cls_show_name: ''
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
