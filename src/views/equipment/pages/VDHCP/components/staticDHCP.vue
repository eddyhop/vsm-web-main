<template>
  <div class="staticDHCP isShow" ref="staticDHCP">
    <div class="context">
      <h4 class="title">
        <span>{{$t('facility.staticDhcp')}}</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="event">
        <div class="list">
          <button class="addBtn" @click="addStaticDHCP">{{$t('facility.new')}}</button>
          <button @click="removeList">{{$t('facility.delete')}}</button>
          <!-- <button>生效</button>
          <button>失效</button>-->
        </div>
        <div class="tableView">
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" :label="$t('facility.checkAll')"></el-table-column>
            <el-table-column prop="macAddr" :label="$t('facility.macAddress1')"></el-table-column>
            <el-table-column prop="ip" :label="$t('facility.ipAddress1')"></el-table-column>
            <el-table-column prop="hostName" :label="$t('facility.hostName')"></el-table-column>
            <!-- <el-table-column prop="name" label="状态"></el-table-column> -->
            <el-table-column :label="$t('facility.operator')">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">{{$t('facility.edit')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="page">
            <el-pagination
              :page-sizes="[5, 10]"
              :total="allNum"
              @size-change="pageChange"
              @current-change="sizeChange"
              :current-page="lNumber"
              :page-size="10"
              layout="total, sizes, prev, next, jumper"
              style="font-family: arial, sans-serif"
            ></el-pagination>
          </div>
        </div>
      </div>
      <addStatic ref="addStatic" />
      <editStatic ref="editStatic" />
    </div>
  </div>
</template>
<script>
import addStatic from "./addStaticDHCP";
import editStatic from "./editStaticDHCP";
import { getStaticDhList, delBatchStaticDh } from "@/services";
export default {
  props: {},
  components: { addStatic, editStatic },
  data() {
    return {
      allNum: 0,
      lSize: 10, //每页条数
                 // Number each page
      lNumber: 0,
      tableData: [],
      editData: {},
      multipleSelection: []
    };
  },
  computed: {},
  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleClick(row) {
      this.editData = row;
      console.log(row);
      this.$refs.editStatic.$el.classList.remove("isShow");
      this.$refs.editStatic.dataInit(row);
    },
    pageChange(val) {
      //页数总条目改变
      // Total page entries change
      let dhcpId = sessionStorage.getItem("vDHCPIp");
      this.lSize = val;
      let params = {
        pageSize: this.lSize,
        page: 0,
        dhcpId: dhcpId
      }
      this.lNumber = 0;
      this.dataInit(params);
    },
    sizeChange(val) {
      //页数改变
      // Page number change
      // console.log(val)
      let dhcpId = sessionStorage.getItem("vDHCPIp");
      this.lNumber = val;
      let params = {
        pageSize: this.lSize,
        page: this.lNumber,
        dhcpId: dhcpId
      };
      this.dataInit(params);
    },
    close() {
      this.$refs.staticDHCP.classList.add("isShow");
    },
    dataInit(params) {
      getStaticDhList(params).then(res => {
        this.tableData = res.result[0];
        this.allNum = res.result[1];
      });
    },
    addStaticDHCP() {
      this.$refs.addStatic.$el.classList.remove("isShow");
    },
    removeList() {
      let ids = this.multipleSelection.map(item => item.id);
      let dhcpId = sessionStorage.getItem("vDHCPIp");

      delBatchStaticDh(ids).then(res => {
        if (res.code === 200) {
          this.dataInit({ page: this.lNumber, pageSize: this.lSize, dhcpId });
        }
      });
    }
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="scss">
.staticDHCP {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(176, 181, 194, 0.3);
  z-index: 100;
}
.isShow {
  display: none;
}
.context {
  width: 1243px;
  height: 812px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 15px 30px 0px rgba(191, 198, 217, 0.15);
  border-radius: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: auto;
  .title {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid rgba(231, 231, 231, 1);
    font-size: 22px;
    font-family: arial, sans-serif;
    font-weight: 500;
    color: rgba(39, 40, 56, 1);
    line-height: 38px;
    i {
      width: 20px;
      height: 20px;
      background: url("../../../../../assets/icon_close.png") no-repeat;
      background-size: cover;
      cursor: pointer;
    }
  }
}
.event {
  padding: 40px 105px 0;
}
.list {
  padding-bottom: 30px;
  button {
    width: 100px;
    height: 44px;
    background: rgba(255, 255, 255, 1);
    border: 2px solid rgba(82, 138, 250, 1);
    border-radius: 22px;
    font-size: 20px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(82, 138, 250, 1);
    outline: none;
    cursor: pointer;
    margin-right: 30px;
  }
  .addBtn {
    background: rgba(82, 138, 250, 1);
    color: #fff;
  }
}
.page {
  width: 100%;
  text-align: right;
  margin-top: 12px;
}
</style>