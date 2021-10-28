<template>
  <el-pagination
    v-if="total"
    background
    :layout="layout"
    oncontextmenu="return false"
    onselectstart="return false"
    :total="total"
    :page-size="size"
    :current-page="page"
    :page-sizes="[100, 200, 300, 400]"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
  />
</template>

<script>
export default {
  components: {
  },
  props: {
    total: {
      type: Number,
      default: 0
    },
    size: { // 默认每页条数 20
      type: Number,
      default: 20
    },
    layout: {
      type: String,
      default: 'pager, jumper, total'
    }
  },
  data() {
    return {
      page: 1
    }
  },
  computed: {
  },
  methods: {
    /**
     * [handleCurrentChange 切换页码]
     * @param  {[Int]} p [页码]
     * @return {[]} []
     */
    handleCurrentChange(p) {
      this.$emit('handlePage', p)
    },
    handleSizeChange(s) {
      this.$emit('handleSizeChange', s)
    }
  }
}
</script>
