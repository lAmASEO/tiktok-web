<template>
  <div>
    <a-modal v-model="childDialog" title="获取标签" width="500px" ok-text="确认" cancel-text="取消" @cancel="cancel" @ok="getTag">
      <div class="search-box">
        <a-form layout="inline" :model="searchData" class="demo-form-inline">
          <a-form-item label="标签名">
            <a-input v-model="searchData.name" placeholder="标签名" allow-clear />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="init">查询</a-button>
          </a-form-item>
        </a-form>
      </div>
      <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" class="tableLimit" :row-selection="rowSelection" :pagination="false">
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
  title: 'ID',
  dataIndex: 'id',
  ellipsis: true,
  align: 'center'
}, {
  title: '标签名',
  dataIndex: 'name',
  ellipsis: true,
  align: 'center'
}]
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['dialogTag'],
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      role: 0,
      searchData: {
        page: 1,
        order_created_at: true
      },
      columns: [],
      tableData: [],
      total: 0,
      size: 10,
      tags_arr: [],
      radioArr: [],
      childDialog: false
    }
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
          this.tags_arr = []
          console.log(selectedRowKeys)
          selectedRowKeys.forEach(item => {
            this.tags_arr.push(item)
          })
          console.log(selectedRowKeys)
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name
          }
        })
      }
    }
  },
  watch: {
    dialogTag(newValue, oldValue) {
      this.childDialog = newValue
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
  methods: {
    init() {
      this.getTableData()
    },
    async getTableData() {
      const res = await api.getTiktokUserTag(this.searchData)
      if (res && res.code === 0 && res.data) {
        this.tableData = res.data.data
        this.radioArr = []
        this.tableData.forEach((item, index) => {
          this.radioArr.push({
            index,
            value: false
          })
        })
        console.log(this.radioArr)
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
      this.$emit('getTagId', this.tableData[index].id, this.tableData[index].name)
    },
    handleSizeChange(p, s) {
      this.searchData.page_size = s
      this.init()
    },
    cancel() {
      this.$emit('cancel')
    },
    getTag() {
      this.$emit('getTagId', this.tags_arr)
    }
  }
}
</script>

<style lang="scss">
</style>
