<template>
    <div class="editzh">
        <div class="cont">
            <div class="title">
                {{$t('TenDomain.edit')}} {{$t('TenDomain.tenDomain')}}
                <span @click="close"></span>
            </div>
            <div class="even">
                <el-form :model="form" :rules="rules" ref="form" label-width="120px">
                    <el-form-item :label="$t('TenDomain.name')" prop="name">
                        <el-input v-model="form.name" size="small"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('TenDomain.tenant')" prop="rent">
                        <div class="a">
                            <el-select filterable size="small" v-model="form.rent" :placeholder="$t('TenDomain.choose')" :disabled="type==2?false:true">
                                <el-option v-for="(item,index) in form.options" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </div>
                    </el-form-item>
                    <!-- <el-form-item :label="$t('TenDomain.maxiMum')">
                        <el-input v-model="form.max" size="small"></el-input>
                    </el-form-item> -->
                    <el-form-item :label="$t('TenDomain.description')">
                        <el-input v-model="form.describe"  size="small"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <div class="contr">
                            <button @click.prevent="save('form')">{{$t('TenDomain.save')}}</button>
                            <button @click.prevent="close" class="cancel">{{$t('TenDomain.cancel')}}</button>
                        </div>
                    </el-form-item>
                </el-form>
           </div>
        </div>
    </div>
</template>
<script>
import {rentRFSet,vrfName} from '@/services'
export default {
    data() {
        var checkName = (rule, value, callback)=>{
            if(value){this.form.id
               let params = {
                   verifyId:this.form.id,
                   verifyName:this.form.name,
                   verifyScope:this.form.rent
               }
               if(this.form.rent==''){
                   callback(new Error(this.$t('TenDomain.hint7')))
               }else{
                   vrfName(params).then(res=>{
                       if(res.code==10000){
                           callback()
                       }else{
                           callback(new Error(this.$t('TenDomain.hint8')))
                       }
                   })
               }
            }
        }
        return {
            type:JSON.parse(sessionStorage.getItem('userData')).type,
            form:{
                id:'',
                name:'',
                rent:'',
                options:[],
                max:'',
                describe:''
            },
            rules:{
                name:[
                    { required: true, message: this.$t('TenDomain.hint1'), trigger: 'blur' },
                    { validator: checkName, trigger: 'change' }
                ],
                rent:[{ required: true, message: this.$t('TenDomain.hint7'), trigger: 'change'}]
            }
        }
    },
    created(){
        this.form.rent=this.type==2?'':JSON.parse(sessionStorage.getItem('userData')).tenantId
    },
    methods:{
        save(formName){
            let params = {
                id:this.form.id,
                description:this.form.describe,
                // maxItem:this.form.max,
                name:this.form.name,
                tenantId:this.form.rent
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.close()
                    rentRFSet(params).then(res=>{
                        if(res.code==10000){
                            this.$message({
                               message: this.$t('TenDomain.hint11'),
                                type: 'success'
                            })
                            this.$parent.getList()
                        }else{
                            this.$message({
                                message: res.message,
                                type: 'warning'
                            });
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        close(){
            this.$parent.editShow = false
            this.form.max = ''
            this.form.describe = ''
            this.$refs.form.resetFields();
        }
    }
}
</script>
<style lang="scss" scoped>
.even{
    width: 420px;
    margin: 0 auto;
    margin-top: 30px;
    text-align: center;
    margin-left: 15px;
    .a{
        div{
            width: 300px;
        }
    }
    .remaind{
        color: darkgray;
        font-size: 14px;
    }
    .contr{
        margin-left: -60px;
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
}
.cont{
    width:482px;
    height:407px;
    background: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow:0px 10px 20px 0px rgba(102,102,102,0.1);
    border-radius:2px;
    .title{
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
            background-image: url('../../../assets/icon_close.png');
            background-size: 14px 14px;
        }
    }
}
.editzh{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    z-index: 9;
    background:rgba(32,42,59,0.2);
}
</style>