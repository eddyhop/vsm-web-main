<!--  -->
<template>
<div class='remove'>
    <div class="con">
      <h4 class="title">
        <span>{{$t('Monit.delGroup')}}</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="content">
          <p>{{$t('Monit.Hint1')}}{{name}}{{$t('Monit.Hint2')}}{{name}}{{$t('Monit.Hint3')}}</p>
      </div>
      <div class="control">
          <button @click="save">{{$t('Monit.ok')}}</button>
          <button @click="close">{{$t('Monit.cancel')}}</button>
      </div>
    </div>
</div>
</template>
<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// Here you can import other files (such as: components, tools js, third-party plug-ins JS, JSON files, image files, etc.)
//例如：import 《组件名称》 from '《组件路径》';
// For example: import component name from 'Component path ';
import {removeFavoriteChart} from '@/services'
export default {
//import引入的组件需要注入到对象中才能使用
// Import introduces components that need to be injected into an object before they can be used
components: {},
data() {
return {
   favoriteId:'',
   position:'',
   name:'',
   deviceSerialNumber:''
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
    removeFavoriteChart({favoriteId:this.favoriteId,position:this.position,deviceSerialNumber:this.deviceSerialNumber}).then(res=>{
        if(res.code==10000){
            this.$message({
              message: this.$t('Monit.hint4'),
              type: 'success'
            });
            this.close()
            this.$parent.delItemAfter()
        }
    })
  },
  close(){
    this.$parent.delFlag = false
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
.control{
    text-align: center;
    :last-child{
        border:1px solid rgba(209,215,224,1);
        width:70px;
        height:34px;    
        background: none;
        color: #666666;
        margin-left: 18px;
    }
    button{
        width:100px;
        height:34px;
        background:rgba(54,120,200,1);
        border-radius:2px;
        border: none;
        color: white;
        font-size:14px;
        font-family:arial, sans-serif;
        font-weight:400;
    }
}
.content{
    text-align: center;
    font-size:16px;
    font-family:arial, sans-serif;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:26px;
    padding: 35px;
}
.remove{
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background:rgba(32,42,59,0.2);
  z-index: 101;
}
.con{
  width:462px;
  min-height:270px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 15px 30px 0px rgba(191, 198, 217, 0.15);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  // overflow: auto;
  .title {
    width: 100%;
    height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid rgba(231, 231, 231, 1);
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    i {
      width: 14px;
      height: 14px;
      background: url("../../../assets/icon_close.png") no-repeat;
      background-size: cover;
      cursor: pointer;
    }
  }
}
</style>