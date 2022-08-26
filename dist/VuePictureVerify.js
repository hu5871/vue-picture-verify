(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global["[name]"] = global["[name]"] || {}, global["[name]"].js = factory()));
})(this, (function () { 'use strict';

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script = {
    props: {
      accuracy: {
        // 精度
        type: Number,
        "default": 5
      },
      show: {
        type: Boolean,
        defalut: false
      },
      imgList: {
        type: Array,
        defalut: function defalut() {
          return [];
        }
      },
      originImg: {
        type: String,
        "default": "https://picsum.photos/300/150/",
        required: false
      }
    },
    mounted: function mounted() {
      this.arcInit();
    },
    data: function data() {
      return {
        pinX: 0,
        //缺口的x轴
        pinY: 0,
        //缺口的Y轴
        puzzleScale: 15,
        width: 320,
        height: 160,
        blockSize: 50,
        radius: 10,
        startX: 0,
        clientX: 0,
        moveX: 0,
        moveFlag: false,
        loading: false,
        sliderMianWidth: 0,
        status: null
      };
    },
    computed: {},
    methods: {
      handlereset: function handlereset() {
        // this.newInit()
        this.status = null;
        this.moveFlag = false;
        this.startX = 0;
        this.clientX = 0;
        this.moveX = 0;
        this.arcInit();
      },
      getRandom: function getRandom(min, max) {
        return Math.ceil(Math.random() * (max - min) + min);
      },
      paint: function paint(ctx, moveL) {
        ctx.beginPath();
        ctx.moveTo(this.pinX, this.pinY);
        ctx.lineTo(this.pinX + moveL, this.pinY);
        ctx.arcTo(this.pinX + moveL, //弧的起点的 x 坐标。
        this.pinY - moveL / 2, //弧的起点的 y 坐标。
        this.pinX + moveL + moveL / 2, //弧的终点的 x 坐标。
        this.pinY - moveL / 2, //弧的终点的 y 坐标。
        moveL / 2 // 弧的半径。
        );
        ctx.arcTo(this.pinX + moveL + moveL, this.pinY - moveL / 2, this.pinX + moveL + moveL, this.pinY, moveL / 2);
        ctx.lineTo(this.pinX + moveL + moveL + moveL, this.pinY);
        ctx.lineTo(this.pinX + moveL + moveL + moveL, this.pinY + moveL);
        ctx.arcTo(this.pinX + moveL + moveL + moveL + moveL / 2, this.pinY + moveL, this.pinX + moveL + moveL + moveL + moveL / 2, this.pinY + moveL + moveL / 2, moveL / 2);
        ctx.arcTo(this.pinX + moveL + moveL + moveL + moveL / 2, this.pinY + moveL + moveL, this.pinX + moveL + moveL + moveL, this.pinY + moveL + moveL, moveL / 2);
        ctx.lineTo(this.pinX + moveL + moveL + moveL, this.pinY + moveL + moveL + moveL);
        ctx.lineTo(this.pinX, this.pinY + moveL + moveL + moveL);
        ctx.lineTo(this.pinX, this.pinY + moveL + moveL);
        ctx.arcTo(this.pinX + moveL / 2, this.pinY + moveL + moveL, this.pinX + moveL / 2, this.pinY + moveL + moveL / 2, moveL / 2);
        ctx.arcTo(this.pinX + moveL / 2, this.pinY + moveL, this.pinX, this.pinY + moveL, moveL / 2);
        ctx.lineTo(this.pinX, this.pinY);
      },
      onRangeMouseDown: function onRangeMouseDown(e) {
        e.preventDefault();
        this.moveFlag = true;
        this.startX = e.clientX || e.changedTouches[0].clientX;
        this.clientX = e.clientX || e.changedTouches[0].clientX;
        this.sliderMianWidth = this.$refs.slider.clientWidth;
      },
      onRangeMouseMove: function onRangeMouseMove(e) {
        if (this.moveFlag) {
          var movex = (e.clientX || e.changedTouches[0].clientX) - this.startX;
          this.moveX = movex > 0 ? movex >= this.sliderMianWidth - this.blockSize ? this.sliderMianWidth - this.blockSize : movex : 0;
        }
      },
      handleMouseup: function handleMouseup() {
        if (this.moveFlag) {
          this.moveFlag = false;
          this.verify();
        }
      },
      verify: function verify() {
        var _this = this;

        var x = Math.abs(this.pinX - this.moveX);

        if (x > this.accuracy) {
          //失败
          this.status = false;
          this.$emit('fail');
          setTimeout(function () {
            _this.handlereset();
          }, 1000);
        } else {
          // 成功
          this.status = true;
          this.$emit('success');
        }
      },
      arcInit: function arcInit() {
        var _this2 = this;

        this.loading = true;
        var canvas = this.$refs.tutorial; //主图canvas

        var moveCanvas = this.$refs.moveCanvas; //滑块canvas

        var ctx = canvas.getContext('2d');
        var moveCtx = moveCanvas.getContext('2d');
        var moveL = 15;
        this.pinX = this.getRandom(this.blockSize, this.width - this.blockSize - 20); // 留20的边距

        this.pinY = this.getRandom(20, this.height - this.blockSize - 20); // 主图高度 - 拼图块自身高度 - 20边距

        ctx.clearRect(0, 0, this.width, this.height);
        moveCtx.clearRect(0, 0, this.width, this.height);
        ctx.fillStyle = "rgba(255,255,255,1)";
        var img = document.createElement('img');
        img.crossOrigin = "Anonymous";

        img.onload = function () {
          ctx.save(); // ctx.globalCompositeOperation = 'source-out';

          _this2.paint(ctx, moveL);

          ctx.closePath();
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.shadowColor = "#000";
          ctx.shadowBlur = 5;
          ctx.fill();
          ctx.clip();
          ctx.drawImage(img, 0, 0, _this2.width, _this2.height);
          ctx.globalCompositeOperation = "source-atop";
          var imgData = ctx.getImageData(_this2.pinX - 3, _this2.pinY - 21, _this2.pinX + _this2.blockSize, _this2.pinY + _this2.blockSize);
          moveCtx.putImageData(imgData, 0, _this2.pinY - 20);
          ctx.restore();
          ctx.clearRect(0, 0, _this2.width, _this2.height);
          ctx.save();

          _this2.paint(ctx, moveL);

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
          ctx.drawImage(img, 0, 0, _this2.width, _this2.height);
          ctx.restore();
          moveCtx.restore();
          _this2.loading = false;
        };

        img.onerror = function () {
          _this2.handlereset();
        };

        if (this.imgList && this.imgList.length) {
          img.src = this.getRandom(0, this.imgList.length - 1);
        } else if (this.originImg) {
          img.src = this.originImg === "https://picsum.photos/300/150/" ? this.originImg + "?timestamp".concat(new Date().valueOf()) : this.originImg;
        } else ;
      }
    }
  };

  /* script */
              const __vue_script__ = script;
              
  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { class: ["canvas-body", { "canvas-show": _vm.show }] }, [
      _c(
        "div",
        {
          staticClass: "canvas-box",
          on: {
            mousedown: function($event) {
              $event.stopPropagation();
            },
            touchstart: function($event) {
              $event.stopPropagation();
            }
          }
        },
        [
          _c("div", { staticClass: "vue-picture-canvas" }, [
            _c(
              "svg",
              {
                staticClass: "vue-picture-reset",
                attrs: {
                  width: "30",
                  height: "30",
                  viewBox: "0 0 48 48",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg"
                },
                on: { click: _vm.handlereset }
              },
              [
                _c("path", {
                  attrs: {
                    d:
                      "M11.2721 36.7279C14.5294 39.9853 19.0294 42 24 42C33.9411 42 42 33.9411 42 24C42 14.0589 33.9411 6 24 6C19.0294 6 14.5294 8.01472 11.2721 11.2721C9.61407 12.9301 6 17 6 17",
                    stroke: "#ffffff",
                    "stroke-width": "3",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round"
                  }
                }),
                _c("path", {
                  attrs: {
                    d: "M6 9V17H14",
                    stroke: "#ffffff",
                    "stroke-width": "3",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round"
                  }
                })
              ]
            ),
            _vm._v(" "),
            _c("canvas", {
              ref: "tutorial",
              staticStyle: { border: "1px solid #ccc" },
              attrs: { width: "300", height: "150" }
            }),
            _vm._v(" "),
            _c("canvas", {
              ref: "moveCanvas",
              staticClass: "moveCanvas",
              style: { transform: "translateX(" + _vm.moveX + "px)" },
              attrs: { width: "60", height: "150" }
            }),
            _vm._v(" "),
            _vm.loading
              ? _c("div", { staticClass: "vue-picture-loading" }, [
                  _c("div", { staticClass: "loader" })
                ])
              : _vm._e()
          ]),
          _vm._v(" "),
          _c("div", { ref: "slider", staticClass: "slider-box" }, [
            _c("div", {
              class: [
                "slider-fill",
                {
                  "verify-success": _vm.status,
                  "verify-error": _vm.status === false
                }
              ],
              style: { width: _vm.moveX + "px" }
            }),
            _vm._v(" "),
            _c(
              "div",
              {
                class: [
                  "slider-main",
                  {
                    "verify-success": _vm.status,
                    "verify-error": _vm.status === false
                  }
                ],
                style: { transform: "translateX(" + _vm.moveX + "px)" },
                on: {
                  mousemove: function($event) {
                    $event.preventDefault();
                    return _vm.onRangeMouseMove.apply(null, arguments)
                  },
                  mouseup: _vm.handleMouseup,
                  touchmove: function($event) {
                    $event.preventDefault();
                    return _vm.onRangeMouseMove($event)
                  },
                  mousedown: function($event) {
                    return _vm.onRangeMouseDown($event)
                  },
                  touchstart: function($event) {
                    return _vm.onRangeMouseDown($event)
                  },
                  touchend: _vm.handleMouseup
                }
              },
              [
                _vm.status === null
                  ? _c(
                      "svg",
                      {
                        attrs: {
                          width: "30",
                          height: "30",
                          viewBox: "0 0 48 48",
                          fill: "none",
                          xmlns: "http://www.w3.org/2000/svg"
                        }
                      },
                      [
                        _c("path", {
                          attrs: {
                            d: "M12 12L24 24L12 36",
                            stroke: "#333",
                            "stroke-width": "1",
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round"
                          }
                        }),
                        _vm._v(" "),
                        _c("path", {
                          attrs: {
                            d: "M24 12L36 24L24 36",
                            stroke: "#333",
                            "stroke-width": "1",
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round"
                          }
                        })
                      ]
                    )
                  : _vm._e(),
                _vm._v(" "),
                _vm.status
                  ? _c(
                      "svg",
                      {
                        attrs: {
                          width: "30",
                          height: "30",
                          viewBox: "0 0 48 48",
                          fill: "none",
                          xmlns: "http://www.w3.org/2000/svg"
                        }
                      },
                      [
                        _c("path", {
                          attrs: {
                            "fill-rule": "evenodd",
                            "clip-rule": "evenodd",
                            d: "M4 24L9 19L19 29L39 9L44 14L19 39L4 24Z",
                            fill: "#ffffff",
                            stroke: "#ffffff",
                            "stroke-width": "1",
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round"
                          }
                        })
                      ]
                    )
                  : _vm._e(),
                _vm._v(" "),
                _vm.status === false
                  ? _c(
                      "svg",
                      {
                        attrs: {
                          width: "35",
                          height: "35",
                          viewBox: "0 0 48 48",
                          fill: "none",
                          xmlns: "http://www.w3.org/2000/svg"
                        }
                      },
                      [
                        _c("path", {
                          attrs: {
                            "fill-rule": "evenodd",
                            "clip-rule": "evenodd",
                            d:
                              "M6 11L11 6L24 19L37 6L42 11L29 24L42 37L37 42L24 29L11 42L6 37L19 24L6 11Z",
                            fill: "#ffffff",
                            stroke: "#ffffff",
                            "stroke-width": "3",
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round"
                          }
                        })
                      ]
                    )
                  : _vm._e()
              ]
            ),
            _vm._v(" "),
            _vm._m(0)
          ])
        ]
      )
    ])
  };
  var __vue_staticRenderFns__ = [
    function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("span", { staticClass: "slider-text" }, [
        _vm._v("请"),
        _c("span", { staticStyle: { color: "#e68045" } }, [_vm._v("拖动")]),
        _vm._v("左侧滑块将图片还原")
      ])
    }
  ];
  __vue_render__._withStripped = true;

    /* style */
    const __vue_inject_styles__ = function (inject) {
      if (!inject) return
      inject("data-v-c4a9a81a_0", { source: "\n.canvas-body[data-v-c4a9a81a] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background-color: rgba(0, 0, 0, 0.3);\n  z-index: 999;\n  opacity: 0;\n  pointer-events: none;\n}\n/* canvas{\n  opacity: 0;\n} */\n.vue-picture-loading[data-v-c4a9a81a]{\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  z-index: 9999;\n  background-color: rgba(0, 0, 0);;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.loader[data-v-c4a9a81a]{\n  position: relative;\n  width: 50px;\n  height: 50px;\n  border-radius: 50%;\n  background: linear-gradient(45deg,transparent,transparent 40%,#e5f403);\n  z-index: 99999;\n   animation: animate-data-v-c4a9a81a 2s linear infinite;\n}\n.loader[data-v-c4a9a81a]::before{\n  content: '';\n  position: absolute;\n  top: 6px;\n  left:6px;\n  right:6px;\n  bottom:6px;\n  background-color: #000;\n  border-radius: 50%;\n  z-index:1000;\n}\n@keyframes animate-data-v-c4a9a81a {\n0%{\n    transform: rotate(0deg);\n    filter: hue-rotate(0deg);\n}\n0%{\n    transform: rotate(360deg);\n    filter: hue-rotate(360deg);\n}\n}\n.loader[data-v-c4a9a81a]::after{\n  content: '';\n  position: absolute;\n  top: 6px;\n  left:6px;\n  right:6px;\n  bottom:6px;\n  background: linear-gradient(45deg,transparent,transparent 40%,#e5f403);\n  border-radius: 50%;\n  z-index:1;\n  filter: blur(30px);\n}\n.canvas-show[data-v-c4a9a81a] {\n  opacity: 1;\n  pointer-events: auto;\n}\n.canvas-box[data-v-c4a9a81a] {\n  position: absolute;\n  top: 40%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  padding: 20px;\n  background: #fff;\n  user-select: none;\n  border-radius: 3px;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);\n}\n.vue-picture-canvas[data-v-c4a9a81a] {\n  position: relative;\n  overflow: hidden;\n  border-radius: 3px;\n}\n.vue-picture-reset[data-v-c4a9a81a]{\n  position: absolute;\n  right: 0;\n  top: 0;\n  z-index: 99999;\n}\n.moveCanvas[data-v-c4a9a81a] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 60px;\n  /* height: 100%; */\n  z-index: 2;\n}\n.slider-box[data-v-c4a9a81a] {\n  position: relative;\n  width: 100%;\n  background-color: #eef1f8;\n  margin-top: 20px;\n  border-radius: 3px;\n  box-shadow: 0 0 8px rgba(240, 240, 240, 0.6) inset;\n  height: 50px;\n  display: flex;\n  /* justify-content: space-between; */\n  align-items: center;\n}\n.slider-main[data-v-c4a9a81a] {\n  position: absolute;\n  left: 0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 50px;\n  height: 100%;\n  background-color: white;\n  box-shadow: 0 0 4px #ccc;\n  border-top-right-radius: 3px;\n  border-bottom-right-radius: 3px;\n  z-index: 3;\n}\n.slider-fill[data-v-c4a9a81a]{\n  background-color: #4c83e3;\n  opacity: 0.7;\n  height: 100%;\n  z-index: 100;\n}\n.verify-success[data-v-c4a9a81a]{\n  background-color:#5784dc;\n}\n.verify-error[data-v-c4a9a81a]{\n  background-color:#d83a21;\n}\n.slider-text[data-v-c4a9a81a] {\n  position: absolute;\n  left: 50%;\n  width: 100%;\n  transform: translateX(-50%);\n  font-size: 14px;\n  color: #b7bcd1;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  text-align: center;\n  overflow: hidden;\n}\n", map: {"version":3,"sources":["/Users/hujincong/Desktop/myProject/vue-picture-verify/src/lib/vue-picture-verify.vue"],"names":[],"mappings":";AAkQA;EACA,eAAA;EACA,MAAA;EACA,OAAA;EACA,SAAA;EACA,QAAA;EACA,oCAAA;EACA,YAAA;EACA,UAAA;EACA,oBAAA;AACA;AACA;;GAEA;AACA;EACA,kBAAA;EACA,MAAA;EACA,OAAA;EACA,WAAA;EACA,YAAA;EACA,aAAA;EACA,+BAAA;EACA,aAAA;EACA,uBAAA;EACA,mBAAA;AACA;AAEA;EACA,kBAAA;EACA,WAAA;EACA,YAAA;EACA,kBAAA;EACA,sEAAA;EACA,cAAA;GACA,qDAAA;AACA;AACA;EACA,WAAA;EACA,kBAAA;EACA,QAAA;EACA,QAAA;EACA,SAAA;EACA,UAAA;EACA,sBAAA;EACA,kBAAA;EACA,YAAA;AAEA;AAEA;AACA;IACA,uBAAA;IACA,wBAAA;AACA;AACA;IACA,yBAAA;IACA,0BAAA;AACA;AACA;AAEA;EACA,WAAA;EACA,kBAAA;EACA,QAAA;EACA,QAAA;EACA,SAAA;EACA,UAAA;EACA,sEAAA;EACA,kBAAA;EACA,SAAA;EACA,kBAAA;AACA;AAEA;EACA,UAAA;EACA,oBAAA;AACA;AAEA;EACA,kBAAA;EACA,QAAA;EACA,SAAA;EACA,gCAAA;EACA,aAAA;EACA,gBAAA;EACA,iBAAA;EACA,kBAAA;EACA,wCAAA;AACA;AAEA;EACA,kBAAA;EACA,gBAAA;EACA,kBAAA;AACA;AACA;EACA,kBAAA;EACA,QAAA;EACA,MAAA;EACA,cAAA;AACA;AAEA;EACA,kBAAA;EACA,MAAA;EACA,OAAA;EACA,WAAA;EACA,kBAAA;EACA,UAAA;AACA;AAEA;EACA,kBAAA;EACA,WAAA;EACA,yBAAA;EACA,gBAAA;EACA,kBAAA;EACA,kDAAA;EACA,YAAA;EACA,aAAA;EACA,oCAAA;EACA,mBAAA;AACA;AAEA;EACA,kBAAA;EACA,OAAA;EACA,aAAA;EACA,uBAAA;EACA,mBAAA;EACA,WAAA;EACA,YAAA;EACA,uBAAA;EACA,wBAAA;EACA,4BAAA;EACA,+BAAA;EACA,UAAA;AACA;AACA;EACA,yBAAA;EACA,YAAA;EACA,YAAA;EACA,YAAA;AACA;AACA;EACA,wBAAA;AACA;AACA;EACA,wBAAA;AACA;AAEA;EACA,kBAAA;EACA,SAAA;EACA,WAAA;EACA,2BAAA;EACA,eAAA;EACA,cAAA;EACA,mBAAA;EACA,uBAAA;EACA,kBAAA;EACA,gBAAA;AAEA","file":"vue-picture-verify.vue","sourcesContent":["<template>\n  <div :class=\"['canvas-body', { 'canvas-show': show }]\">\n    <div class=\"canvas-box\" @mousedown.stop @touchstart.stop>\n      <div class=\"vue-picture-canvas\">\n        <svg @click=\"handlereset\" class=\"vue-picture-reset\" width=\"30\" height=\"30\" viewBox=\"0 0 48 48\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M11.2721 36.7279C14.5294 39.9853 19.0294 42 24 42C33.9411 42 42 33.9411 42 24C42 14.0589 33.9411 6 24 6C19.0294 6 14.5294 8.01472 11.2721 11.2721C9.61407 12.9301 6 17 6 17\" stroke=\"#ffffff\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M6 9V17H14\" stroke=\"#ffffff\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>\n        <canvas ref=\"tutorial\" style=\"border:1px solid #ccc\" width=\"300\" height=\"150\"></canvas>\n        <canvas ref=\"moveCanvas\" class=\"moveCanvas\" width=\"60\" :style=\"{ transform: `translateX(${moveX}px)` }\"\n          height=\"150\"></canvas>\n        <div v-if=\"loading\" class=\"vue-picture-loading\">\n           <div class=\"loader\"></div>\n        </div>\n      </div>\n      <div class=\"slider-box\" ref=\"slider\">\n        <div :class=\"['slider-fill',{'verify-success':status,'verify-error':status===false}]\" :style=\"{'width':`${moveX}px`}\"></div>\n        <div :class=\"['slider-main',{'verify-success':status,'verify-error':status===false}]\" :style=\"{ transform: `translateX(${moveX}px)` }\" @mousemove.prevent=\"onRangeMouseMove\"\n          @mouseup=\"handleMouseup\" @touchmove.prevent=\"onRangeMouseMove($event)\"\n          @mousedown=\"onRangeMouseDown($event)\" @touchstart=\"onRangeMouseDown($event)\" @touchend=\"handleMouseup\">\n          <svg v-if=\"status === null\" width=\"30\" height=\"30\" viewBox=\"0 0 48 48\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n            <path d=\"M12 12L24 24L12 36\" stroke=\"#333\" stroke-width=\"1\" stroke-linecap=\"round\"\n              stroke-linejoin=\"round\" />\n            <path d=\"M24 12L36 24L24 36\" stroke=\"#333\" stroke-width=\"1\" stroke-linecap=\"round\"\n              stroke-linejoin=\"round\" />\n          </svg>\n          <svg v-if=\"status\" width=\"30\" height=\"30\" viewBox=\"0 0 48 48\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M4 24L9 19L19 29L39 9L44 14L19 39L4 24Z\" fill=\"#ffffff\" stroke=\"#ffffff\" stroke-width=\"1\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>\n          <svg width=\"35\" v-if=\"status === false\" height=\"35\" viewBox=\"0 0 48 48\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M6 11L11 6L24 19L37 6L42 11L29 24L42 37L37 42L24 29L11 42L6 37L19 24L6 11Z\" fill=\"#ffffff\" stroke=\"#ffffff\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>\n        </div>\n        <span class=\"slider-text\">请<span style=\"color:#e68045;\">拖动</span>左侧滑块将图片还原</span>\n      </div>\n    </div>\n    \n  </div>\n</template>\n\n<script >\nexport default {\n  props: {\n    accuracy: {  // 精度\n      type: Number,\n      default: 5\n    },\n    show: {\n      type: Boolean,\n      defalut: false\n    },\n    imgList:{\n      type: Array,\n      defalut: ()=>([])\n    },\n    originImg:{\n      type: String,\n      default: \"https://picsum.photos/300/150/\",\n      required: false\n    }\n  },\n  mounted () {\n    this.arcInit()\n  },\n  data () {\n    return {\n      pinX: 0,//缺口的x轴\n      pinY: 0,//缺口的Y轴\n      puzzleScale: 15,\n      width: 320,\n      height: 160,\n      blockSize: 50,\n      radius: 10,\n      startX: 0,\n      clientX: 0,\n      moveX: 0,\n      moveFlag: false,\n      loading:false,\n      sliderMianWidth: 0,\n      status:null\n    }\n  },\n  computed: {\n  },\n  methods: {\n     handlereset () {\n      // this.newInit()\n      this.status=null\n      this.moveFlag=false\n      this.startX=0\n      this.clientX=0\n      this.moveX=0\n\n      this.arcInit()\n    },\n    getRandom (min, max) {\n      return Math.ceil(Math.random() * (max - min) + min);\n    },\n    paint (ctx, moveL) {\n      ctx.beginPath();\n      ctx.moveTo(this.pinX, this.pinY);\n      ctx.lineTo(this.pinX + moveL, this.pinY);\n      ctx.arcTo(\n        this.pinX + moveL,//弧的起点的 x 坐标。\n        this.pinY - moveL / 2, //弧的起点的 y 坐标。\n        this.pinX + moveL + moveL / 2,//弧的终点的 x 坐标。\n        this.pinY - moveL / 2, //弧的终点的 y 坐标。\n        moveL / 2 // 弧的半径。\n      );\n      ctx.arcTo(\n        this.pinX + moveL + moveL,\n        this.pinY - moveL / 2,\n        this.pinX + moveL + moveL,\n        this.pinY,\n        moveL / 2\n      );\n      ctx.lineTo(this.pinX + moveL + moveL + moveL, this.pinY);\n      ctx.lineTo(this.pinX + moveL + moveL + moveL, this.pinY + moveL);\n      ctx.arcTo(\n        this.pinX + moveL + moveL + moveL + moveL / 2,\n        this.pinY + moveL,\n        this.pinX + moveL + moveL + moveL + moveL / 2,\n        this.pinY + moveL + moveL / 2,\n        moveL / 2\n      )\n      ctx.arcTo(\n        this.pinX + moveL + moveL + moveL + moveL / 2,\n        this.pinY + moveL + moveL,\n        this.pinX + moveL + moveL + moveL,\n        this.pinY + moveL + moveL,\n        moveL / 2\n      );\n      ctx.lineTo(\n        this.pinX + moveL + moveL + moveL,\n        this.pinY + moveL + moveL + moveL\n      );\n      ctx.lineTo(this.pinX, this.pinY + moveL + moveL + moveL);\n      ctx.lineTo(this.pinX, this.pinY + moveL + moveL);\n\n      ctx.arcTo(\n        this.pinX + moveL / 2,\n        this.pinY + moveL + moveL,\n        this.pinX + moveL / 2,\n        this.pinY + moveL + moveL / 2,\n        moveL / 2\n      );\n      ctx.arcTo(\n        this.pinX + moveL / 2,\n        this.pinY + moveL,\n        this.pinX,\n        this.pinY + moveL,\n        moveL / 2\n      );\n      ctx.lineTo(this.pinX, this.pinY);\n    },\n    onRangeMouseDown (e) {\n      e.preventDefault();\n      this.moveFlag = true\n      this.startX = e.clientX || e.changedTouches[0].clientX;\n      this.clientX = e.clientX || e.changedTouches[0].clientX;\n      this.sliderMianWidth = this.$refs.slider.clientWidth\n    },\n    onRangeMouseMove (e) {\n      if (this.moveFlag) {\n        const movex = (e.clientX || e.changedTouches[0].clientX) - this.startX\n        this.moveX = (movex > 0 ? movex >= this.sliderMianWidth - this.blockSize ? this.sliderMianWidth - this.blockSize : movex : 0)\n      }\n\n    },\n    handleMouseup () {\n      if (this.moveFlag) {\n        this.moveFlag = false\n        this.verify()\n      }\n    },\n    verify () {\n      const x = Math.abs(this.pinX - this.moveX)\n      if(x > this.accuracy){\n        //失败\n        this.status=false\n        this.$emit('fail')\n        setTimeout(()=>{\n          this.handlereset()\n        },1000)\n      }else{\n       // 成功\n        this.status=true \n         this.$emit('success')\n      }\n    },\n    arcInit () {\n      this.loading=true\n      const canvas = this.$refs.tutorial //主图canvas\n      const moveCanvas = this.$refs.moveCanvas //滑块canvas\n      const ctx = canvas.getContext('2d')\n      const moveCtx = moveCanvas.getContext('2d')\n      const moveL = 15\n      this.pinX = this.getRandom(this.blockSize, this.width - this.blockSize - 20); // 留20的边距\n      this.pinY = this.getRandom(20, this.height - this.blockSize - 20); // 主图高度 - 拼图块自身高度 - 20边距\n      ctx.clearRect(0, 0, this.width, this.height);\n      moveCtx.clearRect(0, 0, this.width, this.height);\n      ctx.fillStyle = \"rgba(255,255,255,1)\";\n      const img = document.createElement('img');\n      img.crossOrigin = \"Anonymous\"\n      img.onload = () => {\n        ctx.save();\n        // ctx.globalCompositeOperation = 'source-out';\n        this.paint(ctx, moveL)\n        ctx.closePath();\n         ctx.shadowOffsetX = 0;\n          ctx.shadowOffsetY = 0;\n          ctx.shadowColor = \"#000\";\n          ctx.shadowBlur = 5;\n        ctx.fill();\n        ctx.clip();\n\n        ctx.drawImage(img, 0, 0, this.width, this.height);\n         ctx.globalCompositeOperation = \"source-atop\";\n\n        const imgData = ctx.getImageData(\n          this.pinX -3,\n          this.pinY - 21,\n          this.pinX + this.blockSize,\n          this.pinY + this.blockSize\n        );\n        moveCtx.putImageData(imgData, 0, this.pinY - 20);\n        ctx.restore();\n        ctx.clearRect(0, 0, this.width, this.height);\n\n        ctx.save();\n       \n        this.paint(ctx, moveL)\n        ctx.globalAlpha = 0.7;\n        ctx.fillStyle = \"#ffffff\";\n        ctx.closePath();\n        ctx.shadowColor = \"#000\";\n        ctx.shadowOffsetX = 2;\n        ctx.shadowOffsetY = 2;\n        ctx.shadowBlur = 16;\n        ctx.fill();\n        ctx.restore();\n        ctx.save();\n        ctx.globalCompositeOperation = \"destination-over\";\n        ctx.drawImage(img, 0, 0, this.width, this.height);\n\n        ctx.restore();\n        moveCtx.restore();\n        this.loading=false\n      }\n       img.onerror = () => {\n        this.handlereset()\n      };\n      if(this.imgList && this.imgList.length){\n        img.src = this.getRandom(0, this.imgList.length - 1);\n      }else if(this.originImg){\n        img.src=this.originImg === \"https://picsum.photos/300/150/\" ? this.originImg +`?timestamp${new Date().valueOf()}` : this.originImg\n      }else{\n\n      }\n    }\n  }\n}\n</script>\n\n<style scoped>\n.canvas-body {\n  position: fixed;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background-color: rgba(0, 0, 0, 0.3);\n  z-index: 999;\n  opacity: 0;\n  pointer-events: none;\n}\n/* canvas{\n  opacity: 0;\n} */\n.vue-picture-loading{\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  z-index: 9999;\n  background-color: rgba(0, 0, 0);;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.loader{\n  position: relative;\n  width: 50px;\n  height: 50px;\n  border-radius: 50%;\n  background: linear-gradient(45deg,transparent,transparent 40%,#e5f403);\n  z-index: 99999;\n   animation: animate 2s linear infinite;\n}\n.loader::before{\n  content: '';\n  position: absolute;\n  top: 6px;\n  left:6px;\n  right:6px;\n  bottom:6px;\n  background-color: #000;\n  border-radius: 50%;\n  z-index:1000;\n \n}\n\n@keyframes animate {\n  0%{\n    transform: rotate(0deg);\n    filter: hue-rotate(0deg);\n  }\n  0%{\n    transform: rotate(360deg);\n    filter: hue-rotate(360deg);\n  }\n}\n\n.loader::after{\n  content: '';\n  position: absolute;\n  top: 6px;\n  left:6px;\n  right:6px;\n  bottom:6px;\n  background: linear-gradient(45deg,transparent,transparent 40%,#e5f403);\n  border-radius: 50%;\n  z-index:1;\n  filter: blur(30px);\n}\n\n.canvas-show {\n  opacity: 1;\n  pointer-events: auto;\n}\n\n.canvas-box {\n  position: absolute;\n  top: 40%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  padding: 20px;\n  background: #fff;\n  user-select: none;\n  border-radius: 3px;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);\n}\n\n.vue-picture-canvas {\n  position: relative;\n  overflow: hidden;\n  border-radius: 3px;\n}\n.vue-picture-reset{\n  position: absolute;\n  right: 0;\n  top: 0;\n  z-index: 99999;\n}\n\n.moveCanvas {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 60px;\n  /* height: 100%; */\n  z-index: 2;\n}\n\n.slider-box {\n  position: relative;\n  width: 100%;\n  background-color: #eef1f8;\n  margin-top: 20px;\n  border-radius: 3px;\n  box-shadow: 0 0 8px rgba(240, 240, 240, 0.6) inset;\n  height: 50px;\n  display: flex;\n  /* justify-content: space-between; */\n  align-items: center;\n}\n\n.slider-main {\n  position: absolute;\n  left: 0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 50px;\n  height: 100%;\n  background-color: white;\n  box-shadow: 0 0 4px #ccc;\n  border-top-right-radius: 3px;\n  border-bottom-right-radius: 3px;\n  z-index: 3;\n}\n.slider-fill{\n  background-color: #4c83e3;\n  opacity: 0.7;\n  height: 100%;\n  z-index: 100;\n}\n.verify-success{\n  background-color:#5784dc;\n}\n.verify-error{\n  background-color:#d83a21;\n}\n\n.slider-text {\n  position: absolute;\n  left: 50%;\n  width: 100%;\n  transform: translateX(-50%);\n  font-size: 14px;\n  color: #b7bcd1;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  text-align: center;\n  overflow: hidden;\n\n}\n</style>"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__ = "data-v-c4a9a81a";
    /* module identifier */
    const __vue_module_identifier__ = undefined;
    /* functional template */
    const __vue_is_functional_template__ = false;
    /* component normalizer */
    function __vue_normalize__(
      template, style, script,
      scope, functional, moduleIdentifier,
      createInjector, createInjectorSSR
    ) {
      const component = (typeof script === 'function' ? script.options : script) || {};

      // For security concerns, we use only base name in production mode.
      component.__file = "/Users/hujincong/Desktop/myProject/vue-picture-verify/src/lib/vue-picture-verify.vue";

      if (!component.render) {
        component.render = template.render;
        component.staticRenderFns = template.staticRenderFns;
        component._compiled = true;

        if (functional) component.functional = true;
      }

      component._scopeId = scope;

      {
        let hook;
        if (style) {
          hook = function(context) {
            style.call(this, createInjector(context));
          };
        }

        if (hook !== undefined) {
          if (component.functional) {
            // register for functional component in vue file
            const originalRender = component.render;
            component.render = function renderWithStyleInjection(h, context) {
              hook.call(context);
              return originalRender(h, context)
            };
          } else {
            // inject component registration as beforeCreate hook
            const existing = component.beforeCreate;
            component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
        }
      }

      return component
    }
    /* style inject */
    function __vue_create_injector__() {
      const head = document.head || document.getElementsByTagName('head')[0];
      const styles = __vue_create_injector__.styles || (__vue_create_injector__.styles = {});
      const isOldIE =
        typeof navigator !== 'undefined' &&
        /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

      return function addStyle(id, css) {
        if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return // SSR styles are present.

        const group = isOldIE ? css.media || 'default' : id;
        const style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

        if (!style.ids.includes(id)) {
          let code = css.source;
          let index = style.ids.length;

          style.ids.push(id);

          if (isOldIE) {
            style.element = style.element || document.querySelector('style[data-group=' + group + ']');
          }

          if (!style.element) {
            const el = style.element = document.createElement('style');
            el.type = 'text/css';

            if (css.media) el.setAttribute('media', css.media);
            if (isOldIE) {
              el.setAttribute('data-group', group);
              el.setAttribute('data-next-index', '0');
            }

            head.appendChild(el);
          }

          if (isOldIE) {
            index = parseInt(style.element.getAttribute('data-next-index'));
            style.element.setAttribute('data-next-index', index + 1);
          }

          if (style.element.styleSheet) {
            style.parts.push(code);
            style.element.styleSheet.cssText = style.parts
              .filter(Boolean)
              .join('\n');
          } else {
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index]) style.element.removeChild(nodes[index]);
            if (nodes.length) style.element.insertBefore(textNode, nodes[index]);
            else style.element.appendChild(textNode);
          }
        }
      }
    }
    /* style inject SSR */
    

    
    var VuePictureVerify = __vue_normalize__(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      __vue_create_injector__);

  var plugins = {
    install: function install(Vue) {
      Vue.component('VuePictureVerify', VuePictureVerify);
    }
  };

  if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(VuePictureVerify);
  }

  return plugins;

}));
//# sourceMappingURL=VuePictureVerify.js.map
