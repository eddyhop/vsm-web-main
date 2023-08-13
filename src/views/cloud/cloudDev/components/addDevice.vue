<template>
    <div class="addDev">
        <div class="content">
            <h4 class="title">
                <span>{{$t('cloudDev.add')}}{{$t('cloudDev.second')}}</span>
                <i class="close" @click="close"></i>
            </h4>
            <div class="event">
                <el-form
                :model="ruleForm"
                :rules="rules"
                ref="form"
                label-width="100px"
                class="demo-ruleForm"
                :inline="true"
                >
                    <el-form-item :label="$t('cloudDev.connect')" prop="sequenceCode" label-width="110px">
                        <el-select filterable v-model="ruleForm.sequenceCode" :placeholder="$t('cloudDev.remind[0]')" @change="changeCode(ruleForm.sequenceCode)">
                            <el-option 
                            v-for="item in codeList" 
                            :key="item.deviceSerialNumber" 
                            :label="item.deviceSerialNumber" 
                            :value="item.deviceSerialNumber"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('cloudDev.cloudDevice')" prop="instanceName" label-width="100px">
                        <el-input v-model="ruleForm.instanceName" disabled></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('cloudDev.submit')" prop="manufacturerName" label-width="110px">
                        <el-select filterable v-model="ruleForm.manufacturerName" :placeholder="$t('cloudDev.remind[0]')" @change="startgetList()">
                            <el-option 
                            v-for="item in Types" 
                            :key="item.value" 
                            :label="item.label" 
                            :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('cloudDev.account')" prop="cloudAccountId" label-width="90px">
                        <el-select filterable v-model="ruleForm.cloudAccountId" :placeholder="$t('cloudDev.remind[0]')" @change="getVpc()">
                            <el-option 
                            v-for="item in cloudAccountList" 
                            :key="item.id" 
                            :label="item.accountName" 
                            :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('cloudDev.please')" prop="regionId" label-width="110px">
                        <el-select filterable v-model="ruleForm.regionId" :placeholder="$t('cloudDev.remind[0]')" @change="getVpc()">
                            <el-option 
                            v-for="item in regionList" 
                            :key="item.regionId" 
                            :label="item.localName" 
                            :value="item.regionId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="VPC ID" prop="vpcId" label-width="90px">
                        <el-select filterable v-model="ruleForm.vpcId" :placeholder="$t('cloudDev.remind[0]')" @change="getSubnet()">
                            <el-option 
                            v-for="item in vpcList" 
                            :key="item.vpcId" 
                            :label="item.vpcId" 
                            :value="item.vpcId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Public Subnet" prop="subNetId" label-width="110px">
                        <el-select filterable v-model="ruleForm.subNetId" :placeholder="subnetTit" :disabled="Hassubnet">
                            <el-option 
                            v-for="item in subnetList" 
                            :key="item.subnetId" 
                            :label="item.cidrBlock" 
                            :value="item.subnetId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('cloudDev.example')" prop="instanceType" label-width="90px">
                        <el-select filterable v-model="ruleForm.instanceType" :placeholder="$t('cloudDev.remind[0]')">
                            <el-option 
                            v-for="item in caseList" 
                            :key="item.name" 
                            :label="item.name" 
                            :value="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('cloudDev.key')" prop="keyName" label-width="110px" class="keying">
                        <el-select filterable v-model="ruleForm.keyName" :placeholder="$t('cloudDev.remind[0]')" class="plus_input">
                            <el-option 
                            v-for="item in keyList" 
                            :key="item.keyName" 
                            :label="item.keyName" 
                            :value="item.keyName"></el-option>
                        </el-select>
                        <div class="plusing" @click="addKey()"><i class="el-icon-plus"></i></div>
                    </el-form-item>
                </el-form>
            </div>
            <div class="submit">
                <button
                class="save"
                type="primary"
                @click.prevent="submitForm('form')"
                >{{$t('cloudDev.confirm')}}</button>
                <button class="cancel" @click="close">{{$t('cloudDev.cancel')}}</button>
            </div>
        </div>
        <addKey v-show="isShowKey"></addKey>
    </div>
</template>

