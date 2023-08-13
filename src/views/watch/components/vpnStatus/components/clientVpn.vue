<template>
  <div class="linkMain">
    <div class="linkCon">
      <dl class="linkTop">
        <dt class="search">

          <!-- <button class="searchBtn" @click="serarchEvent">搜索</button> -->
        </dt>
        <dd class="time">

          <el-tabs v-model="activeName" @tab-click="handleClick" style="padding-right: 20px">
            <el-tab-pane :label="$t('Home.today')" name="first"></el-tab-pane>
            <el-tab-pane :label="$t('Home.week')" name="second"></el-tab-pane>
            <el-tab-pane :label="$t('Home.month')" name="third"></el-tab-pane>
          </el-tabs>

          <el-date-picker style="width: 306px"
            v-model="timeVal"
            size="mini"
            type="datetimerange"
            @change="choseTime"
            range-separator="——"
            :start-placeholder="$t('vsr1000.startTime')"
            :end-placeholder="$t('vsr1000.endTime')"
            prefix-icon="el-icon-time"
            class="datePicker"
          ></el-date-picker>
        </dd>
      </dl>
      <!-- <charts />   v-infinite-scroll="loadCharts"-->
      <div
        class="chartsList"

        infinite-scroll-disabled="disabled"
        infinite-scroll-distance="40"
        infinite-scroll-immediate="false"
        infinite-scroll-delay="1"
      >
        <div v-for="(item,index) in chartsData" :key="index">
          <h3 class="title">{{item.TunnelName}}</h3>
          <div class="chartItem">
            <!-- <div class="chart" id="chart1"></div> -->
            <charts :id="item.domId.flow" :data="item.chartsArr[0]" />
          </div>
        </div>
        <p v-if="loading" class="loadingTit">{{$t('Jump.loading')}}...</p>
        <!-- 381问题 去掉 无数据时提示nomore -->
        <!-- <p v-if="noMore" class="noMoreTit">{{$t('vsr1000.noMore')}}</p> -->
        <div class="dataMsg" v-if="!chartsData.length">{{$t('vsr1000.noData')}}</div>
      </div>
    </div>
    <addGroup v-if="isShow" />
  </div>
