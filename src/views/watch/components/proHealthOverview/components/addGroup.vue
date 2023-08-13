<template>
  <div class="addGroup">
    <div class="content">
      <h4 class="title">
        <span>{{$t('vsr1000.addGroup')}}</span>
        <i class="close" @click="close"></i>
      </h4>
      <div class="event">
        <p class="devName">
          <span>{{devType}}</span>
          <span>{{$parent.deviceName}}</span>
          <span>{{$parent.deviceSeries}}</span>
        </p>
        <div class="groupLists">
          <!-- <el-checkbox-group v-model="checkList"> -->
          <p v-for="item in collectArr" :key="item.id">
            <span class="checkbox">
              <el-checkbox v-model="item.checked"></el-checkbox>
            </span>
            <el-input
              class="input-new-tag"
              v-if="item.inputVisible"
              v-model.trim="item.name"
              ref="saveTagInput"
              @keyup.enter.native="handleInputConfirm(item)"
              @blur="handleInputConfirm(item)"
              maxlength="10"
            ></el-input>
            <button v-else class="button-new-tag" @click="showInput(item)">{{item.name}}</button>
            <i class="del" @click="delGroup(item)"><img src="@/assets/newPage/shebeizonglan_fenzu_icon-trash@2x.png" alt=""></i>
          </p>
        </div>
        <div class="submit">
          <button class="newCollect" v-debounce="addCollect">{{$t('vsr1000.newFavorite')}}</button>
          <div>
            <button class="save" v-debounce="submitCollect">{{$t('vsr1000.save')}}</button>
            <button class="cancel" @click="close">{{$t('vsr1000.cancel')}}</button>
          </div>
        </div>
      </div>
      <delFavorite ref="delFavorite" v-show="delShow"/>
    </div>
  </div>
