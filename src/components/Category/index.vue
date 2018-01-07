<template lang="html">
  <div class="">
    <el-row :gutter="getGutterVal">
      <el-col :span="getColVal">
        <p class="treeTitle" v-show="showAttrTree">所有分类</p>
        <el-tree
          ref="categoryTree"
          :data="treeData"
          :props="defaultProps"
          v-loading="loading"
          node-key="g_cls_id"
          default-expand-all
          :expand-on-click-node="true"
          :filter-node-method="filterNode"
          @node-click="handleClick"
          :render-content="renderContent">
        </el-tree>
      </el-col>
      <el-col :span="getColVal" v-if="showAttrTree">
        <p class="treeTitle" v-show="showAttrTree">所有属性</p>
        <el-tree
        v-show="showAttrTree"
        :data="attrData"
        ref="attrTree"
        v-loading="attrLoading"
        node-key="g_atr_id"
        :props="defaultAttrProps"
        @node-click="handleAttrClick"
        :render-content="renderAttrContent">
        </el-tree>
      </el-col>
    </el-row>


  </div>
</template>

<script>
import { getCls } from '@/api/global'
import { getClsAttrs } from '@/api/goods'

export default {
  props: {
    filterValue: {
      type: String
    },
    showAttrTree: {
      type: Boolean,
      default: false
    },
    clsType: {
      type: String,
      default: 'meta'
    }
  },
  computed: {
    getColVal() {
      return this.showAttrTree ? 12 : 24
    },
    getGutterVal() {
      return this.showAttrTree ? 12 : 0
    }
  },
  data() {
    return {
      treeData: [],
      attrData: [],
      curNode: {},
      curAttr: {},
      defaultProps: {
        children: 'nodes',
        label: 'g_cls_name'
      },
      defaultAttrProps: {
        children: 'nodes',
        label: 'g_atr_name'
      },
      loading: false,
      attrLoading: false
    }
  },
  watch: {
    filterValue(val) {
      this.$refs.categoryTree.filter(val)
    },
    curNode(val) {
      if (!this.showAttrTree) {
        return false
      }
      this.fetchClsAttrs({ g_cls_id: val.g_cls_id }).then(res => {
        this.attrData = res.data
      }).catch(error => {
        console.log(error)
      })
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.g_cls_name.indexOf(value) !== -1
    },
    handleClick(data) {
      this.curNode = data
      this.$emit('select-category', data)
    },
    handleAttrClick(data) {
      this.curAttr = data
      this.$emit('select-attr', data)
    },
    fetchData() {
      this.loading = true
      getCls().then((res) => {
        this.loading = false
        this.treeData = res.data
      })
    },
    fetchClsAttrs(params) {
      this.attrLoading = true
      params['g_cls_type'] = this.clsType
      return getClsAttrs(params).then(res => {
        this.attrLoading = false
        return res
      })
    },
    renderAttrContent(h, { node, data, store }) {
      return (
        <span style='flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;'>
          <span>
            <span>{node.label}({data.g_atr_type})</span>
          </span>
        </span>)
    },
    renderContent(h, { node, data, store }) {
      return (
        <span style='flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;'>
          <span>
            <span>{node.label}</span>
          </span>
        </span>)
    }
  }
}
</script>

<style lang="scss">
.treeTitle{
  margin: 0px;
}
</style>