</template>
<script>
import charts from "./components/charts";
import addGroup from "./components/addGroup";
import {
  deviceTunnelNameCheck,
  clientVpnUpAndDownChart, userInfo,
} from "@/services";
export default {
  props: {},
  components: {
    charts,
    addGroup,
  },
  data() {
    return {
      activeName: "first",
      devType: "",
      deviceId: JSON.parse(this.$route.query.devData).deviceId,
      lang: "",
      //日期切换下标 Date switch subscript
      // Date switch subscript Date switch subscript
      tabIndex: 1,
      //选择的日期 Selected date
      // The Selected date Selected Date
      timeVal: [new Date(), new Date()],
      //搜索 search
      // Search search
      searchVal: "",
      //图表数据 The chart data
      // The chart data
      chartsData: [],
      isShow: false,
      position: "", //图表类型 chart type
                    // Chart type Chart type
      interval: "600", //监控粒度, Monitoring granularity
                       // Monitoring granularity, Monitoring granularity
      startDate: "",
      endDate: "",
      maxUnit: "",
      maxNum: "",
      page: 1,
      pageSize: 5,
      loading: false,
      noMore: false,
      params: {
        deviceId: JSON.parse(this.$route.query.devData).deviceId,
        deviceType: "0001",
        userId: "",
        clinetUserName: "",
        timeGap: "600",
        startDate: this.getTime(new Date()).split(" ")[0] + " 00:00:00",
        endDate: this.getTime(new Date()),
        page: 1,
        pageSize: 5,
      },
      vpnNames:"",
    };
  },
  computed: {
    disabled() {
      return this.loading || this.noMore;
    },
  },
  methods: {
    handleClick(e) {
      if (e.name === "first") {
        this.choseToday();
      } else if (e.name === "second") {
        this.choseWeek();
      } else if (e.name === "third") {
        this.choseMounth();
      }
      this.timeVal=[new Date(this.startDate).getTime(), new Date(this.endDate).getTime()];
    },
    //清空重置数据 Empty reset data
    // Empty and reset data Empty reset Data
    resetData(val) {
      if (!val.length) {
        this.params.tunnelName = "";
        this.dataInit(this.params, "search");
      }
    },
    //上拉加载 Pull on loading
    // Pull up on loading
    loadCharts() {
      console.log(44444444444444);
      this.loading = true;
      setTimeout(() => {
        this.params.page += 1;
        this.dataInit(this.params);
      }, 500);
    },
    //时间格式转换 Time format conversion
    // Time format conversion
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
    //数据初始化 Data initialization
    // Data initialization
    dataInit(params, val) {
      let thisDate = new Date();
      //时区
      var datestring = thisDate.toString();

      //与UTC时间差
      var utcDate = datestring.split("GMT")[1];
      utcDate = utcDate.substring(0,3);
      var utc = parseInt(utcDate);


      var bdate  = new Date(this.startDate);
      bdate.setHours(bdate.getHours()-utc);

      var edate  = new Date(this.endDate);
      edate.setHours(edate.getHours()-utc);

      params.startDate = this.getTime(bdate);
      params.endDate = this.getTime(edate);

      console.log("Client VPN 流量图");
      clientVpnUpAndDownChart(params).then((res) => {
        if (res.code === 10000 && Object.keys(res.result).length) {
          delete res.result.online;
          let result = res.result;
          let data = [];
          let sortArr = Object.keys(result).sort();
          sortArr.forEach((item, index) => {
            data.push({
              TunnelName: item,
              chartsArr: this.formatEchartsData(result[item]),
              domId: {
                flow: `charts` + item + index,
                lossAndDelay: `charts` + item + index + 1,
              },
            });
          });
          this.loading = false;
          if (this.searchVal.length || data.length === 0) {
            this.noMore = true;
          }

          this.chartsData = data;

         /* if (val == "search" || val == "time") {
            this.chartsData = data;
          } else {
            this.chartsData = this.chartsData.concat(data);
          }*/
        }
        // else {
        //   this.chartsData = [];
        // }
      });
      this.timeVal=[new Date(this.startDate).getTime(), new Date(this.endDate).getTime()];
    },
    //格式echarts数据 Format echarts data
    // Echarts Data Format Echarts Data
    formatEchartsData(data) {
      let arr = [];
      let firstList = [];
      let twoList = [];
      let firstListY = [];
      let twoListD = [];
      let mockArr = [];
      data.forEach((item) => {
        if (item.name === "flow") {
          if (item.time != null && item.time.length) {
            mockArr = item.time;
            if (item.data[0].data != null && item.data[0].data.length) {
              let maxNum = Math.max(...item.data[0].data);
              this.maxUnit = this.finedMaxSize(maxNum);
              this.maxNum = this.maxUnit + "ps";
              item.time.forEach((el, index) => {
                firstList.push({
                  name: this.getTime(Number(el)),
                  value: [
                    this.getTime(Number(el)),
                    this.changeMaxSize(item.data[0].data[index]),
                  ],
                });
              });
            } else {
              firstList = this.portDataChange()[0];
            }
            if (item.data[1].data.length) {
              item.time.forEach((el, index) => {
                twoList.push({
                  name: this.getTime(Number(el)),
                  value: [
                    this.getTime(Number(el)),
                    this.changeMaxSize(item.data[1].data[index]),
                  ],
                });
              });
            } else {
              twoList = this.portDataChange()[1];
            }
          } else {
            firstList = this.portDataChange()[0];
            twoList = this.portDataChange()[1];
          }

          arr.push({
            color: ["#3678C8", "#36C3C8"],
            tooltip: {
              trigger: "axis",
            },
            title: {
              text: this.$t("vsr1000.trafficSent"),
              x: "center",
              y: 15,
            },
            legend: {
              top: 15,
              right: "15%",
              data: [
                {
                  name: this.$t("vsr1000.up"),
                  textStyle: {
                    fontSize: 14,
                    fontFamily: "arial, sans-serif",
                    fontWeight: "400",
                    color: "#333333",
                  },
                  // icon:"image://../../../../assets/newPage/upIcon.png"
                },
                {
                  name: this.$t("vsr1000.down"),
                  textStyle: {
                    fontSize: 14,
                    fontFamily: "arial, sans-serif",
                    fontWeight: "400",
                    color: "#333333",
                  },
                },
              ],
            },
            grid: {
              x: 40,
              y: 55,
              x2: 40,
              y2: 0,
              borderWidth: 1,
              height: "70%",
            },
            toolbox: {
              //图表可缩放配置 The diagram is scalable in configuration
              // The diagram is scalable in Configuration
              show: true,
              feature: {
                dataZoom: {
                  yAxisIndex: "none",
                  title: {
                    zoom: this.$t("Home.zoom"),
                    back: this.$t("Home.reset"),
                  },
                },
              },
              x: "left",
              x: "10",
            },
            xAxis: {
              type: "time",
              splitLine: {
                show: false,
              },
            },
            yAxis: {
              // min: "dataMin", //就是这两个 最小值 Those are the two minimum values
              // Min: "dataMin", Those are the two minimum values
              // max: "dataMax", //最大值 maximum
              // Max: "dataMax", maximum
              name: this.maxNum,
              nameTextStyle: {
                padding: [0, 10, -10, 0],
                // 四个数字分别为上右下左与原位置距离
                // The four numbers are the distance between the top right bottom left and the original position
                //The four Numbers are the distance between the top right bottom left and the original position
              },
              type: "value",
              // boundaryGap: [0, "100%"],
              splitLine: {
                // show: false
              },
            },
            series: [
              {
                name: this.$t("vsr1000.up"),
                type: "line",
                data: firstList,
                lineStyle: {
                  color: "#3678C8",
                },
                smooth: true,
              },
              {
                name: this.$t("vsr1000.down"),
                type: "line",
                data: twoList,
                lineStyle: {
                  color: "#36C3C8",
                },
                smooth: true,
              },
            ],
            position: item.position,
            isFavorite: item.isFavorite,
          });

        } else if (item.name === "lossAndDelay_") {
          if (item.time != null && item.time.length) {
            mockArr = item.time;
            let maxVal =
              Math.max.apply(null, item.data[0].data).toFixed(1) == 0
                ? 1
                : Math.max.apply(null, item.data[0].data).toFixed(1);
            let minVal = Math.min.apply(null, item.data[0].data).toFixed(1);
            let maxVal2 =
              Math.max.apply(null, item.data[1].data).toFixed(1) == 0
                ? 1
                : Math.max.apply(null, item.data[1].data).toFixed(1);
            let minVal2 = Math.min.apply(null, item.data[1].data).toFixed(1);
            if (item.data[0].data != null && item.data[0].data.length) {
              item.time.forEach((el, index) => {
                firstListY.push({
                  name: this.getTime(Number(el)),
                  value: [
                    this.getTime(Number(el)),
                    item.data[0].data[index].toFixed(1),
                  ],
                });
              });
            } else {
              firstListY = this.portDataChange()[0];
            }
            if (item.data[1].data != null && item.data[1].data.length) {
              item.time.forEach((el, index) => {
                twoListD.push({
                  name: this.getTime(Number(el)),
                  value: [
                    this.getTime(Number(el)),
                    item.data[1].data[index].toFixed(1),
                  ],
                });
              });
            } else {
              twoListD = this.portDataChange()[1];
            }
            arr.push({
              color: ["#3678C8", "#36C3C8"],
              tooltip: {
                trigger: "axis",
              },
              title: {
                text: this.$t("vsr1000.delayeDpacketLoss"),
                x: "center",
                y: 15,
              },
              legend: {
                top: 15,
                right: "15%",
                data: [
                  {
                    name: this.$t("Monit.delayed"),
                    textStyle: {
                      fontSize: 14,
                      fontFamily: "arial, sans-serif",
                      fontWeight: "400",
                      color: "#333333",
                    },
                    // icon:"image://../../../../assets/newPage/upIcon.png"
                  },
                  {
                    name: this.$t("Monit.loss"),
                    textStyle: {
                      fontSize: 14,
                      fontFamily: "arial, sans-serif",
                      fontWeight: "400",
                      color: "#333333",
                    },
                  },
                ],
              },
              grid: {
                x: 40,
                y: 55,
                x2: 40,
                y2: 0,
                borderWidth: 1,
                height: "70%",
              },
              toolbox: {
                //图表可缩放配置 The diagram is scalable in configuration
                // The diagram is scalable in Configuration
                show: true,
                feature: {
                  dataZoom: {
                    yAxisIndex: "none",
                    title: {
                      zoom: this.$t("Home.zoom"),
                      back: this.$t("Home.reset"),
                    },
                  },
                },
                x: "left",
                x: "10",
              },
              xAxis: {
                type: "time",
                splitLine: {
                  show: false,
                },
              },
              yAxis: [
                {
                  name: "kbps",
                  min: minVal,
                  max: maxVal,
                  type: "value",
                  // boundaryGap: [0, "100%"],
                  splitLine: {
                    // show: false
                  },
                  //配置Y轴单位 Configure Y-axis units
                  // Configure Y-axis units. Configure Y-axis units
                  // axisLabel: {
                  //   // formatter:'{value}%'
                  // },
                  axisLine: {
                    // Y轴线...颜色 Y axis... color
                    // Y axis... Color Y axis... color
                    onZero: false,
                    // lineStyle:
                    // {
                    //     color:'#c490bf'
                    // },
                  },
                  splitNumber: 5,
                  interval: (maxVal - minVal) / 5,
                },
                {
                  min: minVal2,
                  max: maxVal2,
                  type: "value",
                  // boundaryGap: [0, "100%"],
                  splitLine: {
                    // show: false
                  },
                  axisLine: {
                    // Y轴线...颜色 Y axis... color
                    // Y axis... Color Y axis... color
                    onZero: false,
                    // lineStyle:
                    // {
                    //     color:'#c490bf'
                    // },
                  },
                  min: minVal2,
                  max: maxVal2,
                  splitNumber: 5,
                  interval: (maxVal2 - minVal2) / 5,
                },
              ],
              series: [
                {
                  name: this.$t("Monit.delayed"),
                  type: "line",
                  yAxisIndex: "1",
                  data: twoListD,
                  showSymbol: false,
                  hoverAnimation: false,
                  lineStyle: {
                    color: "#3678C8",
                  },
                  smooth: true,
                },
                {
                  name: this.$t("Monit.loss"),
                  type: "line",
                  data: firstListY,
                  showSymbol: false,
                  hoverAnimation: false,
                  lineStyle: {
                    color: "#36C3C8",
                  },
                  smooth: true,
                },
              ],
              position: item.position,
              isFavorite: item.isFavorite,
            });
          } else {
            arr.push(
              this.portDataChangeNoTime(
                mockArr,
                this.$t("vsr1000.delayeDpacketLoss"),
                item.position,
                item.isFavorite,
                this.$t("Monit.delayed"),
                this.$t("Monit.loss")
              )
            );
          }
        }
      });
      return arr;
    },
    //模拟数据 simulated data
    // Simulated data
    portDataChange() {
      // console.log(position,isFavorite)
      this.filterTime(
        new Date(this.startDate).getTime() / 1000,
        new Date(this.endDate).getTime() / 1000
      );
      let a = new Date(this.startDate).getTime();
      // let a = new Date(this.params.startDate) * 1;
      let indNum =
        (new Date(this.endDate).getTime() -
          new Date(this.startDate).getTime()) /
        1000 /
        this.interval;
      // let b = 86400000 / 24;
      let b =
        (new Date(this.endDate).getTime() -
          new Date(this.startDate).getTime()) /
        indNum;
      let data = [];
      for (var i = Math.floor(indNum); i >= 0; i--) {
        data.push({
          name: a + b * i,
          value: [0, 0],
        });
      }
      data[0] = {
        name: new Date(this.startDate).getTime(),
        value: [0, 0],
      };
      data[data.length - 1] = {
        name: new Date(this.endDate).getTime(),
        value: [0, 0],
      };
      let firstList = () => {
        let arr = [];
        data.forEach((item, index) => {
          arr.push({
            name: this.getTime(Number(item.name)),
            value: [this.getTime(Number(item.name)), item.value[0]],
          });
        });
        return arr;
      };
      let twoList = () => {
        let arr = [];
        data.forEach((item, index) => {
          arr.push({
            name: this.getTime(Number(item.name)),
            value: [this.getTime(Number(item.name)), item.value[1]],
          });
        });
        return arr;
      };
      return [firstList(), twoList()];
    },
    portDataChangeNoTime(
      mockArr,
      name,
      position,
      isFavorite,
      lineUp,
      lineDown
    ) {
      this.filterTime(
        new Date(this.params.startDate).getTime() / 1000,
        new Date(this.params.endDate).getTime() / 1000
      );
      let a = new Date(this.params.startDate).getTime();
      // let a = new Date(this.params.startDate) * 1;
      let indNum =
        (new Date(this.params.endDate).getTime() -
          new Date(this.params.startDate).getTime()) /
        1000 /
        this.interval;
      // let b = 86400000 / 24;
      let b =
        (new Date(this.params.endDate).getTime() -
          new Date(this.params.startDate).getTime()) /
        indNum;
      let data = [];
      if (mockArr.length) {
        data = mockArr.map((demo) => {
          return {
            name: demo,
            value: [0, 0],
          };
        });
      } else {
        for (var i = Math.floor(indNum); i >= 0; i--) {
          data.push({
            name: a + b * i,
            value: [0, 0],
          });
        }
        data[0] = {
          name: new Date(this.params.startDate).getTime(),
          value: [0, 0],
        };
        data[data.length - 1] = {
          name: new Date(this.params.endDate).getTime(),
          value: [0, 0],
        };
      }
      let firstList = () => {
        let arr = [];
        data.forEach((item, index) => {
          arr.push({
            name: this.getTime(Number(item.name)),
            value: [this.getTime(Number(item.name)), item.value[0]],
          });
        });
        return arr;
      };
      let twoList = () => {
        let arr = [];
        data.forEach((item, index) => {
          arr.push({
            name: this.getTime(Number(item.name)),
            value: [this.getTime(Number(item.name)), item.value[1]],
          });
        });
        return arr;
      };
      let options = {
        color: ["#3678C8", "#36C3C8"],
        tooltip: {
          trigger: "axis",
        },
        title: {
          text: name,
          x: "center",
          y: 15,
        },
        legend: {
          top: 15,
          right: "15%",
          data: [
            {
              name: lineUp,
              textStyle: {
                fontSize: 14,
                fontFamily: "arial, sans-serif",
                fontWeight: "400",
                color: "#333333",
              },
              // icon:"image://../../../../assets/newPage/upIcon.png"
            },
            {
              name: lineDown,
              textStyle: {
                fontSize: 14,
                fontFamily: "arial, sans-serif",
                fontWeight: "400",
                color: "#333333",
              },
            },
          ],
        },
        grid: {
          x: 40,
          y: 55,
          x2: 40,
          y2: 0,
          borderWidth: 1,
          height: "70%",
        },
        toolbox: {
          //图表可缩放配置 The diagram is scalable in configuration
          // The diagram is scalable in Configuration
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: "none",
              title: {
                zoom: this.$t("Home.zoom"),
                back: this.$t("Home.reset"),
              },
            },
          },
          x: "left",
          y: "10",
        },
        xAxis: {
          type: "time",
          splitLine: {
            show: false,
          },
        },
        yAxis: [
          {
            name: "kbps",
            min: "dataMin",
            max: "dataMax",
            type: "value",
            // boundaryGap: [0, "100%"],
            splitLine: {
              // show: false
            },
            //配置Y轴单位 Configure Y-axis units
            // Configure Y-axis units. Configure Y-axis units
            // axisLabel: {
            //   // formatter:'{value}%'
            // },
            axisLine: {
              onZero: false,
              // lineStyle:
              // {
              //     color:'#c490bf'
              // },
            },
          },
          {
            type: "value",
            // boundaryGap: [0, "100%"],
            splitLine: {
              // show: false
            },
            axisLine: {
              onZero: false,
              // lineStyle:
              // {
              //     color:'#c490bf'
              // },
            },
          },
        ],
        series: [
          {
            name: lineUp,
            type: "line",
            stack: this.$t("vsr1000.gross"),
            data: firstList(),
            lineStyle: {
              color: "#3678C8",
            },
            smooth: true,
          },
          {
            name: lineDown,
            type: "line",
            stack: this.$t("vsr1000.gross"),
            data: twoList(),
            lineStyle: {
              color: "#36C3C8",
            },
            smooth: true,
          },
        ],
        position: position,
        isFavorite: isFavorite,
      };
      return options;
    },
    //搜素功能 Search function
    // Search function
    querySearch(queryString, cb) {
      setTimeout(() => {
        let params = {
          deviceId: this.deviceId,
          deviceType: "0001",
          searchKey: queryString,
        };
        deviceTunnelNameCheck(params).then((res) => {
          cb(res.result);
        });
      }, 1000);
      // var restaurants = this.restaurants;
      // var results = restaurants.filter(this.createFilter(queryString));
      // 调用 callback 返回建议列表的数据
      // A callback call returns the data for the list of suggestions
      //A callback call returns the data for the list of Suggestions
    },

    handleSelect(item) {
      this.searchVal = item.name;
      this.params.tunnelName = item.name;
      this.params.startDate = this.getTime(this.timeVal[0]);
      this.params.endDate = this.getTime(this.timeVal[1]);
      this.params.page = 1;
      this.params.pageSize = 5;
      this.dataInit(this.params, "search");
    },
    //添加收藏夹 Add favorites
    // Add Favorites
    addGroup(type) {
      this.position = type;
      this.isShow = true;
    },
    //获取本日的时间段 Gets the time period of the day
    // Gets the time period of the day
    choseToday() {
      this.tabIndex = 1;
      // this.interval = "600";
      this.startDate = this.getTime(new Date()).split(" ")[0] + " 00:00:00";
      this.endDate = this.getTime(new Date());
      this.filterTime(
        new Date(this.startDate).getTime() / 1000,
        new Date(this.endDate).getTime() / 1000
      );
      this.params.timeGap = this.interval;
      this.params.startDate = this.startDate;
      this.params.endDate = this.endDate;
      this.params.page = 1;
      this.params.pageSize = 5;
      this.dataInit(this.params, "time");
    },
    //获取本周时间段 Get the time of the week
    // Get the time of the week
    choseWeek() {
      this.tabIndex = 2;
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
      this.endDate = this.getTime(Nowdate);
      this.filterTime(
        new Date(this.startDate).getTime() / 1000,
        new Date(this.endDate).getTime() / 1000
      );
      // this.interval = "1800";
      this.params.timeGap = this.interval;
      this.params.startDate = this.startDate;
      this.params.endDate = this.endDate;
      this.params.page = 1;
      this.params.pageSize = 5;
      this.dataInit(this.params, "time");
    },
    //获取本月时间段 Get the time period of the month
    // Get the time period of the month
    choseMounth() {
      this.tabIndex = 3;
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
      this.endDate = this.getTime(Nowdate);
      this.filterTime(
        new Date(this.startDate).getTime() / 1000,
        new Date(this.endDate).getTime() / 1000
      );
      // this.interval = "86400";
      this.params.timeGap = this.interval;
      this.params.startDate = this.startDate;
      this.params.endDate = this.endDate;
      this.params.page = 1;
      this.params.pageSize = 5;
      this.dataInit(this.params, "time");
    }, //时间设置 timeset
       // Time to set the timeset
    choseTime() {
      this.startDate = this.getTime(new Date(this.timeVal[0]));
      this.endDate = this.getTime(new Date(this.timeVal[1]));
      this.filterTime(
        new Date(this.startDate).getTime() / 1000,
        new Date(this.endDate).getTime() / 1000
      );
      this.params.timeGap = this.interval;
      this.params.startDate = this.startDate;
      this.params.endDate = this.endDate;
      this.params.deviceType =
        this.devType == "vsr1000"
          ? "0001"
          : this.devType == "vsr100"
          ? "0002"
          : this.devType == "Cloud-vsr1000"
          ? "000106"
          : this.devType == "vsr1100" 
          ? "0003"
          : "000206";
      this.params.page = 1;
      this.params.pageSize = 5;
      this.dataInit(this.params, "time");
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
        miao: miao,
      };
      let str = 0;
      Object.values(list).map((item) => {
        str += item;
      });
      return str;
    },
    filterTime(start, now) {
      let interval = now - start;
      //区间大于一个月的粒度为1天
      // The interval is greater than one month and the granularity is one day
      //The interval is greater than one month and the granularity is one day
      if (interval >= 2592000) {
        this.interval = "86400";
      }
      //区间大于一天小于一个月
      // The interval is greater than one day and less than one month
      //The interval is greater than one day and less than one month
      else if (interval < 2592000 && interval >= 86400) {
        this.interval = "1800";
      }
      //区间小于一天
      // Interval less than one day
      //Interval less than one day
      else if (interval < 86400) {
        this.interval = "600";
      }
    },
    finedMaxSize(val) {
      if (val === 0) return "b";
      let arr = ["b", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"];
      let a = 0;
      val = val / 8
      while (val >= 1024) {
        val = val / 1024;
        a += 1;
      }
      return arr[a];
    },
    changeMaxSize(val) {
      if (val === 0) return val;
      let arr = ["b", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"];
      let a = 0;
      val = val / 8
      while (arr.indexOf(this.maxUnit) > a) {
        val = val / 1024;
        a += 1;
      }
      return parseFloat(Number(val.toFixed(4)));
    },
    showPic(vpns) {
      userInfo().then(res => {
        this.params.userId = res.result.userId;
        this.vpnNames = vpns;
        this.startDate = this.getTime(new Date()).split(" ")[0] + " 00:00:00";
        this.endDate = this.getTime(new Date());
        this.params.clinetUserName = vpns;
        this.dataInit(this.params);
      });
    },
  },
  created() {
    /*this.startDate = this.getTime(new Date()).split(" ")[0] + " 00:00:00";
    this.endDate = this.getTime(new Date());
    this.dataInit(this.params);*/
    this.devType = JSON.parse(this.$route.query.devData).deviceType;
    this.lang = sessionStorage.getItem("lang");

  },
  mounted() {},
};
</script>
<style scoped lang="scss">
.linkMain {
  width: 100%;
  padding: 0px 0px 0px;
  .linkCon {
    width: 100%;
    border-radius: 7px;
    border: 1px solid rgba(235, 235, 235, 1);
  }
}
.linkTop {
  width: 100%;
  height: 58px;
  border-bottom: 1px solid #ebebeb;
  padding: 14px 18px;
  zoom: 1;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  .search {
    float: left;
    .searchBtn {
      width: 70px;
      height: 30px;
      background: rgba(54, 120, 200, 1);
      border-radius: 7px;
      border: 0;
      outline: none;
      cursor: pointer;
      margin-left: 10px;
      color: #fff;
    }
  }
  .time {
    float: right;
    display: flex;
    .tabs {
      line-height: 24px;
      li {
        float: left;
        font-size: 14px;
        font-family: arial, sans-serif;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        cursor: pointer;
        margin-right: 10px;
      }
      .active {
        color: rgba(54, 120, 200, 1);
        border-bottom: 1px solid rgba(54, 120, 200, 1);
      }
    }
  }
}

