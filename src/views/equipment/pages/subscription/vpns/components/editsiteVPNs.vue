<template>
  <div class="editStatic">
    <div class="context">
      <div class="title">
        {{$t('subscription.vpns.editSiteVPN')}}
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
          <el-form-item :label="$t('subscription.vpns.name')" prop="name">
            <div class="item-ipt">
              <el-input
                  v-model="form.name"
                  :placeholder="$t('subscription.vpns.name')"
                  size="small"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item :label="$t('subscription.vpns.description')" prop="description">
            <div class="item-ipt">
              <el-input
                  v-model="form.description"
                  :placeholder="$t('subscription.vpns.description')"
                  size="small"
              ></el-input>
            </div>
          </el-form-item>

          <el-form-item :label="$t('subscription.vpns.logicalInterface')" prop="logicalId">
            <div class="item-ipt">
              <el-select filterable v-model="form.logicalId" :placeholder="$t('subscription.vpns.logicalInterface')"
                         size="small">
                <el-option
                    v-for="item in port"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>

          <el-form-item :label="$t('subscription.vpns.tunnelEnacaplation')" prop="tunnelEnacaplation">
            <div class="item-ipt">
              <el-select filterable v-model="form.tunnelEnacaplation" :placeholder="$t('subscription.vpns.tunnelEnacaplation')"
                         size="small" @change="roleIsShow()">
                <el-option
                    v-for="item in tunnel"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>

          <el-form-item :label="$t('subscription.vpns.role')" prop="vpnRole" v-if="roleShow">
            <div class="item-ipt">
              <el-select filterable v-model="form.vpnRole" :placeholder="$t('subscription.vpns.role')"
                         size="small"  @change="roleIsShow()">
                <el-option
                    v-for="item in role"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>

          <el-form-item :label="$t('subscription.vpns.remotePeer')" prop="remotePeer">
            <div class="item-ipt">
              <el-select filterable ref="r_remotePeer" v-model="form.remotePeer" :placeholder="$t('subscription.vpns.remotePeer')"
                         size="small" @change="getRemoteIP()">
                <el-option
                    v-for="item in dev"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item :label="$t('subscription.vpns.remoteIPAddress')" prop="tunnelIp" v-if="remoteIPShow">
            <div class="item-ipt">
              <el-select filterable v-model="form.tunnelIp" :placeholder="$t('subscription.vpns.remoteIPAddress')"
                         size="small">
                <el-option
                    v-for="item in logicalIp"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item :label="$t('subscription.vpns.innerIPAddress')" prop="innerIp">
            <div class="item-ipt">
              <el-input v-model="form.innerIp" size="small"  ></el-input><span class="lxSpan">/30</span>
            </div>
          </el-form-item>
          <div class="contr">
            <button type="primary" v-debounce="save" class="save">{{$t('subscription.save')}}</button>
            <button @click.prevent="close" class="cancel">{{$t('subscription.cancel')}}</button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {
  saveVpnSite, getVpnSelect, getLogicPort, checkSiteName, userInfo, checkSiteinnerIp
} from "@/services";
export default {
  data() {
    let chkip = (rule, value, callback) => {
      if (value) {
        let reg  = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error(this.$t("vsr1000.greRule[2]")));
        }
      }
    };
    var checkIpv4 = (rule,value,callback)=>{
      if(value) {
        if (this.oldInnerIp != value) {
          let params = {checkIp: value+"/30", deviceId: this.deviceId, tenantId: this.tenantId }
          checkSiteinnerIp(params).then(res => {
            if (res.code == 10000) {
              callback()
            } else {
              callback(new Error(this.$t('Mobile.alreadySubnetAddress')))
            }
          })
        } else {
          callback()
        }
      }else{
        callback()
      }
    };

    let checkName = (rule,value,callback) => {
      if(value){
        if(this.form.name!=this.oldname){
            checkSiteName({vpnName:value,deviceId:this.deviceId}).then(res=>{
              if(res.code==10000){
                callback()
              }else{
                callback(new Error(this.$t('vsr1000.remind[6]')))
              }
            })
        }else{
          callback()
        }
      }
    };

    return {
      deviceId:JSON.parse(this.$route.query.devData).deviceId,
      tenantId :"",
      userType :"",
      lang: sessionStorage.getItem("lang") || "en",
      port:[],
      role:[],
      dev:[],
      onlineDev:[],
      serveDev:[],
      tunnel:[],
      logicalIp:[],
      roleShow:true,
      remoteIPShow:true,
      id:"",
      oldname:"",
      oldInnerIp:"",
      form: {
        name: "",
        description: "",
        logicalId: "",
        tunnelEnacaplation: "",
        vpnRole: "",
        remotePeer: "",
        remotePeerName:"",
        tunnelIp: "",
        innerIp: "",
      },
      apiArr: [],
      rules: {
        name: [
          {
            required: true,
            message: this.$t("subscription.vpns.remind[0]"),
            trigger: "blur"
          },
          {
            pattern: /^\S*$/,
            message: this.$t("subscription.vpns.remind[12]"), trigger: "blur"
          },{validator: checkName, trigger: "blur" }
        ],
        logicalInterface: [
          {
            required: true,
            message: this.$t("subscription.vpns.remind[1]"),
            trigger: "change"
          },
        ],
        tunnelEnacaplation: [
          {
            required: true,
            message: this.$t("subscription.vpns.remind[2]"),
            trigger: "change"
          },
        ],
        vpnRole:[
          {
            required: true,
            message: this.$t("subscription.vpns.remind[3]"),
            trigger: "blur"
          },
        ],
        remotePeer:[
          {
            required: true,
            message: this.$t("subscription.vpns.remind[4]"),
            trigger: "blur"
          },
        ],
        tunnelIp:[{
          required: true,
          message: this.$t("subscription.vpns.remind[5]"),
          trigger: "blur"
        }
        ],
        innerIp: [
          {
            required: true,
            message: this.$t("subscription.vpns.remind[6]"),
            trigger: "blur"
          },{ validator: chkip, trigger: "change" },
          { validator: checkIpv4, trigger: "blur" },
        ]
      }
    };
  },
  methods: {
    close() {
      this.$parent.editsiteVPNsShow = false;
      this.$refs.form.resetFields();
    },
    save(formName) {
      let Inner_Ip =this.form.innerIp +"/30";

      let serverId = "";
      let clientId = "";
      let obj1={};
      let role = this.form.vpnRole;
      if(role!=""){
        obj1 = this.role.find((item)=> {
          return item.id === role;
        });
        if(obj1.name=="Server"){
          clientId = this.form.remotePeer;
        }else{
          serverId = this.form.remotePeer;
        }
      }

      let params = {
        id:this.id,
        deviceId:this.deviceId,
        name: this.form.name,
        description: this.form.description,
        logicalId: this.form.logicalId,
        tunnelEnacaplation: this.form.tunnelEnacaplation,
        vpnRole: this.form.vpnRole,
        remotePeer: this.form.remotePeer,
        tunnelIp: this.form.tunnelIp,
        serverId: serverId,
        clientId: clientId,
        innerIp: Inner_Ip,
        randomId: parseInt((Math.random() + 1) * Math.pow(10, 6 - 1))
      };

      this.$refs[formName].validate(valid => {
        if (valid) {
          saveVpnSite(params).then(res => {
            // console.log(res)
            if (res.code == 10000) {
              this.$message({
                message: this.$t("subscription.vpns.remind[10]"),
                type: "success"
              });
              this.close();
              this.$parent.getVpnSiteList();
            } else {
              this.$message({
                type: "warning",
                message: res.message
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getdic(){
      getVpnSelect({deviceId:this.deviceId,tenantId:this.tenantId,userType: this.userType}).then(res=>{
        this.port = res.result.port;
        this.role = res.result.role;
        this.dev = res.result.dev;
        this.onlineDev = res.result.dev;
        this.serveDev  = res.result.serDev;
        this.tunnel = res.result.tunnel;
      })
    },
    getRemoteIP(){
      this.form.tunnelIp = "";
      getLogicPort({deviceId:this.form.remotePeer}).then(res=>{
        this.logicalIp = res.result;
      });
    },
    roleIsShow(){
      let val = this.form.tunnelEnacaplation
      let obj = {};
      obj = this.tunnel.find((item)=> {
        return item.id === val;
      });
      if(obj.name=="GRE-over-IPsec"){
        this.roleShow = true;
        let obj1={};
        let role = this.form.vpnRole;
        if(role!=""){
          obj1 = this.role.find((item)=> {
            return item.id === role;
          });
          if(obj1.name=="Server"){
            this.remoteIPShow = false;
          }else{
            this.remoteIPShow = true;
          }
        }
      }else{
        this.roleShow = false;
        this.remoteIPShow = true;
      }

      let roleVal = this.form.vpnRole;
      let roleObj = {};

      roleObj = this.role.find((item)=> {
        return item.id === roleVal;
      });

      this.form.remotePeer = "";
      this.form.tunnelIp = "";

      if(obj.name=="GRE-over-IPsec") {
        if (roleObj.name == "Server") {
          this.dev = this.onlineDev;
        } else {
          this.dev = this.serveDev;
        }
      }else{
        this.dev = this.onlineDev;
      }

    }
  },
  created() {
    this.tenantId =  sessionStorage.getItem("tenantValue"),
        userInfo().then(res => {
          this.userType = res.result.type;
          this.getdic();
        });
  }
};
</script>
<style lang="scss" scoped>
.item-ipt {
  width: 320px;
  position: relative;
  .lxSpan{
    position: absolute;
    right: -33px;
    top: 0;
  }
}
.item {
  margin-top: 10px;
  padding: 10px;
  .contr {
    text-align: center;
    // margin-left: 20px;
    margin-bottom: 28px;
    margin-top: 15px;
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
  width: 560px;
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
}
</style>
