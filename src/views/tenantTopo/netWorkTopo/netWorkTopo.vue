<!-- 租户拓扑 -->
<template>
  <div class="topu">
    <div class="search">
      <h3>
        拓扑
        <img src="@/assets/icon_right@2x.png" alt />
        <span>网络拓扑设置</span>
      </h3>
      <el-row :gutter="20">
        <el-col :span="21">
          <div class="opt">
            <span>租户路由域</span>
            <el-select filterable
              size="small"
              style="width:160px"
              v-model="vlfName"
              @change="getTopoList(vlfName)"
              placeholder="请选择"
            >
              <!-- <el-option value :label="$t('Upgrade.all')"></el-option> -->
              <el-option v-for="item in vlfList" :key="item.id" :value="item.id" :label="item.name"></el-option>
              <!-- <el-option value="0002" label="VSR100"></el-option> -->
            </el-select>
          </div>
          <div class="opt">
            <!-- <span>开始节点</span>
            <el-select filterable size="small" style="width:160px" v-model="vlfName" placeholder="请选择">
              <el-option value :label="$t('Upgrade.all')"></el-option>
              <el-option value="0001" label="VSR1000"></el-option>
              <el-option value="0002" label="VSR100"></el-option>
            </el-select>-->
          </div>
          <div class="opt">
            <!-- <span>结束节点</span>
            <el-select filterable size="small" style="width:160px" v-model="vlfName" placeholder="请选择">
              <el-option value :label="$t('Upgrade.all')"></el-option>
              <el-option value="0001" label="VSR1000"></el-option>
              <el-option value="0002" label="VSR100"></el-option>
            </el-select>-->
          </div>
        </el-col>
        <el-col :span="3">
          <div class="op-but">
            <!-- <button>骨干测速</button> -->
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="content">
      <div class="control">
        <div class="but">
          <button class="add" v-control>
            <img src="@/assets/newPage/Icon-baocun@2x.png" alt /> 保存
          </button>
          <button class="add" v-control @click="addDevice">
            <img src="@/assets/newPage/icon_add@2x.png" alt /> 新增
          </button>
          <button class="add" v-control>
            <img src="@/assets/newPage/Icon-lianjie@2x.png" alt /> 连接
          </button>
        </div>
      </div>
      <div class="canvas">
        <div class="remind">
          <ul>
            <li>
              <img src="@/assets/topu/1000@2x.png" alt />
              <span class="device">VSR1000</span>
            </li>
            <li>
              <img src="@/assets/topu/100@2x.png" alt />
              <span class="device">VSR100</span>
            </li>
            <li>
              <div class="line"></div>
              <span>链路(不可用)</span>
            </li>
            <li>
              <div class="line green"></div>
              <span>链路(高负载)</span>
            </li>
            <li>
              <div class="line dark"></div>
              <span>链路(通畅)</span>
            </li>
          </ul>
        </div>
        <div class="chart" id="tenChart"></div>
      </div>
    </div>
    <addChild ref="addChild" v-show="childShow" />
    <createLink ref="createLink" v-show="createShow"/>
    <!-- <routTable/> -->
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// Here you can import other files (such as: components, tools js, third-party plug-ins JS, JSON files, image files, etc.)
//例如：import 《组件名称》 from '《组件路径》';
// For example: import component name from 'Component path ';
import {
  topoSetGetTenantVrf,
  topoGetAllDevices,
  getTopuList,
  findLogicalPortByDeviceId
} from "@/services";
import addChild from "./components/addChild";
import createLink from "./components/createLink";
import routTable from "./components/routTable";
export default {
  //import引入的组件需要注入到对象中才能使用
  // Import introduces components that need to be injected into an object before they can be used
  components: { createLink, routTable, addChild },
  data() {
    return {
      vlfName: "",
      //租户路由域列表
      // A tenant routing domain list
      vlfList: [],
      childShow: false,
      //连接的节点的下标
      // The subscript of the connected node
      xydata: [],
      //获取所有的节点
      // Get all the nodes
      dataArr: [],
      createShow:false
    };
  },
  //监听属性 类似于data概念
  // Listening properties are similar to the data concept
  computed: {
    address() {
      const { dataArr } = this;
      return {
        dataArr
      };
    }
  },
  //监控data中的数据变化
  // Monitor data changes in data
  watch: {
    address: {
      handler: function(newval, oldval) {
        this.drawChart(newval.dataArr);
      },
      deep: true
    }
  },
  //方法集合
  // Methods collection
  methods: {
    drawChart(data) {
      // console.log(data, "123");
      var _this = this;
      var echarts = this.$echarts;
      var opt = document.getElementById("tenChart");
      var myChart = echarts.init(opt);
      //设置点的大小
      // Set the size of the point
      var symbolSize = 40;
      //删除连线的下标
      // Deletes the subscript of the line
      var del;
      //解析已存在链路
      // Resolve existing links
      var links = _this.xydata.map(item => {
        return {
          source: item[0],
          target: item[1]
        };
      });

      let arr = [];
      data.map(item => {
        arr.push({
          symbol: "image://data:image/gif;base64," + item.icon,
          value: item.axis
        });
      });
      // console.log(arr)
      //echarts配置项
      // Echarts configuration items
      var option = {
        title: {
          text: ""
        },
        grid: {
          x: 0,
          y: 0,
          x2: 0,
          y2: 0
          // borderWidth: 1,
        },
        //定义X轴
        // Defines the X axis
        xAxis: {
          min: 0,
          max: 1500,
          type: "value",
          axisLine: {
            onZero: false
          },
          show: false
        },
        yAxis: {
          min: 0,
          max: 1500,
          type: "value",
          axisLine: {
            onZero: false
          },
          show: false
        },
        series: [
          {
            //设置id很重要
            // Setting the ID is important
            id: "a",
            //设置为甘特图
            // Set it to a Gantt chart
            type: "graph",
            layout: "none",
            coordinateSystem: "cartesian2d",
            //设置球的大小
            // Set the size of the ball
            symbolSize: symbolSize,
            label: {
              show: true,
              formatter: function(d, i) {
                return data[d.dataIndex].deviceName;
              }
            },
            itemStyle: {
              borderColor: "#22faf7",
              borderWidth: 3,
              color: "#029805"
            },
            //设置连线形式为箭头
            // Set the line form to arrow
            edgeSymbol: ["null", "null"],
            edgeSymbolSize: [4, 10],
            //指定数据数组
            // Specify data array
            data: arr,
            // data: echarts.util.map(data, function(item, di) {
            //   return item.axis;
            // }),
            //指定连线方式
            // Specify connection mode
            edges: links,
            //指定连线颜色
            // Specify line color
            lineStyle: {
              normal: {
                color: "#029805"
              }
            }
          }
        ]
      };
      // console.log(option)
      setTimeout(function() {
        myChart.setOption({
          graphic: echarts.util.map(data, function(item, dataIndex) {
            return {
              type: "circle",
              position: myChart.convertToPixel("grid", item.axis),
              shape: {
                cx: 0,
                cy: 0,
                r: symbolSize / 2
              },
              invisible: true,
              draggable: true,
              onmouseup: echarts.util.curry(onPointDragging, dataIndex),
              onclick: echarts.util.curry(initLinks, dataIndex),
              ondrag: echarts.util.curry(_this.debounce(move, 500), dataIndex),
              // onmousemove: echarts.util.curry(showTooltip, dataIndex),
              // onmouseout: echarts.util.curry(hideTooltip, dataIndex),
              z: 100
            };
          })
        });
      });
      myChart.setOption(option, true);

      function move(dataIndex) {
        // console.log(event)
        if (this.position[0] < 0 || this.position[1] < 0) {
          _this.$message({
            message: "请在画布内操作",
            type: "warning"
          });
          _this.getList();
        }
      }
      //拖拽
      // Drag and drop
      function onPointDragging(dataIndex) {
        arr[dataIndex].value = myChart.convertFromPixel("grid", this.position);
        // Update data
        //移动节点存库
        // Mobile node storage
        // let params = {
        //   topoDeviceId:data[dataIndex].deviceId,
        //   horizontalAxis:myChart.convertFromPixel('grid', this.position)[0],
        //   verticalAxis:myChart.convertFromPixel('grid', this.position)[1],
        // }
        // topuMove(params).then(res=>{

        // })
        myChart.setOption({
          series: [
            {
              id: "a",
              data: arr
            }
          ]
        });
      }
      //绘制连线
      // Draw the attachment
      function initLinks(dataIndex) {
        console.log(data[dataIndex].deviceId);
        for (let i in data) {
          if (dataIndex == i) {
            //判断第一次点击还是第二次点击
            // Decide whether to click first or second
            if (_this.whichClick == 0) {
              _this.first = i;
              _this.whichClick = 1;
              _this.$refs.createLink.ruleForm.deviceId.push(
                data[dataIndex].deviceId
              );
              _this.$refs.createLink.ruleForm.deviceName.push(
                data[dataIndex].deviceName
              );
              _this.$refs.createLink.ruleForm.topoId = data[dataIndex].topuId;
              //获取创建链路的设备端口
              // Gets the device port that creates the link
              findLogicalPortByDeviceId({
                topoDeviceId: data[dataIndex].deviceId
              }).then(res => {
                _this.$refs.createLink.ruleForm.optionA =
                  res.result.logicalPortEntity;
              });
            } else {
              _this.second = i;
              _this.whichClick = 0;
              _this.$refs.createLink.ruleForm.deviceId.push(
                data[dataIndex].deviceId
              );
              _this.$refs.createLink.ruleForm.deviceName.push(
                data[dataIndex].deviceName
              );
              //获取创建链路的设备端口
              // Gets the device port that creates the link
              findLogicalPortByDeviceId({
                topoDeviceId: data[dataIndex].deviceId
              }).then(res => {
                _this.$refs.createLink.ruleForm.optionB =
                  res.result.logicalPortEntity;
              });
              if (_this.first == _this.second) {
                return;
              } else {
                // 检查要绘制的链路是否已建立
                // Check that the link to be drawn is established
                // console.log(_this.first,_this.second)
                var repeat = 0;
                for (let i in _this.xydata) {
                  if (
                    _this.xydata[i].includes(_this.first) &&
                    _this.xydata[i].includes(_this.second)
                  ) {
                    repeat = 1;
                    break;
                  } else {
                    repeat = 0;
                  }
                }
                if (repeat == 1) {
                  alert("这两台设备已存在链路");
                } else {
                  _this.createShow = true;
                }
              }
              var linkss = _this.xydata.map(function(item, i) {
                return {
                  source: _this.xydata[i][0],
                  target: _this.xydata[i][1]
                };
              });
              // console.log(linkss)
              myChart.setOption({
                series: [
                  {
                    edges: linkss,
                    //指定连线颜色
                    // Specify line color
                    lineStyle: {
                      normal: {
                        color: "#029805"
                      }
                    }
                  }
                ]
              });
            }
          }
          // break
        }
      }
      //点击删除连线
      // Click delete
      myChart.on("click", function(params) {
        // console.log(params)
        if (params.componentType != "series" || params.dataType != "edge") {
          return;
        }

        var a = [params.data.source, params.data.target];
        for (var i = 0; i < _this.xydata.length; i++) {
          if (
            params.data.source == _this.xydata[i][0] &&
            params.data.target == _this.xydata[i][1]
          ) {
            del = i;
            _this.xydata.splice(del, 1);
            //当xydata值改变时linkss方法需要重新跑一变
            // The LinkSS method needs to be re-run when the xyData value changes
            var linkss = _this.xydata.map(function(item, i) {
              return {
                source: _this.xydata[i][0],
                target: _this.xydata[i][1]
              };
            });
            //重新载入的东西都写在这里
            // Everything that's reloaded is written here
            myChart.setOption({
              series: [
                {
                  edges: linkss
                }
              ]
            });
            return true;
          }
        }
      });
    },
    //租户拓扑租户路由域获取
    // Tenant topology tenant routing domain acquisition
    getVlfList() {
      topoSetGetTenantVrf({
        tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId
      }).then(res => {
        if (res.code === 10000) {
          this.vlfList = res.result;
          this.vlfName = this.vlfList[0].id;
          this.getTopoList(this.vlfName);
        }
      });
    },
    debounce(func, wait) {
        let timeout;
        return function () {
            let context = this;
            let args = arguments;

            if (timeout) clearTimeout(timeout);
            
            timeout = setTimeout(() => {
                func.apply(context, args)
            }, wait);
        }
    },
    //获取并过滤拓扑图数据
    // Gets and filters topology data
    getTopoList(vlfName) {
      var data = [];
      var link = [];
      topoGetAllDevices({
        tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId,
        type: 2,
        vrfId: vlfName
      }).then(res => {
        if (res.code === 10000) {
          if (res.result.length > 1) {
            //有链路的设备
            // A device with a link
            res.result[0].map(item => {
              data.push({
                linked: true,
                linkId: item.linkedInfo.id,
                deviceName: item.clientDeviceInfo.deviceName,
                deviceType: item.clientDeviceInfo.deviceType,
                icon: item.clientIcon,
                topuId: item.clientDevice.topoId,
                deviceId: item.clientDevice.id,
                axis: [
                  item.clientDevice.horizontalAxis,
                  item.clientDevice.verticalAxis
                ]
              });
              data.push({
                linked: true,
                linkId: item.linkedInfo.id,
                deviceName: item.serverDeviceInfo.deviceName,
                deviceType: item.serverDeviceInfo.deviceType,
                icon: item.serverIcon,
                topuId: item.serverDevice.topoId,
                deviceId: item.serverDevice.id,
                axis: [
                  item.serverDevice.horizontalAxis,
                  item.serverDevice.verticalAxis
                ]
              });
              //已连接设备
              // Connected device
              link.push([item.clientDevice.id, item.serverDevice.id]);
            });
            //无链路的设备
            // Link-free equipment
            res.result[1].map(item => {
              data.push({
                linked: false,
                linkId: "",
                deviceName: item.notLinkedDeviceInfo.deviceName,
                deviceType: item.notLinkedDeviceInfo.deviceType,
                icon: item.icon,
                topuId: item.notLinkedDevice.topoId,
                deviceId: item.notLinkedDevice.id,
                axis: [
                  item.notLinkedDevice.horizontalAxis,
                  item.notLinkedDevice.verticalAxis
                ]
              });
            });
          } else {
            res.result[0].map(item => {
              data.push({
                linked: false,
                linkId: "",
                deviceName: item.notLinkedDeviceInfo.deviceName,
                deviceType: item.notLinkedDeviceInfo.deviceType,
                icon: item.icon,
                topuId: item.notLinkedDevice.topoId,
                deviceId: item.notLinkedDevice.id,
                axis: [
                  item.notLinkedDevice.horizontalAxis,
                  item.notLinkedDevice.verticalAxis
                ]
              });
            });
          }
          data = this.unique(data);
          for (let i in data) {
            link.map(item => {
              if (data[i].deviceId == item[0]) {
                item[0] = i;
              }
              if (data[i].deviceId == item[1]) {
                item[1] = i;
              }
            });
          }
          this.xydata = link;
          this.dataArr = this.unique(data);
        }
      });
    },
    //去除重复的节点
    // Remove duplicate nodes
    unique(arr) {
      let newArr = [arr[0]];
      for (let i = 1; i < arr.length; i++) {
        let repeat = false;
        for (let j = 0; j < newArr.length; j++) {
          if (arr[i].deviceId === newArr[j].deviceId) {
            repeat = true;
            break;
          } else {
          }
        }
        if (!repeat) {
          newArr.push(arr[i]);
        }
      }
      return newArr;
    },
    //新增设备节点
    // New device node
    addDevice() {
      this.childShow = true;
      let params = {
        tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId,
        deviceType: ""
      };
      getTopuList(params).then(res => {
        res.result.content.forEach(item => {
          item.checked = false;
        });
        this.$refs.addChild.tableData = res.result.content;
        this.$refs.addChild.all = res.result.totalElements;
        // console.log(this.$refs.addChild.tableData)
      });
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  // Life cycle - Creation complete (you can access the current this instance)
  created() {
    this.getVlfList();
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  // Life cycle - Mount complete (with access to DOM elements)
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
                     // Life cycle - before creation
  beforeMount() {}, //生命周期 - 挂载之前
                    // Life cycle - before mount
  beforeUpdate() {}, //生命周期 - 更新之前
                     // Life cycle - before updates
  updated() {}, //生命周期 - 更新之后
                // Life cycle - after update
  beforeDestroy() {}, //生命周期 - 销毁之前
                      // Life cycle - before destruction
  destroyed() {}, //生命周期 - 销毁完成
                  // Life cycle - Destruction complete
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
                 // If the page has keep-alive caching, this function fires
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
// @import url(); Introduce common CSS classes
.canvas {
  height: 550px;
  position: relative;
  border: 1px solid rgba(235, 235, 235, 1);
  .chart {
    width: 100%;
    height: 100%;
  }
  .remind {
    position: absolute;
    bottom: 0;
    right: 0;
    margin-right: 20px;
    .device {
      display: inline-block;
      position: absolute;
    }
    li {
      line-height: 34px;
      .line {
        width: 34px;
        height: 4px;
        background: rgba(186, 39, 39, 1);
        display: inline-block;
        margin-right: 10px;
      }
      .green {
        background: #029805;
      }
      .dark {
        background: rgba(222, 222, 222, 1);
      }
    }
    img {
      width: 34px;
      height: 34px;
      margin-right: 10px;
    }
  }
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
      margin-left: 18px;
      img {
        width: 14px;
        height: 14px;
        position: relative;
        top: 2px;
      }
    }
    button:hover {
      background: rgba(96, 149, 214, 1);
    }
  }
}
.topu {
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
      float: left;
      display: flex;
      margin-top: 20px;
      font-size: 14px;
      padding-right: 24px;
      // .limit {
      //   width: 242px;
      //   div {
      //     width: 242px;
      //   }
      // }
      span {
        // width: 108px;
        padding-right: 10px;
        line-height: 34px;
      }
    }
    .op-but {
      // float: right;
      margin-top: 20px;
      button:hover {
        background: rgba(96, 149, 214, 1);
      }
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
</style>