.chartsList {
  width: 100%;
  padding: 0 18px;
  .chartItem {
    width: 100%;
    height: 300px;
    border-radius: 7px;
    border: 1px solid rgba(235, 235, 235, 1);
    position: relative;
    margin-top: 20px;
    .chart {
      width: 100%;
      height: 100%;
    }
    .setGroup {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 70px;
      height: 24px;
      background: rgba(54, 120, 200, 1);
      border-radius: 7px;
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 20px;
      outline: none;
      border: 0;
      cursor: pointer;
      z-index: 100;
    }
    .setGroup:hover {
      background: #6095d6;
    }
    .setGroupEn {
      width: 120px;
    }
  }
  .title {
    padding-top: 16px;
    font-size: 16px;
    font-family: arial, sans-serif;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
  }
}
.dataMsg {
  line-height: 60px;
  text-align: center;
  color: #909399;
  font-size: 14px;
}
.loadingTit,
.noMoreTit {
  width: 100%;
  height: 40px;
  text-align: center;
  line-height: 40px;
}
</style>
<style lang="scss">
.linkMain .search {
  .el-input {
    width: 242px;
    height: 30px;
    .el-input__inner {
      height: 100%;
      border-radius: 7px;
    }
    .el-input__icon {
      line-height: 30px;
    }
  }
}
.linkMain .datePicker {
  position: relative;
  .el-icon-time {
    position: absolute;
    right: 10px;
    top: 5px;
    width: 14px;
    height: 14px;
  }
  .el-icon-time:before {
    display: block;
    width: 14px;
    height: 14px;
    background: url("../../../../../assets/homePage/home_icon_calendar@2x.png")
      no-repeat center;
    background-size: cover;
    content: "";
  }
}
</style>
