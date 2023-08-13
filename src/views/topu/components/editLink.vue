<template>
  <div class="editLink">
    <div class="content">
      <h4 class="title">
        <span class="name">链路创建</span>
        <span class="close" @click="close"></span>
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
          <div class="link-name">
            <el-form-item label="链路名称" label-width="110px" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入"></el-input>
            </el-form-item>
          </div>
          <div class="device-name">
            <span>{{ruleForm.deviceName[0]}}</span>
            <span>{{ruleForm.deviceName[1]}}</span>
          </div>
          <div class="device-port">
            <div class="item">
              <el-form-item
                label="设备接口"
                label-width="110px"
                v-for="(port, index) in ruleForm.ports1"
                :key="port.key + 1"
                :prop="'port.' + index + '.port1'"
              >
                <el-select filterable v-model="port.port1" placeholder="Client">
                  <el-option
                    v-for="item in ruleForm.optionA"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <button class="addPort" @click="addPortA">+</button>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item
                label="设备接口"
                label-width="80px"
                v-for="(port, index) in ruleForm.ports2"
                :key="port.key"
                :prop="'port.' + index + '.port2'"
              >
                <el-select filterable v-model="ruleForm.port2" placeholder="server">
                  <el-option
                    v-for="item in ruleForm.optionB"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <button class="addPort">+</button>
              </el-form-item>
            </div>
          </div>
          <el-form-item label="线路开销" label-width="110px" prop="name">
            <el-input v-model="ruleForm.pay" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="不稳定惩罚" prop="name">
            <el-input v-model="ruleForm.punishment" placeholder="请输入"></el-input>
          </el-form-item>
          <div class="BFD">
            <span class="icon">BFD</span>
            <el-form-item label="重试次数" prop="name">
              <el-input v-model="ruleForm.retry" placeholder="1～65535，默认值100"></el-input>
            </el-form-item>
            <el-form-item label="探测间隔" prop="name">
              <el-input v-model="ruleForm.interval" placeholder="1～65535，默认值100"></el-input>
            </el-form-item>
          </div>
          <div class="submit">
            <button
              class="save"
              type="primary"
              v-debounce.prevent="submitForm"
            >{{$t('vsr1000.save')}}</button>
            <button class="cancel" @click.prevent="close">{{$t('vsr1000.cancel')}}</button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { addLinked } from "@/services";
export default {
  props: {},
  components: {},
  data() {
    return {
      ruleForm: {
        topoId: "",
        deviceId: [],
        deviceName: [],
        name: "",
        pay: "", //线路开销
                 // Line overhead
        punishment: "", //不稳定惩罚
                        // Instability penalty
        retry: "", //重复次数
                   // Repeat the number
        interval: "", //探测间隔
                      // Detection of interval
        optionA: [], // 设备A接口
                     // Device A interface
        optionB: [], //设备B接口
                     // Device B interface
        ports1: [
          {
            port1: "",
            key: Date.now()
          }
        ],
        ports2: [
          {
            port2: "",
            key: Date.now()
          }
        ]
      },

      rules: {}
    };
  },
  computed: {},
  methods: {
    addPortA() {
      this.ruleForm.ports1.push({
        port1: this.ruleForm.ports1,
        key: Date.now()
      });
    },
    submitForm() {
      let params = {
        clientDeviceInterface: this.ruleForm.ports1[0].port1,
        serverDeviceInterface: this.ruleForm.ports2[0].port2,
        clientId: this.ruleForm.deviceId[1],
        serverId: this.ruleForm.deviceId[0],
        linkPay: this.ruleForm.pay,
        linkPunish: this.ruleForm.punishment,
        repeatTime: this.ruleForm.retry,
        space: this.ruleForm.interval,
        status: 1,
        topoLinkName: this.ruleForm.name,
        type: 1,
        topoId: this.ruleForm.topoId
      };
      addLinked(params).then(res => {
        if (res.code == 10000) {
          this.$parent.getList();
          this.close();
        }
      });
    },
    close() {
      this.$parent.createShow = false;
    },
    dataInit(data){
      this.ruleForm.topoId = data.topoId
      this.ruleForm.name = data.topoLinkName
    }
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="scss">
.editLink {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 100;
  background: rgba(32, 42, 59, 0.2);
  .content {
    width: 725px;
    height: 464px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -232px;
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
        background-image: url("../../../assets/icon_close.png");
        background-size: 14px 14px;
      }
    }
    .form::-webkit-scrollbar {
      width: 4px;
      /*height: 4px;*/
    }
    .form::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: rgba(0, 0, 0, 0.2);
    }
    .form::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 0;
      background: rgba(0, 0, 0, 0.1);
    }
    .form {
      padding-left: 26px;
      padding-top: 28px;
      height: 400px;
      overflow: auto;
      .device-name {
        display: flex;
        margin-bottom: 5px;
        justify-content: space-around;
        span {
          display: block;
        }
      }
      .addPort {
        width: 34px;
        height: 34px;
        background: rgba(255, 255, 255, 1);
        border-radius: 7px;
        border: 1px solid rgba(209, 215, 224, 1);
        margin-left: 10px;
        color: #3678c8;
        font-size: 34px;
        line-height: 28px;
        position: absolute;
        margin-top: 3px;
      }
      .BGP {
        width: 673px;
        height: 136px;
        border: 1px solid rgba(209, 215, 224, 1);
        position: relative;
        margin-bottom: 28px;
        padding: 17px 0 0 27px;
        .icon {
          position: absolute;
          height: 20px;
          top: -10px;
          left: 30px;
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
        .icon {
          position: absolute;
          height: 20px;
          top: -10px;
          left: 30px;
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
    // margin-left: 18px;
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
.editLink .form {
  .device-port {
    display: flex;
    .item {
      width: 341px;
    }
    .el-input {
      width: 176px;
    }
  }
  .link-name {
    .el-input {
      width: 322px;
    }
  }
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