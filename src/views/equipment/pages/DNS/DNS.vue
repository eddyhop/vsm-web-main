<template>
  <!-- DNS -->
  <div class="DNS">
    <div class="operate">
      <div class="open">
        <span>{{$t('newLang100.dns.title1')}}</span>
        <el-switch
          v-model="value"
          @change="openOrClose"
          active-color="#3678C8"
          inactive-color="#D1D7E0"
        ></el-switch>
      </div>
      <div class="btns">
        <button class="add" @click.prevent="isShow = true">
          <img src="@/assets/newPage/icon_add@2x.png" alt />
          {{$t('newLang100.dns.title5')}}
        </button>
        <button class="close" @click.prevent="removeList">{{$t('newLang100.dns.title6')}}</button>
      </div>
    </div>
    <div class="tableList">
      <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%"
        size="small"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <!-- <el-table-column
          type="index"
          :index="indexMethod"
          :label="$t('DeviceMan.index')"
          align="center"
          width="70"
          :resizable="false"
        ></el-table-column> -->
        <el-table-column prop="name" :label="$t('newLang100.dns.title2')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="domain" :label="$t('newLang100.dns.title3')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="server" :label="$t('newLang100.dns.title4')" show-overflow-tooltip :resizable="false"></el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :page-sizes="[5, 10]"
          :total="allNum"
          :page-size="10"
          @size-change="pageChange"
          @current-change="sizeChange"
          :current-page="page"
          layout="total, sizes, prev, next, jumper"
          style="font-family: arial, sans-serif"
        ></el-pagination>
      </div>
    </div>
    <addDNS v-show="isShow" />
  </div>
</template>
<script>
import { dnsGetDns, dnsGetState, dnsOpen, dnsClose, dnsDel } from "@/services";
import addDNS from "./components/addDNS";
export default {
  data() {
    return {
      deviceId:JSON.parse(this.$route.query.devData).deviceId,
      page: 1,
      pageSize: 10,
      allNum: 0,
      multipleSelection: [],
      tableData: [],
      value: false,
      isShow: false
    };
  },
  components: {
    addDNS
  },
  methods: {
    //页面条数改变
    // The number of page bars changed
    //The number of page bars changed
    pageChange(val) {
      this.pageSize = val;
      this.page = 1;
      let params = {
        deviceId: this.deviceId,
        pageNumber: this.page,
        pageSize: this.pageSize
      };
      this.dataInit(params);
    },
    //页数改变
    // Page number change
    //Page number change
    sizeChange(val) {
      this.page = val;
      let params = {
        deviceId: this.deviceId,
        pageNumber: this.page,
        pageSize: this.pageSize
      };
      this.dataInit(params);
    },
    //序号展示
    // The serial number display
    //The serial number display
    indexMethod(index) {
      return index + 1 + (this.page == 1 ? 0 : this.pageSize * (this.page - 1));
    },
    //多选
    // multi-select
    //multiple choice
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //开启或关闭DNS
    // Turn DNS on or off
    //Turn DNS on or off
    openOrClose() {
      if (this.value) {
        dnsOpen({ devId: this.deviceId }).then(res => {
          if (res.code === 10000) {
            let params = {
              deviceId: this.deviceId,
              pageNumber: this.page,
              pageSize: this.pageSize
            };
            this.dataInit(params);
          }
        });
      } else {
        dnsClose({ devId: this.deviceId }),
          then(res => {
            if (res.code === 10000) {
              let params = {
                deviceId: this.deviceId,
                pageNumber: this.page,
                pageSize: this.pageSize
              };
              this.dataInit(params);
            }
          });
      }
    },
    //多选删除
    // Much choose delete
    //Much choose delete
    removeList() {
      if (this.multipleSelection.length) {
        let deviceId = this.deviceId;
        let ids = this.multipleSelection.map(item => item.id);
        var show27 = localStorage.getItem("show27");
        if(show27 == 'true'){
          dnsDel({ ids }).then(res => {
              if (res.code === 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.remind2[2]")
                });
                this.dataInit({
                  deviceId,
                  pageNumber: this.page,
                  pageSize: this.pageSize
                });
              } else if (res.code !== 10000) {
                this.dataInit({
                  deviceId,
                  pageNumber: this.page,
                  pageSize: this.pageSize
                });
                this.$message({
                  type: "warning",
                  message: res.message
                });
              }
            });
        }else{
          this.$confirm(this.$t("vsr1000.qosremind[1]"+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue27\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>"), {
            confirmButtonText: this.$t("vsr1000.OK"),
            cancelButtonText: this.$t("vsr1000.cancel"),
            dangerouslyUseHTMLString: true,
            type: "warning"
          })
          .then(() => {
            dnsDel({ ids }).then(res => {
              if (res.code === 10000) {
                this.$message({
                  type: "success",
                  message: this.$t("vsr1000.remind2[2]")
                });
                this.dataInit({
                  deviceId,
                  pageNumber: this.page,
                  pageSize: this.pageSize
                });
                localStorage.setItem("show27",localStorage.getItem("checkedValue27"));
              } else if (res.code !== 10000) {
                this.dataInit({
                  deviceId,
                  pageNumber: this.page,
                  pageSize: this.pageSize
                });
                this.$message({
                  type: "warning",
                  message: res.message
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: this.$t("vsr1000.qosremind[2]")
            });
          });
        }
        
      } else {
        this.$message({
          type: "warning",
          message: this.$t("vsr1000.qosremind[4]")
        });
      }
    },
    //数据初始化
    // Data initialization
    //Data initialization
    dataInit(params) {
      dnsGetDns(params).then(res => {
        if (res.code === 10000) {
          this.allNum = res.result.totalElements;
          this.tableData = res.result.content;
        }
      });
      dnsGetState({ devId: this.deviceId }).then(res => {
        if (res.code === 10000) {
          this.value = res.result ? true : false;
        }
      });
    }
  },
  created() {
    let params = {
      deviceId: this.deviceId,
      pageNumber: this.page,
      pageSize: this.pageSize
    };
    this.dataInit(params);
  }
};
</script>
<style scoped lang="scss">
.DNS {
  width: 100%;
  padding: 20px 30px;
}
.operate {
  width: 100%;
  zoom: 1;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  .open {
    float: left;
    height: 34px;
    line-height: 34px;
    span {
      margin-right: 10px;
    }
  }
}
.btns {
  float: right;
  button {
    width: 100px;
    height: 34px;
    margin-left: 14px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    border: none;
    outline: none;
    text-align: center;
    line-height: 34px;
    cursor: pointer;
    display: table-cell;
    vertical-align: middle;
    img {
      width: 14px;
      height: 14px;
      position: relative;
      top: 1px;
    }
  }
  .add:hover {
    background: rgba(96, 149, 214, 1);
  }
  .close {
    background: rgba(239, 239, 239, 1);
    color: #333333;
    border: 1px solid rgba(209, 215, 224, 1);
    margin-left: 14px;
  }
}
.tableList {
  padding-top: 20px;
}
</style>