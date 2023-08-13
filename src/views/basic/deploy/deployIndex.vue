<template>
  <div class="peizhi">
    <div class="search">
      <h3>
        {{$t('File.base')}}
        <img src="@/assets/icon_right@2x.png" alt />
        <span>{{$t('File.fileMan')}}</span>
      </h3>
      <div class="formList">
        <div class="opt">
          <span class="lab-height" id="typeEn">{{$t('File.devType')}}</span>
          <el-select filterable
            size="small"
            v-model="deviceType"
            @change="choseGet"
            :placeholder="$t('File.choose')"
          >
            <el-option value :label="$t('DeviceMan.all')"></el-option>
            <!-- <el-option value="devNoName" :label="$t('DeviceMan.unnamed')"></el-option> -->
            <el-option value="0001" label="VSR1000"></el-option>
            <el-option value="0002" label="VSR100"></el-option>
            <el-option value="000106" label="ClOUD1000"></el-option>
            <el-option value="000206" label="ClOUD100"></el-option>
          </el-select>
        </div>
        <div class="opt">
          <span class="lab-height">{{$t('File.tenant')}}</span>
          <el-select filterable
            size="small"
            v-model="rent"
            @change="choseRent"
            :disabled="type==1?false:true"
            :placeholder="$t('File.choose')"
          >
            <el-option value :label="$t('File.all')"></el-option>
            <el-option v-for="item in rentList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
        <div class="opt" id="optt">
          <i>
            <img src="@/assets/newPage/icon_search@2x.png" alt />
          </i>
          <el-autocomplete
            class="inline-input"
            prefix-icon="el"
            v-model="searchKey"
            :fetch-suggestions="querySearch"
            :placeholder="$t('File.devNameNumber')"
            :trigger-on-focus="false"
            @select="handleSelect"
          >
            <template slot-scope="{ item }">
              <div class="name">{{ item }}</div>
            </template>
          </el-autocomplete>
        </div>

        <div class="opt op-but">
          <button @click="query">{{$t('File.search')}}</button>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="control">
        <button v-debounce="downLoad" v-control>{{$t('File.download')}}</button>
      </div>
      <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" :resizable="false"></el-table-column>
        <!-- <el-table-column
          type="index"
          :index="indexMethod"
          :label="$t('File.index')"
          align="center"
          width="70"
          :resizable="false"
        ></el-table-column> -->
        <el-table-column
          prop="deviceName"
          :label="$t('File.devName')"
          width="180"
          :resizable="false"
        ></el-table-column>
        <el-table-column prop="tenantName" :label="$t('File.tenant')" :resizable="false"></el-table-column>
        <el-table-column prop="deviceType" :label="$t('File.devType')" :resizable="false"></el-table-column>
        <el-table-column
          prop="deviceSerialNumber"
          :label="$t('File.devNumber')"
          :resizable="false"
          width="140"
        ></el-table-column>
        <el-table-column
          prop="hardwareVersion"
          :label="$t('File.version')"
          :resizable="false"
          width="160"
        ></el-table-column>
        <el-table-column prop="memo" :label="$t('File.remark')" :resizable="false"></el-table-column>
        <el-table-column
          :label="$t('File.operation')"
          width="180px"
          show-overflow-tooltip
          :resizable="false"
        >
          <template slot-scope="scope">
            <el-upload
              :show-file-list="false"
              name="jsonFile"
              class="upload-demo"
              ref="upload"
              :http-request="submitUpload"
              :on-change="choseFile"
              action="/vsm/device/configUpload"
              :auto-upload="false"
            >
              <button
                size="small"
                type="primary"
                class="edit"
                @click="up(scope.row)"
                v-control
              >{{$t('File.upload')}}</button>
            </el-upload>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :page-sizes="[5, 10]"
          :total="all"
          :page-size="10"
          @size-change="Page"
          @current-change="Size"
          :current-page="this.num"
          layout="total, sizes, prev, next, jumper"
          style="font-family: arial, sans-serif"
        ></el-pagination>
      </div>
    </div>
    <addPz ref="addPz" v-show="flag"></addPz>
  </div>
