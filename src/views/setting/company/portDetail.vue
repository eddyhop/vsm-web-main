<template>
  <div class="portDeatil">
    <h4 class="title">
      {{$t('TenServiceSet.portDetails')}}
      <span @click.prevent="close"></span>
    </h4>
    <ul class="list">
      <li>
        <span class="listTit">{{$t('TenServiceSet.portName')}}</span>
        <span>{{name}}</span>
      </li>
      <li>
        <span class="listTit">{{$t('TenServiceSet.portDescription')}}</span>
        <span>{{describe}}</span>
      </li>
      <li>
        <span class="listTit">vlan-id</span>
        <span>{{vlanId}}</span>
      </li>
      <li>
        <span class="listTit">{{$t('TenServiceSet.physicalPort')}}</span>
        <span>{{portName}}</span>
      </li>
      <li>
        <span class="listTit">{{$t('TenServiceSet.tenRouDomain')}}</span>
        <span>
          <b>{{vrfName}}</b>
          <el-checkbox v-model="backboneEnabled" disabled>{{$t('TenServiceSet.backbonePorts')}}</el-checkbox>
        </span>
      </li>
      <li>
        <span class="listTit">{{$t('TenServiceSet.IPv4')}}</span>
        <span>{{ipv4}}</span>
      </li>
      <li>
        <span class="listTit">{{$t('TenServiceSet.IPv6')}}</span>
        <span class="ipv6Der">{{ipv6}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
import { tenantServiceGetLogicaDetails } from "@/services";
export default {
  props: {},
  components: {},
  data() {
    return {
      //逻辑端口
      // The logical port
      name: "",
      //端口描述
      // Port description
      describe: "",
      vlanId: "",
      //物理端口
      // The physical port
      portName: "",
      //租户路由域
      // Tenant routing domain
      vrfName: "",
      //是否为骨干端口
      // Is it a backbone port
      backboneEnabled:null,
      ipv4: "",
      ipv6: ""
    };
  },
  computed: {},
  methods: {
    dataInit(row) {
      tenantServiceGetLogicaDetails({ logId: row }).then(res => {
        if (res.code === 10000) {
          this.name = res.result.name;
          this.backboneEnabled = res.result.backboneEnabled
          this.describe = res.result.description;
          this.vlanId = res.result.vlanId;
          this.portName = res.result.portId;
          this.vrfName = res.result.vrfName;
          this.ipv4 = res.result.ipv4;
          this.ipv6 = res.result.ipv6;
        }
      });
    },
    close() {
      this.$parent.isShow = false;
    }
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="scss">
.portDeatil {
  position: absolute;
  top: 48px;
  left: 50%;
  width: 462px;
  min-height: 314px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  border: 1px solid rgba(216, 221, 228, 1);
  margin-left: -231px;
  z-index: 100;
}
.title {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-family: arial, sans-serif;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  width: 100%;
  border-bottom: 1px solid rgba(231, 231, 231, 1);
  padding: 15px;
  span {
    display: inline-block;
    width: 14px;
    height: 14px;
    background-image: url("../../../assets/icon_close.png");
    background-size: 14px 14px;
  }
}
.list {
  width: 100%;
  padding: 16px 27px 16px 20px;
  li {
    padding-bottom: 12px;
    width: 100%;
    display: flex;
    font-family: arial, sans-serif;
    .listTit {
      width: 70px;
      margin-right: 12px;
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
    }
    b {
      font-weight: 400;
      padding-right: 20px;
    }
    .ipv6Der {
      width: 333px;
      text-align: left;
    }
  }
}
</style>