<template>
  <div class="chart" :id="id" :data="data">
  </div>
</template>
<script>
export default {
  props: ["id", "data"],
  components: {},
  data() {
    return {
      ChartLineGraph: null
    };
  },
  computed: {
    address(){
      const {id,data} = this
      return {
        id,data
      }
    }
  },
  methods: {
    drawLineGraph(id, data) {
      let _this = this;
      let myChart = document.getElementById(id);
      this.ChartLineGraph = this.$echarts.init(myChart);
      this.ChartLineGraph.setOption(data,true);
      window.addEventListener("resize", () => {
        _this.ChartLineGraph.resize();
      });
    }
  },
  created() {},
  mounted() {
    this.drawLineGraph(this.id, this.data);
    setTimeout(() => {
      this.ChartLineGraph.resize();
    }, 100);
  },
  watch:{
    address: {
      handler: function(newval , oldval) {
        this.drawLineGraph(newval.id,newval.data)
      },
      deep: true
    }
  }
};
</script>
<style scoped lang="scss">
.chart {
  width: 100%;
  height: 100%;
}
</style>
