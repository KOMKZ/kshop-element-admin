<template lang="html">
  <div class="">
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
  </div>
</template>

<script>
import { getCls } from '@/api/global'

export default {
  props: [
    'filterValue'
  ],
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: 'nodes',
        label: 'g_cls_name'
      },
      loading: false
    }
  },
  watch: {
    filterValue(val) {
      this.$refs.categoryTree.filter(val)
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
      this.$emit('select-category', data)
    },
    fetchData() {
      this.loading = true
      getCls().then((res) => {
        this.loading = false
        this.treeData = res.data
      })
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
</style>
