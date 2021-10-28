<template>
  <div>
    <el-dialog title="新增任务" :visible.sync="childDialogVisible" width="666px" top="50px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="任务类型" prop="type">
          <el-select v-model="type" placeholder="请选择">
            <el-option v-for="(item, index) in task_type" :key="index" :label="item.label" :value="item.value" />
          </el-select>
          <el-select v-if="type == 2" v-model="exchange" class="select-task" placeholder="请选择">
            <el-option v-for="(item, index) in exchangeType" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务分组" prop="executive_group">
          <el-input v-model="form.executive_group" @click="dialogGroupId = true" />
        </el-form-item>
        <el-form-item label="任务账号">
          <el-input v-model="form.executives" placeholder="(如有多个使用,分割)" />
        </el-form-item>
        <el-form-item v-if="type == 2" label="发送数量">
          <el-input v-model="form.number" placeholder="发送数量" type="number" min="1" oninput="if(value < 0) { value = Math.abs(value) };" />
        </el-form-item>
        <el-form-item v-if="type == 4 || type == 6" label="间隔时间">
          <el-input v-model="form.intervals" placeholder="间隔时间" type="number" min="1" oninput="if(value < 0) { value = Math.abs(value) };" />
        </el-form-item>
        <el-form-item v-if="type == 4 || type == 6" label="目标总数">
          <el-tooltip class="item" effect="dark" content="关注的帖子或粉丝总数" placement="top-start">
            <el-input v-model="form.follow_total" placeholder="目标总数" type="number" min="1" oninput="if(value < 0) { value = Math.abs(value) };" />
          </el-tooltip>
        </el-form-item>
        <el-form-item v-if="type == 4 || type == 6" label="开始下标">
          <el-input v-model="form.follow_index" placeholder="开始下标" type="number" min="1" oninput="if(value < 0) { value = Math.abs(value) };" />
        </el-form-item>
        <el-form-item v-if="type == 4" label="帖子 ID">
          <el-input v-model="form.follow_note_id" placeholder="帖子 ID" />
        </el-form-item>
        <el-form-item v-if="type == 5 || type == 6" label="用户 UID">
          <el-input v-model="form.follow_user_id" placeholder="用户 UID" />
        </el-form-item>
        <el-form-item v-if="type == 5 || type == 6" label="用户 secUid">
          <el-input v-model="form.follow_user_sec_id" placeholder="用户 secUid" />
        </el-form-item>
        <el-form-item v-if="type == 4 || type == 6" label="地区">
          <el-input v-model="form.follow_region" placeholder="地区" clearable />
        </el-form-item>
        <el-form-item label="任务备注">
          <el-input v-model="form.remark" placeholder="任务备注" />
        </el-form-item>
        <!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
        <!-- <el-form-item v-for="(domain, index6) in form.follow_region" v-if="type == 4 || type == 6" :key="index6" label="地区">
          <el-input v-model="domain.value" size="medium" />
          <el-button @click="form.follow_region.push({ value: '' })">新增</el-button>
          <el-button @click.prevent="form.follow_region.length === 1 ? '' : form.follow_region.splice(index6, 1)">删除</el-button>
        </el-form-item> -->
        <!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
        <el-form-item v-for="(domain, index) in form.video" v-if="type == 3 || (type == 2 && exchange == 1)" :key="index" :label="'视频地址'" class="btn-item">
          <el-input v-model="domain.value" size="medium" />
          <el-button class="add-btn" type="success" plain @click="form.video.push({ value: '' })">新增</el-button>
          <el-button class="delete-btn" type="danger" plain @click.prevent="form.video.length === 1 ? '' : form.video.splice(index, 1)">删除</el-button>
        </el-form-item>
        <!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
        <el-form-item v-for="(domain, index1) in form.text" v-if="type == 3 || (type == 2 && exchange == 2) || type == 9 || type == 10 || type == 11 || type == 12 || type == 13" :key="index1 + 'info'" :label="textContent[type]" class="btn-item">
          <el-input v-model="domain.value" />
          <el-button class="add-btn" type="success" plain @click="form.text.push({ value: '' })">新增</el-button>
          <el-button class="delete-btn" type="danger" plain @click.prevent="form.text.length === 1 ? '' : form.text.splice(index1, 1)">删除</el-button>
        </el-form-item>
        <!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
        <el-form-item v-for="(domain, index2) in form.rich_text" v-if="(type == 2 && exchange == 3)" :key="index2 + 'info1'" :label="'富文本'" class="btn-item">
          <el-input v-model="domain.value" type="textarea" @focus="setRichText(index2)" />
          <el-button class="add-btn" type="success" plain @click="form.rich_text.push({ value: '' })">新增</el-button>
          <el-button class="delete-btn" type="danger" plain @click.prevent="form.rich_text.length === 1 ? '' : form.rich_text.splice(index2, 1)">删除</el-button>
        </el-form-item>
        <!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
        <el-form-item v-for="(domain, index) in form.image" v-if="(type == 2 && exchange == 4)" :key="index + 'info2'" :label="'图片链接地址'" class="btn-item">
          <el-input v-model="domain.value" />
          <el-button class="add-btn" type="success" plain @click="form.image.push({ value: '' })">新增</el-button>
          <el-button class="delete-btn" type="danger" plain @click.prevent="form.image.length === 1 ? '' : form.image.splice(index, 1)">删除</el-button>
        </el-form-item>
        <!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
        <el-form-item v-for="(domain, index) in form.name_card" v-if="(type == 2 && exchange == 5)" :key="index + 'info3'" :label="'名片'" class="btn-item">
          <el-input v-model="domain.value" />
          <el-button class="add-btn" type="success" plain @click="form.name_card.push({ value: '' })">新增</el-button>
          <el-button class="delete-btn" type="danger" plain @click.prevent="form.name_card.length === 1 ? '' : form.name_card.splice(index, 1)">删除</el-button>
        </el-form-item>
        <!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
        <el-form-item v-for="(domain, index2) in form.proxy_info" v-if="type == 3 || type == 9 || type == 10 || type == 11 || type == 12 || type == 13" :key="index2 + 'info4'" :label="'协议信息'" class="btn-item">
          <el-input v-model="domain.value" @focus="setProxyInfo(index2)" />
          <el-button class="add-btn" type="success" plain @click="form.proxy_info.push({ value: '' })">新增</el-button>
          <el-button class="delete-btn" type="danger" plain @click.prevent="form.proxy_info.length === 1 ? '' : form.proxy_info.splice(index2, 1)">删除</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" width="50%">
        <el-button @click="childDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="富文本" :visible.sync="disalogRichText" width="40%">
      <el-form ref="rich_text_form" :model="rich_text_form" :rules="rich_text_form_rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="rich_text_form.title" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="rich_text_form.desc" />
        </el-form-item>
        <el-form-item label="头像地址" prop="avatar">
          <el-input v-model="rich_text_form.avatar" />
        </el-form-item>
        <el-form-item label="链接" prop="link">
          <el-input v-model="rich_text_form.link" />
        </el-form-item>
        <el-form-item label="文本">
          <el-input v-model="rich_text_form.text" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" width="50%">
        <el-button @click="disalogRichText = false">取 消</el-button>
        <el-button type="primary" @click="handleAddRichText()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="代理信息" :visible.sync="disalogProxy" width="40%">
      <el-form ref="proxy_form" :model="proxy_form" :rules="proxy_rules" label-width="80px">
        <el-form-item label="协议类型" prop="type">
          <!-- <el-input v-model="proxy_form.type" /> -->
          <el-select v-model="proxy_form.type" placeholder="请选择">
            <el-option v-for="(item, index) in proxyType" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="proxy_form.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="proxy_form.password" />
        </el-form-item>
        <el-form-item label="ip" prop="ip">
          <el-input v-model="proxy_form.ip" />
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input v-model="proxy_form.port" type="number" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" width="50%">
        <el-button @click="disalogProxy = false">取 消</el-button>
        <el-button type="primary" @click="handleAddProxyInfo()">确 定</el-button>
      </span>
    </el-dialog>
    <group :dialog-group-id="dialogGroupId" @getGroupId="getGroupId" @cancelGetGroupId="dialogGroupId = false" />
  </div>
