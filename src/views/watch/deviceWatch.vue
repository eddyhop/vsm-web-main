<template>
  <div class="DwatchMain">
    <div class="top">
      <h3>
        {{$t('Monit.monitoring')}}
        <img src="@/assets/icon_right@2x.png" alt />
        <span>{{$t('Monit.devMonit')}}</span>
      </h3>
      <ul class="tabs">
        <li
          :class="item.id === activeIndex ? 'active' : ''"
          v-for="(item) in tabsData"
          :key="item.id"
          @click="tabsEvent(item)"
        >{{item.name}}</li>
        <li id="favorite" v-show="activeIndex==0">
          <span>{{$t('Monit.devGroup')}}</span>
          <el-select filterable
            v-model="value"
            size="small"
            
            remote
            reserve-keyword
            :placeholder="$t('Monit.keyWord')"
            :remote-method="remoteMethod"
            @focus="inGet"
            @change="chose(value)"
            :loading="loading"
          >
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </li>
        <li id="favorite" v-show="activeIndex==1">
          <span>{{$t('Monit.linkGroup')}}</span>
          <el-select filterable
            v-model="runVal"
            size="small"
            
            remote
            reserve-keyword
            :placeholder="$t('Monit.keyWord')"
            :remote-method="remoteMethodRun"
            @focus="inGetRun"
            @change="choseRun(runVal)"
            :loading="loading"
          >
            <el-option
              v-for="item in runOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </li>
      </ul>
    </div>
    <div class="watchList">
      <devChart ref="devChart" v-show="activeIndex==0" />
      <myCollect ref="myCollect" v-show="activeIndex==1" />
      <!-- <NotificationSettings  v-show="activeIndex===2" /> -->
    </div>
  </div>
