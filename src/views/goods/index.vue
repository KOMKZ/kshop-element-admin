<template lang="html">
  <div class="app-container calendar-list-container">
    <div class="filter-container">
    </div>

    <el-table
    :data="goodsTable.data"
    v-loading.body="goodsTable.loading"
    element-loading-text="等待加载"
    border fit highlight-current-row
    >
      <el-table-column align="center" width="95" :label="getLabel('g_id')">
        <template slot-scope="scope">
          {{scope.row.g_id}}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="getLabel('g_primary_name')">
        <template slot-scope="scope">
          {{scope.row.g_primary_name}}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="getLabel('g_status')">
        <template slot-scope="scope">
          {{scope.row.g_status | getEnumLabel('g_status', $root)}}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="getLabel('g_created_at')" sortable="custom" prop="g_created_at">
        <template slot-scope="scope">
          {{scope.row.g_created_at | parseTime}}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="getLabel('g_updated_at')" sortable="custom" prop="g_updated_at">
        <template slot-scope="scope">
          {{scope.row.g_updated_at | parseTime}}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" class-name="small-padding">
        <template slot-scope="scope">
          <router-link :to="{ path: '/goods/update', query: {g_id : scope.row.g_id} }">
            <el-button type="info" size="mini">编辑</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!goodsTable.loading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="goodsTable.listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="goodsTable.listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="goodsTable.total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import { getGoodsList } from '@/api/goods'
import { getLabel } from '@/utils/global'

export default {
  data() {
    return {
      goodsTable: {
        data: [],
        loading: false,
        list: null,
        total: 0,
        listQuery: {
          page: 1,
          limit: 10
        },
        sort: '',
        filterParams: {
        }
      }
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    getLabel,
    getGoodsList() {
      this.goodsTable.loading = true
      const params = {
        sort: this.goodsTable.sort,
        filters: this.goodsTable.filterParams,
        ...this.goodsTable.listQuery
      }
      return getGoodsList(params).then(res => {
        this.goodsTable.loading = false
        this.goodsTable.data = res.data.items
        this.goodsTable.total = res.data.count
        return res
      })
    },
    handleSizeChange(val) {
      this.goodsTable.listQuery.limit = val
      this.getGoodsList()
    },
    handleCurrentChange(val) {
      this.goodsTable.listQuery.page = val
      this.getGoodsList()
    }
  }
}
</script>

<style lang="scss">
@import "src/styles/list.scss";
</style>
