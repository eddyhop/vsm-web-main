<template>
  <!-- DNAT -->
  <div class="DNAT">
    <div class="btns">
      <button class="add" @click.prevent="daddDNAT">
        <img src="@/assets/newPage/icon_add@2x.png" alt />
        {{$t('newModel.add')}}
      </button>
    </div>
    <div class="tableList">
      <el-table :data="tableData" border stripe style="width: 100%" size="small">
        <!-- <el-table-column
          type="index"
          :index="indexMethod"
          :label="$t('DeviceMan.index')"
          align="center"
          width="70"
          :resizable="false"
        ></el-table-column> -->
        <el-table-column prop="outIp" :label="$t('newModel.IPOutside')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="localIp" :label="$t('newModel.IPAddresss')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column
          :label="$t('DeviceMan.operation')"
          align="center"
          width="200"
          :resizable="false"
        >
          <template slot-scope="scope">
            <el-button
              @click="handleClick(scope.row)"
              type="text"
              size="small"
              style="color:#3678C8;font-size:14px;font-weight:400"
              v-control
            >{{$t('vsr1000.edit')}}</el-button>
            <el-button
              type="text"
              size="small"
              @click="details(scope.row)"
              style="color:#3678C8;font-size:14px;font-weight:400"
              v-control
            >{{$t("vsr1000.check")}}</el-button>
            <el-button
              type="text"
              size="small"
              @click="remove(scope.row)"
              style="color:#3678C8;font-size:14px;font-weight:400"
              v-control
            >{{$t('vsr1000.delete')}}</el-button>
          </template>
        </el-table-column>
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
    <addDNAT100 ref="addDNAT100" v-show="isShow" />
    <editDNAT100 ref="editDNAT100" v-show="eisShow" />
    <detailsDNAT100 ref="detailsDNAT100" v-show="checkShow" />
  </div>
</template>
<script>
import { dnatGet, dnatDel } from "@/services/index";
import addDNAT100 from "./components/addDNAT100";
import editDNAT100 from "./components/editDNAT100";
import detailsDNAT100 from "./components/detailsDNAT100";
export default {
  data() {
    return {
      deviceId:JSON.parse(this.$route.query.devData).deviceId,
      page: 1,
      pageSize: 10,
      allNum: 0,
      tableData: [],
      isShow: false,
      eisShow: false,
      checkShow: false
    };
  },
  components: { addDNAT100, editDNAT100, detailsDNAT100 },
  methods: {
    //序号展示
    //The serial number display
    indexMethod(index) {
      return index + 1 + (this.page == 1 ? 0 : this.pageSize * (this.page - 1));
    },
    //页面条数改变
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
    //新增
    //add
    daddDNAT() {
      this.isShow = true;
      // this.$refs.components.addDNAT100.dataInit();
      this.$refs.addDNAT100.dataInit();
    },
    //编辑
    //edit
    handleClick(row) {
      this.eisShow = true;
      this.$refs.editDNAT100.dataInit(row);
    },
    //查看
    //examine
    details(row) {
      this.checkShow = true;
      this.$refs.detailsDNAT100.dataInit(row);
    },
    //单项删除
    //Single delete
    remove(row) {
      let deviceId = this.deviceId;
      var show26 = localStorage.getItem("show26");
      if(show26 == 'true'){
        
          dnatDel({ id: row.id }).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[2]")
              });
              this.page = 1;
              this.dataInit({
                deviceId,
                pageNumber: this.page,
                pageSize: this.pageSize
              });
            } else if (res.code !== 10000) {
              this.page = 1;
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
        this.$confirm(this.$t("vsr1000.qosremind[1]"+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue26\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>"), {
          confirmButtonText: this.$t("vsr1000.OK"),
          cancelButtonText: this.$t("vsr1000.cancel"),
            dangerouslyUseHTMLString: true,
          type: "warning"
        })
        .then(() => {
          dnatDel({ id: row.id }).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[2]")
              });
              this.page = 1;
              this.dataInit({
                deviceId,
                pageNumber: this.page,
                pageSize: this.pageSize
              });
              localStorage.setItem("show26",localStorage.getItem("checkedValue26"));
            } else if (res.code !== 10000) {
              this.page = 1;
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
      
    },
    //数据初始化
    //Data initialization
    dataInit(params) {
      dnatGet(params).then(res => {
        if (res.code === 10000) {
          this.allNum = res.result.totalElements;
          this.tableData = res.result.content;
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
.DNAT {
  padding: 20px 30px;
}
.btns {
  width: 100%;
  zoom: 1;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  .add {
    float: right;
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
}
.tableList {
  padding-top: 20px;
}
</style>