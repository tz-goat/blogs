## 面试流程
1. 自我介绍
2. 八股文提问
3. 工作经验+项目相关
4. 最后10分钟反问

自己做的不好的地方有
1. 移动端适配问题答的特别差
2. CSS相关问题准备的不是很充分
3. TypeScript更是一个都不会, 这里感觉给面试官印象很不好
4. 回流和重绘问题回答得很模糊, 但是其实在浏览器那个章节里我学过的
   
## 面试问题

### CSS相关
#### 盒模型的box-sizing
  有两个值：content-box, border-box
  - 默认是content-box
  - 如果设置为border-box，则width和height包括了padding和border
#### 水平垂直居中有哪些方式

参考：[CSS-水平居中、垂直居中、水平垂直居中](https://segmentfault.com/a/1190000014116655)

先理解清楚问题，水平垂直居中包含水平居中和垂直居中

所以有以下几种方法

  
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
1. 方法2：绝对定位+负margin
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
1. 方法3：绝对定位+transform
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
1. 方法4：flex布局
```css
    div{
        display: flex;
        justify-content: center;
        align-items: center;
    }
```
1. 方法5：grid布局
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


### JavaScript
#### 判断一个变量是不是数组有哪些方法
1. `Array.isArray()`
2. `Object.prototype.toString.call([]) === '[object Array]'`
3. `[] instanceof Array`
   1. 注意 `[] instanceof Object` 也为true
4. `constructor`
```js
    [].constructor.toString().includes('Array')
    // 'function Array() { [native code] }'
```
5. `Array.prototype.isPrototypeOf([])`


####  有没有了解过类数组或者伪数组,即arraylike这个概念
一些JavaScript对象, 如`document.getElementsByTagName()`返回的`NodeList`对象, 以及函数参数arguments, 都是类数组, 虽然有与数组相似的行为, 但它们并不共享数组所有的方法,
- 比如 arguments对象提供了length属性, 但没有实现forEach的方法
 但是可以通过`Array.prototype.forEach.call()`来调用这个方法
```js
    Array.prototype.forEach.call(arguments, (item) => {
        console.log(item)
    })
```


#### 如何把他们转换成真正的数组
**参考**
-  [JavaScript 类数组对象与 arguments](https://juejin.cn/post/6844903711022514184)
-  [使用类数组对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Indexed_collections#%E4%BD%BF%E7%94%A8%E7%B1%BB%E6%95%B0%E7%BB%84%E5%AF%B9%E8%B1%A1)
  

如下的`arrLike`就是一个类数组, 虽然有与数组相似的行为, 但它们并不共享数组所有的方法

可以通过`Array.prototype.slice.call()`或者`Array.prototype.splice.call()`来转换成真正的数组, 注意后者会改变原先的类数组对象


```js
var arrLike = {
  0: 'name',
  1: 'age',
  2: 'job',
  length: 3
}
// 使用 call
console.log(Array.prototype.slice.call(arrLike,0));
console.log({arrLike}) // { arrLike: { '0': 'name', '1': 'age', '2': 'job', length: 3 } }
console.log(Array.prototype.splice.call(arrLike,0));  // 会改变原先的类数组对象
console.log({arrLike}) // { arrLike: { length: 0 } }
```

`Array.from()`也可以将类数组转换成真正的数组, 它是专门用来做这个的

Set, Map, NodeList, 以及函数的arguments对象, 都可以使用这个方法转换成真正的数组
```js
console.log(Array.from('foo'));
// Expected output: Array ["f", "o", "o"]

console.log(Array.from([1, 2, 3], (x) => x + x));
// Expected output: Array [2, 4, 6]
```


#### Proxy和Reflect

**参考**
- [es6 深入理解 Proxy 和 Reflect 这对影子兄弟](https://segmentfault.com/a/1190000038188431)
- [MDN-Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy)
  
**Proxy**

Proxy 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。

Proxy可以代理对象的很多行为, 比如拦截对象的属性访问, 函数调用, 以及new操作符, 在Vue3中用于响应式变量的底层实现

Proxy对象接收两个参数, 第一个参数是目标对象, 第二个参数是相应的代理行为
```js
const p = new Proxy(target, handler)
```

**Reflect**

Reflect 是一个内置的对象，它提供了一系列静态方法，用于操作对象。 Reflect 不是一个函数对象，不能被当作构造函数使用。Reflect 的所有方法都是静态方法。

Reflect 对象提供的方法与 Proxy 对象的方法一一对应


Reflect 中文解释可以是映射,也正好说明其设计初衷。

简单来说 Proxy 对象代理并拦截目标对象特定行为,而这些行为都有其默认行为,而 Reflect 对象就是方便可以实现这些默认行为,Proxy 有多少拦截类型,Reflect 就实现了多少对应类型的映射函数

```js
// Proxy的处理器函数
handler.apply()
handler.get()
handler.set()

// Reflect的静态方法
Reflect.apply()
Reflect.get()
Reflect.set()
```



### TypeScript

#### interface与type的区别

- interface命令与type命令作用类似，都可以表示对象类型
它们的区别有

1. `type`可以声明基本类型, 联合类型, 元组等, 而`interface`只能表示对象类型（包括数组、函数等）。
2. `interface`可以继承其他类型，`type`不支持继承。
   1. 继承的主要作用是添加属性，`type`定义的对象类型如果想要添加属性，只能使用`&`运算符，重新定义一个类型。
   2. 从扩展方式上，interface 用 extends 扩展，type 用 & 交叉类型扩展。
```ts
type Animal = {
name: string
}

type Bear = Animal & {
  honey: boolean
}

interface Animal {
  name: string
}

interface Bear extends Animal {
  honey: boolean
}

```
3. 同名`interface`会自动合并，同名`type`则会报错。
   1. 也就是说，TypeScript 不允许使用`type`多次定义同一个类型。
```ts
interface A { foo:number };
interface A { bar:number };

const obj:A = {
  foo: 1,
  bar: 1
};
type A = { foo:number }; // 报错
type A = { bar:number }; // 报错

```

4. `interface`不能包含属性映射（mapping），`type`可以
```ts
interface Point {
  x: number;
  y: number;
}

// 正确
type PointCopy1 = {
  [Key in keyof Point]: Point[Key];
};

// 报错
interface PointCopy2 {
  [Key in keyof Point]: Point[Key];
};
```

5. `this`关键字只能用于`interface`

```ts
interface Foo {
    add(num:number): this;
};

type Foo1 = {
  add(num:number): this; 
  //error TS2526: A 'this' type is available only in a non-static member of a class or interface.
};
```
6. type 可以扩展原始数据类型，interface 不行。
```ts
// 正确
type MyStr = string & {
  type: 'new'
};

// 报错
interface MyStr extends string {
  type: 'new'
}

```

7. interface无法表达某些复杂类型（比如交叉类型和联合类型），但是type可以。
```ts
type A = { /* ... */ };
type B = { /* ... */ };

type AorB = A | B;
type AorBwithName = AorB & {
  name: string
};
```
如上, type可以用来创建联合类型, 通过&运算符来创建交叉类型

#### 常用类型工具

1. Required 必选属性: 将对象中所有属性变为必选
```ts
interface Todo {
  title: string;
  description?: string;
}

type TodoRequired = Required<Todo>;

// 结果:
// {
//   title: string;
//   description: string;
// }
```

2. Partial 可选属性: 将对象中所有属性变为可选
```ts
interface Todo {
  title: string;
  description?: string;
}

type TodoPartial = Partial<Todo>;

// 结果:
// {
//   title?: string;
//   description?: string;
// }
``` 

3. Readonly 只读属性: 将对象中所有属性变为只读
```ts
interface Todo {
  title: string;
  description?: string;
}

type TodoReadonly = Readonly<Todo>;

// 结果:
// {
//   title: string;
//   description: string;
// }
```

4. Pick 选择属性: 选择对象中的某些属性
```ts
interface Todo {
  title: string;
  description?: string;
} 

type TodoPick = Pick<Todo, 'title'>;

// 结果:
// {
//   title: string;
// }
``` 

5. Omit 忽略属性: 忽略对象中的某些属性

Omit的作用是：以一个定义好的类型位基础，踢出指定的属性，重新生成一个类型！

```ts
interface Todo {
  title: string;
  description?: string;
}  

type TodoOmit = Omit<Todo, 'description'>;

// 结果:
// {
//   title: string;
// }
``` 

1. Exclude 排除属性: 排除对象中的某些属性

Exclude的作用是：从联合类型UnionType中排除一个类型ExcludedMembers, 即返回联合类型中不包含ExcludedMembers的类型, 效果如下
```ts
interface Todo {
  title: string;
  description?: string;
}   

type TodoExclude = Exclude<'title' | 'description', 'description'>; 

// 结果:
// {
//   title: string;
// }
``` 
```ts
type A = 'a' | 'b' | 'c';
type B = 'a' | 'd';


type C = Exclude<A, B>; // 'b' | 'c'  
```


