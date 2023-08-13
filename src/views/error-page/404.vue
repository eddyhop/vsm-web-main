<template>
  <div>
    <p>抱歉您没有访问权限</p>
    <button @click="backHome">返回首页</button>
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
      backHome(){
          this.$router.push({path:"/home"})
      }
  },
  created() {},
  mounted() {
      
  }
};
</script>
<style scoped lang="scss">
</style>