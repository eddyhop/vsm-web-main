<template>
  <!-- 新增网段发布 -->
  <div class="addDNS">
    <div class="content">
      <h4 class="title">
        <span>{{$t('newLang100.dns.title5')}} {{$t('newModel.networkSegment')}}</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="formList">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="form"
          label-width="120px"
          class="demo-ruleForm"
          @submit.native.prevent
        >
          <el-form-item label="Cidr" prop="cidr">
            <el-input v-model="ruleForm.cidr" @blur="zhuan(ruleForm.cidr)"></el-input>
          </el-form-item>
          <el-form-item label="Router Map" class="RouteMap" prop="bgpPolicyId">
            <el-select filterable v-model="ruleForm.bgpPolicyId">
              <el-option :label="$t('vsr1000.noHave')" value></el-option>
              <el-option v-for="el in routeMapList" :key="el.id" :label="el.name" :value="el.id"></el-option>
            </el-select>
            <button
              :class="{btnEn:lang=='en'}"
              @click.prevent="goRouteMap"
            >{{$t('newModel.jumpTo')}}</button>
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
import { bgpPolicyGetBgpPolicyByVrfId, bgpCidrSave } from "@/services";
import { compare } from "@/utils/change";
export default {
  data() {
    return {
      deviceId: JSON.parse(this.$route.query.devData).deviceId,
      lang: sessionStorage.getItem("lang") || "en",
      ruleForm: { cidr: "", bgpPolicyId: "" },
      devType: "",
      bgpPolicyId: "",
      routeMapList: [],
      rules: {
        cidr: [
          {
            required: true,
            message: this.$t("newLang100.dns.title8"),
            trigger: "blur",
          },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]?|3[0-2])$/,
            message: this.$t("vsr1000.remind2[7]"),
          },
        ],
        // bgpPolicyId: [
        //   {
        //     required: true,
        //     message: this.$t("newLang100.dns.title8"),
        //     trigger: "change",
        //   },
        // ],
      },
    };
  },
  methods: {
    close() {
      this.$parent.ishow = false;
      this.$refs.form.resetFields();
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = [
            {
              bgpPolicyId: this.ruleForm.bgpPolicyId,
              bgpPolicyName: this.ruleForm.bgpPolicyId
                ? this.routeMapList.find(
                    (el) => el.id == this.ruleForm.bgpPolicyId
                  ).name
                : "",
              bgpVrfId: this.$parent.$parent.bgpVrfId,
              cidr: this.ruleForm.cidr,
            },
          ];
          bgpCidrSave(params).then((res) => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[5]"),
              });
              this.$parent.dataInit();
              this.close();
            } else {
              this.$message({
                type: "warning",
                message: res.message,
              });
              this.$parent.dataInit();
              this.close();
            }
          });
        }
      });
    },
    //数据初始化
    // Data initialization
    //Data initialization
    dataInit() {
      bgpPolicyGetBgpPolicyByVrfId({
        deviceId: this.$parent.$parent.deviceId,
        bgpVrfId: this.$parent.$parent.bgpVrfId,
      }).then((res) => {
        if (res.code === 10000) {
          this.routeMapList = res.result == null ? [] : res.result;
        }
      });
    },
    //ip地址转换
    // IP address translation
    //IP address translation
    zhuan(val) {
      // console.log(str.slice(0,-1))
      let reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]?|3[0-2])$/;
      if (reg.test(val)) {
        let str = "";
        let ip = val.split("/")[0];
        let code = val.split("/")[1];
        if (code == 32) {
          return;
        } else {
          str = compare(ip, code) + "/" + code;
        }

        this.ruleForm.cidr = str;
      }
    },
    goRouteMap() {
      this.$parent.$parent.tabsIndex = 1;
      this.close();
    },
  },
  created() {
    this.devType = JSON.parse(this.$route.query.devData).deviceType;
    this.dataInit();
  },
};
</script>
<style scoped lang="scss">
.addDNS {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.2);
  z-index: 100;
}
.content {
  width: 462px;
  height: 270px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -135px;
  margin-left: -231px;
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
      background: url("../../../../../../assets/icon_close.png") no-repeat;
      background-size: cover;
      cursor: pointer;
    }
  }
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
    width: 70px;
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
.formList {
  padding: 30px 30px 0 15px;
  .enlang ::v-deep .el-form-item__label {
    line-height: normal;
  }
}
.RouteMap {
  button {
    width: 220px;
    text-align: right;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(54, 120, 200, 1);
    border: 0;
    outline: none;
    background: #fff;
    cursor: pointer;
  }
  .btnEn {
    width: 220px;
  }
}
</style>
<style lang="scss">
.addDNS {
  .el-input,
  .el-select {
    width: 100%;
    height: 34px;
    .el-input__inner {
      height: 100%;
      border-radius: 7px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
}
</style>