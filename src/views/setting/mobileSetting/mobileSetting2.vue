<template>
  <div class="mobileSetting">
    <div class="title">
      <h3>
        {{ $t("Mobile.vsnConfigurations") }}
        <img src="@/assets/icon_right@2x.png" alt />
        <span>{{ $t("Mobile.mobileCllents") }}</span>
      </h3>
      <div class="search">
        <div class="but fl" >
          <ul class="tabs">
            <li
                :class="item.id === activeIndex ? 'active' : ''"
                v-for="(item) in tabsData"
                :key="item.id"
                @click="tabsEvent(item)"
            >{{item.name}}</li>
          </ul>
        </div>
        <div class="formItem">
          <button
            :class="{ active: repeatName }"
            :disabled="repeatName"
            v-show="showSync"
            v-debounce.prevent="sync"
            v-control
          >
            {{ $t("Mobile.sync") }}
          </button>
        </div>
      </div>
    </div>
    <div class="devList" v-show="!isShowT">
      <div class="operate">
        <div class="opSearch">
          <i>
            <img src="@/assets/newPage/icon_search@2x.png" alt />
          </i>
          <el-autocomplete
            class="inline-input"
            v-model="searchVal"
            :fetch-suggestions="querySearch"
            :trigger-on-focus="false"
            :placeholder="$t('Mobile.clientUsername')"
            @select="handleSelect"
          >
            <!-- @blur="searchEvent" -->
            <template slot-scope="{ item }">
              <div class="name">{{ item }}</div>
            </template>
          </el-autocomplete>
        </div>
        <div class="btns" style="float: left">
          <button style="height: 40px" class="add" @click="searchEvent">
            {{ $t("Mobile.search") }}
          </button>
        </div>
        <div class="btns" v-show="addShow">
          <button class="add" v-control @click="isShow = true">
            <img src="@/assets/newPage/icon_add@2x.png" alt />
            {{ $t("Mobile.add") }}
          </button>
        </div>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        stripe
        size="small"
        tooltip-effect="dark"
      >
        <el-table-column
          prop="username"
          :label="$t('Mobile.clientUsername')"
          align="center"
          show-overflow-tooltip
          :resizable="false"
          :formatter="formatName"
        ></el-table-column>
        <el-table-column
          prop="username"
          :label="$t('Mobile.clientDomain')"
          align="center"
          show-overflow-tooltip
          :resizable="false"
          :formatter="formatDom"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          :label="$t('Mobile.addTime')"
          align="center"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="tenantName"
          :label="$t('DeviceMan.tenant')"
          align="center"
          :resizable="false"
          v-if="!addShow"
        >
        </el-table-column>
        <el-table-column
          :label="$t('Mobile.operate')"
          align="center"
          :resizable="false"
          v-if="addShow"
        >
          <template slot-scope="scope">
            <el-button
              @click="handleClick(scope.row)"
              type="text"
              size="small"
              style="color: #3678c8; font-size: 14px; font-weight: 400"
              v-control
              >{{ $t("Mobile.edit") }}</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="del(scope.row)"
              style="color: #3678c8; font-size: 14px; font-weight: 400"
              v-control
              >{{ $t("Mobile.delete") }}</el-button
            >
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
    </div>
    <thirdCertification v-show="isShowT" ref="thirdCertification" />
    <addMsetting v-show="isShow" />
    <editMsetting v-show="isShow2" ref="editMsetting" />
    <!-- <importFile v-show="flag" /> -->
  </div>
