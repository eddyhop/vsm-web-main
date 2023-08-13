<template>
  <div class="ivpn">
    <!-- Vsr-lite-vpn -->
    <div class="operate">
      <button :class="{active:flag,mouseOver:!flag}" @click="add" :disabled="flag" v-control>
        <img src="@/assets/newPage/icon_add@2x.png" alt="" v-if="!flag" /> 
        <img src="@/assets/newPage/equipment_icon_add_notclick@2x.png" alt="" v-else />
        {{$t('vsr100.vpn.add')}}
      </button>
      <button class="close" @click="choseDel" v-control>{{$t('vsr100.vpn.delete')}}</button>
    </div>
    <div class="tableView">
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        stripe
        size="small"
        tooltip-effect="dark"
        style="width: 100%"
        fit
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" :selectable="isDisabled" width="55" :resizable="false"></el-table-column>
        <!-- <el-table-column type="index" :index="indexMethod" :label="$t('vsr100.vpn.index')" align="center" width="70" :resizable="false"></el-table-column> -->
        <el-table-column prop="name" :label="$t('vsr100.vpn.name')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="ip" :label="$t('vsr100.vpn.IPSite')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="tunnelIp" :label="$t('vsr100.vpn.tunnelIP')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="description" :label="$t('vsr100.vpn.describe')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column :label="$t('vsr100.vpn.operate')" :resizable="false">
          <template slot-scope="scope">
            <button @click="edit(scope.row)" class="edit" v-control>{{scope.row.dataFrom==2 ? $t('vsr1000.info'):$t('vsr100.vpn.edit')}}</button>
            <button @click="del(scope.row)" class="edit" v-show="scope.row.dataFrom!=2" v-control>{{$t('vsr100.vpn.delete')}}</button>
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
    <addIvpn v-show="addShow"></addIvpn>
    <editIvpn ref="editIvpn" v-show="editShow"></editIvpn>
  </div>
