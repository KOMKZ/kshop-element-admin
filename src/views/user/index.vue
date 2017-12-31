<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form
      ref="form"
      :model="filterParams"
      size="mini"
      label-position="top"
      >
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="用户昵称/邮箱">
              <el-input
              v-model="filterParams.u_email"
              @change="handleFilterChange"
              ></el-input>
            </el-form-item>
            <el-form-item label="用户id">
              <el-input
              v-model="filterParams.u_id"
              @change="handleFilterChange"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="用户验证状态">
              <el-select
              v-model="filterParams.u_auth_status"
              multiple placeholder="请选择"
              @change="handleFilterChange"
              >
                 <el-option
                   v-for="item in getEnumMap('u_auth_status')"
                   :key="item.value"
                   :label="item.text"
                   :value="item.value">
                 </el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="用户状态">
              <el-select
              v-model="filterParams.u_status"
              multiple placeholder="请选择"
              @change="handleFilterChange"
              >
                 <el-option
                   v-for="item in getEnumMap('u_status')"
                   :key="item.value"
                   :label="item.text"
                   :value="item.value">
                 </el-option>
               </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="创建时间(开始)">
              <el-date-picker
                @change="handleFilterChange"
                v-model="filterParams.u_created_at_begin"
                align="right"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="创建时间(结束)">
              <el-date-picker
                @change="handleFilterChange"
                v-model="filterParams.u_created_at_end"
                align="right"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="更新时间(开始)">
              <el-date-picker
                @change="handleFilterChange"
                v-model="filterParams.u_updated_at_begin"
                align="right"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="更新时间(结束)">
              <el-date-picker
                @change="handleFilterChange"
                v-model="filterParams.u_updated_at_end"
                align="right"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-button @click="handleFilterChange" type="info" native-type="submit" size="mini">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <el-table
    :data="list"
    @sort-change="handleOrderChange"
    v-loading.body="listLoading"
    element-loading-text="等待加载"
    border fit highlight-current-row
    >
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
      <!-- <el-table-column label="用户状态" :filters="getEnumMap('u_status')" column-key="u_status" prop="u_status"> -->
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.u_status | statusFilter('u_status')">{{scope.row.u_status | getEnumLabel('u_status', $root)}}</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column label="用户验证状态" :filters="getEnumMap('u_auth_status')" column-key="u_auth_status" prop="u_auth_status"> -->
      <el-table-column label="用户验证状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.u_auth_status | statusFilter('u_auth_status')">{{scope.row.u_auth_status | getEnumLabel('u_auth_status', $root)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" sortable="custom" prop="u_created_at">
        <template slot-scope="scope">
          {{scope.row.u_created_at | parseTime}}
        </template>
      </el-table-column>
      <el-table-column label="更新时间" sortable="custom" prop="u_updated_at">
        <template slot-scope="scope">
          {{scope.row.u_updated_at | parseTime}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding">
        <template slot-scope="scope">
          <router-link :to="{ path: '/user/update', query: {u_id : scope.row.u_id} }">
            <el-button type="info" size="mini">编辑</el-button>
          </router-link>
          <el-button @click="toggerUser(scope.row)" type="warning" size="mini" v-if="scope.row.u_status == 'active'">锁定</el-button>
          <el-button @click="toggerUser(scope.row)" type="success" size="mini" v-else-if="scope.row.u_status == 'locked'">解锁</el-button>
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
import { getList, updateUser } from '@/api/user'
import { getEnumMap } from '@/utils/global'

export default {
  data() {
    return {
      pickerOptions: {

      },
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 9
      },
      sort: '',
      filterParams: {
        u_email: '',
        u_id: '',
        u_status: [],
        u_auth_status: [],
        u_updated_at_begin: '',
        u_updated_at_end: '',
        u_created_at_begin: '',
        u_created_at_end: ''
      },
      listLoading: true
    }
  },
  computed: {
    getSortParams() {
      return this.sort
      // const orders = []
      // Object.keys(this.sort).forEach((key) => {
      //   if (this.sort[key]) {
      //     orders.push(this.sort[key])
      //   }
      // })
      // return orders.join(',')
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
      const params = {
        sort: this.getSortParams,
        filters: this.filterParams,
        ...this.listQuery
      }
      getList(params).then(response => {
        this.list = response.data.items
        this.total = response.data.count
        this.listLoading = false
      })
    },
    toggerUser(userInfo) {
      updateUser(userInfo['u_id'], { u_status: userInfo['u_status'] === 'locked' ? 'active' : 'locked' }).then(response => {
        this.fetchData()
      })
    },
    getEnumMap(name) {
      return getEnumMap(name)
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.fetchData()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.fetchData()
    },
    handleOrderChange({ column, prop, order }) {
      if (order === 'ascending') {
        this.sort = prop
      } else if (order === 'descending') {
        this.sort = '-' + prop
      } else {
        this.sort = ''
      }
      this.fetchData()
    },
    handleFilterChange() {
      this.fetchData()
    }
  }
}
</script>
<style lang="scss">
@import "src/styles/list.scss";
</style>
