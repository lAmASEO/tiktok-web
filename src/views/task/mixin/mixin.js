export const columns = [{
  title: '创建时间',
  dataIndex: 'created_at',
  align: 'center',
  scopedSlots: {
    customRender: 'created_at'
  },
  type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
}, {
  title: '创建人',
  dataIndex: 'belong_name',
  align: 'center',
  type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  ellipsis: true,
  role: [1]
}, {
  title: '组名',
  dataIndex: 'group_name',
  align: 'center',
  ellipsis: true,
  type: [1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 14]
}, {
  title: '账号ID',
  dataIndex: 'executive',
  align: 'center',
  type: [1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 14],
  ellipsis: true,
  customRender: (value, row, index) => {
    return value != null ? value.join(',') : value
  }
}, {
  title: '账号',
  dataIndex: 'account_username',
  align: 'center',
  ellipsis: true,
  type: [7]
}, {
  title: '密码',
  dataIndex: 'account_password',
  ellipsis: true,
  align: 'center',
  ellipsis: true,
  type: [7]
}, {
  title: '包ID',
  dataIndex: 'executive_bundle',
  align: 'center',
  ellipsis: true,
  type: [8]
}, {
  title: '发送数量',
  dataIndex: 'number',
  align: 'center',
  ellipsis: true,
  type: [2]
}, {
  title: '间隔时间',
  dataIndex: 'intervals',
  align: 'center',
  ellipsis: true,
  type: [4, 6]
}, {
  title: '目标总数',
  dataIndex: 'follow_total',
  align: 'center',
  ellipsis: true,
  type: [4, 6]
}, {
  title: '开始下标',
  dataIndex: 'follow_index',
  align: 'center',
  ellipsis: true,
  type: [4, 6]
}, {
  title: '帖子ID',
  dataIndex: 'follow_note_id',
  align: 'center',
  ellipsis: true,
  type: [4, 14]
}, {
  title: '用户UID',
  dataIndex: 'follow_user_id',
  align: 'center',
  ellipsis: true,
  type: [5, 6, 14]
}, {
  title: '用户secID',
  dataIndex: 'follow_user_sec_id',
  align: 'center',
  ellipsis: true,
  type: [5, 6, 14]
},
{
  title: 'TIKTOK用户',
  dataIndex: 'tiktok_user',
  ellipsis: true,
  width: '100',
  align: 'center',
  type: [1],
  scopedSlots: {
    customRender: 'tiktok'
  }
},
{
  title: '备注',
  dataIndex: 'remark',
  align: 'center',
  ellipsis: true,
  type: [1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13]
},
{
  title: '协议信息',
  dataIndex: 'proxy_info',
  ellipsis: true,
  align: 'center',
  type: [3, 9, 10, 11, 12, 13]
},
{
  title: '视频连接地址',
  dataIndex: 'video',
  ellipsis: true,
  exchange: 1,
  align: 'center',
  width: '500px',
  type: [2, 3],
  customRender: (value, row, index) => {
    return value != null ? value.join(',') : value
  }
},
{
  title: '文本信息',
  dataIndex: 'text',
  ellipsis: true,
  exchange: 2,
  width: '500',
  align: 'center',
  type: [2, 3, 9, 10, 11, 12, 13],
  customRender: (value, row, index) => {
    return value != null ? value.join(',') : value
  }
},
{
  title: '富文本',
  dataIndex: 'rich_text',
  align: 'center',
  ellipsis: true,
  width: '500',
  exchange: 3,
  type: [2],
  customRender: (value, row, index) => {
    return value != null ? value.join(',') : value
  }
},
{
  title: '图片链接地址',
  dataIndex: 'image',
  exchange: 4,
  align: 'center',
  ellipsis: true,
  width: '500',
  type: [2],
  customRender: (value, row, index) => {
    return value != null ? value.join(',') : value
  }
},
{
  title: '名片',
  dataIndex: 'name_card',
  exchange: 5,
  align: 'center',
  ellipsis: true,
  width: '500',
  type: [2],
  customRender: (value, row, index) => {
    return value != null ? value.join(',') : value
  }
},
{
  title: '文本',
  dataIndex: 'text',
  align: 'center',
  exchange: 5,
  ellipsis: true,
  type: [2],
  customRender: (value, row, index) => {
    return value != null ? value.join(',') : value
  }
},
{
  title: '地区',
  dataIndex: 'follow_region',
  align: 'center',
  ellipsis: true,
  type: [4, 6]
},
{
  title: '间隔时间',
  dataIndex: 'intervals',
  align: 'center',
  exchange: 5,
  ellipsis: true,
  type: [2]
},
{
  title: '地区',
  dataIndex: 'region',
  align: 'center',
  exchange: 5,
  ellipsis: true,
  type: [2]
},
{
  title: '关键词',
  dataIndex: 'keywords',
  align: 'center',
  ellipsis: true,
  type: [14],
  customRender: (value, row, index) => {
    return value != null ? value.join(',') : value
  }
}, {
  title: '标签',
  dataIndex: 'tags',
  align: 'center',
  ellipsis: true,
  type: [14],
  customRender: (value, row, index) => {
    return value != null ? value.join(',') : value
  }
}, {
  title: '操作',
  dataIndex: 'option',
  width: '330px',
  align: 'center',
  fixed: 'right',
  scopedSlots: {
    customRender: 'action'
  },
  type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
}]
import group from '@/components/group/index'
import tag from '@/components/tags/index'
import proxy from '../component/proxy.vue'
import pack from '@/components/pack/pack.vue'
import resource from '@/components/resource/index'
import * as api from '@/api/index'
export default {
  components: {
    group,
    tag,
    proxy,
    pack,
    resource
  },
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      role: 0,
      total: 0,
      dialogVisible: false,
      dialogGroupId: false,
      disalogProxy: false,
      dialogPack: true,
      dialogResource: false,
      tableData: [],
      x: 1500,
      exchangeType: [{ label: '视频地址', value: 1 }, { label: '文字', value: 2 }, { label: '富文本', value: 3 }, { label: '图片地址', value: 4 }, { label: '名片', value: 5 }],
      proxy_index: 0,
      form: {
        executive_group: '',
        executive_group_name: '',
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
        tags: '',
        video: [{ value: '' }],
        text: [{ value: '' }],
        rich_text: [{ value: '' }],
        image: [{ value: '' }],
        name_card: [{ value: '' }],
        gender: [{ value: '' }],
        proxy_info: [{ value: '' }],
        keywords: [{ value: '' }],
        resourceName: ''
      }
    }
  },
  watch: {
    'form.executive_group_name': {
      handler(newValue, oldValue) {
        if (newValue === '') {
          this.form.executive_group = ''
        }
      },
      deep: true
    }
  },
  async mounted() {
    await api.getEnum()
    this.role = this.userInfo.data.r
    if (this.$route.query && this.$route.query.account_id) {
      this.form.executives = this.$route.query.account_id
      this.dialogVisible = true
    }
  },
  methods: {
    init() {
      this.searchData.page = 1
      this.getTableData()
    },
    handleCurrentChange(page) {
      this.searchData.page = page
      this.getTableData()
    },
    view(row) {
      this.$router.push({
        name: 'TaskDetail',
        query: {
          id: row.id
        }
      })
    },
    setProxyInfo(index) {
      this.proxy_index = index
      this.disalogProxy = true
    },
    getProxy(value) {
      this.form.proxy_info[this.proxy_index].value = value
      this.disalogProxy = false
    },
    pause(row) {

    },
    async create(row) {
      this.resetForm()
      const res = await api.getTask({ id: row.id })
      if (res.code === 0 && res.data && res.data.data && res.data.data[0]) {
        const data = res.data.data[0]
        this.form.type = data.type
        if (data.executive_group != null) {
          this.form.executive_group = data.executive_group
          this.form.executive_group_name = data.group_name
        }
        this.form.executives = data.executive?.join(',')
        this.form.tags = data.tags?.join(',')
        this.form.follow_index = data.follow_index
        this.form.follow_note_id = data.follow_note_id
        this.form.follow_region = data.follow_region
        this.form.follow_total = data.follow_total
        this.form.follow_user_id = data.follow_user_id
        this.form.follow_user_sec_id = data.follow_user_sec_id
        this.form.intervals = data.intervals
        this.form.number = data.number
        this.form.remark = data.remark
        this.dialogVisible = true
        if (data.video) {
          this.form.video = []
          data.video.forEach(item => this.form.video.push({ value: item }))
        }
        if (data.text) {
          this.form.text = []
          data.text.forEach(item => this.form.text.push({ value: item }))
        }
        if (data.rich_text) {
          this.form.rich_text = []
          data.rich_text.forEach(item => this.form.rich_text.push({ value: item }))
        }
        if (data.image) {
          this.form.image = []
          data.image.forEach(item => this.form.image.push({ value: item }))
        }
        if (data.name_card) {
          this.form.name_card = []
          data.name_card.forEach(item => this.form.name_card.push({ value: item }))
        }
        if (data.proxy_info) {
          this.form.proxy_info = []
          data.proxy_info.forEach(item => this.form.proxy_info.push({ value: item }))
        }
        if (data.keywords) {
          this.form.keywords = []
          data.keywords.forEach(item => this.form.keywords.push({ value: item }))
        }
      } else {
        this.$message.error('无法创建')
        return
      }
    },
    closeProxy() {
      this.disalogProxy = false
    },
    async stop(id) {
      await api.stopTask({ id })
    },
    handleSizeChange(p, s) {
      this.searchData.page_size = s
      this.init()
    },
    getGroupId(id, name) {
      this.dialogGroupId = false
      this.form.executive_group = id
      this.form.executive_group_name = name
    },
    async postTask(params) {
      let executive = null
      if (this.form.executives != null && this.form.executives !== '') {
        var executivesStr = '' + this.form.executives
        console.log(executivesStr)
        if (executivesStr.indexOf(",") >= 0){
          executive = this.form.executives.split(',').filter(item => item !== '')
        }else{
          executive = [this.form.executives]
        }
        
      }
      executive = executive == null ? null : executive.map(item => Number(item))
      const executive_group = this.form.executive_group === '' ? null : Number(this.form.executive_group)
      const remark = this.form.remark === '' ? null : this.form.remark
      if (this.form.executive_group === '' && this.form.executives === '') {
        this.$message.error('执行任务的组ID和执行任务的账号ID至少有一个')
        return true
      }
      const res = await api.postTask({
        belong: this.userInfo.data.i,
        executive,
        remark,
        executive_group,
        ...params
      })
      if (res.code === 0) {
        this.dialogVisible = false
        this.getTableData()
      }
    },
    resetForm() {
      this.form.executive_group = ''
      // this.form.executives = ''
      this.form.executive_group_name = ''
      this.form.number = 10
      this.form.intervals = 10
      this.form.follow_total = 10
      this.form.follow_index = 1
      this.form.follow_note_id = ''
      this.form.follow_user_id = ''
      this.form.follow_user_sec_id = ''
      this.form.follow_region = ''
      this.form.remark = ''
      this.form.tags = ''
      this.form.video = [{ value: '' }]
      this.form.text = [{ value: '' }]
      this.form.rich_text = [{ value: '' }]
      this.form.image = [{ value: '' }]
      this.form.name_card = [{ value: '' }]
      this.form.gender = [{ value: '' }]
      this.form.proxy_info = [{ value: '' }]
      this.form.keywords = [{ value: '' }]
      this.form.resourceName = ''
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
    },
    async del(id) {
      const res = await api.delTask(id)
      if (res.code === 0) {
        this.getTableData()
      }
    }
  }
}
