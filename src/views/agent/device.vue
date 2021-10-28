<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item label="ID">
          <a-input v-model="searchData.id" placeholder="ID" allow-clear />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" style="margin-left:10px;width:88px" @click="init()">查询</a-button>
          <a-button style="margin-left:10px;" type="primary" @click="batchRenewal()">批量端口续费</a-button>
          <!-- <a-button v-if="role === 0" style="margin-left: 10px" @click="checkAgency()">查看代理</a-button> -->
          <!-- <a-button v-if="role === 1" style="margin-left:10px;" type="primary" @click="batchBind">批量绑定代理商</a-button>
          <a-button v-if="role == 1" style="margin-left:10px;" type="primary" @click="batchBind2">批量绑定用户</a-button>
          <a-button v-if="role == 1" style="margin-left:10px;" type="primary" @click="option">一键封/解</a-button> -->
          <!-- <a-button type="primary" style="margin-left:10px;width:88px" @click="create('Follow')">关注</a-button>
          <a-button type="primary" style="margin-left: 10px;width:88px" @click="create('Exchange')">私信</a-button>
          <a-button type="primary" style="margin-left: 10px;width:88px" @click="create('Product')">作品</a-button>
          <a-button type="primary" style="margin-left: 10px;width:88px" @click="create('Information')">资料</a-button>
          <a-button type="primary" style="margin-left: 10px;width:88px" @click="create('Account')">账号</a-button> -->
        </a-form-item>
      </a-form>
    </div>
    <div class="table-box">
      <a-table v-if="role == 1" :columns="columns" :data-source="tableData" :row-key="record => record.id" class="tableLimit" :row-selection="{selectedRowKeys: selectDataId ,onChange: rowSelection}" :bordered="true" :pagination="false" :scroll="{ x: 1500}">
        <span slot="created_at" slot-scope="text, row">
          {{ new Date(row.created_at) | getTime }} -- {{ new Date(row.expire_time) | getTime }}
        </span>
        <span slot="id" slot-scope="text, record">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ record.port_no }}</span>
            </template>
            <span>{{ record.id }}</span>
          </a-tooltip>
        </span>
        <!-- 备注 -->
        <!-- <div slot="remark" slot-scope="text, row">
          <a-input v-model="row.remark" style="text-align:center" @blur="handleInputBlur(row)" />
        </div> -->
        <span slot="action" slot-scope="text, row">
          <a-button style="margin-left: 10px" type="primary" @click="view(row)">查看账号</a-button>
          <!-- <a-button style="margin-left: 8px" type="warning" @click="edit(row)">{{ row.available ? '封禁端口' : '解禁端口' }}</a-button> -->
          <a-button style="margin-left: 10px" type="primary" @click="renewDevice(row)">端口续费</a-button>
          <a-popconfirm title="是否删除?" ok-text="是" cancel-text="否" @confirm="handleDelete(row.id)">
            <a-button style="margin-left:10px" type="danger">删除</a-button>
          </a-popconfirm>
        </span>
      </a-table>
      <a-table v-else :columns="columns" :data-source="tableData" :row-key="record => record.id" class="tableLimit" :row-selection="{selectedRowKeys: selectDataId ,onChange: rowSelection}" :bordered="true" :pagination="false">
        <span slot="created_at" slot-scope="text, row">
          {{ new Date(row.created_at) | getTime }} -- {{ new Date(row.expire_time) | getTime }}
        </span>
        <!-- <div slot="name" slot-scope="text, row">
          <a-input v-model="row.name" size="small" @blur="handleInputBlur(row)" />
        </div> -->

        <!-- 备注 -->
        <!-- <div slot="remark" slot-scope="text, row">
          <a-input v-model="row.remark" style="text-align:center" @blur="handleInputBlur(row)" />
        </div> -->
        <span slot="action" slot-scope="text, row">
          <a-button style="margin-left: 10px" type="primary" @click="view(row)">查看账号</a-button>
          <!-- <a-button style="margin-left: 8px" type="warning" @click="edit(row)">{{ row.available ? '封禁' : '解禁' }}</a-button> -->
          <a-button style="margin-left: 10px" type="primary" @click="renewDevice(row)">端口续费</a-button>
          <a-popconfirm title="是否删除?" ok-text="是" cancel-text="否" @confirm="handleDelete(row.id)">
            <a-button style="margin-left:10px" type="danger">删除</a-button>
          </a-popconfirm>
        </span>
      </a-table>

      <!-- 端口续费 -->
      <a-modal v-model="dialogVisible" title="端口续费" width="450px" ok-text="确认" cancel-text="取消" @ok="handleRenew">
        <a-form-model ref="form" :model="form" label-width="100px" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-form-item label="唯一串码">
            <a-input v-model="form.port_no" disabled />
          </a-form-item>
          <a-form-item label="所属用户ID">
            <a-input v-model="form.belong" disabled />
          </a-form-item>
          <a-form-item label="到期时间">
            <a-input-number v-model="form.day" style="width:100%" :default-value="30" />
          </a-form-item>
        </a-form-model>
      </a-modal>

      <!-- 批量端口续费 batch -->
      <a-modal v-model="BatchRenewalVisible" title="批量续费" width="450px" ok-text="确认" cancel-text="取消" @ok="BatchHandleRenew">
        <a-form-model ref="form" :model="BatchRenewalForm" label-width="100px" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-form-item label="端口ID">
            <a-input v-model="BatchRenewalForm.BatchRenewalList" disabled />
          </a-form-item>
          <a-form-item label="到期时间">
            <a-input-number v-model="BatchRenewalForm.day" style="width:100%" :default-value="30" />
          </a-form-item>
        </a-form-model>
      </a-modal>

      <!-- 查看代理 -->
      <a-modal v-model="checkAgencyVisible" title="查看代理" ok-text="添加代理" :ok-button-props="OKbuttonDisplay"  :width="700" cancel-text="取消" @ok="addAgency">
        <a-table :columns="columnsAgency" :data-source="agencyData" :row-key="record => record.user_id" class="tableLimit" :bordered="true" :pagination="false" :scroll="{ x: 600}">
          <span slot="created_at" slot-scope="text, row">
          {{ new Date(row.created_at) | getTime }}
        </span>
        </a-table>
      </a-modal>

      <div class="page">
        <a-pagination :page-size-options="['10', '20', '50', '100', '200']" show-size-changer :show-total="(total, range) => `${range[0]}-${range[1]} 条，总数:${total} 条`" :default-current="1" :current="searchData.page" :total="total" @change="handleCurrentChange" @showSizeChange="handleSizeChange">
          <template slot="buildOptionText" slot-scope="props">
            <span>{{ props.value }}条/页</span>
          </template>
        </a-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/index'
