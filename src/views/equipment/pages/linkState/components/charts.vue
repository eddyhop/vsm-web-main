<template>
  <div class="chart" :id="id" :data="data"></div>
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
  computed: {},
  methods: {
    drawLineGraph(id, data) {
      let _this = this;
      let myChart = document.getElementById(id);
      this.ChartLineGraph = this.$echarts.init(myChart);
      this.ChartLineGraph.setOption(data);
      window.addEventListener("resize", () => {
        _this.ChartLineGraph.resize();
      });
    },
  },
  created() {},
  mounted() {
    this.drawLineGraph(this.id, this.data);
    setTimeout(() => {
      this.ChartLineGraph.resize();
    }, 100);
  },
  watch: {
    data: {
      handler(newValue, oldValue) {
        this.drawLineGraph(this.id, newValue);
      },
      deep: true
    },
    id: {
      handler(newValue, oldValue) {
        this.drawLineGraph(newValue, this.data);
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