<template>
  <div class="addACL">
    <div class="context">
      <h4 class="title">
        <span>{{ $t("Monit.moreDetails") }}: {{statisticsName}} {{ $t("moreDetails.statistics") }}</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="event">
        <div v-if="statisticsType==1024">
          <el-table
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              border
              stripe
              fit
              size="small"
            >
            <el-table-column
              prop="ISP"
              :label="$t('moreDetails.isp')"
              show-overflow-tooltip
              :resizable="false"
            ></el-table-column>
            <el-table-column
              prop="strength"
              :label="$t('moreDetails.signalStrength')"
              show-overflow-tooltip
              :resizable="false"
            ></el-table-column>
          </el-table>
        </div>
        <div v-else-if="statisticsType==768">
          <el-table
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              border
              stripe
              fit
              size="small"
            >
            <el-table-column
              prop="band"
              :label="$t('moreDetails.wifiBand')"
              show-overflow-tooltip
              :resizable="false"
              :formatter="showHz"
            >
            </el-table-column>
             <!-- <el-table-column
              prop="mode"
              :label="$t('moreDetails.wifiMode')"
              show-overflow-tooltip
              :resizable="false"
            ></el-table-column> -->
            <el-table-column
              prop="country_code"
              :label="$t('moreDetails.countryCode')"
              show-overflow-tooltip
              :resizable="false"
            ></el-table-column>
          </el-table>
        </div>
        <div v-else>
          <el-table
              ref="multipleTable"
              :data="tableData3"
              tooltip-effect="dark"
              style="width: 100%"
              border
              stripe
              fit
              size="small"
            >
            <el-table-column
              prop="duplex"
              :label="$t('moreDetails.duplex')"
              show-overflow-tooltip
              :resizable="false"
            ></el-table-column>

            <el-table-column
              prop="mtu"
              :label="$t('moreDetails.mtu')"
              show-overflow-tooltip
              :resizable="false"
            ></el-table-column>
          </el-table>
        </div>
        <div class="submit">
          <button class="save" type="primary" v-debounce.prevent="refresh">
            {{ $t("moreDetails.refresh") }}
          </button>
          <button class="cancel" @click.prevent="close">
            {{ $t("vsr1000.cancel") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Sortable from "sortablejs";
import { getAppNames, getAclDetail } from "@/services";
export default {
  props: {
    statisticsName: {
      type: String
    },
    statisticsType: {
      type: String
    }
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
      ruleForm: {
        aclSessionName: "",
        descr: "",
        aclSessionId: "",
        editableTabs: [
          {
            title: "流1",
            name: "1",
            content: {
              //动作
              // action
              action: "",
              //目的地ip
              // Destination IP
              aimIp: "",
              //目的地掩码
              // Destination mask
              aimMask: "",
              //选择的应用
              // Application of choice
              appName: "",
              //源ip
              // The source IP
              sourceIp: "",
              //源掩码
              // Source mask
              sourceMask: "",
              id: "",
              aclSessionId: "",
              sortNum: null,
            },
          },
        ],
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { validator: getACLName, trigger: "blur" },
        ],
      },
      editableTabsValue: "1",
      ActItem: [],
      AppNames: [],
      tableData3: [],
      portOperation: [],
      tabIndex: 1,
      tableData: [],
    };
  },
  computed: {},
  methods: {
    initData(row)
    {
      if(row.portType==1024){
        if(row.lte){
          var jsonObj = eval('(' + row.lte + ')');
          this.tableData = [];
          this.tableData.push(jsonObj) ;
        }
      }else if(row.portType==768){
        if(row.wifi){
          var jsonObj = eval('(' + row.wifi + ')');
          this.tableData = [];
          this.tableData.push(jsonObj) ;
        }
      }else{
        this.tableData3.splice(0,1,row);
      }
    },
    refresh(){
      console.log("refresh");
      this.$parent.moreDetailsShow = false;
    },
    close() {
      this.$parent.moreDetailsShow = false;
      this.editableTabsValue = "1";
    },
    tabsDrop() {
      let el = document.querySelectorAll(".tabsListD1 .el-tabs__nav")[0];
      const _this = this;
      Sortable.create(el, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.ruleForm.editableTabs.splice(oldIndex, 1)[0];
          _this.ruleForm.editableTabs.splice(newIndex, 0, currRow);
        },
      });
    },
    showHz(row, column){
      let str = row.band;
      if("5"==str.substring(0,1)){
          return  "5GHZ";
      }else{
        return  "2.4GHZ";
      }
    },
    async selectList(val) {
      //   console.log(val)
      // let data = await getDict({ groupCode: "acl", typeCode: "act" });
      let data = await getAppNames({
        tenantId: JSON.parse(this.$route.query.devData).tenantId,
        deviceId: this.deviceId,
      });
      let aclDetail = await getAclDetail({ aclId: val });
      this.ActItem = data.result.actOperation;
      this.AppNames = data.result.appOperation;
      this.portOperation = data.result.portOperation;
      this.ruleForm.aclSessionName = aclDetail.result.name;
      this.ruleForm.descr = aclDetail.result.descr;
      this.ruleForm.aclSessionId = aclDetail.result.id;
      this.tabIndex = aclDetail.result.aclSessionList.length;
      this.ruleForm.port = aclDetail.result.portId; //接口ID
      // The interface ID
      this.ruleForm.direction = aclDetail.result.direction + ""; //方向ID
      // The direction of the ID
      this.editableTabsValue = "1";
      this.ruleForm.editableTabs = aclDetail.result.aclSessionList.map(
        (item, index) => {
          return {
            title: this.$t("vsr1000.aclremind[14]") + (index + 1),
            name: index + 1 + "",
            content: {
              aclId: item.id,
              action: item.action,
              aimIp: item.destinationIp,
              aimMask: item.destinationIpMask * 1,
              appName: item.appId,
              id: item.id,
              sortNum: item.sortOrder,
              sourceIp: item.sourceIp,
              sourceMask: item.sourceIpMask * 1,
            },
          };
        }
      );
    },
  },
  created() {},
  mounted() {
    this.tabsDrop();
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
  width: 942px;
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
