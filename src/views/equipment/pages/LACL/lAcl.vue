<template>
  <div class="lAcl">
    <div class="title" v-show="this.activeName=='first'?true:false">
      <button @click="addShow=true" class="add" v-control><img src="@/assets/newPage/icon_add@2x.png" alt=""/>  {{$t('vsr100.acl.add')}}</button>
      <button @click="choseDel" v-control>{{$t('vsr100.acl.delete')}}</button>
    </div>
    <div class="title" v-show="this.activeName=='second'?true:false">
      <button @click="addVShow=true" class="add" v-control><img src="@/assets/newPage/icon_add@2x.png" alt=""/>  {{$t('vsr100.acl.add')}}</button>
      <button @click="delMuch" v-control>{{$t('vsr100.acl.delete')}}</button>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="LAN_ACL" name="first">
        <div class="content">
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            border
            stripe
            size="small"
            fit
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" :resizable="false"></el-table-column>
            <el-table-column prop="sortOrder" :label="$t('vsr100.acl.index')" show-overflow-tooltip :resizable="false"></el-table-column>
            <el-table-column prop="sourceIp" :label="$t('vsr100.acl.sourceIP')" show-overflow-tooltip :resizable="false"></el-table-column>
            <el-table-column prop="destinationIp" :label="$t('vsr100.acl.destIP')" show-overflow-tooltip :resizable="false"></el-table-column>
            <el-table-column prop="sourceIpPort" :label="$t('vsr100.acl.sourcePort')" show-overflow-tooltip :resizable="false"></el-table-column>
            <el-table-column prop="destinationIpPort" :label="$t('vsr100.acl.goalPort')" show-overflow-tooltip :resizable="false"></el-table-column>
            <el-table-column prop="protocolName" :label="$t('vsr100.acl.protocol')" show-overflow-tooltip :resizable="false">

            </el-table-column>
            <el-table-column :label="$t('vsr100.acl.operate')" :resizable="false">
              <template slot-scope="scope">
                <div class="control">
                  <button @click="editL(scope.row)" class="edit" v-control>{{$t('vsr100.acl.edit')}}</button>
                  <button @click="del(scope.row)" class="edit" v-control>{{$t('vsr100.acl.delete')}}</button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="page">
            <el-pagination
              :page-sizes="[5, 10]"
              :total="lanAll"
              :page-size="lanSize"
              @size-change="changeSize"
              @current-change="changePage"
              :current-page="lanNum"
              layout="total, sizes, prev, next, jumper"
              style="font-family: arial, sans-serif"
            ></el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <!-- VPN_ACL -->
      <el-tab-pane label="VPN_ACL" name="second">
        <div class="content">
          <el-table
            ref="multipleTable"
            :data="tableData2"
            border
            stripe
            size="small"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="xuan"
            fit
          >
            <el-table-column type="selection" width="55" :resizable="false"></el-table-column>
            <el-table-column prop="sortOrder" :label="$t('vsr100.acl.index')" align="center" width="70" :resizable="false"></el-table-column>
            <el-table-column prop="sourceIp" :label="$t('vsr100.acl.sourceIP')" show-overflow-tooltip :resizable="false"></el-table-column>
            <el-table-column prop="destinationIp" :label="$t('vsr100.acl.destIP')" show-overflow-tooltip :resizable="false"></el-table-column>
            <el-table-column prop="sourceIpPort" :label="$t('vsr100.acl.sourcePort')" show-overflow-tooltip :resizable="false"></el-table-column>
            <el-table-column prop="destinationIpPort" :label="$t('vsr100.acl.goalPort')" show-overflow-tooltip :resizable="false"></el-table-column>
            <el-table-column prop="protocolName" :label="$t('vsr100.acl.protocol')" show-overflow-tooltip :resizable="false"></el-table-column>
            <el-table-column :label="$t('vsr100.acl.operate')" :resizable="false">
              <template slot-scope="scope">
                <div class="control">
                  <button @click="editV(scope.row)" class="edit" v-control>{{$t('vsr100.acl.edit')}}</button>
                  <button @click="delV(scope.row)" class="edit" v-control>{{$t('vsr100.acl.delete')}}</button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="page">
            <el-pagination
              :page-sizes="[5, 10]"
              :total="vpnAll"
              :page-size="vpnSize"
              @size-change="VchangeSize"
              @current-change="VchangePage"
              :current-page="vpnNum"
              layout="total, sizes, prev, next, jumper"
              style="font-family: arial, sans-serif"
            ></el-pagination>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <addLacl ref="addLacl" v-show="addShow"></addLacl>
    <editLacl ref="editLacl" v-show="editShow"></editLacl>
    <addVacl ref="addVacl" v-show="addVShow"></addVacl>
    <editVacl ref="editVacl" v-show="editVShow"></editVacl>
  </div>
