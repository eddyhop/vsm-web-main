<template>
  <!-- 图表设置 -->
  <div class="chartSet">
    <h3 class="Tit">
      <span>图表设置</span>
      <div class="btns">
        <button @click="chartsIsEdit=!chartsIsEdit">
          <img src="@/assets/newPage/Icon-bianji@2x.png" alt />编辑
        </button>
        <button v-debounce.prevent="submitForm">
          <img src="@/assets/newPage/Icon-baocun@2x.png" alt />保存
        </button>
      </div>
    </h3>
    <div class="chartForm">
      <el-form
        :model="chartSetForm"
        :rules="chartSetrules"
        ref="form"
        label-width="auto"
        class="demo-ruleForm"
        :inline="true"
        :disabled="chartsIsEdit"
        :hide-required-asterisk="true"
        @submit.native.prevent
      >
        <div class="linkList">
          <h3 class="linkTit">链路时延</h3>
          <div class="linkTtem">
            <el-form-item label="横坐标" prop="linkDelay_x">
              <el-input v-model.number="chartSetForm.linkDelay_x" placeholder>
                <i slot="suffix" class="iconTit">小时</i>
              </el-input>
            </el-form-item>
            <el-form-item label="更新时间" prop="linkDelayRenew">
              <el-input v-model.number="chartSetForm.linkDelayRenew" placeholder>
                <i slot="suffix" class="iconTit">分钟</i>
              </el-input>
            </el-form-item>
          </div>
          <!-- <div class="linkItem linkColorItem">
            <el-form-item label="展示颜色" prop="linkDelayHigh">
              <div class="colorItem">
                <el-input
                  v-model.number="chartSetForm.linkDelayHigh"
                  @blur="linkColrChnage('red',chartSetForm.linkDelayHigh)"
                  placeholder
                >
                  <i slot="prefix" class="colorIcon">{{redLink}}</i>
                </el-input>
                <div class="colorShow">
                  <span class="colorBox red"></span>
                  <span class="colorName">红色</span>
                </div>
              </div>
            </el-form-item>
            <el-form-item prop="linkDelayMid">
              <div class="colorItem">
                <el-input
                  v-model.number="chartSetForm.linkDelayMid"
                  @blur="linkColrChnage('yellow',chartSetForm.linkDelayMid)"
                  placeholder
                >
                  <i slot="prefix" class="colorIcon">{{yellowLink}}</i>
                </el-input>
                <div class="colorShow">
                  <span class="colorBox yellow"></span>
                  <span class="colorName">黄色</span>
                </div>
              </div>
            </el-form-item>
            <el-form-item prop="linkDelayLow">
              <div class="colorItem" style="margin-right:22px">
                <el-input
                  v-model.number="chartSetForm.linkDelayLow"
                  @blur="linkColrChnage('green',chartSetForm.linkDelayLow)"
                  placeholder
                >
                  <i slot="prefix" class="colorIcon">{{greenLink}}</i>
                </el-input>
                <div class="colorShow">
                  <span class="colorBox green"></span>
                  <span class="colorName">绿色</span>
                </div>
              </div>
              <span>X代表时延</span>
            </el-form-item>
          </div> -->
        </div>
        <div class="linkList">
          <h3 class="linkTit">链路延时丢包率</h3>
          <div class="linkTtem">
            <el-form-item label="横坐标" prop="linkLoss_x">
              <el-input v-model.number="chartSetForm.linkLoss_x" placeholder>
                <i slot="suffix" class="iconTit">小时</i>
              </el-input>
            </el-form-item>
            <el-form-item label="更新时间" prop="linkLossRenew">
              <el-input v-model.number="chartSetForm.linkLossRenew" placeholder>
                <i slot="suffix" class="iconTit">分钟</i>
              </el-input>
            </el-form-item>
            <div class="linkColor">
              <span class="colorTit">延时颜色</span>
              <b></b>
              <span class="linkColorName">绿色</span>
            </div>
            <!-- <div class="linkColor">
              <span class="colorTit">丢包率颜色</span>
              <b></b>
              <span class="linkColorName">黄色</span>
            </div>-->
          </div>
        </div>
        <div class="linkList">
          <h3 class="linkTit">总体速率</h3>
          <el-form-item label="横坐标" prop="total_x">
            <el-input v-model.number="chartSetForm.total_x" placeholder>
              <i slot="suffix" class="iconTit">小时</i>
            </el-input>
          </el-form-item>
          <el-form-item label="更新时间" prop="totalRenew">
            <el-input v-model.number="chartSetForm.totalRenew" placeholder>
              <i slot="suffix" class="iconTit">分钟</i>
            </el-input>
          </el-form-item>
        </div>
        <!-- <div class="linkList">
          <h3 class="linkTit">总体告警趋势</h3>
          <el-form-item label="横坐标" prop="warning_x">
            <el-input v-model.number="chartSetForm.warning_x" placeholder>
              <i slot="suffix" class="iconTit">小时</i>
            </el-input>
          </el-form-item>
          <el-form-item label="更新时间" prop="warningRenew">
            <el-input v-model.number="chartSetForm.warningRenew" placeholder>
              <i slot="suffix" class="iconTit">分钟</i>
            </el-input>
          </el-form-item>
        </div> -->
        <div class="linkList">
          <h3 class="linkTit">CPU</h3>
          <el-form-item label="横坐标" prop="cpu_x">
            <el-input v-model.number="chartSetForm.cpu_x" placeholder>
              <i slot="suffix" class="iconTit">小时</i>
            </el-input>
          </el-form-item>
          <el-form-item label="更新时间" prop="cpuRenew">
            <el-input v-model.number="chartSetForm.cpuRenew" placeholder>
              <i slot="suffix" class="iconTit">分钟</i>
            </el-input>
          </el-form-item>
          <div class="linkItem linkColorItem">
            <el-form-item label="展示颜色" prop="cpuHigh">
              <div class="colorItem">
                <el-input
                  v-model.number="chartSetForm.cpuHigh"
                  @blur="cpuColorChange('red',chartSetForm.cpuHigh)"
                  placeholder
                >
                  <i slot="prefix" class="colorIcon">{{redCpu}}</i>
                </el-input>
                <div class="colorShow">
                  <span class="colorBox red"></span>
                  <span class="colorName">红色</span>
                </div>
              </div>
            </el-form-item>
            <el-form-item prop="cpuMid">
              <div class="colorItem">
                <el-input
                  v-model.number="chartSetForm.cpuMid"
                  @blur="cpuColorChange('yellow',chartSetForm.cpuMid)"
                  placeholder
                >
                  <i slot="prefix" class="colorIcon">{{yellowCpu}}</i>
                </el-input>
                <div class="colorShow">
                  <span class="colorBox yellow"></span>
                  <span class="colorName">黄色</span>
                </div>
              </div>
            </el-form-item>
            <el-form-item prop="cpuLow">
              <div class="colorItem" style="margin-right:22px">
                <el-input
                  v-model.number="chartSetForm.cpuLow"
                  @blur="cpuColorChange('green',chartSetForm.cpuLow)"
                  placeholder
                >
                  <i slot="prefix" class="colorIcon">{{greenCpu}}</i>
                </el-input>
                <div class="colorShow">
                  <span class="colorBox green"></span>
                  <span class="colorName">绿色</span>
                </div>
              </div>
              <span>Y代表利用率</span>
            </el-form-item>
          </div>
        </div>
        <div class="linkList">
          <h3 class="linkTit">内存</h3>
          <el-form-item label="横坐标" prop="ram_x">
            <el-input v-model.number="chartSetForm.ram_x" placeholder>
              <i slot="suffix" class="iconTit">小时</i>
            </el-input>
          </el-form-item>
          <el-form-item label="更新时间" prop="ramRenew">
            <el-input v-model.number="chartSetForm.ramRenew" placeholder>
              <i slot="suffix" class="iconTit">分钟</i>
            </el-input>
          </el-form-item>
          <div class="linkItem linkColorItem">
            <el-form-item label="展示颜色" prop="ramHigh">
              <div class="colorItem">
                <el-input
                  v-model.number="chartSetForm.ramHigh"
                  @blur="ramColorChange('red',chartSetForm.ramHigh)"
                  placeholder
                >
                  <i slot="prefix" class="colorIcon">{{redRam}}</i>
                </el-input>
                <div class="colorShow">
                  <span class="colorBox red"></span>
                  <span class="colorName">红色</span>
                </div>
              </div>
            </el-form-item>
            <el-form-item prop="ramMid">
              <div class="colorItem">
                <el-input
                  v-model.number="chartSetForm.ramMid"
                  @blur="ramColorChange('yellow',chartSetForm.ramMid)"
                  placeholder
                >
                  <i slot="prefix" class="colorIcon">{{yellowRam}}</i>
                </el-input>
                <div class="colorShow">
                  <span class="colorBox yellow"></span>
                  <span class="colorName">黄色</span>
                </div>
              </div>
            </el-form-item>
            <el-form-item prop="ramLow">
              <div class="colorItem" style="margin-right:22px">
                <el-input
                  v-model.number="chartSetForm.ramLow"
                  @blur="ramColorChange('green',chartSetForm.ramLow)"
                  placeholder
                >
                  <i slot="prefix" class="colorIcon">{{greenRam}}</i>
                </el-input>
                <div class="colorShow">
                  <span class="colorBox green"></span>
                  <span class="colorName">绿色</span>
                </div>
              </div>
              <span>Z代表利用率</span>
            </el-form-item>
          </div>
        </div>
        <div class="linkList">
          <h3 class="linkTit">实时监控</h3>
          <el-form-item label="更新频率" prop="rtMonitorRenew">
            <el-input v-model.number="chartSetForm.rtMonitorRenew" placeholder>
              <i slot="suffix" class="iconTit">分钟</i>
            </el-input>
          </el-form-item>
        </div>
        <div class="linkList">
          <h3 class="linkTit">TOP5</h3>
          <el-form-item label="统计周期" prop="topPeriod">
            <el-select filterable v-model.number="chartSetForm.topPeriod">
              <el-option label="今天" :value="0"></el-option>
              <el-option label="本周" :value="1"></el-option>
              <el-option label="本月" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { vsmSreenSettingGraphSet } from "@/services";
