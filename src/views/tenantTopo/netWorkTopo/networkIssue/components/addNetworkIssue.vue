<template>
  <div class="addNetworkIssue">
    <div class="content">
      <h4 class="title">
        <span class="name">网段发布</span>
        <span class="close"></span>
      </h4>
      <div class="form">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="直连" name="first">
            <div class="table">
              <el-table
                ref="multipleTable"
                :data="linkTableData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="linkSelection"
                border
                stripe
                size="small"
                fit
              >
                <el-table-column
                  type="selection"
                  width="55"
                  align="center"
                  show-overflow-tooltip
                  :resizable="false"
                ></el-table-column>
                <el-table-column
                  type="index"
                  :index="linkIndexMethod"
                  :label="$t('vsr1000.index')"
                  align="center"
                  width="70"
                  show-overflow-tooltip
                  :resizable="false"
                ></el-table-column>
                <el-table-column
                  prop="name"
                  label="名称"
                  align="center"
                  show-overflow-tooltip
                  :resizable="false"
                ></el-table-column>
                <el-table-column
                  prop="name"
                  label="vlan_id"
                  align="center"
                  show-overflow-tooltip
                  :resizable="false"
                ></el-table-column>
                <el-table-column
                  prop="name"
                  label="IP"
                  align="center"
                  show-overflow-tooltip
                  :resizable="false"
                ></el-table-column>
                <el-table-column
                  prop="name"
                  label="绑定物理端口"
                  align="center"
                  show-overflow-tooltip
                  :resizable="false"
                ></el-table-column>
              </el-table>
              <div class="page">
                <el-pagination
                  :page-sizes="[5, 10]"
                  :total="linkAllNum"
                  @size-change="linkSizeChange"
                  @current-change="linkPageChange"
                  :current-page="linkPage"
                  :page-size="10"
                  layout="total, sizes, prev, next, jumper"
                  style="font-family: arial, sans-serif"
                ></el-pagination>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="静态" name="second">
            <div class="table">
              <el-table
                ref="multipleTable"
                :data="staticTableData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="staticSelection"
                border
                stripe
                size="small"
                fit
              >
                <el-table-column
                  type="selection"
                  width="55"
                  align="center"
                  show-overflow-tooltip
                  :resizable="false"
                ></el-table-column>
                <el-table-column
                  type="index"
                  :index="staticIndexMethod"
                  :label="$t('vsr1000.index')"
                  align="center"
                  width="70"
                  show-overflow-tooltip
                  :resizable="false"
                ></el-table-column>
                <el-table-column
                  prop="name"
                  label="租户域"
                  align="center"
                  show-overflow-tooltip
                  :resizable="false"
                ></el-table-column>
                <el-table-column
                  prop="name"
                  label="IP地址"
                  align="center"
                  show-overflow-tooltip
                  :resizable="false"
                ></el-table-column>
                <el-table-column
                  prop="name"
                  label="管理距离"
                  align="center"
                  show-overflow-tooltip
                  :resizable="false"
                ></el-table-column>
                <el-table-column
                  prop="name"
                  label="下一跳"
                  align="center"
                  show-overflow-tooltip
                  :resizable="false"
                ></el-table-column>
              </el-table>
              <div class="page">
                <el-pagination
                  :page-sizes="[5, 10]"
                  :total="staticAllNum"
                  @size-change="staticSizeChange"
                  @current-change="staticPageChange"
                  :current-page="staticPage"
                  :page-size="10"
                  layout="total, sizes, prev, next, jumper"
                ></el-pagination>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="聚合" name="third">
            <div class="adsCon">
              <div class="adsItem" v-for="(item,index) in aggregation" :key="item.id">
                <el-input v-model="item.ip" style="width:281px;height:34px" placeholder="IP地址"></el-input>
                <span>/</span>
                <el-input v-model="item.code" style="width:210px;height:34px" placeholder="掩码"></el-input>
                <div v-if="index==0" class="add" @click="addAdsIp">
                  <img src="@/assets/newPage/deviceconfiguration_icon_arp_add@2x.png" />
                </div>
                <button
                  class="remove"
                  v-if="aggregation.length>1&&index>0"
                  @click.prevent="removeAdsIp(item)"
                >
                  <img src="@/assets/deviceconfiguration_icon_arp_delete@2x.png" alt />
                </button>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="submit">
          <button class="save" type="primary" v-debounce.prevent="submitForm">{{$t('vsr1000.save')}}</button>
          <button class="cancel" @click.prevent="close">{{$t('vsr1000.cancel')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {},
  components: {},
  data() {
    return {
      activeName: "first",
      //直连表格数据
      // Connect table data directly
      linkTableData: [
        { name: "123" },
        { name: "123" },
        { name: "123" },
        { name: "123" },
        { name: "123" }
        // { name: "123" },
        // { name: "123" },
        // { name: "123" },
        // { name: "123" },
        // { name: "123" }
      ],
      //静态表格数据
      // Static tabular data
      staticTableData: [],
      //聚合ip的数据
      // Aggregate IP data
      aggregation: [
        {
          ip: "",
          code: "",
          id: Date.now()
        }
      ],
      //直连表格页数
      // Directly connect the page number of the table
      linkPage: 1,
      //直连表格每页条数
      // Number of entries per page of a directly linked form
      linkPageSize: 10,
      //静态表格页数
      // Static table number
      staticPage: 1,
      //静态表格每页条数
      // Number of rows per page of a static table
      staticPageSize: 10,
      //直连的总数
      // The total number of direct connections
      linkAllNum: 0,
      //静态的总数
      // Static total
      staticAllNum: 0
    };
  },
  computed: {},
  methods: {
    //直连每页条数改变
    // Change the number of lines per page
    linkSizeChange(val) {
      this.linkPageSize = val;
      this.linkPage = 1;
    },
    //直连页数改变
    // Directly connected page changes
    linkPageChange(val) {
      this.linkPage = val;
    },
    //静态每页条数改变
    // Static number of bars per page changes
    staticSizeChange(val) {
      this.staticPageSize = val;
      this.staticPage = 1;
    },
    //静态页数改变
    // Static page change
    staticPageChange(val) {
      this.staticPage = val;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    //直连选中
    // The selected)
    linkSelection() {},
    //静态选中
    // Static selected
    staticSelection() {},
    //直连序号
    // Direct serial number
    linkIndexMethod() {},
    //静态序号
    // Static serial number
    staticIndexMethod() {},
    //新增聚合ip
    // New converged IP
    addAdsIp() {
      this.aggregation.push({
        ip: "",
        code: "",
        id: Date.now()
      });
    },
    //删除聚合ip
    // Delete aggregate IP
    removeAdsIp(item) {
      let index = this.aggregation.indexOf(item);
      if (index !== -1) {
        this.aggregation.splice(index, 1);
      }
    },
    //关闭弹框
    // Close the bounced
    close() {},
    //提交
    // submit
    submitForm() {}
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="scss">
.addNetworkIssue {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 100;
  background: rgba(32, 42, 59, 0.2);
}
.content {
  width: 700px;
  height: 627px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -313.5px;
  margin-left: -350px;
}
.title {
  width: 100%;
  height: 48px;
  line-height: 48px;
  border-bottom: 1px solid #d1d7e0;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .name {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
  .close {
    width: 14px;
    height: 14px;
    background-image: url("../../../../../assets/icon_close.png");
    background-size: 14px 14px;
  }
}
.form {
  width: 100%;
  height: calc(100% - 48px);
  padding: 30px;
}
.adsCon {
  width: 640px;
  height: 420px;
  border-radius: 7px;
  border: 1px solid rgba(209, 215, 224, 1);
  padding: 30px;
  overflow: auto;
  margin-top: 1px;
  .adsItem {
    width: 100%;
    padding-bottom: 20px;
    display: flex;
    span {
      padding: 7px 14px;
      color: rgba(51, 51, 51, 1);
    }
    .add,
    .remove {
      margin-left: 20px;
      width: 34px;
      height: 34px;
      border-radius: 7px;
      background: #fff;
      border: 1px solid rgba(209, 215, 224, 1);
      outline: none;
      text-align: center;
      line-height: 34px;
      cursor: pointer;
      img {
        width: 15px;
        height: 15px;
      }
    }
  }
}
.table {
  width: 640px;
  height: 420px;
  border-radius: 7px;
  border: 1px solid rgba(209, 215, 224, 1);
  overflow: auto;
  margin-top: 1px;
  padding-bottom: 30px;
}
.table::-webkit-scrollbar,
.adsCon::-webkit-scrollbar {
  width: 4px;
  /*height: 4px;*/
}
.table::-webkit-scrollbar-thumb,
.adsCon::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.table::-webkit-scrollbar-track,
.adsCon::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.submit {
  width: 100%;
  text-align: center;
  padding-top: 30px;
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
    cursor: pointer;
  }
}
</style>
<style lang="scss">
.addNetworkIssue .form {
  .el-tabs__header {
    margin-bottom: 0;
    border: 0;
  }
  .el-tabs__item {
    text-align: center;
    width: 80px;
    height: 34px;
    line-height: 34px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    background: #fff;
    border-radius: 7px 2px 0px 0px;
  }
  .is-active {
    color: #3678c8;
  }
  .el-table th > .cell {
    font-size: 14px;
  }
  .el-table--border,
  .el-table--group {
    border: 0;
  }
}
.addNetworkIssue .form .adsCon {
  .el-input__inner {
    height: 100%;
    border-radius: 7px;
  }
  .el-input__icon {
    line-height: normal;
  }
}
</style>