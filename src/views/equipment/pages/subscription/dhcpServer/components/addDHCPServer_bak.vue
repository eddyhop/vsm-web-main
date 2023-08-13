<template>
  <div class="editStatic">
    <div class="context">
      <div class="title">
        {{$t('subscription.dhcpServer.addDHCPServer')}}
        <span class="close" @click="close"></span>
      </div>
      <div class="item" :style="lang == 'en' ? '' : 'marginLeft:70px'">
        <el-form
            :model="form"
            :rules="rules"
            ref="form"
            label-width="auto"
            :inline="true"
            class="demo-ruleForm"
            @submit.native.prevent
        >
          <el-form-item :label="$t('subscription.dhcpServer.name')" prop="name">
            <div class="item-ipt">
              <el-input class="w300"
                  v-model="form.name"
                  :placeholder="$t('subscription.dhcpServer.name')"
                  size="small"
              ></el-input>
            </div>
          </el-form-item>

          <el-form-item :label="$t('subscription.dhcpServer.logicalInterface')" prop="logID">
            <div class="item-ipt">
              <el-select filterable v-model="form.logID" size="small" class="w300" >
                <el-option
                    v-for="item in port"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>

          <el-form-item :label="$t('subscription.dhcpServer.description')" prop="description"   >
            <div class="item-ipt">
              <el-input class="w300"
                  v-model="form.description"
                  :placeholder="$t('subscription.dhcpServer.description')"
                  size="small"
              ></el-input>
            </div>
          </el-form-item>

          <el-form-item :label="$t('subscription.dhcpServer.leaseTime')" prop="leaseTime" >
            <div class="item-ipt">
              <el-input v-model="form.leaseTime" size="small" :placeholder="$t('subscription.dhcpServer.leaseTime')" class="w300"></el-input>
            </div>
          </el-form-item>


          <el-form-item :label="$t('subscription.dhcpServer.startingIPAddress')"  prop="ipStart"  >
            <div class="item-ipt">
              <el-input class="w300"
                  v-model="form.ipStart"
                  :placeholder="$t('subscription.dhcpServer.startingIPAddress')"
                  size="small"
              ></el-input>
            </div>
          </el-form-item>

          <el-form-item :label="$t('subscription.dhcpServer.endingIPAddress')" prop="ipEnd" >
            <div class="item-ipt">
              <el-input class="w300"
                  :placeholder="$t('subscription.dhcpServer.endingIPAddress')"
                  v-model="form.ipEnd"
                  size="small"
              ></el-input>
            </div>
          </el-form-item>

          <el-form-item :label="$t('subscription.dhcpServer.primaryDNS')" prop="dnsIp" >
            <div class="item-ipt">
              <el-input class="w300"
                  :placeholder="$t('subscription.dhcpServer.primaryDNS')"
                  v-model="form.dnsIp"
                  size="small"
              ></el-input>
            </div>
          </el-form-item>

          <el-form-item :label="$t('subscription.dhcpServer.primaryDNS')" prop="secondaryDns" >
            <div class="item-ipt">
              <el-input class="w300"
                        :placeholder="$t('subscription.dhcpServer.SecondaryDNS')"
                        v-model="form.secondaryDns"
                        size="small"
              ></el-input>
            </div>
          </el-form-item>

          <el-form-item :label="$t('subscription.dhcpServer.dhcpOption')" prop="option" >
              <el-input class="w250"
                        :placeholder="$t('subscription.dhcpServer.dhcpOption')"
                        v-model="form1.option"
              ></el-input>
            <span class="add" @click="addData2"></span>
          </el-form-item>

          <el-form-item :label="$t('subscription.dhcpServer.optionVal')" prop="value" >
            <div class="item-ipt">
              <el-input class="w300"
                        :placeholder="$t('subscription.dhcpServer.optionVal')"
                        v-model="form1.value"
                        size="small"
              ></el-input>
            </div>
          </el-form-item>

          <div v-for="(item, index) in form1.data"  :key="index" class="item"  >
            <el-form-item :label="$t('subscription.dhcpServer.dhcpOption')" prop="option" >
              <div class="item-ipt">
                <el-input class="w300"
                          :placeholder="$t('subscription.dhcpServer.dhcpOption')"
                          v-model="item.option"
                          size="small"
                ></el-input>
                <span class="del" @click="delData2(index)"></span>
              </div>
            </el-form-item>

            <el-form-item :label="$t('subscription.dhcpServer.optionVal')" prop="value" >
              <div class="item-ipt">
                <el-input class="w300"
                          :placeholder="$t('subscription.dhcpServer.optionVal')"
                          v-model="item.value"
                          size="small"
                ></el-input>
              </div>
            </el-form-item>

          </div>

          <div class="contr">
            <button :disabled="buttomShow" type="primary" v-debounce="save" class="save">
              {{ $t("subscription.save") }}
            </button>
            <button @click.prevent="close" class="cancel">
              {{ $t("subscription.cancel") }}
            </button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>


