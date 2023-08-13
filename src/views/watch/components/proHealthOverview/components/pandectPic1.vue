<template>
  <div class="chartsMain">
    <div class="time">
      <ul class="tabs">
        <li @click="choseToday" :class="{active:tabIndex===1}">{{$t('vsr1000.today')}}</li>
        <li @click="choseWeek" :class="{active:tabIndex===2}">{{$t('vsr1000.week')}}</li>
        <li @click="choseMounth" :class="{active:tabIndex===3}">{{$t('vsr1000.month')}}</li>
      </ul>
      <el-date-picker
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
    </div>
    <div class="chartsList">
      <div class="chartItem">
        <button
          :class="`setGroup ${lang == 'en' ? 'setGroupEn' : ''}`"
          @click="addGroup(position.cpu)"
          v-control
        >{{$t('vsr1000.setGroup')}}</button>
        <div class="chart" id="chart1"></div>
      </div>
      <div class="chartItem">
        <button
          :class="`setGroup ${lang == 'en' ? 'setGroupEn' : ''}`"
          @click="addGroup(position.memory)"
          v-control
        >{{$t('vsr1000.setGroup')}}</button>
        <div class="chart" id="chart2"></div>
      </div>
      <div class="chartItem">
        <button
          :class="`setGroup ${lang == 'en' ? 'setGroupEn' : ''}`"
          @click="addGroup(position.totalFlow)"
          v-control
        >{{$t('vsr1000.setGroup')}}</button>
        <div class="chart" id="chart3"></div>
      </div>
      <div v-if="PortNetworkFlowData.length">
        <div class="chartItem" v-for="(item,index) in PortNetworkFlowData" :key="index">
          <button
            :class="`setGroup ${lang == 'en' ? 'setGroupEn' : ''}`"
            @click="addGroup(item.chartData.position)"
            v-control
          >{{$t('vsr1000.setGroup')}}</button>
          <portCharts :id="item.domId" :data="item.chartData" />
        </div>
      </div>
      <!-- <div class="chartItem" v-if="!PortNetworkFlowData.length">
        <button class="setGroup" @click="addGroup" v-control>设置分组</button>
        <portCharts :id="portOption.domId" :data="portOption" />
      </div>-->
    </div>
  </div>
