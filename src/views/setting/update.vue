<template>
    <div class="local">
        <!-- <span>{{$t('update.upgrade')}}</span>
        <div class="even">
            <el-form :model="form" :rules="rules" ref="form" label-position="left">
                <el-form-item :label="$t('update.defaultUpgradeTime')" prop="input" label-width="150px">
                    <el-input v-model="form.input" placeholder="00:00"></el-input>
                </el-form-item>
                <button @click.prevent="set('form')">{{$t('update.set')}}</button>
            </el-form>
        </div> -->
        <div class="title">
            <h3>{{$t("LocalUpgrade.set")}}<img src="@/assets/icon_right@2x.png" alt=""/><span>{{$t('LocalUpgrade.local')}}</span></h3>
        </div>
        <div class="content">
            <h1>{{$t('LocalUpgrade.local')}}</h1>
            <div class="item">
                <p>{{$t('LocalUpgrade.default')}}：</p>
                <div class="ipt">
                    <el-form :model="form" ref="form" label-position="left" @submit.native.prevent>
                        <el-form-item label-width="150px">
                            <el-time-picker size="small"
                                v-model="form.val">
                            </el-time-picker>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <button class="save" v-debounce="set" v-control>{{$t('LocalUpgrade.save')}}</button>
        </div>
    </div>
</template>
<script>
import {upDate} from '@/services'
export default {
 data() {
    return {
        form:{
            input: new Date()
        },
    }
  },
  methods:{
      getTime(time) {
        let date = new Date(time);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let miao = date.getSeconds();
        let list = [year, month, day, hour, minute, miao];
        let list2 = [];
        for (let i in list) {
            if (list[i] < 10) {
            let a = "" + 0 + list[i];
            list2.push(a);
            } else {
            list2.push(list[i]);
            }
        }
        let needTime =
            list2[3] +
            ":" +
            list2[4] 
        return needTime;
        },
      set(formName){
          let params = {
              upgradeTime :this.getTime(this.form.input)
          }
        this.$refs[formName].validate((valid) => {
            if (valid) {
                upDate(params).then(res=>{                   
                    if(res.code==10000){
                        this.$message({
                            message:this.$t('LocalUpgrade.hint1'),
                            type: 'success'
                        });
                    }
                })
            } else {
                console.log('error submit!!');
                return false;
            }
        });
      },
  }
}
</script>
<style lang="scss">
.el-time-panel__footer{
    .el-time-panel__btn.confirm{
        color:rgba(54,120,200,1)
    }
}
</style>
<style lang="scss" scoped>
.content{
    flex: 1;
    background: white;
    margin-top: 20px;
    padding: 20px 30px;
    font-size:16px;
    font-family:arial, sans-serif;
    font-weight:400;
    color:rgba(51,51,51,1);
    .save:hover{
            background: #3678C8;
        }
    .ipt{
        width: 340px;
        margin-top: -30px;
        margin-left: -30px;
    }
    button{
        width:100px;
        height:34px;
        background:rgba(54,120,200,1);
        border-radius:2px;
        border: none;
        color: white;
        margin-top: 20px;
        margin-left: 120px;
        font-size: 14px;
    }
    .item{
        margin-top: 30px;
        p{
            width:130px;
        }
    }
    h1{
        font-size:18px;
        font-family:arial, sans-serif;
        font-weight:400;
        color:rgba(51,51,51,1);
    }
}
.title{
    width: 100%;
    height: 62px;
    background: white;
    padding: 20px 30px;
    h3 {
      font-size: 15px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      span{
        font-size: 14px;
        line-height: 8px;
      }
      img{
        width:5px;
        height:8px;
        margin-left: 5px;
        margin-right: 5px;
      }
    }
}
.local{
    width: 100%;
    height: 100%;
    display: flex;
    // background: white;
    box-sizing: border-box;
    display: flex;
    flex-flow: column;
}
</style>