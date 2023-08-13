<template>
    <div class="addLacl">
        <div class="content">
            <div class="top">
                LAN-ACL {{$t('vsr100.acl.add')}}
                <span @click="close"></span>
            </div>
            <div class="form">
                <el-form :model="form" :rules="rules" ref="form" label-width="150px" :inline="true" class="demo-ruleForm" @submit.native.prevent>
                  <el-form-item :label="$t('vsr100.acl.index')" prop="num">
                      <el-input v-model.number="form.num" size="small"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('vsr100.acl.protocol')" prop="value">
                      <div class="a">
                        <el-select filterable v-model="form.value" @change="chose(form.value)" :placeholder="$t('vsr100.acl.choose')" size="small">
                          <el-option
                            v-for="item in form.options"
                            :key="item.value"
                            :label="item.dictValue"
                            :value="item.id">
                          </el-option>
                        </el-select>
                      </div>
                  </el-form-item>
                  <el-form-item :label="$t('vsr100.acl.sourceIP')" prop="Ip">
                      <el-input v-model="form.Ip" size="small"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('vsr100.acl.sourcePort')" v-show="codeShow" prop="code">
                      <el-input v-model="form.code" placeholder="1-65535" size="small"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('vsr100.acl.destIP')" prop="goalIp">
                      <el-input v-model="form.goalIp" size="small"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('vsr100.acl.goalPort')" v-show="codeShow" prop="goalCode">
                      <el-input v-model="form.goalCode" placeholder="1-65535" size="small"></el-input>
                  </el-form-item>
                  <div class="control">
                      <button type="primary" v-debounce="save" class="save">{{$t('vsr100.acl.save')}}</button>
                      <button @click.prevent="close" class="cancel">{{$t('vsr100.acl.cancel')}}</button>
                  </div>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
import {setLanAcl,findLanAclOderNum} from '@/services'
export default {
    data() {
      var checkNum = (rule, value, callback) => {
        if (!value) {
          return callback(new Error(this.$t('vsr100.acl.remind[5]')));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error(this.$t('vsr100.acl.remind[6]')));
          } else {
            findLanAclOderNum({orderNum:value,deviceId:this.$parent.mid}).then(res=>{
              if(res.result==true){
                callback();         
              } else {
                callback(new Error(this.$t('vsr100.acl.remind[7]'))); 
              }
            })
          }
        }, 1000);
      };
      return {
        codeShow:false,
        had:'',
        form:{
            options:[],
            value: '',
            Ip:'',
            code:'',
            goalIp:'',
            goalCode:'',
            num:''
        },
        rules:{
            num:[
              { validator: checkNum, trigger: 'blur',required: true,}
              // { required: true, message: '请输入序号', trigger: 'blur' },
              // {required: true, message: 'Trigger: 'blur'},
              // { type: 'number', message: '序号必须为数字值'}
              // {type: 'number', message: 'Serial number must be numeric value '}
            ], 
            value:[{ required: true, message: this.$t('vsr100.acl.remind[8]'), trigger: 'change'}],
            Ip:[{ required: true, message: this.$t('vsr100.acl.remind[9]'), trigger: 'blur' },
                { pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]?|3[0-2])$/, message: this.$t('vsr100.acl.remind[10]') }
            ],
            code:[{ required: true, message: this.$t('vsr100.acl.remind[9]'), trigger: 'blur' },
                { pattern: /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/, message: this.$t('vsr100.acl.remind[11]') }
            ],
            goalIp:[{ required: true, message: this.$t('vsr100.acl.remind[9]'), trigger: 'blur' },
                { pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)([/])(?:[0-9]|[1-2][0-9]?|3[0-2])$/, message: this.$t('vsr100.acl.remind[10]') }
            ],
            goalCode:[{ required: true, message: this.$t('vsr100.acl.remind[9]'), trigger: 'blur' },
                { pattern: /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/, message: this.$t('vsr100.acl.remind[12]') }
            ],
        }
      };
    },
    methods: {
      // checkNum(val){
      //    findLanAclOderNum({orderNum:this.form.num}).then(res=>{
      //      this.had = res.result
      //    })
      // },
      chose(val){
         for(let i in this.form.options){
           if(val==this.form.options[i].id){
              if(this.form.options[i].dictValue=='IP'||this.form.options[i].dictValue=='ICMP'){
                  this.codeShow = false
                  this.rules.code[0].required = false
                  this.rules.goalCode[0].required = false
              }else{
                  this.codeShow = true
                  this.rules.code[0].required = true
                  this.rules.goalCode[0].required = true
              }
           }
         }
      },
      close(){
        this.$parent.addShow = false
        this.$refs.form.resetFields();
      },
      save(formName){
        let params = {
          destinationIp:this.form.goalIp,//目的ip Destination IP 
                                         // Destination IP Destination IP
          destinationIpPort:this.form.goalCode,//目的端口 destination port
                                               // Destination port Destination port
          // id:'',//id
          deviceId:this.$parent.mid,//mid
          protocol:this.form.value,//协议 agreement
                                   // Protocol agreement
          randomId:parseInt((Math.random() + 1) * Math.pow(10, 6 - 1))+'',//随机Id random id
                                                                          // Random Id, random Id
          sourceIp:this.form.Ip,//源ip  sourceIP 
                                // Source IP sourceIP
          sourceIpPort:this.form.code,//源端口 source port
                                      // Source port Source port
          sortOrder:Number(this.form.num)
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            setLanAcl(params).then(res=>{
              if(res.code==10000){
                this.$message({
                  message: this.$t('vsr100.acl.remind[13]'),
                  type: 'success'
                });
                this.close()
                this.$parent.getLList()
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      } 
    }
}
</script>
<style lang="scss">
.addLacl{
  .el-input__inner{
    width: 322px;
  }
}
</style>
<style lang="scss" scoped>
.addLacl{
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background:rgba(32,42,59,0.2);
  z-index: 100;
}
.control{
    // width: 100%;
    margin-left: 20px;
    text-align: center;
    .save:hover{
      background:rgba(96,149,214,1);
    }
    button{
        color: white;
        border: none;
        width:100px;
        height:34px;
        background:rgba(54,120,200,1);
        border-radius:2px;
        font-size:14px;
        font-family:arial, sans-serif;
        font-weight:400;
    }
    .cancel{
        margin-left: 18px;
        background:rgba(255,255,255,1);
        font-size:14px;
        font-family:arial, sans-serif;
        font-weight:400;
        color:rgba(102,102,102,1);
        border:1px solid rgba(209,215,224,1);
    }
}
.content{
    width:530px;
    // height:508px;
    background: white;
    border-radius: 7px;
    box-shadow:0px 10px 20px 0px rgba(102,102,102,0.1);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .form{
        // width: 500px;
        margin-left: -20px;
        padding: 30px;
        .a{
          div{
            width: 322px;
          }
        }
    }
    .top{
        display: flex;
        justify-content: space-between;
        font-size:14px;
        font-family:arial, sans-serif;
        font-weight:400;
        color:rgba(51,51,51,1);
        width: 100%;
        border-bottom: 1px solid rgba(231,231,231,1);
        padding: 15px;
        span{
            display: inline-block;
            width: 14px;
            height: 14px;
            background-image: url('../../../../assets/icon_close.png');
            background-size: 14px 14px;
        }
    }
}
</style>