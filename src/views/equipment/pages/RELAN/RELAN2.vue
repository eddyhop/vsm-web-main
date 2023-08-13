<template>
  <div class="LAN">
    <div class="btns">
      <ul class="setList">
        <li
          v-for="(item) in tabsData"
          :key="item.id"
          @click="tabEvent(item)"
          :class="{active:item.id==activeIndex}"
        >{{item.name}}</li>
      </ul>
    </div>
    <div class="even">
      <el-form
        :model="val"
        :rules="rules"
        ref="form"
        :label-width="lang=='en'? '230px' : '130px'"
        label-position="right"
        @submit.native.prevent
      >
      <!--  <el-form-item label="domain-name" prop="domainName">
          <el-input v-model="val.domainName" :placeholder="$t('vsr100.lan.enterContent')" size="small"></el-input>
        </el-form-item>  -->
        <el-form-item label="dns" prop="domainServer">
            <el-input
              v-model="val.domainServer"
              :placeholder="$t('vsr100.dhcp.enterContent')"
              size="small"
            ></el-input>
          </el-form-item>
        <el-form-item label="subnet" prop="ipMask">
          <el-input v-model="val.ipMask" :placeholder="$t('vsr100.lan.enterContent')" size="small"></el-input>
          <span>/24</span>
        </el-form-item>
        <el-form-item :label="$t('vsr100.dhcp.gateway')" prop="gateway">
            <el-input
              v-model="val.gateway"
              :placeholder="$t('vsr100.dhcp.enterContent')"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('vsr100.dhcp.startAddress')" prop="startAddress">
            <el-input
              v-model="val.startAddress"
              :placeholder="$t('vsr100.dhcp.enterContent')"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('vsr100.dhcp.endAddress')" prop="endAddress">
            <el-input
              v-model="val.endAddress"
              :placeholder="$t('vsr100.dhcp.enterContent')"
              size="small"
            ></el-input>
          </el-form-item>

        <el-form-item>
          <button v-debounce="save" class="save" v-control>{{$t('vsr100.lan.save')}}</button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {
  addRELan,
  getRELanDetails,
} from "@/services";
// import { regularIpV4 } from '@/utils/regular'
export default {
  props: {},
  components: {},
  data() {
    var ipRule = (rule, value, callback) => {
      if (value) {
        let val = value.split(".")[3];
        // console.log(val)
        if (val == 0) {
          callback(new Error(this.$t("vsr100.lan.remind[5]")));
        } else {
          callback();
        }
      }
    };
    return {
      lang: sessionStorage.getItem("lang") || "en",
      tabShow: false,
      val: {
        domainName: "",
        domainServer: "",
        id: "",
        ipMask: "",
        gateway: "",
        startAddress: "",
        endAddress: ""
      },
      activeIndex: 0,
      rules: {
        domainName: [
          {
            required: true,
            message: this.$t("vsr100.lan.enterContent"),
            trigger: "blur"
          },
          {
            //pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            //pattern : /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)+([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$/,

            message: this.$t("vsr1100.lan.remind[3]")
          },
          { validator: ipRule, trigger: "blur" }
        ],
        ipMask: [
          { required: true, message: this.$t('newModel.msg3'), trigger: "blur" },
          {
            //pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]?|3[0-2])$/,
            //message: this.$t("vsr1000.remind2[7]"),
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("vsr100.dhcp.remind[5]")
          },
          { validator: ipRule, trigger: "blur" },
        ],
        startAddress: [
          {
            required: true,
            message: this.$t("vsr100.dhcp.enterContent"),
            trigger: "blur"
          },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("vsr100.dhcp.remind[5]")
          }
        ],
        endAddress: [
          {
            required: true,
            message: this.$t("vsr100.dhcp.enterContent"),
            trigger: "blur"
          },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("vsr100.dhcp.remind[5]")
          }
        ],
        gateway: [
          {
            required: true,
            message: this.$t("vsr100.dhcp.enterContent"),
            trigger: "blur"
          },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("vsr100.dhcp.remind[6]")
          }
        ],
        domainServer: [
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("vsr100.dhcp.remind[5]")
          }
        ]
      }
    };
  },
  components: {

  },
  computed: {},
  methods: {
    tabEvent(item) {
      this.activeIndex = item.id;
      this.tabShow = item.id === 0 ? false : true;
    },
    save(formName) {
      let params = {
        domainName: this.val.domainName,
        deviceId: this.val.id,
        domainServer: this.val.domainServer,
        ipMask: this.val.ipMask,
        gateway: this.val.gateway,
        startAddress: this.val.startAddress,
        endAddress: this.val.endAddress,
      };
      this.$refs[formName].validate(valid => {
        if (valid) {
          addRELan(params).then(res => {
            if (res.code === 10000) {
              this.$message({
                message: this.$t("vsr100.lan.remind[0]"),
                type: "success"
              });
              this.getLan();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getLan() {
      this.val.id = JSON.parse(this.$route.query.devData).deviceId;
      getRELanDetails({ deviceId: this.val.id }).then(res => {
        // this.val.mac = res.result.mac;
        this.val.domainName = res.result.domainName;
        this.val.domainServer = res.result.domainServer;
        this.val.ipMask = res.result.ipMask;
        this.val.gateway = res.result.gateway;
        this.val.startAddress = res.result.startAddress;
        this.val.endAddress = res.result.endAddress;
      });
    },
  },
  created() {
    this.getLan();
  },
  mounted() {}
};
</script>
<style scoped lang="scss">
.even {
  width: 600px;
  margin-left: 30px;
  .save:hover {
    background: rgba(96, 149, 214, 1);
  }
  button {
    margin-top: 18px;
    font-size: 14px;
  }
  p {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
  }
}
.LAN {
  padding: 20px 30px;
  .setList {
    float: left;
    padding-bottom: 20px;
    zoom: 1;
    &:after {
      display: block;
      clear: both;
      content: "";
      visibility: hidden;
      height: 0;
    }
    li {
      float: left;
      width: 84px;
      height: 34px;
      text-align: center;
      line-height: 34px;
      background: rgba(255, 255, 255, 1);
      border-radius: 7px;
      border: 1px solid rgba(209, 215, 224, 1);
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      margin-right: 14px;
      cursor: pointer;
    }
    .active {
      background: #3678c8;
      color: #fff;
      border: 1px solid #3678c8;
    }
    .active:hover {
      background: rgba(96, 149, 214, 1);
      border: 1px solid rgba(96, 149, 214, 1);
    }
    li:hover {
      background: #3678c8;
      color: #fff;
      border: 1px solid #3678c8;
    }
  }
}
.btns {
  zoom: 1;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  .DHCPset {
    float: right;
    button {
      margin-left: 14px;
    }
    .close {
      background: rgba(239, 239, 239, 1);
      color: #333333;
      border: 1px solid rgba(209, 215, 224, 1);
    }
    button:hover {
      background: rgba(96, 149, 214, 1);
      border: 1px solid rgba(96, 149, 214, 1);
    }
    .close:hover {
      background: rgba(239, 239, 239, 1);
      color: #333333;
      border: 1px solid rgba(209, 215, 224, 1);
    }
  }
}
button {
  width: 100px;
  height: 34px;
  background: rgba(54, 120, 200, 1);
  border-radius: 7px;
  color: white;
  border: none;
  outline: none;
  cursor: pointer;
  img {
    width: 14px;
    height: 14px;
    position: relative;
    top: 1px;
  }
}
.add,
.remove {
  margin-left: 16px;
  width: 34px;
  height: 34px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  border: 1px solid rgba(209, 215, 224, 1);
  outline: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  top: 3px;
  img {
    width: 15px;
    height: 15px;
  }
}
.tit {
  font-size: 15px;
  font-family: arial, sans-serif;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  padding-bottom: 30px;
}
.open {
  font-size: 15px;
  font-family: arial, sans-serif;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  padding: 30px 0;
  span {
    padding-right: 23px;
    display: inline-block;
    width: 150px;
    text-align: right;
  }
}
.openEn{
  span{
    width: 267px;
  }
}
// .intranetList {
//   .intranetItem {
//     display: flex;
//   }
// }
</style>
<style lang="scss">
.LAN .even {
  .el-form-item__label {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
  .el-input,
  .el-select {
    width: 280px;
    height: 34px;
    .el-input__inner {
      height: 100%;
      border-radius: 7px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
  // .intranetList .intranetItem {
  //   .el-input,
  //   .el-select {
  //     width: 200px;
  //     height: 34px;
  //     .el-input__inner {
  //       height: 100%;
  //       border-radius: 7px;
  //     }
  //     .el-input__icon {
  //       line-height: normal;
  //     }
  //   }
  // }
}
</style>
