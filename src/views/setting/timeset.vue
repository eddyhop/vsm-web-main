<template>
  <div class="time">
    <div class="title">
      <h3>{{$t("timeSet.set")}}<img src="@/assets/icon_right@2x.png" alt=""/><span>{{$t("timeSet.zoneSet")}}</span></h3>
    </div>
    <div class="content">
      <h1>{{$t("timeSet.zoneSet")}}</h1>
      <div class="item">{{$t("timeSet.current")}}：{{Time}}</div>
      <div class="item">
        {{$t("timeSet.setZone")}}：
        <el-select filterable v-model="value" size="small">
          <el-option v-for="item in options" :key="item.value" :value="item.value"></el-option>
        </el-select>
      </div>
      <button v-debounce="setTime" class="save" v-control>{{$t('timeSet.OK')}}</button>
    </div>
  </div>
</template>
<script>
import { dateSet,dateGet } from "@/services";
export default {
  data() {
    return {
      Time: "",
      options: [
        {
          value: "GMT+1"
        },
        {
          value: "GMT+2"
        },
        {
          value: "GMT+3"
        },
        {
          value: "GMT+4"
        },
        {
          value: "GMT+5"
        },
        {
          value: "GMT+6"
        },
        {
          value: "GMT+7"
        },
        {
          value: "GMT+8"
        },
        {
          value: "GMT+9"
        },
        {
          value: "GMT+10"
        },
        {
          value: "GMT+11"
        },
        {
          value: "GMT+12"
        },
        {
          value: "GMT-1"
        },
        {
          value: "GMT-2"
        },
        {
          value: "GMT-3"
        },
        {
          value: "GMT-4"
        },
        {
          value: "GMT-5"
        },
        {
          value: "GMT-6"
        },
        {
          value: "GMT-7"
        },
        {
          value: "GMT-8"
        },
        {
          value: "GMT-9"
        },
        {
          value: "GMT-10"
        },
        {
          value: "GMT-11"
        },
        {
          value: "GMT-12"
        }
      ],
      value: "GMT+6"
    };
  },
  created() {
    this.getTime();
  },
  methods: {
    setTime() {
      let params = {
        timezone: this.value
      };
      dateSet(params).then(res => {
        // console.log(res)
        if (res.code == 10000) {
          this.$message({
            message: this.$t('timeSet.hint1'),
            type: "success"
          });
          // this.getTime()
          this.Time = res.result.vsmNow + (this.$t('timeSet.hint2'));
        }
      });
    },
    getTime() {
      let date = new Date();
      this.Time = date.toLocaleString();
      let params = {

      }
      dateGet().then(res=>{
        this.value = res.result[0]
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  flex: 1;
  background: white;
  margin-top: 20px;
  padding: 20px 30px;
  font-size: 16px;
  font-family: arial, sans-serif;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  button {
    font-size: 14px;
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    border: none;
    color: white;
    margin-top: 40px;
    margin-left: 86px;
  }
  .save:hover {
    background: rgba(96, 149, 214, 1);
  }
  .item {
    margin-top: 30px;
  }
  h1 {
    font-size: 18px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
}
.title {
  width: 100%;
  height: 62px;
  background: white;
  padding: 20px 30px;
  h3 {
      font-size: 15px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      span{
        font-size: 14px;
        line-height: 8px;
      }
      img{
        width:5px;
        height:8px;
        margin-left: 5px;
        margin-right: 5px;
      }
    }
}
.time {
  width: 100%;
  height: 100%;
  // background: white;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
}
</style>