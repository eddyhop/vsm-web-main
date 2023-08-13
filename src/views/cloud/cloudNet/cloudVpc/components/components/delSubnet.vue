<template>
  <div class="closeAws">
    <div class="content">
      <p>{{$t('cloudNet.vpc.notToDelete')}}{{delSubnetMsg.subnetName}}？</p>
      <div class="submit">
        <button
          class="save"
          type="primary"
          @click.prevent="submitForm('form')"
        >{{$t('cloudNet.vpc.ok')}}</button>
        <button class="cancel" @click="close">{{$t('cloudNet.vpc.cancel')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { delSubnet } from "@/services"
export default {
  props: ["delSubnetMsg"],
  components: {},
  data() {
    return {};
  },
  computed: {},
  methods: {
    submitForm(){
      delSubnet({
        ids:this.delSubnetMsg.id
      }).then(res => {
        if(res.code === 10000){
          if(this.$parent.$refs.Subnet.tableData.length == 1 && this.$parent.$refs.Subnet.page != 1){
            this.$parent.$refs.Subnet.page = this.$parent.$refs.Subnet.page - 1;
          }
          this.$message.success(this.$t('cloudNet.vpc.remind[2]'));
          this.$parent.isShowDelSubnet = false;
          this.$parent.$refs.Subnet.getSubnetList();
        }else{
          this.$message.error(res.message);
        }
      })
    },
    close(){
      this.$parent.isShowDelSubnet = false;
    },
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="scss">
.closeAws {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(176, 181, 194, 0.3);
  z-index: 100;
}
.content {
  width: 404px;
  height: 215px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 15px 30px 0px rgba(191, 198, 217, 0.15);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: auto;
  p {
    width: 100%;
    padding: 58px 0 69px 0;
    font-size: 18px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    text-align: center;
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
    cursor: pointer;
  }
  .save:hover {
    background: rgba(96, 149, 214, 1);
    border: 0;
  }
}
</style>