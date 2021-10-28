<template class='searcahss'>
  <div >
    <div class="search-box">
      <div class="head">
        <div class="head-left">
          <div class="head-left-logo">
            <img src="../../assets/头像.png">
          </div>
          <div class="head-left-message">
            <div class="head-left-message-username">
              <span>{{this.agentList.username}}</span>
            </div>
            <div class="head-left-message-role">
              <img src="../../assets/代理.svg"> 
              <span v-if="this.agentList.role === 2">代理商</span>
            </div>
            <div class="head-left-message-level">
              <img src="../../assets/VIP.svg">
              <span v-if="this.agentList.agent_level === 1">一级VIP</span>
              <span v-if="this.agentList.agent_level === 2">二级VIP</span>
              <span v-if="this.agentList.agent_level === 3">三级VIP</span>
              <span v-if="this.agentList.agent_level === 4">四级VIP</span>
            </div>
            <div class="head-left-message-email">
              邮箱：<span >{{this.agentList.email === '' ? '未设置':this.agentList.email}}</span>
            </div>
          </div>
          <div class="head-left-flow" @click="purchaseFlow">
            <img src="../../assets/purchaseFlow.png">
            <!-- <span>流 量 充 值</span> -->
          </div>
        </div>
        <div class="head-right">
          <div class="head-right-flow">流量剩余 ：<span>{{this.agentList.flow}}M</span></div>
          <div class="head-right-points">积分剩余 ：<span>{{this.agentList.points}}</span></div>
        </div>
      </div>
    </div>
    <div class="table-box">
      <!-- <a-table :columns="columns" :row-key="record => record.id" :data-source="tableData" :row-selection="{ selectedRowKeys: selectDataId, onChange: rowSelection }" :bordered="true" :pagination="false"> -->
      <a-table :columns="columns" :row-key="record => record.id" :data-source="tableData" :bordered="true" :pagination="false">
        <span slot="type" slot-scope="text, row">
          <span v-if="row.type === 0">充值</span>
          <span v-if="row.type === 1">消费 端口购买/续费</span>
          <span v-if="row.type === 2">消费 账号购买</span>
          <span v-if="row.type === 3">消费 流量购买</span>
          <span v-if="row.type === 4">消费 拨号</span>
        </span>
        <!-- <span slot="action" slot-scope="text, row">
          <a-button style="margin-left:5px" type="primary" @click="checkIntegralView(row)">积分记录</a-button>
          <a-button style="margin-left:5px" type="primary" @click="topUpView(row)">积分充值</a-button>
        </span> -->
      </a-table>
      <div class="page">
        <a-pagination :page-size-options="['10', '20', '50', '100', '200']" show-size-changer :show-total="(total, range) => `${range[0]}-${range[1]} 条，总数:${total} 条`" :default-current="1" :current="searchData.page" :total="total" @change="handleCurrentChange" @showSizeChange="handleSizeChange">
          <template slot="buildOptionText" slot-scope="props">
            <span>{{ props.value }}条/页</span>
          </template>
        </a-pagination>
      </div>
    </div>
    
    <a-modal v-model="checkIntegralVisible" title="积分信息" width="600px" ok-text="确认" cancel-text="取消" @ok="init" @cancel='init' >
      <a-table :columns="columnsIntegral" :row-key="record => record.userid" :data-source="getIntegralData" :row-selection="{ selectedRowKeys: selectDataId, onChange: rowSelection }">
      </a-table>
    </a-modal>
    <!-- 购买流量 -->
    <a-modal v-model="purchaseFlowVisible" title="购买流量" ok-text="确认" cancel-text="取消" @ok="purchaseFlowApi">
      <a-form-model ref="form" layout="horizontal" :model="FlowForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
        <a-form-model-item label="流量(G)：" prop="flow">
          <a-input v-model="FlowForm.flow" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <a-modal v-model="topUpVisible" title="积分充值" width="600px" ok-text="确认" cancel-text="取消" @ok="topUpsubmit()">
      <a-form :model="form" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
        <a-form-item label="积分余额">
          <a-input readOnly v-model="form.allowance"/>
        </a-form-item>
        <a-form-item label="账号ID">
          <a-input v-model="form.accountId"/>
        </a-form-item>
        <a-form-item label="积分数量">
          <a-input v-model="form.amount"/>
        </a-form-item>
        <a-form-item label="备注">
          <a-input v-model="form.remarks"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import * as api from '@/api/index'
