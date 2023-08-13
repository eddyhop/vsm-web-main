<template>
    <div class="sbwatch">
        <el-tabs v-model="activeName">
            <el-tab-pane :label="$t('watch.deviceMonitor')" name="first">
               <sWatch></sWatch>
            </el-tab-pane>
            <el-tab-pane :label="$t('watch.linkMonitor')" name="second">
               <lWatch></lWatch>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
// import sWatch from './w-component/swatch'
// import lWatch from './w-component/lwatch'
export default {
    components:{sWatch,lWatch},
    data() {
      return {
        activeName: 'first'
      };
    },
}
</script>
<style lang="scss" scoped>
.sbwatch{
    flex:1;
    background: white;
    box-sizing: border-box;
    padding: 16px 20px;
}
</style>