<script>
import {getLogicLanPort, dhcpAddOrEditService,dhcpCheckIp} from "@/services";
export default {
  data() {
    var eipCheck = (rule, value, callback) => {
      let small = Number(value.split(".")[3]);
      let big = Number(this.form.ipStart.split(".")[3]);
      if (small < big || small == big) {
        callback(new Error(this.$t("vsr100.dhcp.remind[0]")));
      } else {
        callback();
      }
    };
    var ipCheck = (rule, value, callback) => {

      if(value){
        dhcpCheckIp({logid:this.form.logID,ip:value}).then( res =>{
          if (res.code === 10000) {
            callback();
          }else{
            callback(new Error(this.$t("vsr100.dhcp.remind[10]")));
          }
        });
      }else{
        callback();
      }
    };

    var selCheck = (rule, value, callback) => {

      if(this.form.logID){
        callback();
      }else{
        callback(new Error(this.$t("vsr100.dhcp.remind[11]")));
      }
    };


    var NumRule = (rule, value, callback) => {

      if(value!=""){
        let val = value * 1;
        let reg = /^[0-9]*$/;
        if (reg.test(val)) {
          if (val >= 2) {
            callback();
          } else {
            callback(new Error(this.$t('vsr100.dhcp.remind[12]')));
          }
        } else {
          callback(new Error(this.$t('vsr100.dhcp.remind[12]')));
        }
      }else{
        callback();
      }
    };

    return {
      buttomShow:false,
      deviceId: JSON.parse(this.$route.query.devData).deviceId,
      isEdit: false,
      port:[],
      lang: sessionStorage.getItem("lang"),
      form: {
        id: "",
        name: "",
        description: "",
        ipStart: "",
        ipEnd: "",
        leaseTime: "60",
        dnsIp: "",
        logID: "",
        serverEnabled:true,
        secondaryDns: ""
      },
      form1: {
        data: [],
      },
      apiArr: [],
      rules: {
        name:[{
          required: true,
          message: this.$t("subscription.dhcpServer.remind[0]"),
          trigger: "blur"
        }],
        logID:[{
          required: true,
          message: this.$t("subscription.dhcpServer.remind[1]"),
          trigger: "change"
        }],
        ipStart: [
          {
            validator: selCheck ,trigger: "blur"
          },
          {
            required: true,
            message: this.$t("subscription.dhcpServer.remind[2]"),
            trigger: "blur"
          },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("vsr100.dhcp.remind[9]"),
            trigger: "blur"
          },{
            validator: ipCheck ,trigger: "blur"
          }
        ],
        ipEnd: [
          {
            validator: selCheck ,trigger: "blur"
          },
          {
            required: true,
            message: this.$t("subscription.dhcpServer.remind[3]"),
            trigger: "blur"
          },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("vsr100.dhcp.remind[9]"),
            trigger: "blur"
          },{
            validator: ipCheck ,trigger: "blur"
          },
          { validator: eipCheck, trigger: "blur" },
        ],
        dnsIp: [
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("vsr100.dhcp.remind[9]"),
            trigger: "blur"
          }
        ],
        secondaryDns: [
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("vsr100.dhcp.remind[9]"),
            trigger: "blur"
          }
        ],
        leaseTime: [
          {
            validator: NumRule, trigger: "blur"
          }
        ]
      },
    };
  },
  methods: {
    close() {
      this.$parent.addDHCPServerShow = false;
      this.$refs.form.resetFields();
    },
    addData2() {
      this.form1.data.push({ option:"" ,value:""});
    },
    delData2(index) {
      this.form1.data.splice(index, 1);
    },
    save(formName) {
      if(!this.form.leaseTime){
        this.form.leaseTime = 60;
      }
      let dhcpData = {
        serverEnabled: this.form.serverEnabled,
        deviceId: JSON.parse(this.$route.query.devData).deviceId,
        leaseTime: this.form.leaseTime,
        ipStart: this.form.ipStart,
        ipEnd: this.form.ipEnd,
        dnsIp: this.form.dnsIp,
        logID: this.form.logID,
        name: this.form.name,
        description: this.form.description,
        randomId: parseInt((Math.random() + 1) * Math.pow(10, 6 - 1)) + ""
      };
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.buttomShow= true
          dhcpAddOrEditService(dhcpData).then(res => {
            this.buttomShow= false
            if (res.code === 10000) {
              this.$message({
                message: this.$t("subscription.vpns.remind[9]"),
                type: "success"
              });
              this.close();
              this.$parent.getDHCPService();
            }else{
              this.$message.error(this.$t("subscription.vpns.remind[11]"));
            }
          });
        } else {
          return false;
        }
      });
    },

  },
  created() {
    getLogicLanPort({ deviceId: this.deviceId,type:"Bridged"}).then(res => {
      if (res.code === 10000) {
        this.port = res.result;
      }
    });
  },
};
</script>
<style lang="scss" scoped>
.item-ipt {
  width: 320px;
}
.item {
  margin-top: 10px;
  padding: 10px;
  .contr {
    text-align: center;
    // margin-left: 20px;
    margin-bottom: 28px;
  }
  .save:hover {
    background: rgba(96, 149, 214, 1);
  }
  button {
    color: white;
    border: none;
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
  }
  .cancel {
    margin-left: 18px;
    background: rgba(255, 255, 255, 1);
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    border: 1px solid rgba(209, 215, 224, 1);
  }
}
.context {
  width: 1150px;
  // height: 387px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 15px 30px 0px rgba(191, 198, 217, 0.15);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: auto;
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
      background-image: url("../../../../../../assets/icon_close.png");
      background-size: 14px 14px;
    }
  }
}
.editStatic {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.2);
  z-index: 100;
}
</style>
<style lang="scss">
.editStatic {
  .el-form-item__error{
    margin-top: -10px;
  }
  .el-form-item{
    float: left;
    width: 50%;
    margin: 0;
    box-sizing: content-box;
    padding: 5px 0;
    margin-top: 5px;
    .w300{
      width: 280px;
    }
    .w250{
      width: 200px;
    }
  }
  .el-form--inline .el-form-item:nth-child(2) {
    margin-right: 0px;
  }
  .el-select {
    width: 100%;
    height: 32px;
    .el-input {
      height: 100%;
      .el-input__inner {
        height: 100%;
      }
      .el-input__icon {
        line-height: normal;
      }
    }
  }
  .el-form-item__content{
    font-size: 0;
  }
  .add {
    display: block;
    width: 34px;
    height: 34px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    border: 1px solid rgba(209, 215, 224, 1);
    background: url("../../../../../../assets/newPage/deviceconfiguration_icon_arp_add@2x.png")
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
    background: url("../../../../../../assets/newPage/deviceconfiguration_icon_arp_delete@2x.png")
    no-repeat center;
    background-size: 16px 16px;
  }
}
</style>
