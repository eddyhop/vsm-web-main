<template>
  <div class="CE">
    <div class="inner">
      <div class="top">
        <div class="title">
          <span>CE接通数申请</span>
          <img @click="$parent.isShow2=false" src="@/assets/icon_close.png" alt />
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
          <el-form-item label="申请接入数" prop="num">
            <el-input v-model="ruleForm.num" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="年限" prop="year">
            <el-select filterable v-model="ruleForm.year" placeholder="请输入">
              <el-option label="1年" value="1"></el-option>
              <el-option label="2年" value="2"></el-option>
              <el-option label="3年" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="button">
            <el-button type="primary" class="save" v-debounce="save">保存</el-button>
            <el-button class="cancel" @click="$parent.isShow2=false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template> 
<script>
import { applyApprovalCe } from "@/services";
export default {
  data() {
    return {
      ruleForm: {
        num: "",
        year: ""
      },
      rules: {
        num: [
          { required: true, message: "内容不能为空", trigger: "change" },
          { pattern: /^([1-9]\d*|[0]{1,1})$/, message: "内容必须是正整数" }
        ],
        year: [{ required: true, message: "内容不能为空", trigger: "change" }]
      }
    };
  },
  methods: {
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            ceNumber: this.ruleForm.num,
            limitTimeUnit: "year",
            applicationYear: this.ruleForm.year,
            tenantId: this.$parent.tenantId,
            status:"5"
          };
          applyApprovalCe(params).then(res => {
            if (res.code === 10000) {
              this.$parent.isShow2=false;
              this.$message({
                message: "保存成功",
                type: "success"
              });
              this.$parent.getList();
              this.$parent.getConcurrentResources();
            } else {
              this.$parent.isShow2=false;
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
    }
  }
};
</script>
<style lang="scss" scoped>
.CE {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.5);
  z-index: 100;
  .inner {
    width: 462px;
    height: 268px;
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
    }
  }
}
</style>
<style lang="scss">
.CE {
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