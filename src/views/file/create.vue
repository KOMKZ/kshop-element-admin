<template lang="html">
  <div class="app-container">
    <el-form ref="createFileForm" v-loading="isloading" :model="form.data" label-width="120px">
      <el-row>
        <el-col :span="4">
          <el-button native-type="submit" type="primary" size="mini" @click="handleSubmit">确认上传</el-button>
        </el-col>
      </el-row>
      <br>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item label="文件访问设置">
            <el-select v-model="form.data.file_is_private" placeholder="请选择">
              <el-option v-for="item in getEnumMap('file_is_private')" :key="item.value" :label="item.text" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否是临时文件">
            <el-select v-model="form.data.file_is_tmp" placeholder="请选择">
              <el-option v-for="item in getEnumMap('file_is_tmp')" :key="item.value" :label="item.text" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文件存储类型">
            <el-select v-model="form.data.file_save_type" placeholder="请选择">
              <el-option v-for="item in getEnumMap('file_save_type')" :key="item.value" :label="item.text" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文件分类">
            <el-select v-model="form.data.file_category" placeholder="请选择">
              <el-option v-for="item in getEnumMap('file_category')" :key="item.value" :label="item.text" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-upload
            ref="uploader"
            action="http://localhost:8011/file/create"
            :auto-upload="false"
            :headers="uploadOpts.headers"
            :data="form.data"
            :limit="1"
            :file-list="fileList"
            :on-success="handleSuccess">
            <el-button size="small" type="primary">选择文件</el-button>
          </el-upload>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="24">
        <json-editor ref="jsonEditor" v-model="fileResult"></json-editor>
      </el-col>
    </el-row>


  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { getEnumMap } from '@/utils/global'
import JsonEditor from '@/components/JsonEditor'

export default {
  data() {
    return {
      isloading: false,
      form: {
        data: {
          file_is_private: '0',
          file_is_tmp: '0',
          file_save_type: 'oss',
          file_category: 'default'
        }
      },
      uploadOpts: {
        headers: {
          Authorization: 'Bearer ' + getToken()
        },
        data: {
          file_is_tmp: 0
        }
      },
      fileList: [
      ],
      fileResult: ''
    }
  },
  components: {JsonEditor},
  methods: {
    getEnumMap(name) {
      return getEnumMap(name, this.$store.getters.enums)
    },
    handleSuccess(response, file, fileList) {
      this.isloading = false
      this.fileResult = response
      this.$refs.uploader.clearFiles()
    },
    handleSubmit() {
      this.isloading = true
      this.$refs.uploader.submit()
      return false
    }
  }
}
</script>

<style lang="scss">
</style>
