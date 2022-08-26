<template>
  <div :class="['canvas-body', { 'canvas-show': show }]">
    <div class="canvas-box" @mousedown.stop @touchstart.stop>
      <div class="vue-picture-canvas">
        <svg @click="handlereset" class="vue-picture-reset" width="30" height="30" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.2721 36.7279C14.5294 39.9853 19.0294 42 24 42C33.9411 42 42 33.9411 42 24C42 14.0589 33.9411 6 24 6C19.0294 6 14.5294 8.01472 11.2721 11.2721C9.61407 12.9301 6 17 6 17" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 9V17H14" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <canvas ref="tutorial" style="border:1px solid #ccc" width="300" height="150"></canvas>
        <canvas ref="moveCanvas" class="moveCanvas" width="60" :style="{ transform: `translateX(${moveX}px)` }"
          height="150"></canvas>
        <div v-if="loading" class="vue-picture-loading">
           <div class="loader"></div>
        </div>
      </div>
      <div class="slider-box" ref="slider">
        <div :class="['slider-fill',{'verify-success':status,'verify-error':status===false}]" :style="{'width':`${moveX}px`}"></div>
        <div :class="['slider-main',{'verify-success':status,'verify-error':status===false}]" :style="{ transform: `translateX(${moveX}px)` }" @mousemove.prevent="onRangeMouseMove"
          @mouseup="handleMouseup" @touchmove.prevent="onRangeMouseMove($event)"
          @mousedown="onRangeMouseDown($event)" @touchstart="onRangeMouseDown($event)" @touchend="handleMouseup">
          <svg v-if="status === null" width="30" height="30" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12L24 24L12 36" stroke="#333" stroke-width="1" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M24 12L36 24L24 36" stroke="#333" stroke-width="1" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
          <svg v-if="status" width="30" height="30" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 24L9 19L19 29L39 9L44 14L19 39L4 24Z" fill="#ffffff" stroke="#ffffff" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <svg width="35" v-if="status === false" height="35" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 11L11 6L24 19L37 6L42 11L29 24L42 37L37 42L24 29L11 42L6 37L19 24L6 11Z" fill="#ffffff" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <span class="slider-text">请<span style="color:#e68045;">拖动</span>左侧滑块将图片还原</span>
      </div>
    </div>
    
  </div>
</template>

<script >
export default {
  props: {
    accuracy: {  // 精度
      type: Number,
      default: 5
    },
    show: {
      type: Boolean,
      defalut: false
    },
    imgList:{
      type: Array,
      defalut: ()=>([])
    },
    originImg:{
      type: String,
      default: "https://picsum.photos/300/150/",
      required: false
    }
  },
  mounted () {
    this.arcInit()
  },
  data () {
    return {
      pinX: 0,//缺口的x轴
      pinY: 0,//缺口的Y轴
      puzzleScale: 15,
      width: 320,
      height: 160,
      blockSize: 50,
      radius: 10,
      startX: 0,
      clientX: 0,
      moveX: 0,
      moveFlag: false,
      loading:false,
      sliderMianWidth: 0,
      status:null
    }
  },
  computed: {
  },
  methods: {
     handlereset () {
      // this.newInit()
      this.status=null
      this.moveFlag=false
      this.startX=0
      this.clientX=0
      this.moveX=0

      this.arcInit()
    },
    getRandom (min, max) {
      return Math.ceil(Math.random() * (max - min) + min);
    },
    paint (ctx, moveL) {
      ctx.beginPath();
      ctx.moveTo(this.pinX, this.pinY);
      ctx.lineTo(this.pinX + moveL, this.pinY);
      ctx.arcTo(
        this.pinX + moveL,//弧的起点的 x 坐标。
        this.pinY - moveL / 2, //弧的起点的 y 坐标。
        this.pinX + moveL + moveL / 2,//弧的终点的 x 坐标。
        this.pinY - moveL / 2, //弧的终点的 y 坐标。
        moveL / 2 // 弧的半径。
      );
      ctx.arcTo(
        this.pinX + moveL + moveL,
        this.pinY - moveL / 2,
        this.pinX + moveL + moveL,
        this.pinY,
        moveL / 2
      );
      ctx.lineTo(this.pinX + moveL + moveL + moveL, this.pinY);
      ctx.lineTo(this.pinX + moveL + moveL + moveL, this.pinY + moveL);
      ctx.arcTo(
        this.pinX + moveL + moveL + moveL + moveL / 2,
        this.pinY + moveL,
        this.pinX + moveL + moveL + moveL + moveL / 2,
        this.pinY + moveL + moveL / 2,
        moveL / 2
      )
      ctx.arcTo(
        this.pinX + moveL + moveL + moveL + moveL / 2,
        this.pinY + moveL + moveL,
        this.pinX + moveL + moveL + moveL,
        this.pinY + moveL + moveL,
        moveL / 2
      );
      ctx.lineTo(
        this.pinX + moveL + moveL + moveL,
        this.pinY + moveL + moveL + moveL
      );
      ctx.lineTo(this.pinX, this.pinY + moveL + moveL + moveL);
      ctx.lineTo(this.pinX, this.pinY + moveL + moveL);

      ctx.arcTo(
        this.pinX + moveL / 2,
        this.pinY + moveL + moveL,
        this.pinX + moveL / 2,
        this.pinY + moveL + moveL / 2,
        moveL / 2
      );
      ctx.arcTo(
        this.pinX + moveL / 2,
        this.pinY + moveL,
        this.pinX,
        this.pinY + moveL,
        moveL / 2
      );
      ctx.lineTo(this.pinX, this.pinY);
    },
    onRangeMouseDown (e) {
      e.preventDefault();
      this.moveFlag = true
      this.startX = e.clientX || e.changedTouches[0].clientX;
      this.clientX = e.clientX || e.changedTouches[0].clientX;
      this.sliderMianWidth = this.$refs.slider.clientWidth
    },
    onRangeMouseMove (e) {
      if (this.moveFlag) {
        const movex = (e.clientX || e.changedTouches[0].clientX) - this.startX
        this.moveX = (movex > 0 ? movex >= this.sliderMianWidth - this.blockSize ? this.sliderMianWidth - this.blockSize : movex : 0)
      }

    },
    handleMouseup () {
      if (this.moveFlag) {
        this.moveFlag = false
        this.verify()
      }
    },
    verify () {
      const x = Math.abs(this.pinX - this.moveX)
      if(x > this.accuracy){
        //失败
        this.status=false
        this.$emit('fail')
        setTimeout(()=>{
          this.handlereset()
        },1000)
      }else{
       // 成功
        this.status=true 
         this.$emit('success')
      }
    },
    arcInit () {
      this.loading=true
      const canvas = this.$refs.tutorial //主图canvas
      const moveCanvas = this.$refs.moveCanvas //滑块canvas
      const ctx = canvas.getContext('2d')
      const moveCtx = moveCanvas.getContext('2d')
      const moveL = 15
      this.pinX = this.getRandom(this.blockSize, this.width - this.blockSize - 20); // 留20的边距
      this.pinY = this.getRandom(20, this.height - this.blockSize - 20); // 主图高度 - 拼图块自身高度 - 20边距
      ctx.clearRect(0, 0, this.width, this.height);
      moveCtx.clearRect(0, 0, this.width, this.height);
      ctx.fillStyle = "rgba(255,255,255,1)";
      const img = document.createElement('img');
      img.crossOrigin = "Anonymous"
      img.onload = () => {
        ctx.save();
        // ctx.globalCompositeOperation = 'source-out';
        this.paint(ctx, moveL)
        ctx.closePath();
         ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.shadowColor = "#000";
          ctx.shadowBlur = 5;
        ctx.fill();
        ctx.clip();

        ctx.drawImage(img, 0, 0, this.width, this.height);
         ctx.globalCompositeOperation = "source-atop";

        const imgData = ctx.getImageData(
          this.pinX -3,
          this.pinY - 21,
          this.pinX + this.blockSize,
          this.pinY + this.blockSize
        );
        moveCtx.putImageData(imgData, 0, this.pinY - 20);
        ctx.restore();
        ctx.clearRect(0, 0, this.width, this.height);

        ctx.save();
       
        this.paint(ctx, moveL)
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = "#ffffff";
        ctx.closePath();
        ctx.shadowColor = "#000";
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 16;
        ctx.fill();
        ctx.restore();
        ctx.save();
        ctx.globalCompositeOperation = "destination-over";
        ctx.drawImage(img, 0, 0, this.width, this.height);

        ctx.restore();
        moveCtx.restore();
        this.loading=false
      }
       img.onerror = () => {
        this.handlereset()
      };
      if(this.imgList && this.imgList.length){
        img.src = this.getRandom(0, this.imgList.length - 1);
      }else if(this.originImg){
        img.src=this.originImg === "https://picsum.photos/300/150/" ? this.originImg +`?timestamp${new Date().valueOf()}` : this.originImg
      }else{

      }
    }
  }
}
</script>

