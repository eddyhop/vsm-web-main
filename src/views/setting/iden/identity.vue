<template>
  <div class="identity">
    <div class="title">
      <h3>
        {{$t("Identity.set")}}
        <img src="@/assets/icon_right@2x.png" alt />
        <span>{{$t('Identity.authentication')}}</span>
      </h3>
    </div>
    <div class="content">
      <h1>{{$t('Identity.authentication')}}</h1>
      <!-- <div class="item">
                当前身份：1233afsafsadf
      </div>-->
      <div class="item">
        <p>{{$t('Identity.import')}}：</p>
        <div class="ipt">
          <el-input :placeholder="$t('Identity.hint1')" size="small"></el-input>
        </div>
      </div>
      <el-upload
        name="authFile"
        class="upload-demo"
        ref="upload"
        :onSuccess="uploadSuccess"
        :on-change="choseFile"
        :auto-upload="false"
        action="/vsm/vsa/auth"
      >
        <button size="small" type="primary" class="save" v-control>{{$t('Identity.Import1')}}</button>
      </el-upload>
    </div>
    <addFile v-show="flag" />
  </div>
</template>
<script>
import { syncVsm } from "@/services";
import addFile from "./confirm.vue";
export default {
  components: { addFile },
  data() {
    return {
      input: "",
      flag: false
    };
  },
  created() {},
  mounted() {},
  methods: {
    choseFile(file, fileList) {
      this.input = file.name;
      if (file.status == "ready") {
        this.flag = true;
      } else {
        this.flag = false;
      }
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    // 上传成功后的回调
    // A callback after a successful upload
    uploadSuccess(response, file, fileList) {
      this.flag = false;
      if (response.code == 10000) {
        this.$message({
          message: this.$t('Identity.success'),
          type: "success"
        });
      } else {
        this.$message({
          message:  this.$t('Identity.fail'),
          type: "warning"
        });
      }
    }
  }
};
</script>
<style lang="scss">
.identity {
  .el-upload-list {
    display: none;
  }
}
</style>
<style lang="scss" scoped>
.content {
  border-radius: 7px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
  .tu {
    width: 800px;
    height: 600px;
  }
  button {
    font-size: 14px;
  }
  flex: 1;
  background: white;
  margin-top: 20px;
  padding: 20px 30px;
  font-size: 16px;
  font-family: arial, sans-serif;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  .ipt {
    width: 240px;
    // margin-top: -25px;
    // margin-left: 80px;
  }
  .save:hover {
    background: rgba(96, 149, 214, 1);
  }
  button {
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    border: none;
    color: white;
    margin-top: 40px;
    margin-left: 86px;
  }
  .item {
    margin-top: 30px;
    display: flex;
    p {
      line-height: 30px;
      white-space: wrap;
    }
  }
  h1 {
    font-size: 18px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
}
.title {
  width: 100%;
  height: 62px;
  background: white;
  padding: 20px 30px;
  border-radius: 7px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
  h3 {
    font-size: 15px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    span {
      font-size: 14px;
      line-height: 8px;
    }
    img {
      width: 5px;
      height: 8px;
      margin-left: 5px;
      margin-right: 5px;
    }
  }
}
.identity {
  width: 100%;
  height: 100%;
  padding-left: 20px;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
}
</style>