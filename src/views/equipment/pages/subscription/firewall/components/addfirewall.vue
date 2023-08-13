<template>
  <div class="editStatic">
    <div class="context">
      <div class="title">
        {{$t('subscription.firewall.addfirewall')}}
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
          <el-form-item :label="$t('subscription.firewall.name')" prop="name">
            <div class="item-ipt">
              <el-input
                  v-model="form.name"
                  :placeholder="$t('subscription.firewall.name')"
                  size="small"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item :label="$t('subscription.firewall.description')" prop="description">
            <div class="item-ipt">
              <el-input
                  v-model="form.description"
                  :placeholder="$t('subscription.firewall.description')"
                  size="small"
              ></el-input>
            </div>
          </el-form-item>

          <el-form-item :label="$t('subscription.firewall.interface')" prop="interface">
            <div class="item-ipt">
              <el-select filterable v-model="form.interface" :placeholder="$t('subscription.firewall.interface')" size="small">
                <el-option
                    v-for="item in port"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>

          <el-form-item :label="$t('subscription.firewall.applicationGroup')" prop="appGroup">
            <div class="item-ipt">
              <el-select filterable clearable v-model="form.appGroup"  :disabled="appGD" @change="selAPPG()" :placeholder="$t('subscription.firewall.applicationGroup')" size="small">
                <!-- <el-option key="" label="" value="" ></el-option> -->
                <el-option
                    v-for="item in appG"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item :label="$t('subscription.firewall.application')" prop="application">
            <div class="item-ipt">
              <el-select filterable clearable v-model="form.application"  :disabled="appD"  @change="selApp()"   :placeholder="$t('subscription.firewall.application')" size="small">
                <!-- <el-option key="" label="" value="" ></el-option> -->
                <el-option
                    v-for="item in app"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item :label="$t('subscription.firewall.direction')" prop="direction">
            <div class="item-ipt">
              <el-select filterable v-model="form.direction" :placeholder="$t('subscription.firewall.direction')" size="small" disabled>
                <el-option
                    v-for="item in directionList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item :label="$t('subscription.firewall.action')" prop="action">
            <div class="item-ipt">
              <el-select filterable v-model="form.action" :placeholder="$t('subscription.firewall.action')" size="small">
                <el-option
                    v-for="item in actionList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item :label="$t('subscription.firewall.prioruty')" prop="priority">
            <div class="item-ipt">
              <el-input v-model.number="form.priority" size="small" :placeholder="$t('subscription.firewall.prioruty')" ></el-input>
            </div>
          </el-form-item>
          <div class="contr">
            <button :disabled="buttomShow" type="primary" v-debounce="save" class="save">{{$t('subscription.save')}}</button>
            <button @click.prevent="close" class="cancel">{{$t('subscription.cancel')}}</button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {
  firewalldIsOnlyName,
  firewalldAddOrEdit,
  GetFirewalldSel,
  firewalldIsOnlyApp,
  firewalldIsOnlyPriority
} from "@/services";
export default {
  data() {
    var NumRule = (rule, value, callback) => {

        let val = value * 1;
        let reg = /^[0-9]*$/;
        if (reg.test(val)) {
          if (val >= 1 && val <= 65535) {
            callback();
          } else {
            callback(new Error(this.$t('vsr1000.aclremind[10]')));
          }
        } else {
          callback(new Error(this.$t('vsr1000.aclremind[10]')));
        }
    };
    let checkName = (rule,value,callback) => {
      if(value){
        firewalldIsOnlyName({name:value,deviceId:this.deviceId}).then(res=>{
          if(res.code==10000){
            callback()
          }else{
            callback(new Error(this.$t('vsr1000.remind[6]')))
          }
        });
      }
    };
    let checkApp = (rule,value,callback) => {
      if(value){
        firewalldIsOnlyApp({type:"2",appId:value,deviceId:this.deviceId}).then(res=>{
          if(res.code==10000){
            callback()
          }else{
            callback(new Error(this.$t('vsr1000.remind[6]')))
          }
        })
      }else{
        callback();
      }
    };
    let checkAppG = (rule,value,callback) => {
      if(value){
        firewalldIsOnlyApp({type:"1",appId:value,deviceId:this.deviceId}).then(res=>{
          if(res.code==10000){
            callback()
          }else{
            callback(new Error(this.$t('vsr1000.remind[6]')))
          }
        })
      }else{
        callback();
      }
    };
    let checkPriority = (rule,value,callback) => {
      if(value){
        firewalldIsOnlyPriority({priority: value, deviceId: this.deviceId}).then(res => {
          if (res.code == 10000) {
            callback()
          } else {
            callback(new Error(this.$t("subscription.firewall.remind[7]")))
          }
        })
      }
    };
    return {
      buttomShow:false,
      appChk:true,
      appGChk:true,
      deviceId: JSON.parse(this.$route.query.devData).deviceId,
      tenantId : sessionStorage.getItem("tenantValue"),
      isEdit: false,
      lang: sessionStorage.getItem("lang"),
      actionList:[],
      directionList:[],
      port:[],
      app:[],
      appG:[],
      appGD:false,
      appD:false,
      form: {
        id: "",
        name:"",
        description:"",
        interface:"",
        appGroup:"",
        application:"",
        direction:"",
        action:"",
        priority:"",
      },
      apiArr: [],
      rules: {
        name: [
          {
            required: true,
            message: this.$t("subscription.firewall.remind[0]"),
            trigger: "blur"
          },{validator: checkName, trigger: "blur"}
        ],
        interface: [
          {
            required: true,
            message: this.$t("subscription.firewall.remind[1]"),
            trigger: "change"
          }
        ],
        direction: [
          {
            required: true,
            message: this.$t("subscription.firewall.remind[2]"),
            trigger: "change"
          }
        ],
        action: [
          {
            required: true,
            message: this.$t("subscription.firewall.remind[3]"),
            trigger: "change"
          }
        ],
        priority: [
          {
            required: true,
            message: this.$t('subscription.firewall.remind[4]'),
            trigger: "blur"
          },
          { validator: NumRule, trigger: "blur" },
          {
            validator:checkPriority , trigger: "blur"
          }
        ],
      appGroup:[
        {
          required: true,
          message: this.$t("subscription.firewall.remind[6]"),
          trigger: "blur"
        }
      ],
      application:[
        { required: true,
          message: this.$t("subscription.firewall.remind[5]"),
          trigger: "blur" }
      ]
      }
    };
  },
  methods: {
    close() {
      this.$parent.addfirewallShow = false;
      this.$refs.form.resetFields();
    },
    save(formName) {
      console.log(6666666666666)
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(55555555555555)
          let params = {
            deviceId: this.deviceId,
            name: this.form.name,
            description:this.form.description,
            direction:this.form.direction,
            action: this.form.action,
            priority: this.form.priority,
            interfaceID:this.form.interface,
            appGroup:this.form.appGroup,
            app:this.form.application,
          };
          this.buttomShow = true
          firewalldAddOrEdit(params).then(res => {
            this.buttomShow = false
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[5]")
              });
              this.$parent.isShow = false;
              this.$refs[formName].resetFields();
              this.$parent.dataInit({
                pageNumber: this.$parent.page,
                pageSize: this.$parent.pageSize,
                deviceId: this.deviceId
              });
              this.close();
            } else {
              this.$message({
                type: "warning",
                message: res.message
              });
              this.$refs[formName].resetFields();
              this.$parent.isShow = false;
            }
          });
        }
      });
    },
    intiDate(){

      GetFirewalldSel({deviceId:this.deviceId,tenantId:this.tenantId}).then(res=>{
        this.port = res.result.port;
        this.app = res.result.app;
        this.appG = res.result.appG;
        this.directionList = res.result.direction;
        this.form.direction = this.directionList[0].id;
        this.actionList = res.result.action
      })
    },
    selAPPG(){
        if(this.form.appGroup!=""){
          this.appD = true;
          this.rules.application[0].required = false;
        }else{
          this.appD = false;
          this.rules.application[0].required = true;
        }
    },
    selApp(){
        if (this.form.application != "") {
          this.appGD = true;
          this.rules.appGroup[0].required = false;
        } else {
          this.appGD = false;
          this.rules.appGroup[0].required = true;
        }
    }
  },
  created() {
    this.intiDate();
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
    padding-top: 15px;
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
  width: 530px;
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