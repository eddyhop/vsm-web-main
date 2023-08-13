<template>
  <!-- 速度限制 -->
  <div class="rateLimit">
    <div class="btns">
      <button class="add" @click.prevent="addRate">
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
        <el-table-column prop="name" :label="$t('newModel.name')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="address" :label="$t('newModel.IPAddress')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="upload" :label="$t('newModel.rate.UplinkLimit')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="download" :label="$t('newModel.rate.SpeedLimitDownside')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="descprition" :label="$t('newModel.description')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column :label="$t('newModel.operation')" align="center" show-overflow-tooltip :resizable="false">
          <template slot-scope="scope">
            <el-button
              @click="openOrDown(scope.row)"
              type="text"
              size="small"
              style="color:#3678C8;font-size:14px;font-weight:400"
              v-control
            >{{scope.row.enable ? $t('newModel.rate.close'): $t('newModel.rate.open')}}</el-button>
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
    <addRateLimt v-show="isShow" />
    <editRateLimt ref="editRateLimt" v-show="eisShow" />
  </div>
</template>
<script>
import addRateLimt from "./components/addRateLimit";
import editRateLimt from "./components/editRateLimt";
import {
  speedlimitGet,
  speedlimitChangeState,
  speedlimitDel
} from "@/services";
export default {
  data() {
    return {
      deviceId:JSON.parse(this.$route.query.devData).deviceId,
      page: 1,
      pageSize: 10,
      allNum: 0,
      tableData: [],
      isShow: false,
      eisShow: false
    };
  },
  components: {
    addRateLimt,
    editRateLimt
  },
  methods: {
    //序号展示
    // The serial number display
    indexMethod(index) {
      return index + 1 + (this.page == 1 ? 0 : this.pageSize * (this.page - 1));
    },
    //页面条数改变
    // The number of page bars changed
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
    sizeChange(val) {
      this.page = val;
      let params = {
        deviceId: this.deviceId,
        pageNumber: this.page,
        pageSize: this.pageSize
      };
      this.dataInit(params);
    },
    //新增速度限制
    // New speed limit
    addRate() {
      this.isShow = true;
    },
    //开启关闭
    // Open to close
    openOrDown(row) {
      let enable = row.enable == 1 ? 0 : 1;
      speedlimitChangeState({ id: row.id, enable }).then(res => {
        if (res.code === 10000) {
          if (row.enable) {
            this.$message({
              type: "success",
              message: this.$t('newModel.rate.msg1')
            });
          } else {
            this.$message({
              type: "success",
              message: this.$t('newModel.rate.msg2')
            });
          }
          let params = {
            deviceId: this.deviceId,
            pageNumber: this.page,
            pageSize: this.pageSize
          };
          this.dataInit(params);
        }
      });
    },
    //编辑
    // edit
    handleClick(row) {
      this.eisShow = true;
      this.$refs.editRateLimt.dataInit(row);
    },
    //删除
    // delete
    remove(row) {
      let deviceId = this.deviceId;
      var show50 = localStorage.getItem("show50");
      if(show50 == 'true'){
          speedlimitDel({ids:[row.id]}).then(res => {
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
        this.$confirm(this.$t("vsr1000.qosremind[1]"+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue50\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>"), {
        confirmButtonText: this.$t("vsr1000.OK"),
        cancelButtonText: this.$t("vsr1000.cancel"),
          dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          speedlimitDel({ids:[row.id]}).then(res => {
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
              localStorage.setItem("show50",localStorage.getItem("checkedValue50"));
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
    dataInit(params) {
      speedlimitGet(params).then(res => {
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
.rateLimit {
  width: 100%;
  padding: 20px 30px;
}
.btns {
  zoom: 1;
  padding-bottom: 20px;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  button {
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
</style>