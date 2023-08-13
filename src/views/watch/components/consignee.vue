<template>
  <div class="accountAdd" id="accountadd">
    <div class="inner">
      <div class="top">
        <h2>{{this.$t('Monit.set')}}</h2>
        <i @click="close">
          <img src="../../../assets/icon_close.png" alt />
        </i>
      </div>
      <div class="form">
        <el-form :model="dynamicValidateForm" ref="form" :inline="true" class="demo-dynamic" @submit.native.prevent>
          <el-form-item
            v-for="(domain, index) in dynamicValidateForm.domains"
            :key="domain.key"
            :prop="'domains.' + index "
            :rules="mail"
          >
            <el-input style="width: 170px; margin-right: 10px" v-model="domain.name" :placeholder="$t('Monit.consigneeName')"></el-input>
            <el-input style="width: 400px; margin-right: 10px" v-model="domain.email" :placeholder="$t('Monit.consigneeEmail')"></el-input>
            <!-- <button class="del" v-if="index==0" @click.prevent="addDomain"><p class="el-icon-plus"></p></button> -->
            <button class="add" @click.prevent="removeDomain(domain)"><p class="el-icon-close"></p></button>
          </el-form-item>
          <!-- <el-form-item> -->
            <!-- <el-button type="primary" @click="submitForm('form')">提交</el-button> -->
            <!-- <el-button @click="addDomain">新增域名</el-button> -->
          <!-- </el-form-item> -->
        </el-form>
        <div class="control">
          <button class="del" @click.prevent="addDomain"><p class="el-icon-plus"></p></button>
          <button class="save" v-debounce="save">{{this.$t('Monit.save')}}</button>
          <button class="cancel" @click="close">{{this.$t('Monit.cancel')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { multiAddGroup,mailCanDel,delMailGroup } from "@/services";
export default {
  props: ["scopeConsignee"],
  data() {
    var checkItem = (rule,value,callback)=>{
      if(value){
        // console.log(value)
        let valObj = this.dynamicValidateForm.domains
        if(value.name==''){
          callback(new Error(this.$t('Monit.remind6')))
        }else{
          let repeat = 0
          valObj.map(item=>{
            if(item.name == value.name){
              repeat += 1
            }
          })
          if(repeat>1){
            callback(new Error(this.$t('Monit.remind8')))
          }else{
              let email = value.email.split(';')
              // console.log(email)
              let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
              email.map(item=>{
                if(reg.test(item)){
                  callback()
                }else{
                  callback(new Error(this.$t('Monit.remind7')))
                }
              })  
          }
        }
      }
    }
    return {
      dynamicValidateForm: {
        domains: [{
          email: '',
          name: '',
          id:''
        }],
      },
      mail:[
        { required: true, message: this.$t('Monit.remind6'), trigger: 'blur' },
        { validator: checkItem,trigger: 'blur'}
      ]
    };
  },
  methods: {
    save(formName) {
      let params = this.dynamicValidateForm.domains.map(item=>{
        let obj = {
          groupId: item.id,
          name: item.name,
          noticeMail: item.email
        }
        return obj
      })
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(valid)
          multiAddGroup(params).then(res=>{
            if(res.code==10000){
              this.$message({
                message: this.$t('Monit.remind3'),
                type: "success"
              });
              this.close()
            }else{
              this.$message({
                message: this.$t('Monit.remind4'),
                type: "warning"
              });
            }
          })  
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item)
      if(item.id == ''){
        if (index !== -1) {
          this.dynamicValidateForm.domains.splice(index, 1)
        }
      }else{
        mailCanDel({groupId: item.id}).then(res=>{
          if(res.code==10000){
            delMailGroup({groupId: item.id}).then(res=>{
              if(res.code == 10000){
                this.$message({
                  message: this.$t('Monit.remind1'),
                  type: "success"
                });
                if (index !== -1) {
                  this.dynamicValidateForm.domains.splice(index, 1)
                }
              }else{
                this.$message({
                  message: this.$t('Monit.remind2'),
                  type: "warning"
                });
              }
            })
          }else{
            this.$message({
              message: this.$t('Monit.remind5'),
              type: "warning"
            });
          }
        })  
      }
      
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        email: '',
        name: '',
        id: '',
        key: Date.now()
      });
    },
    // 关闭弹窗
    // Close Windows
    close() {
      this.$parent.isShowConsignee = false;
      this.$refs.form.resetFields();
    },
    //点击编辑将编辑框内的输入框都赋值
    // Click Edit to assign values to all the input fields in the edit box
    editAssignment(scopeEdit) {
      this.ruleForm.manufacturerName = scopeEdit.manufacturerName;
      this.ruleForm.name = scopeEdit.accountName;
      this.ruleForm.id = scopeEdit.cloudAccountId;
      this.ruleForm.access = scopeEdit.accessKeyId;
      this.ruleForm.secret = scopeEdit.accessKeySecret;
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
  .inner {
    width: 700px;
    height: 478px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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

    .form{
      padding: 30px;
      overflow: auto;
      height: 429px;
      .control{
        margin-top: 30px;
        text-align: center;
        .save{
          width:100px;
          background:rgba(54,120,200,1);
          color: #fff;
          margin-right: 20px;
        }
        .del{
          width: 70px;
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
      .add,.del{
        width:34px;
        height:34px;
        background:rgba(255,255,255,1);
        border-radius:2px;
        border:1px solid rgba(209,215,224,1);
        font-size: 20px;
      }
      .add{
        color: #3678C8;
      }
      .del{
        color: #999999;
      }
      &::v-deep .el-input__inner{
        height: 34px;
      }
      &::-webkit-scrollbar {
        width: 4px;
        /*height: 4px;*/
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: rgba(0, 0, 0, 0.2);
      }
      &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 0;
        background: rgba(0, 0, 0, 0.1);
      }
    }
  }
}
#accountadd .groups ::v-deep .el-input__inner {
  width: 100%;
}
#accountadd .Lists ::v-deep .el-input__inner {
  width: 100%;
}
</style>