const locale = {
  'lang': {
    'now': '当前',
    'select time': '选择日期',
    'Ok': '确认'
  }
}
const columns = [{
  title: 'ID',
  dataIndex: 'id',
  width: '60px',
  align: 'center',
  scopedSlots: { customRender: 'id' }
},
{
  title: '唯一串码',
  dataIndex: 'port_no',
  width: '220px',
  align: 'center'
},
{
  title: '有效时间',
  dataIndex: 'created_at',
  width: '220px',
  align: 'center',
  scopedSlots: { customRender: 'created_at' }
},
{
  title: '备注',
  dataIndex: 'remark',
  width: '150px',
  align: 'center',
  scopedSlots: { customRender: 'remark' }
},
{
  title: '操作',
  dataIndex: 'action',
  width: '300px',
  align: 'center',
  scopedSlots: { customRender: 'action' }
}]
const columnsAgency = [
{
  title: '代理用户名',
  dataIndex: 'username',
  width: '80px',
  align: 'center',
  scopedSlots: { customRender: 'username' }
},
{
  title: '代理密码',
  dataIndex: 'password',
  width: '80px',
  align: 'center',
  scopedSlots: { customRender: 'password' }
},
{
  title: '创建时间',
  dataIndex: 'created_at',
  width: '100px',
  align: 'center',
  scopedSlots: { customRender: 'created_at' }
},
]
export default {
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      role: 0,
      searchData: {
        port_no: '',
        page: 1,
        id: null,
        order_id: true,
        name: null,
        belong: null,
        superiors_belong: null,
        order_created_at: true,
        user_id: null
      },
      agencyID: 0,
      locale: locale,
      mode1: 'time',
      columns: [],
      columnsAgency: [],
      tableData: [],
      agencyData: [],
      total: 0,
      size: 10,
      checkAgencyVisible: false,
      OKbuttonDisplay:{ style: { display: 'none' } },
      dialogVisible: false,
      dialogGroupId: false,
      dialogBatchUserId: false,
      dialogBatchUserId2: false,
      time: null,
      selectDataId: [],
      form: {
        id: '',
        port_no: '',
        day: 1,
        belong: '',
        expire_at: null
      },
      modifyForm: {
        port_no: '',
        available: true,
        belong: ''
      },
      searchRole: null,
      nowData: {},
      row: {},
      // 批量续费
      BatchRenewalVisible: false,
      BatchRenewalForm: {
        BatchRenewalList: [],
        day: 1,
        user_id: null
      }
    }
  },
  async mounted() {
    this.role = this.userInfo.data.r
    this.columns = []
    this.columnsAgency = []
    columns.forEach(item => {
      if (item.role != null && !item.role.includes(this.role)) {
        return
      }
      if (this.role !== 1 && item.index && item.index === 10) {
        item.width = '200px'
      }
      if (this.role === 1 && item.index && item.index === 10) {
        item.fixed = 'right'
      }
      this.columns.push(item)
    })
    columnsAgency.forEach(item => {
      if (item.role != null && !item.role.includes(this.role)) {
        return
      }
      if (this.role !== 1 && item.index && item.index === 10) {
        item.width = '200px'
      }
      if (this.role === 1 && item.index && item.index === 10) {
        item.fixed = 'right'
      }
      this.columnsAgency.push(item)
    })
    if (this.$route.query && this.$route.query.belong) {
      // this.searchData.belong = this.$route.query.belong
      this.searchData.user_id = this.$route.query.belong
    }
    this.init()
  },
  methods: {
    async init() {
      this.searchData.page = 1
      this.getTableData()
      // this.checkAgencyID()
    },
    async getTableData() {
      const res = await api.getAgentPort(this.searchData)
      if (res && res.code === 0 && res.data) {
        this.tableData = res.data.data
        this.total = res.data.count
      }
    },
    handleCurrentChange(page) {
      this.searchData.page = page
      this.getTableData()
    },
    view(row) {
      this.$router.push({
        name: 'agentAccount',
        query: {
          device_id: row.id
        }
      })
    },
    viewPack(row) {
      this.$router.push({
        name: 'Pack',
        query: {
          device_id: row.id
        }
      })
    },
    add() {
      this.dialogVisible = true
    },
    create(name = 'Dashboard') {
      if (this.selectDataId.length === 0) {
        this.$message.error('请先选择要添加的账号')
        return
      }
      console.log(this.selectDataId.join(','))
      this.$router.push({
        name,
        query: {
          account_id: this.selectDataId.join(',')
        }
      })
    },
    // 查看代理
    async checkAgencyID() {
      let searchData = {
        page: 1,
        order_id: true
      }
      const res = await api.getUser(searchData)
      if (res && res.code === 0 && res.data) {
        this.agencyID = res.data.data[0].id
      }
    },
    // 查看代理
    checkAgency() {
      this.checkAgencyVisible= true
      const data = {
        user_id: this.agencyID,
      }
      api.getAgency(data).then((res) => {
        if(res.code === 0) {
          this.agencyData = res.data.data
          if(this.agencyData.length === 0) {
            this.OKbuttonDisplay = { style: { display: 'none' } }
            this.OKbuttonDisplay = {}
          } else {
            this.OKbuttonDisplay = { style: { display: 'none' } }
          }
        }
      })
    },
    // 添加代理
    addAgency() {
      const data = {
        user_id: this.agencyID,
      }
      api.postAgency(data).then((res) => {
        if (res.code === 0) {
          this.checkAgencyVisible = false
          this.init()
        } else {
          message.error(res.data.message)
        }
      })
    },
    handleRenew() {
      if (this.form.day == null) {
        return
      }
      const data = {
        list: [this.form.id],
        day: this.form.day,
        user_id: this.form.belong
      }
      api.putAgentPortRenew(data).then(res => {
        if (res.code === 0) {
          this.dialogVisible = false
          this.getTableData()
        }
      })
    },
    // 批量续费
    async batchRenewal() {
      if (this.selectDataId.length === 0) {
        this.$message.error('请先选择需要续费的端口')
        return
      }
      this.BatchRenewalForm.BatchRenewalList = this.selectDataId.map(item => {
        return item
      })
      this.BatchRenewalVisible = true
      this.BatchRenewalForm.user_id = this.selectData[0].user_id

      console.log(this.selectDataId)
      console.log(this.selectData)
    },
    // 批量续费
    BatchHandleRenew() {
      if (this.BatchRenewalForm.day == null) {
        return
      }
      const data = {
        list: this.BatchRenewalForm.BatchRenewalList,
        day: this.BatchRenewalForm.day,
        user_id: this.BatchRenewalForm.user_id
      }
      api.putAgentPortRenew(data).then(res => {
        if (res.code === 0) {
          this.BatchRenewalVisible = false
          this.selectDataId = []
          this.getTableData()
        }
      })
    },
    edit(row) {
      this.modifyForm = row
      this.modifyForm.available = !this.modifyForm.available
      api.putDevice(this.modifyForm).then(res => {
        if (res.code === 0) {
          this.getTableData()
        }
      })
    },
    handleDelete(row) {
      api.delDevice(row).then(res => {
        if (res.code === 0) {
          this.getTableData()
        }
      })
    },
    async handleInputBlur(row) {
      await api.putAgentRemark(row)
      // await api.putDevice(row)
    },
    bindUser(row) {
      if (this.role === 1) {
        this.searchRole = null
      }
      if (this.role === 2) {
        this.searchRole = 0
      }
      this.dialogGroupId = true
      this.nowData = row
    },
    bindProxy(row) {
      this.searchRole = 2
      this.dialogGroupId = true
      this.nowData = row
    },
    async getUserId(id) {
      if (this.searchRole == null) {
        this.nowData.belong = id
      }
      if (this.searchRole === 0) {
        this.nowData.belong = id
      }
      if (this.searchRole === 2) {
        this.nowData.superiors_belong = id
      }
      await api.putDevice(this.nowData)
      this.getTableData()
    },
    handleSizeChange(p, s) {
      this.searchData.page_size = s
      this.init()
    },
    handleOpenChange1(open, value) {
      this.row = value
      if (open) {
        this.mode1 = 'time'
      }
    },
    handlePanelChange1(value, mode) {
      this.mode1 = mode
      this.time = value._d
    },
    async handleCheckTime(value) {
      this.row.expire_at = value._d
      await api.putRenewDevice({ isMessage: false, ...this.row }).then(res => {
        if (res.code === 0) {
          this.getTableData()
        }
      })
    },
    async renewDevice(row) {
      this.form.id = row.id
      this.form.port_no = row.port_no
      this.form.belong = row.user_id
      this.dialogVisible = true
    },
    rowSelection(selectedRowKeys, values) {
      // 批量端口续费 获取ID
      // console.log(selectedRowKeys)
      this.selectDataId = []
      this.selectData = []
      selectedRowKeys.forEach(item => {
        this.selectDataId.push(item)
      })
      values.forEach(item => {
        this.selectData.push(item)
      })
    },
    async batchBind() {
      if (this.selectDataId.length === 0) {
        this.$message.error('请先勾选')
        return
      }
      this.searchRole = 2
      this.dialogBatchUserId = true
    },
    async batchBind2() {
      if (this.selectDataId.length === 0) {
        this.$message.error('请先勾选')
        return
      }
      this.searchRole = 0
      this.dialogBatchUserId2 = true
    },
    async getBatchUserId(id) {
      const resArr = []
      this.selectData.forEach(async item => {
        item.superiors_belong = id
        item.isMessage = false
        const res = api.putDevice(item)
        resArr.push(res)
      })
      Promise.allSettled([...resArr]).then(res => {
        this.$message.success('操作成功')
        this.getTableData()
      })
    },
    async getBatchUserId2(id) {
      const resArr = []
      this.selectData.forEach(async item => {
        item.belong = id
        item.isMessage = false
        const res = api.putDevice(item)
        resArr.push(res)
      })
      Promise.allSettled([...resArr]).then(res => {
        this.$message.success('操作成功')
        this.getTableData()
      })
    },
    async option() {
      if (this.selectDataId.length === 0) {
        this.$message.error('请先勾选')
        return
      }
      const resArr = []
      this.selectData.forEach(async item => {
        item.available = !item.available
        item.isMessage = false
        const res = api.putDevice(item)
        resArr.push(res)
      })
      Promise.allSettled([...resArr]).then(res => {
        this.$message.success('操作成功')
        this.getTableData()
      })
    }
  }
}
</script>

<style lang="scss">
.ant-calendar-picker {
  min-width: 0 !important;
}
</style>
