<template>
    <div class="addPz">
        <div class="cont">
            <h3>{{$t('File.hint4')}}</h3>
            <div class="fileName">{{this.$parent.input}}</div>
            <div class="btn">
                <button v-debounce="save">{{$t('File.ok')}}</button>
                <button @click="close">{{$t('File.cancel')}}</button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            obj:{}
        }
    },
    methods:{
        save(){
            this.close()
            this.$parent.submitUpload(this.obj)
        },
        close(){
            this.$parent.flag = false
        }
    }
}
</script>
<style lang="scss" scoped>
.btn{
    position: absolute;
    bottom: 30px;
    transform: translate(40%,0%);
    button{
        width:100px;
        height:34px;
        background:rgba(54,120,200,1);
        border-radius:2px;
        font-size:14px;
        font-family:arial, sans-serif;
        font-weight:400;
        color:rgba(255,255,255,1);
        border: none;
        margin-right: 18px;
    }
    button:nth-of-type(2){
        width:70px;
        height:34px;
        background:rgba(255,255,255,1);
        color:rgba(102,102,102,1);
        border-radius:2px;
        border:1px solid rgba(209,215,224,1);
    }
}
.fileName{
    width: 366px;
    font-size:14px;
    margin-top: 10px;
    margin-bottom: 10px;
    text-align: center
}
.cont{
    width:404px;
    height:215px;
    background: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 7px;
    text-align: center;
    padding: 30px;
    position: relative;
    h3{
        font-size:16px;
        font-family:arial, sans-serif;
        font-weight:400;
        color:rgba(51,51,51,1);
        line-height:22px;
    }
}
.addPz{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    z-index: 9;
    background:rgba(32,42,59,0.2);
}
</style>