<template>
  <div class="devChartMain" :style="chartData.length==0?'border:none':'border:1px solid rgba(235, 235, 235, 1)'">
    <!-- <el-carousel arrow="always" :autoplay="false">
      <el-carousel-item v-for="item in 4" :key="item">
        <ul class="deviceList">
          <li>设备设备设备设备…</li>
          <li>设备设备设备设备…</li>
          <li>设备设备设备设备…</li>
          <li>设备设备设备设备…</li>
          <li>设备设备设备设备…</li>
          <li>设备设备设备设备…</li>
          <li>设备设备设备设备…</li>
          <li>设备设备设备设备…</li>
          <li>设备设备设备设备…</li>
          <li>设备设备设备设备…</li>
          <li>设备设备设备设备…</li>
          <li>设备设备设备设备…</li>
        </ul>
      </el-carousel-item>
    </el-carousel>-->
    <noInfo v-if="code==0"></noInfo>
    <Remove ref="removeItem" v-show="delFlag"></Remove>
    <RemoveGroup ref="removeGroup" v-show="delFlagGroup"></RemoveGroup>
    <div class="devWMain">
      <div class="picker" v-if="chartData.length>0">
        <div class="default">
          <b v-show="groupShow==false">
            <span>{{pageGroup}}</span>
            <i @click="nameGroup">
              <img src="@/assets/newPage/monitoring_icon_modify @2x.png" alt />
            </i>
          </b>
          <input
            type="text"
            class="edit"
            v-model="pageGroup"
            v-show="groupShow"
            @keydown.enter="editGroup"
            maxlength="10"
            @blur="editGroup"
          />
        </div>
        <div class="oper">
          <ul class="tabs">
            <li @click="choseToday" :class="{active:tabIndex===1}">{{$t('Monit.today')}}</li>
            <li @click="choseWeek" :class="{active:tabIndex===2}">{{$t('Monit.week')}}</li>
            <li @click="choseMounth" :class="{active:tabIndex===3}">{{$t('Monit.month')}}</li>
          </ul>
          <el-date-picker
            v-model="timeVal"
            size="mini"
            type="datetimerange"
            range-separator="-"
            @change="choseTime"
            :start-placeholder="$t('Monit.startDate')"
            :end-placeholder="$t('Monit.endData')"
          ></el-date-picker>
          <i class="close" @click="delGroupShow">
            <img src="@/assets/newPage/monitoring_icon_delete@2x.png" alt />
          </i>
        </div>
      </div>
      <div v-for="(item,index) in chartData" :key="index">
        <div class="watchSet">
          <dl class="hint">
            <dt v-if="item.deviceType=='0001'">
              VSR
              <br />1000
              <!-- {{item.deviceName}} -->
            </dt>
            <dt v-if="item.deviceType=='0002'">
              VSR
              <br />100
              <!-- {{item.deviceName}} -->
            </dt>
            <dd>
              <p class="devName">
                <span>{{item.deviceName}}</span>
                <span>{{item.deviceSeries}}</span>
                <span class="msg" id="online" v-if="item.online==true">
                  <i></i>{{$t('Monit.online')}}
                </span>
                <span class="msg" v-else>
                  <i></i>{{$t('Monit.offline')}}
                </span>
              </p>
              <p class="devTime">
                <span>{{$t('Monit.startTime')}}：{{item.startTime}}</span>
                <span>{{$t('Monit.onlineTime')}}：{{item.keepTime}}</span>
              </p>
            </dd>
          </dl>
        </div>
        <div class="chartCon" v-for="(n,i) in item.chartArr" :key="i">
          <div class="chartitem">
            <button @click="delItem(n.position,n.name,item.deviceSeries)">{{$t('Monit.delGroup')}}</button>
            <charts :id="`${item.deviceSeries+n.position}`" :data="n.arr[0]"></charts>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { favoriteDel, changeFavorite, removeFavoriteChart } from "@/services";
