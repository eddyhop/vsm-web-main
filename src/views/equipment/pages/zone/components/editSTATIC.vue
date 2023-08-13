<template>
  <div class="deitSTATIC isShow" ref="deitSTATIC">
    <div :class="`context ${lang=='en'?'contextEn':''}`">
      <h4 class="title">
        <span>{{isEdit ? $t('vsr100.static.edit') : '查看'}} STATIC-IPV{{type === 0 ? '4' : '6'}}</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="event">
        <el-form
          :model="editData"
          :rules="rules"
          ref="form"
          :label-width="`${lang=='en'?'190px':'100px'}`"
          class="demo-ruleForm"
          @submit.native.prevent
          :disabled="!isEdit"
        >
          <el-form-item :label="$t('vsr1000.tenantRoutingDomain')" prop="vrfName">
            <!-- <el-select filterable v-model="editData.vrfName" :placeholder="$t('vsr1000.choose')">
              <el-option
                v-for="item in editData.vrfNameArr"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>-->
            <el-select filterable
              v-model="editData.vrfName"
              
              remote
              reserve-keyword
              :placeholder="$t('vsr1000.choose')"
              :remote-method="remoteMethod2"
              :loading="loading2"
              @focus="searchData2"
            >
              <div
                class="serverData"
                v-infinite-scroll="load2"
                infinite-scroll-delay="500"
                infinite-scroll-immediate="false"
              >
                <el-option
                  v-for="item in editData.vrfNameArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </div>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('vsr1000.targetSite')" prop="ip">
            <el-input v-model="editData.ip" @blur="zhuan" placeholder="192.168.0.1/30"></el-input>
          </el-form-item>
          <el-form-item :label="$t('vsr1000.distance')" prop="dis">
            <el-input v-model="editData.dis" placeholder="0"></el-input>
          </el-form-item>
          <el-form-item :label="$t('vsr1000.nextHop')" prop="nextHopIp">
            <el-input v-model="editData.nextHopIp" placeholder="5.5.5.5"></el-input>
          </el-form-item>
          <el-form-item :label="$t('vsr1000.outInterface')" prop="outInterface">
            <el-select filterable
              v-model="editData.outName"
              
              remote
              reserve-keyword
              :placeholder="$t('vsr1000.chooseTenantRoutingDomain')"
              :remote-method="remoteMethod"
              :loading="loading"
              @focus="searchData"
              disabled
            >
              <div
                class="serverData"
                v-infinite-scroll="load"
                infinite-scroll-delay="500"
                infinite-scroll-immediate="false"
              >
                <el-option label="any" value="any"></el-option>
                <el-option
                  v-for="item in editData.outNameArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </div>
            </el-select>
          </el-form-item>
          <div class="submit">
            <button class="save" v-debounce.prevent="submitForm">{{$t('vsr1000.save')}}</button>
            <button class="cancel" @click.prevent="close">{{$t('vsr1000.cancel')}}</button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {
  editStatic,
  findByRepeatIp,
  // getRentUser,
  getStaticRentUser,
  getLogicOutPortList,
  isMaskRepeat,
  isIPVSRepeat,
  deviceSimpleIPV6ToFullIPV6, //简写转全写
                              // So let me write it all out
  deviceFullIPV6ToSimpleIPV6, //全写转简写
                              // Let me write it all
  staticCheckDestIp,
  checkRepeatIp, //ip地址重复性校验
                 // IP address repeatability check
  checkRepeatNextIp //下一跳重复性校验
                    // Next hop repeatability check
} from "@/services";
import { compare, compareIPV6 } from "@/utils/change";
export default {
  props: {
    isShow: {
      type: Boolean
    }
  },
  components: {},
  data() {
    let ipRule = (rule, value, callback) => {
      if (value) {
        if (this.type === 0) {
          let reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]?|3[0-2])$/;
          if (reg.test(value)) {
            callback();
          } else {
            callback(new Error(this.$t("vsr1000.remind2[7]")));
          }
        } else if (this.type === 1) {
          let reg = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*([/])(?:[0-9]|[1-9][0-9]?|[1-9][0-9][0-9])$/;
          if (reg.test(value)) {
            callback();
          } else {
            callback(new Error(this.$t("vsr1000.remind2[7]")));
          }
        }
      }
    };
    let destIpRule = (rule, value, callback) => {
      if (value) {
        if (this.type === 1) {
          staticCheckDestIp({ destIp: value }).then(res => {
            if (!res.success) {
              callback(new Error(this.$t("vsr1000.remind2[8]")));
              // console.log("true");
            } else {
              // console.log("false");
              callback();
            }
          });
        } else {
          callback();
        }
      }
    };
    let ipRepeatRule = (rule, value, callback) => {
      if (value) {
        if (this.editData.vrfName.length && this.editData.ip) {
          checkRepeatIp({
            deviceId: JSON.parse(this.$route.query.devData).deviceId,
            id: this.editData.id,
            ip: this.editData.ip,
            nextHopIp: value,
            routType: 1,
            type: this.type,
            vrfId: this.editData.vrfName
          }).then(res => {
            if (res.code == 10000) {
              callback();
            } else {
              callback(new Error(this.$t("vsr1000.greRule[5]")));
            }
          });
        }
      }
    };
    let ipRuleChange = (rule, value, callback) => {
      if (value) {
        if (this.editData.vrfName.length) {
          callback();
          // if (value == "0.0.0.0/0") {
          //   callback(new Error("已存在此IP"));
          // Callback (new Error(" This IP already exists ");
          // } else {
          //   callback();
          // }
        } else {
          callback(new Error(this.$t("vsr1000.greRule[6]")));
        }
      }
    };
    // let nextHoopIpRule = (rule, value, callback) => {
    //   if (value) {
    //     checkRepeatNextIp({
    //       deviceId: sessionStorage.getItem("deviceId"),
    //       ip: value,
    //       id: this.editData.id
    //     }).then(res => {
    //       if (res.result) {
    //         callback();
    //       } else {
    //         callback(new Error(this.$t("vsr1000.greRule[5]")));
    //       }
    //     });
    //   }
    // };
    let nextHopIpRule = (rule, value, callback) => {
      if (value) {
        if (this.type === 0) {
          let reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
          if (reg.test(value)) {
            callback();
          } else {
            callback(new Error(this.$t("vsr1000.greRule[2]")));
          }
        } else if (this.type === 1) {
          let reg = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
          if (reg.test(value)) {
            callback();
          } else {
            callback(new Error(this.$t("vsr1000.greRule[2]")));
          }
        }
      }
    };
    let vrfNameRule = (rule, value, callback) => {
      if (!this.vrfNameMsg) {
        callback();
      } else {
        callback(new Error(this.vrfNameMsg));
      }
    };
    var NumRule = (rule, value, callback) => {
      if (value) {
        let val = value * 1;
        let reg = /^[0-9]*$/;
        if (reg.test(val)) {
          if (val >= 0 && val <= 2147483647) {
            callback();
          } else {
            callback(new Error("值的范围为0-2147483647"));
          }
        } else {
          callback(new Error("输入的值必须为数字,且不能超过2147483647"));
        }
      } else {
        callback();
      }
    };
    return {
      isEdit: false,
      lang: "",
      editData: {
        dis: 0,
        id: "",
        ip: "",
        ipMask: "",
        met: "",
        deviceId: "",
        nextHopIp: "",
        nextHopPortId: "",
        nextHopType: "",
        portId: "",
        portType: "",
        title: "",
        vrfId: "",
        vrfName: "",
        outName: "any",
        outId: "",
        vrfNameArr: [],
        outNameArr: []
      },
      vrfNameMsg: "",
      type: 0,
      pageSize: 5,
      page: 1,
      page2: 1,
      rowOutNmae: "",
      rowVrfName: "",
      loading: false,
      loading2: false,
      rules: {
        vrfName: [
          { validator: vrfNameRule, trigger: "change" },
          {
            required: true,
            message: this.$t("vsr1000.remind2[3]"),
            trigger: "change"
          }
        ],
        ip: [
          {
            required: true,
            message: this.$t("vsr1000.greRule[2]"),
            trigger: "blur"
          },
          // {
          //   validator: ipRuleChange,
          //   trigger: "change"
          // },
          {
            validator: ipRule,
            trigger: "change"
          },
          {
            validator: ipRule,
            trigger: "blur"
          },
          {
            validator: destIpRule,
            trigger: "blur"
          }
        ],
        dis: [
          {
            validator: NumRule,
            trigger: "blur"
          }
        ],
        nextHopIp: [
          {
            required: true,
            message: this.$t("vsr1000.greRule[12]"),
            trigger: "blur"
          },
          { validator: nextHopIpRule, trigger: "change" },
          {
            validator: ipRepeatRule,
            trigger: "blur"
          }
          // { validator: nextHoopIpRule, trigger: "change" }
        ]
      }
    };
  },
  computed: {},
  methods: {
    close() {
      this.vrfNameMsg = "";
      this.$refs.deitSTATIC.classList.add("isShow");
    },
    submitForm(formName) {
      // console.log(this.$refs[formName]);
      let data = {
        distance: this.editData.dis,
        ip: this.editData.ip,
        deviceId: this.editData.deviceId,
        nextHopIp: this.editData.nextHopIp,
        randomId: parseInt((Math.random() + 1) * Math.pow(10, 6 - 1)),
        title: this.editData.title,
        vrfId:
          this.editData.vrfName === this.rowVrfName
            ? this.editData.vrfId
            : this.editData.vrfName,
        outId:
          this.editData.outName === this.rowOutNmae
            ? this.editData.outId
            : this.editData.outName,
        id: this.editData.id,
        type: this.type,
        tenantId: JSON.parse(this.$route.query.devData).tenantId
      };

      this.$refs[formName].validate(valid => {
        if (valid) {
          // alert("编辑成功!");
          // Alert (" Edit successful!" );
          editStatic(data).then(res => {
            // console.log(res);
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[1]")
              });
              this.$refs.deitSTATIC.classList.add("isShow");
              this.vrfNameMsg = "";
              this.$parent.getStaticListInit({
                deviceId: JSON.parse(this.$route.query.devData).deviceId,
                pageNumber:
                  this.$parent.index === 0
                    ? this.$parent.lNumber
                    : this.$parent.pageSize,
                pageSize:
                  this.$parent.index === 0
                    ? this.$parent.lSize
                    : this.$parent.sizeIpv6,
                type: this.$parent.index,
                routeType: 0
              });
            } else {
              this.$message({
                type: "warning",
                message: res.message
              });
              this.$refs.deitSTATIC.classList.add("isShow");
              this.vrfNameMsg = "";
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async dataInit(row, type) {
      // console.log(row);
      this.editData.vrfName = row.vrfName;
      this.editData.vrfId = row.vrfId;
      this.rowVrfName = row.vrfName;
      this.editData.ip = row.ip;
      this.editData.nextHopIp = row.nextHopIp;
      this.editData.dis = row.distance;
      this.editData.deviceId = row.deviceId;
      this.editData.id = row.id;
      this.editData.outName = row.loginPortId === "any" ? "any" : row.interName;
      this.rowOutNmae = row.loginPortId === "any" ? "any" : row.interName;
      this.editData.outId = row.outId;
      this.type = type;
      let data = await getStaticRentUser({
        deviceId: JSON.parse(this.$route.query.devData).deviceId
      });
      if (data.code === 10000) {
        let arr = [];
        Object.keys(data.result).forEach((item, index) => {
          arr.push({
            name: Object.values(data.result)[index],
            id: item
          });
        });
        this.editData.vrfNameArr = arr;
      } else if (data.code !== 10000) {
        this.editData.vrfNameArr = [];
        this.vrfNameMsg = data.message;
      }
    },
    zhuan() {
      if (this.type === 0) {
        let reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]?|3[0-2])$/;
        if (reg.test(this.editData.ip)) {
          let ip = this.editData.ip.split("/")[0];
          let code = this.editData.ip.split("/")[1];
          if (code == 32) {
            return;
          } else {
            this.editData.ip = compare(ip, code) + "/" + code;
          }
        }
      } else {
        let reg = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*([/])(?:[1-9][0-9]*)$/;
        if (reg.test(this.editData.ip)) {
          deviceSimpleIPV6ToFullIPV6({ ipv6: this.editData.ip }).then(res => {
            if (res.code === 10000) {
              let ip = res.result;
              let code = this.editData.ip.split("/")[1];
              if (code == 32) {
                return;
              } else {
                deviceFullIPV6ToSimpleIPV6({
                  ipv6: compareIPV6(ip, code) + "/" + code
                }).then(res => {
                  if (res.code === 10000) {
                    this.editData.ip = res.result + "/" + code;
                  }
                });
              }
            }
          });
        }
      }
    },
    //获焦获取出接口列表数据
    // Get focus to get interface list data
    searchData() {
      let params = {
        deviceId: JSON.parse(this.$route.query.devData).deviceId,
        name: "",
        page: this.page,
        pageSize: this.pageSize,
        rentAreaId: this.editData.vrfName
      };
      this.getOutPorts(params);
    },
    //获焦获取租户路由域列表数据
    // Get the tenant routing domain list data in focus
    searchData2() {
      let params = {
        deviceId: JSON.parse(this.$route.query.devData).deviceId,
        name: "",
        page: this.page,
        pageSize: this.pageSize
      };
      this.getVrfName(params);
    },
    //搜索获取出接口列表数据
    // The search retrieves the interface list data
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          getLogicOutPortList({
            deviceId: JSON.parse(this.$route.query.devData).deviceId,
            name: query,
            // page: 1,
            // pageSize: this.pageSize,
            rentAreaId: this.editData.vrfName
          }).then(res => {
            if (res.code === 10000) {
              this.loading = false;
              this.editData.outNameArr = res.result;
            }
          });
        }, 200);
      }
    },
    //搜索获取租户路由域列表数据
    // The search gets the tenant routing domain list data
    remoteMethod2(query) {
      if (query !== "") {
        this.loading2 = true;
        setTimeout(() => {
          getStaticRentUser({
            deviceId: JSON.parse(this.$route.query.devData).deviceId,
            name: query
            // page: 1,
            // pageSize: this.pageSize,
          }).then(res => {
            if (res.code === 10000) {
              this.loading2 = false;
              this.editData.vrfNameArr = res.result;
            }
          });
        }, 200);
      }
    },
    //上拉加载出接口列表
    // Pull up and load the list of interfaces
    load() {
      getLogicOutPortList({
        deviceId: JSON.parse(this.$route.query.devData).deviceId,
        name: this.editData.outName,
        page: this.page++,
        pageSize: this.pageSize,
        rentAreaId: this.editData.vrfName
      }).then(res => {
        if (res.code === 10000 && res.result.length) {
          this.editData.outNameArr = this.editData.outNameArr.concat(
            res.result
          );
        }
      });
    },
    load2() {
      getStaticRentUser({
        deviceId: JSON.parse(this.$route.query.devData).deviceId,
        name: this.editData.vrfName,
        page: this.page2++,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code === 10000 && res.result.length) {
          this.editData.vrfNameArr = this.editData.vrfNameArr.concat(
            res.result
          );
        }
      });
    },
    //出接口列表获取
    // Get out of the interface list
    getOutPorts(params) {
      getLogicOutPortList(params).then(res => {
        if (res.code === 10000) {
          this.editData.outNameArr = res.result;
        }
      });
    },
    //租户路由域列表获取
    // Tenant routing domain list fetch
    async getVrfName(params) {
      let data = await getStaticRentUser(params);
      if (data.code === 10000) {
        this.editData.vrfNameArr = data.result;
      } else if (data.code !== 10000) {
        this.editData.vrfNameArr = [];
        this.vrfNameMsg = data.message;
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
.isShow {
  display: none;
}
.deitSTATIC {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(32, 42, 59, 0.2);
  z-index: 100;
}
.context {
  width: 462px;
  // height: 392px;
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
  width: 560px;
}
.event {
  padding: 30px 30px 30px 10px;
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
.serverData {
  max-height: 257px;
  width: 100%;
}
</style>
<style lang="scss">
.deitSTATIC .el-select {
  width: 100%;
}
.deitSTATIC {
  .el-input {
    width: 322px;
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
}
</style>
