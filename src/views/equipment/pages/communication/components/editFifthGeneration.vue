<template>
  <div class="editFifthGeneration">
    <div class="context">
      <div class="title">
        VSN-LTE
        <span class="close" @click="close"></span>
      </div>
      <div class="item" :style="lang=='en'?'':'marginLeft:70px'">
        <el-form :model="form" :rules="rules" ref="form" label-width="auto" :inline="true" :disabled="!isEdit" class="demo-ruleForm" @submit.native.prevent>
          
          <!-- <el-form-item label="name" prop="conName">
            <div class="item-ipt">
              <el-input v-model="form.conName"  size="small"></el-input>
            </div>
          </el-form-item> -->
          <el-form-item label="Apn" prop="apn">
            <div class="item-ipt">
              <el-input v-model="form.apn"  size="small"></el-input>
            </div>
          </el-form-item>
            <div class="contr">
              <button type="primary" v-debounce="save" class="save">{{$t('vsr100.static.save')}}</button>
              <button @click.prevent="close" class="cancel">{{$t('vsr100.static.cancel')}}</button>
            </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { getFifthG, editFifthG } from "@/services";
import { compare } from "@/utils/change";
export default {
  data() {
    return {
      deviceId:JSON.parse(this.$route.query.devData).deviceId,
      isEdit:false,
      lang:sessionStorage.getItem('lang'),
      form: {
        conName: "VSN-LTE",
        apn: "",
      },
      rules: {
        apn : [
          {
            required: true,
            message: this.$t("vsr100.lan.enterContent"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    close() {
      this.$parent.editShow = false;
      this.$refs.form.resetFields();
    },
    save(formName) {
      let params = {
        id: this.form.id,
        deviceId: this.deviceId,
        conName: "VSN-LTE",
        apn: this.form.apn,
      };
      this.$refs[formName].validate(valid => {
        if (valid) {
          editFifthG(params).then(res => {
            // console.log(res)
            if (res.code == 10000) {
              this.$message({
                message: this.$t('vsr100.static.remind[11]'),
                type: "success"
              });
              this.close();
              this.$parent.getList();
            } else {
              this.$message.error(this.$t('vsr100.static.remind[12]'),);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  created(){
    
  }
};
</script>
<style lang="scss" scoped>
.item-ipt {
  width: 320px;
}
.item {
  margin-top: 10px;
  padding: 10px;
  .contr {
    text-align: center;
    // margin-left: 20px;
    margin-bottom: 28px;
  }
  .save:hover{
    background:rgba(96,149,214,1);
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
  .cancel {
    margin-left: 18px;
    background: rgba(255, 255, 255, 1);
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    border: 1px solid rgba(209, 215, 224, 1);
  }
}
.context {
  width: 530px;
  // height: 387px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 15px 30px 0px rgba(191, 198, 217, 0.15);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: auto;
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
      background-image: url("../../../../../assets/icon_close.png");
      background-size: 14px 14px;
    }
  }
}
.editFifthGeneration {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background:rgba(32,42,59,0.2);
  z-index: 100;
}
</style>
<style lang="scss">
  .editFifthGeneration{
    .el-select{
      width: 100%;
      height: 32px;
      .el-input{
        height: 100%;
        .el-input__inner{
          height: 100%;
        }
        .el-input__icon{
          line-height: normal;
        }
      }
    }
  }
</style>