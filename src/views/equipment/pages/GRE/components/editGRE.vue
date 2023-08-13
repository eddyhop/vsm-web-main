<template>
  <div class="editGRE">
    <div :class="`context ${lang == 'en' ? 'contextEn' : ''}`">
      <h4 class="title">
        <span>{{$t('vsr1000.edit')}} GRE</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="event">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="auto"
          class="demo-ruleForm"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item :label="$t('vsr1000.name')" prop="greName">
            <el-input v-model="ruleForm.greName" :placeholder="$t('vsr1000.importName')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('vsr1000.sourceIP')" prop="rootIp">
            <el-input v-model="ruleForm.rootIp" :placeholder="$t('vsr1000.importSourceIp')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('vsr1000.destIP')" prop="goalIp">
            <el-input v-model="ruleForm.goalIp" :placeholder="$t('vsr1000.importDestinationIp')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('vsr1000.describe')" prop="describe">
            <el-input type="textarea" v-model="ruleForm.description"></el-input>
          </el-form-item>
          <el-form-item :label="$t('vsr1000.tenantRoutingDomain')" prop="flyName">
            <!-- <el-select filterable v-model="ruleForm.vrf" :placeholder="$t('vsr1000.choose')">
              <el-option
                v-for="item in ruleForm.vrfArr"
                :key="item.id"
                :label="item.rrfName"
                :value="item.id"
              ></el-option>
            </el-select>-->
            <el-select  filterable
              v-model="ruleForm.vrf"
              :placeholder="$t('vsr1000.choose')"
              @change="choseVrf(ruleForm.vrf)"
            >
              <!-- <div
                class="serverData"
                v-infinite-scroll="load"
                infinite-scroll-delay="500"
                infinite-scroll-immediate="false"
              >-->
              <!-- <el-option label="123" value="123123123"></el-option> -->
              <el-option
                v-for="item in ruleForm.vrfArr"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
              <!-- </div> -->
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="backbone">
              <el-checkbox
                v-show="ruleForm.backboneShow"
                v-model="ruleForm.backbone"
                @change="chosebackBone(ruleForm.backbone)"
              >{{$t('vsr1000.Backboneport')}}</el-checkbox>
            </div>
          </el-form-item>
          <div :class="`tunnel ${lang=='en'?'tunnelEn' : ''}`">
            <div class="ipv4">
              <el-form-item
                :label="$t('vsr1000.tunnel')+'IPV4'"
                v-for="(domain, index) in ruleForm.IPV4"
                :key="domain.key"
                :prop="'IPV4.' + index + '.ipv4'"
                :rules="ipv4"
                :label-width="`${lang=='en' ? '172px' : '85px'}`"
              >
                <div class="addcontent">
                  <el-input
                    v-model="domain.ipv4"
                    @change="ruleForm.backbone?ip4Toip6(domain.ipv4,domain.key,'greIpv6edit'+index):null"
                  ></el-input>
                  <div v-if="index==0" class="add" @click.prevent="addIpv4">
                    <img src="@/assets/newPage/deviceconfiguration_icon_arp_add@2x.png" />
                  </div>
                  <button
                    class="remove"
                    v-if="ruleForm.IPV4.length>1&&index>0"
                    @click.prevent="removeIpv4(domain)"
                  >
                    <img src="@/assets/deviceconfiguration_icon_arp_delete@2x.png" alt />
                  </button>
                </div>
              </el-form-item>
            </div>
            <div class="ipv6">
              <el-form-item
                :label="$t('vsr1000.ipv6')"
                v-for="(domain, index) in ruleForm.IPV6"
                :key="domain.key"
                :prop="'IPV6.' + index + '.ipv6'"
                :rules="ipv6"
                :label-width="`${lang=='en' ? '163px' : '85px'}`"
              >
                <div class="addcontent">
                  <el-input :id="'greIpv6edit'+index" v-model="domain.ipv6"></el-input>
                  <div v-if="index==0" class="add" @click.prevent="addIpv6">
                    <img src="@/assets/newPage/deviceconfiguration_icon_arp_add@2x.png" />
                  </div>
                  <button
                    class="remove"
                    v-if="ruleForm.IPV6.length>1&&index>0"
                    @click.prevent="removeIpv6(domain)"
                  >
                    <img src="@/assets/deviceconfiguration_icon_arp_delete@2x.png" alt />
                  </button>
                </div>
              </el-form-item>
            </div>
          </div>
          <div class="submit">
            <button
              class="save"
              type="primary"
              @click.prevent="submitForm('ruleForm')"
            >{{$t('vsr1000.save')}}</button>
            <button class="cancel" @click.prevent="close">{{$t('vsr1000.cancel')}}</button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {
  editGre,
  getRentVrfList,
  greIsNameExist,
  greCheck,
  greOptions
} from "@/services";
import { IPv4ToIPv6 } from "@/utils/IPv4To6";
export default {
  props: {},
  components: {},
  data() {
    var ruleIpv4 = (rule, value, callback) => {
      if (value) {
        let num = 0;
        this.ruleForm.IPV4.forEach(item => {
          if (item.ipv4 === value) {
            num++;
          }
        });
        if (num > 1) {
          callback(new Error(this.$t("vsr1000.remind[10]")));
        } else {
          if (this.ruleForm.vrf.length) {
            let params = {
              tenantVrfId: this.ruleForm.vrf === this.rowVrfname
            ? this.ruleForm.vrfId
            : this.ruleForm.vrf,
              verifyId: this.ruleForm.id,
              verifyName: value,
              verifyScope: this.deviceId,
              verifyType: "ipv4"
            };
            greCheck(params).then(res => {
              if (!res.success) {
                callback(new Error(res.message));
              } else {
                callback();
              }
            });
          } else {
            callback(new Error(this.$t("vsr1000.remind[12]")));
          }
        }
      }
    };
    var ruleIpv6 = (rule, value, callback) => {
      let num = 0;
      this.ruleForm.IPV6.forEach(item => {
        if (item.ipv6 === value) {
          num++;
        }
      });
      if (num > 1) {
        callback(new Error(this.$t("vsr1000.remind[13]")));
      } else {
        if (value) {
          if (this.ruleForm.vrf.length) {
            let params = {
              tenantVrfId: this.ruleForm.vrf === this.rowVrfname
            ? this.ruleForm.vrfId
            : this.ruleForm.vrf,
              verifyId: this.ruleForm.id,
              verifyName: value,
              verifyScope: this.deviceId,
              verifyType: "ipv6"
            };
            greCheck(params).then(res => {
              if (!res.success) {
                callback(new Error(this.$t("vsr1000.remind[14]")));
              } else {
                callback();
              }
            });
          } else {
            callback(new Error(this.$t("vsr1000.remind[12]")));
          }
        } else {
          callback();
        }
      }
    };
    var greNameExit = (rule, value, callback) => {
      if (value) {
        greIsNameExist({
          verifyId: this.ruleForm.id,
          verifyName: value,
          verifyScope: this.deviceId
        }).then(res => {
          if (!res.success) {
            callback(new Error(this.$t("vsr1000.greRule[7]")));
          } else {
            callback();
          }
        });
      }
    };
    var sourceIpRule = (rule,value,callback) => {
      if(value){
        let params = {
            tenantVrfId: this.ruleForm.vrf,
            verifyId: null,
            verifyName: value,
            verifyScope: this.deviceId,
            verifyType: "sourceIp"
          }
        greCheck(params).then(res => {
            if (!res.success) {
              callback(new Error(res.message));
            } else {
              callback();
            }
          });
      }
    }
    var destinationIpRule = (rule,value,callback) => {
      if(value){
        let params = {
            tenantVrfId: this.ruleForm.vrf,
            verifyId: null,
            verifyName: value,
            verifyScope: this.deviceId,
            verifyType: "destinationIp"
          }
        greCheck(params).then(res => {
            if (!res.success) {
              callback(new Error(res.message));
            } else {
              callback();
            }
          });
      }
    }
    return {
      deviceId:JSON.parse(this.$route.query.devData).deviceId,
      lang: "",
      ruleForm: {
        //描述
        // describe
        //describe
        description: "",
        //目的地IP
        // Destination IP
        //destination IP address
        goalIp: "",
        //名称
        // The name of the
        //name
        greName: "",

        id: "",
        //设备ID
        // Device ID
        //Device ID
        deviceId: "",
        //随机ID
        // Random ID
        //random ID
        randomId: "",
        //源IP
        // The source IP
        //sourceIP 
        rootIp: "",
        //租户路由域
        // Tenant routing domain
        //Tenant routing domain
        vrf: "",
        //租户路由域Id
        // Tenants route domain ids
        //Tenants route domain ids
        vrfId: "",
        backbone: false,
        backboneShow:
          JSON.parse(sessionStorage.getItem("userData")).type == 1 ? true : false,
        IPV4: [
          {
            ipv4: "",
            key: Date.now()
          }
        ],
        IPV6: [
          {
            ipv6: "",
            key: Date.now()
          }
        ],
        vrfArr: []
      },
      rowVrfname: "",
      loading: false,
      page: 1,
      pageSize: 5,
      rules: {
        greName: [
          {
            required: true,
            message: this.$t("vsr1000.greRule[0]"),
            trigger: "blur"
          },
          { validator: greNameExit, trigger: "blur" }
        ],
        rootIp: [
          {
            required: true,
            message: this.$t("vsr1000.greRule[1]"),
            trigger: "blur"
          },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("vsr1000.greRule[2]")
          },
          { validator: sourceIpRule, trigger: "blur" }
        ],
        vrf: [
          {
            required: true,
            message: this.$t("vsr1000.remind2[3]"),
            trigger: "change"
          }
        ],
        goalIp: [
          {
            required: true,
            message: this.$t("vsr1000.greRule[1]"),
            trigger: "blur"
          },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("vsr1000.greRule[2]")
          },
          { validator: destinationIpRule, trigger: "blur" }
        ]
      },
      ipv4: [
        {
          required: true,
          message: this.$t("vsr1000.ipv4s"),
          trigger: "blur"
        },
        {
          pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]?|3[0-2])$/,
          message: this.$t("vsr1000.greRule[3]")
        },
        { validator: ruleIpv4, trigger: "blur" }
      ],
      ipv6: [
        {
          required: false,
          message: this.$t("vsr1000.ipv6s"),
          trigger: "blur"
        },
        {
          pattern: /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*([/])(?:[0-9]|[1-9][0-9]?|[1-9][0-9][0-9])$/,
          message: this.$t("vsr1000.greRule[3]")
        },
        { validator: ruleIpv6, trigger: "blur" }
      ]
    };
  },
  computed: {},
  methods: {
    //模查租户路由域
    // The tenant routing domain is modeled
    // remoteMethod(query) {
    //   if (query !== "") {
    //     this.loading = true;
    //     setTimeout(() => {
    //       getRentVrfList({
    //         deviceId: this.deviceId,
    //         name: query
    //         // page: 1,
    //         // pageSize: this.pageSize,
    //         // rentAreaId: this.ruleForm.flyName
    //       }).then(res => {
    //         if (res.code === 10000) {
    //           this.loading = false;
    //           this.ruleForm.vrfArr = res.result;
    //         }
    //       });
    //     }, 200);
    //   } else {
    //     this.ruleForm.vrfArr = [];
    //   }
    //   // console.log(query);
    // },
    //获焦获取租户路由域的数据
    // Get the tenant routing domain data in focus
    // flySearchData() {
    //   getRentVrfList({ page: this.page, pageSize: this.pageSize }).then(res => {
    //     if (res.code === 10000) {
    //       this.ruleForm.vrfArr = res.result;
    //     }
    //   });
    // },
    // load() {
    //   getRentVrfList({
    //     page: this.page++,
    //     pageSize: this.pageSize
    //     // name: this.ruleForm.serverName,
    //     // deviceId: this.deviceId
    //   }).then(res => {
    //     if (res.code === 10000 && res.result.length) {
    //       //   this.loaDing = false;
    //       this.ruleForm.vrfArr = this.ruleForm.renData.concat(res.result);
    //     } else {
    //     }
    //   });
    // },
    chosebackBone(val) {
      this.ruleForm.IPV6[0].ipv6 = "";
      this.ruleForm.IPV4[0].ipv4 = "";
      if (val) {
        this.ipv6[0].required = true;
        document.getElementById("greIpv6edit0").disabled = true;
        document.getElementById("greIpv6edit0").style.background = "#D1D7E0";
      } else {
        this.ipv6[0].required = false;
        document.getElementById("greIpv6edit0").disabled = false;
        document.getElementById("greIpv6edit0").style.background = "white";
      }
    },
    ip4Toip6(val, key, index) {
      // this.form.index = index;
      let reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]?|3[0-2])$/;
      let test = reg.test(val);
      if (test == true) {
        for (var i in this.ruleForm.IPV6) {
          if (index == "greIpv6edit0") {
            this.ruleForm.IPV6[0].ipv6 = IPv4ToIPv6(val);
            document.getElementById("greIpv6edit0").disabled = true;
            document.getElementById("greIpv6edit0").style.background =
              "#D1D7E0";
          }
        }
      }
      // document.getElementById(key).disabled = true
      // document.getElementById(key).style.background = "#D1D7E0"
      // document.getElementById(key).style.border = "1px solid rgba(209,215,224,1)"
    },
    choseVrf(val) {
      let vrfName = "";
      this.ruleForm.IPV4[0].ipv4 = "";
      this.ruleForm.IPV6[0].ipv6 = "";
      this.ruleForm.vrfArr.map(item => {
        if (val == item.id) {
          vrfName = item.name;
        }
      });
      // console.log(vrfName)
      if (vrfName == "default") {
        this.ruleForm.backboneShow = true;
        // this.form.backbone = true
        // this.ipv6[0].required = true
      } else {
        this.ipv6[0].required = false;
        this.ruleForm.backboneShow = false;
        this.ruleForm.backbone = false;
        document.getElementById("greIpv6edit0").disabled = false;
        document.getElementById("greIpv6edit0").style.background = "white";
      }
    },
    submitForm(formName) {
      // console.log(this.$refs[formName]);
      let deviceId = this.deviceId;
      let random = parseInt((Math.random() + 1) * Math.pow(10, 6 - 1));
      let ipv4 = this.ruleForm.IPV4.map(item => item.ipv4);
      let ipv6 = this.ruleForm.IPV6.map(item => item.ipv6);
      let data = {
        description: this.ruleForm.description,
        destinationIp: this.ruleForm.goalIp,
        name: this.ruleForm.greName,
        id: this.ruleForm.id,
        ipv4List: ipv4,
        ipv6List: ipv6,
        deviceId,
        isMainPort: this.ruleForm.backbone,
        randomId: random,
        sourceIp: this.ruleForm.rootIp,
        vrfId:
          this.ruleForm.vrf === this.rowVrfname
            ? this.ruleForm.vrfId
            : this.ruleForm.vrf,
        tenantId: JSON.parse(this.$route.query.devData).tenantId
      };
      this.$refs[formName].validate(valid => {
        if (valid) {
          editGre(data).then(res => {
            // console.log(res);
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[5]")
              });
              this.restaurants = [];
              // this.$refs[formName].resetFields();
              this.$parent.isShowD = false;
              this.$parent.lNumber = 1;
              this.$parent.greDataInit({
                pageSize: this.$parent.lSize,
                page: this.$parent.lNumber,
                deviceId: this.deviceId
              });
            } else {
              this.$message({
                type: "warning",
                message: res.message
              });
              this.restaurants = [];
              this.$parent.isShowD = false;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    close() {
      this.$parent.isShowD = false;
      // this.$refs.form.resetFields();
      this.ruleForm.backboneShow = true;
      this.ruleForm.backbone = false;
      this.ipv6[0].required = false;
      this.ruleForm.IPV4 = [
        {
          ipv4: "",
          key: Date.now()
        }
      ];
      this.ruleForm.IPV6 = [
        {
          ipv6: "",
          key: Date.now()
        }
      ];
    },
    removeIpv4(item) {
      var index = this.ruleForm.IPV4.indexOf(item);
      if (index !== -1) {
        this.ruleForm.IPV4.splice(index, 1);
      }
    },
    addIpv4() {
      this.ruleForm.IPV4.push({
        ipv4: "",
        key: Date.now()
      });
    },
    addIpv6() {
      this.ruleForm.IPV6.push({
        ipv6: "",
        key: Date.now()
      });
    },
    removeIpv6(item) {
      var index = this.ruleForm.IPV6.indexOf(item);
      if (index !== -1) {
        this.ruleForm.IPV6.splice(index, 1);
      }
    },
    async dataInit(row) {
      console.log(row);
      this.ruleForm.greName = row.name;
      this.ruleForm.rootIp = row.sourceIp;
      this.ruleForm.vrf = row.vrfName;
      this.ruleForm.vrfId = row.vrfId;
      this.rowVrfname = row.vrfName;
      this.ruleForm.goalIp = row.destinationIp;
      this.ruleForm.description = row.description;
      this.ruleForm.id = row.id;
      this.ruleForm.IPV4 = row.ipv4List.map(item => {
        return { ipv4: item, key: Date.now() };
      });
      let isNone = []

      isNone = row.ipv6List.length==0?[""]:row.ipv6List
      this.ruleForm.IPV6 = isNone.map(item => {
        return { ipv6: item, key: Date.now() };
      });
      function takeGary() {
        document.getElementById("greIpv6edit0").disabled = true;
        document.getElementById("greIpv6edit0").style.background = "#D1D7E0";
      }
      setTimeout(() => {
        row.isMainPort ? takeGary() : null;
      });
      this.ruleForm.backbone = row.isMainPort;
      let data = await greOptions(
      //   {
      //   deviceId: this.deviceId,
      //   tenantId: JSON.parse(this.$route.query.devData).tenantId
      // }
      );
      if (data.code === 10000) {
        this.ruleForm.vrfArr = data.result;
      }
    }
  },
  created() {
    this.lang = sessionStorage.getItem("lang");
  },
  mounted() {}
};
</script>
<style scoped lang="scss">
.editGRE {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.2);
  z-index: 100;
}
.context {
  width: 880px;
  max-height: 390px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 15px 30px 0px rgba(191, 198, 217, 0.15);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: auto;
  .title {
    width: 100%;
    height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid rgba(231, 231, 231, 1);
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    i {
      width: 14px;
      height: 14px;
      background: url("../../../../../assets/icon_close.png") no-repeat;
      background-size: cover;
      cursor: pointer;
    }
  }
}
.contextEn {
  width: 1010px;
}
.context::-webkit-scrollbar {
  width: 4px;
  /*height: 4px;*/
}
.context::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.context::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.event {
  width: 100%;
  padding: 30px 0 30px 30px;
}
.tunnel {
  width: 100%;
  display: flex;
  .ipv4,
  .ipv6 {
    width: 420px;
    .addcontent {
      width: 300px;
      display: flex;
      justify-content: space-between;
    }
    .add,
    .remove {
      width: 34px;
      height: 34px;
      background: rgba(255, 255, 255, 1);
      border-radius: 7px;
      border: 1px solid rgba(209, 215, 224, 1);
      outline: none;
      display: table-cell;
      text-align: center;
      vertical-align: middle;
      cursor: pointer;
      position: relative;
      top: 1px;
      img {
        display: inline-block;
        width: 15px;
        height: 15px;
      }
    }
  }
}
.tunnelEn {
  .ipv4,
  .ipv6 {
    width: 495px;
  }
}
.submit {
  width: 100%;
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
    cursor: pointer;
  }
}
.backbone {
  padding-left: 70px;
}
</style>
<style lang="scss">
.editGRE {
  .el-input {
    width: 300px;
    height: 34px;
    .el-input__inner {
      height: 100%;
      border-radius: 7px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
  .el-form-item__label {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
  .el-textarea {
    width: 300px;
    height: 34px;
    .el-textarea__inner {
      height: 100%;
      border-radius: 7px;
    }
  }
  .tunnel {
    .ipv4,
    .ipv6 {
      .el-input {
        width: 250px;
        height: 34px;
        display: flex;
        .el-input__inner {
          height: 100%;
          border-radius: 7px;
        }
        .el-input__icon {
          line-height: normal;
        }
      }
    }
  }
}
</style>