<template>
          <div class="addStatic">
            <div class="context">
              <div class="title">
                {{$t('subscription.vpns.editClientVPN')}}
                <span class="close" @click="close"></span>
              </div>
              <div class="item" :style="lang=='en'?'':'marginLeft:70px'">
                <el-form
                    :model="form"
                    :rules="rules"
                    ref="form"
                    label-width="auto"
                    :inline="true"
                    class="demo-ruleForm"
                    @submit.native.prevent
                >
                  <el-form-item :label="$t('subscription.vpns.name')" prop="vpnName">
                    <div class="item-ipt">
                      <el-input
                          v-model="form.vpnName"
                          :placeholder="$t('subscription.vpns.name')"
                          size="small"
                      ></el-input>
                    </div>
                  </el-form-item>
                  <el-form-item :label="$t('subscription.vpns.description')" prop="vpnDes">
                    <div class="item-ipt">
                      <el-input
                          v-model="form.vpnDes"
                          :placeholder="$t('subscription.vpns.description')"
                          size="small"
                      ></el-input>
                    </div>
                  </el-form-item>

                  <el-form-item :label="$t('subscription.vpns.secureVPN')" prop="secure">
                    <div class="item-ipt">
                      <el-checkbox v-model="form.secure" @change="ckebox()" >{{$t('subscription.vpns.secureVPN')}}</el-checkbox>
                    </div>
                  </el-form-item>

                  <el-form-item :label="$t('subscription.vpns.logicalInterface')" prop="logId">
                    <div class="item-ipt">
                      <el-select filterable v-model="form.logId" size="small"  @change="changePort()">
                        <el-option
                            v-for="item in port"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                      </el-select>
                    </div>
                  </el-form-item>
                  <el-form-item :label="$t('subscription.vpns.vpnEndpointIPAddress')" prop="ip">
                    <div class="item-ipt">
                      <el-select filterable v-model="form.ip" size="small">
                        <el-option
                            v-for="item in ipv4"
                            :key="item.name"
                            :label="item.name"
                            :value="item.name"
                        ></el-option>
                      </el-select>
                    </div>
                  </el-form-item>
                  <!--
                  <el-form-item :label="$t('subscription.vpns.mobileClientPool')" prop="mobileClientPool">
                    <div class="item-ipt">
                      <el-select filterable v-model="form.mobileClientPool" size="small">
                        <el-option
                            v-for="item in pools"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                      </el-select>
                    </div>
                  </el-form-item>
                  --->
                  <div class="contr">
                    <button type="primary" v-debounce="save" class="save">{{$t('subscription.save')}}</button>
                    <button @click.prevent="close" class="cancel">{{$t('subscription.cancel')}}</button>
                  </div>
                </el-form>
              </div>
            </div>
          </div>
        </template>
        <script>
        import {
          getVpnForLogicPort,
          saveClientVpn,
          tenantServiceGetOptions
        } from "@/services";
          export default {
            data() {
              return {
                deviceId:JSON.parse(this.$route.query.devData).deviceId,
                lang: sessionStorage.getItem("lang") || "en",
                tenantId: sessionStorage.getItem("tenantValue") ,
                form: {
                  ip: "",
                  mobileClientPool:"",
                  vpnName: "",
                  vpnDes: "",
                  secure: true,
                  logId: "",
                  id:"",
                },
                pools:[],
                port:[],
                ipv4:[],
                rules: {
                  vpnName: [
                    {
                      required: true,
                      message: this.$t("subscription.vpns.remind[0]"),
                      trigger: "blur"
                    }
                  ],
                  logId:[
                    {
                      required: true,
                      message: this.$t("subscription.vpns.remind[1]"),
                      trigger: "change"
                    }
                  ],
                  ip:[
                    {
                      required: true,
                      message: this.$t("subscription.vpns.remind[7]"),
                      trigger: "change"
                    }
                  ]
                }
              };
            },
            methods: {
              close() {
                this.$parent.editclientVPNsShow = false;
                this.$refs.form.resetFields();
              },
              ckebox(){
                this.form.secure = true
              },
              changePort(){
                this.form.ip=[];
                getVpnForLogicPort({id:this.form.logId}).then(res =>{
                  this.ipv4 = res.result;
                });
              },
              save(formName) {
                this.form.secure = true
                let params = {
                  id:this.form.id,
                  ip:this.form.ip,
                  vpnName: this.form.vpnName,
                  vpnDes: this.form.vpnDes,
                  secure: this.form.secure,
                  logId: this.form.logId,
                  tenantId:this.tenantId,
                  deviceId:this.deviceId,
                };

                this.$refs[formName].validate(valid => {
                  if (valid) {
                    saveClientVpn(params).then(res => {
                      // console.log(res)
                      if (res.code == 10000) {
                        this.$message({
                          message: this.$t("subscription.vpns.remind[10]"),
                          type: "success"
                        });
                        this.close();
                        this.$parent.getClinetVpnList();
                      } else {
                        this.$message.error(this.$t("subscription.vpns.remind[12]"));
                      }
                    });
                  } else {
                    return false;
                  }
                });
              },
              getdic(){
                tenantServiceGetOptions({deviceId:this.deviceId}).then(res=>{
                  this.port = res.result.port;
                  this.pools = res.result.pool;
                });
              }
            },
            created() {
              this.getdic();
            }
          };
        </script>
        <style lang="scss" scoped>
          .item-ipt {
            width: 320px;
          }
          .item {
            margin-top: 10px;
            padding: 10px;
            .contr {
              // margin-left: 80px;
              text-align: center;
              margin-bottom: 28px;
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
            .save:hover {
              background: rgba(96, 149, 214, 1);
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
          }
          .context {
            width: 620px;
            // height: 387px;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 15px 30px 0px rgba(191, 198, 217, 0.15);
            border-radius: 7px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            overflow: auto;
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
                background-image: url("../../../../../../assets/icon_close.png");
                background-size: 14px 14px;
              }
            }
          }
          .addStatic {
            width: 100%;
            height: 100%;
            position: fixed;
            top: 0;
            left: 0;
            background: rgba(32, 42, 59, 0.2);
            z-index: 100;
          }
        </style>
        <style lang="scss">
          .addStatic {
            .el-select {
              width: 100%;
              height: 32px;
              .el-input {
                height: 100%;
                .el-input__inner {
                  height: 100%;
                }
                .el-input__icon {
                  line-height: normal;
                }
              }
            }
          }
        </style>
