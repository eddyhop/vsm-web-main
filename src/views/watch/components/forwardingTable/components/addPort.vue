<template>
  <div class="addPortMask" v-if="isShow">
    <div class="context">
      <h4 class="title">
        <span>{{$t('vsr1000.addLogicPort')}}</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="event">
        <el-form :model="form" :rules="rules" ref="form" :label-width="lang=='en'?'auto':'100px'" class="demo-ruleForm" @submit.native.prevent>
          <div class="item">
            <el-form-item :label="$t('vsr1000.name')" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item
              label="vlan-id"
              :rules="[
                { required: true, message: this.$t('vsr1000.remind[23]')},
                { type: 'number', message: this.$t('vsr1000.remind[24]')}
              ]"
              prop="id"
            >
              <el-input @input="upCheck" disabled v-model.number="form.id"></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item :label="$t('vsr1000.tenantRoutingDomain')" prop="type">
              <div class="a">
                <el-select filterable v-model="form.vrf" :placeholder="$t('vsr1000.remind[7]')" @change="choseVrf(form.vrf)">
                  <!-- <el-option value="" label="无"></el-option> -->
                  <el-option
                    v-for="item in form.vrfList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item>
              <div class="backbone">
                <el-checkbox v-show="form.backboneShow" v-model="form.backbone" @change="chosebackBone(form.backbone)">{{$t('vsr1000.Backboneport')}}</el-checkbox>
              </div>
            </el-form-item>
          </div>
          <div class="item">
            <div class="addPort">
              <div class="addPortEvent">
                <el-form-item :label="$t('vsr1000.describe')" prop="delivery">
                  <el-input v-model="form.ms"></el-input>
                </el-form-item>
                <el-form-item
                  v-for="(domain, index) in form.domains"
                  :label="$t('vsr1000.physicalPort')"
                  :key="domain.key"
                  :prop="'domains.' + index + '.value'"
                  :rules="Port"
                  >
                  <div class="b">
                    <el-select filterable v-model="domain.value" :placeholder="$t('vsr1000.remind[7]')">
                      <el-option
                        v-for="item in form.options"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </div>
                  <span class="remm">
                    <button
                      v-if="form.domains.length>1&&index>0"
                      @click.prevent="removeDomain(domain)"
                      class="remove"
                    >
                      <img src="@/assets/deviceconfiguration_icon_arp_delete@2x.png" alt />
                    </button>
                  </span>
                </el-form-item>
              </div>
              <div class="addPortBtn">
                <!-- <button @click.prevent="addDomain">+</button> -->
              </div>
            </div>
          </div>
          <div class="item">
            <div class="ipv4">
              <el-form-item :label="$t('vsr1000.ipv4')"
                v-for="(domain, index) in form.IPV4"
                :key="domain.key"
                :prop="'IPV4.' + index + '.ipv4'" 
                :rules="ipv4">
                <div class="addcontent">
                  <el-input v-model="domain.ipv4" @change="form.backbone?ip4Toip6(domain.ipv4,domain.key,index):null"></el-input>
                  <span v-if="index==0" class="add" @click.prevent="addIpv4">+</span>
                  <span v-if="form.IPV4.length>1&&index>0" @click.prevent="removeIpv4(domain)"><img src="@/assets/deviceconfiguration_icon_arp_delete@2x.png" alt /></span>
                </div>
              </el-form-item>
            </div>
            <div class="ipv6">
              <el-form-item :label="$t('vsr1000.ipv6')"
                v-for="(domain, index) in form.IPV6"
                :key="domain.key"
                :prop="'IPV6.' + index + '.ipv6'"
                :rules="ipv6">
                <div class="addcontent">
                  <el-input :disabled="domain.disabled" v-model="domain.ipv6"></el-input>
                  <span v-if="index==0" class="add" @click.prevent="addIpv6">+</span>
                  <span v-if="form.IPV6.length>1&&index>0" @click.prevent="removeIpv6(domain)"><img src="@/assets/deviceconfiguration_icon_arp_delete@2x.png" alt /></span>
                </div>
              </el-form-item>
            </div>
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
import { logicalPortAdd , isMaskRepeat ,isIPVSRepeat ,logicalPortName,vlanIdAndPortIdExist,isVrfBandDing} from "@/services";
import { compare } from "@/utils/change";
import { IPv4ToIPv6 } from "@/utils/IPv4To6";
export default {
  props: {
    isShow: {
      type: Boolean
    }
  },
  components: {},
  data() {
    var checkName = (rule,value,callback) => {
      if(value){
        logicalPortName({checkName:value,deviceId:this.$parent.deviceId}).then(res=>{
           if(res.code==10000){
              callback()
           }else{
             callback(new Error(this.$t('vsr1000.remind[6]')))
           }
        })
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
      let n = 0
      let ip4 = this.form.IPV4
      let params = {checkIp:value,deviceId:this.$parent.deviceId,vrfId:this.form.vrf}
      ip4.map(item=>{
        if(item.ipv4 == value){
          n+=1
        }
      })
      if(this.form.vrf!=''){
        if(n>1){
            callback(new Error(this.$t('vsr1000.remind[10]')))
        }else{
          isMaskRepeat(params).then(res=>{
            if(res.code==10000){
              callback()
            }else{
              callback(new Error(res.message))
            }
          })
        }
      }else{
         callback(new Error(this.$t('vsr1000.remind[12]')))
      }
    }
    var checkIpv6 = (rule,value,callback)=>{
      let n = 0
      let ip6 = this.form.IPV6
      let params = {checkIp:value,deviceId:this.$parent.deviceId,vrfId:this.form.vrf}
      ip6.map(item=>{
        if(item.ipv6 == value){
          n+=1
        }
      })
      if(this.form.vrf!=''){
        if(n>1){
          callback(new Error(this.$t('vsr1000.remind[13]')))
        }else{
          isIPVSRepeat(params).then(res=>{
            if(res.code==10000){
              callback()
            }else{
              callback(new Error(res.message))
            }
          })
        }
      }else{
         callback(new Error(this.$t('vsr1000.remind[12]')))
      }
    }
    return {
      lang:sessionStorage.getItem('lang'),
      deviceSerialNumber:JSON.parse(this.$route.query.devData).vsrSeries,
      tenantId:JSON.parse(this.$route.query.devData).tenantId,
      form: {
        backbone:false,
        backboneShow:JSON.parse(sessionStorage.getItem('userData')).type == 1 ? true : false,
        vrf: "",
        vrfList: [],
        name: "",
        id: 0,
        ms: "",
        ip: "",
        value: "",
        options: [],
        domains: [
          {
            value: ""
          }
        ],
        IPV4:[
          { 
            ipv4:"",
            key: Date.now()
          }
        ],
        IPV6:[
          {
            ipv6:"",
            key: Date.now(),
            disabled: false
          }
        ]
      },
      rules: {
        name: [
          { required: true, message: this.$t('vsr1000.remind[15]'), trigger: "blur" },
          { validator: checkName}
        ],
      },
      Port: [{ validator: chosePort, trigger: ["blur", "change"] }],
      ipv4:[
        {required: true, message: this.$t('vsr1000.ipv4s'), trigger: 'blur'},
        {
          pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]?|3[0-2])$/,
          message: this.$t('vsr1000.remind[16]')
        },
        { validator: checkIpv4,trigger: 'blur'}
        ],
      ipv6:[
        { required: false, message: this.$t('vsr1000.ipv6s'), trigger: "blur" },
        {
          pattern: /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*([/])(?:[0-9]|[1-9][0-9]?|[1-9][0-9][0-9])$/,
          message: this.$t('vsr1000.remind[17]')
        },
        { validator: checkIpv6,trigger: 'blur'},
      ]
    };
  },
  computed: {
    
  },
  methods: {
    upCheck(){
      this.$refs.form.validate((valid) => {
          if (valid) {
              
          } else {
              // console.log('error submit!!');
              return false;
          }
      });
    },
    chosebackBone(val){
      this.form.IPV6[0].ipv6 = ""
      this.form.IPV4[0].ipv4 = ""
      if(val){
        this.ipv6[0].required = true
        this.form.IPV6[0].disabled = true
      }else{
        this.ipv6[0].required = false
        this.form.IPV6[0].disabled = false
      }
    },
    ip4Toip6(val,key,index){
      let reg = /^(?:(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.)(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]?|3[0-2])$/
      let test = reg.test(val)
      if(test==true){
        for(var i in this.form.IPV6){
          if(index==0){
              this.form.IPV6[0].ipv6=IPv4ToIPv6(val)
              this.form.IPV6[0].disabled = true
          }
        }  
      }  
    },
    choseVrf(val){
      let vrfName = ''
      this.form.IPV4[0].ipv4 = ""
      this.form.IPV6[0].ipv6 = ""
      this.form.vrfList.map(item=>{
        if(val==item.id){
          vrfName = item.name
        }
      })
      
      if(vrfName=='default'){
        this.form.backboneShow=true
      }else{
        this.ipv6[0].required = false
        this.form.backboneShow=false 
        this.form.backbone = false
        this.form.IPV6[0].disabled = false
      }
      // console.log(vrfName,this.form.backboneShow)
    },
    addIpv6() {
      this.form.IPV6.push({
        ipv6: '',
        key: Date.now(),
        disabled: false
      });
    },
    removeIpv6(item){
       var index = this.form.IPV6.indexOf(item)
        if (index !== -1) {
          this.form.IPV6.splice(index, 1)
        }
    },
    addIpv4() {
      this.form.IPV4.push({
        ipv4: '',
        key: Date.now()
      });
    },
    removeIpv4(item){
       var index = this.form.IPV4.indexOf(item)
        if (index !== -1) {
          this.form.IPV4.splice(index, 1)
        }
    },
    save(formName) {
      let arr = [];
      let ipf = [];
      let ips = []
      this.form.domains.map(item => {
        arr.push(item.value);
      });
      this.form.IPV4.map(item=>{
        ipf.push(item.ipv4)
      })
      this.form.IPV6.map(item=>{
        ips.push(item.ipv6)
      })
      // ipf.splice(0,1,ipf[0]+"="+ips.shift()) 
      // let str = arr.join(",");
      let params = {
        deviceSerialNumber:this.deviceSerialNumber,
        tenantId:this.tenantId,
        deviceId: this.$parent.deviceId,
        vlanId: this.form.id,
        ipv4: ipf.join(','),
        ipv6:ips.join(','),
        backboneEnabled:this.form.backbone?true:false,
        randomId: parseInt((Math.random() + 1) * Math.pow(10, 6 - 1)) + "",
        description: this.form.ms,
        portId: arr.join(','),
        name: this.form.name,
        vrfId: this.form.vrf
      };
      this.$refs[formName].validate(valid => {
        if (valid) {
          logicalPortAdd(params).then(res => {
            if (res.code == 10000) {
              this.$message({
                message: this.$t('vsr1000.remind[0]'),
                type: "success"
              });
              this.$parent.sizeChange();
              this.close();
            }else{
              this.$message({
                message: this.$t('vsr1000.remind[18]'),
                type: "warning"
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    removeDomain(item) {
      var index = this.form.domains.indexOf(item);
      if (index !== -1) {
        this.form.domains.splice(index, 1);
      }
    },
    addDomain() {
      this.form.domains.length >= this.form.options.length
        ? this.form.domains
        : this.form.domains.push({
            value: this.form.value,
            key: Date.now()
          });
    },
    close() {
      this.$parent.isShow = false;
      this.$refs.form.resetFields();
      // this.form.backboneShow=true
      this.form.backbone = false
      this.ipv6[0].required = false
      this.form.id = 0;
      this.form.ms = "";
      this.form.vrf = ""
      this.form.domains = [
        {
          value: ""
        }
      ];
      this.form.IPV4 = [
        {
          ipv4:"",
          key: Date.now()
        }
      ];
      this.form.IPV6 = [
        {
          ipv6:"",
          key: Date.now()
        }
      ];
      // console.log(compare("192.168.1.199", 30));
    }
    // zhuan(){
    //   let ip = this.form.ip.split('/')[0]
    //   let code = this.form.ip.split('/')[1]
    //   if(code==32){
    //     return
    //   }else{
    //     this.form.ip = compare(ip,code)+'/'+code
    //   }
    // }
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
  max-height: 417px;
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