<!-- 新增租户服务设置 -->
<template>
  <div class="addcompany">
    <div class="cont">
      <div class="title">
        {{$t('TenServiceSet.addNode')}}
        <span @click="close"></span>
      </div>
      <div class="even">
        <div class="search">
          <span>{{$t('TenServiceSet.tenRouDomain')}}：{{vrfName}}</span>
          <!-- <div>
            <span>{{$t('TenServiceSet.tenant1')}}</span>
            <div class="limit">
              <el-select filterable
                v-model="rent"
                class="serverDataSelect"
                filterable
                remote
                reserve-keyword
                :placeholder="$t('TenServiceSet.keyWord')"
                @focus="searchData3"
                @change="rentChange"
                :disabled="$parent.type==1"
              >
                <div
                  class="serverData"
                  v-infinite-scroll="load3"
                  infinite-scroll-delay="500"
                  infinite-scroll-immediate="false"
                >
                  <el-option
                    v-for="item in rentList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </div>
              </el-select>
            </div>
          </div>
          <div>
            <span>{{$t('TenServiceSet.concurrency')}}</span>
            <div class="limit">
              <el-input v-model="num"></el-input>
            </div>
          </div>-->
        </div>
        <div class="chose">
          <div class="tableView">
            <el-table
              :data="tableData"
              style="width: 100%"
              stripe
              size="small"
              ref="multipleTable"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                :selectable="checkboxT"
                width="50"
                align="center"
                show-overflow-tooltip
                :resizable="false"
              ></el-table-column>
              <!-- <el-table-column
                type="index"
                :index="indexMethod"
                :label="$t('TenServiceSet.index')"
                align="center"
                width="60"
                :resizable="false"
              ></el-table-column> -->
              <el-table-column
                prop="deviceName"
                :label="$t('TenServiceSet.devName')"
                :resizable="false"
              ></el-table-column>
              <el-table-column
                prop="deviceNum"
                :label="$t('TenServiceSet.devNumber')"
                :resizable="false"
              ></el-table-column>
              <el-table-column
                prop="logicalName"
                :label="$t('TenServiceSet.logicalPort')"
                :resizable="false"
              >
                <template slot-scope="scope">
                  <el-select filterable
                    v-model="scope.row.logName"
                    
                    remote
                    reserve-keyword
                    @focus="searchData(scope.row,scope.$index)"
                    @change="searchChange(scope.row,scope.$index)"
                  >
                    <div
                      class="serverData"
                      infinite-scroll-delay="500"
                      infinite-scroll-distance="60"
                      infinite-scroll-immediate="false"
                    >
                      <el-option :label="$t('TenServiceSet.no')" value></el-option>
                      <el-option
                        v-for="item in scope.row.logicalList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </div>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="ip" :label="$t('TenServiceSet.publicIp')" :resizable="false">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.ip"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('TenServiceSet.operation')"
                align="center"
                :resizable="false"
              >
                <template slot-scope="scope">
                  <el-button
                    @click="handleClick(scope.row)"
                    type="text"
                    size="small"
                    :class="`detailBtn ${scope.row.disFalg ? 'active' : ''}`"
                    v-control
                    :disabled="scope.row.disFalg"
                  >{{$t('TenServiceSet.portDetails')}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="page">
            <el-pagination
              :page-sizes="[5, 10]"
              :total="allNum"
              @size-change="pageChange"
              @current-change="sizeChange"
              :current-page="page"
              :page-size="10"
              layout="total, sizes, prev, next, jumper"
              style="font-family: arial, sans-serif"
            ></el-pagination>
          </div>
        </div>
        <div class="control">
          <button v-debounce.prevent="submit">{{$t('TenServiceSet.save')}}</button>
          <button class="cancel" @click.prevent="close">{{$t('TenServiceSet.cancel')}}</button>
        </div>
      </div>
      <portDetail v-show="isShow" ref="portDetail" />
    </div>
  </div>
</template>

<script>
import portDetail from "./portDetail";
import {
  tenantServiceGetTenantDeviceList,
  tenantServiceGetDeviceLogicalList,
  tenantServiceAdd,
  tenantServiceEdit,
  tenantServiceGetRentList,
  tenantServiceGetTenantVrfList, userInfo
} from "@/services/index.js";
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// Here you can import other files (such as: components, tools js, third-party plug-ins JS, JSON files, image files, etc.)
//例如：import 《组件名称》 from '《组件路径》';
// For example: import component name from 'Component path ';

export default {
  //import引入的组件需要注入到对象中才能使用
  // Import introduces components that need to be injected into an object before they can be used
  components: {
    portDetail
  },
  data() {
    return {
      isShow: false,
      checked: false,
      page: 1,
      pageSize: 10,
      page2: 1,
      page3: 1,
      allNum: 0,
      tableData: [],
      logicalList: [],
      // loading: false,
      loading2: false,
      multipleSelection: [],
      rent: "",
      rentList: [],
      num: 0,
      vrfName: "",
      vrfList: [],
      loadup: true,
      defaultNmae: "",
      defaultTenId: "",
      userData:[]
    };
  },
  //监听属性 类似于data概念
  // Listening properties are similar to the data concept
  computed: {},
  //监控data中的数据变化
  // Monitor data changes in data
  watch: {},
  //方法集合
  // Methods collection
  methods: {
    //多选设置
    // Multiple Settings
    checkboxT(row, index) {
      if (this.$parent.type == 2) {
        return 1;
      } else {
        if (row.status == 1) {
          return 0;
        } else {
          return 1;
        }
      }
    },
    //表格默认选中
    // Table selected by default
    selected(rows) {
      this.$nextTick(() => {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, true);
        });
      });
    },
    //ip校验
    // The IP checksum
    testIp(val) {
      let reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (reg.test(val)) {
        return;
      } else {
        this.$message({
          type: "warning",
          message: this.$t("TenServiceSet.hint4")
        });
      }
    },
    handleClick(row) {
      // console.log(row)
      this.isShow = true;
      this.$refs.portDetail.dataInit(
        row.logName === row.logicalName ? row.logId : row.logName
      );
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    pageChange(val) {
      // console.log(val)
      //页数总条目改变
      // Total page entries change
      this.pageSize = val;
      let params = {
        pageNumber: 1,
        pageSize: this.pageSize,
        tenantId:sessionStorage.getItem("tenantValue")
      };
      this.page = 1;
      this.tableDataInit(params);
    },
    sizeChange(val) {
      //页数改变
      // Page number change
      // console.log(val)
      this.page = val;
      let params = {
        pageNumber: this.page,
        pageSize: this.pageSize,
        tenantId:sessionStorage.getItem("tenantValue")
      };
      this.tableDataInit(params);
    },
    indexMethod(index) {
      return index + 1 + (this.page == 1 ? 0 : this.pageSize * (this.page - 1));
    },
    close() {
      this.$parent.isShow = false;
    },
    //表格数据初始化
    // Table data initialization
    async tableDataInit(params) {
      let res = await tenantServiceGetTenantDeviceList(params);
      // let data = await tenantServiceGetRentList({
      //   page: this.page3,
      //   pageSize: this.pageSize,
      //   order: "desc",
      //   sort: "createTime"
      // });
      if (res.code === 10000) {
        this.vrfName = res.result.pop();
        this.allNum = res.result.pop();
        res.result.forEach(item => {
          item.page = 1;
          item.logicalList = [];
          item.logName = item.logicalName;
          if (item.logicalName == null) {
            item.disFalg = true;
          } else {
            item.disFalg = false;
          }
        });
        this.tableData = res.result;
        let dataArr = [];
        this.tableData.forEach(item => {
          if (item.ip != null) {
            dataArr.push(item);
          }
        });
        this.selected(dataArr);
      }

      // if (data.code === 10000) {
      //   this.rentList = data.result;
      // }
      // this.rent = data.result[0].id;
      // this.defaultNmae = JSON.parse(
      //   sessionStorage.getItem("userData")
      // ).tenantName;
      // this.defaultTenId = JSON.parse(sessionStorage.getItem("userData")).tenantId;
      // if (this.$parent.type == 2) {
      //   if (this.tableData.length) {
      //     this.rent = this.tableData[0].tenantId;
      //   }
      // } else {
      //   this.rent = this.$parent.rent;
      // }
    },
    //获取表格数据
    // Getting tabular data
    // tableDatainit(params) {
    //   tenantServiceGetTenantDeviceList(params).then(res => {
    //     if (res.code === 10000) {
    //       // this.vrfName = res.result.pop();
    //       // this.allNum = res.result.pop();
    //       // console.log(res.result)
    //       // res.result.forEach(item => {
    //       //   item.page = 1;
    //       //   item.logicalList = [];
    //       //   item.logName = item.logicalName;
    //       //   if (item.logicalName.length) {
    //       //     item.disFalg = false;
    //       //   } else {
    //       //     item.disFalg = true;
    //       //   }
    //       // });
    //       // this.tableData = res.result;
    //     }
    //   });
    // },
    searchData(row, index) {
      tenantServiceGetDeviceLogicalList({
        deviceId: row.deviceId
      }).then(res => {
        if (res.code === 10000) {
          this.tableData[index].logicalList = res.result;
        }
      });
    },
    // searchData2() {
    //   tenantServiceGetTenantVrfList({
    //     page: this.page2,
    //     pageSize: this.pageSize,
    //     tenantId: this.rent
    //   }).then(res => {
    //     if (res.code === 10000) {
    //       this.vrfList = res.result;
    //     }
    //   });
    // },
    // searchData3() {
    //   this.page3 = 1;
    //   this.loadup = true;
    //   tenantServiceGetRentList({
    //     page: this.page3,
    //     pageSize: this.pageSize,
    //     order: "desc",
    //     sort: "createTime"
    //   }).then(res => {
    //     if (res.code === 10000) {
    //       this.rentList = res.result;
    //     }
    //   });
    // },
    // load(row, index) {
    // console.log(row,index)
    // tenantServiceGetDeviceLogicalList({
    //   page: row.page++,
    //   pageSize: this.pageSize,
    //   deviceId: row.deviceId
    // }).then(res => {
    //   if (res.code === 10000) {
    //     this.tableData[index].logicalList = this.tableData[
    //       index
    //     ].logicalList.concat(res.result);
    //   }
    // });
    // },
    // load2() {
    //   tenantServiceGetTenantVrfList({
    //     page: this.page2++,
    //     pageSize: this.pageSize,
    //     tenantId: this.rent
    //   }).then(res => {
    //     if (res.code === 10000) {
    //       this.vrfList = this.vrfList.concat(res.result);
    //     }
    //   });
    // },
    // load3() {
    //   if (this.loadup) {
    //     tenantServiceGetRentList({
    //       page: this.page3++,
    //       pageSize: this.pageSize,
    //       order: "desc",
    //       sort: "createTime"
    //     }).then(res => {
    //       if (res.code === 10000 && res.result.length) {
    //         let arr = this.rentList.concat(res.result);
    //         let newJson = [];
    //         arr.forEach(item1 => {
    //           let flag = true;
    //           newJson.forEach(item2 => {
    //             if (item1.id == item2.id) {
    //               //让json数组对象的内容与新数组的内容作比较，相同的话，改变标记为false
    // Compare the contents of the JSON array object to the contents of the new array, again changing the tag to false
    //               flag = false;
    //             }
    //           });
    //           if (flag) {
    //             newJson.push(item1);
    //           }
    //         });
    //         this.rentList = newJson;
    //       } else {
    //         this.loadup = false;
    //       }
    //     });
    //   }
    // },
    searchChange(row, index) {
      if (row.logName !== "") {
        this.tableData[index].disFalg = false;
      } else {
        this.tableData[index].disFalg = true;
      }
    },
    // rentChange() {
    //   tenantServiceGetTenantDeviceList({
    //     page: this.page,
    //     pageSize: this.pageSize,
    //     tenantId: this.rent
    //   }).then(res => {
    //     if (res.code === 10000) {
    //       this.allNum = res.result.pop();
    //       res.result.forEach(item => {
    //         item.page = 1;
    //         item.logicalList = [];
    //         if (item.logicalName.length) {
    //           item.disFalg = false;
    //         } else {
    //           item.disFalg = true;
    //         }
    //       });
    //       this.tableData = res.result;
    //     }
    //   });
    // },
    //新增
    // add
    submit() {
      if (this.multipleSelection.length) {
        let devList = this.multipleSelection.map(item => {
          return {
            deviceId: item.deviceId,
            id: item.id,
            ip: item.ip,
            logId: item.logName == item.logicalName ? item.logId : item.logName
          };
        });

        let falg;
        devList.forEach(item => {
          let reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]|[1-9]?)\.)(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
          if (reg.test(item.ip)) {
            falg = true;
          } else {
            falg = false;
          }
        });
        if (falg) {
          let params = {
            devList,
            tenantId: sessionStorage.getItem("tenantValue") ,
            userId: this.userData.userId,
            vrfId: ""
          };
          tenantServiceEdit(params).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("TenServiceSet.hint5")
              });
              this.rent = "";
              this.vrfName = "";
              this.$parent.isShow = false;
              this.$parent.page = 1;
              this.$parent.dataInit(
                (params = {
                  devNameRange: "",
                  deviceType: "",
                  pageNumber: 1,
                  pageSize: 10,
                  searchKey: "",
                  tenantId: this.userData.tenantId
                })
              );
            }
          });
        } else {
          this.$message({
            type: "warning",
            message: this.$t("TenServiceSet.hint4")
          });
        }
      } else {
        // if (!this.rent.length) {
        //   this.$message({
        //     type: "warning",
        //     message: this.$t('TenServiceSet.hint6')
        //   });
        // } else if (!this.multipleSelection.length) {
        this.$message({
          type: "warning",
          message: this.$t("TenServiceSet.hint2")
        });
        // }
        // this.$message({
        //   type: "warning",
        //   message: "请选择你要新增的设备"
        // Message: "Please select the device you want to add"
        // });
      }
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  // Life cycle - Creation complete (you can access the current this instance)
  created() {
    userInfo().then(res => {
      this.userData = res.result;
    });
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  // Life cycle - Mount complete (with access to DOM elements)
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
                     // Life cycle - before creation
  beforeMount() {}, //生命周期 - 挂载之前
                    // Life cycle - before mount
  beforeUpdate() {}, //生命周期 - 更新之前
                     // Life cycle - before updates
  updated() {}, //生命周期 - 更新之后
                // Life cycle - after update
  beforeDestroy() {}, //生命周期 - 销毁之前
                      // Life cycle - before destruction
  destroyed() {}, //生命周期 - 销毁完成
                  // Life cycle - Destruction complete
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
                 // If the page has keep-alive caching, this function fires
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
// @import url(); Introduce common CSS classes
.page {
  padding-bottom: 16px;
}
.even {
  padding: 20px 30px 30px 30px;
  // display: flex;
  // flex-direction: column;
  .chsoe::-webkit-scrollbar {
    width: 2px;
    /*height: 4px;*/
  }
  .chose::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }
  .chose::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }
  .chose {
    width: 100%;
    border: 1px solid rgba(209, 215, 224, 1);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 420px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .chose::-webkit-scrollbar {
    width: 4px;
    /*height: 4px;*/
  }
  .chose::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }
  .chose::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }
  .search {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    div {
      display: flex;
      span {
        line-height: 34px;
        margin-right: 10px;
      }
      .limit {
        div {
          width: 216px;
          height: 34px;
        }
      }
      .serverDataSelect {
        width: 120px;
        height: 34px;
      }
    }
  }
}
.control {
  margin-top: 30px;
  .cancel {
    width: 70px;
    height: 34px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(209, 215, 224, 1);
    color: rgba(102, 102, 102, 1);
  }
  button {
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    border: none;
    color: white;
    margin-right: 18px;
  }
  button:hover {
    background: rgba(96, 149, 214, 1);
    color: white;
  }
}
.cont {
  width: 700px;
  height: 657px;
  background: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 7px;
  text-align: center;
  // padding: 30px;
  position: relative;
  h3 {
    font-size: 16px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 22px;
  }
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
      background-image: url("../../../assets/icon_close.png");
      background-size: 14px 14px;
    }
  }
}
.addcompany {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 9;
  background: rgba(32, 42, 59, 0.2);
}
.detailBtn {
  color: #3678c8;
  font-size: 14px;
  font-weight: 400;
}
.active {
  font-size: 14px;
  font-family: arial, sans-serif;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
}
.serverData {
  max-height: 136px;
  width: 100%;
}
</style>
<style lang="scss">
.serverDataSelect {
  input {
    height: 100%;
  }
}
.limit {
  input {
    height: 100%;
  }
}
.tableView {
  .el-input__inner {
    width: 94px;
    height: 24px;
  }
  .el-input__icon {
    line-height: normal;
  }
}
</style>