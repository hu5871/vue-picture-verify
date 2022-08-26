## vue-picture-verify
纯前端滑块图形验证码，可自定义图片和通过远程获取默认从[Lorem Picsum图库获取](https://picsum.photos/)

![demo](/demo.jpg)

### 安装

```bash
npm install vue-picture-verify --save
```

### 使用

```bash
import VuePictureVerify from 'vue-picture-verify';

Vue.use(VuePictureVerify)

## 组件中使用
<VuePictureVerify :show="show"></VuePictureVerify>
```

### 例子

```vue
<template>
  <div>
     <button  @click="handleShow">显示</button>
     <VuePictureVerify :show="show"></VuePictureVerify>
  </div>
</template>
<script >
export default{
  data() {
    return {
      show: false
    }
  },
  methods: {
    handleShow() {
      this.show = true
    }
  }
}
</script>
<style  scoped>
</style>
```

### 参数

| props     | 类型    | 默认值                         | 说明                                |
| --------- | ------- | ------------------------------ | ----------------------------------- |
| show      | Boolean | false                          | 是否显示弹窗                        |
| accuracy  | Number  | 5                              | 缺口和拼图重合的精度，越小越难      |
| imgList   | Array   | []                             | 自定义图片的图片数组                |
| originImg | String  | https://picsum.photos/300/150/ | 从远程获取图片，imgList为空时才使用 |

### 事件

| 事件名  | 返回值 | 说明             |
| ------- | ------ | ---------------- |
| success | void   | 验证通过时会触发 |
| fail    | void   | 验证失败时会触发 |

