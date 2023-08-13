<!-- addIpsec.vue -->
<template>
  <div class="addIpsec">
    <div class="context">
      <h4 class="title">
        <span>{{$t('vsr1000.add')}} IPSEC</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="event">
        <el-form :inline="true" :model="formInline" :rules="rules" ref="form" class="demo-form-inline" label-width="120px">
          <el-form-item label="隧道名称" prop="name">
            <el-input v-model="formInline.name" placeholder="请填写名称"></el-input>
          </el-form-item>
          <el-form-item label="本端接口" prop="localport"
          :rules="[
            { required: true, message: '请输入', trigger: 'blur' },
            ]"
          >
            <el-select filterable v-model="formInline.localport" @change="logIp" placeholder="请选择">
              <el-option v-for="item in portList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="本段接口IP地址"
          :rules="[
            { required: true, message: '请输入', trigger: 'blur' },
            ]"
          >
            {{formInline.localip}}
            <!-- <el-select filterable v-model="formInline.localip" placeholder="请选择">
              <el-option label="200.1.1.1" value="shanghai"></el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item label="对端地址"
          prop="oppositeAddr"
          :rules="[
            { required: true, message: '请输入', trigger: 'blur' },
            ]"
          >
            <el-input v-model="formInline.oppositeAddr" placeholder="请填写名称"></el-input>
          </el-form-item>
          <el-form-item label="认证方式">
              <el-checkbox v-model="checked1" @change="chose(0)">密钥</el-checkbox>
              <el-checkbox v-model="checked2" @change="chose(1)">证书</el-checkbox>
          </el-form-item>
          <el-form-item label="">
            <div style="width:200px"></div>
          </el-form-item>
          <el-form-item label="证书上传" v-show="!checked1"
          > 
            <span class="upload">
              <!-- <el-input v-model="formInline.file" placeholder="请填写名称" suffix-icon="el-icon-more"></el-input> -->
              <input type="file" ref="addFile" class="file"> 
            </span>
            <!-- <input type="file" class="file">  -->
          </el-form-item>
          <el-form-item label="预共享密钥" v-show="!checked2"
          prop="shareKey"
          :rules="[
            { required: !checked2, message: '请输入', trigger: 'blur' },
            ]"
          > 
            <span class="upload">
              <el-input v-model="formInline.shareKey" placeholder="IP地址/字符串"></el-input>
            </span>
          </el-form-item>
          <el-form-item label="本端ID"
          prop="selfID"
          :rules="[
            { required: true, message: '请输入', trigger: 'blur' },
            ]"
          >
            <el-input v-model="formInline.selfID" placeholder="IP地址/字符串"></el-input>
          </el-form-item>
          <el-form-item label="对端ID"
          prop="oppositeID"
          :rules="[
            { required: true, message: '请输入', trigger: 'blur' },
            ]"
          >
            <el-input v-model="formInline.oppositeID" placeholder="IP地址/字符串"></el-input>
          </el-form-item>
          <el-form-item label="本端子网"
          prop="selfSubnet"
          :rules="[
            { required: true, message: '请输入', trigger: 'blur' },
            ]"
          >
            <el-input v-model="formInline.selfSubnet" placeholder="IP+掩码"></el-input>
          </el-form-item>
          <el-form-item label="对端子网"
          prop="oppositeSubnet"
          :rules="[
            { required: true, message: '请输入', trigger: 'blur' },
            ]"
          >
            <el-input v-model="formInline.oppositeSubnet" placeholder="IP+掩码"></el-input>
          </el-form-item>
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
import { ipSecCanNameUse,addIpsec } from '@/services'
import axios from 'axios'
import { getToken } from "@/utils/cookie";
export default {
  //import引入的组件需要注入到对象中才能使用
  // Import introduces components that need to be injected into an object before they can be used
  components: {},
  data() {
    var checkName = (rule, value, callback)=>{
      ipSecCanNameUse({ verifyName:value,verifyScope:this.deviceId,verifyId:null }).then(res=>{
        if(res.code==10000){
          callback()
        }else{
          callback(new Error('该名称已使用'))
        }
      })
    }
    return {
      devSerialNum:JSON.parse(this.$route.query.devData).vsrSeries,
      checked1: true,
      checked2: false,
      deviceId: JSON.parse(this.$route.query.devData).deviceId,
      portList: [],
      formInline: {
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
      },
      rules:{
        name: [
          { required: true, message: "请输入正确的名称", trigger: "blur" },
          { validator: checkName, trigger: "change" }
        ],
      }
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
    save(formName){
      var formData = new FormData() // 声明一个FormData对象
                                    // Declare a FormData object
      var formData = new window.FormData() // vue 中使用 window.FormData(),否则会报 'FormData isn't definded'
                                           // Use window.FormData() in vUE, otherwise it will say 'FormData isn't definded'
      var file = this.$refs.addFile.files[0]
      formData.append('file', file==undefined?'':file)
      // console.log(formData, document.querySelector('input[type=file]'))

      let params = {
        	"approve": this.checked1?0:1,//认证方式
                                      // authentication
          "devSerialNum": JSON.parse(this.$route.query.devData).vsrSeries,//设备序列号
                                                                          // Device serial number
          "deviceId": this.$parent.deviceId,//设备id
                                            // Device id
          "dhGroup": 2,//DH组
                       // DH group
          "dpd": 0,//dpd对端状态检测
                   // DPD state detection
          "dpdAction": 0,
          "dpdDelay": 0,
          "dpdTimeout": 0,
          "espAuthentication": "SHA1,SHA2",//esp认证算法
                                           // Esp authentication algorithm
          "espEncryption": "AES192,AES128",//	esp加密协议
                                           // Esp Encryption protocol
          "id": "",
          "ikeConsult": 0,//	ike协商模式
                          // Ike negotiation mode
          "ikeEncryption": "AES128",//	ike加密算法
                                    // Ike encryption algorithm
          "ikeIntegrity": "SHA1,MD5",//	ike完整性算法
                                     // Ike integrity algorithm
          "ikeLifetime": 86400,//	ike的SA超时时间
                               // Ike's SA timeout period
          "ikeVersion": 1,//	IKE版本
                          // IKE version
          "lifetime": 3600,//	IPSec的SA超时时间
                           // The SA timeout of IPSec
          "name": this.formInline.name,//隧道名称
                                       // The name of the tunnel
          "oppositeAddr": this.formInline.oppositeAddr,//对端地址
                                                       // To end the address
          "oppositeID": this.formInline.oppositeID,//对端ID
                                                   // The client ID
          "oppositeSubnet": this.formInline.oppositeSubnet,//对端子网
                                                           // The terminal network
          "packageMode": 1,//	封装模式
                           // Encapsulation mode
          "securityPro": 1,//	安全协议
                           // Security protocols
          "selfID": this.formInline.selfID,//本端ID
                                           // The client ID
          "selfIpv4": this.formInline.localip,//本端IP
                                              // The end of the IP
          "selfPort": this.formInline.localport,//本端接口
                                                // This end interface
          "selfSubnet": this.formInline.selfSubnet,//本端子网
                                                   // This terminal network
          "shareKey": this.formInline.shareKey,//预共享密钥
                                               // Preshared key
      }
      Object.entries(params).map(item=>{
        formData.append(item[0],item[1])
      })
      // formData.append(params)
      // console.log(formData)
      this.$refs[formName].validate(valid => {
        if(valid){
          if(!this.checked1){
            if(file==undefined){
              this.$message({
                type: "warning",
                message: '请选择证书上传'
              });
            }else{
              axios({
                url: '/vsm/ipSec/addOrFlush',
                data: formData,
                method: 'post',
                headers: { 
                  'Content-Type': 'multipart/form-data',
                  accessToken: getToken()
                }
              }).then(res=>{
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
            }
          }else{
            axios({
              url: '/vsm/ipSec/addOrFlush',
              data: formData,
              method: 'post',
              headers: { 
                'Content-Type': 'multipart/form-data',
                accessToken: getToken()
              }
            }).then(res=>{
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
          }
        }else{

        }
      })
    },
    logIp(val){
      this.portList.map(item=>{
        if(item.id==val){
          this.formInline.localip = item.name.split('-')[1]
        }
      })
    },
    chose(val){
      val==1?this.checked1 = !this.checked1:this.checked2 = !this.checked2
    },
    close(){
      this.$parent.addShow = false
      this.formInline.localip = ""
      this.$refs.form.resetFields();
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
  padding: 30px 30px 30px 50px;
}
.addIpsec {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.2);
  z-index: 100;
}
.context {
  min-width: 880px;
  min-height: 491px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 15px 30px 0px rgba(191, 198, 217, 0.15);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  // margin-top: -440px;
  // margin-left: -245.5px;
  transform: translate(-50%, -50%);
  overflow: auto;
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
.addIpsec{
    .upload{
      .el-input__suffix-inner{
        background: #3678C8;
        color: white;
      }
    }
    .el-form-item{
        margin-bottom: 26px;
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