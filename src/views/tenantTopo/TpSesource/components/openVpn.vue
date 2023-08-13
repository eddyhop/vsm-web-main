<template>
  <div class="openVpn">
    <div class="inner">
      <div class="top">
        <div class="title">
          <span>VPN开通申请</span>
          <img @click="$parent.isShow4=false" src="@/assets/icon_close.png" alt />
        </div>
      </div>
      <div class="main">
        <el-form
          ref="form"
          :model="form"
          label-width="auto"
          :rules="rules"
          :hide-required-asterisk="true"
        >
          <el-form-item label="租户路由域" prop="tenant">
            <el-select filterable
              v-model="form.tenant"
              placeholder="请选择"
              class="selectTen"
              @change="changeTen"
              ref="select"
            >
              <el-option v-for="item in tendata" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <div class="grop">
            <el-form-item label="并发数申请" prop="applyNum">
              <el-input v-model="form.applyNum" class="item" placeholder="0为不控制并发"></el-input>
            </el-form-item>
            <el-form-item label="开通年限" prop="year">
              <el-select filterable v-model="form.year" placeholder="请选择" class="item">
                <el-option label="1年" value="1"></el-option>
                <el-option label="2年" value="2"></el-option>
                <el-option label="3年" value="3"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="classify">
            <div class="left devList">
              <h2>可开通设备</h2>
              <div class="leftItem" v-for="(item,index) in noOpenVPN" :key="item.id">
                <el-checkbox
                  class="checkbox"
                  @change="change(index,$event,item.isSelected)"
                  :label="item.id"
                  v-model="item.isSelected"
                >
                  <div class="every">
                    <span>{{item.deviceName}}</span>
                    <span>{{item.deviceSerialNumber}}</span>
                  </div>
                </el-checkbox>
              </div>
            </div>
            <div class="right devList">
              <h2>选定设备</h2>
              <div class="rightItem" v-for="(item,index) in hasOpenVPN" :key="item.id">
                <div>
                  <span>{{item.deviceName}}</span>
                  <span>{{item.deviceSerialNumber}}</span>
                </div>
                <img src="@/assets/icon_close.png" alt @click="delDev(index)" />
              </div>
            </div>
          </div>
          <el-form-item class="button">
            <el-button type="primary" class="save" v-debounce="save">保存</el-button>
            <el-button class="cancel" @click="$parent.isShow4=false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {
  saveOpenVpnDevice,
  getTenantVrfByTenantId,
  getPEDeviceByTenantId
} from "@/services";
export default {
  data() {
    return {
      form: {
        tenant: "",
        applyNum: "",
        year: ""
      },
      rules: {
        tenant: [
          { required: true, message: "内容不能为空", trigger: "change" }
        ],
        applyNum: [
          { required: true, message: "内容不能为空", trigger: "change" },
          { pattern: /^([1-9]\d*|[0]{1,1})$/, message: "内容必须是正整数" }
        ],
        year: [{ required: true, message: "内容不能为空", trigger: "change" }]
      },
      tendata: [],
      noOpenVPN: [],
      hasOpenVPN: []
    };
  },
  created() {
    this.getTenData();
  },
  methods: {
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let openDevList = [];
          this.hasOpenVPN.map(item => {
            openDevList.push({
              deviceId: item.deviceId,
              deviceName: item.deviceName,
              deviceSerialNumber: item.deviceSerialNumber,
              ip: item.ip
            });
          });
          let params = {
            applicationYear: this.form.year,
            concurrency: this.form.applyNum,
            deviceEntityList: openDevList,
            tenantId: this.$parent.tenantId,
            tenantVrfId: this.form.tenant,
            tenantVrfName: this.$refs["select"].selectedLabel
          };
          saveOpenVpnDevice(params).then(res => {
            if (res.code === 10000) {
              this.$parent.isShow4 = false;
              this.$message({
                message: "保存成功",
                type: "success"
              });
              this.$parent.getList();
              this.$parent.getConcurrentResources();
            } else {
              this.$parent.isShow4 = false;
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
    // 可开通设备状态变化
    // The state of the device can be switched on
    change(index, e) {
      this.noOpenVPN[index].isSelected = e;
      this.noOpenVPN.map(item => {
        if (item.isSelected && !this.hasOpenVPN.includes(item)) {
          this.hasOpenVPN.push(item);
        }
      });
      this.hasOpenVPN = this.hasOpenVPN.filter(item => {
        return item.isSelected;
      });
    },
    // 选定设备状态变化
    // Select device state change
    delDev(index) {
      let del = this.hasOpenVPN.splice(index, 1);
      let delIndex = this.noOpenVPN.indexOf(del[0]);
      this.noOpenVPN[delIndex].isSelected = false;
    },
    // 获取租户路由域
    // Gets the tenant routing domain
    getTenData() {
      getTenantVrfByTenantId(this.$parent.tenantId).then(res => {
        if (res.code === 10000) {
          this.tendata = res.result;
        }
      });
    },
    // 获取设备数据
    // Acquisition of device data
    getDevType() {
      this.noOpenVPN = [];
      this.hasOpenVPN = [];
      getPEDeviceByTenantId(this.$parent.tenantId, this.form.tenant).then(
        res => {
          if (res.code === 10000) {
            this.noOpenVPN = res.result.noOpenVPN;
            this.hasOpenVPN = [];
            this.noOpenVPN.map(item => {
              this.$set(item, "checked", false);
            });
          }
        }
      );
    },
    // 租户改变
    // The tenant changes
    changeTen() {
      this.getDevType();
    }
  }
};
</script>
<style lang="scss" scoped>
.openVpn {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.5);
  z-index: 100;
  .inner {
    width: 700px;
    height: 600px;
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
      padding: 30px 30px 20px 21px;
      height: 552px;
      .selectTen {
        width: 567px;
      }
      .grop {
        display: flex;
        justify-content: space-between;
        .item {
          width: 240px;
        }
      }
      .classify {
        width: 640px;
        height: 309px;
        border-radius: 7px;
        border: 1px solid rgba(209, 215, 224, 1);
        margin-left: 9px;
        display: flex;
        .left {
          width: 50%;
          height: 100%;
          border-right: 1px solid #d1d7e0;
          padding: 11px 0 0 21px;
          overflow: auto;
          h2 {
            font-size: 14px;
            font-family: arial, sans-serif;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            margin-bottom: 22px;
          }
          .leftItem {
            display: flex;
            flex-direction: column;
            .checkbox {
              margin-bottom: 12px;
              .every {
                display: flex;
                align-items: center;
                font-size: 14px;
                font-family: arial, sans-serif;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
                span:nth-child(1) {
                  display: inline-block;
                  width: 130px;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  overflow: hidden;
                }
                span:nth-child(2) {
                  display: inline-block;
                  width: 55px;
                  white-space: nowrap;
                }
              }
            }
          }
        }
        .right {
          width: 50%;
          height: 100%;
          padding: 11px 0 0 21px;
          overflow: auto;
          h2 {
            font-size: 14px;
            font-family: arial, sans-serif;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            margin-bottom: 22px;
          }
          .rightItem {
            width: 275px;
            height: 26px;
            background: rgba(234, 238, 244, 1);
            border-radius: 7px;
            border: 1px solid rgba(209, 215, 224, 1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 9px;
            margin-bottom: 10px;
            div {
              display: flex;
              align-items: center;
              font-size: 14px;
              font-family: arial, sans-serif;
              font-weight: 400;
              color: rgba(51, 51, 51, 1);
              span:nth-child(1) {
                display: inline-block;
                width: 130px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
              span:nth-child(2) {
                display: inline-block;
                width: 55px;
                white-space: nowrap;
              }
            }
            img {
              width: 10px;
              height: 10px;
              cursor: pointer;
            }
          }
        }
      }
      .button {
        margin: 38px auto;
        margin-left: 153px;
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
.devList::-webkit-scrollbar {
  width: 4px;
}
.devList::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.devList::-webkit-scrollbar-track  {
     -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
     border-radius: 0;
     background: rgba(0, 0, 0, 0.1);
}
</style>
<style lang="scss">
.openVpn {
  .el-input__inner {
    height: 34px;
    border-radius: 7px;
    border: 1px solid rgba(209, 215, 224, 1);
    padding-left: 11px;
  }
  .is-checked span {
    color: rgba(153, 153, 153, 1);
  }
}
</style>