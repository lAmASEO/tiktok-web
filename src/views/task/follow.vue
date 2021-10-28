<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item label="关注类型">
          <a-select v-model="searchData.type" placeholder="选择关注类型" style="width:150px" @change="changeSelect">
            <!-- <a-select-option :value="1">关注 用户的粉丝</a-select-option> -->
            <!-- <a-select-option :value="5">关注 单个用户</a-select-option>
            <a-select-option :value="1">关注 TIKTOK用户</a-select-option> -->
            <a-select-option :value="3">关注 TIKTOK用户</a-select-option>
            <!-- <a-select-option :value="2">关注 帖子下的用户</a-select-option> -->
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="init">查询</a-button>
          <!-- <a-button style="margin-left:10px;" type="primary" @click="dialogVisible = true">新增</a-button> -->
          <a-button style="margin-left:10px;" type="primary"  @click="Attention()">关注</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="table-box">
      <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" :scroll="{ x }" class="tableLimit" :bordered="true" :pagination="false">
        <span slot="created_at" slot-scope="text, row">
          {{ new Date(row.created_at) | getTime }}
        </span>
        <span slot="executive" slot-scope="text, row">
          {{ row.executive}}{{ row.executive}}
        </span>
        <span slot="tiktok" slot-scope="text, row">
          {{ row.tiktok_user }}
        </span>
        <span slot="action" slot-scope="text, row">
          <a-button @click="view(row)"> 查看</a-button>
          <a-button v-if="searchData.type != 1" style="margin-left:8px" type="primary" @click="create(row)">创建</a-button>
          <a-button style="margin-left: 8px;background:#E6A23C;color:white" @click="stop(row.id)">停止</a-button>
          <a-popconfirm title="是否删除?" ok-text="是" cancel-text="否" @confirm="del(row.id)">
            <a-button style="margin-left: 8px" type="danger">删除</a-button>
          </a-popconfirm>
          <!-- <a-button type="primary" style="margin-left: 8px;" @click="pause(row)">暂停</a-button> -->

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
        <a-form-model ref="form" layout="horizontal" :model="form" :rules="form_rule" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <!-- <a-form-model-item label="关注类型">
            <a-select v-model="form.type" placeholder="选择关注类型" @change="changeFormSelect">
              <a-select-option :value="1">关注 用户的粉丝</a-select-option>
              <a-select-option :value="2">关注 帖子下的用户</a-select-option>
              <a-select-option :value="3">关注 TIKTOK用户</a-select-option>
            </a-select>
          </a-form-model-item> -->
          <!-- <a-form-model-item label="任务分组">
            <a-input v-model="form.executive_group_name" @click="dialogGroupId = true" />
          </a-form-model-item> -->
          <a-form-model-item label="任务分组">
            <a-input v-model="form.executives" placeholder="(如有多个使用,分割)" @click="dialogGroupId = true" />
          </a-form-model-item>
          <a-form-model-item label="间隔时间">
            <a-input v-model="form.intervals" placeholder="间隔时间" />
          </a-form-model-item>

          <!-- <a-form-model-item v-if="form.type == 1 || form.type == 2" :label="numberText[form.type]">
            <a-input v-model="form.follow_total" placeholder="目标总数" />
          </a-form-model-item>
          <a-form-model-item v-if="form.type == 1 || form.type == 2" label="开始下标">
            <a-input v-model="form.follow_index" placeholder="开始下标" />
          </a-form-model-item>
          <a-form-model-item v-if="form.type == 2" label="视频链接">
            <a-input-search placeholder="例:https://www.tiktok.com/@yua_mikami/video/7004832688272100610" enter-button @search="onSearchVideo" />
          </a-form-model-item>
          <a-form-model-item v-if="form.type == 2" label="帖子ID">
            <a-input v-model="form.follow_note_id" placeholder="帖子ID" />
          </a-form-model-item>
          <a-form-model-item v-if="form.type == 1" label="用户链接">
            <a-input-search placeholder="例:https://vm.tiktok.com/ZSJwYMKcR/" enter-button @search="onSearchUser" />
          </a-form-model-item>

          <a-form-model-item v-if="form.type == 1" label="用户UID">
            <a-input v-model="form.follow_user_id" placeholder="用户UID" />
          </a-form-model-item>
          <a-form-model-item v-if="form.type == 1" label="用户secUid">
            <a-input v-model="form.follow_user_sec_id" placeholder="用户secUid" />
          </a-form-model-item>
          <a-form-model-item label="地区">
            <a-input v-model="form.follow_region" placeholder="地区" />
          </a-form-model-item> -->

          <a-form-model-item label="数量">
            <a-input v-model="form.follow_user_num" placeholder="数量" />
          </a-form-model-item>

          <a-form-model-item label="备注">
            <a-input v-model="form.remark" placeholder="任务备注" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <group :dialog-group-id="dialogGroupId" @getGroupId="getGroupId" @cancelGetGroupId="dialogGroupId = false" />
      <!-- <pack :dialog-pack="dialogPack" /> -->
    </div>
  </div>
</template>