</template>
<script>
import {
  deviceCpuLoadTimeChart,
  deviceMemoryLoadTimeChart,
  deviceNetworkFlowTotallyChart,
  devicePortNetworkFlowChart, userInfo,
} from "@/services";
import portCharts from "./portCharts";
export default {
  props: {},
  components: {
    portCharts,
  },
  data() {
    return {
      devData: {
        deviceId: JSON.parse(this.$route.query.devData).deviceId,
        deviceName: JSON.parse(this.$route.query.devData).deviceName,
        deviceType: JSON.parse(this.$route.query.devData).deviceType,
        tenantId: JSON.parse(this.$route.query.devData).tenantId,
        vsrSeries: JSON.parse(this.$route.query.devData).vsrSeries
      },
      //日期切换下标
      // Date switch subscript
      tabIndex: 1,
      //选择的日期
      // Selected date
      timeVal: [new Date(), new Date()],
      myChart1: null,
      myChart2: null,
      myChart3: null,
      myChart4: null,
      //position
      position: {
        cpu: "",
        memory: "",
        totalFlow: "",
      },
      //cpu图
      // CPU figure
      cpuData: [],
      //内存图
      // Memory map
      MemoryData: [],
      //实时流量图
      // Real-time flow diagram
      NetworkFlowTotallyData: [],
      //端口流量图
      // Port flow diagram
      PortNetworkFlowData: [],
      interval: "600",
      startDate: "",
      endDate: "",
      maxUnit: "", //流量单位,
                   // Flow unit,
      lang: "",
      userId:"",
    };
  },
  computed: {},
  methods: {
    chart1() {
      let dataArr = [];
      let dataChange = () => {
        let arr = [];
        // console.log(this.cpuData);
        this.cpuData.time.forEach((item, index) => {
          arr.push({
            name: this.getTime(Number(item)),
            value: [
              this.getTime(Number(item)),
              this.cpuData.data[0].data[index],
            ],
          });
        });
        return arr;
      };
      // console.log(dataChange());
      // 基于准备好的dom，初始化echarts实例
      // Initializes the echarts instance based on the prepared DOM
      this.myChart1 = this.$echarts.init(document.getElementById("chart1"));
      if (this.cpuData.time.length) {
        dataArr = dataChange();
      } else {
        //模拟数据
        // Simulated data
        dataArr = this.portData()[0];
      }
      let option = {
        color: ["#3678C8", "#36C3C8"],
        tooltip: {
          trigger: "axis",
        },
        title: {
          text: "CPU",
          x: "center",
          y: 10,
        },
        grid: {
          x: 40,
          y: 55,
          x2: 40,
          y2: 0,
          borderWidth: 1,
          height: "70%",
        },
        lineStyle: {
          color: "#3678C8", //改变折线颜色
                            // Change the polyline color
        },
        toolbox: {
          //图表可缩放配置
          // The diagram is scalable in configuration
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
          type: "value",
          max: 100,
          // boundaryGap: [0, "100%"],
          name: "100%",
          nameTextStyle: {
            padding: [0, 10, -5, 0], // 四个数字分别为上右下左与原位置距离
                                     // The four numbers are the distance between the top right bottom left and the original position
          },
        },
        // dataZoom: [
        //   {
        //     type: "inside" //详细配置可见echarts官网
        // Type: "Inside" can be found on echarts website
        //   }
        // ],
        series: [
          {
            name: "cpu",
            type: "line",
            data: dataArr,
            showSymbol: false,
            hoverAnimation: false,
            lineStyle: {
              color: "#3678C8",
            },
            smooth: true,
          },
        ],
      };
      this.myChart1.setOption(option);
      var _this = this;
      window.onresize = function () {
        _this.myChart1.resize();
      };
    },
    chart2() {
      // 基于准备好的dom，初始化echarts实例
      // Initializes the echarts instance based on the prepared DOM
      let dataArr = [];
      let dataChange = () => {
        let arr = [];
        this.MemoryData.time.forEach((item, index) => {
          arr.push({
            name: this.getTime(Number(item)),
            value: [
              this.getTime(Number(item)),
              this.MemoryData.data[0].data[index],
            ],
          });
        });
        return arr;
      };
      this.myChart2 = this.$echarts.init(document.getElementById("chart2"));
      if (this.MemoryData.time.length) {
        dataArr = dataChange();
      } else {
        //模拟数据
        // Simulated data
        dataArr = this.portData()[0];
      }
      let option = {
        color: ["#3678C8", "#36C3C8"],
        tooltip: {
          trigger: "axis",
        },
        title: {
          text: this.$t("vsr1000.memory"),
          x: "center",
          y: 10,
        },
        grid: {
          x: 40,
          y: 55,
          x2: 40,
          y2: 0,
          borderWidth: 1,
          height: "70%",
        },
        lineStyle: {
          color: "#3678C8", //改变折线颜色
                            // Change the polyline color
        },
        toolbox: {
          //图表可缩放配置
          // The diagram is scalable in configuration
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
          type: "value",
          max: 100,
          // boundaryGap: [0, "100%"],
          name: "100%",
          nameTextStyle: {
            padding: [0, 10, -5, 0], // 四个数字分别为上右下左与原位置距离
                                     // The four numbers are the distance between the top right bottom left and the original position
          },
        },
        series: {
          name: this.$t("vsr1000.memory"),
          type: "line",
          data: dataArr,
          showSymbol: false,
          hoverAnimation: false,
          lineStyle: {
            color: "#3678C8",
          },
          smooth: true,
        },
      };
      this.myChart2.setOption(option);
      var _this = this;
      window.onresize = function () {
        _this.myChart2.resize();
      };
    },
    chart3() {
      // 基于准备好的dom，初始化echarts实例
      // Initializes the echarts instance based on the prepared DOM
      let Xlist = [];
      let Ylist = [];
      let Yname;
      let maxNum = Math.max(...this.NetworkFlowTotallyData.data[0].data);
      this.maxUnit = this.finedMaxSize(maxNum);
      Yname = this.maxUnit + "ps";
      let firstList = () => {
        let arr = [];
        this.NetworkFlowTotallyData.time.forEach((item, index) => {
          arr.push({
            name: this.getTime(Number(item)),
            value: [
              this.getTime(Number(item)),
              this.changeMaxSize(
                this.NetworkFlowTotallyData.data[0].data[index]
              ),
            ],
          });
        });
        return arr;
      };

      let twoList = () => {
        let arr = [];
        this.NetworkFlowTotallyData.time.forEach((item, index) => {
          arr.push({
            name: this.getTime(Number(item)),
            value: [
              this.getTime(Number(item)),
              this.changeMaxSize(
                this.NetworkFlowTotallyData.data[1].data[index]
              ),
            ],
          });
        });
        return arr;
      };
      this.myChart3 = this.$echarts.init(document.getElementById("chart3"));
      if (this.NetworkFlowTotallyData.time.length) {
        Xlist = firstList();
        Ylist = twoList();
      } else {
        //模拟数据
        // Simulated data
        Xlist = this.portData()[0];
        Ylist = this.portData()[1];
      }
      let option = {
        color: ["#3678C8", "#36C3C8"],
        tooltip: {
          trigger: "axis",
        },
        title: {
          text: this.$t("vsr1000.realTimeAllFlow"),
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
          //图表可缩放配置
          // The diagram is scalable in configuration
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
            // min: 0, //就是这两个 最小值
            // Min: 0, those are the two minimum values
            // max: maxArr()[0], //最大值
            // Max: maxArr()[0], maximum
            min: "dataMin",
            max: "dataMax",
            // interval:Math.ceil((maxArr()[0]) / 5),
            type: "value",
            name: Yname,
            nameTextStyle: {
              padding: [0, 10, -10, 0], // 四个数字分别为上右下左与原位置距离
                                        // The four numbers are the distance between the top right bottom left and the original position
            },
            splitLine: {
              show: true,
            },
          },
        ],
        series: [
          {
            name: this.$t("vsr1000.up"),
            type: "line",
            data: Xlist,
            lineStyle: {
              color: "#3678C8",
            },
            smooth: true,
          },
          {
            name: this.$t("vsr1000.down"),
            type: "line",
            data: Ylist,
            lineStyle: {
              color: "#36C3C8",
            },
            smooth: true,
          },
        ],
      };
      this.myChart3.setOption(option);
      var _this = this;
      window.onresize = function () {
        _this.myChart3.resize();
      };
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
    }, // 是每一个数据换算到最大单位
       // Is each data conversion to the maximum unit
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
    filterTime(start, now) {
      let interval = now - start;
      //区间大于一个月的粒度为1天
      // The interval is greater than one month and the granularity is one day
      if (interval >= 2592000) {
        this.interval = "86400";
      }
      //区间大于一天小于一个月
      // The interval is greater than one day and less than one month
      else if (interval < 2592000 && interval >= 86400) {
        this.interval = "1800";
      }
      //区间小于一天
      // Interval less than one day
      else if (interval < 86400) {
        this.interval = "600";
      }
    },
    choseToday() {
      this.tabIndex = 1;
      // this.interval = "600";
      this.startDate = this.getTime(new Date()).split(" ")[0] + " 00:00:00";
      this.endDate = this.getTime(new Date());
      this.filterTime(
        new Date(this.startDate).getTime() / 1000,
        new Date(this.endDate).getTime() / 1000
      );
      let params = {
        deviceId: this.devData.deviceId,
        deviceType:
          this.devData.deviceType == "vsr1000"
            ? "0001"
            : this.devData.deviceType == "vsr100"
            ? "0002"
            : this.devData.deviceType == "Cloud-vsr1000"
            ? "000106"
            : "000206",
        userId: this.userId,
        timeGap: this.interval,
        startDate: this.startDate,
        endDate: this.endDate,
      };
      this.dataInit(params);
    },
    //获取本周时间段
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
      let params = {
        deviceId: this.devData.deviceId,
        deviceType:
          this.devData.deviceType == "vsr1000"
            ? "0001"
            : this.devData.deviceType == "vsr100"
            ? "0002"
            : this.devData.deviceType == "Cloud-vsr1000"
            ? "000106"
            : "000206",
        userId: this.userId,
        timeGap: this.interval,
        startDate: this.startDate,
        endDate: this.endDate,
      };
      this.dataInit(params);
    },
    //获取本月时间段
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
      let params = {
        deviceId: this.devData.deviceId,
        deviceType:
          this.devData.deviceType == "vsr1000"
            ? "0001"
            : this.devData.deviceType == "vsr100"
            ? "0002"
            : this.devData.deviceType == "Cloud-vsr1000"
            ? "000106"
            : "000206",
        userId: this.userId,
        timeGap: this.interval,
        startDate: this.startDate,
        endDate: this.endDate,
      };
      this.dataInit(params);
    },
    //时间设置
    // Set the time
    choseTime() {
      let start = this.numberTime(new Date(this.timeVal[0]));
      let end = this.numberTime(new Date(this.timeVal[1]));
      this.startDate = this.getTime(new Date(this.timeVal[0]));
      this.endDate = this.getTime(new Date(this.timeVal[1]));
      this.filterTime(
        new Date(this.startDate).getTime() / 1000,
        new Date(this.endDate).getTime() / 1000
      );
      let params = {
        deviceId: this.devData.deviceId,
        deviceType:
          this.devData.deviceType == "vsr1000"
            ? "0001"
            : this.devData.deviceType == "vsr100"
            ? "0002"
            : this.devData.deviceType == "Cloud-vsr1000"
            ? "000106"
            : "000206",
        userId: this.userId,
        timeGap: this.interval,
        startDate: this.startDate,
        endDate: this.endDate,
      };
      this.dataInit(params);
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
    //时间格式转换
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
    //图表数据获取
    // Chart data acquisition
    async dataInit(params) {
      //cpu图
      // CPU figure
      let cpuData = await deviceCpuLoadTimeChart(params);
      //内存图
      // Memory map
      let MemoryData = await deviceMemoryLoadTimeChart(params);
      //实时流量图
      // Real-time flow diagram
      let NetworkFlowTotallyData = await deviceNetworkFlowTotallyChart(params);
      //端口流量图
      // Port flow diagram
      let PortNetworkFlowData = await devicePortNetworkFlowChart(params);
      this.cpuData = cpuData.result;
      this.MemoryData = MemoryData.result;
      this.NetworkFlowTotallyData = NetworkFlowTotallyData.result;
      this.PortNetworkFlowData = PortNetworkFlowData.result;
      this.position = {
        cpu: cpuData.result["position"],
        memory: MemoryData.result["position"],
        totalFlow: NetworkFlowTotallyData.result["position"],
      };
      this.portChartsInit();
    },
    //端口流量图表数据设置
    // Port flow chart data Settings
    portChartsInit() {
      let Yname;
      let changePortData = (item) => {
        let maxNum = Math.max(...item.data[0].data);
        this.maxUnit = this.finedMaxSize(maxNum);
        Yname = this.maxUnit + "ps";
        let firstList = () => {
          let arr = [];
          item.time.forEach((el, index) => {
            arr.push({
              name: this.getTime(Number(el)),
              value: [
                this.getTime(Number(el)),
                this.changeMaxSize(item.data[0].data[index]),
              ],
            });
          });
          return arr;
        };
        let twoList = () => {
          let arr = [];
          item.time.forEach((el, index) => {
            arr.push({
              name: this.getTime(Number(el)),
              value: [
                this.getTime(Number(el)),
                this.changeMaxSize(item.data[1].data[index]),
              ],
            });
          });
          return arr;
        };
        var option = {
          color: ["#3678C8", "#36C3C8"],
          tooltip: {
            trigger: "axis",
          },
          title: {
            text: this.$t("vsr1000.port") + item.name + this.$t("vsr1000.flow"),
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
            //图表可缩放配置
            // The diagram is scalable in configuration
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
            // min: "dataMin", //就是这两个 最小值
            // Min: "dataMin", those are the two minimum values
            // max: "dataMax", //最大值
            // Max: "dataMax", maximum
            name: Yname,
            nameTextStyle: {
              padding: [0, 10, -10, 0], // 四个数字分别为上右下左与原位置距离
                                        // The four numbers are the distance between the top right bottom left and the original position
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
              data: firstList(),
              lineStyle: {
                color: "#3678C8",
              },
              smooth: true,
            },
            {
              name: this.$t("vsr1000.down"),
              type: "line",
              data: twoList(),
              lineStyle: {
                color: "#36C3C8",
              },
              smooth: true,
            },
          ],
          position: item.position,
        };
        return option;
      };
      let arr = [];
      let mockArr = [];
      this.PortNetworkFlowData.forEach((item, index) => {
        if (item.time.length) {
          arr.push({
            chartData: changePortData(item),
            domId: `charts${index + 2}`,
          });
          mockArr = item.time;
        } else {
          arr.push({
            chartData: this.portDataChange(
              `${
                this.$t("vsr1000.port") + item.name + this.$t("vsr1000.flow")
              }`,
              mockArr,
              item
            ),
            domId: `chartsNotime${index}`,
          });
        }
      });
      this.PortNetworkFlowData = arr;
    },
    addGroup(type) {
      // console.log(type, "123123");
      this.$parent.type = type;
      this.$parent.isShow = true;
    },
    chartsInit() {
      var _this = this;
      _this.chart1();
      _this.chart2();
      _this.chart3();
      // this.chart4();
      setTimeout(() => {
        _this.myChart1.resize();
        _this.myChart2.resize();
        _this.myChart3.resize();
        // this.myChart4.resize();
      }, 100);
    },
    //模拟数据
    // Simulated data
    portData() {
      // console.log(position,isFavorite)
      // console.log(
      //   this.startDate,
      //   this.endDate,
      //   new Date(this.endDate).getTime() - new Date(this.startDate).getTime()
      // );
      this.filterTime(
        new Date(this.startDate).getTime() / 1000,
        new Date(this.endDate).getTime() / 1000
      );
      let a = new Date(this.startDate).getTime();
      let indNum =
        (new Date(this.endDate).getTime() -
          new Date(this.startDate).getTime()) /
        1000 /
        this.interval;
      let b =
        (new Date(this.endDate).getTime() -
          new Date(this.startDate).getTime()) /
        indNum;
      // console.log(a, indNum, b, this.interval);
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
    //模拟数据
    // Simulated data
    portDataChange(Dname, mockArr, el) {
      // console.log(this.startDate, this.endDate);
      this.filterTime(
        new Date(this.startDate).getTime() / 1000,
        new Date(this.endDate).getTime() / 1000
      );
      let a = new Date(this.startDate).getTime();
      let indNum =
        (new Date(this.endDate).getTime() -
          new Date(this.startDate).getTime()) /
        1000 /
        this.interval;
      let b =
        (new Date(this.endDate).getTime() -
          new Date(this.startDate).getTime()) /
        indNum;
      // console.log(a, indNum, b);
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
          name: new Date(this.startDate).getTime(),
          value: [0, 0],
        };
        data[data.length - 1] = {
          name: new Date(this.endDate).getTime(),
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
          text: Dname,
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
          //图表可缩放配置
          // The diagram is scalable in configuration
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
          type: "value",
          // boundaryGap: [0, "100%"],
          name: "kbps",
          nameTextStyle: {
            padding: [0, 10, -10, 0], // 四个数字分别为上右下左与原位置距离
                                      // The four numbers are the distance between the top right bottom left and the original position
          },
          splitLine: {
            // show: false
          },
        },
        series: [
          {
            name: this.$t("vsr1000.up"),
            type: "line",
            data: firstList(),
            lineStyle: {
              color: "#3678C8",
            },
            smooth: true,
          },
          {
            name: this.$t("vsr1000.down"),
            type: "line",
            data: twoList(),
            lineStyle: {
              color: "#36C3C8",
            },
            smooth: true,
          },
        ],
        domId: `charts${parseInt((Math.random() + 1) * Math.pow(10, 5 - 1))}`,
        position: el.position,
      };
      return options;
    },
  },
  created() {
    userInfo().then(res => {
      this.userId = res.result.userId;
      let params = {
        deviceId: this.devData.deviceId,
        deviceType:
            this.devData.deviceType == "vsr1000"
                ? "0001"
                : this.devData.deviceType == "vsr100"
                ? "0002"
                : this.devData.deviceType == "Cloud-vsr1000"
                    ? "000106"
                    : "000206",
        userId: this.userId,
        timeGap: this.interval,
        startDate: this.getTime(new Date()).split(" ")[0] + " 00:00:00",
        endDate: this.getTime(new Date()),
      };
      this.startDate = this.getTime(new Date()).split(" ")[0] + " 00:00:00";
      this.endDate = this.getTime(new Date());
      this.dataInit(params);
    });

    // this.portDataChange();
    this.lang = sessionStorage.getItem("lang");
  },

  mounted() {
    // this.chartsInit();
  },
  watch: {
    cpuData: {
      handler(newValue, oldValue) {
        this.chartsInit();
      },
      deep: true,
    },
    MemoryData: {
      handler(newValue, oldValue) {
        this.chartsInit();
      },
      deep: true,
    },
    NetworkFlowTotallyData: {
      handler(newValue, oldValue) {
        this.chartsInit();
      },
      deep: true,
    },
    PortNetworkFlowData: {
      handler(newValue, oldValue) {
        this.PortNetworkFlowData = newValue;
      },
      deep: true,
    },
  },
};
</script>
<style scoped lang="scss">
.chartsMain {
  width: 100%;
  overflow: auto;
}
.time {
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
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
.chartsList {
  width: 100%;
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
}
</style>
<style lang="scss">
.chartsMain {
  .datePicker {
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
}
</style>