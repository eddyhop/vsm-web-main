<template>
  <div class="content">
    <div class="inner">
      <h2>{{$t('cloudAccount.remind[4]')}}</h2>
      <div class="button">
        <button class="sure" @click="submitForm()">{{$t('cloudAccount.save')}}</button>
        <button class="cancel" @click="close">{{$t('cloudAccount.cancel')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { delCloudAccount } from "@/services"
export default {
  props:["multipleSelection","delStatus","delAccountId"],
  methods:{
    close(){
      this.$parent.isShowDel=false;
    },
    submitForm(){
      if(this.delStatus){
        let delIds = "";
        this.multipleSelection.forEach((val,index) => {
          delIds = delIds + val + ","
        })
        delIds = delIds.substr(0,delIds.length-1);
        delCloudAccount({
          ids:delIds
        }).then(res => {
          if(res.code === 10000){
            if(this.$parent.tableData.length == 1 && this.$parent.lNumber != 1){
              this.$parent.lNumber = this.$parent.lNumber - 1; 
            }
            this.$parent.getTableList();
            this.$message.success(this.$t('cloudAccount.remind[2]'))
            this.$parent.isShowDel = false;
          }
        })
      }else{
        delCloudAccount({
          ids:this.delAccountId
        }).then(res => {
          if(res.code === 10000){
            if(this.$parent.tableData.length == 1 && this.$parent.lNumber != 1){
              this.$parent.lNumber = this.$parent.lNumber - 1;
            }
            this.$parent.getTableList();
            this.$message.success(this.$t('cloudAccount.remind[2]'))
            this.$parent.isShowDel = false;
          }
        })
      }
      
    }
  },
};
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  background: rgba(32, 42, 59, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  .inner {
    width: 404px;
    height: 215px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    padding: 58px 0 30px;
    h2 {
      font-size: 18px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      margin-bottom: 68px;
    }
    .sure {
      width: 100px;
      height: 34px;
      background: rgba(54, 120, 200, 1);
      border-radius: 7px;
      border: none;
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      margin-right:18px;
      &:hover {
        background: #6095d6;
      }
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
      padding:0px;
      &:hover {
        color: #fff;
        background: rgba(54, 120, 200, 1);
        border-color: rgba(54, 120, 200, 1);
      }
    }
  }
}
</style>