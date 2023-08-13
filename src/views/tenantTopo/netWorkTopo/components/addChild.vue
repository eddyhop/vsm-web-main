<!--  -->
<template>
  <div class="addChild">
    <div class="cont">
      <div class="title">
        添加节点
        <span @click="cancel"></span>
      </div>
      <div class="content">
        <div class="search">
          <el-row :gutter="24">
            <el-col :span="10">
              <div class="search-item">
                <span class="label">设备类型</span>
                <el-select filterable :placeholder="$t('Upgrade.all')" size="small" v-model="deviceType">
                  <el-option value :label="$t('Upgrade.all')"></el-option>
                  <el-option value="0001" label="VSR1000"></el-option>
                  <el-option value="0002" label="VSR100"></el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="10">
              <div class="search-item">
                <el-input suffix-icon="el-icon-search" size="small" v-model="deviceName"></el-input>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="search-item">
                <button @click="search">搜索</button>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="table-content">
          <el-table
            :data="tableData"
            stripe
            border
            style="width: 100%"
            @current-change="handleSelectionChange"
          >
            <el-table-column label="单选" width="55">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.checked"></el-checkbox>
              </template>
            </el-table-column>
            <!-- <el-table-column
              type="index"
              :index="indexMethod"
              :label="$t('Upgrade.index')"
              width="70"
              :resizable="false"
            ></el-table-column> -->
            <el-table-column prop="deviceName" :label="$t('Upgrade.devName')" :resizable="false"></el-table-column>
            <el-table-column
              prop="deviceSerialNumber"
              :label="$t('Upgrade.devNumber')"
              :resizable="false"
            ></el-table-column>
            <el-table-column prop="deviceType" :label="$t('Upgrade.devType')" :resizable="false">
              <template slot-scope="scope">
                <span>{{scope.row.deviceType == '00010201' ? 'VSR1000' :'VSR100'}}</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="page">
            <el-pagination
              :page-sizes="[5, 10]"
              :total="all"
              :page-size="10"
              @size-change="Size"
              @current-change="Page"
              :current-page="this.Number"
              layout="total, sizes, prev, next, jumper"
            ></el-pagination>
          </div>
        </div>
        <div class="control">
          <button @click="save">保存</button>
          <button @click="cancel" class="cancel">取消</button>
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
import { getTopuList, addTopuDevice } from "@/services";
export default {
  //import引入的组件需要注入到对象中才能使用
  // Import introduces components that need to be injected into an object before they can be used
  components: {},
  data() {
    return {
      deviceName: "",
      deviceType: "",
      tableData: [],
      all: 0,
      Number: 1,
      size: 10,
      checked: {}
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
    save() {
      let params = {
        deviceIds: this.checked.id,
        deviceType: 2,
        horizontalAxis: 20,
        type: 2,
        verticalAxis: 20,
        vrfId:this.$parent.vlfName,
        tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '': JSON.parse(sessionStorage.getItem("userData")).tenantId
      };
      addTopuDevice(params).then(res => {
        if (res.code == 10000) {
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.$parent.getTopoList(this.$parent.vlfName);
          this.cancel();
        }
      });
    },
    search() {
      this.Number = 1;
      this.getList();
    },
    Size(val) {
      this.size = val;
      this.getList();
    },
    Page(val) {
      this.Number = val;
      this.getList();
    },
    handleSelectionChange(row) {
      //单选
      // The radio
      // console.log(row)
      this.checked = row;
      this.tableData.forEach(item => {
        if (item.id != row.id) {
          item.checked = false;
        }
      });
    },
    getList() {
      let params = {
        page: this.Number,
        pageSize: this.size,
        tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId,
        searchValue: this.deviceName,
        deviceType: this.deviceType
      };
      getTopuList(params).then(res => {
        res.result.content.forEach(item => {
          item.checked = false;
        });
        this.tableData = res.result.content;
        this.all = res.result.totalElements;
      });
    },
    indexMethod(index) {
      return index + 1 + (this.Number == 1 ? 0 : this.size * (this.Number - 1));
    },
    cancel() {
      this.$parent.childShow = false;
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
<style lang='scss' scoped>
//@import url(); 引入公共css类
// @import url(); Introduce common CSS classes
.control {
  text-align: center;
  margin-top: 30px;
  button {
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    border: none;
    color: white;
  }
  .cancel {
    width: 70px;
    height: 34px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    border: 1px solid rgba(209, 215, 224, 1);
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    margin-left: 20px;
  }
}
.search {
  margin-bottom: 30px;
}
.search-item {
  display: flex;
  .label {
    display: inline-block;
    width: 100px;
    line-height: 34px;
  }
  button {
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    border: none;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
  }
}
.cont {
  width: 700px;
  height: 657px;
  background: white;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -350px;
  margin-top: -328px;
  box-shadow: 0px 10px 20px 0px rgba(102, 102, 102, 0.1);
  border-radius: 7px;
  padding-bottom: 10px;
  .content {
    padding: 30px;
    .table-content {
      height: 420px;
      overflow-x: hidden;
      overflow-y: auto;
    }
    .table-content::-webkit-scrollbar {
      width: 4px;
      /*height: 4px;*/
    }
    .table-content::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: rgba(0, 0, 0, 0.2);
    }
    .table-content::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 0;
      background: rgba(0, 0, 0, 0.1);
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
}
.addChild {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 9;
  background: rgba(32, 42, 59, 0.2);
}
</style>