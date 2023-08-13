<template>
  <div class="XLANgrande isShow" ref="XLANgrande">
    <div class="context">
      <h4 class="title">
        <span>{{$t('vsr1000.networkLink')}}-{{$t('vsr1000.expertSet')}}</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="event">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="112px"
          class="demo-ruleForm"
          @submit.native.prevent
        >
          <el-form-item :label="$t('vsr1000.inACL')" prop="inAcl">
            <el-select filterable v-model="ruleForm.inAcl" :placeholder="$t('vsr1000.choose')">
              <el-option value :label="$t('vsr1000.noHave')"></el-option>
              <el-option
                v-for="item in ruleForm.aclList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <i
              :class="`el-icon-warning goDetails ${ruleForm.inAcl=='' ? '' :'detailsActive'}`"
              @click="goAclDetails(ruleForm.inAcl)"
            ></i>
          </el-form-item>
          <!-- <el-form-item :label="$t('vsr1000.inQOS')" prop="inQos">
            <el-select filterable v-model="ruleForm.inQos" :placeholder="$t('vsr1000.choose')">
              <el-option value :label="$t('vsr1000.noHave')"></el-option>
              <el-option
                v-for="item in ruleForm.qosList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <i
              :class="`el-icon-warning goDetails ${ruleForm.inQos=='' ? '' :'detailsActive'}`"
              @click="goQosDetails(ruleForm.inQos)"
            ></i>
          </el-form-item> -->
          <el-form-item :label="$t('vsr1000.outACL')" prop="outAcl">
            <el-select filterable v-model="ruleForm.outAcl" :placeholder="$t('vsr1000.choose')">
              <el-option value :label="$t('vsr1000.noHave')"></el-option>
              <el-option
                v-for="item in ruleForm.aclList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <i
              :class="`el-icon-warning goDetails ${ruleForm.outAcl=='' ? '' :'detailsActive'}`"
              @click="goAclDetails(ruleForm.outAcl)"
            ></i>
          </el-form-item>
          <!-- <el-form-item :label="$t('facility.outQos')" prop="outQos">
            <el-select filterable v-model="ruleForm.outQos" :placeholder="$t('facility.select')">
              <el-option value="" label="无"></el-option>
              <el-option
                v-for="item in ruleForm.qosList"
                :key="item.id"
                :label="item.qosName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item label="MSS" prop="mss">
            <el-input v-model.number="ruleForm.mss"></el-input>
          </el-form-item>
          <el-form-item label="MTU" prop="mtu">
            <el-input v-model.number="ruleForm.mtu"></el-input>
          </el-form-item>
          <div class="submit">
            <button class="save" @click.prevent="submitForm('ruleForm')">{{$t('vsr1000.save')}}</button>
            <button class="cancel" @click.prevent="close">{{$t('vsr1000.cancel')}}</button>
          </div>
        </el-form>
      </div>
    </div>
    <aclDetails v-show="aclDetailShow" ref="acldetails" />
    <qosDetails ref="qosDetails" v-show="qosDetailsShow" />
  </div>
