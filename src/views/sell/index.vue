<template>
  <div>
    <a-table :columns="columns" :row-key="record => record.userid" :data-source="getData" bordered :row-selection="{ selectedRowKeys: selectDataId, onChange: rowSelection }">
      <span slot="action" slot-scope="text, row">
        <a-button style="margin-left:5px" type="primary" @click="checkView(row)">查看信息</a-button>
        <a-button style="margin-left:5px" type="primary" @click="checkAccountView(row)">查看账号</a-button>
      </span>
    </a-table>
  </div>
</template>

<script>
import * as api from '@/api/index'
const columns = [
  {
    title: '用户信息',
    dataIndex: 'userinfo',
    width: '60px',
    align: 'center',
    scopedSlots: { customRender: 'userinfo' }
  },
  {
    title: '账号数量',
    dataIndex: 'account_amount',
    width: '60px',
    align: 'center',
    scopedSlots: { customRender: 'account_amount' }
  },
  {
    title: '账号价格',
    dataIndex: 'account_price',
    width: '60px',
    align: 'center',
    scopedSlots: { customRender: 'account_price' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '60px',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  data() {
    return {
      columns: [],
      getData: [
        {
          userid: 0,
          userinfo: 'admin',
          account_amount: 30,
          account_price: 300
        },
        {
          userid: 1,
          userinfo: 'admin1',
          account_amount: 30,
          account_price: 300
        },
        {
          userid: 2,
          userinfo: 'admin2',
          account_amount: 30,
          account_price: 300
        },
        {
          userid: 3,
          userinfo: 'admin3',
          account_amount: 30,
          account_price: 300
        }
      ],
      selectDataId: [],
      selectData: []
    }
  },
  mounted() {
    this.columns = []
    columns.forEach(item => {
      this.columns.push(item)
    })
  },
  methods: {
    getTableData() {

    },
    checkView(row) {
      console.log(row)
      console.log(this.selectDataId)
      console.log(this.selectData)
    },
    checkAccountView(row) {
      console.log(row)
      console.log(this.selectDataId)
      console.log(this.selectData)
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
      console.log(this.selectDataId)
      console.log(this.selectData)
    },
  }
 }
</script>

<style lang="scss">
.ant-calendar-picker {
  min-width: 0 !important;
}
</style>