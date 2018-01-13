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
        <el-tab-pane name="baseTab">
          <span slot="label">
            <el-badge is-dot v-if="goods.tabs.baseTab.error" class="item">
              基本信息
            </el-badge>
            <span v-else>基本信息</span>
          </span>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item prop="g_primary_name" :label="getLabel('g_primary_name')" :error="goods.errors.g_primary_name">
                <el-input size="small" v-model="goods.data.g_primary_name"></el-input>
              </el-form-item>
              <el-form-item prop="g_secondary_name" :label="getLabel('g_secondary_name')" :error="goods.errors.g_secondary_name">
                <el-input size="small" v-model="goods.data.g_secondary_name"></el-input>
              </el-form-item>
              <el-row :gutter="12">
                <el-col :span="12">
                  <el-form-item prop="g_status" :label="getLabel('g_status')" :error="goods.errors.g_status">
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
              <el-form-item prop="g_cls_id" label="查找并选择分类" :error="goods.errors.g_cls_id">
                <el-input size="small" v-model="goods.curFilterGClsName"></el-input>
                <el-tag closable @close="clearCurGCls" type="info" v-show="goods.curGClsName">{{goods.curGClsName}}</el-tag>
                <category @select-category="handleCategoryChange" :filterValue="goods.curFilterGClsName"></category>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="g_start_at" :label="getLabel('g_start_at')" :error="goods.errors.g_start_at">
                <el-date-picker
                  size="small"
                  v-model="goods.data.g_start_at"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item prop="g_end_at" :label="getLabel('g_end_at')" :error="goods.errors.g_end_at">
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

        <el-tab-pane name="detailTab">
          <span slot="label">
            <el-badge is-dot class="item" v-if="goods.tabs.detailTab.error">
              详细信息(介绍信息)
            </el-badge>
            <span v-else>详细信息(介绍信息)</span>
          </span>
          <el-row>
            <el-col :span="12">
              <el-form-item :label="getLabel('g_intro_text')" :error="goods.errors.g_intro_text" prop="g_intro_text">
                <tinymce :height=400 ref="editor" v-model="goods.data.g_intro_text"></tinymce>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane name="metaTab">
          <span slot="label">
            <el-badge is-dot class="item" v-if="goods.tabs.metaTab.error">
              元信息
            </el-badge>
            <span v-else>元信息</span>
          </span>
          <el-row>
            <el-col :span="24">
              <el-button native-type="submit" type="info" size="mini" @click="metaForm.show = true">增加元属性</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-table
                :data="goods.data.g_metas"
                style="width: 100%">
                <el-table-column
                  prop="g_atr_id"
                  :label="getLabel('g_atr_id')">
                </el-table-column>
                <el-table-column
                  prop="g_atr_name"
                  :label="getLabel('g_atr_name')">
                </el-table-column>
                <el-table-column
                  prop="g_atr_show_name"
                  :label="getLabel('g_atr_show_name')">
                </el-table-column>
                <el-table-column
                  prop="gm_value"
                  :label="getLabel('gm_value')">
                </el-table-column>
                <el-table-column
                  prop="g_atr_code"
                  :label="getLabel('g_atr_code')">
                </el-table-column>
                <el-table-column align="center" label="操作" width="350" class-name="small-padding">
                  <template slot-scope="scope">
                    <el-button type="info" size="mini">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane name="skuAttrTab">
          <span slot="label">
            <el-badge is-dot class="item" v-if="goods.tabs.skuAttrTab.error">
              sku属性信息
            </el-badge>
            <span v-else>sku属性信息</span>
          </span>
          <el-row>
            <el-col :span="24">
              <el-button native-type="submit" type="info" size="mini" @click="skuAttrForm.show = true">增加sku属性</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-table
                :data="goods.data.g_sku_attrs"
                style="width: 100%">
                <el-table-column
                  prop="g_atr_id"
                  :label="getLabel('g_atr_id')">
                </el-table-column>
                <el-table-column
                  prop="g_atr_name"
                  :label="getLabel('g_atr_name')">
                </el-table-column>
                <el-table-column
                  prop="g_atr_show_name"
                  :label="getLabel('g_atr_show_name')">
                </el-table-column>
                <el-table-column
                  label="选项值">
                  <template slot-scope="scope">
                    {{getOptValStr(scope.row)}}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="350" class-name="small-padding">
                  <template slot-scope="scope">
                    <el-button type="info" size="mini">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-tab-pane>


      </el-tabs>
    </el-form>

    <el-dialog title="创建元信息" :visible.sync="metaForm.show" @close="resetMetaForm">
      <el-form ref="metaForm" :model="metaForm.data" :rules="metaForm.rules" size="small">
        <el-row :gutter="12">
          <el-col :span="12">
              <el-form-item :label="getLabel('g_atr_name')" prop="g_atr_name">
                <el-input v-model="metaForm.data.g_atr_name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item :label="getLabel('g_atr_show_name')" prop="g_atr_show_name">
                <el-input v-model="metaForm.data.g_atr_show_name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item :label="getLabel('gm_value')" prop="gm_value">
                <el-input v-model="metaForm.data.gm_value" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item :label="getLabel('g_atr_code')" prop="g_atr_code">
                <el-input v-model="metaForm.data.g_atr_code" auto-complete="off"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="g_cls_id" label="查找并选择分类">
              <el-input size="small" v-model="metaForm.curFilterGClsName"></el-input>
              <el-tag closable @close="clearMetaCurGCls" type="info" v-show="metaForm.curGClsName">{{metaForm.curGClsName}}</el-tag>
              <category
              @select-category="handleMetaCategoryChange"
              @select-attr="handleCategoryAttrChange"
              :filterValue="metaForm.curFilterGClsName"
              :showAttrTree="true"
              ></category>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="metaForm.show = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitCreateMeta">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :fullscreen="skuAttrForm.fullScreen" title="创建sku属性信息" :visible.sync="skuAttrForm.show" @close="resetSkuAttrForm">
      <el-form ref="skuAttrForm" :model="skuAttrForm.data" :rules="skuAttrForm.rules" size="small" label-position="top">
        <el-row :gutter="12">
          <el-col :span="12">
              <el-form-item :label="getLabel('g_atr_name')" prop="g_atr_name">
                <el-input v-model="skuAttrForm.data.g_atr_name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item :label="getLabel('g_atr_show_name')" prop="g_atr_show_name">
                <el-input v-model="skuAttrForm.data.g_atr_show_name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item :label="getLabel('g_atr_opt_img')" :error="skuAttrForm.errors.g_atr_opt_img" prop="g_atr_opt_img">
                <el-select
                v-model="skuAttrForm.data.g_atr_opt_img"
                placeholder="请选择"
                >
                 <el-option
                   v-for="item in getEnumMap('g_atr_opt_img')"
                   :key="item.value"
                   :label="item.text"
                   :value="item.value">
                 </el-option>
               </el-select>
              </el-form-item>
              <el-form-item :label="getLabel('g_atr_code')" prop="g_atr_code">
                <el-input v-model="skuAttrForm.data.g_atr_code" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item :label="getLabel('g_atr_opts')" prop="g_atr_opts">
                <div class="">
                  <el-table
                    size="mini"
                    :data="skuAttrForm.data.g_atr_opts"
                    width="100%"
                    >
                    <el-table-column
                      prop="g_opt_name"
                      label="选项值">
                    </el-table-column>
                    <el-table-column
                      prop="g_opt_img_url"
                      label="图片">
                      <template slot-scope="scope">
                        <img :src="scope.row.g_opt_img_url" alt="" v-if="scope.row.g_opt_img_url">
                        <span v-else>无图片</span>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="350" class-name="small-padding">
                      <template slot-scope="scope">
                        <el-button @click="removeOptValue(scope.$index)" type="info" size="mini">删除</el-button>
                        <el-button @click="showOptValueImgDialog(scope.$index)" type="info" size="mini">设置图片</el-button>
                      </template>
                    </el-table-column>
                  </el-table>

                </div>
                <el-popover
                  ref="popover5"
                  placement="top"
                  @hide="resetOptForm"
                  width="300"
                  v-model="optForm.show">
                  <el-input v-model="optForm.data.opt_value" auto-complete="off"></el-input>
                  <div style="text-align: right; margin-top:10px;">
                    <el-button size="mini" type="text" @click="optForm.show = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="handleOptValueSubmit">确定</el-button>
                  </div>
                </el-popover>
                <el-button size="small" v-popover:popover5>增加选项值</el-button>
              </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="g_cls_id" label="查找并选择分类">
              <el-input size="small" v-model="skuAttrForm.curFilterGClsName"></el-input>
              <el-tag closable @close="clearSkuAttrCurGCls" type="info" v-show="skuAttrForm.curGClsName">{{skuAttrForm.curGClsName}}</el-tag>
              <category
              @select-category="handleSkuAttrCategoryChange"
              @select-attr="handleCategorySkuAttrChange"
              :filterValue="skuAttrForm.curFilterGClsName"
              :showAttrTree="true"
              clsType="sku"
              ></category>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="skuAttrForm.fullScreen = !skuAttrForm.fullScreen">{{skuAttrForm.fullScreen ? '退出全屏':"全屏显示"}}</el-button>
        <el-button @click="skuAttrForm.show = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitCreateSkuAttr">确 定</el-button>
      </div>

      <image-cropper field="img"
            @crop-success="handleCropSuccess"
            @crop-upload-success="handleCropUploadSuccess"
            @crop-upload-fail="handleCropUploadFail"
            v-model="imgCropperOpts.show"
        :width="20"
        :height="20"
        :field="'file'"
        url="http://localhost:8011/file/create"
        :params="imgCropperOpts.params"
        :headers="imgCropperOpts.headers"
        img-format="png">
      </image-cropper>

    </el-dialog>

  </div>