</template>
<script>
import {
  favoriteDeviceGroupCheck,
  favoriteTunnelGroupCheck,
  favoriteDeviceGroupChart,
  favoriteTunnelGroupChart
} from "@/services";
import devChart from "./components/devChart";
import myCollect from "./components/myCollect";
import NotificationSettings from "./components/NotificationSettings";
export default {
  props: {},
  components: {
    devChart,
    myCollect,
    NotificationSettings
  },
  data() {
    return {
      favoriteId: "",
      favoriteType: "",
      userId: "",
      value: "",
      options: [],
      runVal: "",
      runOptions: [],
      tabsData: [
        {
          name: this.$t('Monit.dev'),
          id: 0
        },
        {
          name: this.$t('Monit.link'),
          id: 1
        },
        // {
        //   name: this.$t('Monit.message'),
        //   id: 2
        // }
      ],
      //当前点击的下标
      // The index of the current click
      activeIndex: 0,
      //收藏夹的显示隐藏
      // Favorites show hidden
      favFlag: false,
      // 弹框的显示隐藏
      // The display of the pop-up box is hidden
      loading: false,
      interval: "600", //监控粒度
                       // Monitoring granularity
      startDate: this.needTime(new Date()).split(' ')[0] + ' 00:00:00', //开始时间
                                                                        // The start time
      endDate: this.needTime(new Date()) //结束时间
                                         // The end of time
    };
  },
  computed: {},
  methods: {
    chose(val) {
      //选择设备分组
      // Select device group
      for (let i in this.options) {
          if (this.options[i].id == this.value) {
            if(this.$refs.devChart.pageGroup!=this.options[i].name){
              this.$refs.devChart.chartData = []
            }else{
              
            }
          }
        }
      let type = "";
      this.options.map(item => {
        type = item.id == val ? item.type : item.type;
      });
      let params = {
        favoriteId: val,
        favoriteType: type,
        startDate: this.startDate,
        endDate: this.endDate,
        timeGap: this.interval
      };
      favoriteDeviceGroupChart(params).then(res => {
        this.$refs.devChart.chartData = res.result;
        this.$refs.devChart.code = res.result.length;
        this.$refs.devChart.favoriteId = this.value;
        for (let i in this.options) {
          if (this.options[i].id == this.value) {
            this.$refs.devChart.pageGroup = this.options[i].name;
          }
        }
        this.$refs.devChart.getChart();
      });
    },
    //选择链路分组
    // Select link grouping
    choseRun(val) {
      for (let i in this.runOptions) {
          if (this.runOptions[i].id == this.runVal) {
            if(this.$refs.myCollect.pageGroup!=this.runOptions[i].name){
              this.$refs.myCollect.chartData = []
            }else{
              // console.log(5)
            }
          }
        }
      let params = {
        favoriteId: val,
        favoriteType: "tunnel",
        startDate: this.startDate,
        endDate: this.endDate,
        timeGap: this.interval
      };
      favoriteTunnelGroupChart(params).then(res => {
        this.$refs.myCollect.chartData = res.result;
        this.$refs.myCollect.code = res.result.length;
        this.$refs.myCollect.favoriteId = this.runVal
        for (let i in this.runOptions) {
          if (this.runOptions[i].id == this.runVal) {
            this.$refs.myCollect.pageGroup = this.runOptions[i].name;
          }
        }
        this.$refs.myCollect.getChart();
      });
    },
    getGroupList(query) {
      //获取设备分组
      // Get device grouping
      this.userId = JSON.parse(sessionStorage.getItem("userData")).userId;
      favoriteDeviceGroupCheck({ userId: this.userId, searchKey: query }).then(
        res => {
          this.options = res.result;
        }
      );
    },
    getRunList(query) {
      //获取链路分组
      // Acquisition link grouping
      this.userId = JSON.parse(sessionStorage.getItem("userData")).userId;
      favoriteTunnelGroupCheck({ userId: this.userId, searchKey: query }).then(
        res => {
          this.runOptions = res.result;
        }
      );
    },
    inGetRun() {
      //获取焦点拿链路分组
      // Get focus grab link grouping
      this.getRunList();
    },
    remoteMethodRun(query) {
      //链路分组模查
      // Link packet module
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.getRunList(query);
        }, 500);
      } else {
        this.options = [];
      }
    },
    inGet() {
      //获取焦点拿设备分组
      // Get focus take device grouping
      this.getGroupList();
    },
    remoteMethod(query) {
      //获取设备分组
      // Get device grouping
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.getGroupList(query);
        }, 500);
      } else {
        this.options = [];
      }
    },
    tabsEvent(el) {
      this.activeIndex = el.id;
      this.favFlag = el.id === 0 ? false : true;
    },
    needTime(time) {
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
  created() {
    // this.startDate = this.needTime(new Date()).split(' ')[0] + ' 00:00:00'
    this.userId = JSON.parse(sessionStorage.getItem("userData")).userId;
    // favoriteDeviceGroupCheck({ userId: this.userId }).then(
    //   res => {
    //     // this.value = res.result[0].id
    //     this.chose(res.result[0].id)
    //   }
    // );
  },
  mounted() {}
};
</script>
<style scoped lang="scss">
.DwatchMain {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
}
.top {
  width: 100%;
  padding: 20px 30px 20px 30px;
  background: #fff;
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
    width: 106px;
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
.formSelect {
  padding-top: 20px;
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
    padding-right: 30px;
    span {
      padding-right: 10px;
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }
  }
  .formItem:nth-of-type(4) {
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
  .formItem:last-of-type {
    padding-right: 0;
  }
  .search {
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    border: 0;
    outline: none;
    text-align: center;
    line-height: 34px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
  }
}
.watchList {
  width: 100%;
  height: 100%;
  margin-top: 20px;
  background: #fff;
  padding: 20px 30px 30px 30px;
  overflow: auto;
}
.watchList::-webkit-scrollbar {
  width: 4px;
  /*height: 4px;*/
}
.watchList::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.watchList::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
#favorite {
  width: auto;
  border: 0;
  padding-left: 120px;
  span {
    padding-right: 10px;
  }
}
</style>
<style lang="scss">
#favorite .el-input__inner {
  width: 200px;
  height: 34px;
  border: 1px solid rgba(209, 215, 224, 1);
}
#favorite .el-input__icon {
  line-height: normal;
}
</style>
