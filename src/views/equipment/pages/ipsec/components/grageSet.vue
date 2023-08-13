<!-- grageSet.vue -->
<template>
  <div class="grageSet">
    <div class="context">
      <h4 class="title">
        <span>高级设置</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="event">
        <el-form :model="formInline" ref="form" class="demo-form-inline" label-width="120px">
          <h3><span class="tabs-icon"></span>IKE参数</h3>
          <el-form-item label="IKE版本">
            <el-checkbox v-model="check1" @change="chose(0)" disabled>V1</el-checkbox>
            <el-checkbox v-model="check2" @change="chose(1)">V2</el-checkbox>
          </el-form-item>
          <el-form-item label="协商模式" v-show="check1">
            <el-checkbox-group v-model="formInline.ikeConsult">
                <el-checkbox label="主模式" name="type"></el-checkbox>
                <el-checkbox label="野蛮模式" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="加密算法">
            <el-checkbox-group v-model="formInline.ikeEncryption">
                <el-checkbox label="AES256"></el-checkbox>
                <el-checkbox label="AES192"></el-checkbox>
                <el-checkbox label="AES128"></el-checkbox>
                <el-checkbox label="3DES"></el-checkbox>
                <el-checkbox label="DES"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="完整性算法">
            <el-checkbox-group v-model="formInline.ikeIntegrity">
                <el-checkbox label="SHA1"></el-checkbox>
                <el-checkbox label="SHA2"></el-checkbox>
                <el-checkbox label="MD5"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="DH组">
            <el-checkbox-group v-model="formInline.dhGroup">
                <el-checkbox label="5"></el-checkbox>
                <el-checkbox label="2"></el-checkbox>
                <el-checkbox label="1"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="SA超时时间">
            <el-input v-model="formInline.ikeLifetime" style="width:190px" placeholder="86400"></el-input> 60-604800秒
          </el-form-item>
          <div class="sub-title">
              <h3><span class="tabs-icon"></span>IPSEC参数</h3>
          </div>
          <el-form-item label="封装模式">
            <el-checkbox-group v-model="formInline.packageMode">
                <el-checkbox label="隧道模式" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="安全协议">
            <el-checkbox-group v-model="formInline.securityPro">
                <el-checkbox label="ESP" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="ESP加密算法">
            <el-checkbox-group v-model="formInline.espEncryption">
                <el-checkbox label="AES256"></el-checkbox>
                <el-checkbox label="AES192"></el-checkbox>
                <el-checkbox label="AES128"></el-checkbox>
                <el-checkbox label="3DES"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="ESP认证算法">
            <el-checkbox-group v-model="formInline.espAuthentication">
                <el-checkbox label="SHA1"></el-checkbox>
                <el-checkbox label="SHA2"></el-checkbox>
                <el-checkbox label="MD5"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="SA超时时间">
            <el-input v-model="formInline.lifetime" placeholder="3600"></el-input>
          </el-form-item>
          <div style="height:1px;border:1px solid #D1D7E0;margin-top:26px;margin-bottom:24px"></div>
          <div class="last" style="margin-left:-20px">
            <el-form-item label="DPD对端状态检测" label-width="150px">
                <el-switch v-model="formInline.dpd" @change="openShow = !openShow" active-color="#3678C8" inactive-color="#D1D7E0"></el-switch>
            </el-form-item>
            <el-form-item label="检测时间间隔" label-width="150px" v-show="openShow">
                <el-input v-model="formInline.dpdDelay" placeholder="3600"></el-input>
            </el-form-item>
            <el-form-item label="超时时间" label-width="150px" v-show="openShow">
                <el-input v-model="formInline.dpdTimeout" placeholder="3600"></el-input>
            </el-form-item>
            <el-form-item label="超时后隧道动作" label-width="150px" v-show="openShow">
                <el-select filterable v-model="formInline.dpdAction" placeholder="请选择">
                  <el-option v-for="item in dpdActionList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>    
          </div>
          
        </el-form>
        <div class="submit">
          <button
            class="save"
            type="primary"
            v-debounce="save"
          >{{$t('vsr1000.save')}}</button>
          <button class="cancel" @click="close">{{$t('vsr1000.cancel')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// Here you can import other files (such as: components, tools js, third-party plug-ins JS, JSON files, image files, etc.)
//例如：import 《组件名称》 from '《组件路径》';
// For example: import component name from 'Component path ';
import { ipSecExtra } from '@/services'
export default {
  //import引入的组件需要注入到对象中才能使用
  // Import introduces components that need to be injected into an object before they can be used
  components: {},
  data() {
    return {
      check1: false,
      check2: true,
      openShow: false,
      dpdActionList: [],
      formInline: {
        ipsecId: "",//ipsec ID
        deviceId: JSON.parse(this.$route.query.devData).deviceId,
        devSerialNum:JSON.parse(this.$route.query.devData).vsrSeries,
        name: "",//隧道名称
                 // The name of the tunnel
        localport: "",//本端接口
                      // This end interface
        localip: "",//本端IP
                    // The end of the IP
        oppositeAddr: "",//对端地址
                         // To end the address
        approve: "",//认证方式  认证方式，0-秘钥 1-证书
                    // Authentication mode Authentication mode, 0- Secret key 1- certificate
        file: "",//证书收传
                 // Certificate of charge transfer
        shareKey: "",//预共享密钥
                     // Preshared key
        selfID: "",//本端ID
                   // The client ID
        oppositeID: "",//对端ID
                       // The client ID
        selfSubnet: "",//本端子网
                       // This terminal network
        oppositeSubnet: "",//对端子网
                           // The terminal network
        ikeVersion: "",//IKE版本
                       // IKE version
        ikeConsult: [],//IKE协商模式
                       // IKE negotiation mode
        ikeEncryption: ['AES128'],//IKE加密算法
                                  // IKE encryption algorithm
        ikeIntegrity: ['SHA1','MD5'],//IKE完整性算法
                                     // IKE integrity algorithm
        dhGroup: ['2'],//DH组
                       // DH group
        ikeLifetime: "",//ike的sa超时时间
                        // Ike's SA timeout period

        packageMode: true,//封装模式
                          // Encapsulation mode
        securityPro: true,//安全协议
                          // Security protocols
        espEncryption: ['AES192','AES128'],//esp加密协议
                                           // Esp Encryption protocol
        espAuthentication: ['SHA1'],//esp认证算法
                                    // Esp authentication algorithm
        lifetime: "",//ipsec的sa超时时间
                     // The SA timeout of IPSEC
        dpd: false,//对端状态检测
                   // Check the state of the end
        dpdDelay: "",//检测时间间隔
                     // Detection time interval
        dpdTimeout: "",//dpd超时时间
                       // DPD timeout period
        dpdAction: "",//超时后隧道动作
                      // Tunnel action after timeout

      },
    };
  },
  //监听属性 类似于data概念
  // Listening properties are similar to the data concept
  computed: {},
  //监控data中的数据变化
  // Monitor data changes in data
  watch: {},
  //方法集合
  // Methods collection
  methods: {
    save(){
      let params = {
        devId: this.formInline.deviceId,//device ID
        devSerialNum: this.formInline.devSerialNum,//设备序列号
                                                   // Device serial number
        dhGroup: this.formInline.dhGroup.join(','),//dh组
                                                   // Dh group
        dpd: this.formInline.dpd?1:0,//对端状态检测
                                     // Check the state of the end
        dpdAction: this.formInline.dpdAction,//超时后隧道动作
                                             // Tunnel action after timeout
        dpdDelay: this.formInline.dpdDelay,//检测时间间隔
                                           // Detection time interval
        dpdTimeout: this.formInline.dpdTimeout,//dpd超时时间
                                               // DPD timeout period
        espAuthentication: this.formInline.espAuthentication.join(','),//esp认证算法
                                                                       // Esp authentication algorithm
        espEncryption: this.formInline.espEncryption.join(','),//esp加密协议
                                                               // Esp Encryption protocol
        id: this.formInline.ipsecId,
        ikeConsult: this.formInline.ikeConsult.join(','),//IKE协商模式
                                                         // IKE negotiation mode
        ikeEncryption: this.formInline.ikeEncryption.join(','),//IKE加密算法
                                                               // IKE encryption algorithm
        ikeIntegrity: this.formInline.ikeIntegrity.join(','),//IKE完整性算法
                                                             // IKE integrity algorithm
        ikeLifetime: this.formInline.ikeLifetime,//ike的sa超时时间
                                                 // Ike's SA timeout period
        ikeVersion: this.formInline.ikeVersion=1,//ike版本
                                                 // Ike version
        lifetime: this.formInline.lifetime,//ipsec的sa超时时间
                                           // The SA timeout of IPSEC
        packageMode: this.formInline.packageMode?1:0,//封装模式
                                                     // Encapsulation mode
        securityPro: this.formInline.securityPro?1:0,//安全协议
                                                     // Security protocols
      }
      // console.log(params)
      ipSecExtra(params).then(res=>{
        if(res.code==10000){
          this.close()
          this.$parent.getList()
          this.$message({
            type: "success",
            message: '新增成功'
          });
        }else{
          this.$message({
            type: "warning",
            message: '新增失败'
          });
        }
      })
    },
    chose(val){
      val==1?this.check1 = !this.check1:this.check2 = !this.check2
    },
    close(){
      this.$parent.grageSetShow = false
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  // Life cycle - Creation complete (you can access the current this instance)
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  // Life cycle - Mount complete (with access to DOM elements)
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
                     // Life cycle - before creation
  beforeMount() {}, //生命周期 - 挂载之前
                    // Life cycle - before mount
  beforeUpdate() {}, //生命周期 - 更新之前
                     // Life cycle - before updates
  updated() {}, //生命周期 - 更新之后
                // Life cycle - after update
  beforeDestroy() {}, //生命周期 - 销毁之前
                      // Life cycle - before destruction
  destroyed() {}, //生命周期 - 销毁完成
                  // Life cycle - Destruction complete
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
                 // If the page has keep-alive caching, this function fires
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
// @import url(); Introduce common CSS classes
.submit {
  width: 100%;
  text-align: center;
  padding-top: 20px;
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
.event {
  padding: 25px 20px 30px 20px;
  height: 826px;
  overflow: auto;
  .tabs-icon{
    display: inline-block;
    transform:rotate(45deg);
    width:8px;
    height:8px;
    background:rgba(54,120,200,1);
    margin-right: 5px;
  }
  h4{
    font-size:14px;
    font-family:arial, sans-serif;
    font-weight:500;
    color:rgba(51,51,51,1);
  }
  .sub-title{
      margin-top: 14px;
  }
}
.event::-webkit-scrollbar {
  width: 4px;
  /*height: 4px;*/
}
.event::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.event::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.grageSet {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.2);
  z-index: 100;
}
.context {
  width:677px;
  height:875px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 15px 30px 0px rgba(191, 198, 217, 0.15);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
</style>
<style lang="scss">
.grageSet{
    .el-checkbox__input.is-checked+.el-checkbox__label{
      color: rgba(51, 51, 51, 1);
    }
    .upload{
      .el-input__suffix-inner{
        background: #3678C8;
        color: white;
      }
    }
    .el-checkbox-group{
        width: 500px;
    }
    .last{
      .el-form-item{
        margin-bottom: 20px;
      }
    }
    .el-form-item{
        margin-bottom: 0px;
    }
    .el-form-item__label{
        font-size:14px;
        font-family:arial, sans-serif;
        font-weight:400;
        color:rgba(51,51,51,1);
    }
    .el-form-item__content{
        width: 300px;
    }
    .el-input{
      height: 34px;
      .el-input__inner {
        height: 100%;
        border-radius: 7px;
      }
      .el-input__icon {
        line-height: normal;
      }
    }
    .el-select{
        width: 100%;
    }
}
</style>