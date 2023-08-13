<template>
  <div class="edirVPN isShow" ref="edirVPN">
    <div :class="`context ${lang=='en'?'contextEn':''}`">
      <h4 class="title">
        <span>{{editVPNData.name}}{{$t("vsr1000.details")}}</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="event">
        <el-form
          :model="editVPNData"
          :rules="rules"
          ref="form"
          label-width="110px"
          class="demo-ruleForm"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item :label="$t('vsr1000.name')" prop="name">
            <el-input v-model="editVPNData.name" disabled></el-input>
          </el-form-item>
          <el-form-item :label="$t('vsr1000.describe')" prop="descr" :label-width="`${lang=='en'?'190px':'110px'}`">
            <el-input type="textarea" v-model="editVPNData.descr" disabled></el-input>
          </el-form-item>
          <el-form-item :label="$t('vsr1000.logicPort')" prop="portName">
            <!-- <el-select filterable v-model="editVPNData.logicPortId" :placeholder="$t('vsr1000.choose')">
              <el-option
                v-for="item in portList"
                :key="item.id"
                :label="item.portName"
                :value="item.id"
              ></el-option>
            </el-select>-->

            <el-select filterable
              v-model="editVPNData.portName"
              
              remote
              reserve-keyword
              :placeholder="$t('vsr1000.chooseTenantRoutingDomain')"
              :remote-method="remoteMethod3"
              :loading="loading3"
              @focus="portSearchData"
              disabled
            >
              <div
                class="serverData"
                v-infinite-scroll="load3"
                infinite-scroll-delay="500"
                infinite-scroll-immediate="false"
              >
                <!-- <el-option label="123" value="123123123"></el-option> -->
                <el-option
                  v-for="item in portList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </div>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('vsr1000.tenantRoutingDomain')" prop="vrfName" :label-width="`${lang=='en'?'190px':'110px'}`">
            <!-- <el-select filterable v-model="editVPNData.vrfName" placeholder @change="clearServer">
              <el-option
                v-for="item in renData"
                :key="item.id"
                :label="item.rrfName"
                :value="item.id"
              ></el-option>
            </el-select>-->
            <el-select filterable
              v-model="editVPNData.vrfName"
              
              remote
              reserve-keyword
              :placeholder="$t('vsr1000.chooseTenantRoutingDomain')"
              :remote-method="remoteMethod4"
              :loading="loading4"
              @focus="flySearchData"
              @change="clearServer"
              disabled
            >
              <div
                class="serverData"
                v-infinite-scroll="load4"
                infinite-scroll-delay="500"
                infinite-scroll-immediate="false"
              >
                <el-option
                  v-for="item in renData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </div>
            </el-select>
          </el-form-item>
          <!-- <el-form-item :label="$t('vsr1000.bandwidth')" prop="tapWidth">
            <el-input v-model.number="editVPNData.tapWidth" disabled></el-input>
          </el-form-item> -->
          <el-form-item :label="$t('vsr1000.role')" prop="vpnCha" :label-width="`${lang=='en'?'190px':'110px'}`">
            <el-select filterable
              v-model="editVPNData.vpnCha"
              @change="roleChange(editVPNData.vpnCha)"
              placeholder="Client"
              disabled
            >
              <el-option
                v-for="item in vpnRole"
                :key="item.id"
                :label="item.dictValue"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item
            :label="editVPNData.vpnCha==='1' ? 'IP地址' :'WAN口'"
            :prop="editVPNData.vpnCha==='1' ? 'ip' : 'change'"
          >
            <el-input v-model="editVPNData.ip" v-if="editVPNData.vpnCha==='1'"></el-input>
            <el-select filterable v-model="editVPNData.wan" placeholder v-else>
              <el-option label="WAN口1" value="WAN口1"></el-option>
              <el-option label="WAN口2" value="WAN口2"></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item
            :label="rolePart==='Client' ? 'Server-ip' :'Client'+$t('vsr1000.name')"
            :prop="rolePart==='Client' ? 'ip' : 'clientName'"
          >
            <el-input v-model="editVPNData.ip" v-if="rolePart==='Client'" disabled></el-input>
            <el-select filterable
              v-else
              v-model="editVPNData.clientName"
              
              remote
              reserve-keyword
              :placeholder="$t('vsr1000.keyWord')"
              :remote-method="remoteMethod"
              :loading="loading"
              @focus="searchData(true)"
              disabled
            >
              <div
                class="serverData"
                v-infinite-scroll="load"
                infinite-scroll-delay="500"
                infinite-scroll-immediate="false"
              >
                <el-option
                  v-for="item in restaurants"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </div>
            </el-select>
          </el-form-item>

          <el-form-item
            :label="'Server'+$t('vsr1000.name')"
            prop="serverName"
            v-show="rolePart==='Client'"
            :label-width="`${lang=='en'?'190px':'110px'}`"
          >
            <el-select filterable
              v-model="editVPNData.serverName"
              
              remote
              reserve-keyword
              :placeholder="$t('vsr1000.keyWord')"
              :remote-method="remoteMethod2"
              :loading="loading2"
              @focus="searchData(false)"
              disabled
            >
              <div
                class="serverData"
                v-infinite-scroll="load2"
                infinite-scroll-delay="500"
                infinite-scroll-immediate="false"
              >
                <el-option
                  v-for="item in serverSearch"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </div>
            </el-select>
          </el-form-item>

          <!-- <el-form-item :label="$t('vsr1000.tunnelIP')" prop="tunIp">
            <el-input v-model="editVPNData.tunIp"></el-input>
          </el-form-item>-->

          <div :class="`tunnel ${lang=='en'?'tunnelEn':''}`">
            <div class="ipv4">
              <el-form-item
                :label="$t('vsr1000.tunnel')+'IPV4'"
                v-for="(domain, index) in editVPNData.IPV4"
                :key="domain.key"
                :prop="'IPV4.' + index + '.ipv4'"
                :rules="[
                  {required: true, message: 'IPV4不能为空', trigger: 'blur'},
                  {
                    pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                    message: '请输入正确的IPV4地址'
                  },
                  {
                    validator:ruleIPV4,
                    trigger: 'blur'
                  }
                ]"
              >
                <div class="addcontent">
                  <el-input v-model="domain.ipv4" disabled></el-input>
                  <span>/30</span>
                  <button v-if="index==0" class="add" @click.prevent="addIpv4" disabled>
                    <img src="@/assets/newPage/deviceconfiguration_icon_arp_add@2x.png" />
                  </button>
                  <button
                    class="remove"
                    v-if="editVPNData.IPV4.length>1&&index>0"
                    @click.prevent="removeIpv4(domain)"
                    disabled
                  >
                    <img src="@/assets/deviceconfiguration_icon_arp_delete@2x.png" alt />
                  </button>
                </div>
              </el-form-item>
            </div>
            <div class="ipv6">
              <el-form-item
                :label="$t('vsr1000.tunnel')+'IPV6'"
                v-for="(domain, index) in editVPNData.IPV6"
                :key="domain.key"
                :prop="'IPV6.' + index + '.ipv6'"
                :label-width="`${lang=='en'?'145px':'110px'}`"
                :rules="[
                  {
                  pattern: /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,
                  message: '请输入正确的IPV6地址'
                  },
                  {
                    validator:ruleIPV6,
                    trigger: 'blur'
                  }
                ]"
              >
                <div class="addcontent">
                  <el-input :id="domain.key" v-model="domain.ipv6" disabled></el-input>
                  <span>/126</span>
                  <button v-if="index==0" class="add" @click.prevent="addIpv6" disabled>
                    <img src="@/assets/newPage/deviceconfiguration_icon_arp_add@2x.png" />
                  </button>
                  <button
                    class="remove"
                    v-if="editVPNData.IPV6.length>1&&index>0"
                    @click.prevent="removeIpv6(domain)"
                    disabled
                  >
                    <img src="@/assets/deviceconfiguration_icon_arp_delete@2x.png" alt />
                  </button>
                </div>
              </el-form-item>
            </div>
          </div>
          <!-- <div class="submit">
            <button
              class="save"
              type="primary"
              v-debounce.prevent="submitForm"
            >{{$t('vsr1000.save')}}</button>
            <button class="cancel" @click.prevent="close">{{$t('vsr1000.cancel')}}</button>
          </div>-->
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {
  // editVsrVpn,
  // getVpnRole,
  // getLoginport,
  // isRepeatVpnTunIp,
  // getVpnName,
  // getVpnAllServer,
  // getRentAllMachine,
  // getRentUser,
  // getRentAllServerMachine,
  // isVpnChannelIp,

  //ipv4隧道唯一性校验
  // Ipv4 tunnel uniqueness check
  getVpnChannelIp,
  //vpn名字是否重复
  // Whether the VPN name is repeated
  getVpnName,
  //编辑vpn
  // Edit the VPN
  editVsrVpn,
  //client获取所有设备
  // The client gets all the devices
  getRentAllMachine,
  //server获取所有设备
  // Server gets all the devices
  getRentAllServerMachine,
  //获取租户路由域
  // Gets the tenant routing domain
  getRentVrfList,
  //获取逻辑端口下拉
  // Gets the logical port drop-down
  getLoginPort,
  //角色获取
  // To obtain
  getDict
} from "@/services/index";
export default {
  props: {},
  components: {},
  data() {
    var ruleIpv4 = (rule, value, callback) => {
      let params = {
        channelIp: value,
        deviceId: JSON.parse(this.$route.query.devData).deviceId,
        vpnCha: this.editVPNData.vpnCha,
        id: this.editVPNData.id
      };
      let num = 0;
      this.editVPNData.IPV4.forEach(item => {
        if (item.ipv4 === value) {
          num++;
        }
      });
      if (num > 1) {
        callback(new Error("您输入的隧道IP网段重复"));
      } else {
        getVpnChannelIp(params).then(res => {
          if (!res.result) {
            callback(new Error("您输入的隧道IP网段相同"));
          } else {
            callback();
          }
        });
      }
    };
    var ruleIpv6 = (rule, value, callback) => {
      let params = {
        deviceId: JSON.parse(this.$route.query.devData).deviceId,
        ip: value
      };
      let num = 0;
      this.editVPNData.IPV6.forEach(item => {
        if (item.ipv6 === value) {
          num++;
        }
      });
      if (num > 1) {
        callback(new Error("您输入的隧道IP网段重复"));
      } else {
        callback();
        // isIPVSRepeat(params).then(res => {
        //   if (!res.result) {
        //     callback(new Error("您输入的隧道IP网段相同"));
        // Callback (new Error(" The same tunnel IP network segment you typed in ");
        //   } else {
        //     callback();
        //   }
        // });
      }
    };
    var nameRepetition = (rule, value, callback) => {
      if (value) {
        getVpnName({
          deviceId: JSON.parse(this.$route.query.devData).deviceId,
          name: value
        }).then(res => {
          if (res.result) {
            callback();
          } else {
            callback(new Error("您输入的名称已存在"));
          }
        });
      }
    };
    return {
      lang:"",
      editVPNData: {
        descr: "",
        ip: "",
        logicPortId: "",
        portName: "",
        deviceId: "",
        randomId: "",
        id: "",
        name: "",
        tapWidth: null,
        // tunIp: "",
        vpnCha: "",
        vrfName: "",
        vrfId: "",
        // leftIp: "",
        serverId: "",
        clientId: "",
        clientName: "",
        serverName: "",
        //IPV4的地址
        // IPV4 address
        IPV4: [
          {
            ipv4: "",
            key: Date.now()
          }
        ],
        //IPV6的地址
        // IPV6 address
        IPV6: [
          {
            ipv6: "",
            key: Date.now()
          }
        ]
      },
      rowServeName: "",
      rowClientName: "",
      rowPortName: "",
      rowVrfName: "",
      vpnRole: [],
      loading: false,
      loading2: false,
      loading3: false,
      loading4: false,
      //模糊搜素的数据
      // Fuzzy search data
      restaurants: [],
      //server数据
      // Server data
      serverSearch: [],
      //逻辑端口的数据
      // Data for logical ports
      portList: [],
      page: 1,
      pageSize: 5,
      page2: 1,
      page3: 1,
      page4: 1,
      loadup1: true,
      loadup2: true,
      loadup3: true,
      loadup4: true,
      renData: [],
      rolePart: "Sever",
      //IPV4唯一性校验
      // IPV4 uniqueness checks
      // IPV4only:VpnTunIpRepeat,
      ruleIPV4: ruleIpv4,
      ruleIPV6: ruleIpv6,
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" }
          // { validator: nameRepetition, trigger: "blur" }
        ],
        // portName: [
        //   { required: true, message: "请选择逻辑端口", trigger: "change" }
        // {Required: true, message: "Please select logical port ", trigger: "change"}
        // ],
        vpnCha: [
          { required: true, message: "请选择VPN角色", trigger: "change" }
        ],
        ip: [
          { required: true, message: "请输入IP地址", trigger: "blur" },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: "请输入正确的IP地址"
          }
        ],
        vrfName: [
          { required: true, message: "请选择租户路由域", trigger: "change" }
        ],
        tapWidth: [
          { required: true, message: "请输入宽带", trigger: "blur" },
          { type: "number", message: "宽带必须为数字值" }
        ],
        clientName: [
          { required: true, message: "请输入Client名称", trigger: "blur" }
          // { validator: RenChange, trigger: "change" }
        ]
      }
    };
  },
  computed: {},
  methods: {
    close() {
      // console.log(123);
      this.page = 1;
      this.page2 = 1;
      this.page3 = 1;
      this.page4 = 1;
      this.$refs.edirVPN.classList.add("isShow");
    },
    submitForm(formName) {
      // console.log(this.$refs[formName]);
      let deviceId = JSON.parse(this.$route.query.devData).deviceId;
      let random = parseInt((Math.random() + 1) * Math.pow(10, 6 - 1));
      // console.log(this.editVPNData.IPV4.map(item => item.ipv4));
      let data = {
        description: this.editVPNData.descr,
        serverIp: this.editVPNData.ip,
        logicalId:
          this.editVPNData.portName === this.rowPortName
            ? this.editVPNData.logicPortId
            : this.editVPNData.portName,
        deviceId,
        randomId: random + "",
        id: this.editVPNData.id,
        name: this.editVPNData.name,
        tapWidth: this.editVPNData.tapWidth + "",
        // tunIp: this.editVPNData.tunIp,
        vpnCharacter: this.editVPNData.vpnCha,
        vrfId:
          this.editVPNData.vrfName === this.rowVrfName
            ? this.editVPNData.vrfId
            : this.editVPNData.vrfName,
        // leftIp: this.editVPNData.leftIp,
        serverId:
          this.editVPNData.serverName === this.rowServeName
            ? this.editVPNData.serverId
            : this.editVPNData.serverName,
        clientId:
          this.editVPNData.clientName === this.rowClientName
            ? this.editVPNData.clientId
            : this.editVPNData.clientName,
        ipvF: this.editVPNData.IPV4.map(item => item.ipv4),
        ipvS: this.editVPNData.IPV6.map(item => item.ipv6)
      };
      this.$refs[formName].validate(valid => {
        console.log(valid)
        if (valid) {
          editVsrVpn(data).then(res => {
            // console.log(res);
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: "编辑成功!"
              });
              this.page = 1;
              this.page2 = 1;
              this.page3 = 1;
              this.page4 = 1;
              this.$refs.edirVPN.classList.add("isShow");
              this.$parent.getVsrVpnListInit({
                deviceId: JSON.parse(this.$route.query.devData).deviceId,
                pageSize: this.$parent.lSize,
                page: this.$parent.lNumber
              });
            } else {
              this.$message({
                type: "warning",
                message: res.message
              });
              this.page = 1;
              this.page2 = 1;
              this.page3 = 1;
              this.page4 = 1;
              this.$refs.edirVPN.classList.add("isShow");
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //server输入框请求数据
    // Server input box requests data
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          getRentAllMachine({
            deviceId: JSON.parse(this.$route.query.devData).deviceId,
            name: query,
            rentAreaId: this.editVPNData.flyName
          }).then(res => {
            if (res.code === 10000) {
              this.loading = false;
              this.restaurants = res.result;
            }
          });
        }, 200);
      } else {
        this.restaurants = [];
      }
      // console.log(query);
    },
    remoteMethod2(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          getRentAllServerMachine({
            name: query,
            deviceId: JSON.parse(this.$route.query.devData).deviceId,
            rentAreaId: this.editVPNData.flyName
          }).then(res => {
            if (res.code === 10000) {
              this.loading2 = false;
              this.serverSearch = res.result;
            }
          });
        }, 200);
      } else {
        this.serverSearch = [];
      }
    },
    remoteMethod3(query) {
      //逻辑端口模查
      // Logical port module
      if (query !== "") {
        this.loading3 = true;
        setTimeout(() => {
          getLoginPort({
            deviceId: JSON.parse(this.$route.query.devData).deviceId,
            name: query
            // page: 1,
            // pageSize: this.pageSize
            // rentAreaId: this.ruleForm.flyName
          }).then(res => {
            if (res.code === 10000) {
              this.loading3 = false;
              this.portList = res.result;
            }
          });
        }, 200);
      } else {
        this.portList = [];
      }
    },
    remoteMethod4(query) {
      if (query !== "") {
        this.loading4 = true;
        setTimeout(() => {
          getRentVrfList({
            deviceId: JSON.parse(this.$route.query.devData).deviceId,
            name: query
            // page: 1,
            // pageSize: this.pageSize
            // rentAreaId: this.ruleForm.flyName
          }).then(res => {
            if (res.code === 10000) {
              this.loading4 = false;
              this.renData = res.result;
            }
          });
        }, 200);
      } else {
        this.renData = [];
      }
    },
    portSearchData() {
      this.page3 = 1;
      this.loadup3 = true;
      getLoginPort({
        page: this.page3,
        pageSize: this.pageSize,
        name: this.editVPNData.portName,
        deviceId: JSON.parse(this.$route.query.devData).deviceId
      }).then(res => {
        if (res.code === 10000) {
          this.portList = res.result;
        }
      });
    },
    flySearchData() {
      this.page4 = 1;
      this.loadup4 = true;
      getRentVrfList({ page: this.page4, pageSize: this.pageSize }).then(
        res => {
          if (res.code === 10000) {
            this.renData = res.result;
          }
        }
      );
    },
    searchData(flag) {
      if (flag) {
        this.page = 1;
        this.loadup1 = true;
        this.searchServerData({
          page: this.page,
          pageSize: this.pageSize,
          rentAreaId: this.editVPNData.vrfName,
          name: "",
          deviceId: JSON.parse(this.$route.query.devData).deviceId
        });
      } else {
        this.page2 = 1;
        this.loadup2 = true;
        this.serverSearchData({
          page: this.page2,
          pageSize: this.pageSize,
          rentAreaId: this.editVPNData.vrfName,
          name: "",
          deviceId: JSON.parse(this.$route.query.devData).deviceId
        });
      }
    },
    searchServerData(params) {
      getRentAllMachine(params).then(res => {
        if (res.code === 10000) {
          this.restaurants = res.result;
        }
      });
    },
    //上拉加载
    // Pull on loading
    load() {
      if (this.loadup1) {
        getRentAllMachine({
          deviceId: JSON.parse(this.$route.query.devData).deviceId,
          name: this.editVPNData.clientId,
          page: this.page++,
          pageSize: this.pageSize,
          rentAreaId: this.editVPNData.flyName
        }).then(res => {
          if (res.code === 10000 && res.result.length) {
            //   this.loaDing = false;
            let arr = this.restaurants.concat(res.result);
            let newJson = [];
            arr.forEach(item1 => {
              let flag = true;
              newJson.forEach(item2 => {
                if (item1.id == item2.id) {
                  //让json数组对象的内容与新数组的内容作比较，相同的话，改变标记为false
                  // Compare the contents of the JSON array object to the contents of the new array, again changing the tag to false
                  flag = false;
                }
              });
              if (flag) {
                newJson.push(item1);
              }
            });
            this.restaurants = newJson;
          } else {
            this.loadup1 = true;
          }
        });
      }
    },
    load2() {
      if (this.loadup2) {
        getRentAllServerMachine({
          deviceId: JSON.parse(this.$route.query.devData).deviceId,
          name: this.editVPNData.serverId,
          page: this.page2++,
          pageSize: this.pageSize,
          rentAreaId: this.editVPNData.flyName
        }).then(res => {
          if (res.code === 10000 && res.result.length) {
            //   this.loaDing = false;
            let arr = this.serverSearch.concat(res.result);
            let newJson = [];
            arr.forEach(item1 => {
              let flag = true;
              newJson.forEach(item2 => {
                if (item1.id == item2.id) {
                  //让json数组对象的内容与新数组的内容作比较，相同的话，改变标记为false
                  // Compare the contents of the JSON array object to the contents of the new array, again changing the tag to false
                  flag = false;
                }
              });
              if (flag) {
                newJson.push(item1);
              }
            });
            this.serverSearch = newJson;
          } else {
            this.loadup2 = false;
          }
        });
      }
    },
    load3() {
      if (this.loadup3) {
        getLoginPort({
          page: this.page3++,
          pageSize: this.pageSize,
          name: this.editVPNData.portName,
          deviceId: JSON.parse(this.$route.query.devData).deviceId
        }).then(res => {
          if (res.code === 10000 && res.result.length) {
            //   this.loaDing = false;
            let arr = this.portList.concat(res.result);
            let newJson = [];
            arr.forEach(item1 => {
              let flag = true;
              newJson.forEach(item2 => {
                if (item1.id == item2.id) {
                  //让json数组对象的内容与新数组的内容作比较，相同的话，改变标记为false
                  // Compare the contents of the JSON array object to the contents of the new array, again changing the tag to false
                  flag = false;
                }
              });
              if (flag) {
                newJson.push(item1);
              }
            });
            this.portList = newJson;
          } else {
            this.loadup3 = false;
          }
        });
      }
    },
    load4() {
      if (this.loadup4) {
        getRentVrfList({
          page: this.page4++,
          pageSize: this.pageSize
          // name: this.ruleForm.serverName,
          // deviceId: sessionStorage.getItem("deviceId")
        }).then(res => {
          if (res.code === 10000 && res.result.length) {
            //   this.loaDing = false;
            let arr = this.renData.concat(res.result);
            let newJson = [];
            arr.forEach(item1 => {
              let flag = true;
              newJson.forEach(item2 => {
                if (item1.id == item2.id) {
                  //让json数组对象的内容与新数组的内容作比较，相同的话，改变标记为false
                  // Compare the contents of the JSON array object to the contents of the new array, again changing the tag to false
                  flag = false;
                }
              });
              if (flag) {
                newJson.push(item1);
              }
            });

            this.renData = newJson;
          } else {
            this.loadup4 = false;
          }
        });
      }
    },
    //server数据
    // Server data
    serverSearchData(params) {
      console.log("serve");
      getRentAllServerMachine(params).then(res => {
        if (res.code === 10000) {
          this.serverSearch = res.result;
        }
      });
    },
    clearServer() {
      this.editVPNData.clientName = "";
    },
    removeIpv4(item) {
      var index = this.editVPNData.IPV4.indexOf(item);
      if (index !== -1) {
        this.editVPNData.IPV4.splice(index, 1);
      }
    },
    addIpv4() {
      this.editVPNData.IPV4.push({
        ipv4: "",
        key: Date.now()
      });
    },
    addIpv6() {
      this.editVPNData.IPV6.push({
        ipv6: "",
        key: Date.now()
      });
    },
    removeIpv6(item) {
      var index = this.editVPNData.IPV6.indexOf(item);
      if (index !== -1) {
        this.editVPNData.IPV6.splice(index, 1);
      }
    },
    async dataInit(row) {
      console.log(row);
      this.editVPNData.name = row.name;
      this.editVPNData.descr = row.description;
      this.editVPNData.ip = row.serverIp;
      this.editVPNData.logicPortId = row.logicalId;
      this.editVPNData.portName = row.logName;
      this.editVPNData.deviceId = row.deviceId;
      this.editVPNData.id = row.id;
      this.editVPNData.tapWidth = row.bandwidth * 1;
      // this.editVPNData.tunIp = row.tunIp;
      this.editVPNData.vpnCha = row.vpnCharacter;
      // this.editVPNData.leftIp = row.leftIp;
      this.editVPNData.serverId = row.serverId;
      this.editVPNData.clientId = row.clientId;
      this.editVPNData.vrfName = row.vrfName;
      this.editVPNData.vrfId = row.vrfId;
      this.editVPNData.serverName = row.serverName;
      this.editVPNData.clientName = row.clientName;
      this.rolePart = row.roleName;
      let rowIpv6 = row.ipsList== null ? [""] :row.ipsList
      this.editVPNData.IPV4 = row.ipfList.map(item => {
        return {
          ipv4: item,
          key: Date.now()
        };
      });
      this.editVPNData.IPV6 = rowIpv6.map(item => {
        return {
          ipv6: item,
          key: Date.now()
        };
      });
      this.rowServeName = row.serverName;
      this.rowClientName = row.clientName;
      this.rowPortName = row.logName;
      this.rowVrfName = row.vrfName;
      let role = await getDict({ groupCode: "vpn", typeCode: "vpn" });
      // let Ren = await getRentVrfList();
      this.vpnRole = role.result;
      // this.renData = Ren.result;
    },
    roleChange(role) {
      //角色切换
      // Switch roles
      this.rolePart = this.vpnRole.find(item => item.id === role).dictValue;
    }
  },

  created() {
    this.lang = sessionStorage.getItem("lang")
  },
  mounted() {}
};
</script>
<style scoped lang="scss">
.isShow {
  display: none;
}
.edirVPN {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background:rgba(32,42,59,0.2);
  z-index: 100;
}
.context {
  width: 880px;
  max-height: 452px;
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
.contextEn{
  width: 940px;
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
  padding: 30px 0px 30px 0;
  .line {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      width: 20px;
      height: 2px;
      background: rgba(196, 198, 207, 1);
    }
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
  }
}
.serverData {
  max-height: 136px;
  width: 100%;
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
    width: 470px;
  }
}
</style>
<style lang="scss">
.edirVPN {
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
    }
  }
  .tunnel {
    .ipv4,
    .ipv6 {
      .el-input {
        width: 216px;
        height: 34px;
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