</template>

<script>
import { getEnumMap, getLabel, populateErrors } from '@/utils/global'
import { createGoods } from '@/api/goods'
import Category from '@/components/Category'
import Tinymce from '@/components/Tinymce'
import { getToken } from '@/utils/auth'
import Vue from 'vue'
import ImageCropper from 'vue-image-crop-upload'

export default {
  data() {
    return {
      imgCropperOpts: {
        headers: {
          Authorization: 'Bearer ' + getToken()
        },
        show: false,
        params: {
          file_save_type: 'oss'
        }
      },
      optForm: {
        show: false,
        data: {
          opt_value: ''
        }
      },
      skuAttrForm: {
        fullScreen: false,
        curFilterGClsName: '',
        curGClsName: '',
        data: {
          g_atr_opts: [
            {
              g_opt_name: '红色',
              g_opt_img: 'oss:default/5d8168d83e89a628f376096d51f4a1da.png',
              g_opt_img_url: 'http://trainor-oss-test.oss-cn-shenzhen.aliyuncs.com/test_hse_data/c21f969b5f03d33d43e04f8f136e7682/5d8168d83e89a628f376096d51f4a1da.png'
            },
            {
              g_opt_name: '蓝色',
              g_opt_img: 'oss:default/5d8168d83e89a628f376096d51f4a1da.png',
              g_opt_img_url: 'http://trainor-oss-test.oss-cn-shenzhen.aliyuncs.com/test_hse_data/c21f969b5f03d33d43e04f8f136e7682/5d8168d83e89a628f376096d51f4a1da.png'
            }
          ],
          g_atr_id: null,
          g_atr_show_name: '',
          g_atr_type: 'sku',
          g_atr_opt_img: '0',
          g_atr_name: '',
          g_atr_code: ''
        },
        rules: {
          g_atr_name: [
            { required: true }
          ],
          g_atr_opts: [
            { required: true }
          ]
        },
        errors: {},
        show: false,
        loading: false
      },
      metaForm: {
        curFilterGClsName: '',
        curGClsName: '',
        show: false,
        data: {
          g_atr_id: null,
          g_atr_code: '',
          g_atr_name: '',
          g_atr_show_name: '',
          gm_value: ''
        },
        rules: {
          g_atr_name: [
            { required: true }
          ],
          gm_value: [
            { required: true }
          ]
        }
      },
      goods: {
        currentTabName: 'skuAttrTab',
        curFilterGClsName: '',
        curGClsName: '卫衣',
        loading: false,
        data: {
          g_primary_name: '4件装 囤货装 男式基础色织纯棉圆领T恤 4',
          g_secondary_name: '',
          g_cls_id: 22,
          g_status: 'draft',
          g_start_at: '2018-01-01 00:00:00',
          g_end_at: '2018-03-01 00:00:00',
          g_intro_text: 'hello world',
          g_sku_attrs: [
            {
              g_atr_id: '7',
              g_atr_code: '',
              g_atr_name: '颜色',
              g_atr_show_name: '颜色',
              g_atr_opts: [
                {
                  g_opt_name: '红色',
                  g_opt_img: 'oss:default/5d8168d83e89a628f376096d51f4a1da.png',
                  g_opt_img_url: 'http://trainor-oss-test.oss-cn-shenzhen.aliyuncs.com/test_hse_data/c21f969b5f03d33d43e04f8f136e7682/5d8168d83e89a628f376096d51f4a1da.png'
                },
                {
                  g_opt_name: '蓝色',
                  g_opt_img: 'oss:default/5d8168d83e89a628f376096d51f4a1da.png',
                  g_opt_img_url: 'http://trainor-oss-test.oss-cn-shenzhen.aliyuncs.com/test_hse_data/c21f969b5f03d33d43e04f8f136e7682/5d8168d83e89a628f376096d51f4a1da.png'
                }
              ]
            },
            {
              g_atr_id: '8',
              g_atr_code: '',
              g_atr_name: '尺寸',
              g_atr_show_name: '尺寸',
              g_atr_opts: [
                {
                  g_opt_name: 'M'
                },
                {
                  g_opt_name: 'L'
                }
              ]
            },
            {
              g_atr_id: null,
              g_atr_code: '',
              g_atr_name: '是否有帽子',
              g_atr_show_name: '是否有帽子',
              g_atr_type: 'sku',
              g_atr_opts: [
                {
                  g_opt_name: '是'
                },
                {
                  g_opt_name: '否'
                }
              ]
            }
          ],
          g_metas: [
            {
              g_atr_id: '68',
              g_atr_code: '',
              g_atr_name: '适用季节',
              g_atr_show_name: '适用季节',
              gm_value: '冬季'
            },
            {
              g_atr_id: null,
              g_atr_code: '',
              g_atr_name: '制造商',
              g_atr_show_name: '制造商',
              gm_value: 'muji'
            }
          ]
        },
        errors: {},
        tabs: {
          baseTab: {
            error: false
          },
          skuAttrTab: {
            error: false
          },
          metaTab: {
            error: false
          },
          detailTab: {
            error: false
          }
        }
      }
    }
  },
  watch: {
    'goods.errors': function() {
      Object.keys(this.goods.tabs).forEach(name => {
        this.goods.tabs[name].error = this.getTabError(name)
      })
    }
  },
  components: { Category, Tinymce, ImageCropper },
  methods: {
    createGoods(data) {
      this.goods.loading = true
      return createGoods(data).then(res => {
        this.goods.loading = false
      })
    },
    getTabError(tabName) {
      let r = false
      if (Object.keys(this.goods.errors).length > 0) {
        Object.keys(this.goods.errors).forEach(name => {
          r = !!document.querySelector(`#pane-${tabName} label[for="${name}"]`)
          if (r) {
            r = true
          }
        })
      }
      return r
    },
    handleSubmitCreateSkuAttr() {
      this.$refs.skuAttrForm.validate(valid => {
        if (valid) {
          this.goods.data.g_sku_attrs.push({ ...this.skuAttrForm.data })
          this.skuAttrForm.show = false
        }
      })
    },
    handleSubmitCreateMeta() {
      this.$refs.metaForm.validate(valid => {
        if (valid) {
          this.goods.data.g_metas.push({ ...this.metaForm.data })
          this.metaForm.show = false
          this.$refs.metaForm.resetFields()
        } else {
          return false
        }
      })
      // this.goods.data.g_metas.push(this.metaForm.data)
      // return false
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
      if (data.nodes.length <= 0) {
        this.goods.curGClsName = data.g_cls_name
        this.goods.data.g_cls_id = data.g_cls_id
      }
    },
    handleMetaCategoryChange(data) {
      if (data.nodes.length <= 0) {
        this.metaForm.curGClsName = data.g_cls_name
      }
    },
    handleSkuAttrCategoryChange(data) {
      if (data.nodes.length <= 0) {
        this.skuAttrForm.curGClsName = data.g_cls_name
      }
    },
    handleCategoryAttrChange(data) {
      Object.keys(this.metaForm.data).forEach(name => {
        if (data[name]) {
          this.metaForm.data[name] = data[name]
        }
      })
    },
    handleOptValueSubmit() {
      if (this.optForm.data.opt_value) {
        this.skuAttrForm.data.g_atr_opts.push({
          g_opt_name: this.optForm.data.opt_value,
          g_opt_img: '',
          g_opt_img_url: ''
        })
        this.optForm.show = false
      }
      console.log(this.skuAttrForm.data.g_atr_opts)
    },
    handleCategorySkuAttrChange(data) {
      Object.keys(this.skuAttrForm.data).forEach(name => {
        if (data[name]) {
          this.skuAttrForm.data[name] = data[name]
        }
      })
    },
    removeOptValue(index) {
      const len = this.skuAttrForm.data.g_atr_opts.length
      Vue.set(this.skuAttrForm.data.g_atr_opts, index, null)
      this.skuAttrForm.data.g_atr_opts.splice(len - 1)
    },
    getOptValStr(attr) {
      const str = []
      attr.g_atr_opts.forEach(item => {
        str.push(item.g_opt_name)
      })
      return str.join(',')
    },
    clearCurGCls() {
      this.goods.curGClsName = ''
      this.goods.data.g_cls_id = null
    },
    clearMetaCurGCls() {
      this.metaForm.curGClsName = ''
    },
    clearSkuAttrCurGCls() {
      this.skuAttrForm.curGClsName = ''
    },
    showOptValueImgDialog(index) {
      this.imgCropperOpts.show = true
      this.imgCropperOpts.optIndex = index
    },
    resetMetaForm() {
      this.$refs.metaForm.resetFields()
      this.metaForm.data.g_atr_id = null
    },
    resetSkuAttrForm() {
      this.$refs.skuAttrForm.resetFields()
      this.skuAttrForm.data.g_atr_id = null
      this.optForm.show = false
    },
    resetOptForm() {
      this.optForm.data = {
        opt_value: ''
      }
    },
    handleCropSuccess() {

    },
    handleCropUploadSuccess(jsonData, field) {
      const optIndex = this.imgCropperOpts.optIndex
      const optValue = this.skuAttrForm.data.g_atr_opts[optIndex]
      optValue['g_opt_img_url'] = jsonData.data.file_url
      optValue['g_opt_img'] = jsonData.data.file_query_id
      Vue.set(this.skuAttrForm.data.g_atr_opts, optIndex, optValue)
      console.log(this.skuAttrForm.data.g_atr_opts)
    },
    handleCropUploadFail() {

    },
    getEnumMap,
    getLabel
  }
}
</script>

<style lang="scss">
.g_opt_name_tag{
  margin-right:5px;
}
</style>
