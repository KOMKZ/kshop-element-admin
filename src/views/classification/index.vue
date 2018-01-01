<template lang="html">
  <div class="app-container">
    <div class="filter-container">
      <el-form
      ref="form"
      :model="filterForm"
      size="mini"
      label-position="top"
      >
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="分类名称">
              <el-input
              v-model="filterText"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-button @click="toggleCreateFormDialog()" type="info" size="mini">增加一级分类</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-row>
      <el-col :span="8">
        <el-tree
          ref="tree2"
          :data="clsBox.data"
          :props="defaultProps"
          v-loading="clsBox.loading"
          show-checkbox
          node-key="g_cls_id"
          default-expand-all
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          :render-content="renderContent">
        </el-tree>
      </el-col>
    </el-row>

    <el-dialog title="编辑分类信息" :visible.sync="editForm.show" v-loading="editForm.loading">
      <el-form :model="editForm.data">
        <el-form-item :label="getLabel('g_cls_name')">
          <el-input v-model="editForm.data.g_cls_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="getLabel('g_cls_show_name')">
          <el-input v-model="editForm.data.g_cls_show_name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editForm.show = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitEdit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="创建分类" :visible.sync="createForm.show" v-loading="createForm.loading">
      <el-form :model="createForm.data">
        <el-form-item label="当前父级分类">
          <el-tag type="info">{{getCreateFormCurClsName}}</el-tag>
        </el-form-item>
        <el-form-item :label="getLabel('g_cls_name')" :error="createForm.errors.g_cls_name">
          <el-input v-model="createForm.data.g_cls_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="getLabel('g_cls_show_name')" :error="createForm.errors.g_cls_show_name">
          <el-input v-model="createForm.data.g_cls_show_name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createForm.show = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitCreate">确 定</el-button>
      </div>
    </el-dialog>

    <el-popover
      ref="delPopover"
      placement="start"
      v-model="deleteForm.showProp">
      <p>你确定要删除吗？</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="deleteForm.showProp = false">取消</el-button>
        <el-button :loading="deleteForm.loading" type="primary" size="mini" @click="handleDeleteSubmit">确定</el-button>
      </div>
    </el-popover>

  </div>
</template>

<script>
import { getCls, updateCls, createCls, deleteCls } from '@/api/global'
import { getLabel, populateErrors } from '@/utils/global'

export default {
  data() {
    return {
      filterText: '',
      filterForm: {
        data: {
          g_cls_name: ''
        }
      },
      deleteForm: {
        showProp: false,
        loading: false,
        curDelCls: null
      },
      createForm: {
        data: {
          g_cls_name: '',
          g_cls_show_name: '',
          g_cls_pid: 0
        },
        errors: {
          g_cls_name: '',
          g_cls_show_name: ''
        },
        currentCls: {},
        show: false,
        loading: false
      },
      editForm: {
        data: {
          g_cls_name: '',
          g_cls_show_name: '',
          g_cls_id: ''
        },
        show: false,
        loading: false
      },
      defaultProps: {
        children: 'nodes',
        label: 'g_cls_name'
      },
      clsBox: {
        data: [],
        loading: false
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  computed: {
    getCreateFormCurClsName() {
      return this.createForm.currentCls['g_cls_name'] ? this.createForm.currentCls['g_cls_name'] : '顶级分类'
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    getLabel,
    updateCls() {
      this.editForm.loading = true
      return updateCls(this.editForm.data).then(res => {
        this.editForm.loading = false
      })
    },
    deleteCls(g_cls_id) {
      this.deleteForm.loading = true
      return deleteCls(g_cls_id).then(res => {
        this.deleteForm.loading = false
      })
    },
    createCls() {
      this.createForm.loading = true
      return createCls(this.createForm.data).then(res => {
        this.createForm.loading = false
      })
    },
    fetchData() {
      this.clsBox.loading = true
      getCls().then((res) => {
        this.clsBox.loading = false
        this.clsBox.data = res.data
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.g_cls_name.indexOf(value) !== -1
    },
    handleDeleteSubmit() {
      const g_cls_id = this.deleteForm.curDelCls.data.g_cls_id
      this.deleteCls(g_cls_id).then(res => {
        this.deleteForm.showProp = false
        this.fetchData()
      }).catch((error) => {
        this.deleteForm.loading = false
        this.deleteForm.showProp = false
        console.log(error)
      })
    },
    handleSubmitEdit() {
      this.updateCls().then(res => {
        this.editForm.show = false
        this.fetchData()
      }).catch(error => {
        this.editForm.loading = false
        console.log(error)
      })
    },
    handleSubmitCreate() {
      this.createCls().then(res => {
        this.createForm.show = false
        this.fetchData()
      }).catch(res => {
        if (res.message) {
          this.createForm.errors = populateErrors(res.message)
        }
        this.createForm.loading = false
      })
    },
    toggleCreateFormDialog(node) {
      if (this.createForm.show) {
        this.createForm.show = false
      } else {
        this.resetCreateForm()
        this.createForm.show = true
      }
      if (node) {
        this.createForm.currentCls = node.data
        this.createForm.data.g_cls_pid = node.data.g_cls_id
      }
    },
    toggleDeleteFormDialog(node) {
      this.deleteForm.showProp = !this.deleteForm.showProp
      this.deleteForm.curDelCls = node
    },
    resetCreateForm() {
      this.createForm.data = {
        g_cls_name: '',
        g_cls_show_name: '',
        g_cls_pid: 0
      }
      this.createForm.errors = {
        g_cls_name: '',
        g_cls_show_name: ''
      }
    },
    toggleEditFormDialog(node) {
      if (this.editForm.show) {
        this.editForm.show = false
      } else {
        this.editForm.show = true
        this.editForm.data.g_cls_name = node.data.g_cls_name
        this.editForm.data.g_cls_show_name = node.data.g_cls_show_name
        this.editForm.data.g_cls_id = node.data.g_cls_id
      }
    },
    renderContent(h, { node, data, store }) {
      return (
        <span style='flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;'>
          <span>
            <span>{node.label}</span>
          </span>
          <span>
            <el-button style='font-size: 12px;' type='text' on-click={() => { this.toggleEditFormDialog(node) }}>编辑</el-button>
            <el-button style='font-size: 12px;' type='text' on-click={() => { this.toggleCreateFormDialog(node) }}>增加子分类</el-button>
            <el-button style='font-size: 12px;' type='text' on-click={() => { this.toggleDeleteFormDialog(node) } }>删除</el-button>
          </span>
        </span>)
    }
  }
}
</script>

<style lang="scss">
@import "src/styles/list.scss";

</style>
