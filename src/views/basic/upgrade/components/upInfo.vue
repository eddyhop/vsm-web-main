<!-- 下载升级详情 -->
<template>
  <div class="upinfo">
    <div class="cont">
      <div class="title">
        {{title}}
        <span @click="close"></span>
      </div>
      <div class="content">
        <el-row>
          <el-col :span="7">
            <div class="opt">
              <span>{{$t('Upgrade.tenant')}}</span>
              <div class="limit">
                <el-select filterable v-model="tenant" :placeholder="$t('Upgrade.all')" size="small" :disabled="$parent.type==1?false:true">
                  <el-option value="" :label="$t('Upgrade.all')"></el-option>
                    <el-option
                      v-for="item in options"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                </el-select>
              </div>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="opt">
              <span>{{$t('Upgrade.devType')}}</span>
              <div class="limit">
                <el-select filterable v-model="deviceType" :placeholder="$t('Upgrade.all')" size="small">
                  <el-option value="" :label="$t('Upgrade.all')"></el-option>
                  <el-option value="VSR1000" label="VSR1000"></el-option>
                  <el-option value="VSR100" label="VSR100"></el-option>
                </el-select>
              </div>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="opt">
              <span>{{$t('Upgrade.taskStatus')}}</span>
              <div class="limit">
                <el-select filterable v-model="state" :placeholder="$t('Upgrade.all')" size="small">
                  <el-option value="" :label="$t('Upgrade.all')"></el-option>
                  <el-option value="1" :label="$t('Upgrade.load')"></el-option>
                  <el-option value="0" :label="$t('Upgrade.uncompleted')"></el-option>
                </el-select>
              </div>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="opt">
              <button @click="search">{{$t('Upgrade.search')}}</button>
            </div>
          </el-col>
        </el-row>
        <div class="table-content">
          <el-table :data="tableData" stripe border style="width: 100%">
            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            <!-- <el-table-column type="index" :index="indexMethod" :label="$t('Upgrade.index')" width="70" :resizable="false"></el-table-column> -->
            <el-table-column prop="belongRent" :label="$t('Upgrade.tenant')" :resizable="false"></el-table-column>
            <el-table-column prop="deviceName" :label="$t('Upgrade.devName')" :resizable="false"></el-table-column>
            <el-table-column prop="deviceSerialNumber" :label="$t('Upgrade.devNumber')" :resizable="false"></el-table-column>
            <el-table-column prop="deviceType" :label="$t('Upgrade.devType')" :resizable="false"></el-table-column>
            <el-table-column prop="softwareVersion" :label="$t('Upgrade.version')" :resizable="false"></el-table-column>
            <el-table-column prop="jobType" :label="$t('Upgrade.taskStatus')" :resizable="false"></el-table-column>
          </el-table>
          <div class="page">
            <el-pagination
              :page-sizes="[5, 10]"
              :total="all"
              :page-size="10"
              @size-change="Size"
              @current-change="Page"
              :current-page="this.page"
              layout="total, sizes, prev, next, jumper"
              style="font-family: arial, sans-serif"
            ></el-pagination>
          </div>
        </div>
        <div class="control">
          <button class="out" v-debounce="save">{{$t('Upgrade.export')}}</button>
          <button class="cancel" @click="close">{{$t('Upgrade.cancel')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { updateInfo,upDateDown } from "@/services"
import axios from "axios";
import {getToken} from '@/utils/cookie'
export default {
  components: {},
  data() {
    return {
      title:"",
      tableData: [],
      all:0,
      page:1,
      size:10,
      tenant:JSON.parse(sessionStorage.getItem('userData')).tenantId,
      options:[],
      deviceType:"",
      state:"",
      id:"",
      upOrdown:true
    };
  },
  computed: {},
  watch: {},

  methods: {
    save(){
      let form = {
        downOrUpdate:this.upOrdown?true:false,
        id:this.id,
      }
      axios({
            // 用axios发送post请求
            // Send a POST request using AXIOS
            //Send a POST request using AXIOS
            method: "get",
            url: " /vsm/deviceUpdate/downLoadExccel", // 请求地址 // Request address
                                                      // Request Address Request Address
            params: form, // 参数 / / parameters
                          // Parameters / / Parameters
            responseType: "blob", // 表明返回服务器返回的数据类型 // Indicates the type of data returned by the return server
                                  // Indicates that the type of data returned by the return server Indicates that the return server returned by the Return server
            headers: {
              "Content-Type": "application/json",
              'accessToken':getToken()
            }
          }).then(res => {
            // 处理返回的文件流 // Process the returned file flow
            // Process the returned file flow
            const blob = new Blob([res]);
             //new Blob([res])中不加data就会返回下图中[objece objece]内容（少取一层）
             // New Blob([RES]) returns the [Objece Objece] content in the image below without adding data (take one less layer)
             // New Blob([RES]) returns the content of [Objece Objece] in the image below without adding data (take one less layer)
            const fileName = "DownloadDetail.xlsx"; //下载文件名称 Download file name
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
    },
    search(){
      this.getList()
    },
    Size(val){
      this.size = val
      this.getList()
    },
    Page(val){
      this.page = val
      this.getList()
    },
    getList(){
      let params = {
        id:this.id,
        downOrUpdate:this.upOrdown?true:false,
        devType:this.deviceType,
        jobType:this.state,
        tenantId:this.tenant,
        page:this.page,
        pageSize:this.size,
      }
      updateInfo(params).then(res=>{
        this.tableData = res.result.content
        this.all = res.result.totalElements
      })
    },
    indexMethod(index) {
      return index + 1 + (this.page == 1 ? 0 : this.size * (this.page - 1));
    },
    close() {
      this.tenant = ""
      this.state = ""
      this.deviceType = ""
      this.$parent.upInfoShow = false;
    }
  },
  created() {},
  mounted() {},
  beforeCreate() {},
  beforeMount() {}, 
  beforeUpdate() {}, 
  updated() {}, 
  beforeDestroy() {}, 
  destroyed() {}, 
  activated() {} 
};
</script>
<style lang='scss' scoped>
.control {
  text-align: center;
  margin-top: 30px;
  button {
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    border: none;
    color: white;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
  }
  .out:hover {
    background: rgba(96, 149, 214, 1);
  }
  .cancel {
    width: 70px;
    border: 1px solid rgba(209, 215, 224, 1);
    color: rgba(102, 102, 102, 1);
    background: none;
    margin-left: 20px;
  }
}
.table-content::-webkit-scrollbar {
  width: 4px;
  /*height: 4px;*/
}
.table-content::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.table-content::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.table-content {
  margin-top: 30px;
  overflow-x: hidden;
  overflow-y: auto;
  height: 420px;
  border: 1px solid rgba(209, 215, 224, 1);
}
.content {
  padding: 30px;
  .opt {
    button {
      width: 100px;
      height: 34px;
      background: rgba(54, 120, 200, 1);
      border-radius: 7px;
      border: none;
      color: white;
      float: right;
    }
    span {
      margin-right: 10px;
    }
    .limit {
      display: inline-block;
      div {
        width: 140px;
      }
    }
  }
}
.cont {
  width: 868px;
  height: 656px;
  background: white;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -328px;
  margin-left: -434px;
  box-shadow: 0px 10px 20px 0px rgba(102, 102, 102, 0.1);
  border-radius: 7px;
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
      background-image: url("../../../../assets/icon_close.png");
      background-size: 14px 14px;
    }
  }
}
.upinfo {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 9;
  background:rgba(32,42,59,0.2);
}
</style>