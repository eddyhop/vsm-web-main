<!-- 设备升级 -->
<!-- device upgrade -->
<template>
  <div class="upgrade">
    <div class="search">
      <h3>
        {{$t('Upgrade.base')}}
        <img src="@/assets/icon_right@2x.png" alt />
        <span>{{$t('Upgrade.upgrade')}}</span>
      </h3>
      <el-row :gutter="20">
        <!-- <el-col :span="5">
          <div class="opt">
            <span>{{$t('Upgrade.devType')}}</span>
            <el-select filterable size="small" v-model="deviceType" placeholder="请选择">
              <el-option value="dsddjb" :label="$t('Upgrade.all')"></el-option>
              <el-option value="0001" label="VSR1000"></el-option>
              <el-option value="0002" label="VSR100"></el-option>
            </el-select>
          </div>
        </el-col>-->
        <el-col :span="21">
          <div class="opt">
            <div class="limit">
              <!-- <el-input
                placeholder="请输入内容"
                prefix-icon="el-icon-search"
                v-model="version">
              </el-input>-->
              <i>
                <img src="@/assets/newPage/icon_search@2x.png" alt />
              </i>
              <el-autocomplete
                class="inline-input"
                v-model="version"
                prefix-icon="el"
                :fetch-suggestions="querySearch"
                :placeholder="$t('Upgrade.versionNumName')"
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
        <el-col :span="3">
          <div class="opt op-but">
            <button @click="search">{{$t('Upgrade.search')}}</button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="content">
      <div class="control">
        <div class="but">
          <button class="add" @click="add" v-control>
            <img src="@/assets/newPage/icon_add@2x.png" alt />
            {{$t('Upgrade.add')}}
          </button>
        </div>
      </div>
      <el-table
        :data="tableData"
        stripe
        border
        size="small"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <!-- <el-table-column
          type="index"
          :index="indexMethod"
          :label="$t('Upgrade.index')"
          align="center"
          width="70"
          :resizable="false"
        ></el-table-column> -->
        <el-table-column
          prop="jobName"
          :label="$t('Upgrade.taskName')"
          width="180"
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="versionDesc"
          :label="$t('Upgrade.version1')"
          width="180"
          :resizable="false"
        ></el-table-column>
        <el-table-column
          prop="downloaDevsNumber"
          :label="$t('Upgrade.device')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
        <el-table-column prop="version" :label="$t('Upgrade.downVer')" :resizable="false"></el-table-column>
        <el-table-column prop="address" :label="$t('Upgrade.situation')" :resizable="false">
          <template slot-scope="scope">
            <button
              class="edit"
              @click="down(scope.row,0)"
              v-control
            >{{scope.row.downloadCondition}}</button>
          </template>
        </el-table-column>
        <el-table-column prop="address" :label="$t('Upgrade.upState')" :resizable="false">
          <template slot-scope="scope">
            <button class="edit" @click="down(scope.row,1)" v-control>{{scope.row.updateCondition}}</button>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          :label="$t('Upgrade.operation')"
          :resizable="false"
          width="150"
        >
          <template slot-scope="scope">
            <button class="edit" @click="edit(scope.row)" v-control>{{$t('Upgrade.upgrade')}}</button>
            <button class="edit" @click="stop(scope.row)" v-control>{{$t('Upgrade.stop')}}</button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :page-sizes="[5, 10]"
          :total="allItem"
          :page-size="10"
          @size-change="changeSize"
          @current-change="changePage"
          :current-page="this.num"
          layout="total, sizes, prev, next, jumper"
          style="font-family: arial, sans-serif"
        ></el-pagination>
      </div>
    </div>
    <Stop ref="stop" v-show="stopShow" />
    <addPlan ref="addPlan" v-show="addPlanShow" />
    <deviceUp ref="deviceUp" v-show="deviceUpShow" />
    <upInfo ref="upInfo" v-show="upInfoShow" />
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等
// Here you can import other files (such as: components, tools js, third-party plug-ins JS, JSON files, image files and so on
// Here you can import other files (such as components, tools js, third-party plug-ins JS, JSON files, image files, etc.)
import {
  updateList,
  deviceSelect,
  updateDev,
  searchDevsByTenantId,
  updateInfo,
  getAlreadyDownloadDevs,
  searchJobsByTenantId
} from "@/services";
//例如：import 《组件名称》 from '《组件路径》';
// For example: import component name from 'Component path ';
// For example: import "component name" from "Component path";
import Stop from "./components/stop";
import addPlan from "./components/addPlan";
import deviceUp from "./components/deviceUp";
import upInfo from "./components/upInfo";
export default {
  //import引入的组件需要注入到对象中才能使用
  // Import introduces components that need to be injected into an object before they can be used
  // Import introduces components that need to be injected into an object before they can be used
  components: { Stop, addPlan, deviceUp, upInfo },
  data() {
    return {
      tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '': JSON.parse(sessionStorage.getItem("userData")).tenantId,
      type: JSON.parse(sessionStorage.getItem("userData")).type,
      allItem: 0,
      num: 1,
      size: 10,
      deviceType: "",
      version: "", //版本号 version number 
                   // Version Number version number
      stopShow: false,
      addPlanShow: false,
      deviceUpShow: false,
      upInfoShow: false,
      deviceType: "",
      tableData: [],
      list: []
    };
  },
  //监听属性 类似于data概念
  // Listening properties are similar to the data concept
  //Listening properties are similar to the data concept
  computed: {},
  //监控data中的数据变化
  // Monitor data changes in data
  // Monitor data changes in data
  watch: {},
  //方法集合
  // Methods collection
  // Method collection
  methods: {
    search() {
      this.getList();
    },
    //模糊搜索
    // Fuzzy search
    // Fuzzy search
    querySearch(queryString, cb) {
      var leveno = this.list;
      var results = leveno.filter(this.createFilter(queryString));
      // 调用 callback 返回建议列表的数据
      // A callback call returns the data for the list of suggestions
      // Callback is called to return the data for the list of Suggestions
      cb(results);
    },
    createFilter(queryString) {
      return leveno => {
        return leveno.toLowerCase().indexOf(queryString.toLowerCase()) !== -1;
      };
    },
    //模糊搜索列表点击
    // Click on the fuzzy search list
    // Click on the fuzzy search list
    handleSelect(item) {
      this.version = item;
      // console.log(item);
    },
    getList() {
      let params = {
        page: this.num,
        pageSize: this.size,
        tenantId: this.tenantId,
        jobName: this.version.split(",")[1]
      };
      updateList(params).then(res => {
        this.tableData = res.result.content;
        this.allItem = res.result.totalElements;
        this.tableData.map(item => {
          item.version = item.version
            .substring(0, item.version.length - 2)
            .slice(2);
        });
      });
      searchJobsByTenantId({
        tenantId: this.type == 2 ? "" : this.tenantId
      }).then(res => {
        this.list = res.result;
      });
    },
    changeSize(val) {
      this.size = val;
      this.getList();
    },
    changePage(val) {
      this.num = val;
      this.getList();
    },
    indexMethod(index) {
      return index + 1 + (this.num == 1 ? 0 : this.size * (this.num - 1));
    },
    async add() {
      this.addPlanShow = true;
      let tenant = await deviceSelect().then(res => {
        this.$refs.addPlan.options = res.result;
      });
      let table = await updateDev({
        type: this.type,
        tenantId: this.tenantId
      }).then(res => {
        this.$refs.addPlan.tableData = res.result.result;
        this.$refs.addPlan.all = res.result.total;
      });
      let params = {
        type: this.type,
        tenantId: this.tenantId
      };
      let leven = await searchDevsByTenantId(params).then(res => {
        this.$refs.addPlan.leveno = res.result;
      });
    },
    edit(row) {
      this.deviceUpShow = true;
      getAlreadyDownloadDevs({ id: row.id }).then(res => {
        this.$refs.deviceUp.left = res.result.download;
        this.$refs.deviceUp.right = res.result.update;
        this.$refs.deviceUp.id = row.id;
      });
    },
    stop(row) {
      this.$refs.stop.id = row.id;
      // console.log(row)
      this.stopShow = true;
    },
    async down(row, state) {
      this.upInfoShow = true;
      this.$refs.upInfo.id = row.id;
      this.$refs.upInfo.title =
        state == 0 ? this.$t("Upgrade.situation") : this.$t("Upgrade.upState");
      this.$refs.upInfo.upOrdown = state == 0 ? true : false;
      let params = {
        id: row.id,
        downOrUpdate: state == 0 ? true : false
      };
      let table = await updateInfo(params).then(res => {
        this.$refs.upInfo.tableData = res.result.content;
        this.$refs.upInfo.all = res.result.totalElements;
      });
      let vrf = await deviceSelect().then(res => {
        this.$refs.upInfo.options = res.result;
      });
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  // Life cycle - Creation complete (you can access the current this instance)
  // Life Cycle - Creation complete (current this instance can be accessed)
  created() {
    this.getList();
    searchJobsByTenantId({
      tenantId: this.type == 2 ? "" : this.tenantId
    }).then(res => {
      this.list = res.result;
    });
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  // Life cycle - Mount complete (with access to DOM elements)
  // Life cycle - Mount complete (DOM elements are accessible)
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前 // Life cycle - before creation
                                   // Life Cycle - Life cycle before creation
  beforeMount() {}, //生命周期 - 挂载之前 // Life cycle - before mount
                                  // Life Cycle - Life cycle-before mount
  beforeUpdate() {}, //生命周期 - 更新之前 // Life cycle - before update
                                   // Life cycle - Life cycle-before update
  updated() {}, //生命周期 - 更新之后 // Life cycle - after update
                              // Life Cycle - Life Cycle-After Update
  beforeDestroy() {}, //生命周期 - 销毁之前  // Life cycle - before destruction
                                     // Life cycle - Life cycle-before destruction
  destroyed() {}, //生命周期 - 销毁完成 // Life cycle - Destruction complete
                                // Life-cycle-destruction complete
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发 // This function will trigger if the keep-alive cache is available on the page
                                               // If keep-alive cache is available on the page, This function will trigger if the keep-alive cache is available on the page
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
// @import url(); Introduce common CSS classes
// @ import url (); Introduce common CSS classes
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
  .edit {
    // width:28px;
    height: 20px;
    border: none;
    background: none;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(54, 120, 200, 1);
  }
}
.upgrade {
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
      display: flex;
      margin-top: 20px;
      font-size: 14px;
      .limit {
        width: 242px;
        div {
          width: 242px;
        }
      }
      span {
        width: 108px;
        line-height: 34px;
      }
    }
    .op-but {
      justify-content: flex-end;
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
.limit {
  position: relative;
  i {
    width: 16px;
    height: 16px;
    position: absolute;
    top: 9px;
    left: 10px;
    z-index: 3;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
<style lang="scss">
.upgrade .limit {
  .el-input,
  .el-select {
    height: 34px;
    .el-input__inner {
      height: 100%;
      border-radius: 7px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
}
</style>