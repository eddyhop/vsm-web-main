<!-- ipsec.vue -->
<template>
  <div class="ipsec">
    <div class="operate">
      <button class="close" @click="choseDel" v-control>{{$t('vsr1000.delete')}}</button>
      <button class="add" @click="add" v-control>
        <img src="@/assets/newPage/icon_add@2x.png" alt />
        {{$t('vsr1000.add')}}
      </button>
    </div>
    <div class="tableView">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        border
        fit
        size="small"
      >
        <el-table-column type="selection" width="55" :resizable="false" align="center" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column
          type="index"
          :index="indexMethod"
          :label="$t('vsr1000.index')"
          align="center"
          width="70"
          :resizable="false"
        ></el-table-column> -->
        <el-table-column prop="name" label="隧道名称" align="center" :resizable="false"></el-table-column>
        <el-table-column prop="selfIpv4" label="本端IP" align="center" :resizable="false"></el-table-column>
        <el-table-column prop="oppositeAddr" label="对端地址" align="center" :resizable="false"></el-table-column>
        <el-table-column prop="selfSubnet" label="本端子网" align="center" :resizable="false"></el-table-column>
        <el-table-column prop="oppositeSubnet" label="对端子网" align="center" :resizable="false"></el-table-column>
        <el-table-column :label="$t('vsr1000.operate')" align="center" :resizable="false">
          <template slot-scope="scope">
            <el-button
              @click="handleClick(scope.row)"
              type="text"
              size="small"
              style="color:#3678C8;font-size:14px;font-weight:400"
              v-control
            >{{$t('vsr1000.edit')}}</el-button>
            <el-button
              @click="set(scope.row)"
              type="text"
              size="small"
              style="color:#3678C8;font-size:14px;font-weight:400"
              v-control
            >高级设置</el-button>
            <el-button
              @click="del(scope.row)"
              type="text"
              size="small"
              style="color:#3678C8;font-size:14px;font-weight:400"
              v-control
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :page-sizes="[5, 10]"
          :total="allNum"
          @size-change="pageChange"
          @current-change="sizeChange"
          :current-page="pageNumber"
          :page-size="10"
          layout="total, sizes, prev, next, jumper"
          style="font-family: arial, sans-serif"
        ></el-pagination>
      </div>
    </div>
    <addIpsec ref="add" v-show="addShow"></addIpsec>
    <editIpsec ref="edit" v-show="editShow"></editIpsec>
    <grageSet ref="grageSet" v-show="grageSetShow"></grageSet>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// Here you can import other files (such as: components, tools js, third-party plug-ins JS, JSON files, image files, etc.)
