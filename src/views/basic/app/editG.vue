<template>
  <div class="addACL">
    <div class="context">
      <h4 class="title">
        <span>{{$t('App.editApplication')}}</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="event">
        <el-form
            :model="editForm"
            :rules="rules"
            ref="form"

            class="demo-editForm"
            :inline="true"
            @submit.native.prevent
            label-width="180px"
        >
          <el-form-item style="width:50%" :label="$t('App.name')" prop="appName">
            <el-input v-model="editForm.appName" placeholder></el-input>
          </el-form-item>
          <el-form-item style="width:50%" :label="$t('App.description')" prop="appDescription">
            <el-input v-model="editForm.appDescription" placeholder ></el-input>
          </el-form-item>
          <el-form-item style="width:50%" :label="$t('App.matchingCriteria')" prop="matchingCriteria">
            <el-select filterable disabled v-model="editForm.matchingCriteria" :placeholder="$t('vsr1000.choose')">
              <el-option value="ACL">ACL</el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width:50%" :label="$t('App.applicationGroups')" prop="apps">
            <el-select filterable v-model="editForm.apps" :placeholder="$t('vsr1000.choose')">
              <el-option
                  v-for="item in AppNames"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width:50%" :label="$t('App.applicationPriority')" prop="appPriority" >
            <el-input class="numberNt" v-model="editForm.appPriority"    ></el-input>
          </el-form-item>
          <el-form-item style="width:50%; margin-right:0"
                          label="DSCP"
                          prop="appDscp"
                          :rules="[{ required: true, message: $t('vsr1000.aclremind[20]'), trigger: 'change' }]"
          >
            <!--- DSCP --->
            <el-select filterable v-model="editForm.appDscp" :placeholder="$t('vsr1000.choose')">
              <el-option
                  v-for="item in dscpOperation"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <!--- Protocol --->
          <el-form-item  style="width:50%; margin-right:0"
                          :label="$t('App.protocol')"
                          prop="protocol"
                          :rules="[{ required: true, message: $t('vsr1000.aclremind[21]'), trigger: 'change' }]"
          >
            <el-select filterable v-model="editForm.protocol" :placeholder="$t('vsr1000.choose')" @change="DisSourcePortFn(editForm.protocol,0)">
              <el-option
                  v-for="item in protoOperation"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item style="width:50%; margin-right:0"
                          :label="$t('App.sourceIP')"
                          prop="sIp"
                        :rules="[
            {
              required: true,
              message:  $t('vsr1000.importSourceIp'),
              trigger: 'blur'
            },
            {
              pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]?|3[0-2])$/,
              message:  $t('vsr1000.aclremind[11]'), trigger: 'blur'
            }]"
          >
            <el-input
                v-model="editForm.sIp"
                @blur="SourceIpChange(editForm.sIp,editForm.sourcePort,0)"
            ></el-input>
          </el-form-item>
          <el-form-item style="width:50%; margin-right:0"
                          :label="$t('App.sourcePort')"
                          prop="sourcePort"
                          :rules="[
                {
              required: !editForm.dis,
              message:  $t('App.hint13'),
              trigger: 'blur'
            },
            {
              pattern: /(^[0-9]\d{0,3}$)|(^[1-5]\d{4}$)|(^6[0-4]\d{3}$)|(^65[0-4]\d{2}$)|(^655[0-2]\d$)|(^6553[0-5]$)/,
              message:  $t('App.hint22'), trigger: 'blur'
            }]"
          >
            <el-input
              :disabled="editForm.dis"
                v-model="editForm.sourcePort"
                placeholder1
            ></el-input>
          </el-form-item>
          <el-form-item style="width:50%; margin-right:0"
                          :label="$t('App.destinationIP')"
                          prop="dIp"
                          :rules="[
                {
              required: true,
              message:  $t('vsr1000.importDestinationIp'),
              trigger: 'blur'
            },
            {required: true,
              pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]?|3[0-2])$/,
              message:  $t('vsr1000.aclremind[18]'), trigger: 'blur'
            }]"
          >
            <el-input
                v-model="editForm.dIp"
                @blur="aimIpChange(editForm.dIp,editForm.destinationPort,0)"
                placeholder
            ></el-input>
          </el-form-item>
          <el-form-item style="width:50%; margin-right:0"
                          :label="$t('App.DesPort')"
                          prop="destinationPort"
                          :rules="[
                {
              required: !editForm.dis,
              message:  $t('App.hint14'),
              trigger: 'blur'
            },
            {
              pattern: /(^[0-9]\d{0,3}$)|(^[1-5]\d{4}$)|(^6[0-4]\d{3}$)|(^65[0-4]\d{2}$)|(^655[0-2]\d$)|(^6553[0-5]$)/,
              message:  $t('App.hint22'), trigger: 'blur'
            }]"
          >
            <el-input
                :disabled="editForm.dis"
                v-model="editForm.destinationPort"
                placeholder
            ></el-input>
          </el-form-item>
          <div class="submit">
            <button
                class="save"
                type="primary"
                v-debounce.prevent="submitForm"
            >{{$t('vsr1000.save')}}</button>
            <button class="cancel" @click.prevent="close">{{$t('vsr1000.cancel')}}</button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {
  APPGetSelect,
  applySet, appNamExit, isPriorityExist,
} from "@/services";
import { compare } from "@/utils/change";
export default {
  props: {
    editGShow: {
      type: Boolean,
    },
  },
  components: {},
  data() {

    var isIpExist = (rule, value, callback) => {

      callback();
    };
    var sourIsIpExist = (rule, value, callback) => {
      callback();
    };
    var priorityExist = (rule, value, callback) => {
      if (value || value == 0) {
        let len = 0;
        if(this.editForm.priority == value){
          len++;
        }
        if(len > 1){
          callback(new Error(this.$t('App.existsPriority')))
        }else{
          callback();
        }
      } else {
        callback();
      }
    };
    var checkPriority = (rule, value, callback) => {
      if (value) {
        if(this.editForm.appPriority != this.editForm.oldAppPriority){
          isPriorityExist({ verifyName: value, verifyScope: this.tenantId, verifyId: "",priority: this.editForm.appPriority }).then(res => {
            if(res.code==10000){
              callback()
            }else{
              callback(new Error(this.$t('App.existsPriority')))
            }
          });
        }else{
          callback()
        }
      }
    };

    var checkName = (rule, value, callback) => {
      if (value) {
        appNamExit({ verifyName: value, verifyScope: this.tenantId, verifyId: this.editForm.id}).then(res => {
          if(res.code==10000){
            callback()
          }else{
            callback(new Error(this.$t('App.existsName')))
          }
        });
      }

    };
    return {
      sourcePortInfo:[
        {required: true,pattern:/(^[1-9]\d{0,3}$)|(^[1-5]\d{4}$)|(^6[0-4]\d{3}$)|(^65[0-4]\d{2}$)|(^655[0-2]\d$)|(^6553[0-5]$)/, message: this.$t('vsr1000.aclremind[10]'),trigger: 'change'},
      ],
      // deviceId: JSON.parse(this.$route.query.devData).deviceId,
      editForm: {
        id:"",
        tenantId:"",
        appName: "",
        appDescription: "",
        matchingCriteria: [],
        appId:"",
        apps: [],
        appPriority:"",
        oldAppPriority:"",
        eantryId:"",
        //DSCP
        appDscp: "",
        //协议
        protocol: "",
        //源IP
        sIp: null,
        //源端口
        sourcePort: "",
        //目标地址
        dIp: "",
        //目的端口
        destinationPort: null,
        //优先级
        priority:"",
        dis:false,
      },
      rules: {
        appName: [
          {
            required: true,
            message: this.$t("vsr1000.aclremind[19]"),
            trigger: "blur",
          },{validator:checkName, trigger: "blur" }
        ],
        applicationPriority:[
          {
            required: true,
            message: this.$t("vsr1000.aclremind[8]"),
            trigger: "blur",
          }
        ],
        appPriority: [
          {
            required: true,
            message: this.$t("vsr1000.aclremind[17]"),
            trigger: "blur",
          },{
            pattern:/(^[1-9]\d{0,3}$)|(^[1-5]\d{4}$)|(^6[0-4]\d{3}$)|(^65[0-4]\d{2}$)|(^655[0-2]\d$)|(^6553[0-5]$)/,
            message: this.$t('vsr1000.aclremind[10]'),trigger: 'blur'}
          ,{
            validator: checkPriority , trigger: "blur"
          }
        ],
      },
      isIpExist: { validator: isIpExist, trigger: "blur" },
      sourIsIpExist: { validator: sourIsIpExist, trigger: "blur" },
      priorityExist: {validator: priorityExist, trigger: "blur" }  ,
      ActItem: [],
      AppNames: [],
      protoOperation: [],
      dscpOperation: [],
      alcList:[{ name:"ACL", id:"ACL" }],
      tenantId:this.$parent.rent,
    };
  },
  computed: {},
  methods: {
    DisSourcePortFn(row,index){
      var name=''
      this.protoOperation.map(r=>{
        if(r.id==row){
          name=r.name
        }
      })
      if(name == 'ICMP'){
        this.editForm.sourcePort = '';
        this.editForm.destinationPort = '';
        this.editForm.dis = true;
      }else{
        this.editForm.dis = false;
      }
    },
    //输入掩码源ip转换
    // Input mask source IP conversion
    // Input mask source IP conversion
    zhuanSourceIp(ip, code, index) {
      if (ip.length) {
        let reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (reg.test(ip)) {
          if (code == 32) {
            return;
          } else {
            this.editForm.sourceIp = compare(
                ip,
                code
            );
          }
        }
      }
    },
    //输入源ip转换
    // Input source IP conversion
    // Input source IP conversion
    SourceIpChange(ip, code, index) {
      if (code != "") {
        let reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (reg.test(ip)) {
          if (code == 32) {
            return;
          } else {
            this.editForm.sourceIp = compare(
                ip,
                code
            );
          }
        }
      }
    },
    //输入掩码目的地ip转换
    // Input mask destination IP conversion
    // Input mask destination IP conversion
    zhuanAimIp(ip, code, index) {
      if (ip.length) {
        let reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (reg.test(ip)) {
          if (code == 32) {
            return;
          } else {
            this.editForm.aimIp = compare(ip, code);
          }
        }
      }
    },
    //输入目的地ip转换
    // Enter the destination IP conversion
    // Input destination IP conversion
    aimIpChange(ip, code, index) {
      if (code != "") {
        let reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (reg.test(ip)) {
          if (code == 32) {
            return;
          } else {
            this.editForm.aimIp = compare(ip, code);
          }
        }
      }
    },
    close() {
      this.$refs.form.resetFields();
      this.$parent.editGShow = false;
    },
    submitForm(formName) {
      let arr = [];
      arr.push({
        dscp: this.editForm.appDscp,
        protocol: this.editForm.protocol,
        sourceIp: this.editForm.sIp,
        sourcePort:  this.editForm.sourcePort,
        destinationIp: this.editForm.dIp,
        destinationPort: this.editForm.destinationPort,
        sortOrder: 0,
      });
      let data = {
        id : this.editForm.id,
        appId : this.editForm.appId,
        appName: this.editForm.appName,
        appPriority:this.editForm.appPriority,
        appDescription: this.editForm.appDescription,
        appEantryList: arr,
        tenantId:this.tenantId,
        randomId: parseInt((Math.random() + 1) * Math.pow(10, 6 - 1)),
        apps:this.editForm.apps,
        matchingCriteria:this.editForm.matchingCriteria,
      };
      this.$refs[formName].validate((valid) => {
        if (valid) {
          applySet(data).then((res) => {
            // console.log(res);
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.aclremind[0]"),
              });

              this.$refs[formName].resetFields();
              this.$parent.editGShow = false;
              this.$parent.getApply();
            } else {
              this.$message({
                type: "warning",
                message: res.message,
              });

            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async selectList() {
      let data2 = await APPGetSelect({
        tenantId: this.tenantId,
      });
      this.ActItem = data2.result.acl;
      this.AppNames = data2.result.apps;
      this.protoOperation = data2.result.proto;
      this.dscpOperation = data2.result.dscp;
    },
  },
  created() {},
  mounted() {
    // this.addBtnPosition()
   // this.tabsDrop();
  },
};
</script>
<style scoped lang="scss">
.addACL {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.2);
  z-index: 100;
}
.context {
  width: 1000px;
  // height: 683px;
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
      background: url("../../../assets/icon_close.png") no-repeat;
      background-size: cover;
      cursor: pointer;
    }
  }
}
.event {
  padding: 30px 60px 30px 60px;
}
.submit {
  width: 100%;
  padding-top: 30px;
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
.tabsCon {
  width: auto;
  position: relative;
  #addBtn {
    width: 30px;
    height: 30px;
    position: absolute;
    top: 0;
    left: -38px;
    > button {
      width: 100%;
      height: 100%;
      line-height: 30px;
      border: 0;
      font-size: 34px;
      padding: 0;
    }
  }
}
</style>
<style lang="scss">
.addACL {

  .el-input {
    width: 250px;
    height: 34px;
    .el-input__inner {
      height: 100%;
      border-radius: 7px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
  .el-form-item__label {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
  .el-textarea {
    width: 300px;
    height: 34px;
    .el-textarea__inner {
      height: 100%;
      border-radius: 7px;
    }
  }
  .el-tabs__header {
    margin-bottom: 0;
    border: 0;
    .el-tabs__nav-prev,
    .el-tabs__nav-next {
      width: 20px;
      height: 100%;
      z-index: 100;
      line-height: 30px;
      text-align: center;
    }
  }
  .el-tabs--card > .el-tabs__header {
    border: 0;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border: 0;
  }
  .el-form--inline .el-form-item {
    margin-right: 0;
  }
  .el-tabs__content {
    background: #f4f8fe;
    padding-top: 26px;
    padding-left: 40px;
    .el-input {
      width: 240px;
    }
    .el-form-item {
      margin-right: 18px;
    }
  }
  .el-tabs__item {
    padding: 0 16px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(49, 104, 172, 1);
    background: rgba(244, 248, 254, 1);
    border-radius: 7px 2px 0px 0px;
    border: 1px solid rgba(213, 219, 227, 1);
  }

  .el-tabs--card > .el-tabs__header .el-tabs__item:first-child {
    border-left: 1px solid rgba(213, 219, 227, 1);
  }
}
input[type=number] {
    -moz-appearance:textfield;
}
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
