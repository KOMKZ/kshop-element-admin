<template lang="html">
  <div class="app-container">
    <div class="filter-container">
      <el-form
      ref="form"
      :model="filterParams"
      size="mini"
      label-position="top"
      >
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="保存名称">
              <el-input
              v-model="filterParams.file_save_name"
              @change="handleFilterChange"
              ></el-input>
            </el-form-item>
            <el-form-item label="文件后缀">
              <el-input
              v-model="filterParams.file_ext"
              @change="handleFilterChange"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="文件访问设置">
              <el-select
              v-model="filterParams.file_is_private"
              multiple placeholder="请选择"
              @change="handleFilterChange"
              >
                 <el-option
                   v-for="item in getEnumMap('file_is_private')"
                   :key="item.value"
                   :label="item.text"
                   :value="item.value">
                 </el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="文件时效设置">
              <el-select
              v-model="filterParams.file_is_tmp"
              multiple placeholder="请选择"
              @change="handleFilterChange"
              >
                 <el-option
                   v-for="item in getEnumMap('file_is_tmp')"
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
                v-model="filterParams.file_created_time_begin"
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
                v-model="filterParams.file_created_time_end"
                align="right"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="文件存储类型">
              <el-select
              v-model="filterParams.file_save_type"
              multiple placeholder="请选择"
              @change="handleFilterChange"
              >
                 <el-option
                   v-for="item in getEnumMap('file_save_type')"
                   :key="item.value"
                   :label="item.text"
                   :value="item.value">
                 </el-option>
               </el-select>

            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-button @click="handleFilterChange" type="info" native-type="submit" size="mini">查询</el-button>
            <el-button @click="deleteSelectedRows" type="info" size="mini">删除选中</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <el-table
    :data="list"
    @sort-change="handleOrderChange"
    @selection-change="handleSelectChange"
    v-loading.body="isloading"
    element-loading-text="等待加载"
    border fit highlight-current-row
    >
      <el-table-column align="center" type="selection">
      </el-table-column>
      <el-table-column align="center" width="95" label="文件id">
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
      <el-table-column label="创建时间" sortable="custom" prop="file_created_time">
        <template slot-scope="scope">
          {{scope.row.file_created_time | parseTime}}
        </template>
      </el-table-column>
      <el-table-column label="文件访问id">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleCopy(scope.row.file_query_id, $event)">复制</el-button>
        </template>
      </el-table-column>
      <el-table-column align="right" label="操作" width="350" class-name="small-padding">
        <template slot-scope="scope">
          <router-link :to="{ path: '/file/update', query: {u_id : scope.row.u_id} }">
            <el-button type="info" size="mini">编辑</el-button>
          </router-link>
          <el-button @click="deleteFile([scope.row.file_id])" type="warning" size="mini">删除</el-button>
          <el-button @click="showImgDialog(scope.row.file_url)" type="warning" size="mini" v-show="checkIsImg(scope.row)">预览</el-button>
          <el-button type="primary" size="mini" @click="handleCopy(scope.row.file_url, $event)">复制URL</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!isloading" class="pagination-container">
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
import { getFileList, deleteFile } from '@/api/file'
import { getEnumMap } from '@/utils/global'
import clip from '@/utils/clipboard' // use clipboard directly
import { Message } from 'element-ui'

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
      pickerOptions: {},
      currentSelectRowIds: [],
      filterParams: {
        file_save_type: '',
        file_save_name: '',
        file_is_private: '',
        file_is_tmp: '',
        file_ext: '',
        file_created_time_begin: '',
        file_created_time_end: ''
      },
      listQuery: {
        page: 1,
        limit: 9
      }
    }
  },
  methods: {
    fetchData() {
      this.isloading = true
      const params = {
        sort: this.sort,
        filters: this.filterParams,
        ...this.listQuery
      }
      getFileList(params).then(response => {
        this.list = response.data.items
        this.total = response.data.count
        this.isloading = false
      })
    },
    deleteSelectedRows() {
      if (this.currentSelectRowIds.length > 0) {
        this.deleteFile(this.currentSelectRowIds)
      }
    },
    deleteFile(file_ids) {
      this.isloading = true
      deleteFile(file_ids).then(res => {
        Message({
          message: `成功删除${res.data}条记录`,
          type: 'success',
          duration: 5 * 1000
        })
        this.isloading = false
        this.fetchData()
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
    handleSelectChange(rows) {
      this.currentSelectRowIds = []
      rows.forEach((item) => {
        this.currentSelectRowIds.push(item.file_id)
      })
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
    },
    handleCopy(url, event) {
      clip(url, event)
    },
    handleFilterChange() {
      this.fetchData()
    }
  }
}
</script>

<style lang="scss">
@import "src/styles/list.scss";

.imgDialog{
  text-align:center;
}
</style>
