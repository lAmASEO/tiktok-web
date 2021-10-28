<template>
  <div>
    <div>
      <a-input-search placeholder="请输入链接" size="large" @search="onSearch">
        <a-button slot="enterButton">生成</a-button>
      </a-input-search>
    </div>
    <div v-show="visible">
      <a-collapse default-active-key="1">
        <a-collapse-panel key="1">
          <p>{{ text }}</p>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
</template>

<script>
import {getGitIO} from "@/api";

export default {
  data() {
    return {
      visible: false,
      text: "获取出错，请稍后重试",
    };
  },

  methods: {
    onSearch: function (value) {
      if (value === "") {
        return
      }
      let that = this;
      getGitIO(value).then(function (response) {
        return response.json();
      }).then(function (result) {
        if (result.code === 0 && result.data.url !== "") {
          that.text = result.data.url;
        }
        that.visible = true;
      }).catch(error => {
          that.visible = true;
        }
      );
    },
  }
};
</script>

<style lang="scss">
</style>
