<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <!-- <a-form-item label="用户名">
          <a-input v-model="searchData._like_r_username" style="150px" placeholder="用户名" allow-clear />
        </a-form-item> -->
        <a-form-item v-if="role == 1" label="请选择">
          <a-select v-model="keyValue" placeholder="选择内容" style="width:213px" allow-clear>
            <a-select-option :value="'port_price'"> 端口价格</a-select-option>
            <a-select-option :value="'flow_price'">流量单价</a-select-option>
            <a-select-option :value="'bh_price'">号商手续费</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="search" @click="init()">查询</a-button>
          <a-button style="margin-left:10px;" type="primary" icon="plus" @click="addPort">端口价格</a-button>
          <a-button style="margin-left:10px;" type="primary" icon="plus" @click="addFlow">流量价格</a-button>
          <a-button style="margin-left:10px;" type="primary" icon="plus" @click="addPoundage">号商手续费</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="table-box">
      <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" class="tableLimit" :scroll="{ x: 1500}" :bordered="true" :pagination="false">
        <span slot="key" v-if="row.key === 'port_price'" slot-scope="text, row">
          端口价格
        </span>
        <span slot="key" v-else-if="row.key === 'flow_price'"  slot-scope="text, row">
          流量价格
        </span>
        <span slot="key" v-else-if="row.key === 'bh_price'" slot-scope="text, row">
          号商手续费
        </span>
        <span slot="created_at" slot-scope="text, row ">
           {{ new Date(row.created_at) | getTime }}
        </span>
        <span slot="action" slot-scope="text, row">
