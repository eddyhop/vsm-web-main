<template>
  <el-container>
    <div>
      <el-header>
          <Head />
      </el-header>
      <div class="bottomMain">
        <div class="bg">
          <el-aside width="240px" height="100%">
            <div class="leftCont">
              <NewSlide></NewSlide>
            </div>
          </el-aside>
        </div>
        <el-container class="rightCon">
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
      </div>
    </div>
  </el-container>
</template>
<script>
import Head from "@/components/Head.vue";
import NewSlide from "@/components/newSlide.vue"
// import Title from "@/components/title.vue";
export default {
  props: {},
  components: {
    Head,
    NewSlide
    // Title
  },
  data() {
    return {
    };
  },
  computed: {},
  methods: {
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="scss">
.leftCont {
  padding: 0 20px;
  margin-top: 10px;
  display: flex;
  flex-flow: column;
  height: 100%;}
.logo {
  width: 150px;
  height: 40px;
  margin: 20px 0 0 30px;
  img{
    width: 100%;
    height: 100%;
  }
}
.rightCon{
   width: calc(100% - 240px);
   min-width: 1280px;
   padding: 0;
}
.bottomMain{
  display: flex;
  flex-direction: row;
  height: 100%;
  .bg {
    background: #efefef;
    padding: 0 0 0 0;
  }
}

</style>
<style lang="scss">
.el-header {
  padding: 0;
  width: 100%;
  background: #efefef;
}
.el-container {
  width: 100%;
  height: 100%;
  background: #efefef;
}
.is-vertical{
  width: calc(100% - 240px);
}
.el-main {
  min-width: 1126px;
  background: #efefef;
  padding:0%
}
.el-aside {
  height: 100%;
  background-image: linear-gradient(#505FF6, #949dfb);
  border-top-right-radius: 30px 30px;
}
.el-aside::-webkit-scrollbar ,.el-main::-webkit-scrollbar {
  width: 4px;
  height: 100%;
}
.el-aside::-webkit-scrollbar ,.el-main::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  height: 100%;
}
.el-aside::-webkit-scrollbar ,.el-main::-webkit-scrollbar-track  {
     -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
     border-radius: 0;
}
</style>
