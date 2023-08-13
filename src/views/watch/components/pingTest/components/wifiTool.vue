<template>
  <!-- WifiTool -->
  <div class="WifiTool">
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      stripe
      size="small"
      fit
      tooltip-effect="dark"
    >
      <el-table-column
        prop="name"
        label="Wi-Fi Features"
        align="center"
        show-overflow-tooltip
        :resizable="false"
      ></el-table-column>
      <el-table-column
        prop="data"
        label="Status"
        align="center"
        show-overflow-tooltip
        :resizable="false"
      ></el-table-column>
    </el-table>
  </div>
</template>
<script>
import {
  GetMqttWifiInfo
} from "@/services";
export default {
  data() {
    return {
      deviceId:JSON.parse(this.$route.query.devData).deviceId,
      tableData: [],
      multipleSelection: [],
      page: 1,
      pageSize: 10,
      allNum: 0,
      isShow: false,
      eisShow: false,
      name: "",
      data: "",
      names: {
          name: 'SSID',
          wtype: "Type",
          channel: "Channel",
          txpower: "Txpower",
        }
    };
  },
  components: {
  },
  methods: {
    //数据初始化
    // Data initialization
    // Data initialization
    dataInit(params) {
      GetMqttWifiInfo(params).then(res => {
        if (res.code === 10000) {
          if(res.result.enable===1){
            const nameKey = Object.keys(res.result);
            const value = Object.values(res.result);
            var newData= [];
            for(let i=0 ; i < nameKey.length; i++){
              if(nameKey[i]!=null && this.names[nameKey[i]] != null){
                var data={
                  name: this.names[nameKey[i]],
                  data: value[i]
                }
                newData.push(data);
              }
            }
            this.tableData = newData;
          }
        }
      });
    }
  },
  created() {
    let params = {
      devId: this.deviceId,
    };
    this.dataInit(params);
  }
};
</script>
<style scoped lang="scss">
.WifiTool {
  width: 100%;
  height: calc(100% - 54px);
  padding: 20px;
  overflow: auto;
  border:1px solid rgba(209,215,224,1);
}
.WifiTool::-webkit-scrollbar {
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