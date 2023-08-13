<template>
  <!-- 网络加速 -->
  <div class="netWorkAcc">
    <div class="open">
      <span>加速网关</span>
      <el-switch v-model="value" active-color="#3678C8" inactive-color="#D1D7E0"></el-switch>
    </div>
    <div class="roll">
      <span>加速用途</span>
      <el-radio class="radio" v-model="radio" label="1">出境</el-radio>
      <el-radio class="radio" v-model="radio" label="2">自定义</el-radio>
    </div>
    <div class="alt">
      <p>
        <span>加速用途</span>读取所属Transit gateway
      </p>
    </div>
    <div class="submit">
      <button>保存</button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: "",
      radio: "1"
    };
  },
  methods: {}
};
</script>
<style scoped lang="scss">
.netWorkAcc {
  padding: 41px 0 0 96px;
}
.open {
  span {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    padding-right: 20px;
  }
}
.roll {
  padding: 30px 0;
  span {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    padding-right: 20px;
  }
  .radio {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
}
.alt {
  font-size: 14px;
  font-family: arial, sans-serif;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  span {
    padding-right: 20px;
  }
}
.submit {
  padding: 71px 0 0 75px;
  button {
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    border: 0;
    outline: none;
    cursor: pointer;
  }
  button:hover {
    background: rgba(96, 149, 214, 1);
  }
}
</style>
<style lang="scss">
.netWorkAcc {
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #3678c8;
    background: #3678c8;
  }
  .el-radio__input.is-checked + .el-radio__label {
    color: rgba(51, 51, 51, 1);
  }
}
</style>