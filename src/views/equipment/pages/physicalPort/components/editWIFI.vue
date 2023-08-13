<template>
  <div class="editSb">
    <div :class="lang=='en' ? 'contEn cont' : 'cont'">
      <div class="title">
        {{$t('DeviceMan.editWIFI')}}
        <span @click.prevent="close"></span>
      </div>
      <div class="even">
        <el-form
          :model="from"
          :rules="rules"
          ref="form"
          label-width="120px"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item :label="$t('DeviceMan.wifiBands')" prop="wifiBands" style="margin-right:28px">
            <el-radio v-model="from.wifiBands" label="2.4GHZ" >2.4GHZ</el-radio>
            <el-radio v-model="from.wifiBands" label="5GHZ"  >5GHZ</el-radio>
          </el-form-item>
          <el-form-item :label="$t('DeviceMan.countryCode')" prop="wifiCountryCode" style="margin-right:28px">
            <el-input style="width:450px" v-model="from.wifiCountryCode" size="small" placeholder="Please enter Country Code"></el-input>
          </el-form-item>
          <el-form-item :label="$t('DeviceMan.ssisName')" prop="wifiSsid" style="margin-right:28px">
            <el-input style="width:450px" v-model="from.wifiSsid" size="small" placeholder="Please enter SSID"></el-input>
          </el-form-item>
          <el-form-item :label="$t('DeviceMan.password')" prop="wifiPwd" style="margin-right:28px" >
            <el-input type="password" style="width:450px" v-model="from.wifiPwd" size="small" show-password  placeholder="Please enter Password"></el-input>
          </el-form-item>
          <div class="contr">
            <button v-debounce="save" class="save">{{$t('DeviceMan.save')}}</button>
            <button @click.prevent="close" class="cancel">{{$t('DeviceMan.cancel')}}</button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {logicalPortName, updatePortWifi} from "@/services";
// Address data
export default {
  props:{
    portName:{type:String},
  },
  watch: {

  },
  data() {
    var checkLent = (rule,value,callback) => {
      if(value){
        if(value.length<8||value.length>63){
          callback(new Error(this.$t("App.wifiPawTest")))
        }else{
          callback()
        }
      }
    };

    const validateSSID = (rule, value, callback) => {
      if(value){
        const validateRegex = /^[a-zA-Z0-9-]*$/
        if(!validateRegex.test(value)) {
          callback(new Error(this.$t("App.wifiSSIDValidate")))
        } else{
          callback()
        }
      }
    };

    return {
      lang: sessionStorage.getItem("lang") || "en",
      from: {
        wifiBands:"2.4GHZ",
        wifiCountryCode:"AU",
        wifiSsid:"",
        wifiPwd:"",
      },
      rules: {
        wifiSsid: [
          {required: true, message: this.$t("App.wifiUset"), trigger: "blur" },
          {validator: validateSSID, trigger: "blur"}
        ],
        wifiPwd: [
          {required: true, message: this.$t("App.wifiPaw"), trigger: "blur" }
          ,
          {validator:  checkLent, trigger: "blur"}
        ]
      },
    };
  },
  methods: {
     dataInit(row) {
      this.from.wifiPwd = row.wifiPwd;
      this.from.wifiCountryCode = row.wifiCountryCode;
      this.from.wifiBands = row.wifiBands;
      this.from.wifiSsid = row.wifiSsid;
      if(!row.wifiBands){
        this.from.wifiBands="2.4GHZ";
      }
    },
     save(formName) {
       let params = {
         deviceId: JSON.parse(this.$route.query.devData).deviceId,
         portName: this.portName,
         wifiBands:this.from.wifiBands,
         wifiCountryCode:this.from.wifiCountryCode,
         wifiSsid:this.from.wifiSsid,
         wifiPwd:this.from.wifiPwd,
       };
       this.$refs[formName].validate((valid) => {
         if (valid) {
           updatePortWifi(params).then(res => {
             if (res.code === 10000) {
               this.$message({
                 type: "success",
                 message: this.$t("vsr1000.remind2[0]")
               });

               this.$parent.physicalPortList({
                 deviceId: JSON.parse(this.$route.query.devData).deviceId,
                 pageNumber:1,
                 pageSize:10,
                 type: this.$parent.index,
                 routeType: 0
               });
               this.$parent.editWIFIShow = false;

             } else {
               this.$message({
                 type: "warning",
                 message: res.message
               });
             }
           });
         } else {
           return false;
         }
       });
    },
    close() {
      this.$parent.editWIFIShow = false;
      this.$refs.form.resetFields();
    },
  },
  created() {},
  mounted() {},
};
</script>
<style lang="scss" scoped>
.even {
  // width: 100%;
  padding: 30px 0 0 20px;
  //   width: 440px;
  //   margin: 0 auto;
  //   margin-top: 30px;
  //   margin-left: -15px;
  //   text-align: center;
  .a {
    div {
      width: 320px;
    }
  }
  .remaind {
    color: darkgray;
  }
  .contr {
    width: 100%;
    text-align: center;
    .save:hover {
      background: rgba(96, 149, 214, 1);
    }
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
}
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
    background-image: url("../../../../../assets/icon_close.png");
    background-size: 14px 14px;
  }

  
}
.cont {
  width: 631px;
  height: 400px;
  background: white;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -315.5px;
  margin-top: -163px;
  box-shadow: 0px 10px 20px 0px rgba(102, 102, 102, 0.1);
  border-radius: 7px;
  //   text-align: center;
}
.contEn {
  width: 655px;
}
.editSb {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 100;
  background: rgba(32, 42, 59, 0.2);
}
</style>
<style lang="scss">
.even {
  .el-form-item__label {
    // font-size: 20px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(63, 64, 72, 1);
  }
}
.editSb .even {
  .el-input {
    width: 198px;
    height: 34px;
    .el-input__inner {
      height: 100%;
      //   padding-left: 34px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
}
.editSb .even .address {
  margin-right: 10px;

  .el-input {
    width: 110px;
    height: 34px;
    // margin-right: 25px;
    .el-input__inner {
      height: 100%;
      //   padding-left: 34px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
  .el-select:last-of-type .el-input {
    margin-right: 0;
  }
}
.editSb .even .first {
  .el-input {
    width: 145px;
  }
}
.editSb .even .last {
  margin-right: 0;
}
</style>