</template>
<script>
import {
  // getAclItem,
  // getLQos,
  // getVxlanSetting,
  // addVsrVpnSuper,
  // getVpnSuper
  vpnExtraOptions,
  addVpnSuperSetting
} from "@/services";
import aclDetails from "./aclDetails";
import qosDetails from "./qosDetails";
export default {
  props: {},
  components: {
    aclDetails,
    qosDetails
  },
  data() {
    var checkMtu = (rule, value, callback) => {
      let mtu = Number(value);
      if (mtu < 0 || mtu > 1500) {
        callback(new Error(this.$t("vsr1000.greRule[8]")));
      } else {
        callback();
      }
    };
    var checkMss = (rule, value, callback) => {
      let mtu = Number(value);
      if (mtu < 0 || mtu > 1460) {
        callback(new Error(this.$t("vsr1000.greRule[11]")));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        inAcl: "",
        inQos: "",
        outAcl: "",
        mtu: 1500,
        mss: 0,
        outQos: "",
        aclList: [],
        qosList: [],
        linkId: "",
        id: ""
      },
      rules: {
        inAcl: [{ message: this.$t("vsr1000.remind2[3]"), trigger: "change" }],
        inQos: [{ message: this.$t("vsr1000.remind2[3]"), trigger: "change" }],
        outAcl: [{ message: this.$t("vsr1000.remind2[3]"), trigger: "change" }],
        outQos: [{ message: this.$t("vsr1000.remind2[3]"), trigger: "change" }],
        mss: [
          {
            required: true,
            message: this.$t("vsr1000.remind2[4]"),
            trigger: "blur"
          },
          { type: "number", message: this.$t("vsr1000.greRule[9]") },
           { validator: checkMss }
        ],
        mtu: [
          {
            required: true,
            message: this.$t("vsr1000.remind2[4]"),
            trigger: "blur"
          },
          { type: "number", message: this.$t("vsr1000.greRule[10]") },
          { validator: checkMtu }
        ]
      },
      aclDetailShow: false,
      qosDetailsShow: false
    };
  },
  computed: {},
  methods: {
    //查看acl详情
    // View ACL details
    goAclDetails(val) {
      if (val.length) {
        this.aclDetailShow = true;
        this.$refs.acldetails.selectList(val);
      } else {
        return;
      }
    },
    //查看qos详情
    // View qos details
    goQosDetails(val) {
      if (val.length) {
        this.qosDetailsShow = true;
        this.$refs.qosDetails.dataInit(val);
      } else {
        return;
      }
    },
    close() {
      this.$refs.XLANgrande.classList.add("isShow");
    },
    submitForm(formName) {
      let data = {
        id: this.ruleForm.id,
        aclInput: this.ruleForm.inAcl,
        qosInput: this.ruleForm.inQos,
        mss: this.ruleForm.mss,
        mtu: this.ruleForm.mtu,
        aclOutput: this.ruleForm.outAcl,
        // qosOutput: this.ruleForm.outQos,
        randomId: parseInt((Math.random() + 1) * Math.pow(10, 6 - 1))
      };
      let deviceId = JSON.parse(this.$route.query.devData).deviceId;
      this.$refs[formName].validate(valid => {
        if (valid) {
          addVpnSuperSetting(data).then(res => {
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[5]")
              });
              this.$parent.getVsrVpnListInit({
                deviceId: JSON.parse(this.$route.query.devData).deviceId,
                pageSize: this.$parent.lSize,
                page: this.$parent.lNumber
              });
              this.$refs.XLANgrande.classList.add("isShow");
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async getSelectList(params, row) {
      // console.log(params);
      // let Acl = await getAclItem(params);
      // let Qos = await getLQos(params);
      // let Setting = await getVpnSuper(params2);
      // if (Setting.result) {
      //   let data = {
      //     inAcl: Setting.result.inAcl,
      //     inQos: Setting.result.inQos,
      //     outAcl: Setting.result.outAcl,
      //     mtu: Setting.result.mtu,
      //     mss: Setting.result.mss,
      //     // outQos: Setting.result.outQos,
      //     // linkId: Setting.result.linkId,
      //     id: params2.id,
      //     type: Setting.result.type,
      //     aclList: Acl.result,
      //     qosList: Qos.result
      //   };
      //   this.ruleForm = data;
      // } else {
      //   this.ruleForm = {
      //     inAcl: "",
      //     inQos: "",
      //     outAcl: "",
      //     mtu: "",
      //     mss: "",
      //     // outQos: "",
      //     aclList: Acl.result,
      //     qosList: Qos.result,
      //     // linkId: params2.id,
      //     id: params2.id
      //   };
      //   this.$refs.ruleForm.resetFields();
      // }
      // this.ruleForm.linkId = params.id;
      // this.ruleForm.aclList = Acl.result;
      // this.ruleForm.qosList = Qos.result;
      let data = await vpnExtraOptions(params);
      if (data.code === 10000) {
        this.ruleForm.aclList = data.result.acl;
        this.ruleForm.qosList = data.result.qos;
      }
      this.ruleForm.inAcl = row.aclInput;
      this.ruleForm.inQos = row.qosInput;
      this.ruleForm.outAcl = row.aclOutput;
      this.ruleForm.mtu = row.mtu;
      this.ruleForm.mss = row.mss;
      this.ruleForm.id = row.id;
    }
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="scss">
.isShow {
  display: none;
}
.XLANgrande {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background:rgba(32,42,59,0.2);
  z-index: 100;
}
.context {
  width: 462px;
  // height: 501px;
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
      background: url("../../../../../assets/icon_close.png") no-repeat;
      background-size: cover;
      cursor: pointer;
    }
  }
}
.event {
  padding: 30px 0 30px 0;
  .line {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      width: 20px;
      height: 2px;
      background: rgba(196, 198, 207, 1);
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
}
.goDetails {
  width: 24px;
  height: 24px;
  margin-left: 10px;
  font-size: 24px;
  color: #d1d7e0;
}
.detailsActive {
  color: #3678c8;
}
</style>
<style lang="scss">
.XLANgrande {
  .el-input {
    width: 300px;
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
  .el-textarea {
    width: 300px;
    height: 34px;
    .el-textarea__inner {
      height: 100%;
    }
  }
}
</style>