<template>
  <div class="content">
    <!-- //紧急 -->
    <div class="every">
      <div class="up">
        <div class="left">{{$t("Alarm.urgency")}}({{$t('Alarm.strip')}})</div>
        <div class="right">
          <!-- <p>{{$t('Alarm.pending')}}</p>
          <i :style="{'opacity':one=='+'?'1':'0'}">
            <img src="@/assets/monitoring_icon_severity_up.png" alt />
          </i> -->
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('Alarm.pending')"
            placement="bottom"
          >
            <!-- <span class="top">{{$t('Upgrade.bandwidth')}}</span> -->
            <p class="completion">{{$t('Alarm.pending')}}</p>
          </el-tooltip>
          <span>{{infor.unprocessedEmergencyNum || 0}}</span>
        </div>
      </div>
      <div class="down">
        <span>
          <img src="@/assets/monitoring_icon_severity.png" alt />
        </span>
        <i :style="{'opacity':infor.unprocessedEmergencyNum?'1':'0'}">
          <!-- <img src="@/assets/monitoring_icon_severity_up.png" alt /> -->
        </i>
        <span class="num">{{infor.unprocessedEmergencyNum || 0}}</span>
      </div>
    </div>
    <!-- 严重 -->
    <div class="every">
      <div class="up">
        <div class="left">{{$t('Alarm.serious')}}({{$t('Alarm.strip')}})</div>
        <div class="right">
          <!-- <p>{{$t('Alarm.pending')}}</p>
          <i :style="{'opacity':two=='+'?'1':'0'}">
            <img src="@/assets/monitoring_icon_severity_up.png" alt />
          </i> -->
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('Alarm.pending')"
            placement="bottom"
          >
            <!-- <span class="top">{{$t('Upgrade.bandwidth')}}</span> -->
            <p class="completion">{{$t('Alarm.pending')}}</p>
          </el-tooltip>
          <span>{{infor.unprocessedImportantNum || 0}}</span>
        </div>
      </div>
      <div class="down">
        <span>
          <img src="@/assets/monitoring_icon_ordinary.png" alt />
        </span>
        <i :style="{'opacity':infor.unprocessedImportantNum?'1':'0'}">
          <!-- <img src="@/assets/monitoring_icon_severity_up.png" alt /> -->
        </i>
        <span class="num">{{infor.unprocessedImportantNum || 0}}</span>
      </div>
    </div>
    <!-- 一般 -->
    <div class="every">
      <div class="up">
        <div class="left">{{$t('Alarm.normal')}}({{$t('Alarm.strip')}})</div>
        <div class="right">
          <!-- <p>{{$t('Alarm.pending')}}</p>
          <i :style="{'opacity':three=='+'?'1':'0'}">
            <img src="@/assets/monitoring_icon_severity_up.png" alt />
          </i> -->
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('Alarm.pending')"
            placement="bottom"
          >
            <!-- <span class="top">{{$t('Upgrade.bandwidth')}}</span> -->
            <p class="completion">{{$t('Alarm.pending')}}</p>
          </el-tooltip>
          <span>{{infor.unprocessedGeneralNum || 0}}</span>
        </div>
      </div>
      <div class="down">
        <span>
          <img src="@/assets/onitor_alarm_icon_yiban.png" width="50px" height="50px" alt />
        </span>
        <i :style="{'opacity':infor.unprocessedGeneralNum?'1':'0'}">
          <!-- <img src="@/assets/monitoring_icon_severity_up.png" alt /> -->
        </i>
        <span class="num">{{infor.unprocessedGeneralNum || 0}}</span>
      </div>
    </div>
    <!-- 已处理 -->
    <div class="every">
      <div class="up">
        <div class="left">{{$t('Alarm.processed')}}({{$t('Alarm.strip')}})</div>
        <div class="right">
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('Alarm.completion')"
            placement="bottom"
          >
            <!-- <span class="top">{{$t('Upgrade.bandwidth')}}</span> -->
            <p class="completion">{{$t('Alarm.completion')}}</p>
          </el-tooltip>
          <!-- <p>{{$t('Alarm.completion')}}</p> -->
          <span class="per">{{completion || 0}}</span>
        </div>
      </div>
      <div class="down">
        <span>
          <img src="@/assets/monitoring_icon_finish.png" alt />
        </span>
        <i :style="{'opacity':four=='+'?'1':'0'}">
          <img src="@/assets/monitoring_icon_finish_down.png" alt />
        </i>
        <span class="num">{{infor.dealNum || 0}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { getTypeInfoNum } from "@/services/index.js";
export default {
  data() {
    return {
      one:"",
      two:"",
      three:"",
      four:"",
      completion: "",
      infor: {
        dealNum: "",
        generalNum: "",
        importantNum: "",
        unprocessedGeneralNum: "",
        unprocessedImportantNum: ""
      }
    };
  },
  props: ["alarm"],
  watch: {
    alarm: {
      handler: function(newVal, oldVal) {
        this.completion = newVal.completion;
        this.infor = newVal.infor;
        this.one = newVal.one;
        this.two = newVal.two;
        this.three = newVal.three;
        this.four = newVal.four;
      },
      deep: true
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-family: arial, sans-serif;
  font-weight: 400;
  box-sizing: border-box;
  margin-top: 20px;
  .every {
    width: 24.1%;
    height: 134px;
    background: #fff;
    padding: 16px 20px 0px;
    border-top: 2px solid #ba2727;
    border-radius: 7px;
    .up {
      display: flex;
      justify-content: space-between;
      .left {
        font-size: 16px;
        color: rgba(0, 0, 0, 1);
        line-height: 22px;
      }
      .right {
        display: flex;
        p {
          font-size: 16px;
          color: rgba(0, 0, 0, 1);
          line-height: 22px;
        }
        span {
          font-size: 16px;
          color: rgba(186, 39, 39, 1);
          line-height: 22px;
          margin-left: 6px;
        }
      }
    }
    .down {
      margin-top: 21px;
      margin-bottom: 24px;
      padding-left: 50px;
      display: flex;
      align-items: center;
      i {
        // width: 9px;
        // height: 16px;
        margin: 0 12.67px 0 22.68px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .num {
        font-size: 30px;
        color: rgba(0, 0, 0, 1);
        line-height: 42px;
      }
    }
  }
  .every:nth-child(1) {
    border-top-color: #ba2727;
  }
  .every:nth-child(2) {
    border-top-color: #d89012;
  }
  .every:nth-child(3) {
    border-top-color: #3678C8;
    .per {
      color: #3678C8 !important;
    }
  }
  .every:nth-child(4) {
    border-top-color: #029805;
    .per {
      color: #029805 !important;
    }
  }
}
.completion {
  width: 60px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: inline-block;
  text-align: right;
}
</style>