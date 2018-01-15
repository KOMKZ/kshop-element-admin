<template lang="html">
  <div class="app-container">
    <el-form :rules="skuForm.rules" :model="skuForm.data" label-position="top" size="small" ref="skuForm">
      <el-row>
        <el-col :span="12">
          <el-button native-type="submit" type="primary" size="small" @click="handleSubmitSave">{{skuForm.type === 'update' ? "修改商品SKU" : '创建商品SKU'}}</el-button>
          <el-button native-type="submit" type="primary" size="small" @click="handleSubmitRefresh">刷新商品SKU</el-button>
          <el-select
          size='small'
          :value="getCurSkuValue"
          placeholder="切换sku编辑"
          >
           <el-option
             v-for="item in skuForm.goods.g_vaild_sku_ids"
             :key="item.value"
             :label="item.name"
             :value="item.value">
             <router-link :to="{ path: '/goods/sku-update', query: {g_id : skuForm.goods.g_id, g_sku_value: item.value} }">
               {{item.name}}
             </router-link>
           </el-option>
         </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-tabs v-model="skuForm.currentTabName">
            <el-tab-pane name="baseTab">
              <span slot="label">
                基础信息
              </span>
              <el-row>
                <el-col :span="4">
                  <el-form-item :label="getLabel('g_sku_value_name')" :error="skuForm.errors.g_sku_name" prop="g_sku_value_name">
                    <el-input disabled :value="getCurSkuValueName"></el-input>
                  </el-form-item>
                  <el-form-item :label="getLabel('g_sku_name')" :error="skuForm.errors.g_sku_name" prop="g_sku_name">
                    <el-input v-model="skuForm.data.g_sku_name"></el-input>
                  </el-form-item>
                  <el-form-item :label="getLabel('g_sku_stock_num')" :error="skuForm.errors.g_sku_stock_num" prop="g_sku_stock_num">
                    <el-input v-model="skuForm.data.g_sku_stock_num"></el-input>
                  </el-form-item>
                  <el-form-item :label="getLabel('g_sku_price')" :error="skuForm.errors.g_sku_price" prop="g_sku_price">
                    <el-input v-model="skuForm.data.g_sku_price"></el-input>
                  </el-form-item>
                  <el-form-item :label="getLabel('g_sku_sale_price')" :error="skuForm.errors.g_sku_sale_price" prop="g_sku_sale_price">
                    <el-input v-model="skuForm.data.g_sku_sale_price"></el-input>
                  </el-form-item>
                  <el-form-item :label="getLabel('g_sku_status')" :error="skuForm.errors.g_sku_status" prop="g_sku_status">
                    <el-select
                    v-model="skuForm.data.g_sku_status"
                    placeholder="请选择"
                    >
                     <el-option
                       v-for="item in getEnumMap('g_sku_status')"
                       :key="item.value"
                       :label="item.text"
                       :value="item.value">
                     </el-option>
                   </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getOneSku, getGoods, createOneSku } from '@/api/goods'
import { getEnumMap, getLabel } from '@/utils/global'
import { Message } from 'element-ui'

export default {
  data() {
    return {
      skuForm: {
        data: {
          g_sku_name: '',
          g_id: '',
          g_sku_value: '',
          g_sku_stock_num: 0,
          g_sku_price: '1',
          g_sku_sale_price: '1',
          g_sku_status: 'draft'
        },
        rules: {
          g_sku_name: [
            { required: true }
          ],
          g_sku_value: [
            { required: true }
          ],
          g_sku_stock_num: [
            { required: true }
          ],
          g_sku_price: [
            { required: true }
          ],
          g_sku_sale_price: [
            { required: true }
          ]
        },
        goods: {},
        errors: {
          g_sku_name: '',
          g_sku_value: '',
          g_sku_stock_num: '',
          g_sku_price: '',
          g_sku_sale_price: '',
          g_sku_status: ''
        },
        type: 'update',
        currentTabName: 'baseTab',
        loading: false
      }
    }
  },

  computed: {
    getCurSkuValue() {
      return this.$route.query['g_sku_value']
    },
    getCurSkuValueName() {
      if (!this.skuForm.goods['g_vaild_sku_ids']) {
        return ''
      }
      const curSkuValue = this.$route.query['g_sku_value']
      let i = 0
      let skuItem
      while (skuItem = this.skuForm.goods['g_vaild_sku_ids'][i]) {
        if (curSkuValue === skuItem['value']) {
          return skuItem['name']
        }
        i++
      }
      return ''
    }
  },
  mounted() {
    this.sendSkuFormRefresh()
  },
  watch: {
    '$route': function() {
      this.sendSkuFormRefresh()
    }
  },
  methods: {
    getEnumMap, getLabel,
    sendSkuFormRefresh() {
      this.skuForm.loading = true
      return getOneSku(this.$route.query).then(res => {
        this.skuForm.loading = false
        Object.keys(this.skuForm.data).forEach(name => {
          if (res.data[name]) {
            this.skuForm.data[name] = res.data[name]
          }
        })
        return res
      }).catch(res => {
        if (res.code === 404) {
          this.skuForm.loading = false
          Message({ message: '当前是创建模式', type: 'warning', duration: 10 * 1000 })
          this.skuForm.type = 'create'
          this.skuForm.data.g_id = this.$route.query['g_id']
          this.skuForm.data.g_sku_value = this.$route.query['g_sku_value']
        }
      }).finally(() => {
        getGoods(this.$route.query['g_id']).then(res => {
          this.skuForm.goods = res.data
          if (this.skuForm.type === 'create') {
            this.skuForm.data.g_sku_name = res.data.g_primary_name
          }
        })
      })
    },
    sendSkuFormCreate() {
      this.skuForm.loading = true
      return createOneSku(this.skuForm.data).then(res => {
        this.skuForm.loading = false
        return res
      })
    },
    handleSubmitSave() {
      if (this.skuForm.type === 'create') {
        this.handleSubmitCreate()
      } else {
        this.handleSubmitUpdate()
      }
    },
    handleSubmitCreate() {
      this.$refs.skuForm.validate(valid => {
        if (valid) {
          this.sendSkuFormCreate().then(res => {
            Message({type: 'success', message: "创建商品成功"})
          })
        }
      })
    },
    handleSubmitUpdate() {

    },
    handleSubmitRefresh() {
      this.sendSkuFormRefresh()
    }
  }
}
</script>

<style lang="css">
</style>
