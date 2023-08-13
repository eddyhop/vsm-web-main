<!--  -->
<template>
  <div class="loading">
    <div class="cont">
      <div class="title">
        {{$t("cloudDev.versionUpdating")}}
        <span @click="close"></span>
      </div>
      <div class="even">
          <h3>{{$t("cloudDev.NewVersionDetected")}}</h3>
          <div class="container">
              <div class="back"></div>
          </div>
          <div class="control">
              <button class="save">{{$t("cloudDev.confirm")}}</button>
              <button class="cancel" @click="close">{{$t("cloudDev.cancel")}}</button>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// Here you can import other files (such as: components, tools js, third-party plug-ins JS, JSON files, image files, etc.)
//例如：import 《组件名称》 from '《组件路径》';
// For example: import component name from 'Component path ';

export default {
  //import引入的组件需要注入到对象中才能使用
  // Import introduces components that need to be injected into an object before they can be used
  components: {},
  data() {
    return {};
  },
  //监听属性 类似于data概念
  // Listening properties are similar to the data concept
  computed: {},
  //监控data中的数据变化
  // Monitor data changes in data
  watch: {},
  //方法集合
  // Methods collection
  methods: {
      close(){
        this.$parent.LoadShow = false;
      }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  // Life cycle - Creation complete (you can access the current this instance)
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  // Life cycle - Mount complete (with access to DOM elements)
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
                     // Life cycle - before creation
  beforeMount() {}, //生命周期 - 挂载之前
                    // Life cycle - before mount
  beforeUpdate() {}, //生命周期 - 更新之前
                     // Life cycle - before updates
  updated() {}, //生命周期 - 更新之后
                // Life cycle - after update
  beforeDestroy() {}, //生命周期 - 销毁之前
                      // Life cycle - before destruction
  destroyed() {}, //生命周期 - 销毁完成
                  // Life cycle - Destruction complete
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
                 // If the page has keep-alive caching, this function fires
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
// @import url(); Introduce common CSS classes
.even{
    text-align: center;
    padding: 30px;
    .container{
        width: 400px;
        margin-top: 30px;
        background: rgba(0,0,0,0.05);
        border: rgba(0,0,0,0.1);
    }
    .back{
        width: 400px;
        height: 16px;
        border-radius: 12px;
        background-size: 18px 18px;
        background-image: linear-gradient(
            -45deg,green 25%,rgba(2,152,5,0.5) 0,rgba(2,152,5,0.5) 50%,green 0,green 75%,rgba(2,152,5,0.5) 0
        );
        -webkit-animation: back-animation 10s infinite linear;
    }
    @-webkit-keyframes back-animation{
        from{
            background-position-x:0px;
        }to{
            background-position-x:400px;
        }
    }
    h3{
        font-size:16px;
        font-family:arial, sans-serif;
        font-weight:400;
        color:rgba(54,120,200,1);
    }
    .control{
        margin-top: 50px;
        button{
            width:100px;
            height:34px;
            background:rgba(54,120,200,1);
            border-radius:2px;
            border: none;
            color: white
        }
        .cancel{
            margin-left: 18px;
            width: 70px;
            background:rgba(255,255,255,1);
            font-size:14px;
            font-family:arial, sans-serif;
            font-weight:400;
            color:rgba(102,102,102,1);
            border:1px solid rgba(209,215,224,1);
        }
    }
}
.cont {
  width:462px;
  height:262px;
  background: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0px 10px 20px 0px rgba(102, 102, 102, 0.1);
  border-radius: 7px;
  .title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    width: 100%;
    border-bottom: 1px solid rgba(231, 231, 231, 1);
    padding: 15px;
    span {
      display: inline-block;
      width: 14px;
      height: 14px;
      background-image: url("../../../../assets/icon_close.png");
      background-size: 14px 14px;
    }
  }
}
.loading {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 9;
  background: rgba(176, 181, 194, 0.3);
}
</style>