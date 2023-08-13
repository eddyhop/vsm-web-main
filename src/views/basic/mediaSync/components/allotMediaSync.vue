<template>
  <!--  -->
  <div class="allotMediaSync">
    <div class="content">
      <h4 class="title">
        <span>{{$t("DeviceMan.DistributionOfTheTenant")}}</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="formList">
        <ul class="devList">
          <li>
            <span :class="lang=='en'?'optEn':''">{{$t('DeviceMan.devNumber')}}</span>{{deviceSerialNumber}}
          </li>
          <li>
            <span :class="lang=='en'?'optEn':''">{{$t("DeviceMan.EquipmentType")}}</span>{{deviceType}}
          </li>
          <li>
            <span :class="lang=='en'?'optEn':''">{{$t("DeviceMan.deviceType")}}</span>{{deviceLocation}}
          </li>
        </ul>
        <div class="tenement">
          <span>{{$t('DeviceMan.tenant')}}</span>
          <el-select filterable v-model="tenant">
            <el-option
                v-for="(item) in tenantList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
          </el-select>
        </div>
      </div>
      <div class="submit">
        <button class="save" v-debounce.prevent="submitForm">{{$t('vsr1000.save')}}</button>
        <button class="cancel" @click.prevent="close">{{$t('vsr1000.cancel')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { connectTenant } from '@/services'
export default {
  data() {
    return {
      lang:sessionStorage.getItem("lang") || "en",
      tenantList: [],
      tenant: "",
      tenantName: "",
      deviceId: "",
      deviceSerialNumber: "",//设备序列号 Device serial number
                             // Device Serial Number
      deviceType: "", //设备型号 unit type 
                      // Equipment model Unit Type
      deviceLocation:"",//设备类型 device type
                        // Device Type device Type
    };
  },
  methods: {
    submitForm(){
      let params = {
        tenantId: this.tenant,
        deviceId: this.deviceId,
      }
      if(this.tenant==""){
        this.$message({
          type: "warning",
          message: this.$t('Role.hint7')
        });
      }else{
        connectTenant(params).then(res=>{
          if (res.code == 10000) {
            this.$message({
              type: "success",
              message: this.$t('Configuration.msg1')
            });
            this.close()
            this.$parent.getList();
          } else {
            this.$message({
              type: "warning",
              message: this.$t('Configuration.msg2')
            });
          }
        })  
      }
    },
    close(){
      this.$parent.allocation = false
      this.tenant = ""
      this.tenantName = ""
      this.deviceId = ""
      this.deviceSerialNumber = ""
      this.deviceType = ""
      this.deviceLocation = ""
    }
  }
};
</script>
<style scoped lang="scss">
.allotMediaSync {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.2);
  z-index: 100;
}
.content {
  width: 462px;
  height: 306px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -153px;
  margin-left: -231px;
  .title {
    width: 100%;
    height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid rgba(231, 231, 231, 1);
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    i {
      width: 14px;
      height: 14px;
      background: url("../../../../assets/icon_close.png") no-repeat;
      background-size: cover;
      cursor: pointer;
    }
  }
}
.formList {
  padding: 20px 0 0 43px;
  font-size: 14px;
  font-family: arial, sans-serif;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
}
.devList {
  padding-bottom: 6px;
  li {
    padding-bottom: 14px;
    span {
      display: inline-block;
      width: 70px;
      margin-right: 10px;
      text-align: right;
      margin-right: 10px;
      font-family: arial, sans-serif;
    }
    .optEn{
      width: 150px;
      text-align: left;
    }
  }
}
.tenement {
  font-size: 14px;
  font-family: arial, sans-serif;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  span{
    margin-right: 10px;
  }
}
.submit {
  width: 100%;
  text-align: center;
  padding-top: 30px;
  .save {
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    outline: none;
    border: 0;
    cursor: pointer;
    margin-left: 18px;
  }
  .cancel {
    width: 70px;
    height: 34px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    border: 1px solid rgba(209, 215, 224, 1);
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    margin-left: 18px;
  }
  .save:hover {
    background: #6095d6;
  }
}
</style>
<style lang="scss">
  .allotMediaSync{
    .el-input , .el-select{
    width: 322px;
    height: 34px;
    .el-input__inner {
      height: 100%;
      border-radius: 7px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
  }
</style>