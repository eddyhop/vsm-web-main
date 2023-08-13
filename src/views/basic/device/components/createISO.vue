<template>
  <div class="editSb">
    <div :class="lang=='en' ? 'contEn cont' : 'cont'">
      <div class="title">
        {{$t('DeviceMan.isoFileCreateCard')}}
        <span @click.prevent="close"></span>
      </div>
      <div class="even">
        <el-form
          :model="from"
          :rules="rules"
          ref="form"
          label-width="auto"
          :inline="true"
          @submit.native.prevent
          onkeydown="if(event.keyCode==13) return false;"
        >
          <el-form-item :label="$t('DeviceMan.platform')">
            <el-select filterable v-model="from.platform" placeholder="KVM">
              <el-option
                style="font-family: arial, sans-serif"
                value="KVM" label="KVM"></el-option>
                <el-option
                style="font-family: arial, sans-serif"
                value="ESXi" label="ESXi"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('DeviceMan.timezone')">
            <el-select filterable v-model="from.timezone" placeholder="Australia/Sydney">
              <el-option
                style="font-family: arial, sans-serif"
                v-for="item in timezones"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('DeviceMan.vmEdgeName')" prop="vmName" style="margin-right:28px">
            <el-input style="width:300px" v-model="from.vmName"></el-input>
          </el-form-item>
          <el-form-item :label="$t('DeviceMan.localImageDirectory')" prop="localImageDirectory" style="margin-right:28px">
            <el-input style="width:300px" :placeholder="this.localImgDirPlaceholder" :disabled="from.platform==='ESXi'" v-model="from.localImgDir"></el-input>
          </el-form-item>
          <el-form-item :label="$t('DeviceMan.targetImageDirectory')" prop="targetImageDirectory" style="margin-right:28px">
            <el-input style="width:300px" :placeholder="this.targetImgDirPlaceholder" :disabled="from.platform==='ESXi'" v-model="from.targetImgDir"></el-input>
          </el-form-item>
          <el-form-item :label="$t('DeviceMan.nwInterface')" prop="nwInterface" style="margin-right:28px">
            <el-checkbox v-model="from.enableDHCP">{{$t('DeviceMan.enableDHCP')}}</el-checkbox>
          </el-form-item>
          <el-form-item :label="$t('DeviceMan.hostNwName')" prop="hostNwName" style="margin-right:28px">
            <el-input style="width:300px" v-model="from.hostNwName"></el-input>
          </el-form-item>
          <el-form-item :label="$t('DeviceMan.macAddress')" prop="macAddress" style="margin-right:28px">
            <el-input style="width:300px" :disabled="from.autoGenerateMACAddress" v-model="from.macAddress"></el-input>&nbsp;
            <el-checkbox v-model="from.autoGenerateMACAddress">{{$t('DeviceMan.autoGen')}}</el-checkbox>
          </el-form-item>
          <el-form-item :label="$t('Monit.ipAddress')" prop="ipAddress" style="margin-right:28px">
            <el-input style="width:300px" :disabled="from.enableDHCP" v-model="from.ipAddress"></el-input>
          </el-form-item>
          <el-form-item :label="$t('DeviceMan.netMask')" prop="netmaskValue" style="margin-right:28px">
            <el-input style="width:300px" :disabled="from.enableDHCP" v-model="from.netmaskValue"></el-input>
          </el-form-item>
          <el-form-item :label="$t('Monit.gateway')" prop="gateway" style="margin-right:28px">
            <el-input style="width:300px" :disabled="from.enableDHCP" v-model="from.gateway"></el-input>
          </el-form-item>
          <el-form-item :label="$t('DeviceMan.nameServers')" prop="nameserversValue" style="margin-right:28px">
            <el-input style="width:300px" :placeholder="$t('DeviceMan.nameServerPlaceholder')" :disabled="from.enableDHCP" v-model="from.nameserversValue" size="small"></el-input>
          </el-form-item>
          <div class="contr">
            <button v-debounce="save" class="save">{{$t('DeviceMan.download')}}</button>
            <button @click.prevent="close" class="cancel">{{$t('DeviceMan.cancel')}}</button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment-timezone';
import { startCase, isEmpty, uniq } from 'lodash';
import fileDownload from 'js-file-download'