const columns =  [
{
  title: '操作类型',
  dataIndex: 'type',
  width: '220px',
  align: 'center',
  scopedSlots: { customRender: 'type' }
},
/* {
  title: '用户 ID',
  dataIndex: 'user_id',
  width: '100px',
  align: 'center',
  scopedSlots: { customRender: 'user_id' }
}, */
{
  title: '操作用户',
  dataIndex: 'target_username',
  width: '150px',
  align: 'center',
  scopedSlots: { customRender: 'target_username' }
},
/* {
  title: '对象 ID',
  dataIndex: 'target',
  width: '150px',
  align: 'center',
  scopedSlots: { customRender: 'target' }
}, */
/* {
  title: '操作用户',
  dataIndex: 'target_username',
  width: '150px',
  align: 'center',
  scopedSlots: { customRender: 'target_username' }
}, */
{
  title: '操作内容',
  dataIndex: 'content',
  width: '300px',
  align: 'center',
  scopedSlots: { customRender: 'content' }
},
{
  title: '积分',
  dataIndex: 'quantity',
  width: '80px',
  align: 'center'
},
{
  title: '备注',
  dataIndex: 'remarks',
  width: '200px',
  align: 'center',
  scopedSlots: { customRender: 'remarks' }
}
]
const columnsIntegral = [
  {
    title: '项目名称',
    dataIndex: 'Integral_name',
    width: '60px',
    align: 'center',
    scopedSlots: { customRender: 'Integral_name' }
  },
  {
    title: '积分明细',
    dataIndex: 'account_details',
    width: '60px',
    align: 'center',
    scopedSlots: { customRender: 'account_details' }
  },
  {
    title: '时间',
    dataIndex: 'account_time',
    width: '60px',
    align: 'center',
    scopedSlots: { customRender: 'account_time' }
  }
]
export default {
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      columns: [],
      columnsIntegral: [],
      tableData: [],
      getIntegralData: [
        {
          userid: 0,
          account_id: 0,
          Integral_name: '端口新开扣除',
          account_details: 3000,
          account_time: '2021-10-13 19:25:49'
        },
        {
          userid: 1,
          account_id: 1,
          Integral_name: '端口续费扣除',
          account_details: 1000,
          account_time: '2021-10-10 19:25:49'
        },
        {
          userid: 2,
          account_id: 2,
          Integral_name: '端口续费扣除',
          account_details: 2000,
          account_time: '2021-09-25 19:25:49'
        },
        {
          userid: 3,
          account_id: 3,
          Integral_name: '端口新开扣除',
          account_details: 1000,
          account_time: '2021-08-26 19:25:49'
        }
      ],
      agentList: {
        agent_level: 0,
        points: 0
      },
      searchData: {
        _like_r_username: null,
        username: null,
        role: null,
        page: 1,
        page_size: 10,
        order_created_at: true
      },
      user_id: null,
      form: {
        allowance: 3000,
        accountId: 12,
        amount: 2000,
        remarks: ''
      },
      FlowForm: {
        flow: 0
      },
      total: 0,
      query: {
        account_name: '',
        account_number: null,
        account_id: null
      },
      selectDataId: [],
      selectData: [],
      purchaseFlowVisible: false,
      checkIntegralVisible: false, //查看积分记录
      topUpVisible: false, //充值积分
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.user_id = this.userInfo.data.i
      this.checkIntegralVisible = false
      this.columns = []
      columns.forEach(item => {
        this.columns.push(item)
      })
      this.getTableData()
      this.getUserData()
    },
    getTableData() {
      let searchData = {}
      searchData.page = this.searchData.page
      searchData.page_size = this.searchData.page_size
      searchData.order_created_at = this.searchData.order_created_at
      api.getAgentPointsRecord(searchData).then((res) => {
        if (res.code === 0) {
          this.tableData = res.data.data
          this.total = res.data.count
        } else {
          message.error(res.data.message)
        }
      })
    },
    getUserData() {
      let searchData = {}
      searchData.id = this.user_id
      api.getAgent(searchData).then((res) => {
        if (res.code === 0) {
          this.agentList = res.data.data[0]
        } else {
          message.error(res.data.message)
        }
      })
    },
    rowSelection(selectedRowKeys, values) {
      this.selectDataId = []
      this.selectData = []
      selectedRowKeys.forEach(item => {
        this.selectDataId.push(item)
      })
      values.forEach(item => {
        this.selectData.push(item)
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
          message.error(res.data.message)
        }
      })
    },
    handleCurrentChange(page) {
      this.searchData.page = page
      this.getTableData()
    },
    handleSizeChange(p, s) {
      this.searchData.page_size = s
      this.init()
    },
    // 查看积分记录
    checkIntegralView() {
      this.checkIntegralVisible = true
      this.columnsIntegral = []
      columnsIntegral.forEach(item => {
        this.columnsIntegral.push(item)
      })
    },
    // 充值积分 显示
    topUpView() {
      this.topUpVisible = true
    },
    // 充值积分 提交
    topUpsubmit() {
      this.topUpVisible = false
    }
  }
 }
</script>

<style lang="scss">
.ant-calendar-picker {
  min-width: 0 !important;
}
.head{
  display: flex;
}

.head-left {
  display: flex;
  width: 48%;
  box-shadow: 0px 3px 10px #00000029;
  background: #fff;
  border-radius: 15px;
  padding: 20px 38px;
  height: 170px;
  .head-left-logo{
    margin-right: 30px;
    img{
      width: 125px;
      height: 125px;
    }
  }
  .head-left-message{
    .head-left-message-username{
      font-size: 28px;
      color: #000;
      font-weight: 600;
    }
    .head-left-message-role{
      background: #f1f1f1;
      border-radius: 10px;
      color: #3598F1;
      margin-bottom: 10px;
      img{
        margin-left: 10px;
        margin-right: 10px;
      }
    }
    .head-left-message-level{
      background: #f1f1f1;
      border-radius: 10px;
      color: #3598F1;
      margin-bottom: 10px;
      img{
        margin-left: 10px;
        margin-right: 10px;
      }
    }
    .head-left-message-email{
      color: #9B9B9B;
      border-radius: 10px;
      padding-left: 10px;
    }
  }
  .head-left-flow{
    padding: 0 15vh;
    img {
      width: 13vw;
      height: 4vw;
      margin-top: 1.3vw;
    }
  }
}
.head-right{
  display: flex;
  width: 48%;
  background: #fff;
  box-shadow: 0px 3px 10px #00000029;
  margin-left: 65px;
  border-radius: 15px;
  padding: 20px 38px;
  height: 170px;
  .head-right-flow{
    font-size: 25px;
    font-weight: 700;
    color: #3598F1;
    width: 50%;
    text-align: center;
    margin: 50px 0px;
    span{
      color: #000;
    }
  }
  .head-right-points{
    font-size: 25px;
    font-weight: 700;
    color: #FF9900;
    width: 50%;
    text-align: center;
    margin: 50px 0px;
    span{
      color: #000;
    }
  }
}
</style>