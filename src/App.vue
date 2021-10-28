<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
.page {
  margin: 30px 0;
  text-align: center;
}
.short-input {
  input, textarea {
    width: 220px;
  }
  button {
    margin-left: 10px;
  }
}
.table-box {
  margin-top: 30px;
}
.ant-popover-buttons {
  text-align: center;
}
</style>
