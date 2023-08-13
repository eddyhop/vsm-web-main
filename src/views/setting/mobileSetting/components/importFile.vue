<template>
  <div class="importFile">
    <div class="show">
      <h4 class="title">{{$t('Mobile.hint9')}}</h4>
      <p class="con">
        {{$t('Mobile.hint10')}}{{$parent.input}}{{$t('Mobile.hint11')}}{{$parent.vrfname}}{{$t('Mobile.hint12')}}
        {{$t('Mobile.hint13')}}
      </p>
      <p class="specially">{{$t('Mobile.hint14')}}{{$parent.input}}{{$t('Mobile.hint11')}}{{$parent.vrfname}}</p>
      <div class="submit">
        <button class="save" type="primary" @click.prevent="submit">{{$t('Mobile.ok')}}</button>
        <button class="cancel" @click="close">{{$t('Mobile.cancel')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {},
  components: {},
  data() {
    return {};
  },
  computed: {},
  methods: {
    submit() {
        this.$parent.upload(this.$parent.file)
        this.$parent.flag = false
    },
    close() {
        this.$parent.flag = false
    }
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="scss">
.importFile {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background:rgba(32,42,59,0.2);
  z-index: 100;
}
.show {
  width: 404px;
  height: 266px;
  padding: 30px 40px 0;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 15px 30px 0px rgba(191, 198, 217, 0.15);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: auto;
  .title {
    text-align: center;
    font-size: 16px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
  .con {
    padding-top: 20px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
  .specially {
    padding-top: 20px;
    padding-bottom: 30px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(54, 120, 200, 1);
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