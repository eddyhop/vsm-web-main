<template>
  <!--  -->
  <div class="addkeyPointDevice">
    <div class="content">
      <div class="title">
        重点设备选择
        <span @click="close"></span>
      </div>
      <div class="devlist">
        <dl class="Transfer">
          <dt class="left">
            <div class="search">
              <i>
                <img src="@/assets/newPage/icon_search@2x.png" alt />
              </i>
              <el-input v-model="searchVal" @input="searchDev(searchVal)" placeholder="设备名称"></el-input>
            </div>
            <el-checkbox-group @change="pickDev" v-model="value" :max="5">
              <div class="devItem" v-for="item in data" :key="item.id">
                <el-checkbox :label="item.id+','+item.name">
                  <span class="devName">
                    <b>{{item.name.split(",")[0]}}</b>
                    <i>{{item.name.split(",")[1]}}</i>
                  </span>
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </dt>
          <dd class="right">
            <p>已选设备（{{value2.length}}/5）</p>
            <el-checkbox-group @change="closeDev" v-model="value2" :max="5">
              <div class="devItem" v-for="item in value2" :key="item">
                <el-checkbox :label="item">
                  <span class="devName">
                    <b>{{item.split(",")[1]}}</b>
                    <i>{{item.split(",")[2]}}</i>
                  </span>
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </dd>
        </dl>
        <div class="submit">
          <button class="save" type="primary" v-debounce.prevent="submitForm">{{$t('vsr1000.save')}}</button>
          <button class="cancel" @click.prevent="close">{{$t('vsr1000.cancel')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { screenSettingGetTenantDevAndLinks } from "@/services";
export default {
  data() {
    return {
      data: [],
      data2: [],
      value: [],
      value2: [],
      searchVal: ""
    };
  },
  methods: {
    //数据初始化
    // Data initialization
    dataInit(list) {
      screenSettingGetTenantDevAndLinks({ tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId }).then(
        res => {
          if (res.code === 10000) {
            this.data = res.result.devices;
            this.data2 = res.result.devices;
          }
        }
      );
      this.value = this.value2 = list.map(item => {
        return item.id + "," + item.deviceName + "," + item.deviceSeries;
      });
      
    },
    //选中设备
    // The selected device
    pickDev(data) {
      console.log(data, this.value);
      this.value2 = data;
    },
    //取消选中设备
    // Unchecked device
    closeDev(data) {
      console.log(data, "123123");
      this.value = data;
    },
    //模糊搜索
    // Fuzzy search
    searchDev(val) {
      if (val.length) {
        this.data = this.data.filter(this.createFilter(val));
      } else {
        this.data = this.data2;
      }
    },
    //模糊查找
    // Fuzzy search
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.name
            .replace(",", "")
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) !== -1
        );
      };
    },
    //提交
    // submit
    submitForm() {
      this.$parent.keyPointDevs = this.value2.map(item => {
        return {
          id: item.split(",")[0],
          deviceName: item.split(",")[1],
          deviceSeries: item.split(",")[2]
        };
      });
      this.close();
    },
    //关闭弹框
    // Close the bounced
    close() {
      this.$parent.devShow = false;
    }
  }
};
</script>
<style scoped lang="scss">
.addkeyPointDevice {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 9;
  background: rgba(32, 42, 59, 0.2);
}
.content {
  width: 607px;
  height: 502px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -251px;
  margin-left: -303.5px;
  display: flex;
  flex-direction: column;
  .title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    width: 100%;
    border-bottom: 1px solid rgba(231, 231, 231, 1);
    padding: 15px;
    span {
      display: inline-block;
      width: 14px;
      height: 14px;
      background-image: url("../../../../assets/icon_close.png");
      background-size: 14px 14px;
    }
  }
}
.devlist {
  flex: 1;
  padding: 30px;
}
.Transfer {
  width: 100%;
  height: 329px;
  background: rgba(255, 255, 255, 1);
  border-radius: 7px;
  border: 1px solid rgba(209, 215, 224, 1);
  display: flex;
  .left,
  .right {
    flex: 1;
    overflow: auto;
  }
  .left::-webkit-scrollbar,
  .right::-webkit-scrollbar {
    width: 4px;
    /*height: 4px;*/
  }
  .left::-webkit-scrollbar-thumb,
  .right::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }
  .left::-webkit-scrollbar-track,
  .right::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }
  .left {
    border-right: 1px solid rgba(209, 215, 224, 1);
    padding: 20px 20px 0 20px;
  }
  .right {
    padding: 27px 20px 0 20px;
    p {
      padding-bottom: 14px;
    }
  }
}
.search {
  padding-bottom: 14px;
  position: relative;
  i {
    width: 16px;
    height: 16px;
    position: absolute;
    top: 9px;
    left: 10px;
    z-index: 100;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.devItem {
  padding-bottom: 12px;
}
.submit {
  width: 100%;
  text-align: center;
  padding-top: 30px;
  .save {
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    outline: none;
    border: 0;
    cursor: pointer;
    margin-left: 18px;
  }
  .cancel {
    width: 70px;
    height: 34px;
    background: rgba(255, 255, 255, 1);
    border-radius: 7px;
    border: 1px solid rgba(209, 215, 224, 1);
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    margin-left: 18px;
  }
}
.devName {
  zoom: 1;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  b,
  i {
    float: left;
    max-width: 103px;
    font-style: normal;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  b {
    padding-right: 10px;
  }
}
</style>
<style lang="scss">
.addkeyPointDevice .left {
  .el-input {
    width: 100%;
    height: 34px;
    .el-input__inner {
      height: 100%;
      padding-left: 34px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
}
.addkeyPointDevice .el-checkbox{
  display: flex;
  align-items: center;
}
</style>