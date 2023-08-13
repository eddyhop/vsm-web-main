<template>
  <div class="contents VpnPop">
    <div :class="`inner devList ${lang == 'en' ? 'innerEn' : ''}`">
      <div class="top">
        <h2>{{ $t("Traffic.addTrafficProfile") }}</h2>
        <i @click="$parent.showAddTrafficProfile = false">
          <img src="../../../../assets/icon_close.png" alt />
        </i>
      </div>
      <div class="main">
        <div class="mainMiddle mainMiddleVpn">
          <el-form :inline="true" class="demo-form-inline form"  :rules="rules"  :model="form" ref="form"  >
            <el-form-item :label="$t('Mobile.name')" prop="name"  :label-width="`${lang == 'en' ? '195px' : '120px'}`" >
              <el-input v-model="form.name"  :placeholder="$t('Mobile.name')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('Mobile.description')" prop="description"  :label-width="`${lang == 'en' ? '195px' : '120px'}`"  >
              <el-input v-model="form.description" :placeholder="$t('Mobile.description')" ></el-input>
            </el-form-item>
            <el-form-item prop="uploadUnlimited">
              <el-checkbox :label="$t('Traffic.uploadUnlimited')" v-model="form.uploadUnlimited"></el-checkbox>
            </el-form-item>
            <el-form-item :label="$t('Traffic.uploadRate')" prop="uploadRate"  :label-width="`${lang == 'en' ? '220px' : '180px'}`"  >
              <el-input :disabled="form.uploadUnlimited" v-model="form.uploadRate" :placeholder="$t('Traffic.uploadRate')" ></el-input>
            </el-form-item>
            <el-form-item prop="downloadUnlimited">
              <el-checkbox :label="$t('Traffic.downloadUnlimited')" v-model="form.downloadUnlimited"></el-checkbox>
            </el-form-item>
            <el-form-item :label="$t('Traffic.downloadRate')" prop="downloadRate"  :label-width="`${lang == 'en' ? '220px' : '180px'}`"  >
              <el-input :disabled="form.downloadUnlimited" v-model="form.downloadRate" :placeholder="$t('Traffic.downloadRate')" ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="footer">
        <button class="save" v-debounce="save">
          {{ $t("Mobile.save") }}
        </button>
        <button class="cancel" @click="$parent.showAddTrafficProfile = false">
          {{ $t("Mobile.cancel") }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { saveOrFlushTrafficProfile, checkNameInUseTrafficProfile } from "@/services/index.js";
export default {
  data() {
    let checkName = (rule, value, callback) => {
      if (value) {
        checkNameInUseTrafficProfile({ name: value, tenantId: this.tenantId, type: 1 }).then(
            (res) => {
              if (res.code == 10000) {
                callback();
              } else {
                callback(new Error(this.$t("vsr1000.remind[6]")));
              }
            }
        );
      }
    };
    let checkIfRequired = (rule, value, callback) => {
      if ((rule.field === "uploadRate" && !this.form.uploadUnlimited) || 
          (rule.field === "downloadRate" && !this.form.downloadUnlimited)) {
        if(value === "") {
          callback(new Error("Please enter the " + this.toTitleCase(rule.field)));
        } else {
          if (value > 1000) {
            callback(new Error("Upto 1 Gigabits/s only"));
          } else {
          callback();
          }
        }
      } else {
        callback();
      }
    };
    return {
      rules: {
        name: [
          {
            required: true,
            message: this.$t("Mobile.enterName"),
            trigger: "blur",
          },
          { validator: checkName, trigger: "blur" },
        ],
        uploadRate: [
          { validator: checkIfRequired, trigger: "blur" },
        ],
        downloadRate: [
          { validator: checkIfRequired, trigger: "blur" },
        ],
        uploadUnlimited: [
          { validator: checkIfRequired, trigger: "blur" },
        ],
        downloadUnlimited: [
          { validator: checkIfRequired, trigger: "blur"}
        ]
      },
      lang: "",
      tenantId: "",
      form: {
        id: "",
        description: "",
        name: "",
        uploadUnlimited: false,
        uploadRate: "",
        downloadUnlimited: false,
        downloadRate: "",
      },
      params: {},
    };
  },
  props: {
    devId: {
      type: String,
    },
  },
  created() {
    this.lang = sessionStorage.getItem("lang");
    this.tenantId = sessionStorage.getItem("tenantValue");
  },
  methods: {
    toTitleCase(str) {
      return str.split(' ')
       .map(w => w[0].toUpperCase() + w.substring(1).toLowerCase())
       .join(' ');
    },
    // 保存
    // save
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            id: this.form.id,
            name: this.form.name,
            description: this.form.description,
            downloadRate: this.form.downloadUnlimited ? "" : this.form.downloadRate,
            downloadUnlimited: this.form.downloadUnlimited,
            uploadRate: this.form.uploadUnlimited ? "" : this.form.uploadRate,
            uploadUnlimited: this.form.uploadUnlimited,
            tenantId: this.tenantId
          };

          saveOrFlushTrafficProfile(params).then((res) => {
              if (res.code === 10000) {

                this.$refs[formName].resetFields();
                this.$message.success(this.$t("Mobile.setSuccess"));
                this.$parent.showAddTrafficProfile = false;
                this.$parent.getClientGroupData({
                  pageNumber: 1,
                  pageSize: 10,
                  name: "",
                  tenantId: this.tenantId
                });
              } else {
                this.$message.error(this.$t("Vpn.hint3"));
              }
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.contents {
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(32, 42, 59, 0.5);
  top: 0;
  left: 0;
  z-index: 100;
  .inner {
    width: 780px;
    max-height: 447px;
    padding-bottom: 20px;
    overflow: auto;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .top {
      display: flex;
      height: 48px;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      border-bottom: 1px solid #d1d7e0;
      margin-bottom: 30px;
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
    .main {
      .mainTop {
        display: flex;
        padding-left: 50px;
        color: #333333;
        font-family: arial, sans-serif;
        font-weight: 400;
        margin-bottom: 30px;
        .right {
          margin-right: 80px;
          span:nth-child(1) {
            margin-right: 12px;
          }
        }
      }
      .mainTopen {
        padding-left: 110px;
      }
      .mainMiddle {
        width: 100%;
        // border: 1px solid #d1d7e0;
        margin: 0 auto;
        padding: 0;
        display: flex;
        justify-content: space-between;
        .form {
          width: 100%;
          .add {
            display: block;
            width: 34px;
            height: 34px;
            background: rgba(255, 255, 255, 1);
            border-radius: 7px;
            border: 1px solid rgba(209, 215, 224, 1);
            background: url("../../../../assets/newPage/deviceconfiguration_icon_arp_add@2x.png")
            no-repeat center;
            background-size: 16px 16px;
          }
          .del {
            display: block;
            width: 34px;
            height: 34px;
            background: rgba(255, 255, 255, 1);
            border-radius: 7px;
            border: 1px solid rgba(209, 215, 224, 1);
            background: url("../../../../assets/newPage/deviceconfiguration_icon_arp_delete@2x.png")
            no-repeat center;
            background-size: 16px 16px;
          }
        }
      }
      .mainFooter {
        // padding-left: 50px;
        // display: flex;
        position: relative;
        .left {
          width: 50%;
          .form {
            margin-bottom: 14px;
          }
          .add {
            display: block;
            width: 34px;
            height: 34px;
            background: rgba(255, 255, 255, 1);
            border-radius: 7px;
            border: 1px solid rgba(209, 215, 224, 1);
            background: url("../../../../assets/newPage/deviceconfiguration_icon_arp_add@2x.png")
            no-repeat center;
            background-size: 16px 16px;
            position: absolute;
            right: -40px;
            top: 0;
          }
          .del {
            display: block;
            width: 34px;
            height: 34px;
            background: rgba(255, 255, 255, 1);
            border-radius: 7px;
            border: 1px solid rgba(209, 215, 224, 1);
            background: url("../../../../assets/newPage/deviceconfiguration_icon_arp_delete@2x.png")
            no-repeat center;
            background-size: 16px 16px;
            position: absolute;
            right: -40px;
            top: 0;
          }
        }
      }
    }
    .footer {
      margin-top: 25px;
      text-align: center;
      .save {
        margin-right: 18px;
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
        &:hover {
          background: #6095d6;
        }
      }
      .cancel {
        width: 90px;
        height: 34px;
        background: rgba(255, 255, 255, 1);
        border-radius: 7px;
        border: 1px solid rgba(209, 215, 224, 1);
        outline: none;
        font-size: 14px;
        font-family: arial, sans-serif;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        &:hover {
          background: rgba(54, 120, 200, 1);
          color: #fff;
          border-color: rgba(54, 120, 200, 1);
        }
      }
    }
  }
  .innerEn {
    width: 900px;
  }
}
.devList::-webkit-scrollbar {
  width: 4px;
}

.devList::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}

.devList::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
</style>
<style lang="scss">
.VpnPop {
  .el-form-item__content {
    line-height: 0px;
    vertical-align: middle;
  }
  .el-input__inner {
    width: 195px;
    height: 34px;
    line-height: 0px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    padding-left: 10px;
  }
  .el-checkbox__inner {
    margin-left: 93px;
  }
  .el-form-item__label {
    font-family: arial, sans-serif;
    line-height: 34px;
    padding-right: 7px;
    color: #333333;
    white-space: wrap;
  }
  .el-form-item {
    height: 55px;
    margin: 0px;
  }
  .el-form--inline .el-form-item:nth-child(2) {
    margin-right: 0px;
  }
  .el-form-item__error {
    top: 90%;
  }
  .el-form-item {
    width: 50%;
    padding: 6px 0;
    box-sizing: content-box;
    font-family: arial, sans-serif;
  }
  .left {
    .el-form-item {
      width: 100%;
    }
  }
  .prRight {
    position: absolute;
    right: 0;
    top: 0;
    width: 50%;
    .el-form-item {
      width: 100%;
    }
  }
}
</style>
