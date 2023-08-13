<template>
  <div class="ipsecTool">
    <!-- ipsecTool -->
    <div class="tableView">
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        stripe
        size="small"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column
          prop="vpn_name"
          :label="$t('vsr1100.diagnosticTools.ipsecName')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>

        <el-table-column
          prop="establish_time"
          :label="$t('vsr1100.diagnosticTools.ipsecLinkStatus')"
          show-overflow-tooltip
          :resizable="false"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import {
networkdiagnosisGetIpsec
} from "@/services";
export default {
  props: {},
  components: {},
  data() {
    return {
      devData:JSON.parse(this.$route.query.devData),
      tableData: [],
      mid: JSON.parse(this.$route.query.devData).deviceId,
    };
  },
  computed: {},
  methods: {
    //选择禁用 Choose to disable
    // Choose Choose to disable
    isDisabled(row) {
      if (row.dataFrom == 2) {
        return 0;
      } else {
        return 1;
      }
    },
    indexMethod(index) {
      return (
        index + 1 + (this.lNumber == 1 ? 0 : this.Size * (this.lNumber - 1))
      );
    },
    getList() {
      networkdiagnosisGetIpsec({devSerNum : this.devData.vsrSeries}).then(res => {
        this.tableData = res.result;
      });
    },

  },
  created() {
    this.getList();
  },
  mounted() {}
};
</script>
<style scoped lang="scss">
.ipsecTool {
  padding: 20px 30px;
  .edit {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(54, 120, 200, 1);
    border: none;
    background: none;
  }
}
.operate {
  text-align: right;
  button {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    color: white;
    border: none;
    outline: none;
    cursor: pointer;
  }
  .add:hover {
    background: rgba(96, 149, 214, 1);
  }
  img {
    width: 14px;
    height: 14px;
    position: relative;
    top: 2px;
  }
  .close {
    background: rgba(239, 239, 239, 1);
    border: 1px solid rgba(209, 215, 224, 1);
    color: rgba(51, 51, 51, 1);
    margin-left: 14px;
  }
}
.tableView {
  padding-top: 20px;
}
</style>