</template>
<script>
import addMsetting from "./components/addMsetting";
import thirdCertification from "./components/thirdCertification";
import editMsetting from "./components/editMsetting";
import importFile from "./components/importFile";
import {
  mobileUserGetTenantVrfList,
  mobileUserGetByCondition,
  mobileUserDel,
  mobileUserSyncMobileUser,
  radiusGetRadiusEnable,
  radiusSynchronous,
  userInfo,
} from "@/services/index.js";
import request from "@/utils/request";
import { getToken } from "@/utils/cookie";
import axios from "axios";
export default {
  props: {},
  components: {
    addMsetting,
    thirdCertification,
    editMsetting,
  },
  data() {
    return {
      tabsData: [
        {
          name: this.$t('Mobile.clients'),
          id: 0
        },
        {
          name: this.$t('Mobile.clientGroups'),
          id: 1
        },
      ],
      searchVal: "",
      restaurants: [],
      tableData: [],
      index: 0,
      isShow: false,
      isShowT: false,
      isShow2: false,
      vlfName: "",
      vlfList: [],
      vlfPage: 1,
      vlfPageSize: 20,
      page: 1,
      pageSize: 10,
      allItem: 0,
      input: "",
      flag: false,
      file: {},
      repeatName: false,
      showSync: true,
      three: false,
      timer: null,
      tenantId: sessionStorage.getItem("tenantValue"),
      addShow: false,
      userId: "",
    };
  },
  computed: {
    otherData: function () {
      return {
        tenantId: sessionStorage.getItem("tenantValue"),
        vrfId: this.vlfName,
      };
    },
  },
  methods: {
    formatName(row, column) {
      let name = row.username;
      if (name.indexOf("@") > -1) {
        return name.split("@")[0];
      } else {
        return name;
      }
    },
    formatDom(row, column) {
      let name = row.username;
      if (name.indexOf("@") > -1) {
        return name.split("@")[1];
      } else {
        return name;
      }
    },
    //失去焦点搜索
    // Lose focus search
    searchEvent() {
      if (this.searchVal.length) {
        let params = {
          pageNumber: 1,
          pageSize: 10,
          tenantId: sessionStorage.getItem("tenantValue"),
          username: this.searchVal,
          vrfId: "",
        };

        this.dataInit(params);
      }
    },
    //第三方认知
    // Third party cognition
    appRove() {
      this.isShowT = !this.isShowT;
      if (this.isShowT) {
        this.$refs.thirdCertification.dataInit();
      } else {
        this.$refs.thirdCertification.submitForm("form");
      }
    },
    //同步
    // synchronous
    sync() {
      if (this.three) {
        radiusSynchronous({
          tenantId: sessionStorage.getItem("tenantValue"),
        }).then((res) => {
          if (res.code === 10000) {
            this.$message({
              message: this.$t("timeSet.hint2"),
              type: "success",
            });
            this.repeatName = true;
            let _this = this;
            sessionStorage.setItem("nowTime", new Date() * 1 + 60000);
            this.timer = setTimeout(() => {
              let newTime = new Date() * 1;
              let startTime = sessionStorage.getItem("nowTime");
              if (newTime > startTime) {
                _this.repeatName = false;
                clearTimeout(_this.timer);
              }
            }, 60000);
          }
        });
      } else {
        mobileUserSyncMobileUser({
          tenantId: sessionStorage.getItem("tenantValue"),
        }).then((res) => {
          if (res.code == 10000) {
            this.$message({
              message: this.$t("timeSet.hint2"),
              type: "success",
            });
            this.repeatName = true;
            let _this = this;
            let userId = this.userId;
            sessionStorage.setItem("nowUserId", userId);
            sessionStorage.setItem("nowTime", new Date() * 1 + 60000);
            this.timer = setTimeout(() => {
              let newTime = new Date() * 1;
              let startTime = sessionStorage.getItem("nowTime");
              if (newTime > startTime) {
                _this.repeatName = false;
                clearTimeout(_this.timer);
              }
            }, 60000);
          }
        });
      }
    },
    //按钮是否禁用
    // Button disabled or not
    btnDisabled() {
      let userId = this.userId;
      let nowUserId = sessionStorage.getItem("nowUserId");
      if (userId == nowUserId) {
        let newTime = new Date() * 1;
        let startTime = sessionStorage.getItem("nowTime");
        if (newTime > startTime) {
          this.repeatName = false;
        } else {
          this.repeatName = true;
          let lastTime = startTime - newTime;
          this.timer = setTimeout(() => {
            this.repeatName = false;
            clearTimeout(_this.timer);
          }, lastTime);
        }
      } else {
        this.repeatName = false;
      }
    },
    pageChange(val) {
      //页数总条目改变
      // Total page entries change
      this.pageSize = val;
      let params = {
        username: "",
        pageNumber: this.page,
        pageSize: this.pageSize,
        vrfId: this.vlfName,
        tenantId: sessionStorage.getItem("tenantValue"),
      };
      // this.page = 1;
      this.dataInit(params);
    },
    sizeChange(val) {
      //页数改变
      // Page number change
      // console.log(val)
      this.page = val;
      let params = {
        username: "",
        pageNumber: this.page,
        pageSize: this.pageSize,
        vrfId: this.vlfName,
        tenantId: sessionStorage.getItem("tenantValue"),
      };
      this.dataInit(params);
    },
    //模糊搜索
    // Fuzzy search
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = restaurants.filter(this.createFilter(queryString));
      // 调用 callback 返回建议列表的数据
      // A callback call returns the data for the list of suggestions
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
        );
      };
    },
    handleSelect(item) {
      this.searchVal = item;

      // console.log(item);
    },
    searchEvent() {
      this.dataInit({
        pageNumber: 1,
        pageSize: 10,
        tenantId: sessionStorage.getItem("tenantValue"),
        username: this.searchVal,
        vrfId: this.vlfName,
      });
      this.page = 1;
    },
    indexMethod(index) {
      return index + 1 + (this.page == 1 ? 0 : this.pageSize * (this.page - 1));
    },
    //编辑
    // edit
    handleClick(row) {
      this.isShow2 = true;
      this.$refs.editMsetting.dataInit(row);
    },
    //获取租户路由域
    // Gets the tenant routing domain
    searchData() {
      mobileUserGetTenantVrfList({
        page: 1,
        pageSize: 10,
        tenantId: sessionStorage.getItem("tenantValue"),
      }).then((res) => {
        if (res.code === 10000) {
          this.vlfList = res.result;
        }
      });
    },
    //上拉加载租户路由域
    // Pull up and load the tenant routing domain
    load() {},
    dataInit(params) {
      let thisDate = new Date();
      //时区
      var datestring = thisDate.toString();

      //与UTC时间差
      var utcDate = datestring.split("GMT")[1];
      utcDate = utcDate.substring(0, 3);
      var utc = parseInt(utcDate);

      mobileUserGetByCondition(params).then((res) => {
        if (res.code === 10000) {
          this.allItem = res.result.totalElements;
          this.tableData = res.result.content;

          this.tableData.forEach((item) => {
            var times = item.createTime;
            if (times) {
              var newDate = new Date(times);
              newDate.setHours(newDate.getHours() + utc);
              item.createTime = this.getTime(newDate);
            }
          });
        }
      });
    },
    getTime(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let miao = date.getSeconds();
      let list = [year, month, day, hour, minute, miao];
      let list2 = [];
      for (let i in list) {
        if (list[i] < 10) {
          let a = "" + 0 + list[i];
          list2.push(a);
        } else {
          list2.push(list[i]);
        }
      }
      let needTime =
        "" +
        list2[0] +
        "-" +
        list2[1] +
        "-" +
        list2[2] +
        " " +
        list2[3] +
        ":" +
        list2[4] +
        ":" +
        list2[5];
      return needTime;
    },
    del(row) {
      //单条删除
      var show107 = localStorage.getItem("show107");
      if (show107 == "true") {
        mobileUserDel({
          createTime: "",
          id: "",
          password: "",
          tenantId: "",
          tenantUserId: this.userId,
          userId: row.id,
          username: "",
          vrfId: "",
        }).then((res) => {
          if (res.code === 10000) {
            this.$message({
              message: this.$t("Mobile.hint1"),
              type: "success",
            });
            this.dataInit({
              pageNumber: 1,
              pageSize: 10,
              tenantId: sessionStorage.getItem("tenantValue"),
              username: "",
              vrfId: this.vlfName,
            });
            this.page = 1;
          }
        });
      } else {
        this.$confirm(
          this.$t("vsr1000.remind[1]") +
            "<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue3\",this.checked)' type='checkbox'> " +
            this.$t("doNotShowThisAgain") +
            "</label></div>",
          {
            confirmButtonText: this.$t("vsr1000.OK"),
            cancelButtonText: this.$t("vsr1000.cancel"),
            dangerouslyUseHTMLString: true,
            type: "warning",
          }
        ).then(() => {
          //原内容
          mobileUserDel({
            createTime: "",
            id: "",
            password: "",
            tenantId: "",
            tenantUserId: this.userId,
            userId: row.id,
            username: "",
            vrfId: "",
          }).then((res) => {
            if (res.code === 10000) {
              this.$message({
                message: this.$t("Mobile.hint1"),
                type: "success",
              });
              this.dataInit({
                pageNumber: 1,
                pageSize: 10,
                tenantId: sessionStorage.getItem("tenantValue"),
                username: "",
                vrfId: this.vlfName,
              });
              this.page = 1;
              localStorage.setItem("show107",localStorage.getItem("checkedValue107"));
            }
          });
        });
      }
    },
    //上传之前的文件类型判断
    // File type judgment before uploading
    beforeUpload(file) {
      console.log(file);
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "xls";
      const extension2 = testmsg === "xlsx";
      // const isLt2M = file.size / 1024 / 1024 < 10
      if (!extension && !extension2) {
        this.$message({
          message: this.$t("Mobile.hint2"),
          type: "warning",
        });
      }
      // if(!isLt2M) {
      //     this.$message({
      //         message: '上传文件大小不能超过 10MB!',
      // Message: 'Upload file size cannot exceed 10MB! ',
      //         type: 'warning'
      //     });
      // }
      // return (extension || extension2) && isLt2M
      return extension || extension2;
    },
    choseFile(file, fileList) {
      this.input = file.name;
      if (file.status == "ready") {
        if (!this.vlfName.length) {
          this.$message({
            message: this.$t("Mobile.chooseTenantRoutingDomain"),
            type: "warning",
          });
        } else {
          this.submitUpload();
        }
      }
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    // 上传成功后的回调
    // A callback after a successful upload
    uploadSuccess(response, file, fileList) {
      this.flag = false;
      if (response.code == 10000) {
        this.upload(file);
      } else if (response.code == 203708) {
        this.$message({
          type: "warning",
          message: response.message,
        });
        this.repeatName = true;
        let _this = this;
        setTimeout(() => {
          _this.repeatName = false;
        }, 30000);
      } else if (response.code == 203707) {
        this.$message({
          type: "warning",
          message: response.message,
        });
      } else if (response.code == 203709) {
        this.$message({
          type: "warning",
          message: response.message,
        });
      } else if (response.code == 203710) {
        this.$message({
          type: "warning",
          message: response.message,
        });
      } else if (response.code == 203711) {
        this.$message({
          type: "warning",
          message: response.message,
        });
      }
    },
    //导入的方法
    // Method of import
    upload(file) {
      let formData = new FormData();
      formData.append("file", file.raw);
      formData.append("tenantId", this.otherData.tenantId);
      formData.append("vrfId", this.otherData.vrfId);
      request
        .post("/mobileUser/upload", formData, {
          "Content-Type": "multipart/form-data",
        })
        .then((res) => {
          if (res.code === 10000) {
            this.$message({
              message: res.message,
              type: "success",
            });
            let params = {
              pageNumber: 1,
              pageSize: 10,
              tenantId: sessionStorage.getItem("tenantValue"),
              username: "",
              vrfId: this.vlfName,
            };

            this.dataInit(params);
          }
        });
    },
    //导出
    // export
    exportEvent() {
      var show91 = localStorage.getItem("show91");
      if (show91 == "true") {
        axios({
          // 用axios发送post请求
          // Send a POST request using AXIOS
          method: "get",
          url: " /vsm/mobileUser/download", // 请求地址
          // Request the address
          // 参数
          // parameter
          responseType: "blob", // 表明返回服务器返回的数据类型
          // Indicates the type of data returned by the return server
          headers: {
            "Content-Type": "application/json",
            accessToken: getToken(),
          },
        }).then((res) => {
          // 处理返回的文件流
          // Process the returned file flow
          const blob = new Blob([res]); //new Blob([res])中不加data就会返回下图中[objece objece]内容（少取一层）
          // New Blob([RES]) returns the [Objece Objece] content in the image below without adding data (take one less layer)
          const fileName = "移动用户.xlsx"; //下载文件名称
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
      } else {
        this.$confirm(
          this.$t("Mobile.hint3") +
            "<div style='left:10px;position:absolute;top:45px'><label><input onClick='localStorage.setItem(\"checkedValue91\",this.checked)' type='checkbox'> " +
            this.$t("doNotShowThisAgain") +
            "</label></div>",
          {
            confirmButtonText: this.$t("Mobile.ok"),
            cancelButtonText: this.$t("Mobile.cancel"),
            dangerouslyUseHTMLString: true,
            type: "warning",
          }
        )
          .then(() => {
            axios({
              // 用axios发送post请求
              // Send a POST request using AXIOS
              method: "get",
              url: " /vsm/mobileUser/download", // 请求地址
              // Request the address
              // 参数
              // parameter
              responseType: "blob", // 表明返回服务器返回的数据类型
              // Indicates the type of data returned by the return server
              headers: {
                "Content-Type": "application/json",
                accessToken: getToken(),
              },
            }).then((res) => {
              // 处理返回的文件流
              // Process the returned file flow
              const blob = new Blob([res]); //new Blob([res])中不加data就会返回下图中[objece objece]内容（少取一层）
              // New Blob([RES]) returns the [Objece Objece] content in the image below without adding data (take one less layer)
              const fileName = "移动用户.xlsx"; //下载文件名称
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
              localStorage.setItem(
                "show91",
                localStorage.getItem("checkedValue91")
              );
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: this.$t("Mobile.hint4"),
            });
          });
      }

      // mobileUserDownload().then(res=>{

      // })
      // location.href = "http://172.26.28.133:18888/vsm/mobileUser/download";
    },
    //获取租户路由域名字
    // Gets the tenant routing domain name word
    // vrfchange() {
    //   this.vlfName = this.vlfList.find(item => item.id == this.vlfName).name;
    // }
  },
  created() {
    userInfo().then((res) => {
      this.userId = res.result.userId;
      let tenantId = sessionStorage.getItem("tenantValue");
      if(tenantId!=''){
        this.showSync = true;
      }else{
        this.showSync = false;
      }
    });

    if (this.tenantId) {
      this.addShow = true;
    }
    let params = {
      pageNumber: 1,
      pageSize: 10,
      tenantId: sessionStorage.getItem("tenantValue"),
      username: "",
      vrfId: "",
    };
    this.dataInit(params);
    this.btnDisabled();
    radiusGetRadiusEnable({
      tenantId: sessionStorage.getItem("tenantValue"),
    }).then((res) => {
      if (res.code === 10000) {
        this.three = res.result;
        this.isShowT = res.result;
      }
    });
  },
  mounted() {},
};
</script>
<style scoped lang="scss">
.tabs {
  padding-top: 21px;
  zoom: 1;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  font-size: 14px;
  font-family: arial, sans-serif;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  li:nth-of-type(1){
    &:hover {
      background: #3678c8;
      color: white
    }
  }
  li:nth-of-type(2){
    &:hover {
      color: white;
      background: #3678c8;
    }
  }
  // li:nth-of-type(3){
  //   width: 150px;
  //   &:hover {
  //     color: white;
  //     background: #3678c8;
  //   }
  // }
  li {
    float: left;
    width: 156px;
    height: 34px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    border: 1px solid rgba(209, 215, 224, 1);
    text-align: center;
    line-height: 34px;
    margin-right: 18px;
    transition: all 0.3s cubic-bezier(0.65, 0.05, 0.36, 1);
    cursor: pointer;
  }
  .active {
    background: #3678c8;
    color: #fff;
    border: none;
    &:hover {
      background: #6095d6;
      border: none;
    }
  }
}
.mobileSetting {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.title {
  width: 100%;
  //   height: 62px;
  background: white;
  padding: 20px 30px;
  h3 {
    font-size: 15px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    padding-bottom: 21px;
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
.search {
  zoom: 1;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  .formItem {
    float: left;
    span {
      padding-right: 10px;
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }
  }
  .formItem:last-of-type {
    float: right;
    button {
      width: 100px;
      height: 34px;
      background: rgba(54, 120, 200, 1);
      border-radius: 7px;
      border: 0;
      outline: none;
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      cursor: pointer;
      margin-left: 14px;
    }
    .active {
      background: #efefef;
      color: #999999;
    }
    .active:hover {
      background: #efefef;
      color: #999999;
    }
  }
}
.searchBtn {
  width: 100px;
  height: 34px;
  background: rgba(54, 120, 200, 1);
  border-radius: 7px;
  border: 0;
  outline: none;
  font-size: 14px;
  font-family: arial, sans-serif;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
}
.searchBtn:hover {
  background: rgba(96, 149, 214, 1);
  border: 0;
}
.devList {
  flex: 1;
  margin-top: 20px;
  background: #fff;
  padding: 20px 30px;
  overflow-x: hidden;
  overflow-y: auto;
  .operate {
    width: 100%;
    padding-bottom: 20px;
    zoom: 1;
    &:after {
      display: block;
      clear: both;
      content: "";
      visibility: hidden;
      height: 0;
    }
    .btns {
      float: right;
      zoom: 1;
      &:after {
        display: block;
        clear: both;
        content: "";
        visibility: hidden;
        height: 0;
      }
      display: flex;
      button {
        width: 100px;
        height: 34px;
        background: rgba(54, 120, 200, 1);
        border-radius: 7px;
        border: 0;
        outline: none;
        font-size: 14px;
        font-family: arial, sans-serif;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        cursor: pointer;
        margin-left: 14px;
      }
      // .active {
      //   background: #efefef;
      //   color: #999999;
      // }
      button:hover {
        background: rgba(96, 149, 214, 1);
        border: 0;
      }
      // .active:hover {
      //   background: #efefef;
      //   color: #999999;
      // }
      .add {
        img {
          width: 14px;
          height: 14px;
          position: relative;
          top: 1px;
        }
      }
      .add:hover {
        background: #6095d6;
      }
    }
    .opSearch {
      float: left;
      position: relative;
      font-family: arial, sans-serif;
      i {
        width: 16px;
        height: 16px;
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 100;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
.serverData {
  max-height: 136px;
}
</style>
<style lang="scss">
.mobileSetting .title .el-input {
  width: 242px;
  height: 34px;
  .el-input__inner {
    height: 100%;
  }
}
.inline-input .el-input__inner {
  padding-left: 34px;
}
</style>
