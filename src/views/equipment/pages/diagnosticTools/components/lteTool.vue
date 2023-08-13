<template>
  <!-- lteTool -->
  <div class="LteTool">
    <div class="result">
      {{$t('vsr1100.diagnosticTools.lteStatus')}} : {{data}}
      </div>
    </div>
  </div>
</template>
<script>
import { networkdiagnosisGetLte } from "@/services";
export default {
  data() {
    return {
      devData: JSON.parse(this.$route.query.devData),
      deviceId: JSON.parse(this.$route.query.devData).deviceId,
      tableData: [],
      multipleSelection: [],
      name: "",
      data: "",
      names: {},
    };
  },
  components: {},
  methods: {
    //数据初始化
    // Data initialization
    // Data initialization
    dataInit(params) {
      networkdiagnosisGetLte({ devSerNum: this.devData.vsrSeries}).then(
        (res) => {
          if (res.code === 10000) {
            this.data = res.result;
          }
        }
      );
    },
  },
  created() {
    let params = {
      devId: this.deviceId,
    };
    this.dataInit(params);
  },
};
</script>
<style scoped lang="scss">
.LteTool {
  width: 100%;
  height: calc(100% - 54px);
  padding: 20px;
  overflow: auto;
  border: 1px solid rgba(209, 215, 224, 1);
}
.LteTool::-webkit-scrollbar {
  width: 4px;
}
.submit {
  zoom: 1;
  padding-bottom: 20px;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
}
.btns {
  float: right;
  .save {
    width: 90px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border: 0;
    border-radius: 7px;
    color: #fff;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    outline: none;
    cursor: pointer;
  }
  .save:hover {
    background: #6095d6;
  }
  .add,
  .close {
    width: 100px;
    height: 34px;
    font-family: arial, sans-serif;
    font-weight: 400;
    border: 0;
    outline: none;
    cursor: pointer;
    margin-left: 14px;
    img {
      width: 14px;
      height: 14px;
      position: relative;
      top: 1px;
    }
  }
  .add {
    background: #3678c8;
    color: #fff;
  }
  .add:hover {
    background: #6095d6;
  }
  .close {
    background: rgba(239, 239, 239, 1);
    color: #333333;
    border: 1px solid rgba(209, 215, 224, 1);
  }
}
</style>