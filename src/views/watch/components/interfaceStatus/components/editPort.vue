<template>
  <div class="addPortMask">
    <div class="context">
      <h4 class="title">
        <span>{{$t('vsr1000.edit')}}{{$t('vsr1000.logicPort')}}</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="event">
        <el-form :model="form" :rules="rules" ref="form" :label-width="lang=='en'?'auto':'100px'" class="demo-ruleForm" @submit.native.prevent>
          <div class="item">
            <el-form-item :label="$t('vsr1000.name')" prop="name">
              <el-input v-model="form.name" :disabled="form.couldBack"></el-input>
            </el-form-item>
            <el-form-item :label="$t('vsr1000.describe')" prop="description">
              <el-input v-model="form.description"></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item :label="$t('vsr1000.role')" prop="role" >
              <el-select filterable v-model="form.role" :placeholder="$t('vsr1000.remind[28]')"  @change="changeRole()">
                <el-option v-for="item in form.rateList" :key="item.id" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('vsr1000.type')" prop="type" >
              <el-select filterable v-model="form.type" :placeholder="$t('vsr1000.remind[28]')"   @change="changeType()" >
                <el-option v-for="item in form.typeList" :key="item.id" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="item" >
            <el-form-item :label="$t('vsr1000.physicalInterface')" prop="portId"  >
              <el-select filterable multiple v-model="form.portId" :placeholder="$t('vsr1000.remind[28]')" @change="changePort(form.portId)">
                <el-option v-for="item in form.physicalInterfaceList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="rateType" v-if="form.role=='WAN'">
            <div class="item">
              <el-form-item :label="$t('vsr1000.dhcpClient')" prop="dhcpClient">
                <el-checkbox
                    v-model="form.dhcpClient"
                ></el-checkbox>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item :label="$t('vsr1000.ipv4Address')" prop="ipv4">
                <el-input v-model="form.ipv4"></el-input>
              </el-form-item>
              <el-form-item :label="$t('vsr1000.gateway')" prop="gateway">
                <el-input v-model="form.gateway"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item :label="$t('vsr1000.mss')" prop="mss">
                <el-input v-model="form.mss"></el-input>
              </el-form-item>
              <el-form-item :label="$t('vsr1000.mtu')" prop="mtu">
                <el-input v-model="form.mtu"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item :label="$t('vsr1000.subscriptions')" prop="subscriptions">
                <el-checkbox-group   v-model="form.subscriptions"  >
                  <el-checkbox   label="Source NAT" name="Source NAT" ></el-checkbox>
                  <el-checkbox   label="Port Forwarding" >Port Forwarding</el-checkbox>
                  <el-checkbox    label="Site VPNs"  @change="openVPN" >Site VPNs</el-checkbox>
                  <el-checkbox    label="Client VPNs" @change="openVPN" >Client VPNs</el-checkbox>
                  <el-checkbox   label="Firewall" >Firewall</el-checkbox>
                  <el-checkbox   label="Qos" >Qos</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>
          </div>
          <div class="rateType" v-if="form.role=='LAN' && (form.type=='Routed' || form.type=='Bridged' )">
            <div class="item">
              <el-form-item :label="$t('vsr1000.ipv4Address')" prop="ipv4">
                <el-input v-model="form.ipv4"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item :label="$t('vsr1000.mss')" prop="mss">
                <el-input v-model="form.mss"></el-input>
              </el-form-item>
              <el-form-item :label="$t('vsr1000.mtu')" prop="mtu">
                <el-input v-model="form.mtu"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item :label="$t('vsr1000.subscriptions')" prop="subscriptions">
                <el-checkbox-group   v-model="form.subscriptions"  >
                  <el-checkbox   label="Source NAT" >Source NAT</el-checkbox>
                  <el-checkbox   label="Site VPNs"  @change="openVPN">Site VPNs</el-checkbox>
                  <el-checkbox   label="Client VPNs" @change="openVPN" >Client VPNs</el-checkbox>
                  <el-checkbox   label="Firewall" >Firewall</el-checkbox>
                  <el-checkbox   label="Qos" >Qos</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>
          </div>

          <div class="item">
            <el-form-item :label="$t('Config.clientGateway1')" prop="vpnIp1">
              <el-input v-model="form.vpnIp1" :disabled="disabled1"></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item :label="$t('Config.clientGateway1')" prop="vpnIp2">
              <el-input v-model="form.vpnIp2" :disabled="disabled2"></el-input>
            </el-form-item>
          </div>

          <div class="submit">
            <button class="save" v-debounce.prevent="save">{{$t('vsr1000.save')}}</button>
            <button class="cancel" @click.prevent="close">{{$t('vsr1000.cancel')}}</button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {
  logicalPortAdd,
  isMaskRepeat,
  isIPVSRepeat,
  logicalPortName,
  vlanIdAndPortIdExist,
  logicalPortGetSelect, logicalPortEdit
} from "@/services";
import { IPv4ToIPv6 } from "@/utils/IPv4To6";
export default {
  props: {
    editShow: {
      type: Boolean
    }
  },
  components: {},
  data() {
    var checkName = (rule,value,callback) => {
      if(this.form.name!=this.form.oldName){
        if(value){
          logicalPortName({checkName:value,deviceId:this.$parent.deviceId}).then(res=>{
            if(res.code==10000){
              callback()
            }else{
              callback(new Error(this.$t('vsr1000.remind[6]')))
            }
          })
        }
      }else{
        callback()
      }
    }
    var checkSel = (rule,value,callback) => {
      if (value === "") {
        callback(new Error(this.$t('vsr1000.remind[28]')))
      }
    }
    var chosePort = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t('vsr1000.remind[7]')));
      } else {
        let params = {
          deviceId: this.$parent.deviceId,
          vlanId: this.form.id,
          portId:value
        }
        vlanIdAndPortIdExist(params).then(res=>{
          if(res.code==10000){
            let n = 0;
            this.form.domains.map(item => {
              if (item.value == value) {
                n += 1;
              }
            });
            n > 1 ? callback(new Error(this.$t('vsr1000.remind[8]'))) : callback();
          }else{
            callback(new Error(this.$t('vsr1000.remind[9]')))
          }
        });
        // n > 1 ? callback(new Error("物理端口选择重复")) : callback();
        // n > 1 ? Callback (new Error(" physical port selection repetition ") : callback();
      }
    };
    var checkIpv4 = (rule,value,callback)=>{
      let params = {checkIp:value,deviceId:this.$parent.deviceId,vrfId:this.form.vrf}
      isMaskRepeat(params).then(res=>{
        if(res.code==10000){
          callback()
        }else{
          callback(new Error(res.message))
        }
      })
    }

    return {
      lang: sessionStorage.getItem("lang") || "en",
      deviceSerialNumber:JSON.parse(this.$route.query.devData).vsrSeries,
      tenantId:JSON.parse(this.$route.query.devData).tenantId,

      form: {
        couldBack: false,
        subscriptions:[],
        mss:"1460",
        mtu:"1500",
        physicalInterfaceList:[],
        physicalInterface:"",
        rateList:[{
          name:"WAN",
          id:"0"
        },{
          name:"LAN",
          id:"1"
        }],
        typeList:[{
          name:"Bridged",
          id:"0"
        },{
          name:"Routed",
          id:"1"
        }],
        backbone:false,
        backboneShow:JSON.parse(sessionStorage.getItem('userData')).type == 1 ? true : false,
        vrf: "",
        vrfList: [],
        name: "",
        oldName:"",
        id: "",
        ms: "",
        ip: "",
        value: "",
        options: [],
        domains: [
          {
            value: ""
          }
        ],
        ipv4:"",
        role:"",
        type:"",
        portId:"",
        dhcpClient:false,
        gateway:"",
        vpnIp1:"",
        vpnIp2:"",
        description:"",
        vrfId:"",
      },
      rules: {
        name: [
          { required: true, message: this.$t('vsr1000.greRule[0]'), trigger: "blur" },
          { validator: checkName}
        ],
        ipv4:[
          {required: true, message: this.$t('vsr1000.ipv4s'), trigger: 'blur'},
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]?|3[0-2])$/,
            message: this.$t('vsr1000.remind[16]')
          }
        ],
        role: [
          {required: true, message: this.$t("vsr1000.msg4"), trigger: "blur" },
        ],
        type: [
          {required: true, message: this.$t("vsr1000.msg5"), trigger: "blur" },
        ],
        portId: [
          {required: true, message: this.$t("vsr1000.msg6"), trigger: "blur" },
        ],
      },
      disabled1:true,
      disabled2:true,
    };

  },
  computed: {

  },
  methods: {
    changePort(val){
      if(this.form.type=='Routed'){
        if(val.length>1) {
          this.form.portId = [];
          this.form.portId =[val[1]] ;
        }
      }
    },
    changeType(){
      this.form.portId=[];
    } ,
    changeRole(){
      this.form.subscriptions=[];
    },
    save(formName) {

      let sub = [];
      let port=[];
      this.form.portId.map(item => {
        port.push(item);
      });

      this.form.subscriptions.map(item => {
        sub.push(item);
      });


      let params = {
        deviceId: JSON.parse(this.$route.query.devData).deviceId,
        description: this.form.description,
        role:this.form.role,
        type:this.form.type,
        dhcpClient:this.form.dhcpClient,
        subscriptions:sub.join(),
        portId:port.join(),
        gateway:this.form.gateway,
        vpnIp1:this.form.vpnIp1,
        vpnIp2:this.form.vpnIp2,
        mss:this.form.mss,
        mtu:this.form.mtu,
        deviceSerialNumber:this.deviceSerialNumber,
        tenantId:this.tenantId,
        ipv4:this.form.ipv4,
        name:this.form.name,
        id:this.form.id,
        vrfId:this.form.vrfId,
      };

      this.$refs[formName].validate(valid => {
        if(valid) {
          logicalPortEdit(params).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[0]")
              });
              this.$parent.getList();
              this.$refs[formName].resetFields();
              this.$parent.editShow = false;
            } else {
              this.$message({
                type: "warning",
                message: res.message
              });
            }
          });
        }
      });
    },
    openVPN(val){

      let str =this.form.subscriptions.toString();
      let b1 =  false;
      let b2 =  false;
      if(str.indexOf("Site VPNs")>-1){
        b1 =  true;
      }
      if(str.indexOf("Client VPNs")>-1){
        b2 =  true;
      }

      if(b1==true&&b2==true){
        this.disabled1 = false;
        this.disabled2 = false;
      }else  if(b1==true||b2==true){
        this.disabled1 = false;
        this.disabled2 = true;
      }
      if(b1!=true&&b2!=true){
        this.disabled1 = true;
        this.disabled2 = true;
      }
    },
    close() {
      this.$parent.editShow = false;
      this.$refs.form.resetFields();
    }
  },
  created() {
  },
  mounted() {}
};
</script>
<style scoped lang="scss">
.addPortMask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background:rgba(32,42,59,0.2);
  z-index: 100;
}
.a {
  div {
    width: 322px;
  }
}
.context::-webkit-scrollbar {
  width: 4px;
  /*height: 4px;*/
}
.context::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.context::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.remove{
  margin-left: 15px;
}
.remm {
  button {
    // width: 45px;
    border: none;
    background: none;
    width: 34px;
    height: 34px;
    border-radius: 3px;
    border: 1px solid rgba(209, 215, 224, 1);
    position: relative;
    top: 2px;
  }
  img {
    width: 17px;
    height: 17px;
    position: relative;
    top: 1px;
    right: 1px;
  }
}
.context {
  min-width: 900px;
  max-height: 600px;
  overflow: auto;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 15px 30px 0px rgba(191, 198, 217, 0.15);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  // transform: translate(-50%, -50%);
  margin-top: -284px;
  margin-left: -440px;
  // overflow: auto;
  .item {
    display: flex;
    .backbone {
      margin-left: -20px;
    }
    .ipv4{
      position: relative;
      .add{
        width: 34px;
        height: 34px;
        background: #fff;
        border-radius: 7px;
        border: 1px solid rgba(209, 215, 224, 1);
        font-size: 34px;
        text-align: center;
        // line-height: 32px;
        outline: none;
        color: #3678c8;
        cursor: pointer;
      }
      .addcontent{
        div{
          width: 272px;
        }
        display: flex;
        span{
          margin-left: 15px;
          margin-top: 3px;
          width: 34px;
          height: 34px;
          background: #fff;
          border-radius: 7px;
          border: 1px solid rgba(209, 215, 224, 1);
          font-size: 34px;
          text-align: center;
          line-height: 32px;
          outline: none;
          color: #3678c8;
          cursor: pointer;
          img {
            width: 17px;
            height: 17px;
            position: relative;
            top: -5px;
            right: 1px;
          }
        }
      }
    }
    .ipv6{
      position: relative;
      .add{
        width: 34px;
        height: 34px;
        background: #fff;
        border-radius: 7px;
        border: 1px solid rgba(209, 215, 224, 1);
        font-size: 34px;
        text-align: center;
        line-height: 32px;
        outline: none;
        color: #3678c8;
        cursor: pointer;
      }
      .addcontent{
        div{
          width: 272px;
        }
        display: flex;
        span{
          margin-left: 15px;
          margin-top: 3px;
          width: 34px;
          height: 34px;
          background: #fff;
          border-radius: 7px;
          border: 1px solid rgba(209, 215, 224, 1);
          font-size: 34px;
          text-align: center;
          line-height: 32px;
          outline: none;
          color: #3678c8;
          cursor: pointer;
          img {
            width: 17px;
            height: 17px;
            position: relative;
            top: -5px;
            right: 1px;
          }
        }
      }
    }
  }
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
      background: url("../../../../../assets/icon_close.png") no-repeat;
      background-size: cover;
      cursor: pointer;
    }
  }
}
.event {
  padding: 29px 31px 20px 10px;
  // height: 519px;
  overflow: auto;
}
.addPort {
  width: 100%;
  // position: relative;
  .addPortEvent {
    width: 100%;
    .el-form-item{
      float: left;
    }
  }
  .addPortBtn {
    button{
      margin-top: 3px;
      margin-left: 14px;
      width: 34px;
      height: 34px;
      background: #fff;
      border-radius: 7px;
      border: 1px solid rgba(209, 215, 224, 1);
      font-size: 34px;
      text-align: center;
      line-height: 32px;
      outline: none;
      color: #3678c8;
      cursor: pointer;
    }
  }
}
.submit {
  width: 100%;
  text-align: center;
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
  }
  .save:hover {
    background: #6095d6;
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
}
</style>



<style lang="scss">
// .el-select-dropdown .el-popper{
//   transition: none!important;
// }
.el-checkbox ::after {
  transition: none!important;
}
.addPortMask .event {
  .el-input {
    width: 322px;
    height: 34px;
    border-radius: 4px;
    .el-input__inner {
      height: 100%;
      line-height: 32px;
      border-radius: 7px;
    }
  }
  .b {
    .el-select {
      width: 272px;
      .el-input {
        width: 272px;
      }
    }
  }
  .el-textarea {
    width: 322px;
    height: 34px;
    border-radius: 4px;
    .el-textarea__inner {
      padding: 0;
      height: 100%;
    }
  }
  .el-input__icon {
    line-height: normal;
  }
  .el-form-item__label {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
}
// .addPortBtn button {
//   width: 34px;
//   height: 34px;
//   background: #fff;
//   border-radius: 7px;
//   border: 1px solid rgba(209, 215, 224, 1);
//   font-size: 34px;
//   text-align: center;
//   line-height: 32px;
//   outline: none;
//   color: #3678c8;
//   cursor: pointer;
// }
// .addAddress .el-form-item {
//   margin-bottom: 13px;
// }
.addPortEvent .el-form-item__content {
  display: flex;
}
</style>