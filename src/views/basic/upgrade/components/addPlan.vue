<!-- 新增设备升级任务 -->
<!-- New equipment upgrade task -->
<template>
  <div class="addPlan">
    <div class="cont">
      <div class="title">
        {{$t('Upgrade.task')}}
        <span @click="cancel"></span>
      </div>
      <div class="content">
        <div class="chose">
          <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
            <el-row>
              <el-col :span="10">
                <div class="item">
                  <el-form-item label-width="80" :label="$t('Upgrade.taskName')" prop="name">
                    <!-- <span>任务名称</span> -->
                    <div class="limit">
                      <el-input
                        :placeholder="$t('Upgrade.prompt1')"
                        v-model="form.name">
                      </el-input>
                    </div>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="14">
                <div class="item" id="two">
                  <el-form-item label-width="70" :label="$t('Upgrade.DownloadTime')" prop="value1">
                    <!-- <span>下载时间</span> -->
                    <div class="limit-time">
                      <el-date-picker class="datePicker" v-model="form.value1" size="small" type="datetime" prefix-icon="el-icon-time" :placeholder="$t('Upgrade.prompt2')"></el-date-picker>
                    </div>
                    <!-- <span class="top">{{$t('Upgrade.bandwidth')}}</span>   -->
                    <el-tooltip class="item" effect="dark" :content="$t('Upgrade.bandwidth')" placement="bottom">
                      <span class="top">{{$t('Upgrade.bandwidth')}}</span>  
                    </el-tooltip>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="second">
          <el-row>
            <el-col :span="7">
              <div class="second-item">
                <span>{{$t('Upgrade.tenant')}}</span>
                <div class="s-limit">
                  <el-select filterable v-model="tenant" :placeholder="$t('Upgrade.all')" size="small" @change="choseVrf" :disabled="$parent.type==1?false:true">
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
              <div class="second-item">
                <span>{{$t('Upgrade.devType')}}</span>
                <div class="s-limit">
                  <el-select filterable v-model="type" :placeholder="$t('Upgrade.all')" size="small">
                    <el-option value="" :label="$t('Upgrade.all')"></el-option>
                    <el-option value="VSR1000" label="VSR1000"></el-option>
                    <el-option value="VSR100" label="VSR100"></el-option>
                  </el-select>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="second-item">
                <div class="i-limit">
                  <!-- <el-input v-model="version" placeholder="固件版本，设备名称" prefix-icon="el-icon-search" size="small"></el-input> -->
                  <el-autocomplete
                    v-model="version"
                    :fetch-suggestions="querySearch"
                    :placeholder="$t('Upgrade.verNameDevName')"
                    :trigger-on-focus="false"
                    @select="handleSelect"
                  >
                    <template slot-scope="{ item }">
                      <div class="name">{{ item }}</div>
                    </template>
                  </el-autocomplete>
                </div>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="second-item">
                <div class="btn">
                  <button @click="search">{{$t('Upgrade.search')}}</button>
                </div>
              </div>
            </el-col>
          </el-row>
          <div class="table-content">
            <el-table :data="tableData" stripe border style="width: 100%"  @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" :resizable="false"></el-table-column>
              <!-- <el-table-column type="index" :index="indexMethod" :label="$t('Upgrade.index')" width="70" :resizable="false"></el-table-column> -->
              <el-table-column prop="belongRent" :label="$t('Upgrade.tenant')" :resizable="false"></el-table-column>
              <el-table-column prop="deviceName" :label="$t('Upgrade.devName')" :resizable="false"></el-table-column>
              <el-table-column prop="deviceSerialNumber" :label="$t('Upgrade.devNumber')" :resizable="false"></el-table-column>
              <el-table-column prop="deviceType" :label="$t('Upgrade.devType')" :resizable="false"></el-table-column>
              <el-table-column prop="softwareVersion" :label="$t('Upgrade.version')" :resizable="false"></el-table-column>
              <el-table-column prop="jobType" :label="$t('Upgrade.taskStatus')" show-overflow-tooltip :resizable="false">
                <template slot-scope="scope">
                    <span v-if="scope.row.jobType=='未完成'">{{$t('Upgrade.uncompleted')}}</span>
                    <span v-else>{{$t('Upgrade.completed')}}</span>
                </template>
              </el-table-column>
            </el-table>
            <div class="page">
              <el-pagination
                :page-sizes="[5, 10]"
                :total="all"
                :page-size="10"
                @size-change="Size"
                @current-change="Page"
                :current-page="this.Number"
                layout="total, sizes, prev, next, jumper"
                style="font-family: arial, sans-serif"
              ></el-pagination>
            </div>
          </div>
        </div>
      </div>
      <div class="control">
          <button class="out" v-debounce="save">{{$t('Upgrade.createTask')}}</button>
          <button class="cancel" @click="cancel">{{$t('Upgrade.cancel')}}</button>
      </div>
    </div>
    <Confirm ref="confirm" v-show="confirmShow"/>
  </div>
