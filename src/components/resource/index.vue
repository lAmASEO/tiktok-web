<template>
  <div>
    <a-modal v-model="dialog" title="获取资源" width="500px" ok-text="确认" cancel-text="取消" @cancel="cancel" @ok="cancel">

      <div class="search-box">
        <a-form layout="inline" :model="searchData" class="demo-form-inline">
          <!-- <a-form-item label="资源名字">
            <a-input v-model="searchData.name" placeholder="资源名字" allow-clear />
          </a-form-item> -->
          <a-form-item>
            <a-button type="primary" @click="init">查询</a-button>
          </a-form-item>
        </a-form>
      </div>
      <div class="table-box">
        <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" :custom-row="handRowClick" class="tableLimit" :bordered="true" :pagination="false">
          <span slot="created_at" slot-scope="text, row">
            {{ new Date(row.created_at) | getTime }}
          </span>
        </a-table>
        <div class="page">
          <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} 条，总数:${total} 条`" :page-size-options="['10', '20', '50', '100', '200']" show-size-changer :default-current="1" :current="searchData.page" :total="total" @change="handleCurrentChange" @showSizeChange="handleSizeChange">
            <template slot="buildOptionText" slot-scope="props">
              <span>{{ props.value }}条/页</span>
            </template>
          </a-pagination>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
const columns = [{
  title: '资源名称',
  dataIndex: 'name',
  width: '100',
  align: 'center'
}]
import * as api from '@/api/index'
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['type'],
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      searchData: {
        name: '',
        type: '',
        page: 1,
        order_created_at: true
      },
      columns: columns,
      tableData: [],
      total: 0,
      size: 10,
      dialog: true
    }
  },
  async mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.searchData.type = this.type
      this.searchData.page = 1
      this.getTableData()
    },
    async getTableData() {
      const res = await api.getResourceUser(this.searchData)
      if (res && res.code === 0 && res.data) {
        this.tableData = res.data.data
        this.total = res.data.count
      }
    },
    handleCurrentChange(page) {
      this.searchData.page = page
      this.getTableData()
    },
    handleSizeChange(p, s) {
      this.searchData.page_size = s
      this.init()
    },
    cancel() {
      this.dialog = false
      this.$emit('cancel')
    },
    handRowClick(row) {
      return {
        on: {
          click: (e) => {
            this.$emit('getData', row)
            this.cancel()
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
</style>