<script>
    import addKey from "./addKey"
    import { getAccountByType, getRegionList, getVpcList, getPublicSubnet, getKeys, addDevice,findAllCloudDeviceSerialNumbers,cloudDevice} from "@/services"
    export default {
        components:{
           addKey 
        },
        data() {
            var checkName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error( this.$t('cloudDev.remind[3]')));
                }
                else {
                    let params={deviceName:value}
                    cloudDevice(params).then(res=>{
                        if(res.code==10000){
                            callback();
                        }else{
                            callback(new Error( this.$t('cloudDev.remind[2]')));
                        }
                    })
                }
            }
            return {
                cloudAccountList:[],    //云账号列表
                                        // Cloud account List
                regionList:[],          //地域列表
                                        // Regional list
                vpcList:[],             //VPC ID列表
                                        // VPC ID list
                subnetList:[],          //子网列表
                                        // Subnet list
                keyList:[],             //密钥对列表
                                        // Key pair list
                // codeList:[{code:"11113323421"}],            //序列号列表
                // CodeList :[{Code :"11113323421"}], serial number list
                codeList:[],            //序列号列表
                                        // Serial number list
                caseList:[              //实例类型列表
                                        // List of instance types
                    {name:"c5.large"},
                    {name:"c5.xlarge"},
                    {name:"c5.2xlarge"},
                    {name:"c5.4xlarge"},
                    {name:"c5.9xlarge"},
                    {name:"c5.18xlarge"},
                    {name:"c4.large"},
                    {name:"c4.xlarge"},
                    {name:"c4.2xlarge"},
                    {name:"c4.4xlarge"},
                    {name:"c4.8xlarge"},
                ],   
                tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '': JSON.parse(sessionStorage.getItem("userData")).tenantId,
                ruleForm:{
                    manufacturerName:"",
                    cloudAccountId:"",      //云账户ID
                                            // Cloud account ID
                    createBy:JSON.parse(sessionStorage.getItem("userData")).username, //创建人
                                                                                    // founder
                    imageId:"ami-099b9fc6e13a61bb3",             //镜像ID
                                                                 // Mirror ID
                    instanceName:"",        //设备名称
                                            // Device name
                    instanceType:"",        //设备类型
                                            // Device type
                    keyName:"",             //密钥对名称
                                            // Key pair name
                    regionId:"",            //地域
                                            // regional
                    sequenceCode:"",        //序列码
                                            // Sequence code
                    subNetId:"",            //子网ID
                                            // Subnet ID
                    vpcId:"",               //vpc ID
                    vpcNetSegment:"",       //vpc网段 
                                            // VPC network segment
                },
                isShowKey:false,
                rules:{
                    manufacturerName: [{ required: true, message: this.$t('cloudDev.remind[0]'), trigger: "change" }],
                    cloudAccountId: [{ required: true, message:  this.$t('cloudDev.remind[0]'), trigger: "change" }],
                    regionId: [{ required: true, message:  this.$t('cloudDev.remind[0]'), trigger: "change" }],
                    vpcId: [{ required: true, message: this.$t('cloudDev.remind[0]'), trigger: "change" }],
                    subNetId: [{ required: true, message:  this.$t('cloudDev.remind[0]'), trigger: "change" }],
                    keyName: [{ required: true, message:  this.$t('cloudDev.remind[0]'), trigger: "change" }],
                    sequenceCode: [{ required: true, message:  this.$t('cloudDev.remind[0]'), trigger: "change" }],
                    instanceName: [
                        { required: true, message:  this.$t('cloudDev.remind[3]'), trigger: "blur" },
                        // {validator: checkName, trigger: 'change' }
                    ],
                    instanceType: [{ required: true, message:  this.$t('cloudDev.remind[0]'), trigger: "change" }],
                },
                //全部服务器类型
                // All server types
                Types:[
                    {value:"AWS_CHINA",label:"AWS中国"},
                    // {value:"AWS",label:"AWS"},
                    // {value:"AZURE",label:"Azure"},
                    // {value:"ALIBABACLOUD",label:"阿里云"},
                    // {value:"ALIBABACLOUD", Label :" Aliyun "},
                ],  
                subnetTit:"请选择",
                Hassubnet:false,
            }
        },
        methods: {
            //选择关联序列号对应云设备名称
            // Select the associated serial number to correspond to the cloud device name
            changeCode(val){
                this.ruleForm.instanceName =  this.codeList.find(item=>item.deviceSerialNumber == val).deviceName
            },
            //清空
            // empty
            emptyAll(){
                this.ruleForm.cloudAccountId = "";
                this.ruleForm.instanceType = "";
                this.ruleForm.keyName = "";
                this.ruleForm.regionId = "";
                // this.ruleForm.sequenceCode = "";
                this.ruleForm.subNetId = "";
                this.ruleForm.vpcId = "";
            },
            close(){
                this.$parent.isShowAdd = false;
                this.$refs.form.resetFields();
                this.subnetTit = "请选择"
                this.Hassubnet = false;
            },
            //点击创建的 " + " 号
            // Click the "+" sign created
            addKey(){
                if(this.ruleForm.regionId != "" && this.ruleForm.cloudAccountId != ""){
                    this.isShowKey = true
                }else{
                    this.$message.warning( this.$t('cloudDev.remind[0]'))
                }
            },
            //根据获取云账号、地域
            // According to access to cloud accounts, location
            async startgetList(){
                this.emptyAll();
                getAccountByType({
                    cloudType:this.ruleForm.manufacturerName,
                    tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '': JSON.parse(sessionStorage.getItem("userData")).tenantId,
                }).then(res => {
                    if(res.code === 10000){
                        this.cloudAccountList = res.result;
                    }
                })
                getRegionList({
                    cloudType:this.ruleForm.manufacturerName,
                    tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '': JSON.parse(sessionStorage.getItem("userData")).tenantId,
                }).then(res => {
                    if(res.code === 10000){
                        this.regionList = res.result;
                    }
                })

            },
            //获取VPC ID、 密钥对
            // Get the VPC ID and key pair
            getVpc(){
                if(this.ruleForm.cloudAccountId != "" && this.ruleForm.regionId != ""){
                    this.ruleForm.vpcId = "";
                    this.ruleForm.keyName = "";
                    this.ruleForm.subNetId = "";
                    getVpcList({
                        cloudAccountId:this.ruleForm.cloudAccountId,
                        regionId:this.ruleForm.regionId,
                    }).then(res => {
                        if(res.code === 10000){
                            this.vpcList = res.result;
                        }
                    })
                    this.getKeyList();
                }
            },
            //获取密钥对
            // Get key pair
            getKeyList(){
                getKeys({
                    cloudAccountId:this.ruleForm.cloudAccountId,
                    regionId:this.ruleForm.regionId,
                }).then(res => {
                    if(res.code === 10000){
                        this.keyList = res.result;
                    }
                })
            },
            //获取子网
            // To obtain a subnet
            getSubnet(){
                this.ruleForm.subNetId = "";
                let Index = this.vpcList.findIndex((v,i) => {
                    return this.ruleForm.vpcId == v.vpcId;
                })
                this.ruleForm.vpcNetSegment = this.vpcList[Index].cidrBlock;
                getPublicSubnet({
                    cloudAccountId:this.ruleForm.cloudAccountId,
                    regionId:this.ruleForm.regionId,
                    vpcId:this.ruleForm.vpcId,
                }).then(res => {
                    if(res.code === 10000){
                        this.subnetList = res.result;
                        if(res.result == null){
                            this.subnetTit = "该VPC下暂无子网,请重新选择VPC"
                            this.Hassubnet = true;
                        }else{
                            this.subnetTit = "请选择"
                            this.Hassubnet = false;
                        }
                    }
                })
            },
            //确定创建设备回调
            // Be sure to create a device callback
            submitForm(formName){
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        addDevice(this.ruleForm).then(res => {
                            if(res.code === 10000){
                                this.close();
                                this.$parent.getDevList();
                                this.$message.success( this.$t('cloudDev.remind[4]'));
                            }else{
                                this.$message.error(res.message);
                            }
                        })
                    }
                })
            },
        },
    }
