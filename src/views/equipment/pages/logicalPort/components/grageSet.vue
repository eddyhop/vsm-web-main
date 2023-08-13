<template>
  <div class="addGrageMain isShow" ref="gradeSet">
    <div class="context">
      <h4 class="title">
        <span>{{$t('vsr1000.logicPort')}}-{{$t('vsr1000.expertSet')}}</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="event">
        <el-form
          :model="form"
          :rules="rules"
           ref="form"
          label-width="auto"
          class="demo-ruleForm"
          :inline="true"  @submit.native.prevent
        >
        <p class="first">
          <el-form-item :label="$t('vsr1000.inACL')" prop="valueIn">
            <el-select filterable v-model="form.valueIn" :placeholder="$t('vsr1000.choose')">
              <el-option value="" :label="$t('vsr1000.remind[25]')"></el-option>
              <el-option
                v-for="item in form.options1"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <i
              :class="`el-icon-warning goDetails ${form.valueIn=='' ? '' :'detailsActive'}`"
              @click="goAclDetails(form.valueIn)"
            ></i>
          </el-form-item>

          <el-form-item :label="$t('vsr1000.inQOS')" prop="value2">
            <el-select filterable v-model="form.value2" :placeholder="$t('vsr1000.choose')">
              <el-option value="" :label="$t('vsr1000.remind[25]')"></el-option>
              <el-option
                v-for="item in form.options2"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <i
              :class="`el-icon-warning goDetails ${form.value2=='' ? '' :'detailsActive'}`"
              @click="goQosDetails(form.value2)"
            ></i>
          </el-form-item>
        </p>
          <el-form-item :label="$t('vsr1000.outACL')" prop="valueOut">
            <el-select filterable v-model="form.valueOut" :placeholder="$t('vsr1000.choose')">
              <el-option value="" :label="$t('vsr1000.remind[25]')"></el-option>
              <el-option
                v-for="item in form.options1"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <i
              :class="`el-icon-warning goDetails ${form.valueOut=='' ? '' :'detailsActive'}`"
              @click="goAclDetails(form.valueOut)"
            ></i>
          </el-form-item>

          <el-form-item :label="$t('vsr1000.outQOS')" prop="resource">
            <el-select filterable v-model="value" :placeholder="$t('vsr1000.choose')" disabled>
              <!-- <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option> -->
            </el-select>
          </el-form-item>

          <el-form-item label="MSS" prop="mss">
            <el-input v-model.number="form.mss"></el-input>
          </el-form-item>
          <el-form-item label="MTU" prop="mtu" style="margin-left:34px">
            <el-input v-model.number="form.mtu"></el-input>
          </el-form-item>
          <!-- <el-form-item label="DHCP" prop="value3">
            <el-select filterable v-model="form.value3" placeholder="请选择">
              <el-option
                v-for="item in form.options3"
                :key="item.value"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="CGNAT" prop="value4">
            <el-select filterable v-model="form.value4" placeholder="请选择">
              <el-option
                v-for="item in form.options4"
                :key="item.value"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item> -->

          <!-- <el-form-item label="ARP:">
            <el-switch v-model="form.open" @change="open" active-color="#528AFA" inactive-color="#EFEFEF"></el-switch>
          </el-form-item>

          <div class="addAddress" v-show="form.open">
            <ul class="addAddressEvent">
              <li>
                <el-form-item
                  v-for="(item, index) in form.ipAddress"
                  label="IP地址"
                  :key="item.key"
                  :prop="'ipAddress.' + index + '.ipVal'"
                  :rules="checkIp"
                >
                  <el-input v-model="item.ipVal"></el-input>
                </el-form-item>
              </li>

              <li class="liDel">
                <el-form-item
                  v-for="(item, index) in form.ipAddress"
                  label="MAC地址"
                  :key="item.key"
                  :prop="'ipAddress.' + index + '.macVal'"
                  :rules="checkMac"
                >
                  <el-input v-model="item.macVal"></el-input>
                  <el-button class="remove" v-if="form.ipAddress.length>1" @click.prevent="removeDomain(item)">删除</el-button>
                </el-form-item>
              </li>
            </ul>
            <div class="addPortBtn">
              <button @click.prevent="addIp">+</button>
            </div>
          </div>  -->
          <div class="submit">
            <button class="save" v-debounce="save">{{$t('vsr1000.save')}}</button>
            <button class="cancel" @click.prevent="close">{{$t('vsr1000.cancel')}}</button>
          </div>
        </el-form>
      </div>
    </div>
    <aclDetail v-show="aclDetailShow" ref="aclDetail" />
    <qosDetail ref="qosDetail" v-show="qosDetailShow" />
  </div>