<!--      <a-button style="margin-left:10px" @click="view(row.id)">查看设备</a-button>
          <a-button style="margin-left:10px" type="primary" @click="edit(row)">编辑</a-button>
          <a-button v-if="role == 1" :disabled="row.role != 0" style="margin-left:10px" type="primary" @click="check(row)">绑定代理商</a-button>-->
          <a-popconfirm title="是否删除?" ok-text="是" cancel-text="否" @confirm="del(row.id)">
            <a-button style="margin-left:10px" type="danger">删除</a-button>
          </a-popconfirm>
        </span>
      </a-table>

      <a-modal v-model="dialogVisible" title="端口价格" ok-text="确认" cancel-text="取消" @ok="addPortprice">
        <a-form-model ref="form" layout="horizontal" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-form-model-item label="端口价格">
            <a-input v-model="form.portPriceValue" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <a-modal v-model="flowVisible" title="流量价格" ok-text="确认" cancel-text="取消" @ok="addFlowprice">
        <a-form-model ref="form" layout="horizontal" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-form-model-item label="流量价格">
            <a-input v-model="form.flowPriceValue" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <a-modal v-model="poundageVisible" title="号商手续费" ok-text="确认" cancel-text="取消" @ok="addPoundagePrice">
        <a-form-model ref="form" layout="horizontal" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-form-model-item label="手续费">
            <a-input v-model="form.bhPriceValue" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <a-modal v-model="modifyDialogVisible" title="修改用户" ok-text="确认" cancel-text="取消" @ok="editUser">
        <a-form-model ref="edit_form" layout="horizontal" :model="modifyForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
          <a-form-model-item label="选择角色">
            <a-select v-model="modifyForm.role" placeholder="请选择角色">
              <a-select-option v-if="role == 1" :value="1">管理员</a-select-option>
              <a-select-option :value="0">用户</a-select-option>
              <a-select-option v-if="role == 1" :value="2">代理商</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="选择状态">
            <a-select v-model="modifyForm.status" placeholder="请选择状态">
              <a-select-option :value="1">封禁</a-select-option>
              <a-select-option :value="0">正常</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="重置密码">
            <a-input v-model="modifyForm.password" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>

      <div class="page">
        <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} 条，总数:${total} 条`" :page-size-options="['10', '20', '50', '100']" show-size-changer :default-current="1" :current="searchData.page" :total="total" @change="handleCurrentChange" @showSizeChange="handleSizeChange">
          <template slot="buildOptionText" slot-scope="props">
            <span>{{ props.value }}条/页</span>
          </template>
        </a-pagination>
      </div>
      <user v-if="dialogGroupId" :role="searchRole" @getGroupId="getUserId" @cancelGetGroupId="dialogGroupId = false" />
    </div>
  </div>
</template>
<script>
import * as api from '@/api/index'
import user from '@/components/user/user'
const columns = [{
  title: '名称',
  dataIndex: 'key',
  width: '180px',
  align: 'center',
  scopedSlots: { customRender: 'key' }
}, {
  title: '价格',
  dataIndex: 'val',
  width: '100px',
  align: 'center',
  scopedSlots: { customRender: 'val' }
}]
export default {
  components: {
    user
  },
  data() {
    return {
      earningsRecordData: [],
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      total: 20,
      size: 10,
      columns: [],
      dialogGroupId: false,
      searchRole: 2,
      pagination: {},
      role: 0,
      nowData: {},
      keyValue: 'port_price',
      searchData: {
        _like_r_username: null,
        username: null,
        role: null,
        page: 1,
        page_size: 10,
        order_created_at: true
      },
      tableData: [],
      dialogVisible: false,
      flowVisible: false,
      poundageVisible: false,
      modifyDialogVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        role: null,
        name: null,
        describe: null,
        port_discount: '',
        port_price: 'port_price',
        flow_price: 'flow_price',
        bh_price: 'bh_price',
        portPriceValue: null,
        flowPriceValue: null,
        bhPriceValue: null
      },
      advForm: {
        api_key: '',
        affiliate_id: '',
        form_public_api_key: ''
      },
      form_rule: {
        role: [
          { required: true, message: '请选择角色', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 100, message: '密码最少六位数', trigger: 'blur' }
        ]
      },
      modifyForm: { role: null, status: 0, rate: 0, password: null }
    }
  },
  // eslint-disable-next-line vue/order-in-components
  filters: {
    getRole(value) {
      if (value === 0) return '用户'
      if (value === 1) return '管理员'
      if (value === 2) return '代理商'
    }
  },
  mounted() {
    this.role = this.userInfo.data.r
    this.columns = []
    columns.forEach(item => {
      if (item.role != null && !item.role.includes(this.role)) {
        return
      }
      this.columns.push(item)
    })
    this.init()
  },
  methods: {
    async init() {
      if (this.searchData.role === '') {
        this.searchData.role = null
      }
      if (this.role === 2) {
        this.searchData.role = 0
        this.searchData.superiors_id = this.userInfo.data.i
      }
      this.searchData.page = 1
      this.getTableData()
      //await api.getAdConfig()
    },
    async getTableData() {
      let key = this.keyValue
      const res = await api.getAdminConfig(key)
      if (res && res.code === 0 && res.data) {
        this.tableData = Array(res.data)
        this.total = res.data.count
      }
    },
    addPort() {
      this.dialogVisible = true
    },
    addPortprice() {
      this.form.username = this.form.username.trim()
      this.$refs['form'].validate(async valid => {
        let form = {}
        form.key = this.form.port_price
        form.val = this.form.portPriceValue
        if (valid) {
          api.postAdminConfig(form).then((res) => {
            if (res.code === 0) {
              this.dialogVisible = false
              this.init()
            }
          })
        }
      })
    },
    addFlow() {
      this.flowVisible = true
    },
    addFlowprice() {
      this.form.username = this.form.username.trim()
      this.$refs['form'].validate(async valid => {
        let form = {}
        form.key = this.form.flow_price
        form.val = this.form.flowPriceValue
        if (valid) {
          api.postAdminConfig(form).then((res) => {
            if (res.code === 0) {
              this.flowVisible = false
              this.init()
            }
          })
        }
      })
    },
    addPoundage() {
      this.poundageVisible = true

    },
    addPoundagePrice() {
    this.form.username = this.form.username.trim()
      this.$refs['form'].validate(async valid => {
        let form = {}
        form.key = this.form.bh_price
        form.val = this.form.bhPriceValue
        if (valid) {
          api.postAdminConfig(form).then((res) => {
            if (res.code === 0) {
              this.poundageVisible = false
              this.init()
            }
          })
        }
      })

    },
    check(row) {
      this.dialogGroupId = true
      this.nowData = row
    },
    async getUserId(id) {
      const uid = this.nowData.id
      const superiors_id = id
      await api.putUserInter({ id: uid, superiors_id })
      this.getTableData()
    },
    edit(row) {
      // 修改  角色和状态 状态封禁1正常0
      this.modifyDialogVisible = true
      this.modifyForm = row
      this.modifyForm.password = null
    },
    editUser() {
      this.modifyForm.password = this.modifyForm.password === '' ? null : this.modifyForm.password
      if (this.modifyForm.password !== '' && this.modifyForm.password != null) {
        if (this.modifyForm.password.length < 6) {
          this.$message.error('密码不低于六位数')
          return
        }
      }
      api.putUserInter(this.modifyForm).then(res => {
        if (res.code === 0) {
          this.modifyDialogVisible = false
        }
      })
    },
    view(id) {
      this.$router.push({
        name: 'Device',
        query: {
          belong: id
        }
      })
    },
    handleCurrentChange(page) {
      this.searchData.page = page
      this.getTableData()
    },
    del(row) {
      api.deletefnAgentLevel(row).then(res => {
        if (res.code === 0) {
          this.getTableData()
        }
      })
    },
    handleSizeChange(p, s) {
      this.searchData.page_size = s
      this.init()
    }
  }
}
</script>