</template>

<script>
import * as api from '@/api/index'
import group from '@/components/group/index'
export default {
  components: {
    group
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    executives: {
      type: String,
      default: ''
    },
    formDataId: {
      type: Number,
      // eslint-disable-next-line space-before-function-paren
      default: 0
    }
  },
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
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      role: 0,
      isCheck: true, // 是否切换改变值
      childDialogVisible: false,
      dialogGroupId: false,
      disalogRichText: false,
      disalogProxy: false,
      task_type: [],
      exchangeType: [{ label: '视频地址', value: 1 }, { label: '文字', value: 2 }, { label: '富文本', value: 3 }, { label: '图片地址', value: 4 }, { label: '名片', value: 5 }],
      exchange: 1,
      proxyType: [{ label: 'socks5', value: 'socks5' }, { label: 'http', value: 'http' }, { label: 'https', value: 'https' }],
      type: '2',
      textContent: {
        '2': '私信文字',
        '3': '作品文字',
        '9': '头像地址',
        '10': '昵称',
        '11': '博客地址',
        '12': '签名',
        '13': '邮箱'
      },
      form: {
        type: '2',
        executive_group: '',
        executives: '',
        number: 10,
        intervals: 10,
        follow_total: 10,
        follow_index: 1,
        follow_note_id: '',
        follow_user_id: '',
        follow_user_sec_id: '',
        follow_region: '',
        remark: '',
        video: [{ value: '' }],
        text: [{ value: '' }],
        rich_text: [{ value: '' }],
        image: [{ value: '' }],
        name_card: [{ value: '' }],
        gender: [{ value: '' }],
        proxy_info: [{ value: '' }]
      },
      rich_text_form: {
        title: '',
        desc: '',
        avatar: '',
        link: '',
        text: ''
      },
      proxy_form: {
        type: '',
        username: '',
        password: '',
        ip: '',
        port: ''
      },
      rich_text_index: 0,
      proxy_index: 0,
      rules: {
        executive_group: []
      },
      rich_text_form_rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ],
        avatar: [
          { required: true, message: '请输入头像地址', trigger: 'blur' },
          { required: true, pattern: /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/, message: '请输入正确头像地址', trigger: 'blur' }
        ],
        link: [
          { required: true, message: '请输入头像地址', trigger: 'blur' },
          { required: true, pattern: /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/, message: '请输入正确头像地址', trigger: 'blur' }
        ]
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
      }
    }
  },
  watch: {
    dialogVisible(newValue, oldValue) {
      this.childDialogVisible = newValue
    },
    childDialogVisible(newValue, oldValue) {
      if (!newValue) {
        this.$emit('closeForm')
      }
    },
    exchange(newValue, oldValue) {
      if (!this.isCheck) { // 用户点击创建进来时不让重置数据
        this.isCheck = true
        return
      }
      this.form.video = [{ value: '' }]
      this.form.text = [{ value: '' }]
      this.form.rich_text = [{ value: '' }]
      this.form.image = [{ value: '' }]
      this.form.name_card = [{ value: '' }]
    },
    type(newValue, oldValue) {
      this.form.type = Number(newValue)
      if (!this.isCheck) { // 用户点击创建进来时不让重置数据
        this.isCheck = true
        return
      }
      this.form.executive_group = ''
      // this.form.executives = ''
      // 获取携带的账号信息
      if (this.$route.query.account_id != null) {
        this.form.executives = this.$route.query.account_id
      } else {
        this.form.executives = ''
      }
      this.form.number = ''
      this.form.intervals = ''
      this.form.follow_total = ''
      this.form.follow_index = ''
      this.form.follow_note_id = ''
      this.form.follow_user_id = ''
      this.form.follow_region = ''
      this.form.follow_user_sec_id = ''
      this.form.remark = ''
      this.form.video = [{ value: '' }]
      this.form.text = [{ value: '' }]
      this.form.rich_text = [{ value: '' }]
      this.form.image = [{ value: '' }]
      this.form.name_card = [{ value: '' }]
      this.form.gender = [{ value: '' }]
      this.form.proxy_info = [{ value: '' }]
      switch (newValue) {
        case '2':
          this.form.video = [{ value: '' }]
          this.form.text = [{ value: '' }]
          this.form.rich_text = [{ value: '' }]
          this.form.image = [{ value: '' }]
          this.form.name_card = [{ value: '' }]
          this.form.number = 10
          break
        case '3':
          this.form.video = [{ value: '' }]
          this.form.text = [{ value: '' }]
          break
        case '4':
          this.form.intervals = 10
          this.form.follow_total = 10
          this.form.follow_index = 1
          this.form.follow_note_id = ''
          break
        case '5':
          this.form.follow_user_id = ''
          this.form.follow_user_sec_id = ''
          break
        case '6':
          this.form.intervals = 10
          this.form.follow_total = 10
          this.form.follow_index = 1
          this.form.follow_user_id = ''
          this.form.follow_user_sec_id = ''
          break
      }
    },
    executives(newValue, oldValue) {
      this.form.executives = newValue
    },
    async formDataId(newValue, oldValue) {
      if (newValue === 0) return
      this.isCheck = false
      const res = await api.getTask({ id: newValue })
      const data = res.data.data[0]
      this.type = data.type?.toString() || '2'
      this.getFormData(data)
    }
  },
  async mounted() {
    this.role = this.userInfo.data.r
    const typeRes = await api.getEnum()
    if (typeRes && typeRes.code === 0 && typeRes.data && typeRes.data.task_type) {
      this.task_type = []
      const obj = typeRes.data.task_type
      Object.keys(obj).forEach((item, index) => {
        if (index === 0 || index === 1 || index === 7 || index === 8) {
          return
        }
        if (this.role === 0 && (index === 3 || index === 9 || index === 10 || index === 11 || index === 12 || index === 13)) {
          return
        }
        this.task_type.push({ label: obj[item], value: item })
      })
    }
  },
  methods: {
    // 暂时未做， 回显表格信息
    getFormData(data) {
      console.log('sss')
      const obj = data || this.formData
      this.type = obj.type?.toString() || '2'
      this.form.executive_group = obj.executive_group || ''
      this.form.executives = obj.executive?.join(',') || ''
      this.form.number = obj.number || ''
      this.form.intervals = obj.intervals || ''
      this.form.follow_total = obj.follow_total || ''
      this.form.follow_index = obj.follow_index || ''
      this.form.follow_note_id = obj.follow_note_id || ''
      this.form.follow_user_id = obj.follow_user_id || ''
      this.form.follow_user_sec_id = obj.follow_user_sec_id || ''
      this.form.follow_region = obj.follow_region || ''
      this.form.remark = obj.remark || ''
      if (this.type === '2') {
        if (obj.video) {
          this.exchange = 1
        }
        if (obj.text) {
          this.exchange = 2
        }
        if (obj.rich_text) {
          this.exchange = 3
        }
        if (obj.image) {
          this.exchange = 4
        }
        if (obj.name_card) {
          this.exchange = 5
        }
      }
      if (obj.video) {
        this.form.video = []
        obj.video.forEach(item => this.form.video.push({ value: item }))
      }
      if (obj.text) {
        this.form.text = []
        obj.text.forEach(item => this.form.text.push({ value: item }))
      }
      if (obj.rich_text) {
        this.form.rich_text = []
        obj.rich_text.forEach(item => this.form.rich_text.push({ value: item }))
      }
      if (obj.image) {
        this.form.image = []
        obj.image.forEach(item => this.form.image.push({ value: item }))
      }
      if (obj.name_card) {
        this.form.name_card = []
        obj.name_card.forEach(item => this.form.name_card.push({ value: item }))
      }
      if (obj.proxy_info) {
        this.form.proxy_info = []
        obj.proxy_info.forEach(item => this.form.proxy_info.push({ value: item }))
      }
    },
    setRichText(index) {
      this.rich_text_index = index
      if (this.form.rich_text[this.rich_text_index].value !== '') {
        this.rich_text_form = JSON.parse(this.form.rich_text[this.rich_text_index].value)
      }
      this.disalogRichText = true
    },
    setProxyInfo(index) {
      this.proxy_index = index
      this.disalogProxy = true
    },
    handleAddRichText() {
      this.$refs['rich_text_form'].validate(async valid => {
        if (valid) {
          this.form.rich_text[this.rich_text_index].value = JSON.stringify(this.rich_text_form)
          this.rich_text_form = {
            title: '',
            desc: '',
            avatar: '',
            link: '',
            text: ''
          }
          this.disalogRichText = false
        }
      })
    },
    handleAddProxyInfo() {
      this.$refs['proxy_form'].validate(async valid => {
        if (valid) {
          this.form.proxy_info[this.proxy_index].value = `${this.proxy_form.type}://${this.proxy_form.username}${this.proxy_form.password !== '' ? ':' : ''}${this.proxy_form.password}${this.proxy_form.username !== '' ? '@' : ''}${this.proxy_form.ip}:${this.proxy_form.port}`
          this.proxy_form = {
            type: '',
            username: '',
            password: '',
            ip: '',
            port: ''
          }
          this.disalogProxy = false
        }
      })
    },
    getGroupId(id) {
      this.dialogGroupId = false
      this.form.executive_group = id
    },
    async handleAdd() {
      this.$refs['form'].validate(async valid => {
        if (this.validateForm()) return
        let executive = null
        if (this.form.executives != null && this.form.executives !== '') {
          executive = this.form.executives.split(',').filter(item => item !== '')
        }
        // eslint-disable-next-line prefer-const
        let form = {}
        form.type = Number(this.form.type)
        form.belong = Number(this.userInfo.data.i)
        form.executive_group = this.form.executive_group === '' ? null : Number(this.form.executive_group)
        form.executive = executive == null ? null : executive.map(item => Number(item))
        form.number = this.form.number === '' ? null : Number(this.form.number)

        form.intervals = this.form.intervals === '' ? null : Number(this.form.intervals)
        form.follow_total = this.form.follow_total === '' ? null : Number(this.form.follow_total)
        form.follow_index = this.form.follow_index === '' ? null : Number(this.form.follow_index)
        form.follow_note_id = this.form.follow_note_id === '' ? null : this.form.follow_note_id
        form.follow_user_id = this.form.follow_user_id === '' ? null : this.form.follow_user_id
        form.follow_user_sec_id = this.form.follow_user_sec_id === '' ? null : this.form.follow_user_sec_id
        form.follow_region = this.form.follow_region === '' ? null : this.form.follow_region
        form.remark = this.form.remark === '' ? null : this.form.remark
        form.tiktok_user = null
        this.computeForm(form)
        if (valid) {
          const res = await api.postTask(form)
          if (res && res.code === 0) {
            this.$emit('closeForm')
            this.$emit('success')
          }
        }
      })
    },
    validateForm() {
      if (this.form.executive_group === '' && this.form.executives === '') {
        this.errorInfo('执行任务的组ID和执行任务的账号ID至少有一个')
        return true
      }
      switch (this.type) {
        case '2':
          switch (this.exchange) {
            case 1:
              if (this.form.video.findIndex(item => item.value === '') !== -1) {
                this.errorInfo('视频地址有未填写的')
                return true
              }
              break
            case 2:
              if (this.form.text.findIndex(item => item.value === '') !== -1) {
                this.errorInfo('文本有未填写的')
                return true
              }
              break
            case 3:
              if (this.form.rich_text.findIndex(item => item.value === '') !== -1) {
                this.errorInfo('富文本有未填写的')
                return true
              }
              break
            case 4:
              if (this.form.image.findIndex(item => item.value === '') !== -1) {
                this.errorInfo('图片地址有未填写的')
                return true
              }
              break
            case 5:
              if (this.form.name_card.findIndex(item => item.value === '') !== -1) {
                this.errorInfo('名片有未填写的')
                return true
              }
              break
          }
          break
        case '3':
          if (this.form.video.findIndex(item => item.value === '') !== -1 || this.form.text.findIndex(item => item.value === '') !== -1) {
            this.errorInfo('视频地址和文字信息需要填写齐全')
            return true
          }
          if (this.form.proxy_info.findIndex(item => item.value === '') !== -1) {
            this.errorInfo('协议信息需要填写齐全')
            return true
          }
          break
        case '4':
          if (this.form.follow_note_id === '') {
            this.errorInfo('帖子id需要填写')
            return true
          }
          break
        case '5':
          if (this.form.follow_user_id === '' && this.form.follow_user_sec_id === '') {
            this.errorInfo('用户的id和secUid必需填写一项')
            return true
          }
          break
        case '6':
          if (this.form.follow_user_id === '' && this.form.follow_user_sec_id === '') {
            this.errorInfo('用户的id和secUid必需填写一项')
            return true
          }
          break
        case '9':
          if (this.form.text.findIndex(item => item.value === '') !== -1) {
            this.errorInfo('头像地址需要填写齐全')
            return true
          }
          if (this.form.proxy_info.findIndex(item => item.value === '') !== -1) {
            this.errorInfo('协议信息需要填写齐全')
            return true
          }
          break
        case '10':
          if (this.form.text.findIndex(item => item.value === '') !== -1) {
            this.errorInfo('昵称需要填写齐全')
            return true
          }
          if (this.form.proxy_info.findIndex(item => item.value === '') !== -1) {
            this.errorInfo('协议信息需要填写齐全')
            return true
          }
          break
        case '11':
          if (this.form.text.findIndex(item => item.value === '') !== -1) {
            this.errorInfo('博客地址地址需要填写齐全')
            return true
          }
          if (this.form.proxy_info.findIndex(item => item.value === '') !== -1) {
            this.errorInfo('协议信息需要填写齐全')
            return true
          }
          break
        case '12':
          if (this.form.text.findIndex(item => item.value === '') !== -1) {
            this.errorInfo('签名需要填写齐全')
            return true
          }
          if (this.form.proxy_info.findIndex(item => item.value === '') !== -1) {
            this.errorInfo('协议信息需要填写齐全')
            return true
          }
          break
        case '13':
          if (this.form.text.findIndex(item => item.value === '') !== -1) {
            this.errorInfo('邮箱地址需要填写齐全')
            return true
          }
          if (this.form.proxy_info.findIndex(item => item.value === '') !== -1) {
            this.errorInfo('协议信息需要填写齐全')
            return true
          }
          break
      }
      return false
    },
    errorInfo(msg) {
      this.$message({
        type: 'error',
        message: msg
      })
    },
    computeForm(form) {
      switch (this.type) {
        case '2':
          form.video = this.computeArr(this.form.video)
          form.text = this.computeArr(this.form.text)
          form.rich_text = this.computeArr(this.form.rich_text)
          form.image = this.computeArr(this.form.image)
          form.name_card = this.computeArr(this.form.name_card)
          break
        case '3':
          form.video = this.computeArr(this.form.video)
          form.text = this.computeArr(this.form.text)
          form.proxy_info = this.computeArr(this.form.proxy_info)
          break
        case '4':
          // form.follow_region = this.computeArr(this.form.follow_region)
          break
        case '5':
          break
        case '6':
          // form.follow_region = this.computeArr(this.form.follow_region)
          break
        case '9':
          form.text = this.computeArr(this.form.text)
          form.proxy_info = this.computeArr(this.form.proxy_info)
          break
        case '10':
          form.text = this.computeArr(this.form.text)
          form.proxy_info = this.computeArr(this.form.proxy_info)
          break
        case '11':
          form.text = this.computeArr(this.form.text)
          form.proxy_info = this.computeArr(this.form.proxy_info)
          break
        case '12':
          form.text = this.computeArr(this.form.text)
          form.proxy_info = this.computeArr(this.form.proxy_info)
          break
        case '13':
          form.text = this.computeArr(this.form.text)
          form.proxy_info = this.computeArr(this.form.proxy_info)
          break
      }
    },
    computeArr(arr) {
      if (arr.length === 1 && arr[0].value === '') {
        return null
      } else {
        // eslint-disable-next-line prefer-const
        let array = []
        arr.forEach(item => {
          array.push(item.value)
        })
        return array
      }
    }
  }
}
</script>

<style lang="scss">
.select-task {
  margin-left: 30px;
  width: 295px;
}
.add-btn {
  margin-left: 10px;
  height: 38px;
}
.delete-btn {
  height: 38px;
}
</style>
