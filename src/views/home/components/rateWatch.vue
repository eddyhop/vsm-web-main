<template>
  <div class="content" id="watch">
    <div class="top">
      <ul>
        <li>{{$t('Home.totalTraffic')}}</li>
        <li id="drop" v-if="this.type===2">
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
            <el-dropdown-menu class="project-dropdown devList" slot="dropdown">
              <el-dropdown-item :command="$t('Home.all')">{{$t('Home.all')}}</el-dropdown-item>
              <el-dropdown-item v-for="item in tenant" :key="item.id" :command="item">{{item.name}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <li class="selectDay">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane :label="$t('Home.today')" name="first"></el-tab-pane>
            <el-tab-pane :label="$t('Home.week')" name="second"></el-tab-pane>
            <el-tab-pane :label="$t('Home.month')" name="third"></el-tab-pane>
          </el-tabs>
        </li>
        <li class="selectTime">
          <div class="block" id="block">
            <el-date-picker
              size="mini"
              v-model="value1"
              type="datetimerange"
              range-separator="——"
              :start-placeholder="$t('Home.startTime')"
              :end-placeholder="$t('Home.endTime')"
              @change="fixTime"
            ></el-date-picker>
          </div>
        </li>
      </ul>
    </div>
    <div class="echarts">
      <div id="echart" class="echart"></div>
    </div>
  </div>
</template>
<script>
import { getWatch, getSelectTenant } from "@/services/index";
export default {
  data() {
    return {
      activeName: "first",
      projectName: this.$t("Home.all"),
      flag: true,
      tenant: [],
      value: [],
      value1: [],
      data: [],
      type: "",
      interval: "600",
      params: {
        tenantId: "",
        userType: "",
        startDate: "",
        endDate: "",
        timeGap: this.interval,
        random:""
      },
      default: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      defaultList: [
        "00:00",
        "02:00",
        "04:00",
        "06:00",
        "08:00",
        "10:00",
        "12:00",
        "14:00",
        "16:00",
        "18:00",
        "20:00",
        "22:00",
        "24:00"
      ]
    };
  },
  created() {
    /*this.timer = setTimeout(() => {
      this.echar();
    }, 0);*/
   // this.type = JSON.parse(sessionStorage.getItem("userData")).type;
    this.id = sessionStorage.getItem("tenantValue") ;
    this.params.tenantId = this.id;
    this.params.userType = this.type;
    this.params.timeGap = this.interval;
    this.params.startDate =
      this.needTime(new Date()).split(" ")[0] + " 00:00:00";
    this.params.endDate = this.needTime(new Date());

    this.value1=[new Date(this.params.startDate).getTime(), new Date(this.params.endDate).getTime()];

    this.getInfo(this.params);
    // 租户信息
   /* if (this.id  !== '') {
      getSelectTenant({ userType: this.type, tenantId: this.id }).then(res => {
        if (res.code === 10000) {
          this.tenant = res.result;
        }
      });
    }*/
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  watch: {
    data: function(newVal, oldVal) {
      setTimeout(() => {
        this.echar();
      }, 1800);
    },
    deep: true,
  },
  methods: {
    // 找到最大单位
    finedMaxSize(val) {
      if (val === 0) return "b";
      let arr = ["b", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"];
      let a = 0;
      while (val >= 1024) {
        val = val / 1024;
        a += 1;
      }
      return arr[a];
    },
    // 是每一个数据换算到最大单位
    changeMaxSize(val) {
      if (val === 0) return val;
      let arr = ["b", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"];
      let a = 0;
      while (arr.indexOf(this.maxSize) > a) {
        val = val / 1024;
        a += 1;
      }
      return parseFloat(Number((val * 8).toFixed(2)));
    },
    // 改变箭头指向
    changeStyle(e) {
      this.flag = !e;
    },
    filterTime(start, now) {
      let interval = now - start;
      //区间大于一个月的粒度为1天
      if (interval >= 2592000) {
        return "86400";
      }
      //区间大于一天小于一个月
      else if (interval < 2592000 && interval >= 86400) {
        return "1800";
      }
      //区间小于一天
      else if (interval < 86400) {
        return "600";
      }
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
    numberTime(time) {
      let date = new Date(time);
      let year = date.getFullYear() * 365 * 24 * 60 * 60;
      let month = (date.getMonth() + 1) * 30 * 24 * 60 * 60;
      let day = date.getDate() * 24 * 60 * 60;
      let hour = date.getHours() * 60 * 60;
      let minute = date.getMinutes() * 60;
      let miao = date.getSeconds();
      let list = {
        year: year,
        month: month,
        day: day,
        hour: hour,
        minute: minute,
        miao: miao
      };
      let str = 0;
      Object.values(list).map(item => {
        str += item;
      });
      return str;
    },
    // 转换后台返回时间戳
    formatDate(inputTime) {
      //从后台获取的时间戳是毫秒数的，所以得乘以1000，注意有时候获取到的是已经乘了1000的

      var time = parseInt(inputTime);
      var date = new Date(time);

      var datestring = date.toString();

      var y = date.getFullYear();

      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;

      var d = date.getDate();
      d = d < 10 ? "0" + d : d;

      var h = date.getHours();

      h = h < 0 ? " " + (24 + h) 
          : h < 10 && h >= 0 ?  "0" + h  
          : h;
      var s = date.getMinutes();
      s = s < 10 ? "0" + s : s;
      var str = y + '-' + m + '-' + d + ' ' + h + ':' + s;
      return str;
    },
    formatEchartsData(data) {
      let arr = [];
      data.forEach(item => {
        let n = item.data.length;
        let legend = {};
        let series = [];
      });
    },
    // 获取数据
    getInfo(params) {
      this.defaultList = [
        "00:00",
        "02:00",
        "04:00",
        "06:00",
        "08:00",
        "10:00",
        "12:00",
        "14:00",
        "16:00",
        "18:00",
        "20:00",
        "22:00",
        "24:00"
      ];
      this.data = [];

      let thisDate = new Date();
      //时区
      var datestring = thisDate.toString();

      //与UTC时间差
      var utcDate = datestring.split("GMT")[1];
      utcDate = utcDate.substring(0,3);
      var utc = parseInt(utcDate);


      var bdate  = new Date(params.startDate);
      bdate.setHours(bdate.getHours()-utc);

      var edate  = new Date(params.endDate);
      edate.setHours(edate.getHours()-utc);

      params.startDate = this.getTime(bdate);
      params.endDate = this.getTime(edate);
      params.random = Math.random();
      getWatch(params).then(res => {
        if (
          res.code === 10000 &&
          res.result && res.result.length !== 0 &&
          res.result !== "[]"
        ) {
          this.defaultList = [];
          this.data = [];
          res.result.map(item => {
            this.data.push(Number(item.value));
            this.defaultList.push(this.formatDate(item.timestamp));
          });
          let maxData = Math.max(...this.data);
          this.maxSize = this.finedMaxSize(maxData);
          let arr = [];
          this.data.map(item => {
            arr.push(this.changeMaxSize(item));
          });
          this.data = arr;
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
    // 切换今日、本周、本月
    handleClick(e) {
      if (e.name === "first") {
        this.interval = "600";
        this.startDate = this.needTime(new Date()).split(" ")[0] + " 00:00:00";
        this.endDate = this.needTime(new Date());
      } else if (e.name === "second") {
        var Nowdate = new Date();
        var day = Nowdate.getDay() || 7;
        var WeekFirstDay = new Date(Nowdate - (day - 1) * 86400000);
        var D = Number(WeekFirstDay.getMonth()) + 1;
        D = D < 10 ? "0" + D : D;
        var Dd = WeekFirstDay.getDate();
        Dd = Dd < 10 ? "0" + Dd : Dd;
        function showWeekFirstDay() {
          return WeekFirstDay.getFullYear() + "-" + D + "-" + Dd;
        }
        this.startDate = showWeekFirstDay() + " 00:00:00";
        this.endDate = this.needTime(Nowdate);
        let startDate = new Date(this.startDate).getTime() / 1000;
        let endDate = new Date(this.endDate).getTime() / 1000;
        this.interval = this.filterTime(startDate, endDate);
      } else if (e.name === "third") {
        var Nowdate = new Date();
        var MonthFirstDay = new Date(Nowdate.getYear(), Nowdate.getMonth(), 1);
        var M = Number(MonthFirstDay.getMonth()) + 1;
        M = M < 10 ? "0" + M : M;
        var Md = MonthFirstDay.getDate();
        Md = Md < 10 ? "0" + Md : Md;
        function showMonthFirstDay() {
          return Nowdate.getFullYear() + "-" + M + "-" + Md;
        }
        this.startDate = showMonthFirstDay() + " 00:00:00";
        this.endDate = this.needTime(Nowdate);
        let startDate = new Date(this.startDate).getTime() / 1000;
        let endDate = new Date(this.endDate).getTime() / 1000;
        this.interval = this.filterTime(startDate, endDate);
      }
      this.value1 = [];
      this.params.startDate = this.startDate;
      this.params.endDate = this.endDate;
      this.params.timeGap = this.interval;
      this.value1=[new Date(this.params.startDate).getTime(), new Date(this.params.endDate).getTime()];
      this.getInfo(this.params);
    },
    // 切换租户
    switchProject(item) {
      if (item === "全部" || item === "All") {
        this.projectName = item;
        this.params.userType = 2;
        this.params.tenantId = this.id;
        this.params.timeGap = this.interval;
        this.getInfo(this.params);
        return;
      }
      this.projectName = item.name;
      this.params.tenantId = item.id;
      this.params.userType = 1;
      this.params.timeGap = this.interval;
      this.getInfo(this.params);
    },
    // 日期选择
    fixTime(value) {
      this.activeName = "first";
      if (value === null) {
        this.params.startDate =
          this.needTime(new Date()).split(" ")[0] + " 00:00:00";
        this.params.endDate = this.needTime(new Date());
        this.params.timeGap = "600";
        this.getInfo(this.params);
        return;
      }
      let start = this.numberTime(new Date(value[0]));
      let end = this.numberTime(new Date(value[1]));
      this.params.startDate = this.needTime(new Date(value[0]));
      this.params.endDate = this.needTime(new Date(value[1]));
      this.interval = this.filterTime(start, end);
      this.params.timeGap = this.interval;
      this.getInfo(this.params);
    },
    echar() {
      // 基于准备好的dom，初始化echarts实例
      let _this = this;
      this.data.length === 0 ? (_this.data = this.default) : null;
      this.defaultList.length === 0
        ? (_this.defaultList = this.defaultList)
        : null;
      _this.maxSize === undefined ? (_this.maxSize = "b") : null;
      window.addEventListener("resize", function() {
        _this.myChart.resize();
      });
      this.myChart = this.$echarts.init(document.getElementById("echart"));
      var option = {
        tooltip: {
          formatter: function(params) {
            var result = "";
            var dotHtml =
              '<span id="sanJiao" style="display:inline-block;margin-right:7px;border-radius:50%;width:7px;height:7px;background-color:#3678C8;"></span>';
            // var show = `<span>速率${item.data}Mps/s</span>`;
            params.forEach(function(item) {
              result +=
                item.axisValue +
                "</br>" +
                dotHtml +
                `<span style="font-size:14px!important;">${_this.$t('Home.rate')}${item.data}${_this.maxSize}ps</span>`;
            });
            return result;
          },
          trigger: "axis",
          extraCssText:
            "width:120px;height:44px;background:#333333;padding:4px 8px;",
          // position: function(p) {
          //   //其中p为当前鼠标的位置
          //   return [p[0] - 58.5, p[1] - 46];
          // },
          textStyle: {
            height: 20,
            fontSize: 12,
            fontFamily: "arial, sans-serif",
            fontWeight: 400,
            color: "#fff",
            lineHeight: 20
          },
          emphasis: {
            iconStyle: {
              color: "#fff"
            }
          }
        },
        grid: {
          x: 38,
          y: 25,
          x2: 25,
          y2: 25,
          borderWidth: 1
        },
        toolbox: {
          //图表可缩放配置
          show: true,
          feature: {
            dataZoom: {
              title: {
                zoom: _this.$t('Home.zoom'),
                back: _this.$t('Home.reset')
              },
              yAxisIndex: "none"
            }
          }
        },
        xAxis: {
          type: "category",
          axisLine: {
            show: false
          },
          boundaryGap: false,
          axisTick: {
            show: false
          },
          data: _this.defaultList
        },
        yAxis: {
          type: "value",
          splitNumber: 10,
          name: _this.maxSize + "ps",
          nameTextStyle: {
            padding: [0, 46, -2, 0] // 四个数字分别为上右下左与原位置距离
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: "#EBEBEB"
            }
          },
          min: 0
          // max: function(value){
          //   if(value.max<100) return 100;
          //   if(value.max<1000) return 1000;
          //   if(value.max>1000) return 1100;
          // }
        },
        series: [
          {
            name: "速率",
            data: _this.data,
            type: "line",
            smooth: true,
            symbol: "none",
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 3,
                  color: "#3678C8" // 阳线边框颜色
                }
              }
            }
          }
        ]
      };
      this.myChart.setOption(option);
      _this.myChart.resize();
    }
  }
};
</script>
<style>
#sanJiao {
  position: relative;
}
#sanJiao::before {
  content: "";
  display: block;
  border-right: 6px solid transparent;
  border-top: 6px solid #333333;
  border-left: 6px solid transparent;
  border-bottom: 6px solid transparent;
  position: absolute;
  top: 15px;
  left: 47px;
}
.project-dropdown {
  height: 160px;
  width: 100px;
  overflow: auto;
  white-space: nowrap;
}
.el-dropdown-menu__item {
  text-overflow: ellipsis;
  overflow: hidden;
  color: #666666 !important;
}
.el-dropdown-menu__item:hover {
  color: #3678c8 !important;
}
.devList::-webkit-scrollbar {
  width: 4px;
}
.devList::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.devList::-webkit-scrollbar-track  {
     -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
     border-radius: 0;
     background: rgba(0, 0, 0, 0.1);
}
</style>
<style scoped lang="scss">
.content {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 1);
  padding: 14px 14px 16px 14px;
  font-family: arial, sans-serif;
  font-weight: 400;
  position: relative;
  .top {
    ul {
      display: flex;
      position: relative;
      li:nth-child(1) {
        font-size: 14px;
        height: 20px;
        color: rgba(51, 51, 51, 1);
        line-height: 20px;
        display: flex;
        align-items: center;
      }
      li:nth-child(1)::before {
        display: block;
        content: "";
        width: 2px;
        height: 12px;
        background: rgba(54, 120, 200, 1);
        margin-right: 6px;
      }
      #drop {
        z-index: 11;
        margin-left: 30px;
        position: relative;
        cursor: pointer;
      }
      .selectDay {
        position: absolute;
        top: 3px;
        right: 309px;
      }
      .selectTime {
        z-index: 11;
        width: 309px;
        height: 26px;
        position: absolute;
        top: -3px;
        right: 0px;
      }
    }
  }
  .echarts {
    width: 100%;
    height: 100%;
    position: relative;
    top: 6px;
    right: -7px;
    margin: 0 auto;
    // overflow: visible;
    .echart {
      width: 100%;
      height: 100%;
      padding-bottom: 16px;
    }
  }
}
</style>
<style lang="scss" >
#watch {
  .el-tabs__nav-wrap::after {
    height: 0px;
  }
  .el-tabs__item:hover {
    color: #3678c8;
  }
  .el-tabs__item.is-active {
    color: #3678c8;
  }
  .el-tabs__item {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 500;
    line-height: 20px;
    padding: 0 10px 0 0;
    position: relative;
    top: -2px;
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
      // overflow: hidden;
      // text-overflow: ellipsis;
      white-space: nowrap;
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
}
#block {
  .el-range-editor--mini.el-input__inner {
    height: 26px;
    width: 309px;
  }
  .el-range-editor--mini.el-input__inner:hover {
    border: 1px solid #3678c8;
  }
  .el-date-editor .el-range__close-icon {
    display: none;
  }
  .el-date-editor .el-range__icon {
    position: relative;
    right: -283px;
  }
  .el-icon-time:before {
    display: block;
    width: 14px;
    height: 14px;
    background: url("../../../assets/home_icon_calendar.png") no-repeat center;
    content: "";
    position: relative;
    top: 2px;
  }
  .el-range-editor--mini .el-range-input {
    font-size: 13px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 18px;
    width: 159%;
    position: relative;
    right: 11px;
  }
  .el-range-editor--mini .el-range-separator {
    position: relative;
    right: 15px;
  }
}
</style>