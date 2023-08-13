<!-- 设备克隆弹框 -->
<template>
  <div class="clone">
    <div class="cont">
      <div class="title">
        设备替换
        <span @click="close"></span>
      </div>
      <div class="even">
        <div class="chose">
          <el-row :gutter="20">
            <el-col :span="18">
              <div class="opt">
                <!-- <div class="limit">
                        <el-input v-model="searchKey" size="small"></el-input>
                </div>-->
                <i>
                  <img src="@/assets/newPage/icon_search@2x.png" alt />
                </i>
                <el-autocomplete
                  class="inline-input"
                  v-model="searchKey"
                  :fetch-suggestions="querySearch"
                  placeholder="设备序列号、设备名称"
                  :trigger-on-focus="false"
                  @select="handleSelect"
                  size="small"
                >
                  <template slot-scope="{ item }">
                    <div class="name">{{ item }}</div>
                  </template>
                </el-autocomplete>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="btn">
                <button class="save" @click="query">搜索</button>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="content">
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            border
            stripe
            style="width: 100%"
            max-height="352"
            @current-change="handleSelectionChange"
          >
            <el-table-column width="55" :resizable="false">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.checked"></el-checkbox>
              </template>
            </el-table-column>
            <!-- <el-table-column
              type="index"
              :index="indexMethod"
              label="序号"
              align="center"
              width="70"
              :resizable="false"
            ></el-table-column> -->
            <el-table-column prop="deviceName" label="设备名称" width="120" :resizable="false"></el-table-column>
            <!-- <el-table-column prop="tenantName" label="所属租户" show-overflow-tooltip :resizable="false"></el-table-column> -->
            <el-table-column
              prop="deviceSerialNumber"
              label="设备序列号"
              show-overflow-tooltip
              :resizable="false"
            ></el-table-column>
          </el-table>
          <div class="page">
            <el-pagination
              :page-sizes="[5, 10]"
              :total="all"
              :page-size="10"
              @size-change="Size"
              @current-change="Page"
              :current-page="this.num"
              layout="total, sizes, prev, next, jumper"
              style="font-family: arial, sans-serif"
            ></el-pagination>
          </div>
        </div>
        <div class="contr">
          <button class="save" v-debounce="save">克隆</button>
          <button class="cancel" @click="close">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// Here you can import other files (such as: components, tools js, third-party plug-ins JS, JSON files, image files, etc.)
//例如：import 《组件名称》 from '《组件路径》';
// For example: import component name from 'Component path ';
import { haveConfigurationDevices, devClone } from "@/services";
export default {
  //import引入的组件需要注入到对象中才能使用
  // Import introduces components that need to be injected into an object before they can be used
  components: {},
  data() {
    return {
      targetDevId: "",
      radio: "radio",
      deviceType: "",
      all: 0,
      num: 1,
      size: 10,
      select: [],
      tenant: "",
      searchKey: "",
      tableData: [],
      choseItem: []
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
    querySearch(){

    },
    handleSelect(){

    },
    save() {
      if (this.tableData.length == 0) {
        this.$message({
          type: "warning",
          message: "暂无数据"
        });
      } else if (this.tableData.length && this.choseItem.length == 0) {
        this.$message({
          type: "warning",
          message: "请先选择设备"
        });
      } else {
        let params = {
          devType: this.deviceType == "VSR1000" ? "0001" : "0002",
          sourceDevId: this.choseItem.id,
          targetDevId: this.targetDevId
        };
        // console.log(params)
        devClone(params).then(res => {
          if (res.code == 10000) {
            this.$message({
              type: "success",
              message: "克隆成功!"
            });
            this.$parent.getList();
            this.close();
          } else {
            this.$message({
              type: "warning",
              message: "克隆失败!"
            });
          }
        });
      }
    },
    //表格序号
    // Form the serial number
    indexMethod(index) {
      return index + 1 + (this.num == 1 ? 0 : this.size * (this.num - 1));
    },

    query() {
      this.getTable();
    },
    getTable() {
      let params = {
        searchKey: this.searchKey,
        devNameRange: "devHaveName",
        deviceType: this.deviceType == "VSR1000" ? "0001" : "0002",
        page: this.num,
        pageSize: this.size,
        tenantId: this.tenant
      };
      haveConfigurationDevices(params).then(res => {
        if (res.result == null) {
          this.tableData = [];
        } else {
          this.all = res.result.totalElements;
          res.result.content.forEach(item => {
            item.checked = false;
          });
          this.tableData = res.result.content;
          // console.log(this.tableData)
        }
      });
    },
    Size(val) {
      this.size = val;
      this.num = 1;
      this.getTable();
    },
    Page(val) {
      this.num = val;
      this.getTable();
    },
    handleSelectionChange(row) {
      this.choseItem = row;
      this.tableData.forEach(item => {
        // 排他,每次选择时把其他选项都清除
        // Exclude, clearing out all other options each time you select
        if (item.id !== row.id) {
          item.checked = false;
        }
      });
    },
    close() {
      this.$parent.cloneShow = false;
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  // Life cycle - Creation complete (you can access the current this instance)
  created() {},
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
<style lang="scss">
.clone {
  .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar {
    width: 4px;
    /*height: 4px;*/
  }
  .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }
  .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }
  .chose {
    .el-input,
    .el-select {
      width: 343px;
      height: 34px;
      .el-input__inner {
        height: 100%;
        border-radius: 7px;
        padding-left: 30px;
      }
      .el-input__icon {
        line-height: normal;
      }
    }
  }
}
</style>
<style lang='scss' scoped>
//@import url(); 引入公共css类
// @import url(); Introduce common CSS classes
.chose {
  text-align: left;
}
.content {
  // border: 1px solid rgba(209,215,224,1);
  border-radius: 7px;
  // width:640px;
  // height:420px;
  margin-top: 30px;
  // overflow-x: hidden;
  // overflow-y: auto;
  .page {
    margin-top: 15px;
  }
}
.even {
  width: 100%;
  height: calc(100% - 19px);
  margin: 0 auto;
  padding: 30px 20px;
  position: relative;
  .opt {
    display: flex;
    position: relative;
    span {
      width: 66px;
      line-height: 34px;
    }
    .limit {
      width: 240px;
    }
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
  .a {
    div {
      width: 140px;
    }
  }
  .remaind {
    color: darkgray;
  }
  .contr {
    // margin-left: -60px;
    width: 100%;
    text-align: center;
    position: absolute;
    bottom: 60px;
    .save:hover {
      background: rgba(96, 149, 214, 1);
    }
  }
  .cancel {
    margin-left: 18px;
    background: rgba(255, 255, 255, 1);
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    border: 1px solid rgba(209, 215, 224, 1);
  }
  button {
    color: white;
    border: none;
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
  }
}
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
.cont {
  width: 503px;
  height: 583px;
  background: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0px 10px 20px 0px rgba(102, 102, 102, 0.1);
  border-radius: 7px;
  text-align: center;
}
.clone {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 100;
  background: rgba(32, 42, 59, 0.2);
}
</style>