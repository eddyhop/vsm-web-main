<template>
  <div class="contents VpnPop">
    <div :class="`inner devList ${lang=='en'?'innerEn':''}`">
      <div class="top">
        <h2>{{$t('Vpn.mobilePop')}}</h2>
        <i @click="$parent.isShow2=false">
          <img src="../../../assets/icon_close.png" alt />
        </i>
      </div>
      <div class="main">
        <div :class="`mainTop ${lang == 'en' ? 'mainTopen' : '' }`">
          <div class="right">
            <span>{{$t('Vpn.devName')}}</span>
            <span>{{devName}}</span>
          </div>
          <div class="left">
            <span>{{$t('Vpn.devIndex')}}</span>
            <span>{{devSerial}}</span>
          </div>
        </div>
        <div class="mainMiddle mainMiddleVpn">
          <el-form
            :inline="true"
            class="demo-form-inline form"
            :hide-required-asterisk="true"
            :rules="rules"
            :model="form"
            ref="form"
          >
            <el-form-item :label="$t('Vpn.place')" prop="pop" :label-width="`${lang=='en'?'155px':'63px'}`">
              <el-input v-model="form.pop" :placeholder="$t('Vpn.segment')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('Vpn.mask')" prop="mask">
              <el-input v-model="form.mask" :placeholder="$t('Vpn.hint9')"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="mainFooter">
          <div class="left">
            <el-form
              :inline="true"
              class="demo-form-inline form"
              :hide-required-asterisk="true"
              :rules="rules1"
              :model="form1"
              ref="form1"
            >
              <el-form-item :label="$t('Vpn.distribution')" prop="issued">
                <el-input v-model="form1.issued" placeholder></el-input>
              </el-form-item>
              <el-form-item>
                <span class="add" @click="addData2"></span>
              </el-form-item>
              <div v-for="(item,index) in form1.data" :key="index" class="item">
                <el-form-item
                  :label="$t('Vpn.distribution')"
                  :prop="'data.'+index+'.issued'"
                  :rules="[
      { required: true, message: $t('Vpn.empty'), trigger: 'blur' },
      { pattern:/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]|3[0-2]?)$/, message: $t('Vpn.hint5')}
    ]"
                >
                  <el-input v-model="item.issued" placeholder></el-input>
                </el-form-item>
                <el-form-item>
                  <span class="del" @click="delData2(index)"></span>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div class="right"></div>
          <el-form
            :inline="true"
            class="demo-form-inline form"
            :model="form2"
            :hide-required-asterisk="true"
            :rules="rules2"
            ref="form2"
          >
            <el-form-item label="DNS" prop="dns">
              <el-input v-model="form2.dns" placeholder></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="footer">
        <button class="save" v-debounce="save">{{$t('Vpn.save')}}</button>
        <button class="cancel" @click="$parent.isShow2=false">{{$t('Vpn.cancel')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { saveVpnPop, getVpnList } from "@/services/index.js";
export default {
  data() {
    return {
      lang:"",
      devName: "", //设备名称
                   // Device name
      devSerial: "", //设备序列号
                     // Device serial number
      form: {
        pop: "",
        mask: "",
      },
      form1: {
        issued: "",
        data: []
      },
      form2: {
        dns: ""
      },
      params:{},
      rules: {
        pop: [
          { required: true, message: this.$t("Vpn.empty"), trigger: "blur" },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("Vpn.hint5")
          }
        ],
        mask: [
          { required: true, message: this.$t("Vpn.empty"), trigger: "blur" },
          {
            pattern: /^(?:[1-9]|([1-2][0-9])?|3[0-2])$/,
            message: this.$t("Vpn.hint8")
          }
        ]
      },
      rules1: {
        issued: [
          { required: true, message: this.$t("Vpn.empty"), trigger: "blur" },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]|3[0-2]?)$/,
            message: this.$t("Vpn.hint5")
          }
        ]
      },
      rules2: {
        dns: [
          // { required: true, message: this.$t("Vpn.empty"), trigger: "blur" },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("Vpn.hint5")
          }
        ]
      }
    };
  },
  props: {
    devId: {
      type: String
    }
  },
  created() {
    this.lang = sessionStorage.getItem("lang");
    this.tenantId=JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '': JSON.parse(sessionStorage.getItem("userData")).tenantId || "";
    this.dataInit();
  },
  methods: {
    // 增加data2数据
    // Add datA2 data
    addData2() {
      this.form1.data.push({ issued: "" });
    },
    // 删除data2数据
    // Delete datA2 data
    delData2(index) {
      this.form1.data.splice(index, 1);
    },
    // 保存
    // save
    save() {
      let p1 = new Promise((resolve, reject) => {
        this.$refs["form"].validate(valid => {
          if (valid) {
            resolve();
          }
        });
      });
      let p2 = new Promise((resolve, reject) => {
        this.$refs["form1"].validate(valid => {
          if (valid) {
            resolve();
          }
        });
      });
      let p3 = new Promise((resolve, reject) => {
        this.$refs["form2"].validate(valid => {
          if (valid) {
            resolve();
          }
        });
      });
      Promise.all([p1, p2, p3]).then(
        () => {
          let issueRouteLists = [];
          this.form1.data.map(item => {
            issueRouteLists.push(item.issued);
          });
          issueRouteLists.unshift(this.form1.issued);
          console.log(this.form2.dns,"123123")
          this.params.dns_value=this.form2.dns;
          this.params.issueRouteList=issueRouteLists;
          this.params.maxMask=this.form.mask;
          this.params.netSegment=this.form.pop;
          saveVpnPop(this.params).then(res => {
               if(res.code===10000){
                 this.$message.success(this.$t('Vpn.hint2'));
                 this.$parent.isShow2=false;
               }else{
                 this.$message.error(this.$t('Vpn.hint3'));
                 this.$parent.isShow2=false;
               }
          });
        },
        () => {
        }
      );
    },
    // 获取页面初始数据
    // Gets the initial page data
    dataInit() {
      let params = {
        page: 0,
        pageSize: 0,
        serviceId: this.devId,
        tenantId: this.tenantId,
        vrfId: ""
      };
      getVpnList(params).then(res=>{
        if(res.code===10000){
          let cur=res.result;
          this.devName=cur.deviceName;
          this.devSerial=cur.deviceSerial;
          this.form.pop=cur.netSegment;
          this.form.mask=cur.maxMask;
          this.form2.dns=cur.dns_value;
          this.form1.issued=cur.issueRouteList[0];
          cur.issueRouteList.slice(1).map(item=>{
            this.form1.data.push({ issued: item })
          })
          this.params=cur;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.contents {
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(32, 42, 59, 0.5);
  top: 0;
  left: 0;
  z-index: 10;
  .inner {
    width: 700px;
    height: 447px;
    padding-bottom: 10px;
    overflow: auto;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .top {
      display: flex;
      height: 48px;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      border-bottom: 1px solid #d1d7e0;
      margin-bottom: 30px;
      h2 {
        font-size: 14px;
        font-family: arial, sans-serif;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
      i {
        img {
          width: 14px;
          height: 14px;
        }
      }
    }
    .main {
      .mainTop {
        display: flex;
        padding-left: 50px;
        color: #333333;
        font-family: arial, sans-serif;
        font-weight: 400;
        margin-bottom: 30px;
        .right {
          margin-right: 80px;
          span:nth-child(1) {
            margin-right: 12px;
          }
        }
        .left {
          span:nth-child(1) {
            margin-right: 12px;
          }
        }
      }
      .mainTopen{
        padding-left: 110px;
      }
      .mainMiddle {
        width: 100%;
        min-height: 62px;
        // border: 1px solid #d1d7e0;
        margin: 0 auto;
        padding: 14px 0 0px 50px;
        margin-bottom: 23px;
        display: flex;
        justify-content: space-between;
        .form {
          width: 100%;
          margin-bottom: 14px;
          display: flex;
          .add {
            display: block;
            width: 34px;
            height: 34px;
            background: rgba(255, 255, 255, 1);
            border-radius: 7px;
            border: 1px solid rgba(209, 215, 224, 1);
            background: url("../../../assets/newPage/deviceconfiguration_icon_arp_add@2x.png")
              no-repeat center;
            background-size: 16px 16px;
          }
          .del {
            display: block;
            width: 34px;
            height: 34px;
            background: rgba(255, 255, 255, 1);
            border-radius: 7px;
            border: 1px solid rgba(209, 215, 224, 1);
            background: url("../../../assets/newPage/deviceconfiguration_icon_arp_delete@2x.png")
              no-repeat center;
            background-size: 16px 16px;
          }
        }
      }
      .mainFooter {
        padding-left: 50px;
        display: flex;
        .left {
          .form {
            margin-bottom: 14px;
          }
          .add {
            display: block;
            width: 34px;
            height: 34px;
            background: rgba(255, 255, 255, 1);
            border-radius: 7px;
            border: 1px solid rgba(209, 215, 224, 1);
            background: url("../../../assets/newPage/deviceconfiguration_icon_arp_add@2x.png")
              no-repeat center;
            background-size: 16px 16px;
            margin-left: -10px;
          }
          .del {
            display: block;
            width: 34px;
            height: 34px;
            background: rgba(255, 255, 255, 1);
            border-radius: 7px;
            border: 1px solid rgba(209, 215, 224, 1);
            background: url("../../../assets/newPage/deviceconfiguration_icon_arp_delete@2x.png")
              no-repeat center;
            background-size: 16px 16px;
            margin-left: -10px;
          }
        }
        .right {
          margin-left: 37px;
        }
      }
    }
    .footer {
      margin-top: 135px;
      text-align: center;
      .save {
        margin-right: 18px;
        width: 100px;
        height: 34px;
        background: rgba(54, 120, 200, 1);
        border-radius: 7px;
        font-size: 14px;
        font-family: arial, sans-serif;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        border: none;
        outline: none;
        &:hover {
          background: #6095d6;
        }
      }
      .cancel {
        width: 70px;
        height: 34px;
        background: rgba(255, 255, 255, 1);
        border-radius: 7px;
        border: 1px solid rgba(209, 215, 224, 1);
        outline: none;
        font-size: 14px;
        font-family: arial, sans-serif;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        &:hover {
          background: rgba(54, 120, 200, 1);
          color: #fff;
          border-color: rgba(54, 120, 200, 1);
        }
      }
    }
  }
  .innerEn{
    width: 750px;
  }
}
.devList::-webkit-scrollbar {
  width: 4px;
}

.devList::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}

.devList::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.item {
  margin-top: 14px;
}
</style>
<style lang="scss">
.VpnPop {
  .el-form-item__content {
    line-height: 0px;
  }
  .el-input__inner {
    width: 180px;
    height: 34px;
    line-height: 0px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    padding-left: 10px;
  }
  .el-form-item__label {
    // width:63px;
    line-height: 34px;
    padding-right: 7px;
    color: #333333;
    white-space: wrap;
  }
  .el-form-item {
    height: 34px;
    margin: 0px;
  }
  .el-form--inline .el-form-item {
    margin-right: 30px;
  }
  .el-form--inline .el-form-item:nth-child(2) {
    margin-right: 0px;
  }
  .el-form-item__error {
    top: 90%;
  }
}
.mainMiddleVpn {
  .el-form--inline .el-form-item {
    margin-right: 90px;
  }
}
</style>