</template>
<script>
import {
  // getFavorite,
  addFavorite,
  changeFavorite,
  addFavoriteContent,
  getCheckFavorite, userInfo
} from "@/services";
import delFavorite from "./components/delFavorite"
import { join } from "path";
export default {
  props: {
    isShow: {
      type: Boolean
    }
  },
  components: {delFavorite},
  data() {
    var rule = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t("vsr1000.greRule[0]")));
      } else {
        callback();
      }
    };
    return {
      delShow:false,
      devType:"",
      collectArr: [
        {
          inputValue: "分组1",
          inputVisible: false,
          id: new Date() * 1,
          checked: false
        }
      ],
      //   inputVisible: false,
      //   inputValue: "",
      inpRule: [{ validator: rule, trigger: "blur" }],
      index: 1,
      finalNumber: 1,
      userId:""
    };
  },
  computed: {},
  methods: {
    //删除收藏夹
    // Delete favorites
    delGroup(row){
      this.delShow=true
      this.$refs.delFavorite.favoriteId = row.id
      this.$refs.delFavorite.dataInit()
    },
    //隐藏弹框
    // Hidden bounced
    close() {
      this.$parent.isShow = false;
    },
    //分组点击输入框获焦
    // Group click the input box to get focus
    showInput(item) {
      item.inputVisible = true;
      //   console.log(123);
      this.$nextTick(_ => {
        document.querySelector(".input-new-tag").children[0].focus();
        // this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //失去焦点隐藏输入框
    // Lose focus to hide input box
    handleInputConfirm(item) {
      let params = {
        id: item.id,
        name: item.name
      };
      changeFavorite(params).then(res => {});
      item.inputVisible = false;
    },
    //点击新增分组 
    // Click on New group
    addCollect() {
      // let finalNumber = null
      const reg = /新建分组[1-9]+$/;
      let newArr = this.collectArr
        .filter(favorite => null != favorite["name"].match(reg))
        .map(favorite => Number(favorite["name"].replace("新建分组", "")))
        .sort();
      let isChangeFinalNumber = false;
      for (let i = 1; i < newArr.length + 1; i++) {
        // console.log(i,newArr[i - 1])
        if (i != newArr[i - 1]) {
          this.finalNumber = i;
          isChangeFinalNumber = true;
          break;
        }
      }
      if (!isChangeFinalNumber && newArr.length) {
        this.finalNumber = newArr[newArr.length - 1] + 1;
      }
      this.collectArr.push({
        name: "新建分组" + this.finalNumber,
        inputVisible: false,
        id: new Date() * 1,
        checked: false
      });
      let params = {
        userId: this.userId ,
        name: "新建分组" + this.finalNumber,
        type: "device"
      };
      addFavorite(params).then(res => {
        if (res.code === 10000) {
          let params = {
            userId: this.userId ,
            position: this.$parent.type,
            deviceId: JSON.parse(this.$route.query.devData).deviceId
          };
          this.dataInit(params);
        }
      });
    },
    //新增分组
    // The new grouping
    //获取所有收藏夹
    // Get all favorites
    dataInit(params) {
      getCheckFavorite(params).then(res => {
        let result = res.result;
        result.forEach(item => {
          item.inputVisible = false;
        });
        this.collectArr = result;
      });
    },
    //保存收藏
    // Save the collection
    submitCollect() {
      let idArr = this.collectArr.filter(item => item.checked);
      let ids = idArr.map(item => item.id).join(",");
      // console.log(idArr,"123123",ids);
      let params = {
        favoriteId: ids,
        position: this.$parent.type,
        userId: this.userId ,
        deviceId: JSON.parse(this.$route.query.devData).deviceId,
        deviceType: this.devType == "vsr1000" ? "0001" : this.devType == "vsr100" ? "0002" : this.devType == "Cloud-vsr1000" ? "000106" : "000206" 
      };
      addFavoriteContent(params).then(res => {
        if (res.code === 10000) {
          this.$parent.isShow = false;
          this.$message({
            type: "success",
            message: this.$t("vsr1000.remind2[12]")
          });
        }
      });
    }
  },
  created() {
    userInfo().then(res => {
      this.userId = res.result.userId;
      this.devType = JSON.parse(this.$route.query.devData).deviceType
      let params = {
        userId: this.userId ,
        position: this.$parent.type,
        deviceId: JSON.parse(this.$route.query.devData).deviceId
      };
      this.dataInit(params);
    });
  },
  mounted() {}
};
</script>
<style scoped lang="scss">
.addGroup {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background:rgba(32,42,59,0.2);
  z-index: 1000;
  .content {
    width: 462px;
    // height: 654px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 15px 30px 0px rgba(191, 198, 217, 0.15);
    border-radius: 7px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    overflow: auto;
    .title {
      width: 100%;
      height: 48px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      border-bottom: 1px solid rgba(231, 231, 231, 1);
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      i {
        width: 14px;
        height: 14px;
        background: url("../../../../../assets/icon_close.png") no-repeat;
        background-size: cover;
        cursor: pointer;
      }
    }
  }
  .event {
    padding: 0 20px 30px 20px;
    .devName {
      padding: 20px 0;
      font-size: 14px;
      font-family: arial, sans-serif;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 14px;
      span {
        margin-right: 14px;
      }
      span:first-of-type {
        color: #3678c8;
      }
    }
    .groupLists {
      width: 100%;
      height: 180px;
      overflow: auto;
      border-radius: 7px;
      border: 1px solid rgba(209, 215, 224, 1);
      padding: 10px 10px;
      p {
        width: 100%;
        height: 26px;
        display: flex;
        align-items: center;
        .checkbox {
          padding-right: 10px;
        }
        .button-new-tag {
          width: 372px;
          border: 0;
          outline: none;
          background: #fff;
          text-align: left;
        }
        .input-new-tag {
          width: 372px;
        }
      }
    }
    .submit {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding-top: 30px;
      .newCollect {
        width: 110px;
        height: 34px;
        background: rgba(54, 120, 200, 1);
        border-radius: 7px;
        font-size: 14px;
        font-family: arial, sans-serif;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 20px;
        outline: none;
        border: 0;
        cursor: pointer;
      }
      .save {
        width: 100px;
        height: 34px;
        background: rgba(54, 120, 200, 1);
        border-radius: 7px;
        font-size: 14px;
        font-family: arial, sans-serif;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 20px;
        outline: none;
        border: 0;
        cursor: pointer;
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
        line-height: 20px;
        outline: none;
        cursor: pointer;
        margin-left: 18px;
      }
      .newCollect:hover,
      .save:hover {
        background: #6095d6;
      }
    }
  }
}
.del{
  cursor: pointer;
  display: inline-block;
  width: 15px;
  height: 15px;
  img{
    width: 100%;
    height: 100%;
  }
}
</style>
<style lang="scss">
.addGroup .groupLists {
  .el-input {
    width: 372px;
    height: 24px;
    .el-input__inner {
      height: 100%;
    }
  }
}
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background: #3678c8 !important;
  border-color: #3678c8 !important;
}
</style>