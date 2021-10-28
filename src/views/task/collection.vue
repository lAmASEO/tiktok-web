<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <!-- <a-form-item label="采集类型">
          <a-select v-model="searchData.type" placeholder="选择采集类型" style="width:150px" @change="changeSelect">
            <a-select-option v-for="(item, index) in type" :key="index" :value="item.value">{{ item.label }}</a-select-option>
          </a-select>
        </a-form-item> -->
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
          <a-form-model-item label="帖子的 id">
            <a-input v-model="form.follow_note_id" placeholder="帖子的 id" />
          </a-form-model-item>
          <a-form-model-item label="用户的 id">
            <a-input v-model="form.follow_user_id" placeholder="用户的 id" />
          </a-form-model-item>
          <a-form-model-item label="用户secid">
            <a-input v-model="form.follow_user_sec_id" placeholder="用户secid" />
          </a-form-model-item>
          <a-form-model-item label="关联标签">
            <a-input v-model="form.tags" placeholder="关联标签" @click.prevent="dialogTag = true" />
          </a-form-model-item>
          <a-form-model-item v-for="(domain, index) in form.keywords" :key="index" label="关键词" class="short-input btn-item">
            <a-input v-model="domain.value" width="100px" />
            <a-button class="add-btn" type="success" @click="form.keywords.push({ value: '' })">新增</a-button>
            <a-button class="delete-btn" type="danger" @click.prevent="form.keywords.length === 1 ? '' : form.keywords.splice(index, 1)">删除</a-button>
          </a-form-model-item>
          <!-- <a-form-model-item v-for="(domain, index1) in form.tags" :key="index1 + 'info'" label="关联标签" class="short-input btn-item">
            <a-input v-model="domain.value" />
            <a-button class="add-btn" type="success" plain @click="form.tags.push({ value: '' })">新增</a-button>
            <a-button class="delete-btn" type="danger" plain @click.prevent="form.tags.length === 1 ? '' : form.tags.splice(index1, 1)">删除</a-button>
          </a-form-model-item> -->
        </a-form-model>
      </a-modal>
      <group :dialog-group-id="dialogGroupId" @getGroupId="getGroupId" @cancelGetGroupId="dialogGroupId = false" />
      <tag :dialog-tag="dialogTag" @getTagId="getTagId" @cancel="dialogTag = false" />
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
        type: 14,
        order_created_at: true
      },
      columns: [],
      type: [{ label: '采集帖子', value: 1 }, { label: '采集用户', value: 2 }, { label: '采集关联词', value: 3 }],
      typeValue: '',
      dialogTag: false,
      form: {
        type: 3,
        executive_group: '',
        executives: '',
        remark: '',
        video: [{ value: '' }]
      },
      form_rule: {}
    }
  },
  mounted() {
    columns.forEach(item => {
      if (!item.type.includes(14)) {
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
    changeSelect(value) {

    },
    getTagId(arr) {
      console.log(arr)
      this.dialogTag = false
      this.form.tags = arr.join(',')
    },
    async addTask() {
      if (this.validateForm()) return
      const form = {}
      form.follow_note_id = this.form.follow_note_id
      form.follow_user_id = this.form.follow_user_id
      form.follow_user_sec_id = this.form.follow_user_sec_id
      form.keywords = this.computeArr(this.form.keywords)
      form.tags = this.form.tags.split(',')
      form.tags.forEach((item, index) => {
        form.tags[index] = Number(form.tags[index])
      })
      this.postTask({
        type: 14,
        ...form
      })
    },
    validateForm() {
      return false
    }
  }
}
</script>

<style lang="scss">
</style>