</script>

<style lang="scss" scoped>
.addDev {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(176, 181, 194, 0.3);
  z-index: 100;
}
.content {
  width: 880px;
  height: 447px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 15px 30px 0px rgba(191, 198, 217, 0.15);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
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
      background: url("../../../../assets/icon_close.png") no-repeat;
      background-size: cover;
      cursor: pointer;
    }
  }
}
.event {
  padding: 30px;
  overflow: hidden;
  padding-bottom:0px;
}
.submit {
  width: 100%;
  text-align: center;
  position: relative;
  .save {
    position: absolute;
    left:342px;
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
    // margin-left: 18px;
    z-index: 99999;
  }
  .cancel {
      position: absolute;
      left:460px;
    width: 70px;
    height: 34px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    border: 1px solid rgba(209, 215, 224, 1);
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    // margin-left: 18px;
    cursor: pointer;
    z-index: 99999;
  }
  .save:hover {
    background: rgba(96, 149, 214, 1);
    border: 0;
  }
}

</style>
<style lang="scss">
    .addDev .event .el-select{
        width: 300px;
        height: 34px;
    }
    .addDev .event .el-input {
        width: 300px;
        height: 34px;
        .el-input__inner {
            height: 100%;
        }
        .el-input__icon {
            line-height: normal;
        }
    }
    .addDev .event .plus_input .el-input{
        width:252px;
    }
    .addDev .keying{
        position: relative;
    }
    .addDev .plusing{
        position: absolute;
        right:0;
        top:4px;
        width:34px;
        height:34px;
        background:rgba(255,255,255,1);
        border-radius:2px;
        border:1px solid rgba(209,215,224,1);
        text-align: center;
        line-height: 34px;
        color:#3678C8;
        cursor: pointer;
        font-size: 18px;
        i{
            font-weight: 700;
        }
    }
    .addDev .el-form{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
    .addDev .el-form--inline .el-form-item {
        margin-right: 0px;
    }
    .addDev .el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label-wrap>.el-form-item__label:before, .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before {
        content: '' !important;
        color: #F56C6C;
        margin-right: 4px;
    }
</style>