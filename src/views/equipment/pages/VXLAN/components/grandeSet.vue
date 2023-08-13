<template>
  <div class="XLANgrande isShow" ref="XLANgrande">
    <div class="context">
      <h4 class="title">
        <span>{{$t('attr.expertSet')}}</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="event">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item :label="$t('attr.inACL')" prop="inAcl">
            <el-select filterable v-model="ruleForm.inAcl" :placeholder="$t('attr.choose')">
              <el-option
                v-for="item in ruleForm.aclList"
                :key="item.aclSessionId"
                :label="item.aclSessionName"
                :value="item.aclSessionId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('attr.inQOS')" prop="inQos">
            <el-select filterable v-model="ruleForm.inQos" :placeholder="$t('attr.choose')">
              <el-option
                v-for="item in ruleForm.qosList"
                :key="item.id"
                :label="item.qosName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('attr.outACL')" prop="outAcl">
            <el-select filterable v-model="ruleForm.outAcl" :placeholder="$t('attr.choose')">
              <el-option
                v-for="item in ruleForm.aclList"
                :key="item.aclSessionId"
                :label="item.aclSessionName"
                :value="item.aclSessionId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('attr.outQOS')" prop="outQos">
            <el-select filterable v-model="ruleForm.outQos" :placeholder="$t('attr.choose')">
              <el-option
                v-for="item in ruleForm.qosList"
                :key="item.id"
                :label="item.qosName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="MSS" prop="mss">
            <el-input v-model="ruleForm.mss"></el-input>
          </el-form-item>
          <el-form-item label="MTU" prop="mtu">
            <el-input v-model="ruleForm.mtu"></el-input>
          </el-form-item>
          <div class="submit">
            <button @click.prevent="submitForm('ruleForm')">{{$t('attr.save')}}</button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { getAclItem, getLQos, getVxlanSetting, vxlanSetting } from "@/services";
export default {
  props: {},
  components: {},
  data() {
    return {
      ruleForm: {
        inAcl: "",
        inQos: "",
        outAcl: "",
        mtu: "",
        mss: "",
        outQos: "",
        aclList: [],
        qosList: [],
        linkId: "",
        id: ""
      },
      rules: {
        inAcl: [
          { required: true, message: "请选择入向ACL", trigger: "change" }
        ],
        inQos: [
          { required: true, message: "请选择入向QOS", trigger: "change" }
        ],
        outAcl: [
          { required: true, message: "请选择出向QOS", trigger: "change" }
        ],
        outQos: [
          { required: true, message: "请选择出向ACL", trigger: "change" }
        ],
        mss: [{ required: true, message: "请输入MSS", trigger: "blur" }],
        mtu: [{ required: true, message: "请输入MTU", trigger: "blur" }]
      }
    };
  },
  computed: {},
  methods: {
    close() {
      this.$refs.XLANgrande.classList.add("isShow");
    },
    submitForm(formName) {
      // console.log(this.$refs[formName]);
      let data = {
        inAcl: this.ruleForm.inAcl,
        inQos: this.ruleForm.inQos,
        linkId: this.ruleForm.linkId,
        mss: this.ruleForm.mss,
        mtu: this.ruleForm.mtu,
        outAcl: this.ruleForm.outAcl,
        outQos: this.ruleForm.outQos,
        id: this.ruleForm.id
      };
      console.log(data, "idididididiididi");

      this.$refs[formName].validate(valid => {
        if (valid) {
          vxlanSetting(data).then(res => {
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: "设置成功!"
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
    //获取高级设置下拉菜单数据，（初始化高级编辑数据）
    // Gets the Advanced Settings drop-down menu data, (initializes the Advanced edit data)
    async getSelectList(params, params2) {
      console.log(params);
      let Acl = await getAclItem(params);
      let Qos = await getLQos(params);
      let Setting = await getVxlanSetting(params2);
      if (Setting.result) {
        let data = {
          inAcl: Setting.result.inAcl,
          inQos: Setting.result.inQos,
          outAcl: Setting.result.outAcl,
          mtu: Setting.result.mtu,
          mss: Setting.result.mss,
          outQos: Setting.result.outQos,
          linkId: Setting.result.linkId,
          id: Setting.result.id,
          aclList: Acl.result,
          qosList: Qos.result
        };
        this.ruleForm = data;
      } else {
        this.ruleForm = {
          inAcl: "",
          inQos: "",
          outAcl: "",
          mtu: "",
          mss: "",
          outQos: "",
          aclList: Acl.result,
          qosList: Qos.result,
          linkId: params2.id,
          id: ""
        };
        this.$refs.ruleForm.resetFields()
      }
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
  background: rgba(176, 181, 194, 0.3);
  z-index: 100;
}
.context {
  width: 694px;
  height: 602px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 15px 30px 0px rgba(191, 198, 217, 0.15);
  border-radius: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: auto;
  .title {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid rgba(231, 231, 231, 1);
    font-size: 22px;
    font-family: arial, sans-serif;
    font-weight: 500;
    color: rgba(39, 40, 56, 1);
    line-height: 38px;
    i {
      width: 20px;
      height: 20px;
      background: url("../../../../../assets/icon_close.png") no-repeat;
      background-size: cover;
      cursor: pointer;
    }
  }
}
.event {
  padding: 30px 111px 30px 99px;
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
  button {
    width: 140px;
    height: 52px;
    background: rgba(82, 138, 250, 1);
    box-shadow: 0px 2px 5px 0px rgba(86, 175, 254, 0.5);
    border-radius: 25px;
    font-size: 20px;
    font-family: arial, sans-serif;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 52px;
    outline: none;
    border: 0;
    cursor: pointer;
  }
}
</style>
<style lang="scss">
.XLANgrande {
  .el-input {
    width: 320px;
  }
  //   .el-textarea {
  //     width: 320px;
  //     height: 82px;
  //     .el-textarea__inner {
  //       height: 100%;
  //     }
  //   }
}
</style>