<script>
import mixin from './mixin/mixin'
// import { columns } from './mixin/mixin'
import * as api from '@/api/index'
import { message } from 'ant-design-vue'
const columns = [{
  title: '创建时间',
  dataIndex: 'created_at',
  width: '80px',
  align: 'center',
  scopedSlots: { customRender: 'created_at' }
},
{
  title: '端口',
  dataIndex: 'executive',
  width: '80px',
  align: 'center',
  customRender: (value, row, index) => {
    return value != null ? value.join(',') : value
  },
  scopedSlots: { customRender: 'executive' }
},
{
  title: '任务间隔时间',
  dataIndex: 'intervals',
  width: '80px',
  align: 'center',
  scopedSlots: { customRender: 'intervals' }
},
/* {
  title: '地区',
  dataIndex: 'region',
  width: '80px',
  align: 'center',
  scopedSlots: { customRender: 'region' }
}, */
{
  title: '备注',
  dataIndex: 'remark',
  width: '100px',
  align: 'center',
  scopedSlots: { customRender: 'remark' }
},
{
  title: '操作',
  dataIndex: 'action',
  width: '180px',
  align: 'center',
  scopedSlots: { customRender: 'action' }
},
]
export default {
  mixins: [mixin],
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      searchData: {
        page: 1,
        page_size: 10,
        type: 3,
        order_created_at: true
      },
      columns: [],
      numberText: {
        6: '单个账号关注总数',
        5: '目标总数',
        4: '单个账号关注总数'
      },
      role: 0,
      form: {
        type: 6,
        executive_group: '',
        executives: '',
        remark: '',
        video: [{ value: '' }],
        follow_user_id: '',
        follow_user_sec_id: '',
        follow_note_id: '',
        follow_user_num: 10,
        intervals: 3,
        region: '',
        remark: ''
      },
      form_rule: {}
    }
  },
  created() {
    const role = JSON.parse(window.sessionStorage.getItem('userInfo')).data.r
    if (role === 2) {
      this.$router.push({ name: 'User' })
    }
  },
  mounted() {
    this.changeSelect(6)
    this.form.type = 3
    this.columns = []
    this.role = this.userInfo.data.r
    columns.forEach(item => {
      if (item.role != null && !item.role.includes(this.role)) {
        return
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
    changeFormSelect(value) {
      this.resetForm()
    },
    changeSelect(value) {
      /* this.columns = []
      columns.forEach(item => {
        if (!item.type.includes(value)) {
          return
        }
        if (item.role) {
          if (!item.role.includes(this.role)) {
            return
          }
        }
        this.columns.push(item)
      }) */
      this.init()
    },
    onSearchUser(value, event) {
      // 解析用户的ID和uid
      if (value !== '') {
        api.postAnalyzeUserLink({ url: value }).then((res) => {
          if (res.code === 0) {
            if (this.form.type === 1) {
              this.form.follow_user_id = res.data.uid
              this.form.follow_user_sec_id = res.data.sec_uid
            }
            if (this.form.type === 2) {
              this.form.follow_note_id = res.data.video_id
            }
          } else {
            message.error('链接解析失败')
          }
        })
      }
    },
    onSearchVideo(value, event) {
      // 解析用户的ID和uid
      if (value !== '') {
        api.postAnalyzeVideoLink({ url: value }).then((res) => {
          if (res.code === 0) {
            if (this.form.type === 1) {
              this.form.follow_user_id = res.data.uid
              this.form.follow_user_sec_id = res.data.sec_uid
            }
            if (this.form.type === 2) {
              this.form.follow_note_id = res.data.video_id
            }
          } else {
            message.error('链接解析失败')
          }
        })
      }
    },
    getGroupId(ids) {
      if (this.form.executives !== '') {
        this.form.executives = this.form.executives + ',' + ids
      } else {
        this.form.executives = ids
      }
    },
    async addTask() {
      // if (this.validateForm()) return
      const form = {}
      let executive = []
      if(typeof this.form.executives === 'number') {
        executive.push(this.form.executives)
      } else if(typeof this.form.executives === 'string') {
        executive = this.form.executives.split(",").map(Number)
      }
      form.type = 3
      form.belong = Number(this.userInfo.data.i)
      form.executive = executive
      form.remark = this.form.remark
      form.follow_user_num = Number(this.form.follow_user_num)
      form.intervals = Number(this.form.intervals)
      /* switch (this.form.type) {
        case 1:
          form.type = 1
          form.follow_user_id =  this.form.follow_user_id
          form.follow_user_sec_id = this.form.follow_user_sec_id
          form.intervals = this.form.intervals === '' ? 0 : Number(this.form.intervals)
          form.region = this.form.follow_region === '' ? null : this.form.follow_region
          form.remark = this.form.remark === '' ? null : this.form.remark
          break
        case 2:
          form.type = 2
          form.intervals = this.form.intervals === '' ? 0 : Number(this.form.intervals)
          form.region = this.form.follow_region === '' ? null : this.form.follow_region
          form.remark = this.form.remark === '' ? null : this.form.remark
          form.follow_note_id = this.form.follow_note_id
          break
      } */
      const res = await api.postTask(form)
      if (res.code === 0) {
        this.dialogVisible = false
        this.getTableData()
      }
    },

    // 关注
    Attention() {
      this.dialogVisible = true
      this.form.remark = ''
      this.form.executives = ''
      this.form.follow_user_num = 10
      this.form.intervals = 3
    },
    validateForm() {
      switch (this.form.type) {
        case 4:
          if (this.form.follow_note_id === '') {
            this.$message.error('帖子id需要填写')
            return true
          }
          if (this.form.follow_total % 20 !== 0) {
            this.$message.error('单个账号关注总数需为20的倍数')
            return true
          }
          break
        case 5:
          if (this.form.follow_user_id === '' && this.form.follow_user_sec_id === '') {
            this.$message.error('用户的id和secUid必需填写一项')
            return true
          }
          break
        case 6:
          if (this.form.follow_user_id === '' && this.form.follow_user_sec_id === '') {
            this.$message.error('用户的id和secUid必需填写一项')
            return true
          }
          if (this.form.follow_total % 20 !== 0) {
            this.$message.error('单个账号关注总数需为20的倍数')
            return true
          }
          break
      }
      return true
    }
  }
}
</script>

<style lang="scss">
</style>
