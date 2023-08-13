<template>
  <div class="lDHCP">
    <!-- vsr-lite DHCP -->
    <div class="even">
        <el-form :model="val" inline="true" :rules="rules" ref="form" label-width="auto" label-position="right" @submit.native.prevent>

          <el-form-item label="option domainName" prop="sip">
              <el-input v-model="val.sip" :placeholder="$t('vsr100.dhcp.enterContent')" size="small"></el-input>
          </el-form-item>
          <el-form-item label="option domain-name-servers" prop="eip">
              <el-input v-model="val.eip" :placeholder="$t('vsr100.dhcp.enterContent')" size="small"></el-input>
          </el-form-item>
          <el-form-item label="subnet" prop="time">
              <el-input v-model.number="val.time" :placeholder="$t('vsr100.dhcp.enterContent')" size="small"></el-input>
          </el-form-item>
          <el-form-item label="netmask" prop="code">
              <el-input v-model="val.code" :placeholder="$t('vsr100.dhcp.enterContent')" size="small"></el-input>
          </el-form-item>
          <el-form-item label="option routers" prop="dns">
              <el-input v-model="val.dns" :placeholder="$t('vsr100.dhcp.enterContent')" size="small"></el-input>
          </el-form-item>
          <el-form-item label="option domain search" prop="dns">
              <el-input v-model="val.dns" :placeholder="$t('vsr100.dhcp.enterContent')" size="small"></el-input>
          </el-form-item>
          <el-form-item label="option domainName servers" prop="dns">
              <el-input v-model="val.dns" :placeholder="$t('vsr100.dhcp.enterContent')" size="small"></el-input>
          </el-form-item>
          <el-form-item label="startAddress" prop="dns">
              <el-input v-model="val.dns" :placeholder="$t('vsr100.dhcp.enterContent')" size="small"></el-input>
          </el-form-item>
          <el-form-item label="endAddress" prop="dns">
              <el-input v-model="val.dns" :placeholder="$t('vsr100.dhcp.enterContent')" size="small"></el-input>
          </el-form-item><br></br>
            <el-form-item>
              <button v-debounce="save" class="save" v-control>{{$t('vsr100.dhcp.save')}}</button>
            </el-form-item>
          
        </el-form>
    </div>
  </div>
</template>
<script>
import {setDhcp,getDhcp} from '@/services'
export default {
  props: {},
  components: {},
  data() {
    var eipCheck = (rule, value, callback) => {
        let small = Number(value.split('.')[3])
        let big = Number(this.val.sip.split('.')[3])
        if(small<big||small==big){
          callback(new Error(this.$t('vsr100.dhcp.remind[0]')));
        }else{
          callback()
        }
    };
    return {
      val: {
        sip: "",
        code: "",
        mid:'',
        time:"",
        dns:"",
        eip:""
      },
      id:'',
      flag:true,
      switchState: true,
      rules:{
        sip:[
          { required: true, message: this.$t('vsr100.dhcp.enterContent'), trigger: 'blur' },
          { pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, message: this.$t('vsr100.dhcp.remind[5]') }
        ], 
        eip:[
          { required: true, message: this.$t('vsr100.dhcp.enterContent'), trigger: 'blur' },
          { validator: eipCheck, trigger: 'blur' },
          { pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, message: this.$t('vsr100.dhcp.remind[5]') }
        ], 
        time:[
          { required: true, message: this.$t('vsr100.dhcp.enterContent'), trigger: 'blur' },
          { type: 'number', message: this.$t('vsr100.dhcp.remind[7]')}
        ], 
        code:[
          { required: true, message: this.$t('vsr100.dhcp.enterContent'), trigger: 'blur' },
          { pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, message: this.$t('vsr100.dhcp.remind[6]') }
        ], 
        dns:[
          { pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, message: this.$t('vsr100.dhcp.remind[5]') }
        ], 
      }
    };
  },
  computed: {},
  methods: {
    open(){
        // console.log(this.switchState)
        if(this.switchState==true){
           this.flag = true
        }else{
           this.flag = false
        }
        let params = {
          id:this.id,
          serverEnabled:this.switchState ,
          deviceId:this.val.mid,
          leaseTime:this.val.time,
          ipStart:this.val.sip,
          ipEnd:this.val.eip,
          dnsIp:this.val.dns,
          gatewayIp:this.val.code,
          randomId:parseInt((Math.random() + 1) * Math.pow(10, 6 - 1))+''
        }
        setDhcp(params).then(res=>{
          
        })
    },
    save(formName){
      let params = {
        id:this.id,
        serverEnabled:this.switchState ,
        deviceId:this.val.mid,
        leaseTime:this.val.time,
        ipStart:this.val.sip,
        ipEnd:this.val.eip,
        dnsIp:this.val.dns,
        gatewayIp:this.val.code,
        randomId:parseInt((Math.random() + 1) * Math.pow(10, 6 - 1))+''
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          setDhcp(params).then(res=>{
            // console.log(res)
            if(res.code==10000){
              this.$message({
                message: this.$t('vsr100.dhcp.remind[8]'),
                type: 'success'
              });
              this.val.mid = JSON.parse(this.$route.query.devData).deviceId
              getDhcp({deviceId:this.val.mid}).then(res=>{
                // console.log(res)
                this.val.sip = res.result.ipStart
                this.val.eip = res.result.ipEnd
                this.val.time = res.result.leaseTime
                this.val.code = res.result.gatewayIp
                this.val.dns = res.result.dnsIp
              })
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  },
  created() {
    this.val.mid = JSON.parse(this.$route.query.devData).deviceId,
    getDhcp({deviceId:this.val.mid}).then(res=>{
      // console.log(res)
      this.val.sip = res.result.ipStart
      this.val.eip = res.result.ipEnd
      this.val.time = res.result.leaseTime
      this.val.code = res.result.gatewayIp
      this.val.dns = res.result.dnsIp
      this.id = res.result.id
      if(res.result.serverEnabled){
          this.flag = true
          this.switchState = true
      }else{
          this.flag = false
          this.switchState = false
      }

    })
  },
  mounted() {}
};
</script>
<style scoped lang="scss">
.even{
  span{
    font-size: 16px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    line-height: 34px;
    padding-left: 11px;
  }
  .save:hover{
            background: rgba(96, 149, 214, 1);
        }
}
.lDHCP {
  padding: 30px;
}
.title {
  font-size: 29px;
  font-family: arial, sans-serif;
  font-weight: bold;
  color: rgba(39, 40, 56, 1);
  line-height: 34px;
  padding-bottom: 42.5px;
}
button {
  width:100px;
  height:34px;
  background:rgba(54,120,200,1);
  font-size: 14px;
  border-radius:2px;
  color: white;
  border: none;
  outline: none;
  cursor: pointer;
}
</style>
<style lang="scss">
.lDHCP {
  .el-input {
    width: 320px;
  }
  .el-form-item__label{
    font-size:14px;
    font-family:arial, sans-serif;
    font-weight:400;
    color:rgba(51,51,51,1);
  }
}
</style>