</template>
<script>
import addLacl from "./addLacl";
import editLacl from "./editLacl";
import addVacl from "./addVacl";
import editVacl from "./editVacl";
import {
  getLanAcl,
  getVpnAcl,
  delVpnAcl,
  delLanAcl,
  getDict
} from "@/services";
export default {
  data() {
    return {
      activeName: "first",
      addShow: false,
      editShow: false,
      addVShow: false,
      editVShow: false,
      tableData: [],
      multipleSelection: [],
      lanAll: 0,
      lanNum: 1,
      lanSize: 10,
      mid: "",
      tableData2: [],
      choseItem: [],
      vpnAll: 0,
      vpnNum: 1,
      vpnSize: 10,
      flag: true
    };
  },
  methods: {
    indexMethod(index) {
      return index + 1 + (this.vpnNum==1?0:this.vpnSize*(this.vpnNum-1));
    },
    // vpn-acl操作
    // VPN - acl operation
    VchangePage(val) {
      //vpn页数改变
      // VPN page change
      this.vpnNum = val;
      let params = { mid: this.mid, page: this.vpnNum, pageSize: this.vpnSize };
      getVpnAcl(params).then(res => {
        this.tableData2 = res.result[0];
      });
    },
    VchangeSize(val) {
      //vpn页面容量改变
      // VPN page capacity changes
      this.vpnSize = val;
      let params = { mid: this.mid, page: this.vpnNum, pageSize: this.vpnSize };
      getVpnAcl(params).then(res => {
        this.tableData2 = res.result[0];
      });
    },
    xuan(val) {
      //选中vpn-acl
      // Select the VPN - the acl
      this.choseItem = val;
    },
    delMuch() {
      //多删vpn-acl
      // Delete the VPN - the acl
      let ids = [];
      this.choseItem.map(item => {
        ids.push(item.id);
      });
      let params = { ids, deviceId: this.mid, randomId: parseInt((Math.random() + 1) * Math.pow(10, 6 - 1))+'' };
      if (this.tableData2.length == 0) {
        this.$message({
          message: this.$t('vsr100.acl.remind[2]'),
          type: "warning"
        });
      } else if (params.ids.length == 0) {
        this.$message({
          message: this.$t('vsr100.acl.remind[3]'),
          type: "warning"
        });
      } else {
        var show32 = localStorage.getItem("show32");
        if(show32 == 'true'){
          
            delVpnAcl(params).then(res => {
              if (res.code==10000) {
                this.$message({
                  type: "success",
                  message: this.$t('vsr100.acl.remind[4]')
                });
                this.getVList();
              }
            });
        }else{
          this.$confirm(this.$t('vsr100.acl.remind[0]'+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue32\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>"), {
            confirmButtonText: this.$t('vsr100.confirm'),
            cancelButtonText: this.$t('vsr100.acl.cancel'),
            dangerouslyUseHTMLString: true,
            type: "warning"
          })
          .then(() => {
            delVpnAcl(params).then(res => {
              if (res.code==10000) {
                this.$message({
                  type: "success",
                  message: this.$t('vsr100.acl.remind[4]')
                });
                this.getVList();
                localStorage.setItem("show32",localStorage.getItem("checkedValue32"));
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: this.$t('vsr100.acl.remind[1]')
            });
          });

        }
        
      }
    },
    delV(row) {
      //删除单条vpn-acl
      // Remove the single VPN-ACL
      let params = {
        ids: [row.id],
        deviceId: this.mid,
        randomId: parseInt((Math.random() + 1) * Math.pow(10, 6 - 1))+''
      };
      var show33 = localStorage.getItem("show33");
      if(show33 == 'true'){
        
          delVpnAcl(params).then(res => {
            if (res.code==10000) {
              this.$message({
                type: "success",
                message: this.$t('vsr100.acl.remind[4]')
              });
              this.getVList();
            }
          });
      }else{
        this.$confirm(this.$t('vsr100.acl.remind[0]'+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue33\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>"), {
        confirmButtonText: this.$t('vsr100.confirm'),
        cancelButtonText: this.$t('vsr100.acl.cancel'),
          dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          delVpnAcl(params).then(res => {
            if (res.code==10000) {
              this.$message({
                type: "success",
                message: this.$t('vsr100.acl.remind[4]')
              });
              this.getVList();
              localStorage.setItem("show33",localStorage.getItem("checkedValue33"));
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t('vsr100.acl.remind[1]')
          });
        });

      }
      
    },
    editV(row) {
      //编辑vpn-acl
      // Edit the VPN - the acl
      this.editVShow = true;
      this.$refs.editVacl.form.Ip = row.sourceIp;
      this.$refs.editVacl.form.goalIp = row.destinationIp;
      this.$refs.editVacl.form.goalCode = row.destinationIpPort;
      this.$refs.editVacl.form.code = row.sourceIpPort;
      this.$refs.editVacl.form.value = row.protocol
      this.$refs.editVacl.form.id = row.id;
      this.$refs.editVacl.chose(row.protocol);
      this.$refs.editVacl.form.num = row.sortOrder;
    },
    // lan-acl操作
    // LAN - acl operation
    changeSize(val) {
      //改变lan-acl页面容量
      // Change the LAN-ACL page size
      this.lanSize = val;
      let params = { mid: this.mid, page: this.lanNum, pageSize: this.lanSize };
      getLanAcl(params).then(res => {
        this.tableData = res.result[0];
      });
    },
    changePage(val) {
      //改变lan-acl页数
      // Change lan-ACL pages
      this.lanNum = val;
      let params = { mid: this.mid, page: this.lanNum, pageSize: this.lanSize };
      getLanAcl(params).then(res => {
        this.tableData = res.result[0];
      });
    },
    choseDel() {
      //选中删除lan-acl
      // Select remove Lan-ACL
      let ids = [];
      this.multipleSelection.map(item => {
        ids.push(item.id);
      });
      let params = { ids, deviceId: this.mid, randomId: parseInt((Math.random() + 1) * Math.pow(10, 6 - 1))+'' };
      if (this.tableData.length == 0) {
        this.$message({
          message: this.$t('vsr100.acl.remind[2]'),
          type: "warning"
        });
      } else if (params.ids.length == 0) {
        this.$message({
          message: this.$t('vsr100.acl.remind[3]'),
          type: "warning"
        });
      } else {
        var show34 = localStorage.getItem("show34");
        if(show34 == 'true'){
          
            delLanAcl(params).then(res => {
              if (res.code==10000) {
                this.$message({
                  type: "success",
                  message: this.$t('vsr100.acl.remind[4]')
                });
                this.getLList();
              }
            });
        }else{
          this.$confirm(this.$t('vsr100.acl.remind[0]'+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue34\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>"), {
            confirmButtonText: this.$t('vsr100.confirm'),
            cancelButtonText: this.$t('vsr100.acl.cancel'),
            dangerouslyUseHTMLString: true,
            type: "warning"
          })
          .then(() => {
            delLanAcl(params).then(res => {
              if (res.code==10000) {
                this.$message({
                  type: "success",
                  message: this.$t('vsr100.acl.remind[4]')
                });
                this.getLList();
                localStorage.setItem("show34",localStorage.getItem("checkedValue34"));
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: this.$t('vsr100.acl.remind[1]')
            });
          });

        }
        
      }
    },
    del(row) {
      //删除lan-acl
      // Delete the LAN - the acl
      let params = {
        ids: [row.id],
        deviceId: this.mid,
        randomId: parseInt((Math.random() + 1) * Math.pow(10, 6 - 1))+'',//随机Id
                                                                         // Random Id
      };
      var show35 = localStorage.getItem("show35");
      if(show35 == 'true'){
        delLanAcl(params).then(res => {
            if (res.code==10000) {
              this.$message({
                type: "success",
                message: this.$t('vsr100.acl.remind[4]')
              });
              this.getLList();
            }
          });
      }else{
        this.$confirm(this.$t('vsr100.acl.remind[0]'+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue35\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>"), {
        confirmButtonText: this.$t('vsr100.confirm'),
        cancelButtonText: this.$t('vsr100.acl.cancel'),
          dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          delLanAcl(params).then(res => {
            if (res.code==10000) {
              this.$message({
                type: "success",
                message: this.$t('vsr100.acl.remind[4]')
              });
              this.getLList();
              localStorage.setItem("show35",localStorage.getItem("checkedValue35"));
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t('vsr100.acl.remind[1]')
          });
        });
      }
      
    },
    editL(row) {
      //编辑lan-acl
      // Edit LAN - the acl
      this.editShow = true;
      this.$refs.editLacl.form.Ip = row.sourceIp;
      this.$refs.editLacl.form.goalIp = row.destinationIp;
      this.$refs.editLacl.form.goalCode = row.destinationIpPort;
      this.$refs.editLacl.form.code = row.sourceIpPort;
      this.$refs.editLacl.form.value = Number(row.protoclId);
      this.$refs.editLacl.form.id = row.id;
      this.$refs.editLacl.form.num = row.sortOrder;
      this.$refs.editLacl.form.confirmNum = row.sortOrder;
      this.$refs.editLacl.form.value = row.protocol;
      this.$refs.editLacl.chose(row.protocol);
    },
    handleSelectionChange(val) {
      //获取选中选项
      // Get selected options
      this.multipleSelection = val;
    },
    getLList() {
      //获取lan-acl列表
      // Gets the LAN-ACL list
      let params = { deviceId: this.mid, pageNumber: this.vpnNum, pageSize: this.vpnSize };
      getLanAcl(params).then(res => {
        // console.log(res)
        this.tableData = res.result.content;
        this.lanAll = res.result.totalElements;
      });
    },
    getVList() {
      //获取vpn-acl列表
      // Gets the VPN-ACL list
      let params = { deviceId: this.mid, pageNumber: this.lanNum, pageSize: this.lanSize };
      getVpnAcl(params).then(res => {
        // console.log(res)
        this.tableData2 = res.result.content;
        this.vpnAll = res.result.totalElements;
      });
    },
    getProtoclList() {
      //获取协议选项
      // Get protocol options
      getDict({groupCode:"lanAcl",typeCode:"agree"}).then(res => {
        this.$refs.addLacl.form.options = res.result;
        this.$refs.editLacl.form.options = res.result;
        this.$refs.addVacl.form.options = res.result;
        this.$refs.editVacl.form.options = res.result;
      });
    }
  },
  created() {
    this.mid = JSON.parse(this.$route.query.devData).deviceId;
    let _this = this
    async function getAll(params) {
      let getFirst = await _this.getLList()
      let getSecond = await _this.getVList()
      let getThird = await _this.getProtoclList()
    }
    getAll()
  },
  components: { addLacl, addVacl, editLacl, editVacl }
};
</script>
<style lang="scss" scoped>
.lAcl {
  width: 100%;
  padding: 20px 30px;
  position: relative;
  .title {
    position: absolute;
    z-index: 9;
    right: 30px;
    .add:hover{
      background:rgba(96,149,214,1);
    }
    button {
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      width: 100px;
      height: 34px;
      background: rgba(54, 120, 200, 1);
      border-radius: 7px;
      color: white;
      border: none;
    }
    img{
        width: 14px;
        height: 14px;
        position: relative;
        top: 2px;
      }
  }
  .title button:nth-of-type(2) {
    border: 1px solid rgba(209, 215, 224, 1);
    background: rgba(239, 239, 239, 1);
    margin-left: 14px;
    color: #333333;
  }
  .content {
    margin-top: 6px;
    .control {
      .edit {
        font-size: 14px;
        font-family: arial, sans-serif;
        font-weight: 400;
        color: rgba(54, 120, 200, 1);
        border: none;
        background: none;
      }
    }
  }
}
</style>
<style lang="scss">
.lAcl {
  .el-tabs__active-bar,
  .el-tabs__nav-wrap::after {
    height: 0px;
  }
  #tab-second {
    margin-left: 18px;
  }
  .el-tabs__item {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    width: 100px;
    height: 34px;
    background: white;
    border: 1px solid rgba(209, 215, 224, 1);
    border-radius: 7px;
    text-align: center;
    padding: 0px;
    line-height: 34px;
  }
  .el-tabs__item:hover {
    color: white;
    background: rgba(54, 120, 200, 1);
  }
  .el-tabs__item.is-active:hover {
    background: #6095d6;
    border: none;
  }
  .el-tabs__item.is-active {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: white;
    background: rgba(54, 120, 200, 1);
    border: none;
  }
}
</style>