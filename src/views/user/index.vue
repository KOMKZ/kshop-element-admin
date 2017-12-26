<template>
  <div class="app-container">
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="等待加载" border fit highlight-current-row>
      <el-table-column align="center" width="95" label="用户id">
        <template slot-scope="scope">
          {{scope.row.u_id}}
        </template>
      </el-table-column>
      <el-table-column label="用户名称">
        <template slot-scope="scope">
          {{scope.row.u_username}}
        </template>
      </el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          {{scope.row.u_status | getEnumLabel('u_status', $root)}}
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getList } from '@/api/user'
export default {
  data() {
    return {
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.count
        this.listLoading = false
      })
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.fetchData()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.fetchData()
    }
  }
}
</script>