</template>
<script>
import {logicalPortExtraSet} from '@/services'
import aclDetail from './aclDetail'
import qosDetail from './qosDetail'
export default {
  props: {},
  components: {aclDetail,qosDetail},
  data() {
    var checkMtu = (rule, value, callback) => {
      let mtu = Number(value);
      if (mtu < 0 || mtu > 1500) {
        callback(new Error(this.$t("vsr1000.greRule[8]")));
      } else {
        callback();
      }
    };
    var checkMss = (rule, value, callback) => {
      let mtu = Number(value);
      if (mtu < 0 || mtu > 1460) {
        callback(new Error(this.$t("vsr1000.greRule[11]")));
      } else {
        callback();
      }
    };
    return {
      deviceSerialNumber:JSON.parse(this.$route.query.devData).vsrSeries,
      tenantId:JSON.parse(this.$route.query.devData).tenantId,
      value:'',
      form:{
        id:'',//编辑设备的id Edit the id of the device
              // Edit the ID of the device
        options1:[],
        valueIn:'',//入向acl Inbound acl
                   // Inbound TO the ACL Inbound ACL
        valueOut:'',//出向acl Out of the acl
                    // Out of the ACL
        options2:[],
        value2:'',//入向qos Inbound qos
                  // Into qos Inbound qos
        options3:[],
        value3:'',//dhcp
        options4:[],
        value4:'',//cgnat
        mss:'',
        mtu:1500,
        ip:'',
        mac:'',
        open:true,
        ipAddress: [
          {
            macVal: "",
            ipVal: ""
          }
        ],
      },
      rules:{
        mss: [
          { required: true, message: this.$t('vsr1000.remind[15]'), trigger: 'blur' },
          { type: 'number', message: this.$t("vsr1000.greRule[9]")},
          {validator:checkMss}],
        mtu: [
          { required: true, message: this.$t('vsr1000.remind[15]'), trigger: 'blur' },{ type: 'number', message: this.$t("vsr1000.greRule[10]")},
          { validator: checkMtu }
        ],
        valueIn:[{  message: this.$t('vsr1000.remind[20]'), trigger: 'change' }],
        valueOut:[{  message: this.$t('vsr1000.remind[20]'), trigger: 'change' }],
        value2:[{  message: this.$t('vsr1000.remind[20]'), trigger: 'change' }],
        value3:[{ required: true, message: this.$t('vsr1000.remind[20]'), trigger: 'change' }],
        value4:[{ required: true, message: this.$t('vsr1000.remind[20]'), trigger: 'change' }]
      },
      checkIp:[
        { required: true, message: this.$t('vsr1000.remind[15]'), trigger: 'blur' },
        { pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]|[1-9]?)\.)(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, message: this.$t('vsr1000.remind[22]') }
      ],
      checkMac:[
        { required: true, message: this.$t('vsr1000.remind[15]'), trigger: ['blur', 'change'] },
        { pattern: /^[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}$/, message: this.$t('vsr1000.remind[21]') }
      ],
      qosDetailShow:false,
      aclDetailShow:false
    }
  },
  computed: {},
  methods: {
    //查看acl详情 View ACL details
    // View ACL Details
    goAclDetails(val) {
      if (val.length) {
        this.aclDetailShow = true;
        this.$refs.aclDetail.selectList(val);
      } else {
        return;
      }
    },
    //查看qos详情 View qos details
    // View qos Details
    goQosDetails(val) {
      if (val.length) {
        this.qosDetailShow = true;
        this.$refs.qosDetail.dataInit(val);
      } else {
        return;
      }
    },
    open(){
      if(this.form.open==true){
         this.checkIp[0].required = true
         this.checkMac[0].required = true
      }else if(this.form.open==false){
         this.checkIp[0].required = false
         this.checkMac[0].required = false
         this.form.ipAddress = [
           {
            macVal: "",
            ipVal: ""
          }
         ]
      }
    },
    close() {
        this.$refs.gradeSet.classList.add("isShow")
        this.$refs.form.resetFields();
        this.form.mss = ''
        this.form.mtu = ''
        this.form.ipAddress = [{macVal: "",ipVal: ""}]
        if(this.form.open==true){
          this.checkIp[0].required = true
          this.checkMac[0].required = true
        }else if(this.form.open==false){
          this.checkIp[0].required = false
          this.checkMac[0].required = false
          this.form.ipAddress = [
            {
              macVal: "",
              ipVal: ""
            }
          ]
        }
    },
    removeDomain(item) {
        var index = this.form.ipAddress.indexOf(item)
        if (index !== -1) {
          this.form.ipAddress.splice(index, 1)
        }
      },
    addIp() {
      this.form.ipAddress.push({
        macVal: "",
        ipVal: "",
        key: Date.now()
      })
    },
    save(formName){
        let arr = []
        this.form.ipAddress.map(item=>{
          arr.push({
            mac:item.macVal,
            arpIp:item.ipVal
          })
        })
        let params ={
          deviceSerialNumber:this.deviceSerialNumber,
          tenantId:this.tenantId,
           id:this.form.id,
          //  arp:this.form.open?1:0,
          //  arpList:arr,
           cgnatId:this.form.value4,
           dhcpId:this.form.value3,
           aclInput:this.form.valueIn,
           qosInput:this.form.value2,
           mac:'',
           mss:Number(this.form.mss),
           mtu:Number(this.form.mtu),
           aclOutput:this.form.valueOut,
           qosOutput:'',
           randomId:parseInt((Math.random() + 1) * Math.pow(10, 6 - 1))+''
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            logicalPortExtraSet(params).then(res=>{
              if(res.code==10000){
                this.$message({
                  message: this.$t('vsr1000.remind[0]'),
                  type: 'success'
                });
                this.close()
                this.$parent.getList()
              }else{
                  this.$message({
                    message: this.$t('vsr1000.remind[18]'),
                    type: 'warning'
                  });
              }
              // else if(res.message=='您的物理端口有多个，不能绑定入向QOS，请修改物理端口'){
              // Else if(res.message==' You have more than one physical port and cannot be bound to QOS, please modify the physical port '){
              //   this.$message({
              //     message: '您的物理端口有多个，不能绑定入向QOS，请修改物理端口',
              // Message: 'Your physical ports have multiple, cannot be bound to QOS, please modify the physical ports ',
              //     type: 'warning'
              //   });
              // }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    }
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="scss">
.addGrageMain {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background:rgba(32,42,59,0.2);
  z-index: 100;
}
li{
  div{
    margin-top: 5px;
  }
}
// .liDel{
//   button{
//     position: absolute;
//     margin-top: 5px;
//   }
// }
.isShow {
  display: none;
}
.context {
  width: 980px;
  height: 393px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 15px 30px 0px rgba(191, 198, 217, 0.15);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  // transform: translate(-50%, -50%);
  margin-left: -490px;
  margin-top: -196px;
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
.event::-webkit-scrollbar {
    width: 4px;    
    /*height: 4px;*/
}
.event::-webkit-scrollbar-thumb{
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: rgba(0,0,0,0.2);
}
.event::-webkit-scrollbar-track {
   -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
   border-radius: 0;
   background: rgba(0,0,0,0.1);
}
.event{
    padding: 30px 20px 30px 0;
    height: 545px;
    overflow: auto;
    text-align: center;
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
  }
  .save:hover{
    background: #6095D6;
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
.addAddress {
  width: 860px;
  margin-left: 50px;
  height: auto;
  background: #F4F8FE;
  margin-bottom: 30px;
  position: relative;
  .addAddressEvent {
    display: flex;
    padding-top: 13px;
    li {
      width: 360px;
      
      position: relative;
    }
  }
  > .addPortBtn {
    position: absolute;
    top: 26px;
    right: 10px;
  }
  .remove{
    position: absolute;
    top:3px;
    right:-100px;
    height: 34px;
    padding: 0.12rem 10px;
    line-height: 0;
  }
}
.first{
  margin-left: 35px;
}
.goDetails {
  width: 24px;
  height: 24px;
  margin-left: 10px;
  font-size: 24px;
  color: #d1d7e0;
}
.detailsActive {
  color: #3678c8;
}
</style>
<style lang="scss">
 .addGrageMain .el-input {
    width: 300px;
    height: 34px;
    border-radius: 4px;
    .el-input__inner {
      height: 100%;
      line-height: 34px;
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
  .addGrageMain .addAddress{
    .el-input{
      width: 260px;
    }
    .el-form-item__label{
      width: 90px !important;
    }
  }
  
</style>