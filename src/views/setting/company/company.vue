<!-- 移动端地址池分配 -->
<template>
  <div class="company">
    <div class="search">
      <h3>
        {{$t('TenServiceSet.set')}}
        <img src="@/assets/icon_right@2x.png" alt />
        <!-- <span>{{$t('TenServiceSet.TenServiceSet')}}</span> -->
        <span>{{$t('TenServiceSet.vpnIpAllot')}}</span>
      </h3>
      <!-- <div class="opt">
        <span>{{$t('TenServiceSet.tenant')}}</span>
        <div class="limit">
          <el-select filterable
            v-model="rent"
            class="serverDataSelect"
            
            remote
            reserve-keyword
            :placeholder="$t('TenServiceSet.keyWord')"
            @focus="searchData3"
            :disabled="type==1"
          >
            <div
              class="serverData"
              v-infinite-scroll="load3"
              infinite-scroll-delay="500"
              infinite-scroll-immediate="false"
            >
              <el-option :label="$t('TenServiceSet.all')" value></el-option>
              <el-option
                v-for="item in rentList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </div>
          </el-select>
        </div>
        <button @click="searchEvent">{{$t('TenServiceSet.search')}}</button>
      </div>-->
    </div>
    <div class="content">
      <div class="control">
        <button v-debounce.prevent="exportEvent" :class="{btnEn:lang=='en'}">{{$t('TenServiceSet.certificate')}}</button>
        <span>{{$t('TenServiceSet.certificateHint')}}</span>
        <button :class="`add `" @click="addEvent" v-control>
          <img src="@/assets/newPage/icon_add@2x.png" alt />
          {{$t('TenServiceSet.add')}}
        </button>
        <!-- <button class="add active" disabled v-else>
          <img src="@/assets/newPage/equipment_icon_add_notclick@2x.png" alt />
          {{$t('TenServiceSet.add')}}
        </button>-->
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        stripe
        size="small"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <!-- <el-table-column
          type="index"
          :index="indexMethod"
          :label="$t('TenServiceSet.index')"
          align="center"
          width="70"
          :resizable="false"
        ></el-table-column> -->
        <!-- <el-table-column prop="name" :label="$t('TenServiceSet.tenant1')" show-overflow-tooltip></el-table-column> -->
        <el-table-column
          prop="device"
          :label="$t('TenServiceSet.authorized')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column prop="logicalName" :label="$t('TenServiceSet.logicalPort')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column prop="ip" :label="$t('TenServiceSet.publicIp')" show-overflow-tooltip :resizable="false"></el-table-column>
        <el-table-column :label="$t('TenServiceSet.operation')" :resizable="false">
          <template slot-scope="scope">
            <el-button
              class="edit"
              type="text"
              size="small"
              @click="edit(scope.row)"
              v-control
              style="color:#3678C8;font-size:14px;font-weight:400"
            >{{$t('TenServiceSet.mobilePop')}}</el-button>
            <el-button
              class="edit"
              type="text"
              size="small"
              @click="del(scope.row)"
              v-control
              style="color:#3678C8;font-size:14px;font-weight:400"
            >{{$t('TenServiceSet.del')}}</el-button>
            <!-- <button class="edit" @click="copy(scope.row)" v-control>{{$t('TenServiceSet.copy')}}</button> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :page-sizes="[5, 10]"
          :total="allItem"
          :page-size="10"
          @size-change="pageChange"
          @current-change="sizeChange"
          :current-page="page"
          layout="total, sizes, prev, next, jumper"
          style="font-family: arial, sans-serif"
        ></el-pagination>
      </div>
      <addCompany v-show="isShow" ref="addCompany"></addCompany>
      <vpnIpAllot :devId="devId" v-if="isShow2" ref="vpnIpAllot" />
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// Here you can import other files (such as: components, tools js, third-party plug-ins JS, JSON files, image files, etc.)
//例如：import 《组件名称》 from '《组件路径》';
// For example: import component name from 'Component path ';
import addCompany from "./addCompany";
// import editCompany from "./editCompany";
import vpnIpAllot from "./vpnIpAllot2";
import {
  tenantServiceFindByCondition,
  tenantServiceGetRentLists,
  tenantServiceDel,
  caRoot
} from "@/services/index.js";
import axios from "axios";
import { getToken } from "@/utils/cookie";
export default {
  //import引入的组件需要注入到对象中才能使用
  // Import introduces components that need to be injected into an object before they can be used
  components: { addCompany, vpnIpAllot },
  data() {
    return {
      isShow: false,
      isShow2: false,
      allItem: 0,
      page: 1,
      page2: 1,
      pageSize: 10,
      tableData: [],
      rent: "",
      defaultRent: "",
      rentList: [],
      type: "",
      loadup: true,
      devId: "",
      lang:""
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
    addEvent() {
      this.isShow = true;
      this.$refs.addCompany.tableDataInit({
        pageNumber: 1,
        pageSize: 10,
        tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId
      });
    },
    dataInit(params) {
      tenantServiceFindByCondition(params).then(res => {
        if (res.code === 10000) {
          this.allItem = res.result.pop();
          this.tableData = res.result;
          if (this.type == 2) {
            return;
          } else {
            this.rent = JSON.parse(sessionStorage.getItem("userData")).tenantName;
            this.defaultRent = JSON.parse(
              sessionStorage.getItem("userData")
            ).tenantId;
          }
        }
      });
    },
    pageChange(val) {
      //页数总条目改变
      // Total page entries change
      this.pageSize = val;
      let params = {
        devNameRange: "",
        deviceType: "",
        pageNumber: this.page,
        pageSize: this.pageSize,
        searchKey: "",
        tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId
      };
      this.page = 1;
      this.dataInit(params);
    },
    sizeChange(val) {
      //页数改变
      // Page number change
      // console.log(val)
      this.page = val;
      let params = {
        devNameRange: "",
        deviceType: "",
        pageNumber: this.page,
        pageSize: this.pageSize,
        searchKey: "",
        tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId
      };
      this.dataInit(params);
    },
    indexMethod(index) {
      return index + 1 + (this.page == 1 ? 0 : this.pageSize * (this.page - 1));
    },
    //搜索事件
    // Search events
    searchEvent() {
      let type = JSON.parse(sessionStorage.getItem("userData")).type;
      if (type === 1) {
        this.dataInit({
          devNameRange: "",
          deviceType: "",
          pageNumber: 1,
          pageSize: this.pageSize,
          searchKey: "",
          tenantId: this.defaultRent
        });
        this.page = 1;
      } else {
        this.dataInit({
          devNameRange: "",
          deviceType: "",
          pageNumber: 1,
          pageSize: this.pageSize,
          searchKey: "",
          tenantId: this.rent
        });
        this.page = 1;
      }
    },
    //删除列表项
    // Delete list items
    del(row) {
      var show87 = localStorage.getItem("show87");
      if(show87 == 'true'){
        
          tenantServiceDel({ id: row.id }).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("TenServiceSet.hint1")
              });
              let params = {
                devNameRange: "",
                deviceType: "",
                pageNumber: 1,
                pageSize: this.pageSize,
                searchKey: "",
                tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId
              };
              this.page = 1;
              this.dataInit(params);
            }
          });
      }else{
        this.$confirm(
          this.$t("TenServiceSet.confirmDel")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue87\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>",
          this.$t("TenServiceSet.hint"),
          {
            confirmButtonText: this.$t("TenServiceSet.ok"),
            cancelButtonText: this.$t("TenServiceSet.cancel"),
            dangerouslyUseHTMLString: true,
            type: "warning"
          }
        )
        .then(() => {
          tenantServiceDel({ id: row.id }).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("TenServiceSet.hint1")
              });
              let params = {
                devNameRange: "",
                deviceType: "",
                pageNumber: 1,
                pageSize: this.pageSize,
                searchKey: "",
                tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId
              };
              this.page = 1;
              this.dataInit(params);
              localStorage.setItem("show87",localStorage.getItem("checkedValue87"));
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("TenServiceSet.cancelled")
          });
        });
      }
      
    },
    edit(row) {
      this.devId = row.id;
      // this.$refs.editCompany.tableDataInit(
      //   {
      //     page: 1,
      //     pageSize: 10,
      //     tenantId: row.tenantId
      //   },
      //   row
      // );
      this.isShow2 = true;
    },
    //获焦请求租户
    // Get the focus and ask the tenant
    searchData3() {
      this.page2 = 1;
      this.loadup = true;
      tenantServiceGetRentLists({
        pageNumber: this.page2,
        pageSize: this.pageSize,
        order: "desc",
        sort: "createTime"
      }).then(res => {
        if (res.code === 10000) {
          this.rentList = res.result;
        }
      });
    },
    load3() {
      if (this.loadup) {
        tenantServiceGetRentLists({
          pageNumber: this.page2++,
          pageSize: this.pageSize,
          order: "desc",
          sort: "createTime"
        }).then(res => {
          if (res.code === 10000 && res.result.length) {
            let arr = this.rentList.concat(res.result);
            let newJson = [];
            arr.forEach(item1 => {
              let flag = true;
              newJson.forEach(item2 => {
                if (item1.id == item2.id) {
                  //让json数组对象的内容与新数组的内容作比较，相同的话，改变标记为false
                  // Compare the contents of the JSON array object to the contents of the new array, again changing the tag to false
                  flag = false;
                }
              });
              if (flag) {
                newJson.push(item1);
              }
            });
            this.rentList = newJson;
          } else {
            this.loadup = false;
          }
        });
      }
    },
    exportEvent() {
      var show88 = localStorage.getItem("show88");
      if(show88 == 'true'){
          axios({
            // 用axios发送post请求
            // Send a POST request using AXIOS
            method: "get",
            url: " /vsm/ca/root", // 请求地址
                                  // Request the address
            // 参数
            // parameter
            responseType: "blob", // 表明返回服务器返回的数据类型
                                  // Indicates the type of data returned by the return server
            headers: {
              "Content-Type": "application/json",
              accessToken: getToken()
            }
          }).then(res => {
            // 处理返回的文件流
            // Process the returned file flow
            const blob = new Blob([res]); //new Blob([res])中不加data就会返回下图中[objece objece]内容（少取一层）
                                          // New Blob([RES]) returns the [Objece Objece] content in the image below without adding data (take one less layer)
            const fileName = "ca.pem"; //下载文件名称
                                       // Download file name
            const elink = document.createElement("a");
            elink.download = fileName;
            elink.style.display = "none";
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
                                             // Release the URL object
            document.body.removeChild(elink);
          });
      }else{
        this.$confirm(this.$t("Mobile.hint3")+"<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue88\",this.checked)' type='checkbox'> "+this.$t("doNotShowThisAgain")+"</label></div>", {
        confirmButtonText: this.$t("Mobile.ok"),
        cancelButtonText: this.$t("Mobile.cancel"),
          dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          axios({
            // 用axios发送post请求
            // Send a POST request using AXIOS
            method: "get",
            url: " /vsm/ca/root", // 请求地址
                                  // Request the address
            // 参数
            // parameter
            responseType: "blob", // 表明返回服务器返回的数据类型
                                  // Indicates the type of data returned by the return server
            headers: {
              "Content-Type": "application/json",
              accessToken: getToken()
            }
          }).then(res => {
            // 处理返回的文件流
            // Process the returned file flow
            const blob = new Blob([res]); //new Blob([res])中不加data就会返回下图中[objece objece]内容（少取一层）
                                          // New Blob([RES]) returns the [Objece Objece] content in the image below without adding data (take one less layer)
            const fileName = "ca.pem"; //下载文件名称
                                       // Download file name
            const elink = document.createElement("a");
            elink.download = fileName;
            elink.style.display = "none";
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
                                             // Release the URL object
            document.body.removeChild(elink);
            localStorage.setItem("show88",localStorage.getItem("checkedValue88"));
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("Mobile.hint4")
          });
        });
      }
      
      // mobileUserDownload().then(res=>{

      // })
      // location.href = "http://172.26.28.133:18888/vsm/mobileUser/download";
    }
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  // Life cycle - Creation complete (you can access the current this instance)
  created() {
    this.type = JSON.parse(sessionStorage.getItem("userData")).type;
    if (this.type == 2) {
      tenantServiceGetRentLists({
        pageNumber: 1,
        pageSize: 10,
        order: "desc",
        sort: "createTime"
      }).then(res => {
        if (res.code === 10000) {
          this.rentList = res.result;
          let obj = {
            id:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId,
            name: JSON.parse(sessionStorage.getItem("userData")).tenantName
          };
          this.rentList.push(obj);
          this.rent = this.rentList.find(
            item =>
              item.id ===JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId
          ).id;
          let params = {
            devNameRange: "",
            deviceType: "",
            pageNumber: this.page,
            pageSize: this.pageSize,
            searchKey: "",
            tenantId: this.rent
          };
          this.dataInit(params);
        }
      });
    } else {
      let params = {
        devNameRange: "",
        deviceType: "",
        pageNumber: this.page,
        pageSize: this.pageSize,
        searchKey: "",
        tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId
      };
      this.dataInit(params);
    }
    this.lang = sessionStorage.getItem("lang")
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
.opt {
  display: flex;
  margin-top: 20px;
  .limit {
    div {
      width: 104px;
    }
  }
  span {
    width: 108px;
    line-height: 34px;
    color: #333333;
    margin-right: -30px;
  }
  button {
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    border: none;
    margin-left: 25px;
  }
  .btnEn{
      height: 40px;
      width: 150px;
    }
  button:hover {
    background: rgba(96, 149, 214, 1);
  }
}
.content::-webkit-scrollbar {
  width: 4px;
  /*height: 4px;*/
}
.content::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.content::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.content {
  flex: 1;
  background: white;
  margin-top: 20px;
  padding: 20px 30px;
  overflow-x: hidden;
  overflow-y: auto;
  .control {
    width: 100%;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    position: relative;
    span {
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      margin-left: 14px;
    }
    button {
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      width: 100px;
      height: 34px;
      background: rgba(54, 120, 200, 1);
      border-radius: 7px;
      border: none;
      color: white;
      &:hover {
        background: rgba(96, 149, 214, 1);
      }
    }
    .btnEn{
      height: 40px;
      width: 170px;
    }
    .add {
      position: absolute;
      right: 0px;
      img {
        width: 14px;
        height: 14px;
        position: relative;
        top: 2px;
      }
    }
    .active {
      background: #efefef;
      color: #999999;
    }
    .active:hover {
      background: #efefef;
    }
  }
}
.serverData {
  max-height: 136px;
  width: 100%;
}
.company {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .search {
    width: 100%;
    height: auto;
    background: white;
    padding: 20px 30px;
    position: relative;
    h3 {
      font-size: 15px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      span {
        font-size: 14px;
        line-height: 8px;
      }
      img {
        width: 5px;
        height: 8px;
        margin-left: 5px;
        margin-right: 5px;
      }
    }
  }
}
</style>