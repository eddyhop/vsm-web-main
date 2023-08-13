<template>
  <div class="addStatic">
    <div class="context">
      <div class="title">
        {{$t('subscription.addressTranslation.addSourceNAT')}}
        <span class="close" @click="close"></span>
      </div>
      <div class="item" :style="lang=='en'?'':'marginLeft:70px'">
        <el-form
            :model="form"
            :rules="rules"
            ref="form"
            label-width="auto"
            :inline="true"
            class="demo-ruleForm"
            @submit.native.prevent
        >
          <el-form-item :label="$t('subscription.addressTranslation.name')" prop="name">
            <div class="item-ipt">
              <el-input
                  v-model="form.name"
                  :placeholder="$t('subscription.addressTranslation.name')"
                  size="small"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item :label="$t('subscription.addressTranslation.description')" prop="description">
            <div class="item-ipt">
              <el-input
                  v-model="form.description"
                  :placeholder="$t('subscription.addressTranslation.description')"
                  size="small"
              ></el-input>
            </div>
          </el-form-item>

          <el-form-item :label="$t('subscription.addressTranslation.type')" prop="type">
            <div class="item-ipt">
              <el-select filterable size="small" v-model="form.type" :placeholder="$t('subscription.addressTranslation.type')">
                <el-option key="Masquerading" label="Masquerading"  value="Masquerading" >Masquerading</el-option>
              </el-select>

            </div>
          </el-form-item>

          <el-form-item :label="$t('subscription.addressTranslation.egressLogicalInterface')" prop="outInterfaceId">
            <div class="item-ipt">
              <el-select filterable size="small" v-model="form.outInterfaceId" @change="selPort()" :placeholder="$t('subscription.addressTranslation.egressLogicalInterface')">
                <el-option
                    v-for="item in outIpList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
          <!-- <el-form-item :label="$t('subscription.addressTranslation.egressInterfaceAddress')" prop="outIp">
            <div class="item-ipt">
              <el-input v-model="form.outIp" size="small"  readonly="true"></el-input>
            </div>
          </el-form-item> -->
          <div class="contr">
            <button :disabled="buttomShow" type="primary" v-debounce="save" class="save">{{$t('subscription.save')}}</button>
            <button @click.prevent="close" class="cancel">{{$t('subscription.cancel')}}</button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {
  dhcpAddOrEditService, getLogicPortForRole, snatSave
} from "@/services";
export default {
  data() {
    return {
      buttomShow:false,
      deviceId:JSON.parse(this.$route.query.devData).deviceId,
      lang: sessionStorage.getItem("lang") || "en",
      form: {
        id :"",
        name :"",
        description :"",
        type :"",
        outInterfaceId :"",
        outInterfaceName:"",
        outIp :"",
      },
      apiArr: [],
      outIpList:[],
      ips:[],
      rules: {
        name: [
          { required: true, message: this.$t("subscription.addressTranslation.remind[0]"), trigger: "blur" }
        ],
        type: [
          { required: true, message: this.$t("subscription.addressTranslation.remind[1]"), trigger: "change" }
        ],
        outInterfaceId: [
          { required: true, message: this.$t("subscription.addressTranslation.remind[2]"), trigger: "change" }
        ]
      }
    };
  },
  methods: {
    close() {
      this.$parent.addSourceNATShow = false;
      this.$refs.form.resetFields();
    },
    selPort(){
      let objName = {};
      objName = this.outIpList.find((item)=> {
        return item.id === this.form.outInterfaceId;
      });
      this.form.outInterfaceName = objName.name;

      let objIp = {};
      objIp = this.ips.find((item)=> {
        return item.id === this.form.outInterfaceId;
      });
      this.form.outIp = objIp.name;
    }
    ,
    save(formName) {
      let params = {
        id: this.form.id,
        deviceId: this.deviceId,
        name: this.form.name,
        description: this.form.description,
        outInterfaceId: this.form.outInterfaceId,
        type: this.form.type,
        outInterfaceName: this.form.outInterfaceName,
        outIp: this.form.outIp,
      };
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.buttomShow = true;
          snatSave(params).then((res) => {
            this.buttomShow = false;
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.qosremind[0]"),
              });
              this.$parent.getSnat();
              this.close();
            } else {
              this.$message({
                type: "warning",
                message: res.message,
              });
            }
          });
        } else {
          return false;
        }
      });

    },
    getOutIpSelect() {
      getLogicPortForRole({ deviceId: this.deviceId,role:"WAN" }).then((res) => {
        if (res.code === 10000) {
          this.outIpList = res.result.port;
          this.ips = res.result.portIp;
        }
      });
    },
  },
  created() {
    this.getOutIpSelect();
  }
};
</script>
<style lang="scss" scoped>
.item-ipt {
  width: 320px;
}
.item {
  margin-top: 10px;
  padding: 10px;
  .contr {
    // margin-left: 80px;
    text-align: center;
    margin-bottom: 28px;
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
  .save:hover {
    background: rgba(96, 149, 214, 1);
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
}
.context {
  width: 530px;
  // height: 387px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 15px 30px 0px rgba(191, 198, 217, 0.15);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: auto;
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
      background-image: url("../../../../../../assets/icon_close.png");
      background-size: 14px 14px;
    }
  }
}
.addStatic {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.2);
  z-index: 100;
}
</style>
<style lang="scss">
.addStatic {
  .el-select {
    width: 100%;
    height: 32px;
    .el-input {
      height: 100%;
      .el-input__inner {
        height: 100%;
      }
      .el-input__icon {
        line-height: normal;
      }
    }
  }
}
</style>