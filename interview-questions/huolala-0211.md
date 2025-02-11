## 面试流程
1. 自我介绍
2. 八股文提问
3. 工作经验+项目相关
4. 最后10分钟反问

自己做的不好的地方有
1. 移动端适配问题答的特别差
2. CSS相关问题也没有打出来
3. TypeScript更是一个都不会, 但是你简历上写了就该会
   
## 面试问题

### CSS相关
#### 盒模型的box-sizing
markdown
  有两个值：content-box, border-box
  - 默认是content-box
  - 如果设置为border-box，则width和height包括了padding和border
#### 水平垂直居中有哪些方式
先理解清楚问题，水平垂直居中包含水平居中和垂直居中
所以有以下几种方法
- 参考：[CSS-水平居中、垂直居中、水平垂直居中](https://segmentfault.com/a/1190000014116655)
  
1. 方法1：绝对定位+margin:auto
```css
    div{
        width: 200px;
        height: 200px;
        background: green;
        
        position:absolute;
        left:0;
        top: 0;
        bottom: 0;
        right: 0;
        margin: auto;
    }
```
2. 方法2：绝对定位+负margin
```css
        div {
        width: 200px;
        height: 200px;
        background: green;

        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -100px;
        margin-top: -100px;
    }
```
3. 方法3：绝对定位+transform
```css
   div{
        width: 200px;
        height: 200px;
        background: green;
        
        position:absolute;
        left:50%;    /* 定位父级的50% */
        top:50%;
        transform: translate(-50%,-50%); /*自己的50% */
    }
```
4. 方法4：flex布局
```css
    div{
        display: flex;
        justify-content: center;
        align-items: center;
    }
```
5. 方法5：grid布局
```css
    div{
        display: grid;
        place-items: center;
    }
```

#### flex: 0 1 auto分别代表什么
  - 0: flex-grow
  - 1: flex-shrink
  - auto: flex-basis

`flex-grow`:  代表元素在 flex 容器中分配剩余空间的相对比例
- flex-grow: 0 表示不放大, 默认为0

`flex-shrink`: 代表元素在 flex 容器中收缩的相对比例,flex 元素仅在默认宽度之和大于容器的时候才会发生收缩，其收缩的大小是依据 flex-shrink 的值。 
- flex-shrink: 1 表示会收缩, 默认为1

`flex-basis`: 代表元素在 flex 容器中分配的初始空间, 这个属性就决定了 flex 元素的内容盒（content-box）的尺寸。
- 当一个元素同时被设置了 flex-basis (除值为 auto 外) 和 width, flex-basis 具有更高的优先级。
- flex-basis: auto 表示根据内容自动调整, 默认为auto

#### 回流和重绘
参考: 
1. [回流 (Reflow) 和重绘 (Repaint) 是什么？以及如何优化？](https://www.explainthis.io/zh-hans/swe/repaint-and-reflow)
2. [浏览器的回流与重绘 (Reflow & Repaint)](https://juejin.cn/post/6844903569087266823)

要理解回流和重绘，需要先理解浏览器的渲染过程:

1. 首先将HTML解析成DOM树, 将CSS解析成CSSOM树, 将DOM树和CSSOM树合并成渲染树
2. 渲染树有DOM的结构和每个节点的样式, 根据渲染树计算每个节点的大小和位置, 这个过程就是布局(layout)
3. 为了呈现页面,浏览器还需要判断元素的绘制顺序, 这个过程就是绘制(paint)
   1. 画画也是需要顺序的, 先画背景, 再画内容, 最后画边框
4. 合成, 将绘制好的图层进行合成, 生成最终的页面,
   - 合成 (compositing) 是一种将页面的各个部分分成图层 (layers) 的技术，而这个技术会在合成线程 (compositor thread)  这个单独的线程执行。
   - 在这个过程完成之后，还会再产生一个图层树 (layer tree)，最终才会渲染到画面上

**回流必将引起重绘，重绘不一定会引起回流**

**定义**

  - 回流：当元素的尺寸、位置或某些属性发生变化时，浏览器需要重新计算元素的几何属性以及页面的排版和布局，这个过程称为回流。
    - 回流会导致页面的重新渲染，影响性能。
  - 重绘：当元素的外观属性, 即样式, 发生变化，但没有改变其几何属性时，浏览器只需要重新绘制元素的外观，这个过程称为重绘。
    - 重绘不会影响页面的布局，但会影响视觉效果。
  

会导致回流的操作：
- 页面首次渲染
- 浏览器窗口大小发生改变
- 元素尺寸或位置发生改变
- 元素内容变化（文字数量或图片大小等等）
- 元素字体大小变化
- 添加或者删除可见的DOM元素
- 激活CSS伪类（例如：:hover）
- 查询某些属性或调用某些方法
  

#### 如何避免回流和重绘
**CSS**
- 避免使用table布局
  - 对Render Tree的计算通常只需要遍历一次就可以完成，但table及其内部元素除外，他们可能需要多次计算，通常要花3倍于同等元素的时间
- 尽可能在DOM树的最末端改变class
  - 在最小的需要改变样式的标签处修改class样式，然不是上面的父级等
-  避免设置多层内联样式
- 将动画效果应用到position属性为absolute或fixed的元素上
  - 绝对定位已经脱离文档流了, 会给元素创建一个单独的图层，不会影响到其他图层的元素
- 避免使用CSS表达式（例如：`calc()`）

**JS**
- 避免频繁操作样式，最好一次性重写style属性，或者将样式列表定义为class并一次性更改class属性。
- 避免频繁操作DOM，创建一个documentFragment，在它上面应用所有DOM操作，最后再把它添加到文档中。
- 也可以先为元素设置display: none，操作结束后再把它显示出来。因为在display属性为none的元素上进行的DOM操作不会引发回流和重绘。