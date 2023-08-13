<template>
  <div class="addVPN">
    <div :class="`context ${lang=='en'?'contextEn':''}`">
      <h4 class="title">
        <span>{{$t('vsr1000.add')}} IPSEC</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="event">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="form"
          label-width="110px"
          class="demo-ruleForm"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item :label="$t('vsr1000.name')" prop="name">
            <el-input v-model="ruleForm.name" :placeholder="$t('vsr1000.importName')"></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('vsr1000.describe')"
            prop="describe"
            :label-width="`${lang=='en'?'190px':'110px'}`"
          >
            <el-input type="textarea" v-model="ruleForm.describe"></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('vsr1000.tenantRoutingDomain')"
            prop="flyName"
            :label-width="`${lang=='en'?'190px':'110px'}`"
          >
            <!-- <el-select
              v-model="ruleForm.flyName"
              :placeholder="$t('vsr1000.choose')"
              @change="clearServer"
            >
              <el-option
                v-for="item in ruleForm.renData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>-->
            <el-select filterable
              v-model="ruleForm.flyName"
              
              remote
              reserve-keyword
              :placeholder="$t('vsr1000.choose')"
              :remote-method="remoteMethod4"
              :loading="loading4"
              @focus="flySearchData"
              @change="clearServer"
            >
              <div
                class="serverData"
                v-infinite-scroll="load4"
                infinite-scroll-delay="500"
                infinite-scroll-immediate="false"
              >
                <el-option
                  v-for="item in ruleForm.renData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </div>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('vsr1000.role')"
            prop="region2"
            label-width="110px"  
          >
            <el-select filterable
              v-model="ruleForm.region2"
              placeholder="Client"
              disabled=true
            >
              <el-option
                v-for="item in vpnRole"
                :key="item.id"
                :label="item.dictValue"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="Server-ip"
            prop="Ip"
            :label-width="`${lang=='en'?'190px':'110px'}`">
            <el-input v-model="ruleForm.Ip"></el-input>
          </el-form-item>
          <el-form-item
            :label="'Server'+$t('vsr1000.name')"
            prop="serverName"
            label-width="110px"
          >
            <el-select filterable
              v-model="ruleForm.serverName"
            
              remote
              reserve-keyword
              :placeholder="$t('vsr1000.choose')"
              :remote-method="remoteMethod2"
              :loading="loading2"
              @focus="searchData(false)"
            >
              <div
                class="serverData"
                v-infinite-scroll="load2"
                infinite-scroll-delay="500"
                infinite-scroll-immediate="false"
              >
                <el-option
                  v-for="item in serverSearch"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </div>
            </el-select>
          </el-form-item>
          <!-- <el-form-item :label="$t('facility.zhpath')" prop="flyName">
            <el-select filterable v-model="ruleForm.flyName" placeholder @change="clearServer">
              <el-option
                v-for="item in ruleForm.renData"
                :key="item.id"
                :label="item.rrfName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>-->

          <div :class="`tunnel ${lang=='en'?'tunnelEn':''}`">
            <div class="ipv4">
              <el-form-item
                :label="$t('vsr1000.tunnel')+'IPV4'"
                v-for="(domain, index) in ruleForm.IPV4"
                :key="domain.key"
                :prop="'IPV4.' + index + '.ipv4'"
                :rules="[
                  {required: true, message: $t('vsr1000.ipv4'), trigger: 'blur'},
                  {
                    pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                    message: $t('vsr1000.greRule[2]')
                  },
                  {
                    validator:ruleIPV4,
                    trigger: 'blur'
                  }
                ]"
              >
                <div class="addcontent">
                  <el-input v-model="domain.ipv4"></el-input>
                  <span>/30</span>
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
                :label="$t('vsr1000.tunnel')+'IPV6'"
                v-for="(domain, index) in ruleForm.IPV6"
                :key="domain.key"
                :prop="'IPV6.' + index + '.ipv6'"
                :label-width="`${lang=='en'?'145px':'110px'}`"
                :rules="[
                  {
                  pattern: /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,
                  message: $t('vsr1000.ipv6')
                  },
                  {
                    validator:ruleIPV6,
                    trigger: 'blur'
                  }
                ]"
              >
                <div class="addcontent">
                  <el-input :id="domain.key" v-model="domain.ipv6"></el-input>
                  <span>/126</span>
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
import {
  //ipv4隧道唯一性校验
  // Ipv4 tunnel uniqueness check
  getVpnChannelIp,
  //vpn名字是否重复
  // Whether the VPN name is repeated
  getVpnName,
  //新增vpn
  // New VPN
  addReIpsec,
  //client获取所有设备
  // The client gets all the devices
  getRentAllMachine,
  //server获取所有设备
  // Server gets all the devices
  getRentAllServerMachine,
  //获取租户路由域
  // Gets the tenant routing domain
  getRentVrfList,
  //角色获取
  // To obtain
  getDict
} from "@/services/index";
import {nameRule} from "@/utils/regular"
export default {
  props: {
    isShow: {
      type: Boolean
    }
  },
  components: {},
  data() {
    var ruleIpv4 = (rule, value, callback) => {
      if (value) {
        let params = {
          channelIp: value,
          deviceId: JSON.parse(this.$route.query.devData).deviceId,
          vpnCha: this.ruleForm.region2,
          vrfId: this.ruleForm.flyName
        };
        let num = 0;
        this.ruleForm.IPV4.forEach(item => {
          if (item.ipv4 === value) {
            num++;
          }
        });
        if (num > 1) {
          callback(new Error(this.$t("vsr1000.remind[10]")));
        } else {
          getVpnChannelIp(params).then(res => {
            if (res.success) {
              callback();
            } else {
              callback(new Error(res.message));
            }
          });
        }
      }
    };
    var ruleIpv6 = (rule, value, callback) => {
      let params = {
        deviceId: JSON.parse(this.$route.query.devData).deviceId,
        ip: value
      };
      let num = 0;
      this.ruleForm.IPV6.forEach(item => {
        if (item.ipv6 === value) {
          num++;
        }
      });
      if (num > 1) {
        callback(new Error(this.$t("vsr1000.remind[13]")));
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
            callback(new Error(this.$t("vsr1000.greRule[7]")));
          }
        });
      }
    };
    var RenChange = (rule, value, callback) => {
      // console.log(value, "123");
      if (!value) {
        if (this.ruleForm.flyName.length == 0) {
          // console.log(123123);
          callback(new Error(this.$t("vsr1000.greRule[6]")));
        } else {
          callback();
        }
      }
    };
    // var broadRule = (rule,value,callback)=>{
    //   if(value){
    //     if(value>'100000000'){
    //       callback(new Error(this.$t("vsr1000.remind2[14]")))
    //     } else {
    //       callback()
    //     }
    //   }else{
    //     callback()
    //   }
    // }
    return {
      ruleForm: {
        //名字
        // The name
        name: "",
        //id
        id: "",
        //描述
        // describe
        describe: "",
        //client
        change: "",
        //角色
        // role
        region2: "0",
        //宽带
        // broadband
        broad: '',
        //租户路由域
        // Tenant routing domain
        flyName: "",
        //server
        Ip: "",
        serverName: "",
        //租户路由域的数据
        // Tenant routing domain data
        renData: [],
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
      //角色切换依据
      // Role switching basis
      rolePart: "Sever",
      //IPV4唯一性校验
      // IPV4 uniqueness checks
      ruleIPV4: ruleIpv4,
      ruleIPV6: ruleIpv6,
      rules: {
        name: [
          {
            required: true,
            message: this.$t("vsr1000.greRule[0]"),
            trigger: "blur"
          },
          { validator: nameRepetition, trigger: "blur" },
          { pattern:/^[a-zA-Z0-9_\u4e00-\u9fa5-]+$/, message: this.$t("vsr1000.greRule[13]")}
        ],
        region1: [
          {
            required: true,
            message: this.$t("vsr1000.remind2[3]"),
            trigger: "change"
          }
        ],
        region2: [
          {
            required: true,
            message: this.$t("vsr1000.remind2[3]"),
            trigger: "change"
          }
        ],
        Ip: [
          {
            required: true,
            message: this.$t("vsr1000.greRule[1]"),
            trigger: "blur"
          },
          {
            pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]|[1-9]?)\.)(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: this.$t("vsr1000.greRule[2]")
          }
        ],
        flyName: [
          {
            required: true,
            message: this.$t("vsr1000.remind2[3]"),
            trigger: "change"
          }
        ],
        // broad: [
        //   {
        //     required: true,
        //     message: this.$t("vsr1000.remind2[4]"),
        //     trigger: "blur"
        //   },
        //   { type: "number", message: this.$t("vsr1000.remind2[6]") },
        //   { validator: broadRule, trigger: "blur" },
        // ],
        change: [
          {
            required: true,
            message: this.$t("vsr1000.remind2[3]"),
            trigger: "change"
          }
        ],
        serverName: [
          {
            required: true,
            message: this.$t("vsr1000.remind2[3]"),
            trigger: "change"
          }
        ]
      },
      //角色的数据
      // Role data
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
      page: 1,
      pageSize: 5,
      page2: 1,
      page3: 1,
      page4: 1,
      loadup1: true,
      loadup2: true,
      loadup3: true,
      loadup4: true,
      lang: ""
    };
  },
  computed: {},
  methods: {
    close() {
      this.$parent.isShow = false;
      this.page = 1;
      this.page2 = 1;
      this.page3 = 1;
      this.page4 = 1;
      this.serverSearch = [];
      this.restaurants = [];
      this.rolePart = "Sever";
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
      this.$refs.form.resetFields();
    },
    submitForm(formName) {
      // console.log(this.$refs[formName]);
      let deviceId = JSON.parse(this.$route.query.devData).deviceId;
      let tenantId = JSON.parse(this.$route.query.devData).tenantId
      let random = parseInt((Math.random() + 1) * Math.pow(10, 6 - 1));
      let ipv4 = this.ruleForm.IPV4.map(item => item.ipv4);
      let ipv6 = this.ruleForm.IPV6.map(item => item.ipv6);
      let data = {
        description: this.ruleForm.describe,
        serverIp: this.ruleForm.Ip,
        deviceId,
        tenantId,
        name: this.ruleForm.name,
        randomId: random + "",
        // bandwidth: this.ruleForm.broad >= '100000000' ? '100000000' : this.ruleForm.broad + "",
        bandwidth: 0,
        ipvF: ipv4,
        tunnelIp: ipv4[0],
        ipvS: ipv6,
        vpnCharacter: this.ruleForm.region2,
        vrfId: this.ruleForm.flyName,
        clientId: this.ruleForm.change,
        serverId: this.ruleForm.serverName,
        serverName: this.ruleForm.serverName
      };
      // console.log(this.$refs[formName].validate);
      this.$refs[formName].validate(valid => {
        if (valid) {
          addReIpsec(data).then(res => {
            // console.log(res);
            if (res.code === 10000) {
              this.$message({
                type: "success",
                message: this.$t("vsr1000.remind2[0]")
              });
              this.$parent.getVsrVpnListInit({
                deviceId: JSON.parse(this.$route.query.devData).deviceId,
                pageSize: this.$parent.lSize,
                pageNumber: this.$parent.lNumber
              });
              this.$refs[formName].resetFields();
              this.$parent.isShow = false;
              this.restaurants = [];
              this.serverSearch = [];
              this.page = 1;
              this.page2 = 1;
              this.page3 = 1;
              this.page4 = 1;
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
              this.rolePart = "Sever";
            } else {
              this.$message({
                type: "warning",
                message: res.message
              });
              this.restaurants = [];
              this.serverSearch = [];
              this.page = 1;
              this.page2 = 1;
              this.page3 = 1;
              this.page4 = 1;
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
              this.rolePart = "Sever";
              this.$refs[formName].resetFields();
              this.$parent.isShow = false;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //数据初始化
    // Data initialization
    async dataInit() {
      // let ports = await getLoginPort({
      //   deviceId: sessionStorage.getItem("deviceId")
      // });
      let role = await getDict({ groupCode: "vpn", typeCode: "vpn" });
      // let Ren = await getRentVrfList();
      // this.ruleForm.region1Arr = ports.result;
      this.vpnRole = role.result;
      // this.ruleForm.renData = Ren.result;
      this.ruleForm.region2 = this.vpnRole.find(
        item => item.dictValue === "Client"
      ).id;


      // console.log(this.ruleForm.region2)
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
            // page: 1,
            // pageSize: this.pageSize,
            rentAreaId: this.ruleForm.flyName
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
        this.loading2 = true;
        setTimeout(() => {
          getRentAllServerMachine({
            deviceId: JSON.parse(this.$route.query.devData).deviceId,
            name: query,
            // page: 1,
            // pageSize: this.pageSize
            rentAreaId: this.ruleForm.flyName
          }).then(res => {
            if (res.code === 10000) {
              this.loading2 = false;
              this.serverSearch = res.result;
              this.serverName=res.result.serverName;
            }
          });
        }, 200);
      } else {
        this.serverSearch = [];
      }
    },
    remoteMethod4(query) {
      //租户路由域
      // Tenant routing domain
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
              this.ruleForm.renData = res.result;
            }else{
            }
          });
        }, 200);
      } else {
        this.ruleForm.renData = [];
      }
    },
    portSearchData() {
      this.page3 = 1;
      this.loadup3 = true;

      getLoginPort({
        page: this.page3,
        pageSize: this.pageSize,
        name: "",
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
      getRentVrfList({
        page: this.page4,
        pageSize: this.pageSize,
        deviceId: JSON.parse(this.$route.query.devData).deviceId
      }).then(res => {
        if (res.code === 10000) {
          this.ruleForm.renData = res.result;
        }else{
          this.$message({
            type: "warning",
            message: this.$t("vsr1100.remind1[0]")
          });
        }
      });
    },
    //server获焦请求search数据
    // Server gets the focus to request search data
    searchData(flag) {
      if (flag && this.ruleForm.flyName) {
        this.page = 1;
        this.loadup1 = true;
        this.searchServerData({
          page: this.page,
          pageSize: this.pageSize,
          rentAreaId: this.ruleForm.flyName,
          name: "",
          deviceId: JSON.parse(this.$route.query.devData).deviceId
        });
      } else if (!flag && this.ruleForm.flyName) {
        this.page2 = 1;
        this.loadup2 = true;
        this.serverSearchData({
          page: this.page2,
          pageSize: this.pageSize,
          rentAreaId: this.ruleForm.flyName,
          name: "",
          deviceId: JSON.parse(this.$route.query.devData).deviceId
        });
      } else {
        this.$message({
          type: "warning",
          message: this.$t("vsr1000.greRule[6]")
        });
      }
    },
    //获取设备数据
    // Acquisition of device data
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
          name: this.ruleForm.change,
          page: this.page++,
          pageSize: this.pageSize,
          rentAreaId: this.ruleForm.flyName
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
    //上啦加载
    // La loaded on
    load2() {
      if (this.loadup2) {
        getRentAllServerMachine({
          page: this.page2++,
          pageSize: this.pageSize,
          rentAreaId: this.ruleForm.flyName,
          name: this.ruleForm.serverName,
          deviceId: JSON.parse(this.$route.query.devData).deviceId
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
          name: this.ruleForm.serverName,
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
          pageSize: this.pageSize,
          // name: this.ruleForm.serverName,
          deviceId: JSON.parse(this.$route.query.devData).deviceId
        }).then(res => {
          if (res.code === 10000 && res.result.length) {
            //   this.loaDing = false;
            let arr = this.ruleForm.renData.concat(res.result);
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

            this.ruleForm.renData = newJson;
          } else {
            this.loadup4 = false;
          }
        });
      }
    },
    serverSearchData(params) {
      getRentAllServerMachine(params).then(res => {
        if (res.code === 10000) {
          this.serverSearch = res.result;
        }
      });
    },
    clearServer() {
      this.ruleForm.change = "";
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
    roleChange(role) {
      //角色切换
      // Switch roles
      this.rolePart = this.vpnRole.find(item => item.id === role).dictValue;
    }
  },
  created() {
    this.lang = sessionStorage.getItem("lang");
  },
  mounted() {}
};
</script>
<style scoped lang="scss">
.addVPN {
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
.contextEn {
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
  width: 100%;
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
.addVPN {
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
