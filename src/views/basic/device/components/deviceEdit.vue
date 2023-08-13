<template>
  <div class="editSb">
    <div :class="lang=='en' ? 'contEn cont' : 'cont'">
      <div class="title">
        {{$t('DeviceMan.editDev')}}
        <span @click.prevent="close"></span>
      </div>
      <div class="even">
        <el-form
          :model="from"
          :rules="rules"
          ref="form"
          label-width="auto"
          :inline="true"
          @submit.native.prevent
          onkeydown="if(event.keyCode==13) return false;"
        >
          <el-form-item :label="$t('DeviceMan.devName')" prop="input" style="margin-right:28px">
            <el-input style="width:500px" v-model="from.input" size="small"></el-input>
          </el-form-item>
          <el-form-item :label="$t('DeviceMan.remark')">
            <el-input style="width:500px" v-model="from.remark" size="small"></el-input>
          </el-form-item>
          <div class="contr">
            <button v-debounce="save" class="save">{{$t('DeviceMan.save')}}</button>
            <button @click.prevent="close" class="cancel">{{$t('DeviceMan.cancel')}}</button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { deviceSet, isNamExit } from "@/services";
import { country } from "@/utils/cities"; //地址数据 Address data
                                          // Address data
export default {
  data() {
    var checkName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("App.prompt3")));
      } else {
        if(this.devname!=value) {
          let params = {
            verifyName: value,
            verifyId: this.from.id,
            verifyScope: this.tenantId,
          };
          isNamExit(params).then((res) => {
            if (res.code == 10000) {
              callback();
            } else {
              callback(new Error(this.$t("TenDomain.hint8")));
            }
          });
        }else{
          callback();
        }
      }
    };
    return {
      lang: sessionStorage.getItem("lang") || "en",
      tenantId : sessionStorage.getItem("tenantValue"),
      cirtiesArr: [], //省的数据 Provincial data
                      // Provincial data
      country: country, //国家的数据 National data
                        // National data
      cities: [], //市的数据 The city of data
                  // The City of data
      distinctVos: [], //区县的数据 District and county data
                       // District and County Data
      longitude: "", //地理位置经度 Longitude of geographical location
                     // Geographical location Longitude of geographical location
      latitude: "", //地理位置纬度 Geographic latitude
                    // He has a Geographic latitude
      addressName: "", //地理位置名称 Geographic location name
                       // Geographic location Name
      addressCode: "", //地理位置区号 Area code of geographical location
                       // Area code of geographical location
      isCitiesChange: true,
      fullscreenLoading: false,
      devname:"",
     // type: JSON.parse(sessionStorage.getItem("userData")).type,
      from: {
        options: [],
        value: "",
        remark: "",
        deviceType: "",
        input: "",
        id: "",
        country: "", //国家 country
                     // State the country
        province: "", //省 province
                      // Province province
        cities: "", //市, city
                    // The city, city
        distinctVos: "", //区县 county
                         // Area county county
      },
      rules: {
        input: [
          {required: true, message: this.$t("App.prompt3"), trigger: "blur" },
          { validator: checkName, trigger: "blur" },
        ],
        value: [
          {
            required: true,
            message: this.$t("DeviceMan.choose"),
            trigger: "change",
          },
        ],
        // country: [
        //   {
        //     required: true,
        //     message: this.$t("DeviceMan.choose"),
        //     trigger: "change",
        //   },
        // ],
        // province: [
        //   {
        //     required: true,
        //     message: this.$t("DeviceMan.choose"),
        //     trigger: "change",
        //   },
        // ],
        // cities: [
        //   {
        //     required: true,
        //     message: this.$t("DeviceMan.choose"),
        //     trigger: "change",
        //   },
        // ],
        // distinctVos: [
        //   {
        //     required: true,
        //     message: this.$t("DeviceMan.choose"),
        //     trigger: "change",
        //   },
        // ],
      },
    };
  },
  methods: {
    async save(formName) {
      // const loading = this.$loading({
      //   lock: true,
      //   text: 'Loading',
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(176, 181, 194, 0.3)'
      // });
      // setTimeout(() => {
      //   loading.close();
      // }, 2000);

      await this.addressChange();
      let params = {
        id: this.from.id,
        deviceName: this.from.input,
        memo: this.from.remark,
        // tenantId: this.from.value,
        devCoordinate: this.longitude + "-" + this.latitude,
        // longitude: this.longitude,
        // latitude: this.latitude,
        devAddrName: this.addressName,
        devAddrCode: this.addressCode,
      };
      this.$refs[formName].validate((valid) => {
        if (valid) {
          deviceSet(params).then((res) => {
            //   console.log(res)
            if (res.code == 10000) {
              this.$message({
                message: res.message,
                type: "success",
              });
              this.close();
              this.$parent.getAllList();
            } else {
              this.$message({
                message: res.message,
                type: "warning",
              });
              this.close();
              this.$parent.getAllList();
            }
          });
        } else {
          return false;
        }
      });
    },
    close() {
      this.$parent.vsrShow = false;
      this.$refs.form.resetFields();
    },
    //选择国家
    // Choose the country
    //Choose the country
    async countryChange(val) {
      if (val == "中国") {
        this.isCitiesChange = false;
        let data = JSON.parse(sessionStorage.getItem("cityData"));
        this.cirtiesArr = JSON.parse(sessionStorage.getItem("cityData"));
        this.from.province = "110000";
        this.from.cities = "110000";
        this.cities = data[0].cityList;
        let distinctVosData =
          data[0].cityList[0] == null
            ? data[0].cityList[1].distinctVos
            : data[0].cityList[0].distinctVos;
        this.distinctVos = data[0].cityList[0].distinctVos;
        this.from.distinctVos = "110101";
      } else {
        this.from.province = "";
        this.from.cities = "";
        this.from.distinctVos = "";
        this.isCitiesChange = true;
      }
    },
    //选择省
    // Select the province
    //Select the province
    async provinceChange(val) {
      let data = JSON.parse(sessionStorage.getItem("cityData"));
      let cirtiesArr = this.cirtiesArr.find((item) => item.code == val);
      this.cities = cirtiesArr.cityList;
      this.from.cities = cirtiesArr.cityList[0].code;
      this.distinctVos = cirtiesArr.cityList[0].distinctVos;
      this.from.distinctVos = cirtiesArr.cityList[0].distinctVos[0].code;
    },
    //选择市
    // Select the city
    //Select the city
    async citiesChange(val) {
      let data = this.cities.find((item) => item.code == val);
      this.distinctVos = data.distinctVos;
      this.from.distinctVos = data.distinctVos[0].code;
    },
    //设备地址参数设置
    // Device address parameter setting
    //Device address parameter setting
    addressChange() {
      if (this.from.country == "中国") {
        let coord = this.distinctVos
          .find((item) => item.code == this.from.distinctVos)
          .location.split(",");
        let province = this.cirtiesArr.find(
          (item) => item.code == this.from.province
        ).regionName;
        let city = this.cities.find((item) => item.code == this.from.cities)
          .regionName;
        let distinctVos = this.distinctVos.find(
          (item) => item.code == this.from.distinctVos
        ).regionName;
        this.longitude = coord[0];
        this.latitude = coord[1];
        this.addressName =
          this.from.country + "-" + province + "-" + city + "-" + distinctVos;
        this.addressCode =
          "100000" +
          "-" +
          this.from.province +
          "-" +
          this.from.cities +
          "-" +
          this.from.distinctVos;
      } else {
        return;
      }
    },
  },
  created() {},
  mounted() {},
};
</script>
<style lang="scss" scoped>
.even {
  // width: 100%;
  padding: 30px 0 0 20px;
  //   width: 440px;
  //   margin: 0 auto;
  //   margin-top: 30px;
  //   margin-left: -15px;
  //   text-align: center;
  .a {
    div {
      width: 320px;
    }
  }
  .remaind {
    color: darkgray;
  }
  .contr {
    width: 100%;
    text-align: center;
    .save:hover {
      background: rgba(96, 149, 214, 1);
    }
  }
  .cancel {
    margin-left: 18px;
    background: rgba(255, 255, 255, 1);
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    border: 1px solid rgba(209, 215, 224, 1);
  }
  button {
    color: white;
    border: none;
    width: 100px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
  }
}
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
.cont {
  width: 631px;
  height: 327px;
  background: white;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -315.5px;
  margin-top: -163px;
  box-shadow: 0px 10px 20px 0px rgba(102, 102, 102, 0.1);
  border-radius: 7px;
  //   text-align: center;
}
.contEn {
  width: 655px;
}
.editSb {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 100;
  background: rgba(32, 42, 59, 0.2);
}
</style>
<style lang="scss">
.even {
  .el-form-item__label {
    // font-size: 20px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(63, 64, 72, 1);
  }
}
.editSb .even {
  .el-input {
    width: 198px;
    height: 34px;
    .el-input__inner {
      height: 100%;
      //   padding-left: 34px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
}
.editSb .even .address {
  margin-right: 10px;

  .el-input {
    width: 110px;
    height: 34px;
    // margin-right: 25px;
    .el-input__inner {
      height: 100%;
      //   padding-left: 34px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
  .el-select:last-of-type .el-input {
    margin-right: 0;
  }
}
.editSb .even .first {
  .el-input {
    width: 145px;
  }
}
.editSb .even .last {
  margin-right: 0;
}
</style>