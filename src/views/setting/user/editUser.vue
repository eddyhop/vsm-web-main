<template>
  <div class="edituser">
    <div class="cont">
      <div class="title">
        {{$t('UserMan.editSuper')}}
        <span @click="close"></span>
      </div>
      <div class="even">
        <el-form :model="form" :rules="rules" ref="form" label-width="150px" @submit.native.prevent>
          <el-form-item :label="$t('UserMan.Username1')" prop="name">
            <el-input
              :disabled="form.name=='vsmAdmin'"
              v-model="form.name"
              :placeholder="$t('UserMan.hint1')"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('UserMan.oldPass')" prop="oldpass">
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
          <!-- <el-form-item :label="$t('UserMan.power')" prop="value">
                        <div class="a">
                            <el-select filterable v-model="form.value" :placeholder="$t('UserMan.choose')" size="small">
                                <el-option
                                v-for="item in form.options"
                                :key="item.id"
                                :value="item.id"
                                :label="item.name">
                                </el-option>
                            </el-select>
                        </div>
          </el-form-item>-->
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
import { editControlUser } from "@/services";
export default {
  data() {
    return {
      form: {
        name: "",
        pass: "",
        oldpass: "",
        id: "",
        options: [],
        value: ""
      },
      rules: {
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
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,}$/,
            message: this.$t("UserMan.hint12")
          }
        ],
        oldpass: [
          { required: true, message: this.$t("UserMan.hint3"), trigger: "blur" },
          {
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,}$/,
            message: this.$t("UserMan.hint12")
          }
          // { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/, message: '密码至少包含大写字母，小写字母，数字，且不少于8位' }
          // { pattern: /^(? =.*[a-z])(? =.*[A-Z])(? =. * \ d) ^ 16th {8} $/, the message: 'password at least contains uppercase letters, lowercase letters, Numbers, and no less than eight'}
        ],
        value: [
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
    save(formName) {
      let params = {
        username: this.form.name,
        password: this.form.pass,
        // roleIdArr:[this.form.value],
        id: this.form.id,
        oldPassword: this.form.oldpass,
       // userId: JSON.parse(sessionStorage.getItem("userData")).userId,
        type: 1
      };
      this.$refs[formName].validate(valid => {
        if (valid) {
          editControlUser(params).then(res => {
            // console.log(res)
            if (res.code == 10000) {
              this.$message({
                message: this.$t("UserMan.hint17"),
                type: "success"
              });
              this.close();
              this.$parent.getUserList({
                type: "2",
                page: this.$parent.userNum,
                pageSize: this.$parent.userSize,
                username: this.$parent.userKey
              });
            } else {
              this.$message({
                message: res.message,
                type: "warning"
              });
              this.close();
            }
            // if (res.message == this.$t("UserMan.hint18")) {
            //   this.$message({
            //     message: this.$t("UserMan.hint18"),
            //     type: "warning"
            //   });
            // } else if (res.message == this.$t("UserMan.hint19")) {
            //   this.$message({
            //     message: this.$t("UserMan.hint19"),
            //     type: "warning"
            //   });
            // }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    close() {
      this.$parent.editUserShow = false;
      this.$refs.form.resetFields();
    }
  }
};
</script>
<style lang="scss" scoped>
.even {
  width: 450px;
  margin: 0 auto;
  margin-top: 30px;
  text-align: center;
  margin-left: -5px;
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
    margin-top: 5px;
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
  width: 482px;
  // height:388px;
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
.edituser {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 9;
  background: rgba(32, 42, 59, 0.2);
}
</style>