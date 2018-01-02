<template lang="html">
  <div class="app-container">
    <el-form
    :model="goods.data"
    v-loading="this.goods.loading"
    label-position="top">
      <el-row>
        <el-col :span="4">
          <el-button native-type="submit" type="primary" size="mini" @click="handleSubmitCreate">提交商品</el-button>
        </el-col>
      </el-row>
      <el-tabs v-model="goods.currentTabName">
        <el-tab-pane name="baseGoods" label="基本信息">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item :label="getLabel('g_primary_name')" :error="this.goods.errors.g_primary_name">
                <el-input size="small" v-model="goods.data.g_primary_name"></el-input>
              </el-form-item>
              <el-form-item :label="getLabel('g_secondary_name')" :error="this.goods.errors.g_secondary_name">
                <el-input size="small" v-model="goods.data.g_secondary_name"></el-input>
              </el-form-item>
              <el-row :gutter="12">
                <el-col :span="12">
                  <el-form-item :label="getLabel('g_status')" :error="this.goods.errors.g_status">
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
                <el-col :span="12">
                </el-col>
              </el-row>
              <el-form-item label="查找并选择分类" :error="this.goods.errors.g_cls_id">
                <el-input size="small" v-model="goods.curFilterGClsName"></el-input>
                <el-tag closable @close="clearCurGCls" type="info" v-show="goods.curGClsName">{{goods.curGClsName}}</el-tag>
                <category @select-category="handleCategoryChange" :filterValue="goods.curFilterGClsName"></category>
              </el-form-item>
            </el-col>
            <el-col :span="6" :error="this.goods.errors.g_start_at">
              <el-form-item :label="getLabel('g_start_at')">
                <el-date-picker
                  size="small"
                  v-model="goods.data.g_start_at"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item :label="getLabel('g_end_at')" :error="this.goods.errors.g_end_at">
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
import { getEnumMap, getLabel, populateErrors } from '@/utils/global'
import { createGoods } from '@/api/goods'
import Category from '@/components/Category'

export default {
  data() {
    return {
      goods: {
        currentTabName: 'baseGoods',
        curFilterGClsName: '',
        curGClsName: '',
        loading: false,
        data: {
          g_primary_name: '',
          g_secondary_name: '',
          g_cls_id: 0,
          g_status: '',
          g_start_at: '',
          g_end_at: ''
        },
        errors: {}
      }
    }
  },
  components: { Category },
  methods: {
    createGoods(data){
      this.goods.loading = true
      return createGoods(data).then(res => {
        this.goods.loading = false
      })
    },

    handleSubmitCreate() {
      this.createGoods(this.goods.data).then(res => {
        console.log(res)
      }).catch(error => {
        this.goods.loading = false
        if (error.message) {
          this.goods.errors = populateErrors(error.message)
        }
      })
    },
    handleCategoryChange(data) {
      this.goods.curGClsName = data.g_cls_name
      this.goods.data.g_cls_id = data.g_cls_id
    },
    clearCurGCls(){
      this.goods.curGClsName = '';
      this.goods.data.g_cls_id = null
    },
    getEnumMap,
    getLabel
  }
}
</script>

<style lang="scss">
</style>