</template>
<script>
import addIvpn from "./components/addIvpn.vue";
import editIvpn from "./components/editIvpn.vue";
import { getVpn, delVpn } from "@/services";
export default {
  props: {},
  components: { addIvpn, editIvpn },
  data() {
    return {
      addShow: false,
      editShow: false,
      allNum: 0, //数据总条数
                 // Total number of data bars
      lNumber: 1, //当前页数,
                  // Current number of pages,
      Size: 10,
      tableData: [],
      multipleSelection: [],
      mid: JSON.parse(this.$route.query.devData).deviceId,
      flag: false,
    };
  },
  computed: {
  },
  methods: {
    //判断是否是场景的设备 Determine if it is the device of the scene
    // If it is the device of the scene, Determine if it is the device of the scene
    isDisabled(row) {
      if (row.dataFrom == 2) {
        return 0;
      } else {
        return 1;
      }
    },
    indexMethod(index) {
      return index + 1 + (this.lNumber==1?0:this.Size*(this.lNumber-1));
    },
    getVpnList(params) {
      getVpn(params).then(res => {
        // console.log(res)
        this.flag = res.result[0].length >= 1 ? true : false;
        this.tableData = res.result[0];
        this.allNum = res.result[1];
      });
    },
    getList() {
      let params = { deviceId: this.mid, pageNumber: this.lNumber, pageSize: this.Size };
      this.getVpnList(params);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    choseDel() {
      let ids = [];
      let deviceId = this.mid;
      this.multipleSelection.map(item => {
        ids.push(item.id);
      });
      let params = { ids, deviceId: deviceId, randomId: parseInt((Math.random() + 1) * Math.pow(10, 6 - 1)) };
      if (this.tableData.length == 0) {
        this.$message({
          message: this.$t('vsr100.vpn.remind[2]'),
          type: "warning"
        });
      } else if (params.ids.length == 0) {
        this.$message({
          message: this.$t('vsr100.vpn.remind[3]'),
          type: "warning"
        });
      } else {
        var show43 = localStorage.getItem("show43");
        if(show43 == 'true'){
          
            delVpn(params).then(res => {
              if (res.code == 10000) {
                this.$message({
                  type: "success",
                  message: this.$t('vsr100.vpn.remind[4]')
                });
                this.getList();
              }else{
                this.$message({
                  type: "warning",
                  message: this.$t('vsr100.vpn.remind[5]')
                });
              }
            });
        }else{
          this.$confirm(this.$t('vsr100.vpn.remind[0]'+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue43\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>"), {
            confirmButtonText: this.$t('vsr100.confirm'),
            cancelButtonText: this.$t('vsr100.vpn.cancel'),
            dangerouslyUseHTMLString: true,
            type: "warning"
          })
          .then(() => {
            delVpn(params).then(res => {
              if (res.code == 10000) {
                this.$message({
                  type: "success",
                  message: this.$t('vsr100.vpn.remind[4]')
                });
                this.getList();
                localStorage.setItem("show43",localStorage.getItem("checkedValue43"));
              }else{
                this.$message({
                  type: "warning",
                  message: this.$t('vsr100.vpn.remind[5]')
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: this.$t('vsr100.vpn.remind[1]')
            });
          });

        }
        
      }
    },
    del(row) {
      // console.log(row.id)
      let deviceId = this.mid;
      let params = {
        ids: [row.id],
        deviceId: deviceId,
        randomId: parseInt((Math.random() + 1) * Math.pow(10, 6 - 1))
      };
      var show44 = localStorage.getItem("show44");
      if(show44 == 'true'){
        delVpn(params).then(res => {
            if (res.code == 10000) {
              this.$message({
                type: "success",
                message: this.$t('vsr100.vpn.remind[4]')
              });
              this.getList();
            }else{
              this.$message({
                type: "warning",
                message: this.$t('vsr100.vpn.remind[5]')
              });
            }
          });
      }else{
        this.$confirm(this.$t('vsr100.vpn.remind[0]'+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue44\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>"), {
          confirmButtonText: this.$t('vsr100.confirm'),
          cancelButtonText: this.$t('vsr100.vpn.cancel'),
            dangerouslyUseHTMLString: true,
          type: "warning"
        })
        .then(() => {
          delVpn(params).then(res => {
            if (res.code == 10000) {
              this.$message({
                type: "success",
                message: this.$t('vsr100.vpn.remind[4]')
              });
              this.getList();
              localStorage.setItem("show44",localStorage.getItem("checkedValue44"));
            }else{
              this.$message({
                type: "warning",
                message: this.$t('vsr100.vpn.remind[5]')
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t('vsr100.vpn.remind[1]')
          });
        });

      }
      
    },
    edit(row) {
      this.$refs.editIvpn.isEdit = row.dataFrom != 2;
      this.editShow = true;
      this.$refs.editIvpn.form.name = row.name;
      this.$refs.editIvpn.confirm = row.name;
      // this.$refs.editIvpn.lazyLoad()
      this.$refs.editIvpn.options.push({id:row.serverId,name:row.serverName})
      this.$refs.editIvpn.form.value = row.serverId;
      // this.$refs.editIvpn.lab = row.serverName;
      

      this.$refs.editIvpn.form.id = row.id;
      this.$refs.editIvpn.form.mid = row.deviceId;
      this.$refs.editIvpn.form.mss = row.mss;
      this.$refs.editIvpn.form.mtu = row.mtu;
      this.$refs.editIvpn.form.sdip = row.tunnelIp;
      this.$refs.editIvpn.form.kbps = row.limitRate;
      this.$refs.editIvpn.form.ip = row.ip;
      this.$refs.editIvpn.form.ms = row.description;
      this.$refs.editIvpn.form.leftIp = row.leftIp;
      this.$refs.editIvpn.rowServe = row.serverId,
      this.$refs.editIvpn.rowServeName = row.serverName
    },
    add() {
      this.addShow = true;
    },
    pageChange(val) {
      //页数总条目改变
      // Total page entries change
      this.Size = val;
      let params = {
        pageSize: this.Size,
        page: this.lNumber,
        mid: this.mid
      };
      this.lNumber = 0;
      this.getVpnList(params);
    },
    sizeChange(val) {
      // console.log(val)
      this.lNumber = val;
      let params = {
        pageSize: this.Size,
        page: this.lNumber,
        mid: this.mid
      };
      this.getVpnList(params);
    }
  },
  created() {
    this.getList();
  },
  mounted() {}
};
</script>
<style scoped lang="scss">
.ivpn {
  padding: 20px 30px;
  .edit {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(54, 120, 200, 1);
    border: none;
    background: none;
  }
}
.operate {
  text-align: right;
  img{
     width: 14px;
        height: 14px;
        position: relative;
        top: 2px;
  }
  button {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    color: white;
    border: none;
    outline: none;
    cursor: pointer;
  }
  .addIcon {
      width: 14px;
      height: 14px;
      position: relative;
      top:1px;
      display: inline-block;
      background: url("../../../../assets/newPage/equipment_icon_add@2x.png") no-repeat;
      background-size: cover;
    }
  .img {
    width: 14px;
    height: 14px;
    position: relative;
    top: 2px;
  }
  .active {
    background: #EFEFEF;
    color:#999999;
    .addIcon{
      background: url("../../../../assets/newPage/equipment_icon_add_notclick@2x.png") no-repeat;
      background-size: cover;
    }
  }
  .mouseOver:hover {
    background: rgba(96, 149, 214, 1);
  }
  .close:hover {
    background: rgba(239, 239, 239, 1);
  }
  .close {
    background: rgba(239, 239, 239, 1);
    border: 1px solid rgba(209, 215, 224, 1);
    color: rgba(51, 51, 51, 1);
    margin-left: 14px;
  }
}
.tableView {
  padding-top: 20px;
}
</style>