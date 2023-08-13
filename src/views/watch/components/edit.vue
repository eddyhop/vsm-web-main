<template>
  <div class="accountAdd" id="accountEdit">
    <div class="inner">
      <div class="top">
        <h2>{{this.$t('Monit.edit')}}</h2>
        <i @click="close">
          <img src="../../../assets/icon_close.png" alt />
        </i>
      </div>
      <div class="form">
        <el-form
          :model="ruleForm"
          ref="form"
          :rules="rules"
          class="demo-ruleForm formList"
          :hide-required-asterisk="true"
          @submit.native.prevent
        >
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('Monit.name')" label-width="40px" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('Monit.type')" label-width="40px">
                <el-select filterable v-model="ruleForm.type">
                  <el-option :label="$t('Monit.outlink')" value="2"></el-option>
                  <el-option :label="$t('Monit.outdev')" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('Monit.group')" :class="`last ${lang=='en'? 'enLast': ''}`" label-width="70px" prop="address">
                <el-select filterable v-model="ruleForm.address">
                  <el-option v-for="item in groupList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="devList" v-if="ruleForm.type=='1'">
          <div class="left-cont opt">
            <div class="search">
              <p class="title">{{$t('Monit.waitDev')}}</p>
              <el-input v-model="searchDev" @input="devSearch(searchDev)" :placeholder="$t('Monit.plea1')" prefix-icon="el-icon-search"></el-input>  
            </div>
            <el-checkbox-group @change="pickDev" v-model="value">
              <div class="devItem" v-for="item in data" :key="item.id">
                <el-checkbox :label="item.name +','+ item.id">
                  <span class="devName">
                    <b>{{item.name.split(',')[0]}}</b>
                    <i>{{item.name.split(',')[1]}}</i>
                  </span>
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
          <div class="right-cont opt">
            <p class="title">{{$t('Monit.hadDev')}}</p>
            <el-checkbox-group @change="clearDev" v-model="value2">
              <div class="devItem" v-for="item in value2" :key="item">
                <el-checkbox :label="item">
                  <span class="devName">
                    <b>{{item.split(',')[0]}}</b>
                    <i>{{item.split(',')[1]}}</i>
                  </span>
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
        </div>
        <div class="devList" v-else>
          <div class="left-cont opt">
            <div class="search">
              <p class="title">{{$t('Monit.waitLink')}}</p>
              <el-input  v-model="searchLink" @input="linkSearch" :placeholder="$t('Monit.plea2')" prefix-icon="el-icon-search"></el-input>  
            </div>
            <el-checkbox-group @change="pickLink" v-model="linkValue">
              <div class="devItem" v-for="item in linkData" :key="item.id">
                <el-checkbox :label="item.name +','+ item.id">
                  <span class="devName">
                    <b>{{item.name.split(',')[0]}}</b>
                    <i>{{item.name.split(',')[1]}}</i>
                  </span>
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
          <div class="right-cont opt">
            <p class="title">{{$t('Monit.hadLink')}}</p>
            <el-checkbox-group @change="clearLink" v-model="linkValue2">
              <div class="devItem" v-for="item in linkValue2" :key="item">
                <el-checkbox :label="item">
                  <span class="devName">
                    <b>{{item.split(',')[0]}}</b>
                    <!-- <i>{{item.split(',')[1]}}</i> -->
                  </span>
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
        </div>
        <div class="control">
          <button class="save" v-debounce="save">{{$t('Monit.save')}}</button>
          <button class="cancel" @click="close">{{$t('Monit.cancel')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { monitorMail,mailCheck } from "@/services";
export default {
  props: ["scopeAdd"],
  data() {
    var checkName = (rule, value, callback)=>{
      if(value){
        mailCheck({id: this.id,name: value}).then(res=>{
          if(res.code==10000){
            callback()
          }else{
            callback(new Error(this.$t('Monit.remind8')))
          }
        })
      }
    }
    return {
      id: "",
      data: [],
      data2: [],
      value: [],
      value2: [],
      linkData: [],
      linkData2: [],
      linkValue: [],
      linkValue2: [],
      groupList: [],
      searchDev: "",
      searchLink: "",
      lang: sessionStorage.getItem('lang'),
      ruleForm: {
        type: "1",
        name: "",
        address:""
      },
      rules:{
        name: [
          { required: true, message: this.$t('Monit.remind6'), trigger: "blur" },
          { validator: checkName, trigger: "change" }
        ],
        address: [
          { required: true, message: this.$t('Monit.remind9'), trigger: "change" }
        ]
      }
    };
  },
  methods: {
    dataInit(data){
      this.ruleForm.type = data.type.toString()
      this.ruleForm.name = data.name
      this.id = data.id
      this.ruleForm.address = data.groupId
      data.type == 1 ?
       this.value = this.value2 = data.items.map(item=>{
         let str = item.name + ' ' + item.id
         return str.split(' ').join(',')
         }) :
       this.linkValue = this.linkValue2 = data.items.map(item=>{return item.name+','+item.id})
    },
    //链路搜索
    // Link to search
    linkSearch(val) {
      if (val.length) {
        this.linkData = this.linkData.filter(this.createFilter(val));
      } else {
        this.linkData = this.linkData2;
      }
    },
    //设备搜索
    // Equipment search
    devSearch(val) {
      if (val.length) {
        this.data = this.data.filter(this.createFilter(val));
      } else {
        this.data = this.data2;
      }
    },
    //模糊查找
    // Fuzzy search
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.name
            .replace(",", "")
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) !== -1
        );
      };
    },
    //选中链路
    // Select the link
    pickLink(val){
      // console.log(val)
      this.linkValue2 = val
    },
    //取消选中链路
    // Unchecked link
    clearLink(val){
      // console.log(val)
      this.linkValue = val
    },
    //选中
    // The selected
    pickDev(val){
      // console.log(val)
      this.value2 = val
    },
    //取消选中
    // uncheck
    clearDev(val){
      // console.log(val,2)
      this.value = val
    },
    // 关闭弹窗
    // Close Windows
    close() {
      this.$parent.isShowEdit = false;
      this.value = this.value2 = []
      this.linkValue = this.linkValue2 = []
      this.$refs.form.resetFields();
    },
    save(formName){
      let params = {
        id: this.id,
        name: this.ruleForm.name,
        type: this.ruleForm.type,
        groupId: this.ruleForm.address,
        itemIds: this.ruleForm.type == 1?
          this.value2.map(item=>{
            return item.split(',')[2]
          }):
          this.linkValue2.map(item=>{
            return item.split(',')[1]
          })
      }
      // console.log(params)
      this.$refs[formName].validate(valid => {
        if (valid) {
          if(this.ruleForm.type==1){
            if(this.value2.length==0){
              this.$message({
                message: this.$t('Monit.remind10'),
                type: "warning"
              });
            }else{
              monitorMail(params).then(res=>{
                if(res.code==10000){
                  this.$message({
                    message: this.$t('Monit.remind3'),
                    type: "success"
                  });
                  this.$parent.litePage()
                  this.close()
                }else{
                  this.$message({
                    message: this.$t('Monit.remind4'),
                    type: "warning"
                  });
                }
              })
            }
          }else{
            if(this.linkValue2.length==0){
              this.$message({
                message: this.$t('Monit.remind11'),
                type: "warning"
              });
            }else{
              monitorMail(params).then(res=>{
                if(res.code==10000){
                  this.$message({
                    message: this.$t('Monit.remind3'),
                    type: "success"
                  });
                  this.$parent.litePage()
                  this.close()
                }else{
                  this.$message({
                    message: this.$t('Monit.remind4'),
                    type: "warning"
                  });
                }
              })
            }
          }
          
        }else{
          return false
        }
      })
      
    }
       
  }
};
</script>
<style lang="scss" scoped>
.accountAdd {
  width: 100%;
  height: 100%;
  background: rgba(32, 42, 59, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  .control{
    margin-top: 30px;
    text-align: center;
    .save{
      width:100px;
      background:rgba(54,120,200,1);
      color: #fff;
      margin-right: 20px;
    }
    button{
      width:70px;
      height:34px;
      background:rgba(255,255,255,1);
      border-radius:2px;
      border:1px solid rgba(209,215,224,1);
      font-size:14px;
      font-family:arial, sans-serif;
      font-weight:400;
      color:rgba(102,102,102,1);
      &:hover{
        background: rgba(96, 149, 214, 1);
        color: #fff;
      }
    }
  }
  .devList{
    width: 100%;
    display: flex;
    justify-content: space-between;
    .opt{
      width:310px;
      height:360px;
      border:1px solid rgba(209,215,224,1);
      overflow: auto;
      padding: 10px 20px;
      .title{
        line-height: 20px;
        height: 30px;
      }
      .search{
        margin-bottom: 10px;
      }
      .devItem{
        height: 25px;
      }
      .devName {
        zoom: 1;
        &:after {
          display: block;
          clear: both;
          content: "";
          visibility: hidden;
          height: 0;
        }
        b,
        i {
          max-width: 103px;
          font-style: normal;
          font-size: 14px;
          font-family: arial, sans-serif;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        b {
          padding-right: 10px;
        }
      }
    }
    .opt ::v-deep .el-input__inner{
      width: 270px;
      height:34px;
    }
    .opt::-webkit-scrollbar {
      width: 4px;
      /*height: 4px;*/
    }
    .opt::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: rgba(0, 0, 0, 0.2);
    }
    .opt::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 0;
      background: rgba(0, 0, 0, 0.1);
    }
  }
  .inner {
    width: 700px;
    height: 577px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -350px;
    margin-top: -238.5px;
    .top {
      height: 49px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 18px;
      border-bottom: 1px solid #d1d7e0;
      h2 {
        font-size: 14px;
        font-family: arial, sans-serif;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
      i {
        img {
          width: 14px;
          height: 14px;
        }
      }
    }
    .form {
      padding: 20px 30px;
      .formList ::v-deep .el-input__inner{
        width: 155px;
        height:34px;
      }
      .last ::v-deep .el-input__inner{
        width: 143px;
      }
      .enLast ::v-deep .el-form-item__label{
        line-height: normal;
      }
    }
  }
}
</style>