export default {
  data() {
    //时延展示颜色校验
    // Delay shows color check
    var HighChange = (rule, value, callback) => {
      let val = value * 1;
      let midVlaue = this.chartSetForm.linkDelayMid * 1;
      if (val <= 0 || val >= 100) {
        callback(new Error("利用率的范围为大于0%小于100%"));
      } else if (val <= midVlaue) {
        callback(new Error("利用率较高值不能小于等于利用率中等值"));
      } else {
        callback();
      }
    };
    var MidChange = (rule, value, callback) => {
      let val = value * 1;
      let highVlaue = this.chartSetForm.linkDelayHigh * 1;
      if (val <= 0 || val >= 100) {
        callback(new Error("利用率的范围为大于0%小于100%"));
      } else if (val >= highVlaue) {
        callback(new Error("利用率中等值不能大于等于利用率较高值"));
      } else {
        callback();
      }
    };
    var LowChange = (rule, value, callback) => {
      let val = value * 1;
      let highVlaue = this.chartSetForm.linkDelayHigh * 1;
      if (val <= 0 || val >= 100) {
        callback(new Error("利用率的范围为大于0%小于100%"));
      } else if (val >= highVlaue) {
        callback(new Error("利用率较低值不能大于等于利用率较高值"));
      } else {
        callback();
      }
    };
    //cpu展示颜色校验
    // The CPU displays the color check
    var cpuHighChange = (rule, value, callback) => {
      let val = value * 1;
      let midVlaue = this.chartSetForm.cpuMid * 1;
      if (val <= 0 || val >= 100) {
        callback(new Error("利用率的范围为大于0%小于100%"));
      } else if (val <= midVlaue) {
        callback(new Error("利用率较高值不能小于等于利用率中等值"));
      } else {
        callback();
      }
    };
    var cpuMidChange = (rule, value, callback) => {
      let val = value * 1;
      let highVlaue = this.chartSetForm.cpuHigh * 1;
      if (val <= 0 || val >= 100) {
        callback(new Error("利用率的范围为大于0%小于100%"));
      } else if (val >= highVlaue) {
        callback(new Error("利用率中等值不能大于等于利用率较高值"));
      } else {
        callback();
      }
    };
    var cpuLowChange = (rule, value, callback) => {
      let val = value * 1;
      let highVlaue = this.chartSetForm.cpuHigh * 1;
      if (val <= 0 || val >= 100) {
        callback(new Error("利用率的范围为大于0%小于100%"));
      } else if (val >= highVlaue) {
        callback(new Error("利用率较低值不能大于等于利用率较高值"));
      } else {
        callback();
      }
    };
    //内存展示颜色校验
    // Memory displays color checks
    var ramHighChange = (rule, value, callback) => {
      let val = value * 1;
      let midVlaue = this.chartSetForm.ramMid * 1;
      if (val <= 0 || val >= 100) {
        callback(new Error("利用率的范围为大于0%小于100%"));
      } else if (val <= midVlaue) {
        callback(new Error("利用率较高值不能小于等于利用率中等值"));
      } else {
        callback();
      }
    };
    var ramMidChange = (rule, value, callback) => {
      let val = value * 1;
      let highVlaue = this.chartSetForm.ramHigh * 1;
      if (val <= 0 || val >= 100) {
        callback(new Error("利用率的范围为大于0%小于100%"));
      } else if (val >= highVlaue) {
        callback(new Error("利用率中等值不能大于等于利用率较高值"));
      } else {
        callback();
      }
    };
    var ramLowChange = (rule, value, callback) => {
      let val = value * 1;
      let highVlaue = this.chartSetForm.ramHigh * 1;
      if (val <= 0 || val >= 100) {
        callback(new Error("利用率的范围为大于0%小于100%"));
      } else if (val >= highVlaue) {
        callback(new Error("利用率较低值不能大于等于利用率较高值"));
      } else {
        callback();
      }
    };
    //横坐标的范围限制
    // Limit the range of the abscissa
    var xChange = (rule, value, callback) => {
      let val = value * 1;
      if (val < 1 || val > 744) {
        callback(new Error("横坐标的范围为1-744"));
      } else {
        callback();
      }
    };
    return {
      //图表设置
      // The chart is set
      chartSetForm: {
        linkDelay_x: "", //链路利用率横坐标
                         // Link utilization abscissa
        linkDelayRenew: "", //链路利用率更新时间
                            // Link utilization update time
        linkDelayHigh: "", //链路利用率较高级别
                           // Higher level of link utilization
        linkDelayMid: "", //	链路利用率中等级别
                          // Link utilization is medium
        linkDelayLow: "", //	链路利用率较低级别
                          // Lower levels of link utilization
        linkLoss_x: "", //链路丢包率横坐标
                        // Link loss rate abscissa
        linkLossRenew: "", //链路丢包率更新时间
                           // Link loss rate update time
        total_x: "", //总体速率横坐标
                     // The overall rate
        totalRenew: "", //总体速率更新时间
                        // Total rate update time
        warning_x: "", //告警横坐标
                       // Alarm abscissa
        warningRenew: "", //告警更新信息
                          // Alert updates
        cpu_x: "", //CPU横坐标
                   // Abscissa CPU
        cpuRenew: "", //CPU更新时间
                      // CPU update time
        cpuLow: "", //cpu较低级别
                    // Lower level of CPU
        cpuMid: "", //cpu中等级别
                    // CPU medium level
        cpuHigh: "", //	cpu较高级别
                     // Higher CPU level
        ram_x: "", //内存横坐标
                   // Memory abscissa
        ramRenew: "", //内存更新时间
                      // Memory update time
        ramLow: "", //	内存较低界别
                    // Low memory sector
        ramMid: "", //内存中等级别
                    // Medium memory
        ramHigh: "", //内存较高级别
                     // Higher level of memory
        rtMonitorRenew: "", //实时监控更新频率
                            // Real-time monitoring of update frequency
        topPeriod: 0, //TOP统计周期
                      // TOP statistical cycle
        id: ""
      },
      //链路时延颜色展示
      // Link delay color display
      redLink: "",
      yellowLink: "",
      greenLink: "",
      //cpu颜色展示
      // CPU color display
      redCpu: "",
      yellowCpu: "",
      greenCpu: "",
      //内存颜色展示
      // Memory color display
      redRam: "",
      yellowRam: "",
      greenRam: "",
      chartSetrules: {
        linkDelay_x: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          },
          { type: "number", message: "横坐标必须为数字值" },
          //   { pattern:/^744$|^(\d|[1-9]\d)$/, message: '横坐标的范围为1-744', trigger: 'blur' },
          // {the pattern: $744 / ^ | ^ (\ d | \ [1-9] d) $/, the message: 'the abscissa range 1-744, the trigger:' blur '},
          { validator: xChange, trigger: "blur" }
        ],
        linkDelayRenew: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          },
          { type: "number", message: "更新时间必须为数字值" }
        ],
        linkDelayHigh: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          },
          { type: "number", message: "利用率必须为数字值" },
          { validator: HighChange, trigger: "blur" }
        ],
        linkDelayMid: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          },
          { type: "number", message: "利用率必须为数字值" },
          { validator: MidChange, trigger: "blur" }
        ],
        linkDelayLow: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          },
          { type: "number", message: "利用率必须为数字值" },
          { validator: LowChange, trigger: "blur" }
        ],
        linkLoss_x: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          },
          { type: "number", message: "横坐标必须为数字值" },
          //   { pattern:^100$|^(\d|[1-9]\d)$, message: '横坐标的范围为1-744', trigger: 'blur' }
          // {$100 pattern: ^ | ^ (\ d | \ [1-9] d) $, message: 'the abscissa range 1-744, the trigger:' blur '}
          { validator: xChange, trigger: "blur" }
        ],
        linkLossRenew: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          },
          { type: "number", message: "更新时间必须为数字值" }
        ],
        total_x: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          },
          { type: "number", message: "横坐标必须为数字值" },
          //   { pattern:^100$|^(\d|[1-9]\d)$, message: '横坐标的范围为1-744', trigger: 'blur' }
          // {$100 pattern: ^ | ^ (\ d | \ [1-9] d) $, message: 'the abscissa range 1-744, the trigger:' blur '}
          { validator: xChange, trigger: "blur" }
        ],
        totalRenew: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          },
          { type: "number", message: "更新时间必须为数字值" }
        ],
        cpu_x: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          },
          { type: "number", message: "横坐标必须为数字值" },
          //   { pattern:^100$|^(\d|[1-9]\d)$, message: '横坐标的范围为1-744', trigger: 'blur' }
          // {$100 pattern: ^ | ^ (\ d | \ [1-9] d) $, message: 'the abscissa range 1-744, the trigger:' blur '}
          { validator: xChange, trigger: "blur" }
        ],
        cpuRenew: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          },
          { type: "number", message: "更新时间必须为数字值" }
        ],
        cpuHigh: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          },
          { type: "number", message: "利用率必须为数字值" },
          { validator: cpuHighChange, trigger: "blur" }
        ],
        cpuMid: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          },
          { type: "number", message: "利用率必须为数字值" },
          { validator: cpuMidChange, trigger: "blur" }
        ],
        cpuLow: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          },
          { type: "number", message: "利用率必须为数字值" },
          { validator: cpuLowChange, trigger: "blur" }
        ],

        warning_x: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          },
          { type: "number", message: "横坐标必须为数字值" },
          { validator: xChange, trigger: "blur" }
        ],
        warningRenew: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          },
          { type: "number", message: "更新时间必须为数字值" }
        ],
        ram_x: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          },
          { type: "number", message: "横坐标必须为数字值" },
          { validator: xChange, trigger: "blur" }
        ],
        ramRenew: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          },
          { type: "number", message: "更新时间必须为数字值" }
        ],
        ramHigh: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          },
          { type: "number", message: "利用率必须为数字值" },
          { validator: ramHighChange, trigger: "blur" }
        ],
        ramMid: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          },
          { type: "number", message: "利用率必须为数字值" },
          { validator: ramMidChange, trigger: "blur" }
        ],
        ramLow: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          },
          { type: "number", message: "利用率必须为数字值" },
          { validator: ramLowChange, trigger: "blur" }
        ],
        rtMonitorRenew: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          },
          { type: "number", message: "更新频率必须为数字值" }
        ],
        topPeriod: [
          {
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ]
      },
      chartsIsEdit: true //图表设置是否禁用
                         // Whether the chart Settings are disabled
    };
  },
  methods: {
    //图表设置保存
    // Save chart Settings
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            cpuRenew: this.chartSetForm.cpuRenew,
            cpu_x: this.chartSetForm.cpu_x,
            cpuHigh: this.chartSetForm.cpuHigh,
            cpuLow: this.chartSetForm.cpuLow,
            id: this.chartSetForm.id,
            linkLossRenew: this.chartSetForm.linkLossRenew,
            linkLoss_x: this.chartSetForm.linkLoss_x,
            linkDelayHigh: this.chartSetForm.linkDelayHigh,
            linkDelayLow: this.chartSetForm.linkDelayLow,
            linkDelayRenew: this.chartSetForm.linkDelayRenew,
            linkDelay_x: this.chartSetForm.linkDelay_x,
            ramRenew: this.chartSetForm.ramRenew,
            ram_x: this.chartSetForm.ram_x,
            ramHigh: this.chartSetForm.ramHigh,
            ramLow: this.chartSetForm.ramLow,
            rtMonitorRenew: this.chartSetForm.rtMonitorRenew,
            tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId,
            topPeriod: this.chartSetForm.topPeriod,
            totalRenew: this.chartSetForm.totalRenew,
            total_x: this.chartSetForm.total_x,
            warning_x: this.chartSetForm.warning_x,
            warningRenew: this.chartSetForm.warningRenew
          };
          vsmSreenSettingGraphSet(params).then(res => {
            if (res.code === 10000) {
              this.chartsIsEdit = true;
              this.$parent.dataInit({ tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId });
              this.$message({
                type: "success",
                message: "设置成功"
              });
            }
          });
        }
      });
    },
    //延时展示颜色转换
    // Time-lapse display color conversion
    linkColrChnage(color, val) {
      // console.log("5678", color, val);
      if (val && val <= 100) {
        if (color === "red") {
          // console.log("1234", color, val);
          this.redLink = "x>=" + val ;
          this.chartSetForm.linkDelayMid = this.chartSetForm.linkDelayLow  = this.chartSetForm.linkDelayHigh == 100 || this.chartSetForm.linkDelayHigh == 0 ? 0 : null
          if(!(this.chartSetForm.linkDelayHigh == 100 || this.chartSetForm.linkDelayHigh == 0)){
            this.yellowLink =
            (this.chartSetForm.linkDelayMid
              ? this.chartSetForm.linkDelayMid + "<="
              : "") +
            "x<" +
            val 
          }else{
            this.yellowLink =""
          }
        } else if (color === "yellow") {

          this.yellowLink =
            val + "<=" + "x<" + this.chartSetForm.linkDelayHigh 
          this.chartSetForm.linkDelayLow = val;
          this.greenLink = "x<" + val;
        } else {
          this.chartSetForm.linkDelayMid = val;
          this.yellowLink =
            val + "<=" + "x<" + this.chartSetForm.linkDelayHigh 
          this.greenLink = "x<" + val;
        }
      }
    },
    //cpu展示颜色转换
    // CPU shows color conversion
    cpuColorChange(color, val) {
      if (val && val < 100) {
        if (color === "red") {
          // console.log("1234", color, val);
          this.redCpu = "y>=" + val + "%";
          this.yellowCpu =
            (this.chartSetForm.cpuMid
              ? this.chartSetForm.cpuMid + "%" + "<="
              : "") +
            "y<" +
            val +
            "%";
        } else if (color === "yellow") {
          this.yellowCpu =
            val + "%" + "<=" + "y<" + this.chartSetForm.cpuHigh + "%";
          this.chartSetForm.cpuLow = val;
          this.greenCpu = "y<" + val;
        } else {
          this.chartSetForm.cpuMid = val;
          this.yellowCpu =
            val + "%" + "<=" + "y<" + this.chartSetForm.cpuHigh + "%";
          this.greenCpu = "y<" + val;
        }
      }
    },
    //内存展示颜色转换
    // Memory displays color conversions
    ramColorChange(color, val) {
      if (val && val < 100) {
        if (color === "red") {
          // console.log("1234", color, val);
          this.redRam = "z>=" + val + "%";
          this.yellowRam =
            (this.chartSetForm.ramMid
              ? this.chartSetForm.ramMid + "%" + "<="
              : "") +
            "z<" +
            val +
            "%";
        } else if (color === "yellow") {
          this.yellowRam =
            val + "%" + "<=" + "z<" + this.chartSetForm.ramHigh + "%";
          this.chartSetForm.ramLow = val;
          this.greenRam = "z<" + val;
        } else {
          this.chartSetForm.ramMid = val;
          this.yellowRam =
            val + "%" + "<=" + "z<" + this.chartSetForm.ramHigh + "%";
          this.greenRam = "z<" + val;
        }
      }
    }
  }
};
</script>
<style scoped lang="scss">
.chartSet {
  width: 100%;
  background: #fff;
  padding: 18px 20px 20px 30px;
  margin-top: 20px;
}
.Tit {
  width: 100%;
  padding-bottom: 16px;
  zoom: 1;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  span {
    float: left;
    font-size: 18px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    position: relative;
    padding-left: 6px;
  }
  span:after {
    content: "";
    position: absolute;
    top: 5px;
    left: 0px;
    width: 2px;
    height: 16px;
    background: rgba(54, 120, 200, 1);
  }
}
.btns {
  float: right;
  button {
    width: 80px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    border: 0;
    outline: none;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    margin-left: 18px;
    img {
      width: 14px;
      height: 14px;
      margin-right: 6px;
      position: relative;
      top: 1px;
    }
  }
}
.linkList {
  .linkTit {
    font-size: 16px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    padding-bottom: 14px;
  }
}
.linkItem {
  zoom: 1;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  span {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
  .colorItem {
    float: left;
    position: relative;
  }
}
.colorShow {
  position: absolute;
  top: 2px;
  right: 10px;
  height: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
  .colorBox {
    display: inline-block;
    margin-right: 4px;
    width: 8px;
    height: 14px;
  }
  .colorName {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
  }
}
.red {
  background: rgba(215, 23, 91, 1);
}
.yellow {
  background: #e89d2d;
}
.green {
  background: #88f0b9;
}
.linkTtem {
  //   zoom: 1;
  //   &:after {
  //     display: block;
  //     clear: both;
  //     content: "";
  //     visibility: hidden;
  //     height: 0;
  //   }
  .linkColor {
    display: inline-block;
    line-height: 34px;
    margin-right: 36px;
    .colorTit {
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      padding-right: 10px;
    }
    .linkColorName {
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      padding-left: 3px;
    }
    b {
      display: inline-block;
      width: 8px;
      height: 14px;
      position: relative;
      background: #88f0b9;
      top: 2px;
    }
  }
  // .linkColor:last-of-type b {
  //   background: #e89d2d;
  // }
}
.iconTit {
  padding-right: 6px;
  font-style: normal;
  font-size: 14px;
  font-family: arial, sans-serif;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
}
.colorItem {
  float: left;
  position: relative;
}
.colorIcon {
  position: absolute;
  top: 0;
  left: 60px;
  font-style: normal;
  width: 100px;
}
</style>
<style lang="scss">
.chartSet {
  .el-form-item__label {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
  .el-input {
    width: 180px;
    height: 34px;
    position: relative;
    .el-input__inner {
      height: 100%;
      border-radius: 7px;
      padding-left: 15px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
  .el-form-item__label-wrap {
    margin-left: 0 !important;
  }
  .el-form--inline .el-form-item {
    margin-right: 36px;
  }
  .el-color-picker,
  .el-color-picker__trigger {
    width: 8px;
    height: 14px;
    padding: 0;
    border: 0;
    border-radius: 0;
    .el-color-picker__color {
      border: 0;
    }
    .el-icon-arrow-down:before {
      display: none;
    }
  }
}
.chartSet .linkColorItem {
  .el-form-item {
    margin-right: 14px;
  }
}
.chartSet .linkColorItem {
  .el-input {
    width: 220px;
    height: 34px;
    position: relative;
    .el-input__inner {
      height: 100%;
      border-radius: 7px;
      padding-left: 15px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
}
</style>