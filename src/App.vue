<template>
  <div style="display: flex;justify-content:center">
    <div style="z-index:99999" @click="canvasShow">canvas显示</div>
     <VuePictureVerify :show="canShow"  ></VuePictureVerify>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        canShow:false
      }
    },
    methods:{
      canvasShow(){
         this.canShow=!this.canShow
      },
      handleSuccess(){
       console.log('成功')
      },
      handleFail(){
       console.log('失败')
      }
    }
  }
</script>
<style>
</style>