<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item>
          <!-- <a-button type="primary" @click="init">查询</a-button> -->
          <a-button style="margin-left:10px;" type="primary" @click="dialogVisible = true">新增</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="table-box">
      <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" :scroll="{ x }" class="tableLimit" :bordered="true" :pagination="false">
        <span slot="created_at" slot-scope="text, row">
          {{ new Date(row.created_at) | getTime }}
        </span>
        <span slot="action" slot-scope="text, row">
          <a-button @click="view(row)"> 查看</a-button>
          <a-button style="margin-left:8px" type="primary" @click="create(row)">创建</a-button>
          <a-button style="margin-left: 8px;background:#E6A23C;color:white" @click="stop(row.id)">停止</a-button>
          <a-popconfirm title="是否删除?" ok-text="是" cancel-text="否" @confirm="del(row.id)">
            <a-button style="margin-left: 8px" type="danger">删除</a-button>
          </a-popconfirm>
        </span>
      </a-table>
      <div class="page">
        <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} 条，总数:${total} 条`" :page-size-options="['10', '20', '50', '100', '200']" show-size-changer :default-current="1" :total="total" :current="searchData.page" @change="handleCurrentChange" @showSizeChange="handleSizeChange">
          <template slot="buildOptionText" slot-scope="props">
            <span>{{ props.value }}条/页</span>
          </template>
        </a-pagination>
      </div>
      <a-modal v-model="dialogVisible" title="新增" ok-text="确认" cancel-text="取消" width="500px" @ok="addTask">
        <a-form-model ref="form" layout="horizontal" :model="form" :rules="form_rule" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-form-model-item label="任务分组">
            <a-input v-model="form.executive_group_name" @click="dialogGroupId = true" />
          </a-form-model-item>
          <a-form-model-item label="任务账号">
            <a-input v-model="form.executives" placeholder="(如有多个使用,分割)" />
          </a-form-model-item>
          <a-form-model-item label="任务备注">
            <a-input v-model="form.remark" placeholder="任务备注" />
          </a-form-model-item>
          <a-form-model-item v-for="(domain, index) in form.video" :key="index" label="视频地址" class="short-input btn-item">
            <a-input v-model="domain.value" width="100px" />
            <a-button class="add-btn" type="success" @click="form.video.push({ value: '' })">新增</a-button>
            <a-button class="delete-btn" type="danger" @click.prevent="form.video.length === 1 ? '' : form.video.splice(index, 1)">删除</a-button>
          </a-form-model-item>
          <a-form-model-item v-for="(domain, index1) in form.text" :key="index1 + 'info'" label="作品文字" class="short-input btn-item">
            <a-input v-model="domain.value" />
            <a-button class="add-btn" type="success" plain @click="form.text.push({ value: '' })">新增</a-button>
            <a-button class="delete-btn" type="danger" plain @click.prevent="form.text.length === 1 ? '' : form.text.splice(index1, 1)">删除</a-button>
          </a-form-model-item>
          <a-form-model-item v-for="(domain, index2) in form.proxy_info" :key="index2 + 'info4'" label="协议信息" class="short-input btn-item">
            <a-input ref="proxy_input" v-model="domain.value" @click="setProxyInfo(index2)" />
            <a-button class="add-btn" type="success" @click="form.proxy_info.push({ value: '' })">新增</a-button>
            <a-button class="delete-btn" type="danger" @click.prevent="form.proxy_info.length === 1 ? '' : form.proxy_info.splice(index2, 1)">删除</a-button>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <group :dialog-group-id="dialogGroupId" @getGroupId="getGroupId" @cancelGetGroupId="dialogGroupId = false" />
      <proxy :disalog-proxy="disalogProxy" @getProxy="getProxy" @cancel="closeProxy" />
    </div>
  </div>
</template>

<script>
import mixin from './mixin/mixin'
import { columns } from './mixin/mixin'
import * as api from '@/api/index'
export default {
  mixins: [mixin],
  data() {
    return {
      searchData: {
        page: 1,
        type: 3,
        order_created_at: true
      },
      columns: [],
      form_rule: {}
    }
  },
  mounted() {
    columns.forEach(item => {
      if (!item.type.includes(3)) {
        return
      }
      if (item.role) {
        if (!item.role.includes(this.role)) {
          return
        }
      }
      this.columns.push(item)
    })
    this.init()
  },
  methods: {
    async getTableData() {
      const res = await api.getTask(this.searchData)
      if (res && res.code === 0 && res.data) {
        this.tableData = res.data.data
        this.total = res.data.count
      }
    },
    async addTask() {
      if (this.validateForm()) return
      const video = this.computeArr(this.form.video)
      const text = this.computeArr(this.form.text)
      const proxy_info = this.computeArr(this.form.proxy_info)
      this.postTask({
        type: 3,
        video,
        text,
        proxy_info
      })
    },
    validateForm() {
      if (this.form.video.findIndex(item => item.value === '') !== -1 || this.form.text.findIndex(item => item.value === '') !== -1) {
        this.$message.error('视频地址和文字信息需要填写齐全')
        return true
      }
      if (this.form.proxy_info.findIndex(item => item.value === '') !== -1) {
        this.$message.error('协议信息需要填写齐全')
        return true
      }
      return false
    }
  }
}
</script>

<style lang="scss">
</style>
