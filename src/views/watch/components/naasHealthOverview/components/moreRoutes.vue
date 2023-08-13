<template>
  <div class="addACL">
    <div class="context">
      <h4 class="title">
        <span>{{ $t("Monit.showBgpRouts") }}: {{ statisticsName }}</span>
        <i class="close" @click="close"></i>
      </h4>

      <div style="padding: 20px 0px 0 20px; height: 60ps">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="formTs"
          label-width="auto"
          :inline="true"
          class="demo-ruleForm"
          @submit.native.prevent
        >
          <el-row>
            <el-col :span="9">
              <el-form-item
                label-width="200px"
                :label="$t('Monit.advertisingEdge')"
                prop="neighbours"
              >
                <div class="b">
                  <el-select
                    filterable
                    v-model="ruleForm.neighbours"
                    @change="selNeighbours()"
                    clearable
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.id"
                      :label="item.neighbours"
                      :value="item.neighbours"
                    ></el-option>
                  </el-select>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item
                label-width="300px"
                :label="$t('Monit.destinationNetwork')"
                prop="destinationNetwork"
              >
                <el-input
                  v-model="ruleForm.destinationNetwork"
                  style="width: 180px"
                  @change="selNetwork()"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3" label-width="50px">
              <el-form-item>
                <button class="butGo" @click="TestPingFn">
                  {{ $t("Monit.go") }}
                </button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="event" style="border-top: 1px solid #dddddd">
        <div class="result">
          <div class="resultList">
            <!-- <div v-for="item in diagnoseResult" :key="item.id">
              <p v-for="(el, index) in item.value" :key="index">{{ el }}</p>
            </div> -->
            <div style="white-space: pre-wrap">
              <p>{{ diagnoseResult }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getNaaSBGPNeighbours,getBgpRoutesPing,bgpNaaSRoutesPing,networkdiagnosisCheckHost } from "@/services";
export default {
  props: {
    statisticsName: {
      type: String,
    },
    statisticsType: {
      type: String,
    },
  },
  components: {},

  data() {
    var getACLName = (rule, value, callback) => {
      if (value) {
        getACLName({
          name: value,
          deviceId: this.deviceId,
        }).then((res) => {
          if (res.result) {
            callback();
          } else {
            callback(new Error("您输入的名称已存在"));
          }
        });
      }
    };
    return {
      deviceId: JSON.parse(this.$route.query.devData).deviceId,
      options: [],
      ruleForm: {
        neighbours: "",
        destinationNetwork: "",
      },
      rules: {
        destinationNetwork: [
          {
            required: true,
            message: this.$t("vsr1000.remind2[15]"),
            trigger: "blur",
          },
          {
            pattern:
              /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]?|3[0-2])$/,
            message: this.$t("vsr1000.remind[16]"),
          },
        ],
        neighbours: [
          {
            required: true,
            message: this.$t("vsr1000.remind2[16]"),
            trigger: "change",
          },
        ],
      },
      rid: "",
      diagnoseResult:"",
      // diagnoseResult1:
      //   "BIRD 2.0.8 ready.\nTable master4:\n40.0.0.1/32 unicast [edgeA 06:15:54.966 from 50.0.0.1] (100/10) [i]\n\tvia 11.1.1.2 on gre4\n\tType: BGP univ\n\tBGP.origin: IGP\n\tBGP.as_path: \n\tBGP.next_hop: 10.10.1.2\n\tBGP.local_pref: 100\n60.0.0.1/32 unreachable [edgeA 06:15:54.966 from 50.0.0.1] (100) [i]\n\tType: BGP univ\n\tBGP.origin: IGP\n\tBGP.as_path: \n\tBGP.next_hop: 11.1.1.1\n\tBGP.local_pref: 100\n10.10.1.0/24 unreachable [edgeA 06:15:54.966 from 50.0.0.1] (100) [i]\n\tType: BGP univ\n\tBGP.origin: IGP\n\tBGP.as_path: \n\tBGP.next_hop: 50.0.0.1\n\tBGP.local_pref: 100\n11.1.1.0/24 unreachable [edgeA 06:15:54.966 from 50.0.0.1] (100) [i]\n\tType: BGP univ\n\tBGP.origin: IGP\n\tBGP.as_path: \n\tBGP.next_hop: 50.0.0.1\n\tBGP.local_pref: 100\n",
    };
  },
  computed: {},
  methods: {
    initData(deviceName) {
      this.statisticsName = deviceName;
    },
    close() {
      this.$parent.moreRoutesShow = false;
      this.editableTabsValue = "1";
    },
    TestPingFn(formName) {
      this.$refs.formTs.validate((valid) => {
        if (valid) {
          // this.initWs();
          this.getRid();
              let param = {
                devSerNum: JSON.parse(this.$route.query.devData).vsrSeries,
                rid: this.rid,
                neighbours: this.ruleForm.neighbours,
                destinationNetwork: this.ruleForm.destinationNetwork,
              };
              bgpNaaSRoutesPing(param).then((res) => {
                if (res.code == 10000) {
                  this.setTimer();
                }
              });
            }
      });
    },
    selNeighbours() {
      this.$refs.formTs.clearValidate();
      if (this.ruleForm.neighbours != "") {
        this.rules.destinationNetwork[0].required = false;
      } else {
        this.rules.destinationNetwork[0].required = true;
      }
    },
    selNetwork() {
      this.$refs.formTs.clearValidate();
      if (this.ruleForm.destinationNetwork != "") {
        this.rules.neighbours[0].required = false;
      } else {
        this.rules.neighbours[0].required = true;
      }
    },
    getRid() {
      this.rid = parseInt((Math.random() + 1) * Math.pow(10, 6 - 1));
    },
        //轮询调用
    // Polling calls
    //Polling calls
    setTimer() {
      getBgpRoutesPing({
            devSerNum: JSON.parse(this.$route.query.devData).vsrSeries,
            rid: this.rid
          }).then(res => {
            this.diagnoseResult = res.result;
          });
      // this.myInterval = window.setInterval(() => {
      //   // setTimeout(() => {
          
          
      //   // }, 1);
      // }, 4000);
    },
  },
  created() {
    getNaaSBGPNeighbours({
      deviceId: JSON.parse(this.$route.query.devData).deviceId,
    }).then((res) => {
      this.options = res.result;
    });
  },
  mounted() {},
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
.el-form-item {
  display: flex;
}
.context {
  width: 942px;
  height: 65%;
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
      background: url("../../../../../assets/icon_close.png") no-repeat;
      background-size: cover;
      cursor: pointer;
    }
  }
}
.butGo {
  margin-left: 14px;
  width: 100px;
  height: 34px;
  background: rgba(54, 120, 200, 1);
  border-radius: 7px;
  font-size: 14px;
  font-family: arial, sans-serif;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  border: 0;
  outline: none;
  cursor: pointer;
}
.event {
  padding: 10px 30px 20px 30px;
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
