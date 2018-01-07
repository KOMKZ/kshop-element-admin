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
    <el-row :gutter="12">
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
          @node-click="handleClick"
          :render-content="renderContent">
        </el-tree>
      </el-col>
      <el-col :span="16">
        <el-table
          v-loading="attrLoading"
          size="mini"
          :data="attrData">
          <el-table-column
            prop="g_atr_id"
            label="属性id">
          </el-table-column>
          <el-table-column
            prop="g_atr_name"
            label="元属性名称">
          </el-table-column>
          <el-table-column
            prop="g_atr_type"
            label="元属性类型">
          </el-table-column>
          <el-table-column
            prop="g_atr_show_name"
            label="元属性展示名称">
          </el-table-column>
          <el-table-column
            prop="g_atr_code"
            label="元属性字段名">
          </el-table-column>
          <el-table-column align="center" label="操作" width="350" class-name="small-padding">
            <template slot-scope="scope">
              <el-button type="info" @click="handleDeleteClsAttrSubmit(scope.row)" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
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
          <el-tag type="info">{{getCreateFormCurClsName()}}</el-tag>
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

    <el-dialog title="创建分类属性" :visible.sync="attrForm.show" v-loading="attrForm.loading" >
      <el-form :model="attrForm.data" :rules="attrForm.rules" ref="attrForm" label-position="top">
        <el-row>
          <el-col :span="12">
            <el-form-item label="当前父级分类">
              <el-tag type="info">{{getCreateFormCurClsName('createAttr')}}</el-tag>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item :label="getLabel('g_atr_code')" :error="attrForm.errors.g_atr_code" prop="g_atr_code">
              <el-input v-model="attrForm.data.g_atr_code" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item :label="getLabel('g_atr_name')" :error="attrForm.errors.g_atr_name" prop="g_atr_name">
              <el-input v-model="attrForm.data.g_atr_name" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="getLabel('g_atr_show_name')" :error="attrForm.errors.g_atr_show_name" prop="g_atr_show_name">
              <el-input v-model="attrForm.data.g_atr_show_name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item :label="getLabel('g_atr_type')" :error="attrForm.errors.g_atr_type" prop="g_atr_type">
              <el-select
              v-model="attrForm.data.g_atr_type"
              placeholder="请选择"
              >
               <el-option
                 v-for="item in getEnumMap('g_atr_type')"
                 :key="item.value"
                 :label="item.text"
                 :value="item.value">
               </el-option>
             </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="attrForm.show = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitCreateAttr">确 定</el-button>
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
import { getLabel, populateErrors, getEnumMap } from '@/utils/global'
import { getClsAttrs, createClsAttr, deleteClsAttr } from '@/api/goods'

export default {
  data() {
    return {
      filterText: '',
      filterForm: {
        data: {
          g_cls_name: ''
        }
      },
      attrData: [],
      attrLoading: false,
      curNode: {},
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
      attrForm: {
        data: {
          g_atr_type: 'meta',
          g_atr_opt_img: 0,
          g_atr_name: '',
          g_atr_show_name: '',
          g_atr_cls_type: 'cls',
          g_atr_cls_id: 0,
          g_atr_code: ''
        },
        errors: {
        },
        rules: {
          g_atr_name: [{ required: true }],
          g_atr_show_name: [{ required: true }]
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
    },
    curNode(val) {
      this.fetchClsAttrs({ g_cls_id: val.g_cls_id }).then((res) => {
      }).catch(error => {
        console.log(error)
        this.attrLoading = false
      })
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    getLabel,
    getEnumMap,
    getCreateFormCurClsName(name = 'create') {
      switch (name) {
        case 'create':
          return this.createForm.currentCls['g_cls_name'] ? this.createForm.currentCls['g_cls_name'] : '顶级分类'
        case 'createAttr':
          return this.attrForm.currentCls['g_cls_name'] ? this.attrForm.currentCls['g_cls_name'] : '顶级分类'
      }
    },
    createClsAttr() {
      this.attrForm.loading = true
      return createClsAttr(this.attrForm.data).then(res => {
        this.attrForm.loading = false
        return res
      })
    },
    updateCls() {
      this.editForm.loading = true
      return updateCls(this.editForm.data).then(res => {
        this.editForm.loading = false
      })
    },
    deleteClsAttr(g_atr_id) {
      this.attrLoading = true
      return deleteClsAttr(g_atr_id).then(res => {
        this.attrLoading = false
        return res
      })
    },
    handleClick(data) {
      this.curNode = data
    },
    fetchClsAttrs(params) {
      this.attrLoading = true
      return getClsAttrs(params).then(res => {
        this.attrLoading = false
        this.attrData = res.data
        return res
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
    handleDeleteClsAttrSubmit(attr) {
      this.deleteClsAttr(attr.g_atr_id).then(res => {
        this.fetchClsAttrs({ g_cls_id: attr.g_atr_cls_id }).then((res) => {
        }).catch(error => {
          this.attrLoading = false
          console.log(error)
        })
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
    handleSubmitCreateAttr() {
      this.$refs.attrForm.validate(result => {
        if (result) {
          this.createClsAttr().then(res => {
            this.attrForm.show = false
            this.fetchClsAttrs({ g_cls_id: res.data.g_atr_cls_id }).then((res) => {
            }).catch(error => {
              console.log(error)
              this.attrLoading = false
            })
          }).catch(res => {
            if (res.message) {
              this.attrForm.errors = populateErrors(res.message)
            }
            this.attrForm.loading = false
          })
        }
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
    toggleCreateAttrDialog(node) {
      // if(node.data.nodes.length > 0){
      //   return false
      // }
      if (this.attrForm.show) {
        this.attrForm.show = false
      } else {
        this.resetAttrForm()
        this.attrForm.show = true
      }
      if (node) {
        this.attrForm.currentCls = node.data
        this.attrForm.data.g_atr_cls_id = node.data.g_cls_id
      }
    },
    toggleDeleteFormDialog(node) {
      this.deleteForm.showProp = !this.deleteForm.showProp
      this.deleteForm.curDelCls = node
    },
    resetAttrForm() {
      this.attrForm.data = {
        g_atr_type: 'meta',
        g_atr_opt_img: 0,
        g_atr_name: '',
        g_atr_show_name: '',
        g_atr_cls_type: 'cls',
        g_atr_cls_id: 0,
        g_atr_code: ''
      }
      this.attrForm.errors = {}
    },
    resetCreateForm() {
      this.createForm.data = {
        g_cls_name: '',
        g_cls_show_name: '',
        g_cls_pid: 0
      }
      this.createForm.errors = {}
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
            <el-button style='font-size: 12px;' type='text' on-click={() => { this.toggleCreateAttrDialog(node) }}>增加属性</el-button>
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
