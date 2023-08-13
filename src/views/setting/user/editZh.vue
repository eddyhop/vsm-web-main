<template>
  <div class="editZh">
    <div class="cont">
      <div class="title">
        {{$t('UserMan.edieTenAministrator')}}
        <span @click="close"></span>
      </div>
      <div class="even">
        <el-form :model="form" :rules="rules" ref="form" label-width="150px" @submit.native.prevent>
          <el-form-item :label="$t('UserMan.tenant')" prop="val">
            <div class="a">
              <el-select filterable
                v-model="form.val"
                :placeholder="$t('UserMan.hint7')"
                size="small"
                :disabled="this.type==1?false:true"
                @change="getRole()"
              >
                <el-option
                  v-for="item in form.options"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item :label="$t('UserMan.Username1')" prop="name">
            <el-input v-model="form.name" :placeholder="$t('UserMan.hint1')" size="small"></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('UserMan.oldPass')"
            v-show="this.type==1?false:true"
            prop="oldpass"
          >
            <el-input
              v-model="form.oldpass"
              :placeholder="$t('UserMan.hint3')"
              show-password
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('UserMan.password1')" prop="pass">
            <el-input
              v-model="form.pass"
              :placeholder="$t('UserMan.hint4')"
              show-password
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('UserMan.permission')" prop="val2">
            <div class="a">
              <el-select filterable v-model="form.val2" :placeholder="$t('UserMan.choose')" size="small">
                <el-option
                  v-for="item in form.opt2"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item>
            <div class="contr">
              <button v-debounce="save" class="save">{{$t('UserMan.save')}}</button>
              <button @click.prevent="close" class="cancel">{{$t("UserMan.cancel")}}</button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {editControlUser, getUserPermission, userInfo} from "@/services";
export default {
  data() {
    var checkLength = (rule, value, callback)=>{
      if(value){
        var len = value.length;
        if(len>=8&&len<=16){
          callback()
        }else{
          callback(new Error(this.$t('UserMan.hint20')))
        }
      }
    }
    return {
      type: "",
      form: {
        options: [],
        val: sessionStorage.getItem("tenantValue") ,
        opt2: [],
        val2: "",
        name: "",
        pass: "",
        oldpass: "",
        id: ""
      },
      rules: {
        val: [
          {
            required: true,
            message: this.$t("UserMan.hint8"),
            trigger: "change"
          }
        ],
        name: [
          {
            required: true,
            message: this.$t("UserMan.hint6"),
            trigger: "blur"
          },
          {
            pattern: /^[a-zA-Z][a-zA-Z0-9]{5,32}$/,
            message: this.$t("UserMan.hint2")
          }
        ],
        pass: [
          {
            required: true,
            message: this.$t("UserMan.hint4"),
            trigger: "blur"
          },
          {
            pattern:/(?!^(\d+|[a-zA-Z]+|[~`!@#$%^&*()_\-\]\[+={}|:;<,>.?/]+)$)^[\w~`!@#$%^&*()_\-\]\[+={}|:;<,>.?/]{8,200}$/,
            message: this.$t("UserMan.hint12")
          },
          {
            validator: checkLength, trigger: 'blur' }
        ],
        oldpass:[
          {
            required: true,
            message: this.$t("UserMan.hint3"),
            trigger: "blur"
          },
          {
            pattern:/(?!^(\d+|[a-zA-Z]+|[~`!@#$%^&*()_\-\]\[+={}|:;<,>.?/]+)$)^[\w~`!@#$%^&*()_\-\]\[+={}|:;<,>.?/]{8,16}$/,
            message: this.$t("UserMan.hint12")
          }
        ],
        val2: [
          {
            required: true,
            message: this.$t("UserMan.hint9"),
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    getRole() {
      this.form.val2 = ""
      getUserPermission({ tenantId: this.form.val }).then(res => {
        this.form.opt2 = res.result;
      });
    },
    save(formName) {
      let params = {
        belongsRent: this.form.val,
        username: this.form.name,
        roleId: this.form.val2,
        password: this.form.pass,
        id: this.form.id,
        oldPassword: this.form.oldpass,
        type: 2,
        tenantId:this.form.val
      };
      this.$refs[formName].validate(valid => {
        if (valid) {
          editControlUser(params).then(res => {
            if (res.code == 10000) {
              this.$message({
                message: this.$t("UserMan.hint17"),
                type: "success"
              });
              this.close();
              this.$parent.getRentList({
                type: "1",
                page: this.$parent.rentNum,
                pageSize: this.$parent.rentSize,
                username: this.$parent.rentKey
              });
            } else {
              this.$message({
                message: res.message,
                type: "warning"
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    created() {
      userInfo().then(res => {
        this.type = res.result.type;
      });
    },
    close() {
      this.$parent.editZhShow = false;
      this.$refs.form.resetFields();
    }
  }
};
</script>
<style lang="scss" scoped>
.even {
  width: 470px;
  margin: 0 auto;
  margin-top: 30px;
  margin-left: -15px;
  text-align: center;
  .a {
    div {
      width: 320px;
    }
  }
  .el-form-item{
    margin-bottom: 40px;
  }
  .remaind {
    color: darkgray;
  }
  .contr {
    margin-left: -60px;
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
.cont {
  width: 492px;
  min-height: 450px;
  background: white;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -231px;
  margin-top: -219px;
  border-radius: 7px;
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
      background-image: url("../../../assets/icon_close.png");
      background-size: 14px 14px;
    }
  }
}
.editZh {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 9;
  background:rgba(32,42,59,0.2);
}
</style>