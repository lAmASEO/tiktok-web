<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item label="私信类型">
          <a-select v-model="type" placeholder="选择私信类型" style="width:150px" @change="changeSelect">
            <!-- <a-select-option :value="1">视频</a-select-option> -->
            <a-select-option :value="2">文字</a-select-option>
            <a-select-option :value="3">富文本</a-select-option>
            <!-- <a-select-option :value="4">图片</a-select-option>
            <a-select-option :value="5">名片</a-select-option> -->
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="init">查询</a-button>
          <a-button style="margin-left:10px;" type="primary" @click="dialogVisible = true">新增</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="table-box">
      <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" class="tableLimit" :scroll="{ x }" :bordered="true" :pagination="false">
        <span slot="created_at" slot-scope="text, row">
          {{ new Date(row.created_at) | getTime }}
        </span>
        <span slot="action" slot-scope="text, row">
          <a-button @click="view(row)"> 查看</a-button>
          <a-button style="margin-left:8px" type="primary" @click="beforeCreate(row)">创建</a-button>
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
          <a-form-model-item label="私信类型">
            <a-select v-model="type" placeholder="选择私信类型" @change="changeFormSelect">
              <a-select-option v-for="(item, index) in exchangeType" :key="index" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="任务分组">
            <a-input v-model="form.executive_group_name" @click="dialogGroupId = true" />
          </a-form-model-item>
          <a-form-model-item label="任务账号">
            <a-input v-model="form.executives" placeholder="(如有多个使用,分割)" />
          </a-form-model-item>
          <a-form-model-item label="地区筛选">
            <a-input v-model="form.send_region" placeholder="(如有多个使用,分割)" prop="region" />
          </a-form-model-item>
          <a-form-model-item label="发送数量">
            <a-input v-model.number="form.number" placeholder="发送数量" />
          </a-form-model-item>
          <a-form-model-item label="任务备注">
            <a-input v-model="form.remark" placeholder="任务备注" />
          </a-form-model-item>
          <!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
          <a-form-model-item v-for="(domain, index) in form.video" v-if="form.resourceName == '' && type == 1" :key="index" label="视频地址" class="short-input btn-item" prop="video">
            <a-input v-model="domain.value" width="100px" />
            <a-button class="add-btn" type="success" @click="form.video.push({ value: '' })">新增</a-button>
            <a-button class="delete-btn" type="danger" @click.prevent="form.video.length === 1 ? '' : form.video.splice(index, 1)">删除</a-button>
          </a-form-model-item>
          <!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
          <a-form-model-item v-for="(domain, index1) in form.text" v-if="form.resourceName == '' && type == 2" :key="index1 + 'info'" label="私信文字" class="short-input btn-item" prop="text">
            <a-input v-model="domain.value" />
            <a-button class="add-btn" type="success" plain @click="form.text.push({ value: '' })">新增</a-button>
            <a-button class="delete-btn" type="danger" plain @click.prevent="form.text.length === 1 ? '' : form.text.splice(index1, 1)">删除</a-button>
          </a-form-model-item>
          <!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
          <a-form-model-item v-for="(domain, index2) in form.rich_text" v-if="form.resourceName == '' && type == 3" :key="index2 + 'info1'" :label="'富文本'" class="short-input btn-item" prop="rich_text">
            <a-input v-model="domain.value" type="textarea" @click.prevent="setRichText(index2)" />
            <a-button class="add-btn" type="success" plain @click="form.rich_text.push({ value: '' })">新增</a-button>
            <a-button class="delete-btn" type="danger" plain @click.prevent="form.rich_text.length === 1 ? '' : form.rich_text.splice(index2, 1)">删除</a-button>
          </a-form-model-item>
          <!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
          <a-form-model-item v-for="(domain, index) in form.image" v-if="form.resourceName == '' && type == 4" :key="index + 'info2'" :label="'图片地址'" class="short-input btn-item" prop="image">
            <a-input v-model="domain.value" />
            <a-button class="add-btn" type="success" plain @click="form.image.push({ value: '' })">新增</a-button>
            <a-button class="delete-btn" type="danger" plain @click.prevent="form.image.length === 1 ? '' : form.image.splice(index, 1)">删除</a-button>
          </a-form-model-item>
          <!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
          <a-form-model-item v-for="(domain, index) in form.name_card" v-if="form.resourceName == '' && type == 5" :key="index + 'info3'" :label="'名片'" class="short-input btn-item" prop="name_card">
            <a-input v-model="domain.value" />
            <a-button class="add-btn" type="success" plain @click="form.name_card.push({ value: '' })">新增</a-button>
            <a-button class="delete-btn" type="danger" plain @click.prevent="form.name_card.length === 1 ? '' : form.name_card.splice(index, 1)">删除</a-button>
          </a-form-model-item>
          <a-form-model-item label="资源内容">
            <a-button v-if="form.resourceName == ''" @click="getResouce">获取</a-button>
            <a-tag v-else closable @close="closeTag">
              {{ form.resourceName }}
            </a-tag>
            <span> (使用资源手填将会失效)</span>
          </a-form-model-item>
        </a-form-model>
      </a-modal>

      <a-modal v-model="disalogRichText" title="富文本" ok-text="确认" cancel-text="取消" width="550px" @ok="handleAddRichText">
        <a-form-model ref="rich_text_form" :model="rich_text_form" :rules="rich_text_form_rules" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-form-model-item label="标题" prop="title">
            <a-input v-model="rich_text_form.title" />
          </a-form-model-item>
          <a-form-model-item label="描述" prop="desc">
            <a-input v-model="rich_text_form.desc" />
          </a-form-model-item>
          <a-form-model-item label="头像地址" prop="avatar">
            <a-input v-model="rich_text_form.avatar" />
          </a-form-model-item>
          <a-form-model-item label="链接" prop="link">
            <a-input v-model="rich_text_form.link" />
          </a-form-model-item>
          <a-form-model-item label="文本">
            <a-input v-model="rich_text_form.text" type="textarea" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <group :dialog-group-id="dialogGroupId" @getGroupId="getGroupId" @cancelGetGroupId="dialogGroupId = false" />
      <resource v-if="dialogResource" :type="resourceType" @cancel="dialogResource = false" @getData="getResource" />
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
    let checkPending
    const checkNum = (rule, value, callback) => {
      clearTimeout(checkPending)
      if (!value) {
        return callback(new Error('请输入数量'))
      }
      checkPending = setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字'))
        } else {
          callback()
        }
      }, 1000)
    }
    const checkAddress = (rule, value, callback) => {
      const re = /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/
      let isOk = true
      value.forEach(item => {
        if (!re.test(item.value)) {
          isOk = false
          callback(new Error('请检查是否是正确的网址'))
        }
      })
      if (isOk) callback()
    }
    const checkRegion = (rule, value, callback) => {
      const re = /[A-Z]{2,}/
      let isOk = true
      value.forEach(item => {
        if (!re.test(item.value)) {
          isOk = false
          callback(new Error('仅支持大写和,'))
        }
      })
      if (isOk) callback()
    }
    const checkNull = (rule, value, callback) => {
      let isOk = true
      console.log(value)
      value.forEach(item => {
        if (item.value === '') {
          isOk = false
          callback(new Error('请检查是否有为空的值'))
        }
      })
      if (isOk) callback()
    }
    return {
      searchData: {
        page: 1,
        type: 15,
        order_created_at: true
      },
      exchangeObj: {
        1: 'is_not_null_video',
        2: 'is_not_null_text',
        3: 'is_not_null_rich_text',
        4: 'is_not_null_image',
        5: 'is_not_null_name_card'
      },
      type: 1,
      columns: [],
      form: {
        type: 3,
        executive_group: '',
        executives: '',
        remark: '',
        send_region: '',
        video: [{ value: '' }]
      },
      resourceType: '',
      disalogRichText: false,
      form_rule: {
        video: [
          { required: true },
          { validator: checkAddress, trigger: 'blur' }
          // { required: true, pattern: /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/, message: '请输入正确视频地址', trigger: 'blur' }
        ],
        text: [
          { required: true },
          { validator: checkNull, trigger: 'blur' }
        ],
        rich_text: [
          { required: true },
          { validator: checkNull, trigger: 'blur' }
        ],
        image: [
          { required: true },
          { validator: checkAddress, trigger: 'blur' }
        ],
        name_card: [
          { required: true },
          { validator: checkAddress, trigger: 'blur' }
        ],
        number: [
          { required: true },
          { validator: checkNum, trigger: 'change' }
        ],
        region: [
          { required: true },
          { validator: checkRegion, trigger: 'blur' }
        ]
      },
      rich_text_index: 0,
      rich_text_form: {
        title: '',
        desc: '',
        avatar: '',
        link: '',
        text: ''
      },
      rich_text_form_rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ],
        avatar: [
          { required: true, message: '请输入头像地址', trigger: 'blur' },
          { required: true, pattern: /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/, message: '请输入正确头像地址', trigger: 'blur' }
        ],
        link: [
          { required: true, message: '请输入地址', trigger: 'blur' }
          // { required: true, pattern: /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/, message: '请输入正确地址', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getColums()
    this.init()
  },
  methods: {
    async getTableData() {
      const form = {}
      form[this.exchangeObj[this.type]] = true
      const res = await api.getTask({ ...this.searchData, ...form })
      if (res && res.code === 0 && res.data) {
        this.tableData = res.data.data
        this.total = res.data.count
      }
    },

    async addTask() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          if (this.validateForm()) return
          const form = {}
          form.type = 15
          form.video = this.computeArr(this.form.video)
          form.text = this.computeArr(this.form.text)
          form.rich_text = this.computeArr(this.form.rich_text)
          form.image = this.computeArr(this.form.image)
          form.name_card = this.computeArr(this.form.name_card)
          form.number = this.form.number === '' ? 0 : Number(this.form.number)
          form.send_region = this.form.send_region === '' ? '' : this.form.send_region
          this.postTask(form)
        }
      })
    },
    validateForm() {
      switch (this.type) {
        case 1:
          if (this.form.video.findIndex(item => item.value === '') !== -1) {
            this.$message.error('视频地址有未填写的')
            return true
          }
          break
        case 2:
          if (this.form.text.findIndex(item => item.value === '') !== -1) {
            this.$message.error('文本有未填写的')
            return true
          }
          break
        case 3:
          if (this.form.rich_text.findIndex(item => item.value === '') !== -1) {
            this.$message.error('富文本有未填写的')
            return true
          }
          break
        case 4:
          if (this.form.image.findIndex(item => item.value === '') !== -1) {
            this.$message.error('图片地址有未填写的')
            return true
          }
          break
        case 5:
          if (this.form.name_card.findIndex(item => item.value === '') !== -1) {
            this.$message.error('名片有未填写的')
            return true
          }
          break
      }
      return false
    },
    changeFormSelect() {
      this.form.video = [{ value: '' }]
      this.form.text = [{ value: '' }]
      this.form.rich_text = [{ value: '' }]
      this.form.image = [{ value: '' }]
      this.form.name_card = [{ value: '' }]
    },
    setRichText(index) {
      this.rich_text_index = index
      if (this.form.rich_text[this.rich_text_index].value !== '') {
        this.rich_text_form = JSON.parse(this.form.rich_text[this.rich_text_index].value)
      }
      this.disalogRichText = true
    },
    beforeCreate(row) {
      if (row.video) this.type = 1
      if (row.text) this.type = 2
      if (row.rich_text) this.type = 3
      if (row.image) this.type = 4
      if (row.name_card) this.type = 5
      this.create(row)
    },
    changeSelect(value) {
      this.getColums(value)
      this.init()
    },
    getColums(value = 1) {
      this.columns = []
      columns.forEach(item => {
        if (!item.type.includes(2)) {
          return
        }
        if (item.role) {
          if (!item.role.includes(this.role)) {
            return
          }
        }
        if (item.exchange != null && item.exchange !== value) {
          return
        }
        this.columns.push(item)
      })
    },
    handleAddRichText() {
      this.$refs['rich_text_form'].validate(async valid => {
        if (valid) {
          this.form.rich_text[this.rich_text_index].value = JSON.stringify(this.rich_text_form)
          this.rich_text_form = {
            title: '',
            desc: '',
            avatar: '',
            link: '',
            text: ''
          }
          this.disalogRichText = false
        }
      })
    },
    getResouce() {
      const type = {
        1: 3,
        2: 1,
        3: 2,
        4: 5,
        5: 6,
        6: 4
      }
      this.resourceType = type[this.type]
      this.dialogResource = true
    },
    getResource(data) {
      const value = []
      data.data.forEach(item => {
        value.push({
          value: item
        })
      })
      switch (this.type) {
        case 1:
          this.form.video = value
          break
        case 2:
          this.form.text = value
          break
        case 3:
          this.form.rich_text = value
          break
        case 4:
          this.form.image = value
          break
        case 5:
          this.form.name_card = value
          break
      }
      this.form.resourceName = data.name
    },
    closeTag() {
      this.form.resourceName = ''
      this.form.video = [{ value: '' }]
      this.form.text = [{ value: '' }]
      this.form.rich_text = [{ value: '' }]
      this.form.image = [{ value: '' }]
      this.form.name_card = [{ value: '' }]
    }
  }
}
</script>

<style lang="scss">
</style>