<style scoped>
.canvas-body {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 999;
  opacity: 0;
  pointer-events: none;
}
/* canvas{
  opacity: 0;
} */
.vue-picture-loading{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background-color: rgba(0, 0, 0);;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader{
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(45deg,transparent,transparent 40%,#e5f403);
  z-index: 99999;
   animation: animate 2s linear infinite;
}
.loader::before{
  content: '';
  position: absolute;
  top: 6px;
  left:6px;
  right:6px;
  bottom:6px;
  background-color: #000;
  border-radius: 50%;
  z-index:1000;
 
}

@keyframes animate {
  0%{
    transform: rotate(0deg);
    filter: hue-rotate(0deg);
  }
  0%{
    transform: rotate(360deg);
    filter: hue-rotate(360deg);
  }
}

.loader::after{
  content: '';
  position: absolute;
  top: 6px;
  left:6px;
  right:6px;
  bottom:6px;
  background: linear-gradient(45deg,transparent,transparent 40%,#e5f403);
  border-radius: 50%;
  z-index:1;
  filter: blur(30px);
}

.canvas-show {
  opacity: 1;
  pointer-events: auto;
}

.canvas-box {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  background: #fff;
  user-select: none;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.vue-picture-canvas {
  position: relative;
  overflow: hidden;
  border-radius: 3px;
}
.vue-picture-reset{
  position: absolute;
  right: 0;
  top: 0;
  z-index: 99999;
}

.moveCanvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 60px;
  /* height: 100%; */
  z-index: 2;
}

.slider-box {
  position: relative;
  width: 100%;
  background-color: #eef1f8;
  margin-top: 20px;
  border-radius: 3px;
  box-shadow: 0 0 8px rgba(240, 240, 240, 0.6) inset;
  height: 50px;
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
}

.slider-main {
  position: absolute;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 100%;
  background-color: white;
  box-shadow: 0 0 4px #ccc;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  z-index: 3;
}
.slider-fill{
  background-color: #4c83e3;
  opacity: 0.7;
  height: 100%;
  z-index: 100;
}
.verify-success{
  background-color:#5784dc;
}
.verify-error{
  background-color:#d83a21;
}

.slider-text {
  position: absolute;
  left: 50%;
  width: 100%;
  transform: translateX(-50%);
  font-size: 14px;
  color: #b7bcd1;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
  overflow: hidden;

}
</style>