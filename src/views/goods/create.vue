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
        <el-tab-pane name="baseTab" label="基本信息">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item :label="getLabel('g_primary_name')" :error="goods.errors.g_primary_name">
                <el-input size="small" v-model="goods.data.g_primary_name"></el-input>
              </el-form-item>
              <el-form-item :label="getLabel('g_secondary_name')" :error="goods.errors.g_secondary_name">
                <el-input size="small" v-model="goods.data.g_secondary_name"></el-input>
              </el-form-item>
              <el-row :gutter="12">
                <el-col :span="12">
                  <el-form-item :label="getLabel('g_status')" :error="goods.errors.g_status">
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
                </el-col>import Upload from '@/components/Upload/singleImage3'

                <el-col :span="12">
                </el-col>
              </el-row>
              <el-form-item label="查找并选择分类" :error="goods.errors.g_cls_id">
                <el-input size="small" v-model="goods.curFilterGClsName"></el-input>
                <el-tag closable @close="clearCurGCls" type="info" v-show="goods.curGClsName">{{goods.curGClsName}}</el-tag>
                <category @select-category="handleCategoryChange" :filterValue="goods.curFilterGClsName"></category>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="getLabel('g_start_at')" :error="goods.errors.g_start_at">
                <el-date-picker
                  size="small"
                  v-model="goods.data.g_start_at"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item :label="getLabel('g_end_at')" :error="goods.errors.g_end_at">
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
        <el-tab-pane label="详细信息(介绍信息)" name="detailTab">
          <el-row>
            <el-col :span="12">
              <el-form-item :label="getLabel('g_intro_text')">
                <tinymce :height=400 ref="editor" v-model="goods.data.g_intro_text"></tinymce>
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
import Tinymce from '@/components/Tinymce'

export default {
  data() {
    return {
      goods: {
        currentTabName: 'detailTab',
        curFilterGClsName: '',
        curGClsName: 'T恤',
        loading: false,
        data: {
          g_primary_name: '4件装 囤货装 男式基础色织纯棉圆领T恤 4',
          g_secondary_name: '',
          g_cls_id: 32,
          g_status: 'draft',
          g_start_at: '2018-01-01 00:00:00',
          g_end_at: '2018-03-01 00:00:00',
          g_intro_text: ''
        },
        errors: {}
      }
    }
  },
  components: { Category, Tinymce },
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
      if(data.nodes.length <= 0){
        this.goods.curGClsName = data.g_cls_name
        this.goods.data.g_cls_id = data.g_cls_id
      }
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