//例如：import 《组件名称》 from '《组件路径》';
// For example: import component name from 'Component path ';
import addIpsec from './components/addIpsec'
import grageSet from './components/grageSet'
import editIpsec from './components/editIpsec'
import { ipSec,ipSecGetOperation,ipSecAreBeenQuoted } from '@/services'
export default {
  //import引入的组件需要注入到对象中才能使用
  // Import introduces components that need to be injected into an object before they can be used
  components: { addIpsec,editIpsec,grageSet },
  data() {
    return {
      tableData: [],
      allNum: 0,
      pageNumber: 1,
      pageSize: 10,
      addShow: false,
      editShow: false,
      grageSetShow: false,
      deviceId: JSON.parse(this.$route.query.devData).deviceId,
      tenantId: sessionStorage.getItem("tenantValue"),
      multipleSelection: [],
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
    set(row){
      //高级设置
      // Advanced Settings
      this.grageSetShow = true
      console.log(row)
      ipSecGetOperation({deviceId:this.deviceId}).then(res=>{
        this.$refs.grageSet.dpdActionList = res.result.actionOperation
      })
      this.$refs.grageSet.formInline.ipsecId = row.id
      this.$refs.grageSet.formInline.ikeEncryption = row.ikeEncryption.split(',')
      this.$refs.grageSet.formInline.ikeIntegrity = row.ikeIntegrity.split(',')
      this.$refs.grageSet.formInline.ikeLifetime = row.ikeLifetime
      this.$refs.grageSet.formInline.lifetime = row.lifetime
      this.$refs.grageSet.formInline.dpdAction = row.dpdAction+''
      this.$refs.grageSet.formInline.dpdDelay = row.dpdDelay
      this.$refs.grageSet.formInline.dpdTimeout = row.dpdTimeout
      this.$refs.grageSet.formInline.packageMode = row.packageMode==1?true:false
      this.$refs.grageSet.formInline.securityPro = row.securityPro==1?true:false
      this.$refs.grageSet.formInline.dpd = row.dpd==1?true:false
      this.$refs.grageSet.openShow = row.dpd==1?true:false
      this.$refs.grageSet.formInline.dhGroup = row.dhGroup.split(',')
      this.$refs.grageSet.formInline.espAuthentication = row.espAuthentication.split(',')
      this.$refs.grageSet.formInline.espEncryption = row.espEncryption.split(',')

    },
    handleClick(row){
      //编辑
      // edit
      this.editShow = true
      ipSecGetOperation({deviceId:this.deviceId}).then(res=>{
        this.$refs.edit.portList = res.result.portOperation
      })
      ipSecAreBeenQuoted({action:'edit',verifyIds:[row.id]}).then(res=>{
        if(res.code==10000){
          this.$refs.edit.id = row.id //id
          this.$refs.edit.formInline.name = row.name //名称
                                                     // The name of the
          this.$refs.edit.formInline.oppositeAddr = row.oppositeAddr //对端地址
                                                                     // To end the address
          this.$refs.edit.formInline.oppositeID = row.oppositeID //对端ID
                                                                 // The client ID
          this.$refs.edit.formInline.oppositeSubnet = row.oppositeSubnet //对端子网
                                                                         // The terminal network
          this.$refs.edit.formInline.selfID = row.selfID //本端ID
                                                         // The client ID
          this.$refs.edit.formInline.localip = row.selfIpv4 //本端IP
                                                            // The end of the IP
          this.$refs.edit.formInline.localport = row.selfPort //本端接口
                                                              // This end interface
          this.$refs.edit.formInline.selfSubnet = row.selfSubnet //本端子网
                                                                 // This terminal network
          this.$refs.edit.formInline.shareKey = row.approveContent //预共享密钥
                                                                   // Preshared key
          this.$refs.edit.checked1 = row.approve==0?true:false //密钥
                                                               // The key
          this.$refs.edit.checked2 = row.approve==1?true:false //证书
                                                               // certificate
        }else{
          this.$message({
            type:'warning',
            message: res.message
          })
        }
      })
      // console.log(row)
    },
    del(row){
      //删除
      // delete
      ipSecAreBeenQuoted({action:'del',verifyIds:[row.id]}).then(res=>{
         if(res.code==10000){
           this.$message({
              type: "success",
              message: this.$t("Log.hint5")
            });
            this.getList()
         }else{
           this.$message({
              type: "error",
              message: res.message
            });
         }
      })
    },
    choseDel(){
      //多选删除
      // Much choose delete
      // console.log(this.multipleSelection)
      let ids = []
      this.multipleSelection.map(item=>{
        ids.push(item.id)
      })
      ipSecAreBeenQuoted({action:'del',verifyIds:ids}).then(res=>{
         if(res.code==10000){
           this.$message({
              type: "success",
              message: this.$t("Log.hint5")
            });
            this.getList()
         }else{
           this.$message({
              type: "error",
              message: res.message
            });
         }
      })
    },
    handleSelectionChange(val){
      //多选删除数据
      // Multi-select delete data
      this.multipleSelection = val;
    },
    indexMethod(index) {
      return index + 1 + (this.pageNumber==1?0:this.pageSize*(this.pageNumber-1));
    },
    //获取ipsec列表展示
    // Get the IPSec list display
    getList(){
      let params = {
        deviceId: this.deviceId,
        pageNumber: 1,
        pageSize: 10
      }
      ipSec(params).then(res=>{
        this.tableData = res.result.content
        this.allNum = res.result.totalElements
      })
    }, 
    pageChange(val) {
      //页数总条目改变
      // Total page entries change
      this.pageSize = val;
      this.getList();
    },
    sizeChange(val) {
      //页数改变
      // Page number change
      this.pageNumber = val;
      this.getList();
    },
    add(){
      this.addShow = true
      ipSecGetOperation({deviceId:this.deviceId}).then(res=>{
        this.$refs.add.portList = res.result.portOperation
      })
    },
    edit(){
      this.editShow = true
    },
    highSet(){
      this.grageSetShow = true
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  // Life cycle - Creation complete (you can access the current this instance)
  created() {
    class dataInit{
      constructor(data){
        this.data = data
      }
      filterData(){
        return this.data
      }
    }
    let obj = new dataInit('孙淑容是个沙雕')
    console.log(obj)
    this.getList()
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
.ipsec {
  padding: 20px 30px 0 30px;
}
.operate {
  zoom: 1;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  button {
    float: right;
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    border: none;
    outline: none;
    cursor: pointer;
    display: table-cell;
    vertical-align: middle;
    img {
      width: 14px;
      height: 14px;
      position: relative;
      top: 1px;
    }
  }
  .add:hover {
    background: #6095d6;
  }
  .close {
    float: right;
    background: rgba(239, 239, 239, 1);
    color: #333333;
    border: 1px solid rgba(209, 215, 224, 1);
    margin-left: 23px;
  }
}
.tableView {
  padding-top: 20px;
}
.tableList {
  line-height: 40px;
}
.tableList:first-of-type {
  border-bottom: 1px solid #ebeef5;
}
.tableList:last-of-type {
  border: 0;
}
</style>