import { downloadEdgeISO } from "@/services";
export default {
  data() {
    const ipAddressRegex = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/i;
    var ipArrayCheck = (rule, value, callback) => {
      const message = 'Each name server IP must be a valid IP address, separated ONLY by ","';
      let validIps = true;
      let hasDuplicates = false;
      if(value != "") {
        const arr = value.split(',');
        const trimmedArray = arr.map(element => {
          return element.trim();
        });
        hasDuplicates = uniq(trimmedArray).length !== trimmedArray.length;
        trimmedArray.forEach((x, i) => {
          validIps = validIps && ipAddressRegex.test(x);
        });
      }
      if(value != "" && !validIps) {
          callback(new Error(message));
      } else {
        if(hasDuplicates) {
          callback(new Error("Please remove duplicate IP Addresses"));
          hasDuplicates = false;
        } else {
          callback();
        }
      }
    };
    var ipCheck = (rule, value, callback) => {
      if(value != "" && !ipAddressRegex.test(value)) {
        callback(new Error("Please enter valid IPAddress for field {" + startCase(rule.field) + "}"));
      } else {
        callback();
      }
    };
    var vmNameCheck = (rule, value, callback) => {
      const vmNameRegex = /^[ A-Za-z0-9_.-]*$/;
      if(value != "" && !vmNameRegex.test(value)) {
        callback(new Error('Only alpha-numeric characters with "." or "-" or "_" are allowed'));
      } else {
        callback();
      }
    };
    var macaddressCheck = (rule, value, callback) => {
      const macAddressRegex = /^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})|([0-9a-fA-F]{4}\\.[0-9a-fA-F]{4}\\.[0-9a-fA-F]{4})$/i;
      if(!this.from.autoGenerateMACAddress && !macAddressRegex.test(value)) {
        callback(new Error('Invalid MAC Address (eg: 01:23:45:67:89:AB delimit by ":" only)'));
      } else {
        callback();
      }
    }
    return {
      localImgDirPlaceholder:"/var/lib/netlinkz/images",
      targetImgDirPlaceholder:"/var/lib/libvirt/images",
      lang: sessionStorage.getItem("lang") || "en",
      tenantId : sessionStorage.getItem("tenantValue"),
      fullscreenLoading: false,
      timezones: moment.tz.names(),
      nameserversValue: [],
      from: {
        platform: ['KVM'],
        vmName: "",
        localImgDir: "",
        targetImgDir: "",
        enableDHCP: true,
        autoGenerateMACAddress: true,
        hostNwName: "",
        macAddress: "",
        ipAddress: "",
        netmaskValue: "",
        gateway: "",
        nameserversValue: "",
        deviceSeries: "",
        timezone: ["Australia/Sydney"],
      },
      rules: {
        vmName: [
          {
            required: true,
            message: this.$t("App.prompt2") + " the VM",
            trigger: "blur"
          },
          {
            validator: vmNameCheck, trigger: "blur"
          }
        ],
        hostNwName: [
          {
            required: true,
            message: this.$t("App.prompt2") + " the Host Network Name",
            trigger: "blur",
          },
        ],
        ipAddress: [
          {
            validator: ipCheck, trigger: "blur"
          }
        ],
        netmaskValue: [
          {
            validator: ipCheck, trigger: "blur"
          }
        ],
        gateway: [
          {
            validator: ipCheck, trigger: "blur"
          }
        ],
        macAddress: [
          {
            validator: macaddressCheck, trigger: "blur"
          }
        ],
        nameserversValue: [
          {
            validator: ipArrayCheck, trigger: "blur"
          }
        ]
      },
    };
  },
  methods: {
    async save(formName) {
      const nameServerArray = this.from.nameserversValue.split(',').filter(r => r !== "")
      let params = {
        platform: isEmpty(this.from.platform) ? "KVM" : this.from.platform,
        virtualMachineName: this.from.vmName,
        timezone: isEmpty(this.from.timezone) ? "Australia/Sydney" : this.from.timezone,
        localImageDirectory: isEmpty(this.from.localImgDir) ? this.localImgDirPlaceholder : this.from.localImgDir,
        targetImageDirectory: isEmpty(this.from.targetImgDir) ? this.targetImgDirPlaceholder : this.from.targetImgDir,
        deviceSeries: this.from.deviceSeries,
        networkName: this.from.hostNwName,
        networkDHCPClient: this.from.enableDHCP,
        networkMacAddress: !isEmpty(this.from.macAddress) ? this.from.macAddress : undefined,
        networkIpAddress: !isEmpty(this.from.ipAddress) ? this.from.ipAddress : undefined,
        networkNetmask: !isEmpty(this.from.netmaskValue) ? this.from.netmaskValue : undefined,
        networkGateway: !isEmpty(this.from.gateway) ? this.from.gateway : undefined,
        networkNameserver: nameServerArray.length > 0 ? nameServerArray : undefined
      };
      
      this.$refs[formName].validate((valid) => {
        if (valid) {
           try {
            downloadEdgeISO(params).then(res => {
              return res;
              })
              .then(data => {
                const fileName = "activation_"+params.virtualMachineName+".zip";
                fileDownload(data, fileName);
                this.$parent.isoShow = false;
              })
          } catch(err) {
            console.log(err)
          }
        } else {
          return false;
        }
      });
    },
    close() {
      this.$parent.isoShow = false;
      this.$refs.form.resetFields();
    },
  },
  created() {},
  mounted() {},
};
</script>
<style lang="scss" scoped>
.even {
  padding: 30px 0 0 20px;
  .a {
    div {
      width: 320px;
    }
  }
  .remaind {
    color: darkgray;
  }
  .contr {
    width: 100%;
    text-align: center;
    padding-top: 20px;
    .save:hover {
      background: rgba(96, 149, 214, 1);
    }
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
}
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
    background-image: url("../../../../assets/icon_close.png");
    background-size: 14px 14px;
  }
}
.cont {
  width: 631px;
  height: 900px;
  background: white;
  position: absolute;
  top: 40%;
  left: 50%;
  margin-left: -315.5px;
  margin-top: -163px;
  box-shadow: 0px 10px 20px 0px rgba(102, 102, 102, 0.1);
  border-radius: 7px;
  //   text-align: center;
}
.contEn {
  width: 655px;
}
.editSb {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 100;
  background: rgba(32, 42, 59, 0.2);
}
</style>
<style lang="scss">
.even {
  .el-form-item__label {
    // font-size: 20px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(63, 64, 72, 1);
  }
}
.editSb .even {
  .el-input {
    width: 198px;
    height: 34px;
    .el-input__inner {
      height: 100%;
      //   padding-left: 34px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
}
.editSb .even .address {
  margin-right: 10px;

  .el-input {
    width: 110px;
    height: 34px;
    // margin-right: 25px;
    .el-input__inner {
      height: 100%;
      //   padding-left: 34px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
  .el-select:last-of-type .el-input {
    margin-right: 0;
  }
}
.editSb .even .first {
  .el-input {
    width: 145px;
  }
}
.editSb .even .last {
  margin-right: 0;
}
</style>