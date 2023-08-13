<template>
  <div class="addSTATIC">
    <div :class="`context ${lang=='en'?'contextEn':''}`">
      <h4 class="title">
        <span>{{$t('App.edit')}}{{$t('App.applicationGroups')}}  </span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="event">
        <el-form
            :model="appForm"
            :rules="rules"
            ref="form"
            :label-width="`${lang=='en'?'135px':'100px'}`"
            class="demo-ruleForm"
            @submit.native.prevent
        >

          <el-form-item :label="$t('vsr1000.name')" prop="groupName">
            <el-input v-model="appForm.groupName"  placeholder="Please enter the application name" ></el-input>
          </el-form-item>

          <el-form-item :label="$t('vsr1000.describe')" prop="groupDesc">
            <el-input v-model="appForm.groupDesc" placeholder="Please enter"></el-input>
          </el-form-item>

          <div class="submit">
            <button class="save" v-debounce.prevent="submitForm">{{$t('vsr1000.save')}}</button>
            <button class="cancel" @click.prevent="close">{{$t('vsr1000.cancel')}}</button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {
  addAppGroup, checkAppGroupName,
} from "@/services";
export default {
  props: {},
  components: {},
  data() {
    var checkName = (rule,value,callback) => {
      if(value!=this.lodName){
        if(value){
          checkAppGroupName({groupName:value,tenantId:this.tenantId}).then(res=>{
            if(res.code==10000){
              callback()
            }else{
              callback(new Error(this.$t('App.existsName')))
            }
          })
        }
      }else{
        callback()
      }
    }
    return {
      lang: "",
      appForm: {
        id:"",
        groupName: "",
        groupDesc: "",
        tenantId:"",
      },
      lodName:"",
      type: 0,
      page: 1,
      pageSize: 5,
      page2: 1,
      tenantId :this.$parent.rent,
      rules: {
        groupName: [
          {
            required: true,
            message: this.$t("vsr1000.greRule[0]"),
            trigger: "blur"
          },
          {
            validator: checkName,
            trigger: "blur"
          }
        ],
      }
    };
  },
  computed: {},
  methods: {
    close() {
      this.$refs.form.resetFields();
      this.$parent.editGroupShow = false;
    },
    submitForm(formName) {

      let data = {
        id:this.appForm.id,
        groupName: this.appForm.groupName,
        groupDesc : this.appForm.groupDesc ,
        tenantId: this.appForm.tenantId,
      };
      // console.log(this.$refs[formName].validate(),data);
      this.$refs[formName].validate(valid => {
        if (valid) {
          addAppGroup(data).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[0]")
              });

              this.$refs[formName].resetFields();
              this.$parent.editGroupShow = false;
              let params= {tenantId: this.tenantId};
              this.$parent.AppGroup(params);
            } else {
              this.$message({
                type: "warning",
                message: res.message
              });
              this.$refs[formName].resetFields();
              this.$parent.editGroupShow = false;
            }
            // console.log(res);
          });
        } else {
          return false;
        }
      });
    },
  },
  created() {
    this.lang = sessionStorage.getItem("lang");
  },
  mounted() {}
};
</script>
<style scoped lang="scss">
.addSTATIC {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.2);
  z-index: 100;
}
.context {
  width: 462px;
  // height: 392px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 15px 30px 0px rgba(191, 198, 217, 0.15);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: auto;
  .title {
    width: 100%;
    height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid rgba(231, 231, 231, 1);
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    i {
      width: 14px;
      height: 14px;
      background-size: cover;
      cursor: pointer;
    }
  }
}
.contextEn {
  width: 560px;
}
.event {
  padding: 30px 30px 30px 10px;
}
.submit {
  width: 100%;
  text-align: center;
  .save {
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    outline: none;
    border: 0;
    cursor: pointer;
    margin-left: 18px;
  }
  .cancel {
    width: 100px;
    height: 34px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    border: 1px solid rgba(209, 215, 224, 1);
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    margin-left: 18px;
  }
  .save:hover {
    background: #6095d6;
  }
}
.serverData {
  max-height: 257px;
  width: 100%;
}
</style>
<style lang="scss">
.addSTATIC .el-select {
  // width: 100%;
}
.addSTATIC {
  .el-input {
    width: 322px;
    height: 34px;
    .el-input__inner {
      height: 100%;
      border-radius: 7px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
  .el-form-item__label {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
}
</style>
