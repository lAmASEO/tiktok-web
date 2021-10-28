
<template>
  <div class="tag">
    <div class="tagTitle">
      <el-tag v-for="tag in tags" :key="tag.name" class="eleTag" closable @close="BackOff(tag)">
        {{ tag.name }}
      </el-tag>
    </div>

    <div class="tagMain">
      <div class="tagMain_l">
        <p>属性筛选</p>
      </div>
      <div class="tagMain_r">
        <p>
          <span v-for="(item, index) in list" :key="index" @click="choice(item)">{{ item.name }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/index'

export default {
  data() {
    return {
      tags: [],
      list: [],
      allList: [],
      parent: '',
      id: ''
    }
  },
  computed: {
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.tags = []
      const res = await api.getTiktokUserTag({ page_size: 300 })
      if (res && res.code === 0 && res.data != null) {
        this.allList = res.data.data
        this.list = []
        this.allList.forEach((e) => {
          if (e.parent_id === 0) {
            this.list.push(e)
          }
        })
      }
    },
    choice(row) {
      this.$emit('getTagId', row.id)
      this.id = row.id
      this.expose(row.id)
      this.parent = row
      this.list = []
      this.tags.push(this.parent)
      this.allList.forEach((e) => {
        if (e.parent_id === this.parent.id) {
          this.list.push(e)
        }
      })
    },
    BackOff(row) {
      if (row.parent_id === 0) {
        this.init()
        this.$emit('getTagId', '')
      } else {
        this.tags.splice(1, 1)
        this.$emit('getTagId', this.tags[0].id)
        this.allList.forEach((e) => {
          if (e.parent_id === row.parent_id) {
            this.list.push(e)
          }
        })
      }
    },
    // 暴露出去的id 或者某个参数
    expose(id) {
      this.$emit('getTagId', id)
    }
  }
}
</script>

<style lang="scss" scoped>
.tag {
  background: #fff;
  // width: 98%;
  height: 80px;
  margin: 20px 0% 20px 0%;
  border: 1px solid #eee;
  .tagTitle {
    width: 100%;
    height: 40px;
  }
  .eleTag {
    margin: 5px;
    height: 30px;
  }
  .tagMain {
    width: 100%;
    // border-top: 1px solid #999
    padding-bottom: 5px;
    // border-bottom: 10px solid #f2f2f2
    p {
      margin: 0px;
    }
    .tagMain_l {
      width: 10%;
      display: inline-block;
      p {
        text-align: left;
        // padding-left: 10px
        box-sizing: border-box;
        color: #000;
        font-weight: 700;
        font-size: 16px;
        text-indent: 20px;
      }
    }
    .tagMain_r {
      display: inline-block;
      width: 90%;
      span {
        display: inline-block;
        margin: 0px 10px;
        box-sizing: border-box;
        font-size: 14px;
        color: #999;
        cursor: pointer;
        // background: brown
      }
    }
  }
}
</style>