import charts from "./charts.vue";
import noInfo from "./noInfo.vue";
import Remove from "./remove";
import RemoveGroup from "./removeGroup";
export default {
  props: {},
  components: { charts, noInfo, Remove, RemoveGroup },
  data() {
    return {
      code:'',
      favoriteId: "",
      chartData: [],
      pageGroup: "",
      groupShow: false,
      timeVal: [new Date(), new Date()],
      tabIndex: 1,
      delFlag: false,
      delFlagGroup: false,
      interval: "",
      maxUnit:'b',
    };
  },
  computed: {},
  methods: {
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
        "/" +
        list2[1] +
        "/" +
        list2[2] +
        " " +
        list2[3] +
        ":" +
        list2[4] +
        ":" +
        list2[5];
      return needTime;
    },
    secondsFormat(s) {
      var day = Math.floor(s / (24 * 3600)); // Math.floor()向下取整
                                             // Math.floor() is rounded down
      var hour = Math.floor((s - day * 24 * 3600) / 3600);
      var minute = Math.floor((s - day * 24 * 3600 - hour * 3600) / 60);
      var second = s - day * 24 * 3600 - hour * 3600 - minute * 60;
      return day + this.$t("vsr1000.Days") + hour + this.$t("vsr1000.Hours") + minute + this.$t("vsr1000.Minutes") + second + this.$t("vsr1000.Seconds");
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
    choseTime() {
      let start = this.numberTime(new Date(this.timeVal[0]));
      let end = this.numberTime(new Date(this.timeVal[1]));
      this.$parent.startDate = this.needTime(new Date(this.timeVal[0]));
      this.$parent.endDate = this.needTime(new Date(this.timeVal[1]));
      this.filterTime(start, end);
      this.$parent.interval = this.interval;
      this.$parent.chose(this.$parent.value);
      // console.log(start,end)
    },
    choseToday() {
      this.tabIndex = 1;
      this.$parent.interval = "600";
      this.$parent.startDate =
        this.needTime(new Date()).split(" ")[0] + " 00:00:00";
      this.$parent.endDate = this.needTime(new Date());
      this.$parent.chose(this.$parent.value);
    },
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
      this.$parent.startDate = showWeekFirstDay() + " 00:00:00";
      this.$parent.endDate = this.needTime(Nowdate);
      this.$parent.interval = "1800";
      this.$parent.chose(this.$parent.value);
    },
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
      this.$parent.startDate = showMonthFirstDay() + " 00:00:00";
      this.$parent.endDate = this.needTime(Nowdate);
      this.$parent.interval = "86400";
      this.$parent.chose(this.$parent.value);
    },
    delGroup() {
      //删除整个分组
      // Delete the entire group
      favoriteDel({ favoriteId: this.favoriteId }).then(res => {
        if (res.code == 10000) {
          this.$message({
            message: this.$t('Monit.hint7'),
            type: "success"
          });
          this.delFlagGroup = false;
          this.chartData = [];
        }
      });
    },
    delGroupShow() {
      //删除整个分组
      // Delete the entire group
      this.delFlagGroup = true;
      this.$refs.removeGroup.favoriteId = this.favoriteId;
    },
    delItemAfter() {
      this.$parent.chose(this.$parent.value);
    },
    delItem(position, name, deviceSeries) {
      //删除收藏夹单个图表
      // Delete favorites single chart
      this.delFlag = true;
      this.$refs.removeItem.favoriteId = this.favoriteId;
      this.$refs.removeItem.position = position;
      this.$refs.removeItem.name = name;
      this.$refs.removeItem.deviceSerialNumber = deviceSeries;
      
    },
    getChart() {
      let data = [];
      let chartArr = this.chartData;
      chartArr.map(item => {
        data.push({
          online: item.online ,
          deviceType: item.deviceType,
          deviceName: item.deviceName,
          deviceSeries: item.deviceSeries,
          keepTime: this.secondsFormat(item.keepTime),
          startTime: this.getTime(item.startTime),
          chartArr: this.formatEchartsData(item.data)
        });
      });
      this.chartData = data;
      // console.log(data)
    },
    //转换后台返回时间戳
    // Transform the background return timestamp
    formatDate(inputTime) {
      //从后台获取的时间戳是毫秒数的，所以得乘以1000，注意有时候获取到的是已经乘了1000的
      // The timestamp retrieved from the background is in milliseconds, so you have to multiply it by 1000. Note that sometimes you get a timestamp that is already multiplied by 1000
      var time = parseInt(inputTime);
      var date = new Date(time);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var s = date.getMinutes();
      s = s < 10 ? "0" + s : s;
      var str = y + "-" + m + "-" + d + " " + h + ":" + s;
      return str;
    },
    //模拟数据
    // Simulated data
    portDataChange(nameD, position, isFavorite) {
      this.filterTime(
        new Date(this.$parent.startDate).getTime()/1000,
        new Date(this.$parent.endDate).getTime()/1000
      );
      let a = new Date(this.$parent.startDate).getTime();
      // let a = new Date(this.$parent.startDate)*1;
      let indNum =
        (new Date(this.$parent.endDate).getTime() -
          new Date(this.$parent.startDate).getTime()) /
        1000 /
        this.interval;
      let b =
        (new Date(this.$parent.endDate).getTime() -
          new Date(this.$parent.startDate).getTime()) /
        indNum;
        console.log(a,indNum,b)
      // let b = 86400000 / 24;
      let data = [];
     for (var i = Math.floor(indNum); i >= 0; i--) {
          data.push({
            name: a + b * i,
            value: [0, 0],
          });
        }
        data[0] = {
          name: new Date(this.$parent.startDate).getTime(),
          value: [0, 0],
        };
        data[data.length - 1] = {
          name: new Date(this.$parent.endDate).getTime(),
          value: [0, 0],
        };
      let firstList = () => {
        let arr = [];
        data.forEach((item, index) => {
          arr.push({
            name: this.needTime(Number(item.name)),
            value: [this.needTime(Number(item.name)), item.value[0]]
          });
        });
        return arr;
      };
      let twoList = () => {
        let arr = [];
        data.forEach((item, index) => {
          arr.push({
            name: this.needTime(Number(item.name)),
            value: [this.needTime(Number(item.name)), item.value[1]]
          });
        });
        return arr;
      };
      let options = [firstList(), twoList()];
      return options;
    },
    formatEchartsData99999(data) {
      let arr = [];
      data.forEach(item => {
        let n = item.data.length;
        let legend = {};
        let series = [];
        let name = "";
        let max = ""
        let yName = ""
        if (item.name == "cpu") {
          name = "CPU";
          yName = "%"
        } else if (item.name == "memory") {
          name = "内存";
          yName = "%"
        } else if (item.name == "totalFlow") {
          name = "流量";
          yName = this.maxUnit
        } else {
          name = "物理端口" + item.name;
          yName = this.maxUnit
        }
        if(name=='CPU'||name=='内存'){
          max = 100
        }else{
          max = "dataMax"
        }
        let time = item.time;
        let val = item.data;
        var firstList = [];
        var twoList = [];
        var optTime = []
        if (time.length) {
          if (n > 1) {
            if (val[0].data.length) {
              for (let i in time) {
                firstList.push(this.changeMaxSize(item.data[0].data[i]));
                optTime.push(this.formatDate(time[i]).split(' ')[1])
              }
            } else {
              firstList = this.portDataChange(
                name,
                item.position,
                item.isFavorite
              )[0];
            }
            if (val[1].data.length) {
              for (let i in time) {
                twoList.push(this.changeMaxSize(item.data[1].data[i]));
              }
            } else {
              twoList = this.portDataChange(
                name,
                item.position,
                item.isFavorite
              )[1];
            }
          } else {
            if (val[0].data.length) {

              for (let i in time) {
                firstList.push(item.data[0].data[i]);
                optTime.push(this.formatDate(time[i]).split(' ')[1])
              }
            } else {
              firstList = this.portDataChange(
                name,
                item.position,
                item.isFavorite
              )[0];
            }
          }
        } else {
          if (n > 1) {
            firstList = this.portDataChange(
              name,
              item.position,
              item.isFavorite
            )[0];
            twoList = this.portDataChange(
              name,
              item.position,
              item.isFavorite
            )[1];
          } else {
            firstList = this.portDataChange(
              name,
              item.position,
              item.isFavorite
            )[0];
          }
        }
        n > 1
          ? (series = [
              {
                name: this.$t('Monit.upstream'),
                type: "line",
                data: firstList,
                yAxisIndex : '0',
                lineStyle: {
                  color: "#3678C8"
                },
              },
              {
                name: this.$t('Monit.downstream'),
                type: "line",
                data: twoList,
                lineStyle: {
                  color: "#36C3C8"
                },
                smooth: true
              }
            ])
          : (series = [
              {
                name: name=='CPU'?'CPU':'内存',
                type: "line",
                data: firstList,
                yAxisIndex : '1',
                lineStyle: {
                  color: "#3678C8"
                },
                smooth: true
              }
            ]);
        arr.push({
          name: name,
          position: item.position,
          arr: [
            {
              color: ["#3678C8", "#36C3C8"],
              tooltip: {
                trigger: "axis",
                formatter:function(params)  
                  {  
                    var relVal = params[0].name;  
                    for (var i = 0, l = params.length; i < l; i++) {  
                          relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value+yName;  
                      }  
                    return relVal;  
                  } 
              },
              title: {
                text: name,
                x: "center",
                y: 15
              },
              legend: {
                top: 15,
                right: "15%",
              },
              grid: {
                x: 30,
                y: 55,
                x2: 20,
                y2: 0,
                borderWidth: 1,
                height: "70%"
              },
              toolbox: {
                //图表可缩放配置
                // The diagram is scalable in configuration
                show: true,
                feature: {
                  dataZoom: {
          　　　　　 yAxisIndex:"none"
                  }
                },
                x: "left",
                x: "10"
              },
              xAxis: {
                type: "category",
                boundaryGap: false,
                data:optTime
              },
              yAxis: [
                {
                  nameTextStyle: {
                    padding: [0, 10, -5, 0] // 四个数字分别为上右下左与原位置距离
                                            // The four numbers are the distance between the top right bottom left and the original position
                  },
                  name: yName,
                  type: "value",
                  min: 0, //就是这两个 最小值
                          // Those are the two minimum values
                  // max:'dataMax', //最大值
                  // Max: dataMax, maximum
                  max:max,
                  boundaryGap: [0, "100%"],
                  splitLine: {
                    // show: false
                  },
                }
              ],
              series: series
            }
          ]
        });
      });
      return arr;
    },
    formatEchartsData(data) {
      let arr = [];
      data.forEach(item => {
        let n = item.data.length;
        let legend = {};
        let series = [];
        let name = "";
        let max = ""
        let yName = ""
        if (item.name == "cpu") {
          name = "CPU";
          yName = "%"
        } else if (item.name == "memory") {
          name = this.$t('vsr1000.memory');
          yName = "%"
        } else if (item.name == "totalFlow") {
          name = this.$t('Monit.flow');
          yName = this.maxUnit+'ps'
        } else {
          name = this.$t('vsr1000.physicalPort') + ' '+ item.name;
          yName = this.maxUnit+'ps'
        }
        if(name=='CPU'||name=='内存'||name=='Memory'){
          max = 100
        }else{
          max = "dataMax"
        }
        let time = item.time;
        let val = item.data;
        var firstList = [];
        var twoList = [];
        
        if (time.length) {
          if (n > 1) {
            if (val[0].data.length) {
              let ppp = Math.max(...item.data[0].data)
              this.maxUnit = this.finedMaxSize(ppp)
              // console.log(ppp,this.maxUnit,"上行")
              // The console. The log (PPP, enclosing maxUnit, "upward")
              yName = this.maxUnit+'ps'
              for (let i in time) {
                firstList.push({
                  name: this.formatDate(time[i]),
                  value: [this.formatDate(time[i]), this.changeMaxSize(item.data[0].data[i])]
                });
              }
            } else {
              firstList = this.portDataChange(
                name,
                item.position,
                item.isFavorite
              )[0];
            }
            if (val[1].data.length) {
              for (let i in time) {
                twoList.push({
                  name: this.formatDate(time[i]),
                  value: [this.formatDate(time[i]), this.changeMaxSize(item.data[1].data[i])]
                });
              }
            } else {
              twoList = this.portDataChange(
                name,
                item.position,
                item.isFavorite
              )[1];
            }
          } else {
            if (val[0].data.length) {
              for (let i in time) {
                firstList.push({
                  name: this.formatDate(time[i]),
                  value: [this.formatDate(time[i]), item.data[0].data[i]]
                });
              }
            } else {
              firstList = this.portDataChange(
                name,
                item.position,
                item.isFavorite
              )[0];
            }
          }
        } else {
          if (n > 1) {
            firstList = this.portDataChange(
              name,
              item.position,
              item.isFavorite
            )[0];
            twoList = this.portDataChange(
              name,
              item.position,
              item.isFavorite
            )[1];
          } else {
            firstList = this.portDataChange(
              name,
              item.position,
              item.isFavorite
            )[0];
          }
        }
        n > 1
          ? (series = [
              {
                name: this.$t('Monit.upstream'),
                type: "line",
                data: firstList,
                lineStyle: {
                  color: "#3678C8"
                },
                smooth: true
              },
              {
                name: this.$t('Monit.downstream'),
                type: "line",
                data: twoList,
                lineStyle: {
                  color: "#36C3C8"
                },
                smooth: true
              }
            ])
          : (series = [
              {
                name: name=='CPU'?'CPU':'内存',
                type: "line",
                data: firstList,
                showSymbol: false,
                hoverAnimation: false,
                lineStyle: {
                  color: "#3678C8"
                },
                smooth: true
              }
            ]);
        arr.push({
          name: name,
          position: item.position,
          arr: [
            {
              color: ["#3678C8", "#36C3C8"],
              tooltip: {
                trigger: "axis",
                // formatter:function(params)  
                //   {  
                //     var relVal = params[0].name;  
                //     for (var i = 0, l = params.length; i < l; i++) {  
                //           relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value[1]+yName;  
                //       }  
                //     return relVal;  
                //   } 
              },
              title: {
                text: name,
                x: "center",
                y: 15
              },
              legend: {
                top: 15,
                right: "15%",
              },
              grid: {
                x: 50,
                y: 55,
                x2: 20,
                y2: 0,
                borderWidth: 1,
                height: "70%"
              },
              toolbox: {
                //图表可缩放配置
                // The diagram is scalable in configuration
                show: true,
                feature: {
                  dataZoom: {
          　　　　　 yAxisIndex:"none",
                    title:{
                      zoom:this.$t('Home.zoom'),
                      back:this.$t('Home.reset')
                    }
                  }
                },
                x: "left",
                x: "10"
                // toolbox.iconStyle.normal.textPosition
              },
              xAxis: {
                type: "time",
                splitLine: {
                  show: false
                }
              },
              yAxis: [
                {
                  nameTextStyle: {
                    padding: [0, 10, -5, 0] // 四个数字分别为上右下左与原位置距离
                                            // The four numbers are the distance between the top right bottom left and the original position
                  },
                  name: yName,
                  type: "value",
                  min:0, //就是这两个 最小值
                         // Those are the two minimum values
                  // max:'dataMax', //最大值
                  // Max: dataMax, maximum
                  max:max,
                  boundaryGap: [0, "100%"],
                  splitLine: {
                    // show: false
                  },
                  //配置Y轴单位
                  // Configure Y-axis units
                  // axisLabel: {
                  //   // formatter:'{value}%'
                  // },
                  axisLine: {
                    // Y轴线...颜色
                    // Y axis... color
                    onZero: false
                    // lineStyle:
                    // {
                    //     color:'#c490bf'
                    // },
                  }
                }
              ],
              series: series
            }
          ]
        });
      });
      return arr;
    },
    finedMaxSize(val) {
      if (val === 0) return "b";
      let arr = ["b", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"];
      let a = 0;
      val = val / 8
      while (val >= 1024) {
        val = val / 1024;
        a += 1;
      }
      return arr[a];
    },
    // 是每一个数据换算到最大单位
    // Is each data conversion to the maximum unit
    changeMaxSize(val) {
      if (val === 0) return val;
      let arr = ["b", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"];
      let a = 0;
      val = val / 8
      while (arr.indexOf(this.maxUnit) > a) {
        val = val / 1024;
        a += 1;
      }
      return parseFloat(Number((val).toFixed(4)));
    },
    nameGroup() {
      this.groupShow = true;
      this.$nextTick(_ => {
        document.querySelector(".edit").focus(); // this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    editGroup() {
      //编辑分组名
      // Edit group name
      if (this.pageGroup == "") {
        this.$message({
          message: this.$t('Monit.hint5'),
          type: "warning"
        });
      } else {
        changeFavorite({ id: this.favoriteId, name: this.pageGroup }).then(
          res => {
            if (res.code == 10000) {
              this.groupShow = false;
            }else{
              this.groupShow = false;
              this.$message({
                message: this.$t('Monit.hint6'),
                type: "warning"
              });
            }
          }
        );
      }
    }
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="scss">
.picker {
  width: 100%;
  height: 58px;
  border-bottom: 1px solid rgba(235, 235, 235, 1);
  zoom: 1;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  .default {
    float: left;
    line-height: 56px;
    padding-left: 18px;
    input {
      width: 130px;
      height: 30px;
      background: rgba(255, 255, 255, 1);
      border-radius: 7px;
      border: 1px solid rgba(54, 120, 200, 1);
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }
    span {
      font-size: 16px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      padding-right: 8px;
    }
    i {
      display: inline-block;
      width: 15px;
      height: 16px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .oper {
    float: right;
    display: flex;
    height: 100%;
    align-items: center;
    .tabs {
      line-height: 30px;
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
    .close {
      width: 18px;
      height: 18px;
      display: inline-block;
      margin: 0 20px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
.devChartMain {
  width: 100%;
  border: 1px solid rgba(235, 235, 235, 1);
}
.devWMain {
  width: 100%;
  border-radius: 7px;
  padding-bottom: 18px;
  // margin-top: 20px;
}
.watchSet {
  padding: 16px 18px 0 18px;
  zoom: 1;
  margin-bottom: 18px;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  .hint {
    float: left;
    dt,
    dd {
      float: left;
    }
    dt {
      width: 40px;
      height: 40px;
      background: rgba(54, 120, 200, 1);
      border-radius: 7px;
      border: 1px solid rgba(54, 120, 200, 1);
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      text-align: center;
    }
    dd {
      padding-left: 12px;
      .devName {
        font-size: 14px;
        font-family: arial, sans-serif;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 20px;
        span {
          padding-right: 14px;
        }
        #online {
          i {
            background: #029805;
          }
        }
        .msg {
          font-size: 14px;
          font-family: arial, sans-serif;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          i {
            width: 8px;
            height: 8px;
            background: rgba(209, 215, 224, 1);
            border-radius: 50%;
            display: inline-block;
            margin-right: 5px;
          }
        }
      }
      .devTime {
        font-size: 12px;
        font-family: arial, sans-serif;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        line-height: 17px;
        span {
          padding-right: 14px;
        }
      }
    }
  }
  .picker {
    float: right;
    display: flex;
    .tabs {
      line-height: 30px;
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
    .attention {
      width: 82px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      border: 0;
      outline: none;
      background: #fff;
      cursor: pointer;
    }
  }
}
.chartCon {
  width: 100%;
  text-align: center;
  .chartitem {
    width: 97%;
    border-radius: 7px;
    border: 1px solid rgba(235, 235, 235, 1);
    margin-top: 18px;
    position: relative;
    margin: 0 auto;
    margin-top: 20px;
    button {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 70px;
      height: 24px;
      background: #3678c8;
      border-radius: 7px;
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: white;
      line-height: 20px;
      outline: none;
      border: 0;
      cursor: pointer;
      z-index: 100;
    }
    button:hover{
      background: #6095D6 
    }
    .chart {
      width: 100%;
      height: 300px;
    }
  }
}
.deviceList {
  padding: 20px 30px 0 51px;
  zoom: 1;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  li {
    float: left;
    width: 146px;
    height: 30px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    border: 1px solid rgba(209, 215, 224, 1);
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    text-align: center;
    line-height: 30px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 20px 20px 0;
  }
  li:nth-of-type(6),
  li:last-of-type {
    margin-right: 0;
  }
}
</style>
<style lang="scss">
.devWMain .el-range-editor--mini.el-input__inner {
  height: 30px;
}
.devWMain .el-date-editor--datetimerange.el-input,
.el-date-editor--datetimerange.el-input__inner {
  width: 330px;
}
.DwatchMain .formSelect .el-input {
  width: 140px;
  height: 34px;
  .el-input__inner {
    height: 100%;
  }
  .el-input__suffix {
    margin-top: 5px;
  }
}
.DwatchMain .oper .el-input__inner {
  width: 330px;
  height: 30px;
  border: 1px solid rgba(209, 215, 224, 1);
}
.DwatchMain .formSelect .formItem:nth-of-type(4) {
  .el-input {
    width: 242px;
    height: 34px;
    .el-input__inner {
      padding-left: 36px;
      height: 100%;
    }
  }
}
.DwatchMain .el-carousel--horizontal {
  border-radius: 7px;
  border: 1px solid rgba(235, 235, 235, 1);
}
.DwatchMain .el-carousel__item {
  background: #fff;
}
.DwatchMain .el-carousel__container {
  height: 144px;
}
.DwatchMain .el-carousel__arrow {
  width: 13px;
  height: 20px;
  background: #fff;
  text-align: center;
  top: 43%;
  &:hover {
    background: #fff;
  }
  i {
    font-size: 20px;
    color: #666666;
  }
}
.DwatchMain .el-carousel__indicators .el-carousel__button {
  width: 36px;
  height: 4px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(209, 215, 224, 1);
}
.DwatchMain .el-carousel__indicators .is-active {
  .el-carousel__button {
    background: #3678c8;
  }
}
.devChartMain{
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
    background: url("../../../assets/homePage/home_icon_calendar@2x.png")
      no-repeat center;
    background-size: cover;
    content: "";
  }
}
}
</style>
