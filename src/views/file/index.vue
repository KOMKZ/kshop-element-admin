<template lang="html">
  <div class="app-container">
    <el-table
    :data="list"
    @sort-change="handleOrderChange"
    v-loading.body="listLoading"
    element-loading-text="等待加载"
    border fit highlight-current-row
    >
      <el-table-column align="center" width="95" label="用户id">
        <template slot-scope="scope">
          {{scope.row.file_id}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="文件保存名称">
        <template slot-scope="scope">
          {{scope.row.file_save_name}}
        </template>
      </el-table-column>
      <el-table-column label="文件分类">
        <template slot-scope="scope">
          {{scope.row.file_category | getEnumLabel('file_category', $root)}}
        </template>
      </el-table-column>
      <el-table-column label="访问设置">
        <template slot-scope="scope">
          {{scope.row.file_is_private | getEnumLabel('file_is_private', $root)}}
        </template>
      </el-table-column>
      <el-table-column label="时效说明">
        <template slot-scope="scope">
          {{scope.row.file_is_tmp | getEnumLabel('file_is_tmp', $root)}}
        </template>
      </el-table-column>
      <el-table-column label="存储类型">
        <template slot-scope="scope">
          {{scope.row.file_save_type | getEnumLabel('file_save_type', $root)}}
        </template>
      </el-table-column>
      <el-table-column align="center" width="95" label="文件后缀">
        <template slot-scope="scope">
          {{scope.row.file_ext}}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" sortable="custom" prop="u_created_at">
        <template slot-scope="scope">
          {{scope.row.file_created_time | parseTime}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding">
        <template slot-scope="scope">
          <router-link :to="{ path: '/file/update', query: {u_id : scope.row.u_id} }">
            <el-button type="info" size="mini">编辑</el-button>
          </router-link>
          <el-button @click="showImgDialog(scope.row.file_url)" type="warning" size="mini" v-show="checkIsImg(scope.row)">预览</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog
      :visible.sync="imgDialogVisable"
      :before-close="handleImgDialogclosed"
      class="imgDialog"
      >
      <img :src="imgDialogSrc">
      <!-- <i class="el-icon-loading" v-show="getImgStatus"></i> -->
    </el-dialog>
  </div>
</template>

<script>
import { getFileList } from '@/api/file'
import { getEnumMap } from '@/utils/global'

export default {
  created() {
    this.fetchData()
  },
  data() {
    return {
      isloading: false,
      imgDialogVisable: false,
      imgDialogSrc: '',
      sort: {},
      total: 0,
      list: [],
      filterParams: {},
      listQuery: {
        page: 1,
        limit: 9
      }
    }
  },
  computed: {
    getSortParams() {
      return this.sort
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
      getFileList(params).then(response => {
        this.list = response.data.items
        this.total = response.data.count
        this.listLoading = false
      })
    },
    showImgDialog(url) {
      this.imgDialogVisable = true
      this.imgDialogSrc = url
    },
    getEnumMap(name) {
      return getEnumMap(name, this.$store.getters.enums)
    },
    checkIsImg(row) {
      return ['png', 'jpg'].indexOf(row.file_ext) >= 0
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.fetchData()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.fetchData()
    },
    handleImgDialogclosed(done) {
      this.imgDialogSrc = ''
      return done()
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
    }
  }
}
</script>

<style lang="scss">
.imgDialog{
  text-align:center;
}
</style>
