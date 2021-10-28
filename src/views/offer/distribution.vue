<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <!-- <a-form-item label="名字">
          <a-input v-model="searchData.name" placeholder="名字" allow-clear />
        </a-form-item> -->
        <a-form-item>
          <!-- <a-button type="primary" @click="init()">查询</a-button> -->
          <a-button type="primary" style="margin-left:10px;" @click="add">新增</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="table-box">
      <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" class="tableLimit" :bordered="true" :pagination="false">
        <span slot="created_at" slot-scope="text, row">
          {{ new Date(row.created_at) | getTime }}
        </span>
      </a-table>

      <a-modal v-model="dialogVisible" title="新增" width="500px" ok-text="确认" cancel-text="取消" @ok="handleAdd">
        <a-form ref="form" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-form-model-item v-for="(domain, index) in form.level_1" :key="index + '1'" label="一级分销" class="short-input btn-item">
            <a-input v-model="domain.quantity" placeholder="数量" style="width:80px" />
            <a-input v-model="domain.proportion" placeholder="比例" addon-after="%" style="width:100px;margin-left:10px" />
            <a-button class="add-btn" type="success" @click="form.level_1.push({ quantity: '', proportion: '' })">新增</a-button>
            <a-button class="delete-btn" type="danger" @click.prevent="form.level_1.length === 1 ? '' : form.level_1.splice(index, 1)">删除</a-button>
          </a-form-model-item>
          <a-form-model-item v-for="(domain, index1) in form.level_2" :key="index1 + '2'" label="二级分销" class="short-input btn-item">
            <a-input v-model="domain.quantity" placeholder="数量" style="width:80px" />
            <a-input v-model="domain.proportion" placeholder="比例" addon-after="%" style="width:100px;margin-left:10px" />
            <a-button class="add-btn" type="success" @click="form.level_2.push({ quantity: '', proportion: '' })">新增</a-button>
            <a-button class="delete-btn" type="danger" @click.prevent="form.level_2.length === 1 ? '' : form.level_2.splice(index1, 1)">删除</a-button>
          </a-form-model-item>
          <a-form-model-item v-for="(domain, index2) in form.level_3" :key="index2 + '3'" label="三级分销" class="short-input btn-item">
            <a-input v-model="domain.quantity" placeholder="数量" style="width:80px" />
            <a-input v-model="domain.proportion" placeholder="比例" addon-after="%" style="width:100px;margin-left:10px" />
            <a-button class="add-btn" type="success" @click="form.level_3.push({ quantity: '', proportion: '' })">新增</a-button>
            <a-button class="delete-btn" type="danger" @click.prevent="form.level_3.length === 1 ? '' : form.level_3.splice(index2, 1)">删除</a-button>
          </a-form-model-item>
        </a-form>
      </a-modal>
      <a-modal v-model="modifyDialogVisible" title="修改" width="500px" ok-text="确认" cancel-text="取消" @ok="handleEdit">
        <a-form ref="form" :model="modifyForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-form-item label="名称">
            <a-input v-model="modifyForm.username" />
          </a-form-item>
        </a-form>
      </a-modal>
      <div class="page">
        <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} 条，总数:${total} 条`" :page-size-options="['10', '20', '50', '100', '200']" show-size-changer :default-current="1" :current="searchData.page" :total="total" @change="handleCurrentChange" @showSizeChange="handleSizeChange">
          <template slot="buildOptionText" slot-scope="props">
            <span>{{ props.value }}条/页</span>
          </template>
        </a-pagination>
      </div>
    </div>
  </div>
</template>

<script>
const columns = [{
  title: '创建时间',
  dataIndex: 'created_at',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'created_at' }
}, {
  title: '规则',
  dataIndex: 'rule',
  width: '100',
  align: 'center',
  customRender: (value, row, index) => {
    let str = ''
    const obj = JSON.parse(value)
    str += '一级分销：'
    obj.level_1.forEach((item, index) => {
      str += `数量:${item.quantity}, 比例:${item.proportion / 100}%；`
    })
    str += '二级分销：'
    obj.level_2.forEach((item, index) => {
      str += `数量:${item.quantity}, 比例:${item.proportion / 100}%；`
    })
    str += '三级分销：'
    obj.level_3.forEach((item, index) => {
      str += `数量:${item.quantity}, 比例:${item.proportion / 100}%；`
    })
    console.log(JSON.parse(value))
    return str
  }
}]
import * as api from '@/api/index'
export default {
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      searchData: {
        name: '',
        page: 1,
        order_created_at: true
      },
      columns: columns,
      tableData: [],
      total: 0,
      size: 10,
      dialogVisible: false,
      modifyDialogVisible: false,
      form: {
        level_1: [{ quantity: 0, proportion: 80 }],
        level_2: [{ quantity: '', proportion: '' }],
        level_3: [{ quantity: '', proportion: '' }]
      },
      modifyForm: {}
    }
  },
  async mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.searchData.page = 1
      this.getTableData()
    },
    async getTableData() {
      const res = await api.getDistribution(this.searchData)
      if (res && res.code === 0 && res.data) {
        this.tableData = res.data.data
        this.total = res.data.count
      }
    },
    handleCurrentChange(page) {
      this.searchData.page = page
      this.getTableData()
    },
    add() {
      this.dialogVisible = true
    },
    async handleAdd() {
      const params = {
        level_1: [],
        level_2: [],
        level_3: []
      }
      let isOk = true
      for (const item in this.form) {
        console.log(this.form[item])
        this.form[item].forEach(list => {
          if (list.quantity === '' || list.proportion === '') {
            isOk = false
          }
          params[item].push({
            quantity: list.quantity === '' ? null : Number(list.quantity),
            proportion: list.proportion === '' ? null : list.proportion * 100
          })
        })
      }
      if (!isOk) {
        this.$message.error('请先填写齐全')
        return
      }
      const rule = JSON.stringify(params)
      const belong = this.userInfo.data.i
      const res = await api.postDistribution({ belong, rule })
      if (res.code === 0) {
        this.dialogVisible = false
        this.getTableData()
      }
    },
    edit(row) {
      this.modifyDialogVisible = true
      this.modifyForm = row
    },
    async handleEdit() {
      const res = await api.putUserInter(this.modifyForm)
      if (res.code === 0) {
        this.modifyDialogVisible = false
      }
    },
    async handleDelete(row) {
      const res = await api.delUserInter(row)
      if (res.code === 0) {
        this.getTableData()
      }
    },
    handleSizeChange(p, s) {
      this.searchData.page_size = s
      this.init()
    }
  }
}
</script>

<style lang="scss">
</style>
