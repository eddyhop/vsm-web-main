<template>
  <div class="rejectPop">
    <div class="inner">
      <div class="top">
        <span>驳回</span>
        <img @click="$parent.isShow1=false" src="@/assets/icon_close.png" alt />
      </div>
      <div class="main">
        <el-input class="reason" type="textarea" placeholder="驳回理由" v-model="textarea"></el-input>
        <button @click="confrim">确定</button>
      </div>
    </div>
  </div>
</template>
<script>
import { operateApproveList } from "@/services";
export default {
  data() {
    return {
      textarea: ""
    };
  },
  props: {
    data: {
      type: Object
    }
  },
  methods: {
    // 确认
    // confirm
    confrim() {
      let params = {
        approvalId: this.data.approvalId,
        reason: this.textarea,
        resourceType: this.data.resourceType,
        type: 0,
        status: 0
      };
      operateApproveList(params).then(res => {
        if (res.code === 10000) {
          this.$message({
            type: "success",
            message: "操作成功"
          });
          this.$parent.getList();
          this.$parent.isShow1=false;
        } else {
          this.$message({
            type: "error",
            message: res.message
          });
          this.$parent.isShow1=false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.rejectPop {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.5);
  z-index: 100;
  .inner {
    width: 404px;
    height: 248px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .top {
      height: 48px;
      border-bottom: 1px solid #d1d7e0;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      img {
        width: 14px;
        height: 14px;
      }
    }
    .main {
      padding: 24px 40px 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .reason {
      }
      button {
        margin-top: 20px;
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
    }
  }
}
</style>
<style lang="scss">
.rejectPop {
  .el-textarea__inner {
    height: 91px;
    padding-left: 10px;
    padding-top: 10px;
    border: 1px solid rgba(209, 215, 224, 1);
    border-radius: 7px;
  }
}
</style>