<template>
  <div>
    <a-modal v-model="dialogGroupId" title="获取设备ID" width="600px" ok-text="确认" cancel-text="取消" @cancel="cancel" @ok="cancel">
      <div class="search-box">
        <a-form layout="inline" :model="searchData" class="demo-form-inline">
          <a-form-item label="设备串码">
            <a-input v-model="searchData.port_no" placeholder="设备串码" allow-clear />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="init">查询</a-button>
          </a-form-item>
        </a-form>
      </div>
      <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" class="tableLimit" :custom-row="handRowClick" :pagination="false">
        <!-- <span slot="action" slot-scope="text, row, index ">
          <a-radio :value="index" class="radio" @change="getCurrentRow(index)" />
        </span> -->
      </a-table>
      <div class="page">
        <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} 条，总数:${total} 条`" :page-size-options="['10', '20', '50', '100']" show-size-changer :default-current="1" :current="searchData.page" :total="total" @change="handleCurrentChange" @showSizeChange="handleSizeChange" />
      </div>
    </a-modal>
  </div>
</template>

<script>
import * as api from '@/api/index'
const columns = [{
  title: '设备ID',
  dataIndex: 'id',
  ellipsis: true,
  width: '100px',
  align: 'center'
}, {
  title: '设备串码',
  dataIndex: 'port_no',
  ellipsis: true,
  width: '160px',
  align: 'center'
}, {
  title: '备注',
  dataIndex: 'remark',
  ellipsis: true,
  width: '220px',
  align: 'center'
}]
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['dialogGroupId'],
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      role: 0,
      searchData: {
        page: 1,
        page_size: 10,
        order_created_at: true
      },
      columns: [],
      // dialogGroupId: true,
      tableData: [],
      total: 0,
      size: 10,
      radioArr: []
    }
  },
  mounted() {
    this.searchData.page = 1
    this.role = this.userInfo.data.r
    this.columns = []
    columns.forEach(item => {
      if (item.role != null) {
        if (!item.role.includes(this.role)) {
          return
        }
      }
      this.columns.push(item)
    })
    this.init()
  },
  wathch: {
    dialogGroupId(newValue, oldValue) {
      this.radioArr.forEach(item => { item.value = false })
    }
  },
  methods: {
    init() {
      this.getTableData()
    },
    async getTableData() {
      
      var getDaviceParma = {
        user_id: this.userInfo.data.i,
        page: this.searchData.page,
        page_size: this.searchData.page_size,
        order_created_at: true
      }
      const res = await api.getDevice(getDaviceParma)
      if (res && res.code === 0 && res.data) {
        this.tableData = res.data.data
        this.radioArr = []
        this.tableData.forEach((item, index) => {
          this.radioArr.push({
            index,
            value: false
          })
        })
        this.total = res.data.count
      }
    },
    handleCurrentChange(page) {
      this.searchData.page = page
      this.getTableData()
    },
    getCurrentRow(index) {
      const id = this.tableData[index].id
      console.log(id)
      this.$emit('getGroupId', this.tableData[index].id, this.tableData[index].port_no)
    },
    handleSizeChange(p, s) {
      this.searchData.page_size = s
      this.init()
    },
    cancel() {
      this.$emit('cancelGetGroupId')
      this.radioArr.map(item => { item.value = false })
    },
    handRowClick(row) {
      return {
        on: {
          click: (e) => {
            this.$emit('getGroupId', row.id, row.port_no)
            this.radioArr.map(item => { item.value = false })
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
</style>
