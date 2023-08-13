<template>
  <div class="adduser">
    <div class="cont">
      <div class="title">
        {{$t('UserMan.addTenant')}}
        <span @click="close"></span>
      </div>
      <div class="even">
        <el-form :model="form" :rules="rules" ref="form" label-width="120px" @submit.native.prevent>
          <el-form-item :label="$t('UserMan.tenant')" prop="val">
            <div class="a">
              <el-select filterable
                v-model="form.val"
                size="small"
                @change="getRole()"
                :placeholder="$t('UserMan.hint7')"
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
            <el-input v-model="form.name" :placeholder="$t('UserMan.hint6')" size="small"></el-input>
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
              <el-select filterable v-model="form.val2" :placeholder="$t('UserMan.hint8')" size="small">
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
import {addControlUser, getUserPermission, userInfo, vrfName} from "@/services";
export default {
  data() {
    var checkRole = (rule, value, callback) => {
      if (value) {
        if (this.form.val == "") {
          callback(new Error(this.$t("UserMan.hint8")));
        }
      }
    };

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
      type:"",
      form: {
        options: [],
        val:sessionStorage.getItem("tenantValue"),
        opt2: [],
        val2: "",
        name: "",
        pass: ""
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
          }
          ,
          {
            pattern:/(?!^(\d+|[a-zA-Z]+|[~`!@#$%^&*()_\-\]\[+={}|:;<,>.?/]+)$)^[\w~`!@#$%^&*()_\-\]\[+={}|:;<,>.?/]{8,200}$/,
            // 正则表达式
            message: this.$t("UserMan.hint12")
          },
          {
            validator: checkLength, trigger: 'blur' }
        ],
        val2: [
          {
            required: true,
            message: this.$t("UserMan.hint9"),
            trigger: "change"
          }
          // { validator: checkRole, trigger: 'change' }
        ]
      }
    };
  },
  methods: {
    getRole() {
      this.form.val2 = "";
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
        type: 2,
        tenantId: this.form.val
      };
      this.$refs[formName].validate(valid => {
        if (valid) {
          addControlUser(params).then(res => {
            // console.log(res)
            if (res.code == 10000) {
              this.$message({
                message: this.$t("UserMan.hint10"),
                type: "success"
              });
              this.close();
              this.$parent.getRentList({
                type: "1",
                page: this.$parent.rentNum,
                pageSize: this.$parent.rentSize,
                username: this.$parent.rentKey
              });
            } else{
              this.$message({
                message: this.$t("UserMan.hint11"),
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
      this.$parent.zhShow = false;
      this.$refs.form.resetFields();
    }
  }
};
</script>
<style lang="scss" scoped>
.even {
  width: 440px;
  margin: 0 auto;
  margin-top: 30px;
  margin-left: -15px;
  text-align: center;
  .el-form-item{
    margin-bottom: 40px;
  }
  .a {
    div {
      width: 320px;
    }
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
  width: 462px;
  height: 450px;
  background: white;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -231px;
  margin-top: -194px;
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
.adduser {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 9;
  background: rgba(32, 42, 59, 0.2);
}
</style>