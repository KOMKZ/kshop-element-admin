<template lang="html">
	<div class="app-container">
    <el-form ref="updateUserForm" :rules="rules" v-loading="isloading" :model="userForm" label-width="120px">
      <el-row>
        <el-col :span="4">
          <el-button native-type="submit" type="primary" size="mini" @click="handleSubmitUpdate">确认修改</el-button>
        </el-col>
      </el-row>
      <el-tabs v-model="currentTabName">
        <el-tab-pane label="基本信息" name="baseTab">
          <el-row>
            <el-col :span="6">
              <el-form-item label="用户名称">
                <el-input size="small" v-model="userForm.u_username"></el-input>
              </el-form-item>
              <el-form-item label="用户邮箱">
                <el-input size="small" v-model="userForm.u_email"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="输入密码" prop="password">
                <el-input size="small" :type="pwdType" v-model="userForm.password"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="password_confirm">
                <el-input size="small" :type="pwdType" v-model="userForm.password_confirm"></el-input>
                <span class="show-pwd" @click="togglePwdType"><svg-icon icon-class="eye" /></span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="用户验证状态">
                <el-select
                v-model="userForm.u_auth_status"
                 placeholder="请选择"
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
                v-model="userForm.u_status"
                placeholder="请选择"
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
      		</el-row>
          <el-row>
      		</el-row>
        </el-tab-pane>
        <el-tab-pane label="扩展信息" name="extendTab">
          <el-row>
            <el-col :span="4">
              <el-form-item label="当前头像">
                <img :src="userForm.u_avatar_url1" width="120" height="120"></img>
              	<image-cropper field="img"
                      @crop-success="handleCropSuccess"
                      @crop-upload-success="handleCropUploadSuccess"
                      @crop-upload-fail="handleCropUploadFail"
                      v-model="imgCropperOpts.show"
              		:width="100"
              		:height="100"
                  :field="'file'"
              		url="http://localhost:8011/file/create"
              		:params="imgCropperOpts.params"
              		:headers="imgCropperOpts.headers"
              		img-format="png">
                </image-cropper>
                <el-button type="primary" size="mini" @click="imgCropperOpts.show = true">修改</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
  </el-form>
	</div>
</template>

<script>
import { getEnumMap } from '@/utils/global'
import { getUser, updateUser } from '@/api/user'
import ImageCropper from 'vue-image-crop-upload'
import { getToken } from '@/utils/auth'

export default {
  data() {
    const checkConfirm = (rule, value, callback) => {
      if (!value && !this.userForm.password) {
        return callback()
      }
      if (value !== this.userForm.password) {
        return callback('两次输入的密码不一致')
      }
      callback()
    }
    return {
      isloading: true,
      currentTabName: 'extendTab',
      pwdType: 'password',
      imgCropperOpts: {
        headers: {
          Authorization: 'Bearer ' + getToken()
        },
        show: false,
        params: {
          file_save_type: 'oss'
        }
      },
      rules: {
        password: [
          { min: 6, max: 20, trigger: 'blur', message: '长度在 6 到 20 个字符' }
        ],
        password_confirm: [
          { validator: checkConfirm, trigger: 'blur' }
        ]
      },
      userForm: {
        u_username: null,
        u_email: null,
        password: null,
        password_confirm: null,
        u_auth_status: 'not_auth',
        u_status: 'active',
        u_created_at: null,
        u_updated_at: null,
        u_avatar_url1: '',
        u_avatar_url2: '',
        u_avatar_id1: ''
      }
    }
  },
  components: { ImageCropper },
  mounted() {
    this.refreshUser(this.$route.query['u_id'])
  },
  methods: {
    togglePwdType() {
      this.pwdType = this.pwdType === 'password' ? 'text' : 'password'
    },
    getEnumMap(name) {
      return getEnumMap(name, this.$store.getters.enums)
    },
    refreshUser(u_id) {
      this.isloading = true
      getUser(u_id).then(response => {
        Object.keys(this.userForm).forEach(key => {
          if (response.data.hasOwnProperty(key)) {
            this.userForm[key] = response.data[key]
          }
        })
        this.isloading = false
      })
    },
    handleCropSuccess() {

    },
    handleCropUploadSuccess(jsonData, field) {
      this.userForm.u_avatar_url1 = jsonData.data.file_url
      const u_id = this.$route.query['u_id']
      updateUser(u_id, { u_avatar_id1: jsonData.data.file_query_id }).then(res => {
        this.refreshUser(u_id)
        this.imgCropperOpts.show = false
        this.currentTabName = 'extendTab'
      })
    },
    handleCropUploadFail() {

    },
    handleSubmitUpdate() {
      this.$refs.updateUserForm.validate(valid => {
        if (valid) {
          this.isloading = true
          const uid = this.$route.query['u_id']
          updateUser(uid, this.userForm).then(response => {
            this.isloading = false
            this.refreshUser(uid)
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.show-pwd {
  position: absolute;
  right: 10px;
  top: 3px;
  font-size: 16px;
  color: $dark_gray;
  cursor: pointer;
  user-select:none;
}
</style>
