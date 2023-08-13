<template>
  <div class="backbone">
    <div class="inner">
      <div class="top">
        <div class="title">
          <span>资源申请</span>
          <img @click="$parent.isShow1=false" src="@/assets/icon_close.png" alt />
        </div>
      </div>
      <div class="main">
        <el-form
          :model="ruleForm"
          ref="form"
          label-width="auto"
          class="demo-ruleForm"
          :rules="rules"
          :hide-required-asterisk="true"
        >
          <el-form-item label="租户路由域" prop="tenDomain">
            <el-select filterable v-model="ruleForm.tenDomain" placeholder="请选择租户路由域">
              <el-option v-for="item in tenData" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="骨干节点" prop="node">
            <el-select filterable v-model="ruleForm.node" placeholder="请输入">
              <el-option
                v-for="item in nodeData"
                :key="item.id"
                :label="item.deviceName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请宽带" prop="broadband">
            <el-input v-model="ruleForm.broadband" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="流量池" prop="flowPool">
            <div class="flowPool">
              <el-input v-model="ruleForm.flowPool" placeholder="请输入"></el-input>
              <span>T</span>
            </div>
          </el-form-item>
          <el-form-item label="年限" prop="year">
            <el-select filterable v-model="ruleForm.year" placeholder="请选择年限">
              <el-option label="1年" value="1"></el-option>
              <el-option label="2年" value="2"></el-option>
              <el-option label="3年" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="button">
            <el-button type="primary" class="save" v-debounce="save">保存</el-button>
            <el-button class="cancel" @click="$parent.isShow1=false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template> 
<script>
import { applyMainDevice, getMainDevice, getTenantVrf } from "@/services";
export default {
  data() {
    return {
      ruleForm: {
        tenDomain: "",
        node: "",
        broadband: "",
        flowPool: "",
        year: ""
      },
      nodeData: [], //骨干节点数据
                    // Backbone node data
      tenData: [], //租户数据
                   // The tenant data
      rules: {
        tenDomain: [
          { required: true, message: "内容不能为空", trigger: "change" }
        ],
        node: [{ required: true, message: "内容不能为空", trigger: "change" }],
        broadband: [
          { required: true, message: "内容不能为空", trigger: "change" },
          { pattern: /^([1-9]\d*|[0]{1,1})$/, message: "内容必须是正整数" }
        ],
        flowPool: [
          { required: true, message: "内容不能为空", trigger: "change" },
          { pattern: /^([1-9]\d*|[0]{1,1})$/, message: "内容必须是正整数" }
        ],
        year: [{ required: true, message: "内容不能为空", trigger: "change" }]
      }
    };
  },
  created() {
    this.getMainDevices();
    this.getTenData();
  },
  methods: {
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            flowPool: this.ruleForm.flowPool,
            flowPoolUnit: "T",
            mainDeviceId: this.ruleForm.node,
            tenantVrfId: this.ruleForm.tenDomain,
            applicationYear: this.ruleForm.year,
            tapeWidth: this.ruleForm.broadband,
            tenantId: this.$parent.tenantId,
            status: "5"
          };
          applyMainDevice(params).then(res => {
            if (res.code === 10000) {
              this.$parent.isShow1 = false;
              this.$message({
                message: "保存成功",
                type: "success"
              });
              this.$parent.getList();
              this.$parent.getConcurrentResources();
            } else {
              this.$parent.isShow1 = false;
              this.$message({
                message: res.message,
                type: "warning"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // 获取骨干节点
    // Acquire backbone node
    getMainDevices() {
      getMainDevice().then(res => {
        if (res.code === 10000) {
          this.nodeData = res.result;
        }
      });
    },
    // 获取租户数据
    // Get tenant data
    getTenData() {
      let params = {
        tenantId: this.$parent.tenantId
      };
      getTenantVrf(params).then(res => {
        if (res.code === 10000) {
          this.tenData = res.result;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.backbone {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.5);
  z-index: 100;
  .inner {
    width: 462px;
    height: 448px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .top {
      padding: 0 20px;
      height: 48px;
      border-bottom: 1px solid #d1d7e0;
      line-height: 48px;
      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        img {
          width: 14px;
          height: 14px;
        }
      }
    }
    .main {
      padding: 30px;
      .button {
        padding-left: 28px;
        .save {
          width: 100px;
          height: 34px;
          background: rgba(54, 120, 200, 1);
          border-radius: 7px;
          font-size: 14px;
          font-family: arial, sans-serif;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          padding: 0px;
          &:hover {
            background: #6095d6 !important;
          }
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
          padding: 0;
          margin-left: 18px;
          &:hover {
            background: #3678c8 !important;
            color: #fff;
          }
        }
      }
      .flowPool {
        position: relative;
        span {
          position: absolute;
          top: 0;
          right: 7px;
          color: rgba(51, 51, 51, 1);
        }
      }
    }
  }
}
</style>
<style lang="scss">
.backbone {
  .el-input__inner {
    width: 322px;
    height: 34px;
    border-radius: 7px;
    border: 1px solid rgba(209, 215, 224, 1);
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    padding-left: 11px;
  }
  .el-form-item__label {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    padding-right: 10px;
  }
}
</style>