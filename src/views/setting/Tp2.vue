<!--  -->
<template>
  <div class="tp" id="tp">
    <div id="a" :style="{width:'1200px',height:'600px',background:'#293c55'}"></div>
    <div id="menu">
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>网段发布</el-dropdown-item>
            <el-dropdown-item>设备详情</el-dropdown-item>
            <el-dropdown-item>骨干路由表</el-dropdown-item>
            <el-dropdown-item>
              <button @click="del">删除节点</button>
            </el-dropdown-item>
          </el-dropdown-menu>
      </el-dropdown>
    </div>
    <button @click="add">添加</button>
    <button @click="con">添加</button>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// Here you can import other files (such as: components, tools js, third-party plug-ins JS, JSON files, image files, etc.)
//例如：import 《组件名称》 from '《组件路径》';
// For example: import component name from 'Component path ';

export default {
  //import引入的组件需要注入到对象中才能使用
  // Import introduces components that need to be injected into an object before they can be used
  components: {},
  data() {
    return {
      delIndex:null,
      dom: null,
      xydata: [
        // [0, 1],
        // [1, 2],
        // [2, 3]
      ],
      dataArr: [
        {
          name: "A",
          value: [15, 50]
        },
        {
          name: "B",
          value: [-50, 10]
        },
        {
          name: "C",
          value: [-55, -70]
        },
        {
          name: "D",
          value: [40, -40]
        },
        {
          name:"E",
          value :[20,20]
        }
      ]
    };
  },
  //监听属性 类似于data概念
  // Listening properties are similar to the data concept
  computed: {},
  //监控data中的数据变化
  // Monitor data changes in data
  watch: {},
  //方法集合
  // Methods collection
  methods: {
    con(){
      console.log(this.xydata,this.delIndex)
    },
    del(){
      // console.log(this.delIndex)
      for(let i in this.dataArr){
        if(i==this.delIndex){
          this.dataArr.splice(this.delIndex,1)
        }
      }
      for(var k=this.xydata.length-1;k>-1;k--){
        // 当前选中设备下标只要在xydata中有  就删除这一条
        // Delete the currently selected device index as long as it is in XYData
        // console.log(this.xydata[k][0],this.xydata[k][1])
        if(this.xydata[k][0]==this.delIndex||this.xydata[k][1]==this.delIndex){
          this.xydata.splice(k,1)
        }
        
      }
      for(let o in this.xydata){
        if(this.xydata[o][0]>this.delIndex){
          this.xydata[o][0] == 0 ? 0 : this.xydata[o][0] -= 1
          if(this.xydata[o][1]>this.delIndex){
            this.xydata[o][1] == 0 ? 0 : this.xydata[o][1] -= 1
          }
        }
      }
      console.log(this.dataArr,this.delIndex,this.xydata)
      this.draw()
    },
    add() {
      let dot = {
        name: Math.floor(Math.random() * 100),
        value: [
          Math.floor(Math.random() * 100),
          Math.floor(Math.random() * 100)
        ]
      };
      this.dataArr.push(dot);
      this.draw()
      // console.log(this.dataArr);
    },
    draw() {
      var _this = this
      var echarts = this.$echarts;
      var opt = document.getElementById("a");
      var myChart = echarts.init(opt);
      var xydata = this.xydata;
      //节点坐标
      // The node coordinates
      var dataArr = this.dataArr;

      //设置点的大小
      // Set the size of the point
      var symbolSize = 70;

      //当0时候表示输入起点坐标，其他值输入终点坐标
      // When 0 represents the input starting point coordinates, other values input terminal coordinates
      var position = 0;
      //起点
      // The starting point
      var positionSource;
      //钟点
      // The hour
      var positionTarget;
      //设置判断点击线还是点击点
      // Set to determine whether a click-line or a click-point
      var ok = 1;
      //删除数组的索引位置
      // Deletes the index position of the array
      var del;

      var links = xydata.map(function(item, i) {
        return {
          source: xydata[i][0],
          target: xydata[i][1]
        };
      });

      var option = {
        title: {
          text: "拓扑管理"
        },
        grid: {},
        //定义X轴
        // Defines the X axis
        xAxis: {
          min: -100,
          max: 100,
          type: "value",
          axisLine: {
            onZero: false
          },
          show: false
        },
        yAxis: {
          min: -100,
          max: 100,
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
            symbol:
              "image://https://pic.rmb.bdstatic.com/f8fba7a2f3c35d3d7c16892b38ba4785.jpeg",
            label: {
              show: true,
              formatter: function(d, i) {
                return dataArr[d.dataIndex].name;
              }
            },
            itemStyle: {
              borderColor: "#22faf7",
              borderWidth: 3,
              color: "#123456"
            },
            //设置连线形式为箭头
            // Set the line form to arrow
            edgeSymbol: ["circle", "arrow"],
            edgeSymbolSize: [4, 10],
            //指定数据数组
            // Specify data array
            data: echarts.util.map(dataArr, function(item, di) {
              return item.value;
            }),
            //指定连线方式
            // Specify connection mode
            edges: links,
            //指定连线颜色
            // Specify line color
            lineStyle: {
              normal: {
                color: "#22faf7"
              }
            }
          }
        ]
      };

      //在demo里，必须要加setTimeout ，否则执行 myChart.convertToPixel 会报错
      // In the demo, you must add setTimeout, otherwise mychart.converttopixel will report an error
      setTimeout(function() {
        myChart.setOption(option,true);
        initGraphic();
        //窗口大小改事件
        // Window resize event
        window.addEventListener("resize", updatePosition);
      }, 0);

      //重新定位图形元素
      // Reposition graphic elements
      function updatePosition() {
        myChart.setOption({
          graphic: echarts.util.map(dataArr, (item, dataIndex) => {
            return {
              position: myChart.convertToPixel("grid", item.value),
            };
          })
        });
      }
      //绘制图形元素
      // Draw graphic elements
      function initGraphic() {
        myChart.setOption({
          graphic: echarts.util.map(dataArr, (item, dataIndex) => {
            // console.log(dataArr)
            return {
              //圆形
              // circular
              type: "circle",
              //将坐标转化为像素
              // Convert coordinates to pixels
              position: myChart.convertToPixel("grid", item.value),
              shape: {
                // 拖动点的大小
                // Drag the size of the point
                r: symbolSize / 2 - 2
              },
              style: {
                fill: "#3FA7DC50",
                borderColor: "#22faf7",
                borderWidth: 1
              },
              //指定虚拟圈是否可见  false 可见
              // Specifies whether the virtual circle is visible or false is visible
              invisible: false,
              //指定圈被拖拽（可以与不可以）
              // The specified circle is dragged (yes and no)
              draggable: true,
              // ondrag: echarts.util.curry(onPointDragging, dataIndex),
              onclick: echarts.util.curry(initLinks, dataIndex),
              onmouseup: echarts.util.curry(onPointDragging, dataIndex),
              
              //层级
              // The hierarchy
              z: 100
            };
          })
        });
      }
      //图形元素拖动后， 修改节点位置
      // After the graphic element is dragged, modify the node position
      function onPointDragging(dataIndex, dx, dy) {
        // console.log(dataIndex,1,dx,2,dy,3,this.position)
        dataArr[dataIndex].value = myChart.convertFromPixel(
          "grid",
          this.position
        );
        // Update data
        myChart.setOption({
          series: [
            {
              id: "a",
              data: dataArr
            }
          ]
        });
      }

      //绘制添加的连线
      // Draws the added wires
      function initLinks(dataIndex) {
        // let X = event.offsetX
        // let Y = event.offsetY
        // let menu = document.getElementById('menu')
        // menu.style.left = X + 'px'
        // menu.style.top = Y + 'px'
         _this.delIndex = dataIndex
        for (var i = 0; i < dataArr.length; i++) {
          if (i == dataIndex) {
            ok = 0;
            if (position == 0) {
              positionSource = i;
              position = 1;
            } else {
              positionTarget = i;
              position = 0;
              xydata.push([positionSource, positionTarget]);
              //当xydata值改变时linkss方法需要重新跑一变
              // The LinkSS method needs to be re-run when the xyData value changes
              var linkss = xydata.map(function(item, i) {
                return {
                  source: xydata[i][0],
                  target: xydata[i][1]
                };
              });
              console.log(linkss,xydata,dataIndex,_this.xydata)
              //重新载入的东西都写在这里
              // Everything that's reloaded is written here
              myChart.setOption({
                series: [
                  {
                    edges: linkss,
                    //指定连线颜色
                    // Specify line color
                    lineStyle: {
                      normal: {
                        color: "#22faf7"
                      }
                    }
                  }
                ]
              });
              return true;
            }
            break;
          }
        }
      }

      //点击事件 , 删除连线
      // Click the event to delete the connection
      myChart.on("click", function(params) {
        if (params.componentType != "series" || params.dataType != "edge") {
          return;
        }
          console.log(params)
        var a = [params.data.source, params.data.target];
        for (var i = 0; i < xydata.length; i++) {
          if (
            params.data.source == xydata[i][0] &&
            params.data.target == xydata[i][1]
          ) {
            del = i;
            xydata.splice(del, 1);
            //当xydata值改变时linkss方法需要重新跑一变
            // The LinkSS method needs to be re-run when the xyData value changes
            var linkss = xydata.map(function(item, i) {
              return {
                source: xydata[i][0],
                target: xydata[i][1]
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
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  // Life cycle - Creation complete (you can access the current this instance)
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  // Life cycle - Mount complete (with access to DOM elements)
  mounted() {
    this.draw()
  },
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
.tp {
  width: 100%;
  height: 100%;
  background: white;
  position: relative;
  button {
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    border: none;
    color: white;
  }
  #menu{
    position: absolute;
    // margin-top: -600px
  }
}
</style>