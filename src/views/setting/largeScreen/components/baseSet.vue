<template>
  <!-- 基础设置 -->
  <div class="baseSet">
    <h3 class="Tit">
      <span>{{$t('newModel.large.basicSetting')}}</span>
      <div class="btns">
        <button @click="baseIsEdit=!baseIsEdit">
          <img src="@/assets/newPage/Icon-bianji@2x.png" alt />{{$t('newModel.edit')}}
        </button>
        <button v-debounce.prevent="submitForm">
          <img src="@/assets/newPage/Icon-baocun@2x.png" alt />{{$t('vsr1000.save')}}
        </button>
      </div>
    </h3>
    <div class="baseForm">
      <el-form
        :model="baseForm"
        :rules="baseRules"
        ref="form"
        label-width="auto"
        class="demo-ruleForm"
        :inline="true"
        :hide-required-asterisk="true"
        @submit.native.prevent
        :disabled="baseIsEdit"
      >
        <el-form-item :label="$t('newModel.large.BigTitle')" prop="titleName">
          <el-input v-model="baseForm.titleName" :placeholder="$t('newModel.large.msg1')"></el-input>
        </el-form-item>
        <!-- <el-form-item :label="$t('newModel.large.timeZone')" prop="timeZone">
          <el-select filterable v-model="baseForm.timeZone">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="地图层级" prop="indexMap">
          <el-select filterable v-model="baseForm.indexMap" @change="mapChange('top',baseForm.indexMap)">
            <el-option label="世界" :value="0"></el-option>
            <el-option label="国家" :value="1"></el-option>
            <el-option label="省" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下钻层级" prop="sonMap">
          <el-select filterable v-model="baseForm.sonMap" @change="mapChange('next',baseForm.sonMap)">
            <el-option label="国家" :value="1"></el-option>
            <el-option label="省" :value="2"></el-option>
            <el-option label="市" :value="3"></el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item :label="$t('newModel.large.corporateName')" prop="companyName">
          <el-input v-model="baseForm.companyName" :placeholder="$t('newModel.large.msg3')"></el-input>
        </el-form-item> -->
      </el-form>
    </div>
  </div>
</template>
<script>
import { vsmScreenSettingDaseSet } from "@/services";
export default {
  data() {
    return {
      //基础呢设置
      // Foundation setting
      baseForm: {
        titleName: "", //大屏标题
                       // Domestic title
        timeZone: "", //时区设置
                      // Time zone is set
        indexMap: 0, //地图层级
                     // Map hierarchy
        sonMap: 1, //下钻层级
                   // Drill down the hierarchy
        companyName: "" //公司名称
                        // The name of the company
      },
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
      baseIsEdit: true, //基础设置是否禁用
                        // Whether the base Settings are disabled
      baseRules: {
        titleName: [
          {
            required: true,
            message: this.$t('newModel.msg3'),
            trigger: "blur"
          },
          {
            max: 20,
            message: this.$t('newModel.large.msg1'),
            trigger: "blur"
          }
        ],
        timeZone: [
          {
            required: true,
            message: this.$t('newModel.msg4'),
            trigger: "change"
          }
        ],
        indexMap: [
          {
            required: true,
            message: this.$t('newModel.msg4'),
            trigger: "change"
          }
        ],
        sonMap: [
          {
            required: true,
            message: this.$t('newModel.msg4'),
            trigger: "change"
          }
        ],
        companyName: [
          {
            required: true,
            message: this.$t('newModel.msg3'),
            trigger: "blur"
          },
          {
            max: 20,
            message: this.$t('newModel.large.msg3'),
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            companyName: this.baseForm.companyName,
            id: "",
            indexMap: this.baseForm.indexMap,
            sonMap: this.baseForm.sonMap,
            tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId,
            timeZone: this.baseForm.timeZone,
            titleName: this.baseForm.titleName
          };
          vsmScreenSettingDaseSet(params).then(res => {
            if (res.code === 10000) {
              this.baseIsEdit = true;
              this.$parent.dataInit({
                tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId
              });
              this.$message({
                type: "success",
                message: this.$t('vsr1000.remind2[5]')
              });
            }
          });
        }
      });
    },
    //地图层级关联
    // Map hierarchy
    mapChange(tit, val) {
      if (tit == "top") {
        this.baseForm.sonMap = val == 0 ? 1 : val == 1 ? 2 : 3;
      } else {
        this.baseForm.indexMap = val == 1 ? 0 : val == 2 ? 1 : 2;
      }
    }
  }
};
</script>
<style scoped lang="scss">
.baseSet {
  width: 100%;
  background: #fff;
  padding: 18px 20px 0 30px;
  margin-top: 20px;
}
.Tit {
  width: 100%;
  zoom: 1;
  padding: 0 0 16px 0;
  &:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  span {
    float: left;
    font-size: 18px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    position: relative;
    padding-left: 6px;
  }
  span:after {
    content: "";
    position: absolute;
    top: 5px;
    left: 0px;
    width: 2px;
    height: 16px;
    background: rgba(54, 120, 200, 1);
  }
}
.btns {
  float: right;
  button {
    width: 80px;
    height: 34px;
    background: rgba(54, 120, 200, 1);
    border-radius: 7px;
    border: 0;
    outline: none;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    margin-left: 18px;
    img {
      width: 14px;
      height: 14px;
      margin-right: 6px;
      position: relative;
      top: 1px;
    }
  }
}
</style>
<style lang="scss">
.baseForm {
  .el-form-item__label {
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
  .el-input {
    width: 180px;
    height: 34px;
    .el-input__inner {
      height: 100%;
      border-radius: 7px;
    }
    .el-input__icon {
      line-height: normal;
    }
  }
  .el-form--inline {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-form-item {
      // padding-left: 30px;
      margin-right: 0;
      // flex:1;
      margin-bottom: 20px;
    }
  }
  .el-form--inline .el-form-item:last-of-type {
    // margin-bottom: 0;
  }
}
</style>