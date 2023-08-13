<template>
  <div class="portDetail">
    <div class="top">
      <span>端口详情</span>
      <img @click="$parent.isShow=false" src="@/assets/icon_close.png" alt />
    </div>
    <div class="main">
      <ul>
        <li>
          <span>端口名称</span>
          <span>{{portName}}</span>
        </li>
        <li>
          <span>端口描述</span>
          <span>{{portDes}}</span>
        </li>
        <li>
          <span>vlan-id</span>
          <span>{{vlanid}}</span>
        </li>
        <li>
          <span>物理端口</span>
          <span>{{phyPort}}</span>
        </li>
        <li>
          <span>租户路由域</span>
          <span class="tenant">{{ten}}</span>
          <el-checkbox v-model="checked" disabled>骨干端口</el-checkbox>
        </li>
        <li>
          <span>ipv4地址</span>
          <span>{{ipv4}}</span>
        </li>
        <li>
          <span>ipv6地址</span>
          <span>{{ipv6}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { logicalPortExtraGet } from "@/services";
export default {
  data() {
    return {
      checked: false,
      portName: "",
      portDes: "",
      vlanid: "",
      phyPort: "",
      ten: "",
      ipv4: "",
      ipv6: ""
    };
  },
  created() {
    let params = {
      logicalPortId: this.data
    };
    logicalPortExtraGet(params).then(res => {
      if (res.code === 10000) {
        this.portName = res.result.name;
        this.portDes = res.result.description;
        this.vlanid = res.result.vlanId;
        this.phyPort = res.result.portNames;
        this.ten = res.result.vrfName;
        this.ipv4 = res.result.ipv4;
        this.ipv6 = res.result.ipv6;
        this.checked = res.result.backboneEnabled;
      }
    });
  },
  props: {
    data: {
      type: String
    }
  }
};
</script>
<style lang="scss" scoped>
.portDetail {
  position: absolute;
  width: 462px;
  height: 314px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  border: 1px solid rgba(216, 221, 228, 1);
  z-index: 1000;
  top: 48px;
  left: 50%;
  transform: translateX(-50%);
  .top {
    height: 48px;
    border-bottom: 1px solid #d1d7e0;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    img {
      width: 14px;
      height: 14px;
    }
  }
  .main {
    padding: 16px 27px 16px 20px;
    ul {
      li {
        margin-bottom: 12px;
        span:nth-child(1) {
          display: inline-block;
          width: 70px;
          text-align: end;
          margin-right: 12px;
          font-size: 14px;
          font-family: arial, sans-serif;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
        }
        span:nth-child(2) {
          font-size: 14px;
          font-family: arial, sans-serif;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
        }
      }
    }
    .tenant {
      margin-right: 20px;
    }
  }
}
</style>
<style lang="scss">
.portDetail {
  .el-checkbox__label {
    padding-left: 8px;
  }
}
</style>