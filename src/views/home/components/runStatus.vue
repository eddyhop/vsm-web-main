<template>
  <div class="content" id="tab1">
    <ul class="top">
      <li class="state">{{$t('Home.deviceState')}}</li>
      <li>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="VSR" name="first"></el-tab-pane>
          <el-tab-pane label="VSR_Cloud" name="second"></el-tab-pane>
        </el-tabs>
      </li>
      <li class="zhuHu" v-if="false">
        <el-dropdown
          size="small"
          trigger="click"
          placement="bottom-start"
          @command="switchProject"
          @visible-change="changeStyle"
        >
          <span class="el-dropdown-link wenzi">
            <span>{{projectName}}</span>
            <i :class="flag?'chaoXiang':'chaoXiang1'"></i>
          </span>
          <el-dropdown-menu
            size="small"
            trigger="click"
            placement="bottom"
            slot="dropdown"
            class="project-dropdown devList"
          >
            <!-- <el-dropdown-item :command="$t('Home.all')">{{$t('Home.all')}}</el-dropdown-item> -->
            <el-dropdown-item v-for="item in tenant" :key="item.id" :command="item">{{item.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </li>
    </ul>
    <div class="main">
      <div class="every">
        <span class="type">{{$t('Home.normal')}}</span>
        <span class="num">{{state.normal || 0}}</span>
        <div>
          <i class="default default_1" v-if="state.normal===0"></i>
          <el-progress :text-inside="true" :percentage="rate1" :stroke-width="6" color="#029805"></el-progress>
        </div>
      </div>
      <div class="every">
        <span class="type">{{$t('Home.warning')}}</span>
        <span class="num">{{state.ordinary || 0}}</span>
        <div>
          <i class="default default_2" v-if="state.ordinary===0"></i>
          <el-progress :text-inside="true" :percentage="rate2" :stroke-width="6" color="#D89012"></el-progress>
        </div>
      </div>
      <div class="every">
        <span class="type">{{$t('Home.error')}}</span>
        <span class="num">{{state.severity || 0}}</span>
        <div>
          <i class="default default_3" v-if="state.severity===0"></i>
          <el-progress :text-inside="true" :percentage="rate3" :stroke-width="6" color="#BA2727"></el-progress>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getDevState, getSelectTenant } from "@/services/index.js";
export default {
  data() {
    return {
      projectName: 'default',
      activeName: "first",
      rate1: 0,
      rate2: 0,
      rate3: 0,
      name: "VSR",
      flag: true,
      tenant: [],
      state: {
        normal: 0,
        ordinary: 0,
        severity: 0
      }
    };
  },
  methods: {
    changeStyle(e) {
      this.flag = !e;
    },
    // 切换租户
    // Switch the tenant
    switchProject(item) {
      if (item === "全部" || item === "All") {
        this.userType = 1;
        this.tenantId = "";
        this.projectName = item;
        this.getInfor();
        return;
      }
      this.tenantId = item.id;
      this.userType = 2;
      this.projectName = item.name;
      this.getInfor();
    },
    // 获取租户
    // Access to the tenant
    getTenData() {
      let params = {
        userType: this.type,
        tenantId: this.id
      };
      getSelectTenant(params).then(res => {
        if (res.code === 10000) {
          this.tenant = res.result;
        }
      });
      this.tenant.map(item=>{
        if(this.tenantId == item.id){
          this.projectName = item.name
        }
      })
    },
    handleClick(e) {
      e.label === "VSR" ? (this.name = "VSR") : (this.name = "VSR_Cloud");
      this.getInfor();
    },
    getInfor() {
      let params = {
        userType: this.userType,
        tenantId: this.tenantId
      };
      getDevState(params).then(res => {
        if (res.code === 10000) {
          if (this.name === "VSR") {
            this.state = res.result.vsr0001;
            for (let key in this.state) {
              this.state[key] < 0 ? (this.state[key] = 0) : null;
            }
          } else if (this.name === "VSR_Cloud") {
            this.state = {
              normal: 0,
              ordinary: 0,
              severity: 0
            };
            for (let key in this.state) {
              this.state[key] < 0 ? (this.state[key] = 0) : null;
            }
          }
          this.rate1 = Number(
            (
              (this.state.normal /
                (this.state.normal +
                  this.state.ordinary +
                  this.state.severity)) *
              100
            ).toFixed(2)
          );
          this.rate2 = Number(
            (
              (this.state.ordinary /
                (this.state.normal +
                  this.state.ordinary +
                  this.state.severity)) *
              100
            ).toFixed(2)
          );
          this.rate3 = Number(
            (
              (this.state.severity /
                (this.state.normal +
                  this.state.ordinary +
                  this.state.severity)) *
              100
            ).toFixed(2)
          );
          isNaN(this.rate1) ? (this.rate1 = 0) : null;
          isNaN(this.rate2) ? (this.rate2 = 0) : null;
          isNaN(this.rate3) ? (this.rate3 = 0) : null;
        }
      });
    }
  },
  created() {
    this.type = JSON.parse(sessionStorage.getItem("userData")).type;
    this.id =JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId || "";
    this.userType = this.type;
    this.tenantId = this.id;
    this.getInfor();
    this.getTenData();
  }
};
</script>
<style scoped lang="scss">
.content {
  width: calc(57.9% - 40px);
  height: 150px;
  padding: 14px 30px 30px 15px;
  background: rgba(255, 255, 255, 1);
  font-family: arial, sans-serif;
  font-weight: 400;
  position: relative;
  .top {
    width: 320px;
    display: flex;
    li:nth-child(1) {
      height: 20px;
      font-size: 14px;
      color: rgba(51, 51, 51, 1);
      line-height: 20px;
      margin-right: 30px;
      display: flex;
      align-items: center;
      white-space: nowrap;
    }
    li:nth-child(1)::before {
      display: block;
      content: "";
      width: 2px;
      height: 12px;
      background: rgba(54, 120, 200, 1);
      margin-right: 6px;
      line-height: 20px;
    }
    li:nth-child(2) {
      position: relative;
      top: 3px;
    }
    li:nth-child(3) {
      margin-left: 30px;
      position: relative;
    }
  }
  .main {
    width: calc(100% - 30px);
    height: 60px;
    display: flex;
    justify-content: space-between;
    position: absolute;
    bottom: 30px;
    .every {
      // flex: 1;
      text-align: center;
      .type {
        height: 30px;
        font-size: 14px;
        color: rgba(51, 51, 51, 1);
        line-height: 20px;
      }
      .num {
        font-size: 22px;
        color: rgba(51, 51, 51, 1);
        line-height: 30px;
        padding-left: 10px;
      }
      div {
        width: 166px;
        height: 6px;
        margin: 17px auto;
        position: relative;
      }
      .default {
        width: 6px;
        height: 6px;
        border-radius: 100%;
        position: absolute;
        z-index: 10;
        top: 5px;
        left: 0px;
      }
      .default_1 {
        background: #029805;
      }
      .default_2 {
        background: #d89012;
      }
      .default_3 {
        background: #ba2727;
      }
    }
  }
}
</style>
<style lang="scss">
#tab1 {
  .el-tabs__nav-wrap::after {
    height: 0px;
  }
  .el-tabs__item {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 500;
    line-height: 20px;
    padding: 0px;
    position: relative;
    top: -2px;
  }
  .el-tabs__item:hover {
    color: #3678c8 !important;
  }
  #tab-second {
    padding-left: 20px;
  }
  .el-tabs__item.is-active {
    color: #3678c8;
  }
  .el-tabs__active-bar {
    bottom: 19px;
    background-color: #3678c8;
  }
  .wenzi {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
    display: flex;
    align-items: center;
    span {
      display: block;
      // width: 37px;
      white-space: nowrap;
      // overflow: hidden;
      // text-overflow: ellipsis;
      cursor: pointer;
    }
    .chaoXiang {
      display: inline-block;
      margin-left: 4px;
      margin-top: 4px;
      border-right: 4px solid transparent;
      border-top: 4px solid #d1d7e0;
      border-left: 4px solid transparent;
      border-bottom: 4px solid transparent;
    }
    .chaoXiang1 {
      display: inline-block;
      margin-left: 4px;
      margin-top: -4px;
      border-right: 4px solid transparent;
      border-bottom: 4px solid #d1d7e0;
      border-left: 4px solid transparent;
      border-top: 4px solid transparent;
    }
  }
  .wenzi:hover {
    color: #3678c8;
  }
  .el-progress-bar__outer {
    background: #f7f8fa;
    overflow: visible;
  }
  .el-progress-bar__innerText {
    font-size: 12px !important;
    color: #666666;
    height: 17px;
    line-height: 17px;
    position: relative;
    top: -19px;
    left: -3px;
  }
  // .el-progress {
  //   position: relative;
  // }
  // .el-progress::before {
  //   display: block;
  //   content: "";
  //   width: 6px;
  //   height: 6px;
  //   border-radius: 50%;
  //   position: absolute;
  //   top: 5.4px;
  //   z-index: 10;
  // }
  // .every:nth-child(1) .el-progress::before {
  //   background: #029805;
  // }
  // .every:nth-child(2) .el-progress::before {
  //   background: #d89012;
  // }
  // .every:nth-child(3) .el-progress::before {
  //   background: #ba2727;
  // }
  // .el-tabs__item.is-active {
  //   color: #3678c8;
  // }
}
</style>