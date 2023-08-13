<!--  -->
<template>
<div class='noInfo'>
    <img src="../../../assets/empty_icon_focus @2x.png" alt="">
    <p>{{$t('Monit.collectionHint')}}</p>
    <!-- <div class="tu" id="tu"></div> -->
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
mounted() {
    // this.tu()
    // console.log(666)
},
//监控data中的数据变化
// Monitor data changes in data
watch: {},
//方法集合
// Methods collection
methods: {
  
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
.noInfo{
    width: 100%;
    height: 100%;
    text-align: center;
    padding: 150px;
    box-sizing: border-box;
    img{
        width: 80px;
        height: 76px;
    }
    p{
        font-size:16px;
        font-family:arial, sans-serif;
        font-weight:400;
        color:rgba(51,51,51,1);
        margin-top: 30px;
    }
    .tu{
        width: 800px;
        height: 500px;
    }
}
</style>