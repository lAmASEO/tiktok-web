<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item label="用户名">
          <a-input v-model="searchData.username" style="150px" placeholder="用户名" allow-clear />
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model="searchData.status" placeholder="选择用户状态" style="width:213px" allow-clear>
            <a-select-option :value="0">正常</a-select-option>
            <a-select-option :value="1">封禁</a-select-option>
            <!-- <a-select-option :value="1">管理员</a-select-option>
            <a-select-option :value="2">代理商</a-select-option> -->
            <!-- <a-select-option :value="3">号商</a-select-option> -->
          </a-select>
        </a-form-item>
        <!-- <a-form-item v-if="role == 1" label="角色">
          <a-select v-model="searchData.role" placeholder="选择角色" style="width:213px" allow-clear>
            <a-select-option :value="0">用户</a-select-option>
            <a-select-option :value="1">管理员</a-select-option>
            <a-select-option :value="2">代理商</a-select-option>
            <a-select-option :value="3">号商</a-select-option>
          </a-select>
        </a-form-item> -->
        <a-form-item>
          <a-button type="primary" icon="search" @click="init()">查询</a-button>
          <a-button style="margin-left:10px;" type="primary" icon="plus" @click="add">新增</a-button>
          <a-button style="margin-left:10px;" type="primary" icon="plus" @click="purchaseFlow">购买流量</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="table-box">
      <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" class="tableLimit" :scroll="{ x: 1500}" :bordered="true" :pagination="false">
        <span slot="status" slot-scope="text, row">
          {{ row.status == 0 ? '正常' : '封禁' }}
        </span>
        <span slot="role" slot-scope="text, row ">
          {{ row.role | getRole }}
        </span>
        <span slot="created_at" slot-scope="text, row">
          {{ new Date(row.created_at) | getTime }}
        </span>
        <span slot="updated_at" slot-scope="text, row">
          {{ new Date(row.updated_at) | getTime }}
        </span>
        <span slot="action" slot-scope="text, row">
          <!-- <a-button style="margin-left:10px" @click="viewEarnings(row.id)">查看收益</a-button> -->
          <a-button style="margin-left:10px" type="primary" @click="view(row.id)">查看端口</a-button>
          <a-button style="margin-left:10px" type="primary" @click="checkAgency(row.id)">查看代理</a-button>
          <a-button style="margin-left:10px" type="primary" @click="addTraffic(row.id)">添加流量</a-button>
          <a-button style="margin-left:10px" type="primary" @click="addPort(row.id)">新增端口</a-button>
          <a-button style="margin-left:10px" type="primary" @click="edit(row)">编辑</a-button>
          <!-- <a-button style="margin-left:10px" @click="addIntegral(row.id)">添加积分</a-button> -->
          <!-- <a-button v-if="role == 1" :disabled="row.role != 0" style="margin-left:10px" type="primary" @click="check(row)">绑定代理商</a-button> -->
          <!-- <a-button v-if="role == 1" style="margin-left:10px" type="primary" @click="configAdv(row)">配置广告</a-button> -->
          <a-popconfirm title="是否删除?" ok-text="是" cancel-text="否" @confirm="del(row.id)">
            <a-button style="margin-left:10px" type="danger">删除</a-button>
          </a-popconfirm>
        </span>
      </a-table>

      <a-modal v-model="dialogVisible" title="新增用户" ok-text="确认" cancel-text="取消" @ok="addUser">
        <a-form-model ref="form" layout="horizontal" :model="form" :rules="form_rule" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
          <a-form-model-item label="选择角色" prop="role">
            <a-select v-model="form.role" placeholder="请选择角色">
              <!-- <a-select-option v-if="role == 1" :value="1">管理员</a-select-option> -->
              <a-select-option :value="0">用户</a-select-option>
              <!-- <a-select-option :value="2">代理商</a-select-option> -->
              <!-- <a-select-option :value="3">号商</a-select-option> -->
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="用户名" prop="username">
            <a-input v-model="form.username" />
          </a-form-model-item>
          <a-form-model-item label="密码" prop="password">
            <a-input v-model="form.password" />
          </a-form-model-item>
          <a-form-model-item label="邮箱">
            <a-input v-model="form.email" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>

      <a-modal v-model="addPortVisible" title="新增端口" ok-text="确认" width="400px" cancel-text="取消" @ok="addPortApi">
        <a-form-model ref="form" layout="horizontal" :model="form" :rules="form_rule" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-form-model-item label="数量" prop="num">
            <a-input v-model="addPortForm.num" />
          </a-form-model-item>
          <a-form-model-item label="时间">
            <a-select v-model="addPortForm.day" placeholder="请选择时间" allow-clear>
              <a-select-option :value="1">一个月</a-select-option>
              <a-select-option :value="3">一个季</a-select-option>
              <a-select-option :value="6">半年</a-select-option>
              <a-select-option :value="12">一年</a-select-option>
            </a-select>
            <!-- <a-radio-group v-model="addPortForm.day">
              <a-radio-button :value="1">
                1个月
              </a-radio-button>
              <a-radio-button :value="2">
                2个月
              </a-radio-button>
              <a-radio-button :value="3">
                3个月
              </a-radio-button>
              <a-radio-button :value="4">
                4个月
              </a-radio-button>
            </a-radio-group> -->
            <!-- <a-input v-model="addPortForm.day" /> -->
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <!-- 查看代理  @ok="addAgencyApit" -->
      <a-modal v-model="checkAgencyVisible" title="查看代理" ok-text="添加代理" :ok-button-props="OKbuttonDisplay"  :width="700" cancel-text="取消" @ok="addAgency">
        <a-table :columns="columnsAgency" :data-source="agencyData" :row-key="record => record.user_id" class="tableLimit" :bordered="true" :pagination="false" :scroll="{ x: 600}">
          <span slot="created_at" slot-scope="text, row">
          {{ new Date(row.created_at) | getTime }}
        </span>
        </a-table>
      </a-modal>

      <!-- 购买流量 -->
      <a-modal v-model="purchaseFlowVisible" title="购买流量" ok-text="确认" cancel-text="取消" @ok="purchaseFlowApi">
        <a-form-model ref="form" layout="horizontal" :model="FlowForm" :rules="form_rule" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
          <a-form-model-item label="流量(G)：" prop="flow">
            <a-input v-model="FlowForm.flow" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <!-- 添加流量 -->
      <a-modal v-model="addTrafficVisible" title="添加流量" ok-text="确认" cancel-text="取消" @ok="addTrafficApi">
        <a-form-model ref="form" layout="horizontal" :model="trafficForm" :rules="form_rule" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
          <a-form-model-item label="流量(M)：" prop="flow">
            <a-input v-model="trafficForm.flow" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <!-- 添加积分 -->
      <a-modal v-model="addIntegralVisible" title="添加积分" ok-text="确认" cancel-text="取消" @ok="addIntegralApi">
        <a-form-model ref="form" layout="horizontal" :model="integralForm" :rules="form_rule" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-form-model-item label="积分：" prop="flow">
            <a-input v-model="integralForm.points" />
          </a-form-model-item>
          <a-form-model-item label="备注：" prop="flow">
            <a-input v-model="integralForm.remarks" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>

      <a-modal v-model="modifyDialogVisible" title="修改用户" ok-text="确认" cancel-text="取消" @ok="editUser">
        <a-form-model ref="edit_form" layout="horizontal" :model="modifyForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
          <a-form-model-item label="选择角色">
            <a-select v-model="modifyForm.role" placeholder="请选择角色">
              <!-- <a-select-option v-if="role == 1" :value="1">管理员</a-select-option> -->
              <a-select-option :value="0">用户</a-select-option>
              <!-- <a-select-option v-if="role == 1" :value="2">代理商</a-select-option> -->
              <a-select-option :value="3">号商</a-select-option>
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
      <a-modal v-model="dialogAdv" title="配置广告" ok-text="确认" cancel-text="取消" @ok="addAdv">
        <a-form-model ref="adv_form" layout="horizontal" :model="advForm" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
          <a-form-model-item label="api_key">
            <a-input v-model="advForm.api_key" />
          </a-form-model-item>
          <a-form-model-item label="affiliate_id">
            <a-input v-model="advForm.affiliate_id" />
          </a-form-model-item>
          <a-form-model-item label="form_public_api_key">
            <a-input v-model="advForm.form_public_api_key" />
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
    <div>
      <el-dialog title="收益记录" :visible.sync="dialogTableVisible">
        <el-table :data="earningsRecordData">
          <el-table-column property="totalMoney" label="总收入" width="150"></el-table-column>
          <el-table-column property="adRecordTotal" label="广告收入" width="200"></el-table-column>
          <el-table-column property="rewardTotal" label="返利收入"></el-table-column>
          <el-table-column property="cashAmount" label="已提现总金额"></el-table-column>
          <el-table-column property="notCashAmount" label="未提现金额"></el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import * as api from '@/api/index'