</template>

<script>
import Confirm from './confirm'
import { updateDownloadJob,updateDev,searchDevsByTenantId } from "@/services"
export default {
  components: { Confirm },
  data() {
    var checkTime = (rule, value, callback)=>{
      var now = new Date()
      if(value<now){
         callback(new Error(this.$t('Upgrade.hint1')))
      }else{
        callback()
      }
    }
    return {
      // userType = JSON.parse(sessionStorage.getItem("userData")).type,
      confirmShow:false,
      form:{
        name:"",
        value1:"",  
      },
      all:0,
      Number:1,
      size:10,
      version:"",
      leveno:[],
      type:"",
      tenant:JSON.parse(sessionStorage.getItem('userData')).tenantId,
      options:[],
      tableData: [],
      multipleSelection:[],
      rules:{
        name:[
            { required: true, message: this.$t('Upgrade.hint2'), trigger: 'blur' },
        ],
        value1:[
            { required: true, message: this.$t('Upgrade.hint3'), trigger: 'blur' },
            //  { validator: checkTime, trigger: 'change' }
        ],
      }
    }
  },
  computed: {},
  watch: {},
  methods: {
    submit(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            let deviceSerialNumber = () => {
              let arr = []
              this.multipleSelection.map(item=>{
                  arr.push(item.deviceSerialNumber)
              })
              return arr
            }
            let params = {
              jobName:this.form.name,
              downloaDevsNumber:deviceSerialNumber(),
              tenantId:this.$parent.tenantId,
              downloadTime:this.form.value1.toUTCString()
            }
            console.log(this.form.value1,this.form.value1.toUTCString())
            if(this.multipleSelection.length){
              updateDownloadJob(params).then(res=>{
                if(res.code==10000){
                  this.$message({
                    message: this.$t('Upgrade.hint4'),
                    type: 'success'
                  });
                  this.confirmShow = false
                  this.cancel()
                  this.$parent.getList()
                }else{
                  this.$message({
                      message: this.$t('Upgrade.hint5'),
                      type: 'warning'
                  });
                }
              })  
            }else{
              this.$message({
                  message: this.$t('Upgrade.hint6'),
                  type: 'warning'
              });
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    save(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.multipleSelection.length){
              this.confirmShow = true
              this.$refs.confirm.options = this.multipleSelection
              // console.log(this.$refs.confirm.options)
            }else{
              this.$message({
                  message: this.$t('Upgrade.hint6'),
                  type: 'warning'
              });
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      
    },
    //模糊搜索
    // Fuzzy search
    //fuzzy search
    querySearch(queryString, cb) {
      var leveno = this.leveno;
      var results = leveno.filter(this.createFilter(queryString));
      // 调用 callback 返回建议列表的数据
      // A callback call returns the data for the list of suggestions
      // Callback is called to return the data for the list of Suggestions
      cb(results);
    },
    createFilter(queryString) {
      return leveno => {
        return (
          leveno.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
        );
      };
    },
    //模糊搜索列表点击
    // Click on the fuzzy search list
    // Click on the fuzzy search list
    handleSelect(item) {
      this.version = item;
      // console.log(item);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    choseVrf(){
      searchDevsByTenantId({type:this.$parent.type,tenantId:this.tenant}).then(res=>{
         this.leveno = res.result
      })
    },
    search(){
      this.Number = 1
      this.getList()
    },
    Size(val){
      this.size = val
      this.getList()
    },
    Page(val){
      this.Number = val
      this.getList()
    },
    getList(){
      let params = {
        page:this.Number,
        pageSize:this.size,
        type:this.$parent.type,
        devType:this.type,
        tenantId:this.tenant,
        devName:this.version.split(',')[1]
      }
      updateDev(params).then(res=>{
        this.tableData = res.result.result
        this.all = res.result.total
      })
    },
    indexMethod(index) {
      return index + 1 + (this.Number == 1 ? 0 : this.size * (this.Number - 1));
    },
    cancel(){
      this.type = ""
      // this.tenant = ""
      this.$parent.addPlanShow = false
      this.$refs.form.resetFields();
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
.control{
    text-align: center;
    button{
        width:100px;
        height:34px;
        background:rgba(54,120,200,1);
        border-radius:2px;
        border: none;
        color: white;
        font-size:14px;
        font-family:arial, sans-serif;
        font-weight:400;
    }
    .out:hover{
            background: rgba(96, 149, 214, 1);
        }
    .cancel{
        width: 70px;
        border:1px solid rgba(209,215,224,1);
        color:rgba(102,102,102,1);
        background: none;
        margin-left: 20px;
    }
}
//@import url(); 引入公共css类
// @import url(); Introduce common CSS classes
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
  border:1px solid rgba(209,215,224,1);
}
.second {
  margin-top: 30px;
  .second-item {
    .btn {
      text-align: right;
      button:hover{
        background: rgba(96, 149, 214, 1);
      }
    }
    button {
      width: 100px;
      height: 34px;
      background: rgba(54, 120, 200, 1);
      border-radius: 7px;
      border: none;
      color: white;
    }
    span {
      margin-right: 10px;
    }
    .s-limit {
      display: inline-block;
      div {
        width: 140px;
      }
    }
  }
}
.content {
  padding: 30px;
  font-size: 14px;
  .chose {
    #two {
      margin-left: -10px;
    }
    .item {
      span {
        // margin-right: 10px;
      }
      .top {
        width: 70px;
        // margin-left: 20px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        display: inline-block;
        float: right;
      }
      .limit {
        display: inline-block;
        div {
          width: 230px;
        }
      }
      .limit-time {
        display: inline-block;
        div {
          width: 280px;
        }
      }
    }
  }
}
.cont {
  width: 868px;
  min-height: 721px;
  background: white;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -434px;
  margin-top: -360px;
  box-shadow: 0px 10px 20px 0px rgba(102, 102, 102, 0.1);
  border-radius: 7px;
  padding-bottom:10px;
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
.addPlan {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 9;
  background:rgba(32,42,59,0.2);
}
</style>
<style lang="scss">
.addPlan {
  input::-webkit-input-placeholder{
    font-size: 12px;
  }
  .chose {
    .el-input__inner {
      height: 34px;
      
    }
    .el-input--small .el-input__inner {
      height: 34px;
    }
    .el-form-item{
      margin-bottom: 0px;
    }
    .el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label-wrap>.el-form-item__label:before, .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before{
      display: none;
    }
  }
  .second {
    .el-input__inner {
      height: 34px;
      padding: 0 13px;
    }
    .el-input--small .el-input__inner {
      height: 34px;
    }
  }
}
.addPlan  {
  .datePicker {
    position: relative;
    .el-icon-time {
      position: absolute;
      left: 3px;
      top: 13px;
      width: 14px;
      height: 14px;
    }
    .el-icon-time:before {
      display: block;
      width: 14px;
      height: 14px;
      background: url("../../../../assets/homePage/home_icon_calendar@2x.png")
        no-repeat center;
      background-size: cover;
      content: "";
    }
  }
}

</style>