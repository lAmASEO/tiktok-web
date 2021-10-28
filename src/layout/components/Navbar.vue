<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <!-- 代理商 2 -->
      <!-- <span style="margin-right: 10px" v-if="role === 2" @click="ShareLinks">邀请用户</span> -->
      <!-- <span style="color: red" v-if="role === 2">VIP8 </span> -->
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <span style="margin-right: 20px">{{ userName }}</span>
          <img src="../../assets/avatar.gif" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              主页
            </el-dropdown-item>
          </router-link>
          <!-- <el-dropdown-item v-if="role === 1" @click.native="changeDetermine">
              绑定IP
          </el-dropdown-item> -->
          <el-dropdown-item v-if="role === 0" @click.native="changePassword">
              修改密码
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- 绑定IP -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="showDetermineIp"
      width="35%">
      <el-form label-width="60px" :model="modifyForm" label-position="left">
        <el-form-item label="IP地址:" prop="proxy_url">
          <el-input placeholder="请输入IP地址" v-model="modifyForm.proxy_url"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDetermineIp = false" style="margin-left: 10px">取 消</el-button>
        <el-button type="primary" @click="submitPassword">绑定</el-button>
      </span>
    </el-dialog>

    <!-- 修改密码 -->
    <el-dialog
      title="修改密码"
      :visible.sync="passwordVisible"
      width="25%">
      <el-form label-width="80px" :model="modifyForm" label-position="left" :rules="form_rule">
        <el-form-item label="用户名:">
          <el-input v-model="userName" readonly></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="passwordOne">
          <el-input placeholder="请输入密码" v-model="modifyForm.passwordOne" show-password></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="passwordTwo">
          <el-input placeholder="请输入再次密码" v-model="modifyForm.passwordTwo" show-password></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="passwordVisible = false" style="margin-left: 10px">取 消</el-button>
        <el-button type="primary" @click="submitDetermineIp">绑定</el-button>
      </span>
    </el-dialog>

    <!-- 分享注册链接 邀请用户 -->
    <el-dialog
      title="邀请用户"
      :visible.sync="shareLinkVisible"
      width="35%">
      <el-form label-width="80px" :model="modifyForm" label-position="left">
        <el-form-item label="链接地址:" prop="proxy_url">
          <el-input placeholder="请输入链接地址" v-model="modifyForm.proxy_url" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shareLinkVisible = false" style="margin-left: 10px">取 消</el-button>
        <el-button type="primary" @click="shareLinkVisible = false">复制</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import * as api from '@/api/index'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      userName: window.sessionStorage.getItem('userName'),
      role: 1,
      searchData: {
        id:0
      },
      showDetermineIp: false,
      shareLinkVisible: false,
      passwordVisible: false,
      DataForm:{
        proxy_url: 0,
      },
      modifyForm: {
        proxy_url: "",
        passwordOne: '',
        passwordTwo: ''
      },
      dialogTitle:'绑定IP',
      form_rule: {
        passwordOne: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码最少六位数', trigger: 'blur' }
        ],
        passwordTwo: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码最少六位数', trigger: 'blur' }
        ]
      }
      
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  mounted() {
    let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'))
    this.role = userInfo.data.r
    this.searchData.id = userInfo.data.i
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      window.sessionStorage.clear()
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      this.$router.push(`/login`)
    },
    changeDetermine() {
      this.showDetermineIp = true
      if(this.searchData.id) {
        this.getTableData()
      }
    },
    changePassword() {
      this.passwordVisible = true
    },
    async getTableData() {
      const res = await api.getUser(this.searchData)
      if (res && res.code === 0 && res.data) {
        this.modifyForm.proxy_url = res.data.data[0].proxy_url
      }
    },
    // 修改密码
    submitPassword() {
      let searchData = {}
      searchData.id = this.searchData.id
      searchData.password = this.modifyForm.passwordTwo
      if(this.modifyForm.passwordOne === this.modifyForm.passwordTwo) {
        api.putUser(searchData).then((res) => {
          if(res.code === 0) {
            this.passwordVisible = false
            this.logout()
          }
        })
      } else if(this.modifyForm.passwordOne != this.modifyForm.passwordTwo) {
        this.$message.error('两次输入密码不一致，请重新确定');
      }
      /* api.putUserBinding(this.modifyForm).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.showDetermineIp = false
        }
      }) */
    },
    submitDetermineIp() {
      let modifyForm = {}
      modifyForm.proxy_url = this.modifyForm.proxy_url
      api.putUserBinding(modifyForm).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.showDetermineIp = false
        }
      })
    },

    // 分享链接
    ShareLinks() {
      this.shareLinkVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
