<template>
  <div class="createLink">
    <div class="content">
      <h4 class="title">
        <span class="name">链路创建</span>
        <span class="close"></span>
      </h4>
      <div class="form">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="form"
          label-width="auto"
          class="demo-ruleForm"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item :label="$t('vsr1000.name')" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item :label="$t('vsr1000.describe')" label-width="110px" prop="descr">
            <el-input type="textarea" v-model="ruleForm.descr" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="Tunnel_IP" prop="name">
            <el-input v-model="ruleForm.name" placeholder="Server端"></el-input>
          </el-form-item>
          <el-form-item label="Tunnel_IP" label-width="110px" prop="name">
            <el-input v-model="ruleForm.name" placeholder="Client"></el-input>
          </el-form-item>
          <el-form-item label="MTU" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="速率" label-width="110px" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="QOS" prop="name">
            <el-select filterable v-model="ruleForm.name">
              <el-option></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计费方式" label-width="110px" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入"></el-input>
          </el-form-item>
          <div class="BGP">
            <span class="icon">BGP</span>
            <el-form-item label="CE ASN" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="Router ID" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="出向优先级" prop="name">
              <el-input v-model="ruleForm.name" placeholder="1～65535，默认值100"></el-input>
            </el-form-item>
            <el-form-item label="入向优先级" prop="name">
              <el-input v-model="ruleForm.name" placeholder="1～65535，默认值100"></el-input>
            </el-form-item>
          </div>
          <div class="BFD">
            <span class="icon">BFD</span>
            <el-form-item label="重试次数" prop="name">
              <el-input v-model="ruleForm.name" placeholder="1～65535，默认值100"></el-input>
            </el-form-item>
            <el-form-item label="探测间隔" prop="name">
              <el-input v-model="ruleForm.name" placeholder="1～65535，默认值100"></el-input>
            </el-form-item>
          </div>
          <div class="submit">
            <button class="save" type="primary" v-debounce.prevent="submitForm">{{$t('vsr1000.save')}}</button>
            <button class="cancel" @click.prevent="close">{{$t('vsr1000.cancel')}}</button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {},
  components: {},
  data() {
    return {
      ruleForm: {
        name: "",
        descr: ""
      },
      rules: {}
    };
  },
  computed: {},
  methods: {
      submitForm(){

      },
      close(){

      }
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="scss">
.createLink {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 100;
  background: rgba(32, 42, 59, 0.2);
  .content {
    width: 725px;
    height: 661px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -330.5px;
    margin-left: -362.5px;
    .title {
      width: 100%;
      height: 48px;
      line-height: 48px;
      border-bottom: 1px solid #d1d7e0;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .name {
        font-size: 14px;
        font-family: arial, sans-serif;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
      .close {
        width: 14px;
        height: 14px;
        background-image: url("../../../../assets/icon_close.png");
        background-size: 14px 14px;
      }
    }
    .form {
      padding-left: 26px;
      padding-top: 28px;
      .BGP {
        width: 673px;
        height: 136px;
        border: 1px solid rgba(209, 215, 224, 1);
        position: relative;
        margin-bottom: 28px;
        padding: 17px 0 0 27px;
        .icon{
            position: absolute;
            height: 20px;
            top:-10px;
            left:30px;
            background: #fff;
            padding: 0 7px;
        }
      }
      .BFD {
        width: 673px;
        height: 78px;
        border: 1px solid rgba(209, 215, 224, 1);
        position: relative;
        padding: 17px 0 0 25px;
        .icon{
            position: absolute;
            height: 20px;
            top:-10px;
            left:30px;
            background: #fff;
            padding: 0 7px;
        }
      }
    }
  }
}
.submit {
  width: 100%;
  padding-top: 30px;
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
  .save:hover {
    background: #6095d6;
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
</style>
<style lang="scss">
.createLink .form {
  .el-input {
    width: 220px;
    height: 34px;
    .el-input__inner {
      height: 100%;
      border-radius: 7px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
  .el-textarea {
    width: 220px;
    height: 34px;
    .el-textarea__inner {
      height: 100%;
      border-radius: 7px;
    }
  }
}
</style>