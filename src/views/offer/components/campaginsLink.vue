<template>
  <a-form-model :model="form" :rules="form_rule" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-model-item label="Creative" prop="c">
      <a-select v-model="form.c">
        <a-select-option v-for="(itme, index) in detail.creatives" :key="index" :value="detail.creatives[index].creative_id">
          ({{ detail.creatives[index].creative_id }}){{ detail.creatives[index].creative_name }}
        </a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item label="Domain">
      <a-select v-model="form.d" :disabled="true" />
    </a-form-model-item>
    <a-form-model-item label="Media Type" prop="mt">
      <a-select v-model="form.mt">
        <a-select-option v-for="(item, index) in mediaType" :key="index" :value="item.value">{{ item.label }}</a-select-option>
      </a-select>
    </a-form-model-item>
    <!-- <a-form-model-item label="S1 SubAffiliate ID (Non-unique values)" :label-col="{span: 9 }" :wrapper-col="{span: 15}"> -->
    <a-tooltip>
      <template slot="title">
        S1 SubAffiliate ID (Non-unique values)
      </template>
      <a-form-model-item label="S1 ID">
        <a-input v-model="form.s1" />
      </a-form-model-item>
    </a-tooltip>
    <a-form-model-item label="SUB ID2">
      <a-input v-model="form.s2" />
    </a-form-model-item>
    <a-form-model-item label="SUB ID3">
      <a-input v-model="form.s3" />
    </a-form-model-item>
    <a-form-model-item label="SUB ID4">
      <a-input v-model="form.s4" />
    </a-form-model-item>
    <!-- <a-form-model-item label="SUB ID5">
      <a-input v-model="form.s5" />
    </a-form-model-item> -->
    <a-form-model-item label="UDD">
      <a-input v-model="form.udid" />
    </a-form-model-item>
    <a-form-model-item label="URL">
      <a-input v-model="url" type="textarea" disabled />
    </a-form-model-item>
  </a-form-model>
</template>
<script>
import * as api from '@/api/index'
export default {
  props: {
    detail: {
      type: Object,
      // eslint-disable-next-line space-before-function-paren
      default: function () {
        return {}
      }
    }
  },
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      userName: window.sessionStorage.getItem('userName'),
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
      affiliate_id: '',
      form: {
        c: '',
        d: '',
        mt: '',
        s1: '',
        s2: '',
        s3: '',
        s4: '',
        s5: '',
        udid: ''
      },
      form_rule: {
        c: [
          { required: true, message: '', trigger: 'blur' }
        ],
        mt: [
          { required: true, message: '', trigger: 'blur' }
        ]

      },
      url: '',
      mediaType: [{
        label: 'NetWork',
        value: 2
      }, {
        label: 'Email',
        value: 3
      }, {
        label: 'PPC/Search',
        value: 4
      }, {
        label: 'SEO/SEM',
        value: 5
      }, {
        label: 'Banner/Display',
        value: 7
      }, {
        label: 'Contextaul',
        value: 8
      }, {
        label: 'Incentivized',
        value: 12
      }, {
        label: 'Other',
        value: 13
      }, {
        label: 'Adware',
        value: 15
      }, {
        label: 'Social Media(Facebook)',
        value: 16
      }, {
        label: 'Pop/Redirect',
        value: 18
      }, {
        label: 'Social Media(other an Facebook)',
        value: 19
      }, {
        label: 'Review Site/Blog',
        value: 20
      }, {
        label: 'Push',
        value: 21
      }, {
        label: 'Messengers',
        value: 22
      }, {
        label: 'SMS',
        value: 23
      }, {
        label: 'Native',
        value: 24
      }, {
        label: 'Inapp',
        value: 25
      }, {
        label: 'TikTok',
        value: 26
      }, {
        label: 'UAC',
        value: 27
      }, {
        label: 'Snapchat',
        value: 28
      }, {
        label: 'Instagram',
        value: 29
      }, {
        label: 'Youtube',
        value: 30
      }]
    }
  },
  watch: {
    detail: {
      handler(newValue, oldValue) {
        this.init()
      },
      deep: true
    },
    form: {
      handler(newValue, oldValue) {
        if (newValue.c === '' || newValue.mt === '') {
          this.url = ''
          return
        }
        let str = this.form.d
        str += `?a=${this.affiliate_id}&c=${newValue.c}&mt=${newValue.mt}`
        if (newValue.s1 !== '') {
          str += `&s1=${newValue.s1}`
        }
        if (newValue.s2 !== '') {
          str += `&s2=${newValue.s2}`
        }
        if (newValue.s3 !== '') {
          str += `&s3=${newValue.s3}`
        }
        if (newValue.s4 !== '') {
          str += `&s4=${newValue.s4}`
        }
        if (newValue.s5 !== '') {
          str += `&s5=${newValue.s5}`
        }
        if (newValue.udid !== '') {
          str += `&udid=${newValue.udid}`
        }
        this.url = str
      },
      deep: true
    }
  },
  mounted() {
    this.init()
    console.log(this.detail.creatives)
  },
  methods: {
    async init() {
      this.form = {
        c: '',
        d: '',
        mt: '',
        s1: '',
        s2: '',
        s3: '',
        s4: '',
        s5: '',
        udid: ''
      }
      this.form.s5 = this.userName
      const res = await api.getAdConfig({ user_id: this.userInfo.data.i })
      this.affiliate_id = res.data.data[0].affiliate_id
      if (this.detail.default_tracking_link) {
        this.form.d = this.detail.default_tracking_link.split('?')[0]
      }
    },
    onSubmit() {
      console.log('submit!', this.form)
    },
    copy() {
      if (this.url !== '') {
        this.$copyText(this.url)
        this.$emit('cancel')
      } else {
        this.$message.error('请先填必填项')
      }
    }
  }
}
</script>
