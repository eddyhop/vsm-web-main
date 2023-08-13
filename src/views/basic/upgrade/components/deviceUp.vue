<!-- 设备升级 -->
<template>
  <div class="deviceUp">
    <div class="cont">
      <div class="title">
        {{$t('Upgrade.upgrade')}}
        <span @click="close"></span>
      </div>
      <div class="content">
        <div class="chose">
          <el-row>
            <el-col :span="19">
              <!-- <span>{{$t('Upgrade.setUpTime')}}</span> -->
              <el-tooltip class="item" effect="dark" :content="$t('Upgrade.setUpTime')" placement="bottom">
                <span class="top">{{$t('Upgrade.setUpTime')}}</span>  
              </el-tooltip>
              <div class="limit">
                <el-form
                  :model="form"
                  :rules="rules"
                  ref="form"
                  label-width="100px"
                  class="demo-ruleForm"
                >
                  <el-form-item label-width="70" :label="$t('Upgrade.setUpTime')" prop="value1">
                    <el-date-picker
                      v-model="form.value1"
                      size="small"
                      type="datetime"
                      prefix-icon="el-icon-time"
                      class="datePicker"
                      :placeholder="$t('Upgrade.prompt2')"
                    ></el-date-picker>
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
            <el-col :span="5">
              <el-tooltip class="item" effect="dark" :content="$t('Upgrade.hint8')" placement="bottom">
                <span class="top" id="remain">{{$t('Upgrade.hint8')}}</span>  
              </el-tooltip>
              <!-- <span class="remain">{{$t('Upgrade.hint8')}}</span> -->
            </el-col>
          </el-row>
        </div>
        <div class="device">
          <div class="wait">
            <h3>{{$t('Upgrade.willUpDev')}}</h3>
            <el-checkbox-group v-model="checkList" v-for="(item,index) in left" :key="index">
              <el-checkbox
                :label="item.deviceSerialNumber"
                :disabled="item.jobType=='未完成'?true:false"
              >
                <span :class="item.jobType=='未完成'?'logo':'green logo'"></span>
                <span class="name">{{item.deviceName}}</span>
                <p class="version">{{item.deviceSerialNumber}}</p>
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="had">
            <h3>{{$t('Upgrade.aleUpDev')}}</h3>
            <div class="had-up" v-for="(item,index) in right" :key="index">
              <span class="item">
                <span class="logo green"></span>
                <span class="name">{{item.deviceName}}</span>
                <p class="version">{{item.deviceSerialNumber}}</p>
              </span>
            </div>
          </div>
        </div>
        <div class="control">
          <button class="up" :id="lang=='en'?'lang':''" v-debounce="save">{{$t('Upgrade.upgrade')}}</button>
          <button class="cancel" @click="close">{{$t('Upgrade.cancel')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { addUpdateJob } from "@/services";
export default {
  components: {},
  data() {
    var checkTime = (rule, value, callback) => {
      var now = new Date();
      if (value < now) {
        callback(new Error(this.$t("Upgrade.hint1")));
      } else {
        callback();
      }
    };
    return {
      id: "",
      form: {
        value1: ""
      },
      checkList: [],
      a: true,
      left: [],
      right: [],
      rules: {
        value1: [
          { required: true, message: this.$t("Upgrade.hint3"), trigger: "blur" }
          //  { validator: checkTime, trigger: 'change' }
        ]
      },
      lang:sessionStorage.getItem('lang')
    };
  },

  computed: {},
  watch: {},
  methods: {
    save(formName) {
      // console.log(this.checkList)

      let params = {
        jobId: this.id,
        updateTime: this.form.value1.toUTCString(),
        updateDevs: this.checkList
      };
      // console.log(params)
      this.$refs[formName].validate(valid => {
        if (this.checkList.length) {
          if (valid) {
            addUpdateJob(params).then(res => {
              if (res.code == 10000) {
                this.$message({
                  message: this.$t("Upgrade.hint4"),
                  type: "success"
                });
                this.close();
                this.$parent.getList();
              } else {
                this.$message({
                  message: this.$t("Upgrade.hint5"),
                  type: "warning"
                });
              }
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        } else {
          this.$message({
            message: this.$t("Upgrade.hint6"),
            type: "warning"
          });
        }
      });
    },
    close() {
      this.$parent.deviceUpShow = false;
      this.checkList = [];
    },
    getTime(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let miao = date.getSeconds();
      let list = [year, month, day, hour, minute, miao];
      let list2 = [];
      for (let i in list) {
        if (list[i] < 10) {
          let a = "" + 0 + list[i];
          list2.push(a);
        } else {
          list2.push(list[i]);
        }
      }
      let needTime =
        "" +
        list2[0] +
        "-" +
        list2[1] +
        "-" +
        list2[2] +
        " " +
        list2[3] +
        ":" +
        list2[4] +
        ":" +
        list2[5];
      return needTime;
    }
  },
  created() {},
  mounted() {},
  beforeCreate() {}, 
  beforeMount() {}, 
  beforeUpdate() {}, 
  updated() {}, 
  beforeDestroy() {}, 
  destroyed() {}, 
  activated() {} 
};
</script>
<style lang='scss' scoped>
#lang{
  width: 120px;
}
.device {
  display: flex;
  justify-content: space-between;
  .had-up {
    text-align: left;
    .item {
      display: block;
      margin-bottom: 15px;
    }
  }
  .wait,
  .had {
    width: 310px;
    height: 420px;
    border-radius: 7px;
    border: 1px solid rgba(209, 215, 224, 1);
    text-align: center;
    padding: 20px;
    overflow-x: hidden;
    overflow-y: auto;
    h3 {
      font-size: 15px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      margin-bottom: 20px;
    }
    .name {
      max-width: 80px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .version {
      max-width: 80px;
      margin-left: 10px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      display: inline;
    }
    .logo {
      width: 10px;
      height: 10px;
      background: rgba(186, 39, 39, 1);
      border-radius: 50%;
      display: inline-block;
      margin-right: 5px;
      margin-left: 10px;
    }
    .green {
      background: rgba(2, 152, 5, 1);
    }
  }
  .had::-webkit-scrollbar {
    width: 4px;
    /*height: 4px;*/
  }
  .had::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }
  .had::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }
  .wait::-webkit-scrollbar {
    width: 4px;
    /*height: 4px;*/
  }
  .wait::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }
  .wait::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }
}
.control {
  margin-top: 30px;
  text-align: center;
  .up:hover {
    background: rgba(96, 149, 214, 1);
  }
  .cancel {
    width: 70px;
    height: 34px;
    border-radius: 7px;
    border: 1px solid rgba(209, 215, 224, 1);
    background: none;
    color: rgba(102, 102, 102, 1);
  }
  button {
    margin-left: 18px;
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    border: none;
    padding: 0px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
  }
}
.content {
  padding: 30px;
  .chose {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    margin-bottom: 30px;
    #remain{
      line-height: 36px;
    }
    .top{
      width: 70px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      display: inline-block;
    }
  }
  .limit {
    display: inline-block;
    margin-left: 10px;

    div {
      width: 403px;
    }
  }
}
.cont {
  width: 700px;
  min-height: 657px;
  background: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0px 10px 20px 0px rgba(102, 102, 102, 0.1);
  border-radius: 7px;
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
      background-image: url("../../../../assets/icon_close.png");
      background-size: 14px 14px;
    }
  }
}
.deviceUp {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 9;
  background:rgba(32,42,59,0.2);
}
</style>
<style lang="scss">
.deviceUp {
  .content {
    .el-checkbox {
      display: block;
      margin-top: 15px;
    }
    .el-checkbox-group {
      text-align: left;
    }
    .chose {
      .el-input--small .el-input__inner {
        height: 34px;
      }
      .el-form-item {
        margin-bottom: 0px;
      }
      .el-form-item__label {
        display: none;
      }
    }
  }
}
.deviceUp .datePicker {
    position: relative;
    .el-icon-time {
      position: absolute;
      left: 3px;
      top: 13px;
      width: 14px;
      height: 14px;
    }
    .el-icon-time:before {
      display: block;
      width: 14px;
      height: 14px;
      background: url("../../../../assets/homePage/home_icon_calendar@2x.png")
        no-repeat center;
      background-size: cover;
      content: "";
    }
  }
</style>