</template>
<script>
import axios from "axios";
import { getToken } from "@/utils/cookie";
import addPz from "./addPz";
import {
  deviceSelect,
  getDevInfo,
  getDevSerialName,
  configDownload
} from "@/services";
export default {
  data() {
    return {
      type: "",
      flag: false,
      tableData: [],
      all: 0,
      num: 1,
      size: 10,
      deviceType: "",
      rent: JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '' : JSON.parse(sessionStorage.getItem("userData")).tenantId,
      rentList: [],
      searchKey: "",
      leveno: [],
      multipleSelection: [],
      upId: "",
      input: "",
      lang: ""
    };
  },
  created() {
    this.type = JSON.parse(sessionStorage.getItem("userData")).type;
    this.lang = sessionStorage.getItem("lang");
    this.getAll();
    this.$nextTick(function() {
      //页面加载完成后执行
      // Execute after the page loads
      let lang = sessionStorage.getItem("lang");
      let tag = document.getElementsByClassName("lab-height");
      // let tag = document.getElementsByTagName('label')
      let opt = Array.prototype.slice.call(tag);
      // console.log(tag)
      for (let i in opt) {
        // console.log(opt[i].clientHeight)
        if (lang == "en") {
          if (opt[i].clientHeight > 34) {
            opt[i].style.lineHeight = "16px";
            opt[i].style.marginTop = "10px";
          } else {
          }
        } else {
        }
      }
    });
  },
  computed: {
    paramsData: function() {
      let params = {
        deviceId: this.upId
      };
      return params;
    }
  },
  methods: {
    choseGet() {
      this.num = 1;
      this.getTable();
    },
    up(val) {
      this.upId = val.id;
    },
    //上传配置文件
    // Upload configuration file
    //Upload configuration file
    choseFile(file, fileList) {
      this.$refs.addPz.obj = file;
      this.input = file.name;
      if (file.status == "ready") {
        this.flag = true;
      } else {
        this.flag = false;
      }
    },
    submitUpload(fileObj) {
      let formData = new FormData();
      formData.set("jsonFile", fileObj.raw);
      axios
        .post(`/vsm/devConfig/configUpload?deviceId=${this.upId}`, formData, {
          headers: {
            "Content-type": "multipart/form-data"
          }
        })
        .then(response => {
          if (response.code == 10000) {
            this.$message({
              message: this.$t("File.saved"),
              type: "success"
            });
          } else {
            this.$message({
              message: this.$t("File.hint1"),
              type: "warning"
            });
          }
        })
        .catch();
    },
    //下载配置文件
    // Download configuration file
    //Download configuration file
    downLoad() {
      let deviceId = () => {
        let arr = [];
        this.multipleSelection.map(item => {
          arr.push(item.id);
        });
        return arr;
      };
      let form = {
        devIds: deviceId()
      };
      if (this.tableData.length) {
        if (this.multipleSelection.length) {
          axios({
            // 用axios发送post请求
            // Send a POST request using AXIOS
            //Send a POST request using AXIOS
            method: "post",
            url: "/vsm/devConfig/configDownload", // 请求地址 Request the address
                                                  // Request the address
            data: form, // 参数 parameter
                        // Parameter the parameter
            responseType: "blob", // 表明返回服务器返回的数据类型 Indicates the type of data returned by the return server
                                  // Indicates that the type of data returned by the return server Indicates that the return server returned by the Return server
            headers: {
              "Content-Type": "application/json",
              accessToken: getToken()
            }
          }).then(res => {
            // 处理返回的文件流
            // Process the returned file flow
            //Process the returned file flow
            const blob = new Blob([res]); 
            //new Blob([res])中不加data就会返回下图中[objece objece]内容（少取一层）
            // New Blob([RES]) returns the [Objece Objece] content in the image below without adding data (take one less layer)
            //New Blob([RES]) returns the [Objece Objece] content in the image below without adding data (take one less layer)
            const fileName = "配置文件.json"; //下载文件名称 Download file name
                                          // Download file name
            const elink = document.createElement("a");
            elink.download = fileName;
            elink.style.display = "none";
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象 Release the URL object
                                             // Release the URL object Release the URL object
            document.body.removeChild(elink);
          });
        } else {
          this.$message({
            type: "warning",
            message: this.$t("File.hint2")
          });
        }
      } else {
        this.$message({
          type: "warning",
          message: this.$t("File.hint3")
        });
      }
    },
    //改变租户获取下拉列表
    // Change the tenant to get the drop-down list
    //Change the tenant to get the drop-down list
    choseRent() {
      this.num = 1;
      this.getTable();
      getDevSerialName({ tenantId: this.rent }).then(res => {
        this.leveno = res.result;
      });
    },
    query() {
      this.num = 1;
      this.getTable();
    },
    //模糊搜索
    // Fuzzy search
    //fuzzy search
    querySearch(queryString, cb) {
      var leveno = this.leveno;
      var results = leveno.filter(this.createFilter(queryString));
      // 调用 callback 返回建议列表的数据
      // A callback call returns the data for the list of suggestions
      //A callback call returns the data for the list of Suggestions
      cb(results);
    },
    createFilter(queryString) {
      return leveno => {
        return leveno.toLowerCase().indexOf(queryString.toLowerCase()) !== -1;
      };
    },
    //模糊搜索列表点击
    // Click on the fuzzy search list
    //Click on the fuzzy search list
    handleSelect(item) {
      this.searchKey = item;
    },
    // 获取所有列表
    // Get all lists
    //Get all lists
    async getAll() {
      let tenant = await deviceSelect().then(res => {
        this.rentList = res.result;
      });
      let list = await this.getTable();
      let fuzzy = await getDevSerialName({ tenantId: this.rent }).then(res => {
        this.leveno = res.result;
      });
    },
    getTable() {
      let params = {
        pageNumber: this.num,
        pageSize: this.size,
        deviceType: this.deviceType,
        devNameRange: "devHaveName",
        searchKey: this.searchKey,
        tenantId: this.rent
      };
      getDevInfo(params).then(res => {
        this.tableData = res.result.content;
        this.all = res.result.totalElements;
      });
    },
    Size(val) {
      this.num = val;
      this.getTable();
    },
    Page(val) {
      this.size = val;
      this.num = 1;
      this.getTable();
    },
    //表格序号
    // Form the serial number
    //Form the serial number
    indexMethod(index) {
      return index + 1 + (this.num == 1 ? 0 : this.size * (this.num - 1));
    },
    //多选
    // multi-select
    //multiple choice
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  },
  components: { addPz }
};
</script>
<style lang="scss" scoped>
#optt {
  div {
    width: 242px;
  }
}
#typeEn {
  width: 66px;
}
#height {
  line-height: 16px;
}
.page {
  width: 100%;
  text-align: center;
  margin-top: 12px;
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
    text-align: right;
    margin-bottom: 20px;
    button {
      width: 100px;
      height: 34px;
      background: rgba(54, 120, 200, 1);
      border-radius: 7px;
      color: white;
      border: none;
    }
    button:hover {
      background: rgba(96, 149, 214, 1);
    }
  }
  .edit {
    // width:28px;
    height: 20px;
    border: none;
    background: none;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(54, 120, 200, 1);
  }
}
.peizhi {
  width: 100%;
  height: 100%;
  background: #eaeef4;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
  font-size: 14px;
  font-family: arial, sans-serif;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  .search {
    width: 100%;
    height: 116px;
    background: white;
    padding: 20px 30px;
    position: relative;
    button {
      width: 100px;
      height: 34px;
      background: rgba(54, 120, 200, 1);
      border-radius: 7px;
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      border: none;
      color: rgba(255, 255, 255, 1);
    }
    .opt {
      padding-right: 30px;
      margin-top: 20px;
      span {
        margin-right: 10px;
        line-height: 34px;
      }
    }
    .op-but {
      // float: right;
    }
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
.formList {
  zoom: 1;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  .opt {
    float: left;
  }
}
.opt {
  position: relative;
  i {
    width: 16px;
    height: 16px;
    position: absolute;
    top: 9px;
    left: 10px;
    z-index: 100;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
<style lang="scss">
.peizhi .formList {
  .el-input,
  .el-select {
    width: 140px;
    height: 34px;
    .el-input__inner {
      height: 100%;
      border-radius: 7px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
  #optt {
    .el-input,
    .el-select {
      width: 100%;
    }
  }
}
</style>