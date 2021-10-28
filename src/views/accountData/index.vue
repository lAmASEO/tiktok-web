<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item label="用户名">
          <a-input v-model="searchData._like_r_username" style="150px" placeholder="用户名" allow-clear />
        </a-form-item>
        <a-form-item v-if="role == 1" label="角色">
          <a-select v-model="searchData.role" placeholder="选择角色" style="width:213px" allow-clear>
            <a-select-option :value="0">用户</a-select-option>
            <a-select-option :value="1">管理员</a-select-option>
            <a-select-option :value="2">代理商</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="search" @click="init()">查询</a-button>
          <a-button style="margin-left:10px;" type="primary" icon="plus" @click="add">新增</a-button>
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
        <span slot="action" slot-scope="text, row">
          <a-button style="margin-left:10px" @click="viewEarnings(row.id)">查看收益</a-button>
          <a-button style="margin-left:10px" @click="view(row.id)">查看设备</a-button>
          <a-button style="margin-left:10px" type="primary" @click="edit(row)">编辑</a-button>
          <a-button v-if="role == 1" :disabled="row.role != 0" style="margin-left:10px" type="primary" @click="check(row)">绑定代理商</a-button>
          <a-button v-if="role == 1" style="margin-left:10px" type="primary" @click="configAdv(row)">配置广告</a-button>
          <a-popconfirm title="是否删除?" ok-text="是" cancel-text="否" @confirm="del(row.id)">
            <a-button style="margin-left:10px" type="danger">删除</a-button>
          </a-popconfirm>
        </span>
      </a-table>

      <a-modal v-model="dialogVisible" title="新增用户" ok-text="确认" cancel-text="取消" @ok="addUser">
        <a-form-model ref="form" layout="horizontal" :model="form" :rules="form_rule" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
          <a-form-model-item label="选择角色" prop="role">
            <a-select v-model="form.role" placeholder="请选择角色">
              <a-select-option v-if="role == 1" :value="1">管理员</a-select-option>
              <a-select-option :value="0">用户</a-select-option>
              <a-select-option :value="2">代理商</a-select-option>
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
const columns = [{
  title: '分配用户',
  dataIndex: 'username',
  width: '180px',
  align: 'center',
  scopedSlots: { customRender: 'username' }
}, {
  title: '角色',
  dataIndex: 'role',
  width: '100px',
  align: 'center',
  role: [1],
  scopedSlots: { customRender: 'role' }
}, {
  title: '所属代理商',
  dataIndex: 'superiors_name',
  width: '150px',
  align: 'center',
  role: [1],
  scopedSlots: { customRender: 'superiors_id' }
}, {
  title: '邮箱',
  dataIndex: 'email',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'email' }
},
{
  title: '操作',
  dataIndex: 'action',
  width: '600px',
  align: 'center',
  fixed: 'right',
  scopedSlots: { customRender: 'action' }
}]
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
      dialogGroupId: false,
      dialogAdv: false,
      searchRole: 2,
      pagination: {},
      role: 0,
      nowData: {},
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
      modifyDialogVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        role: null
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
      const res = await api.getUser(this.searchData)
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
    },
    addUser() {
      this.form.username = this.form.username.trim()
      this.$refs['form'].validate(async valid => {
        if (valid) {
          api.addUserInter(this.form).then((res) => {
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
