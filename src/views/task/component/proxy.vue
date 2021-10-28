<template>
  <a-modal v-model="disalogProxy" title="代理信息" width="40%" ok-text="确认" cancel-text="取消" @ok="handleAddProxyInfo" @cancel="cancel">
    <a-form-model ref="proxy_form" :model="proxy_form" :rules="proxy_rules" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
      <a-form-model-item label="协议类型" prop="type">
        <a-select v-model="proxy_form.type" placeholder="请选择">
          <a-select-option v-for="(item, index) in proxyType" :key="index" :value="item.value">{{ item.label }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="用户名" prop="username">
        <a-input v-model="proxy_form.username" />
      </a-form-model-item>
      <a-form-model-item label="密码" prop="password">
        <a-input v-model="proxy_form.password" />
      </a-form-model-item>
      <a-form-model-item label="ip" prop="ip">
        <a-input v-model="proxy_form.ip" />
      </a-form-model-item>
      <a-form-model-item label="端口" prop="port">
        <a-input v-model="proxy_form.port" type="number" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['disalogProxy'],
  data() {
    const validateProxyPort = (rule, value, callback) => {
      if (value < 1 || value > 65535) {
        callback(new Error('端口范围有误'))
      } else {
        callback()
      }
    }
    const validateProxyUsername = (rule, value, callback) => {
      if (this.proxy_form.password !== '' && value === '') {
        callback(new Error('有密码的情况下请输入用户名'))
      } else {
        callback()
      }
    }
    return {
      proxy_form: {
        type: '',
        username: '',
        password: '',
        ip: '',
        port: ''
      },
      proxy_rules: {
        type: [
          { required: true, message: '请选择协议', trigger: 'change' }
        ],
        username: [
          { validator: validateProxyUsername }
        ],
        password: [],
        ip: [
          { required: true, message: '请输入ip', trigger: 'blur' }
        ],
        port: [
          { required: true, message: '请输入端口', trigger: 'blur' },
          { required: true, validator: validateProxyPort }
        ]
      },
      proxyType: [{ label: 'socks5', value: 'socks5' }, { label: 'http', value: 'http' }, { label: 'https', value: 'https' }]
    }
  },
  watch: {
    disalogProxy(newValue, oldValue) {
      console.log(newValue)
    }
  },
  methods: {
    handleAddProxyInfo() {
      this.$refs['proxy_form'].validate(async valid => {
        if (valid) {
          const value = `${this.proxy_form.type}://${this.proxy_form.username}${this.proxy_form.password !== '' ? ':' : ''}${this.proxy_form.password}${this.proxy_form.username !== '' ? '@' : ''}${this.proxy_form.ip}:${this.proxy_form.port}`
          this.proxy_form = {
            type: '',
            username: '',
            password: '',
            ip: '',
            port: ''
          }
          this.$emit('getProxy', value)
        }
      })
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss">
</style>
