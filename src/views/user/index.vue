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
      <el-table-column label="用户邮箱">
        <template slot-scope="scope">
          {{scope.row.u_email}}
        </template>
      </el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.u_status | statusFilter('u_status')">{{scope.row.u_status | getEnumLabel('u_status', $root)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="用户验证状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.u_auth_status | statusFilter('u_auth_status')">{{scope.row.u_auth_status | getEnumLabel('u_auth_status', $root)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{scope.row.u_created_at | parseTime}}
        </template>
      </el-table-column>
      <el-table-column label="更新时间">
        <template slot-scope="scope">
          {{scope.row.u_updated_at | parseTime}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding">
        <template slot-scope="scope">
          <router-link :to="{ name: 'UserUpdate', params: {u_id : scope.row.u_id} }" :class="'el-button el-button--info el-button--mini'">编辑</router-link>
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
        limit: 9
      },
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  filters: {
    statusFilter(value, type) {
      const statusMap = {
        active: 'success',
        locked: 'info',
        not_auth: 'danger'
      }
      const authStatusMap = {
        not_auth: 'info',
        had_auth: 'success'
      }
      switch (type) {
        case 'u_status':
          return statusMap[value]
        case 'u_auth_status':
          return authStatusMap[value]
        default:
          return 'success'
      }
    }
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
