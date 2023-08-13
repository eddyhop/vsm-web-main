<template>
  <!--  -->
  <div class="addkeyPointLink">
    <div class="content">
      <div class="title">
        重点链路选择
        <span @click="close"></span>
      </div>
      <div class="devlist">
        <dl class="Transfer">
          <dt class="left">
            <div class="search">
              <i>
                <img src="@/assets/newPage/icon_search@2x.png" alt />
              </i>
              <el-input v-model="searchVal" placeholder="链路名称"></el-input>
            </div>
            <!-- <el-checkbox-group @change="pickDev" v-model="value" :max="5">
              <div class="devItem" v-for="item in data" :key="item">
                <el-checkbox :label="item">{{item}}</el-checkbox>
              </div>
            </el-checkbox-group>-->
            <el-tree
              class="filter-tree"
              :data="data"
              :props="defaultProps"
              show-checkbox
              :filter-node-method="filterNode"
              ref="tree"
              node-key="id"
              @check-change="treeChange"
              @check="astrictLink"
            ></el-tree>
          </dt>
          <dd class="right">
            <p>已选设备（{{data2.length}}/5）</p>
            <el-tree
              class="filter-tree"
              :data="data2"
              :props="defaultProps"
              show-checkbox
              ref="tree2"
              node-key="id"
              @check-change="treeClose"
              @check="astrictLink"
            ></el-tree>
            <!-- <el-checkbox-group @change="closeDev" v-model="value2" :max="5">
              <div class="devItem" v-for="item in value2" :key="item">
                <el-checkbox :label="item">{{item}}</el-checkbox>
              </div>
            </el-checkbox-group>-->
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
      data: [
        // {
        //   id: "1",
        //   label: "2",
        //   disabled: false,
        //   children: [
        //     {
        //       id: "3",
        //       label: "4"
        //     },
        //     {
        //       id: "5",
        //       label: "6"
        //     }
        //   ]
        // },
        // {
        //   id: "11",
        //   label: "21",
        //   disabled: false,
        //   children: [
        //     {
        //       id: "31",
        //       label: "41"
        //     },
        //     {
        //       id: "51",
        //       label: "61"
        //     }
        //   ]
        // },
        // {
        //   id: "12",
        //   label: "22",
        //   disabled: false,
        //   children: [
        //     {
        //       id: "32",
        //       label: "42"
        //     },
        //     {
        //       id: "52",
        //       label: "62"
        //     }
        //   ]
        // },
        // {
        //   id: "13",
        //   label: "23",
        //   disabled: false,
        //   children: [
        //     {
        //       id: "33",
        //       label: "43"
        //     },
        //     {
        //       id: "54",
        //       label: "64"
        //     }
        //   ]
        // },
        // {
        //   id: "15",
        //   label: "25",
        //   disabled: false,
        //   children: [
        //     {
        //       id: "35",
        //       label: "45"
        //     },
        //     {
        //       id: "55",
        //       label: "65"
        //     }
        //   ]
        // },
        // {
        //   id: "16",
        //   label: "26",
        //   disabled: false,
        //   children: [
        //     {
        //       id: "36",
        //       label: "46"
        //     },
        //     {
        //       id: "56",
        //       label: "66"
        //     }
        //   ]
        // },
        // {
        //   id: "17",
        //   label: "27",
        //   disabled: false,
        //   children: [
        //     {
        //       id: "37",
        //       label: "47"
        //     },
        //     {
        //       id: "57",
        //       label: "67"
        //     }
        //   ]
        // }
      ],
      filterArr: [],
      data2: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      checkedChild: [],
      searchVal: ""
    };
  },
  computed: {},
  watch: {
    searchVal(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    //数据初始化
    // Data initialization
    dataInit(list) {
      let arr = [];
      if (list.length) {
        for (let i in list) {
          arr.push({
            id: list[i].id,
            label: list[i].linkName,
            disabled: false,
            children: [
              {
                id: list[i].deviceSeriesOne,
                label: list[i].deviceSeriesOne
              },
              {
                id: list[i].deviceSeriesTwo,
                label: list[i].deviceSeriesTwo
              }
            ]
          });
        }
      }
      screenSettingGetTenantDevAndLinks({
        tenantId:JSON.parse(sessionStorage.getItem("userData")).type==1? sessionStorage.getItem("tenantValue") ? sessionStorage.getItem("tenantValue") : '':  JSON.parse(sessionStorage.getItem("userData")).tenantId
      }).then(res => {
        if (res.code === 10000) {
          this.data = res.result.links.map(item => {
            return {
              id: item.id,
              label: item.name.split(",")[0],
              disabled: false,
              children: [
                {
                  id: item.name.split(",")[1],
                  label: item.name.split(",")[1]
                },
                {
                  id: item.name.split(",")[2],
                  label: item.name.split(",")[2]
                }
              ]
            };
          });
          this.data2 = arr;
          this.$refs.tree2.setCheckedKeys(arr.map(item => item.id));
          this.$refs.tree.setCheckedKeys(arr.map(item => item.id));
        }
      });
    },
    //模糊查询
    // Fuzzy query
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    //重点链路选中
    // Key link selection
    async treeChange(val, checked, child) {
      if (checked && val.hasOwnProperty("children") && this.data2.length < 5) {
        await this.data2.push(val);
        this.$refs.tree2.setCheckedKeys(
          this.data2
            .map(item => item.id)
            .concat(...this.data2.map(item => item.children.map(el => el.id)))
        );
      } else if (!checked && val.hasOwnProperty("children")) {
        var index;
        for (let i = 0; i < this.data2.length; i++) {
          if (this.data2[i].id == val.id) {
            index = i;
          }
        }
        this.data2.splice(index, 1);
      }
    },
    //限制添加个数
    // Limit the number of additions
    astrictLink() {
      if (this.data2.length > 4) {
        let ids = this.data2.map(item => {
          return item.id;
        });
        this.data.forEach((item, index) => {
          if (!ids.includes(item.id)) {
            item.disabled = true;
          } else {
            item.disabled = false;
          }
        });
      } else {
        this.data.forEach((item, index) => {
          item.disabled = false;
        });
      }
    },
    //取消选中重点链路
    // Deselect key links
    treeClose(val, checked, child) {
      if (!checked) {
        this.$refs.tree.setChecked(val.id, false);
      }
    },
    //模糊查询
    // Fuzzy query
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    //提交
    // submit
    submitForm() {
      // this.$parent.keyPointlinks.push({
      //   linkName: "链路动力A",
      // LinkName: "Link Power A",
      //   deviceSeriesOne: "2",
      //   deviceSeriesTwo: "2123123"
      // });
      this.$parent.keyPointlinks = this.data2.map(item => {
        return {
          id: item.id,
          linkName: item.label,
          deviceSeriesOne: item.children[0].label,
          deviceSeriesTwo: item.children[1].label
        };
      });
      this.close();
    },
    //关闭弹框
    // Close the bounced
    close() {
      this.$parent.linkShow = false;
    }
  }
};
</script>
<style scoped lang="scss">
.addkeyPointLink {
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
  .save:hover {
    background: #6095d6;
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
</style>
<style lang="scss">
.addkeyPointLink .left {
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
.addkeyPointLink .el-tree-node__content {
  span:last-of-type {
    display: inline-block;
    max-width: 195px;
    font-size: 14px;
    font-family: arial, sans-serif;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.addkeyPointLink .el-tree-node__children {
  .el-checkbox {
    display: none;
  }
}
</style>