import user from '@/components/user/user'
import { number } from 'echarts'
import { Message } from 'element-ui'
const columns = [{
  title: '用户名',
  dataIndex: 'username',
  width: '180px',
  align: 'center',
  scopedSlots: { customRender: 'username' }
}, {
  title: '用户状态',
  dataIndex: 'status',
  width: '100px',
  align: 'center',
  scopedSlots: { customRender: 'status' }
},
/* {
  title: '流量',
  dataIndex: 'flow',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'flow' }
}, */
{
  title: '邮箱',
  dataIndex: 'email',
  width: '200px',
  align: 'center',
  scopedSlots: { customRender: 'email' }
},
{
  title: '创建时间',
  dataIndex: 'created_at',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'created_at' }
},
{
  title: '更新时间',
  dataIndex: 'updated_at',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'updated_at' }
},
{
  title: '操作',
  dataIndex: 'action',
  width: '600px',
  align: 'center',
  fixed: 'right',
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
  components: {
    user
  },
  data() {
    return {
      earningsRecordData: [],
      dialogTableVisible: false,
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      total: 20,
      size: 10,
      columns: [],
      columnsAgency: [],
      dialogGroupId: false,
      dialogAdv: false,
      searchRole: 2,
      pagination: {},
      role: 0,
      nowData: {},
      OKbuttonDisplay:{ style: { display: 'none' } },
      searchData: {
        _like_r_username: null,
        username: null,
        role: null,
        page: 1,
        page_size: 10,
        status: 0,
        order_created_at: true
      },
      tableData: [],
      agencyData: [],
      dialogVisible: false,
      addPortVisible: false,
      // 添加流量
      trafficForm: {
        user_id: 0,
        flow: 0
      },
      FlowForm: {
        flow: 0
      },
      addIntegralVisible: false,
      addTrafficVisible: false,
      // 查看代理
      checkAgencyVisible: false,
      agencyId: null,
      modifyDialogVisible: false,
      purchaseFlowVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        role: null
      },
      addPortForm:{
        user_id: null,
        num: null,
        day: 1
      },
      advForm: {
        api_key: '',
        affiliate_id: '',
        form_public_api_key: ''
      },
      // 添加积分
      integralForm: {
        user_id: 0,
        points: '',
        remarks: ''
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
      if (value === 3) return '号商'
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
    this.columnsAgency = []
    columnsAgency.forEach(item => {
      if (item.role != null && !item.role.includes(this.role)) {
        return
      }
      this.columnsAgency.push(item)
    })
    this.init()
  },
  methods: {
    async init() {
      if (this.searchData.role === '') {
        this.searchData.role = null
      }
      this.searchData.username = this.searchData.username === '' ? null : this.searchData.username
      if (this.role === 2) {
        this.searchData.role = 0
        this.searchData.superiors_id = this.userInfo.data.i
      }
      this.searchData.page = 1
      this.getTableData()
      //await api.getAdConfig()
    },
    async getTableData() {
      const res = await api.getAgent(this.searchData)
      if (res && res.code === 0 && res.data) {
        this.tableData = res.data.data
        this.total = res.data.count
      }
    },
    onSubmit() {
      console.log('submit!')
    },
    add() {
      this.dialogVisible = true
      this.form.username = ''
      this.form.password = ''
      this.form.email = ''
    },
    // 查看代理
    checkAgency(row) {
      this.checkAgencyVisible= true
      this.agencyId = row
      const data = {
        user_id: row,
      }
      api.getAgencyProxy(data).then((res) => {
        if(res.code === 0) {
          this.agencyData = res.data.data
          if(this.agencyData.length === 0) {
            this.OKbuttonDisplay = {}
          } else {
            this.OKbuttonDisplay = { style: { display: 'none' } }
          }
        }
      })
    },
    addAgency() {
      console.log(this.agencyId)
      const data = {
        user_id: this.agencyId,
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
    // 添加流量
    addTraffic(row) {
      this.trafficForm.user_id = row
      this.addTrafficVisible = true
       
    },
    
    addTrafficApi() {
      const data = {
        user_id: this.trafficForm.user_id,
        flow: Number(this.trafficForm.flow)
      }
      api.postAgencyAddFlow(data).then((res) => {
        if (res.code === 0) {
          this.addTrafficVisible = false
          this.init()
        }
      }).catch((err) => {
        Message({
          message: err.msg,
          type: 'error'
        })
      })
    },
    purchaseFlow() {
      this.purchaseFlowVisible = true
    },
    purchaseFlowApi() {
      const data = {
        flow: Number(this.FlowForm.flow)
      }
      api.postAgencyBuy(data).then((res) => {
        if (res.code === 0) {
          this.purchaseFlowVisible = false
          this.init()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 添加积分
    addIntegral(row) {
      this.integralForm.user_id = row
      this.addIntegralVisible = true
    },
    addIntegralApi() {
      const data = {
        user_id: this.integralForm.user_id,
        points: Number(this.integralForm.points),
        remarks: this.integralForm.remarks
      }
      api.postPointsRecord(data).then((res) => {
        if (res.code === 0) {
          this.addTrafficVisible = false
          this.init()
        } else {
          message.error(res.data.message)
        }
      })
    },
    addUser() {
      this.form.username = this.form.username.trim()
      this.$refs['form'].validate(async valid => {
        if (valid) {
          api.addAgentInter(this.form).then((res) => {
            if (res.code === 0) {
              this.dialogVisible = false
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
    async configAdv(row) {
      const res = await api.getAdConfig({ user_id: row.id })
      this.nowData = row
      this.advForm = {
        api_key: '',
        affiliate_id: '',
        form_public_api_key: ''
      }
      if (res.code === 0 && res.data && res.data.data && res.data.data.length > 0) {
        const data = res.data.data[0]
        this.advForm = {
          api_key: data.api_key,
          affiliate_id: data.affiliate_id,
          form_public_api_key: data.form_public_api_key
        }
      }
      this.dialogAdv = true
    },
    async addAdv() {
      if (this.advForm.affiliate_id !== '') {
        this.advForm.affiliate_id = Number(this.advForm.affiliate_id)
      }
      const user_id = this.nowData.id
      const res = await api.postAdConfig({ user_id, ...this.advForm })
      if (res.code === 0) {
        this.dialogAdv = false
      }
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
        name: 'agentDevice',
        query: {
          belong: id
        }
      })
    },
    addPort(id) {
      this.addPortVisible = true
      this.addPortForm.user_id = id
    },
    addPortApi() {
      var postData = {
        user_id: parseInt(this.addPortForm.user_id),
        num: parseInt(this.addPortForm.num),
        day: parseInt(this.addPortForm.day)
      }
      api.postAgentPort(postData).then(res => {
        if (res.code === 0) {
          this.addPortVisible = false;
          this.getTableData()
        }
      }).catch((err) => {
        Message({
          message: err.msg,
          type: 'error'
        })
      })
    },
    handleCurrentChange(page) {
      this.searchData.page = page
      this.getTableData()
    },
    del(row) {
      api.delUserInter(row).then(res => {
        if (res.code === 0) {
          this.getTableData()
        }
      })
    },
    handleSizeChange(p, s) {
      this.searchData.page_size = s
      this.init()
    },
    async viewEarnings(id) {
      this.dialogTableVisible = true
      const res = await api.getIncome({ 'id': id })
      if (res.code === 0) {
        var recordData = {
          'totalMoney': res.data.total / 100,
          'adRecordTotal': res.data.adRecord.total / 100,
          'rewardTotal': res.data.reward.total / 100,
          'cashAmount': res.data.complete / 100,
          'notCashAmount': (res.data.total - res.data.complete) / 100
        }
        this.earningsRecordData = [recordData]
        console.log(res.data)
      }
    }
  }
}
</script>
