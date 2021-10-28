<template>
  <div class="login">
    <div class="login-box">
      <!-- <div class="logo">
        <img src="../../assets/123.jpg">
      </div> -->
      <div class="describe">
        <p class="oneP">Welcome</p>
        <p class="twoP">水母数据管理平台</p>
        <p class="threeP">Professional data management platform</p>
      </div>
      <div class="body">
        <p class="tips"></p>
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-position="top">
          <el-form-item label="" prop="username">
            <el-input ref="username" v-model="loginForm.username" name="username" placeholder="账号" />
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="密码" @keyup.enter.native="handleLogin" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="loading" style="width: 100%; border: #0090CB; background-image: linear-gradient(45deg, #0090CB , #0B9B9B);" @click.native.prevent="handleLogin">
              {{ loading ? '登录中...' : '登录' }}
            </el-button>
          </el-form-item>
        </el-form>

      </div>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { authLogin } from '@/api/index'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value) || value === '') {
        callback(new Error('请输入账号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不低于6位数'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    async handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          this.loading = true
          try {
            this.loginForm.isMessage = false
            const res = await authLogin(this.loginForm)
            if(res.code) {
              window.sessionStorage.clear()
              this.$router.push(`/login`)
            }
            if (res && res.code === 0 && res.data && res.data.token) {
              this.loading = false
              window.sessionStorage.setItem('token', res.data.token)
              window.sessionStorage.setItem('userToken', res.data.token)
              window.sessionStorage.setItem('userName', this.loginForm.username)
              const Base64 = require('js-base64').Base64
              window.sessionStorage.setItem(
                'userInfo',
                Base64.decode(
                  window.sessionStorage.getItem('token').split('.')[1]
                )
              )
              let userInfo = JSON.parse(Base64.decode(window.sessionStorage.getItem('token').split('.')[1]))
              let role = userInfo.data.r
              if (role === 2) {
                this.$router.push({ name: 'agency' })
              } else if (role === 3) {
                this.$router.push({ name: 'accountControl' })
              } else {
                this.$router.push({  path: this.redirect || '/' })
              }
              
            }
          } catch (err) {
            if (err && err.code && err.code === -400) {
              this.$message.error('账号错误，登录失败')
            }
            this.loading = false
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }

}
</script>
<style>
.login {
  align-items: center;
  background: url('../../assets/bg.png');
  /* 以上为登录背景,可以自己更换成自己喜欢的 */
  background-size: 100%;
  background-repeat: no-repeat;
  display: flex;
  font-family: Lato, Helvetica, sans-serif;
  justify-content: center;
  text-align: center;
  height: 100%;
  width: 100%;
  color: #656565;
}
.login-box {
  width: 650px;
  height: 370px;
  /* background: rgb(30,37,45); */
  background: rgba(236, 236, 236, 0.801);
  /* background: url('../../assets/login-l-bg.png') no-repeat; */
  /* background: linear-gradient(rgb(30,37,45), rgb(30,37,45), #aaa, #fff); */
  -webkit-border-bottom-right-radius: 10px;
  -moz-border-bottom-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 13px;
  border-top-right-radius: 10px;
  border-top-left-radius: 13px;
  /* box-shadow: 2px 2px 12px #ccc; */
  display: flex;
} 
.login-box .logo {
  height: 100px;
  padding-top: 30px;
  /*background: #324157;*/
  display: flex; 
  align-items: center;
  justify-content: center;
}
.login-box .logo img {
  width: 80px;
  height: 80px;
}
.login-box .describe {
  height: 370px;
  background: url('../../assets/login-l-bg.png') no-repeat;
  width:350px ;
}
.oneP {
  color: #fff;
  font-size: 38px;
  font-weight: bold;
  margin-top: 42%;
  margin-bottom: 0;
  padding-left: 0;
}
.twoP {
  color: #fff;
  font-size: 18px;
  margin-top: 30px;
}
.threeP {
  color: #fff;
  font-size: 14px;
  margin-top: 50px;
}
.login-box .body {
  width: 300px;
  padding: 10px 30px 30px 30px;
}
.login-box .body .tips {
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin-bottom: 70px;
  color: #fff;
}
.login-box .body .author {
  display: block;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #656565;
  margin-bottom: 10px;
  text-decoration: none;
}
.login-box .body .author a {
  text-decoration: none;
}
</style>
