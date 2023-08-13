<!--  二次确认身份认证 -->
<template>
<div class='confirm'>
   <div class="cont">
       <h3>{{$t("Identity.hint2")}}</h3>
       <div class="fileName">{{this.$parent.input}}</div>
       <div class="btn">
           <button v-debounce="save">{{$t("Identity.ok")}}</button>
           <button @click="close">{{$t("Identity.cancel")}}</button>
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
return {

};
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
  save(){
      this.$parent.submitUpload()
  },
  close(){
      this.$parent.flag = false
  }
},
//生命周期 - 创建完成（可以访问当前this实例）
// Life cycle - Creation complete (you can access the current this instance)
created() {

},
//生命周期 - 挂载完成（可以访问DOM元素）
// Life cycle - Mount complete (with access to DOM elements)
mounted() {

},
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
activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
                // If the page has keep-alive caching, this function fires
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
// @import url(); Introduce common CSS classes
.btn{
    position: absolute;
    bottom: 30px;
    transform: translate(40%,0%);
    button{
        width:100px;
        height:34px;
        background:rgba(54,120,200,1);
        border-radius:2px;
        font-size:14px;
        font-family:arial, sans-serif;
        font-weight:400;
        color:rgba(255,255,255,1);
        border: none;
        margin-right: 18px;
    }
    button:nth-of-type(2){
        width:70px;
        height:34px;
        background:rgba(255,255,255,1);
        color:rgba(102,102,102,1);
        border-radius:2px;
        border:1px solid rgba(209,215,224,1);
    }
}
.fileName{
    width: 366px;
    font-size:14px;
    margin-top: 10px;
    margin-bottom: 10px;
    text-align: center
}
.cont{
    width:404px;
    height:215px;
    background: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 7px;
    text-align: center;
    padding: 30px;
    position: relative;
    h3{
        font-size:16px;
        font-family:arial, sans-serif;
        font-weight:400;
        color:rgba(51,51,51,1);
        line-height:22px;
    }
}
.confirm{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    z-index: 9;
    background:rgba(32,42,59,0.2);
}
</style>