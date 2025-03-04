# 店小秘面试

线下：笔试一轮+技术一面一轮+技术二面

## 笔试

**1. 用正则表达式设计一个Email输入框，要求输入符合Email格式**

```markdown
#正则 #html属性 #input #setCustomValidity #pattern #type="email"
```

- 使用`pattern`属性来指定输入框的正则表达式
- 使用`type="email"`来指定输入框的类型为邮箱
- 当输入不符合正则表达式时，input会自动增加invalid伪类，然后我们可以利用这个伪类修改display属性来显示错误信息


```html
<input type="email" pattern="/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/" placeholder="请输入邮箱地址" required>
<span class="error">请输入有效的邮箱地址</span>
```

```css
.error {
    color: red;
    font-size: 14px;
    display: none;
}

input:invalid+.error {
    display: block;
}
```

**2. 手写节流**

**3. 有哪些行内元素和块级元素，怎么进行转换**

**参考：**

- CSS中 块级元素、行内元素、行内块元素区别：https://juejin.cn/post/6998925491797229599

- 首先分析一下块元素和行内元素的区别，然后这里也可以扩展到行内块级元素

**块级元素 block**
- 每个块级元素都是独自占一行；
- 高度，行高，外边距（margin）以及内边距（padding）都可以控制；
- 宽度默认是100%，可以设置宽高

**常见的块级元素包括：**
- div
- h1-h6
- p
- ul
- ol
- li

**行内元素 inline**
- 行内元素不会独占一行，多个行内元素会排列在同一行，直到一行放不下才会换行；
- 设置高度和宽度无效，外边距（margin）以及内边距（padding）的**上下无效，左右有效**；
- 行内元素的高度一般由元素内部的字体大小决定，宽度由内容的长度控制

**常见的行内元素包括：**
- span
- a
- b
- i
- em
- strong
- code

**行内块级元素 inline-block**
- 行内块级元素是既具有行内元素的特性，又具有块级元素的特性
- 行内块级元素在同一行内显示，但是**可以设置宽度和高度**
- 行内块级元素的**上下外边距和内边距都可以控制**

**常见的行内块级元素包括：**
- img
- input
- textarea
- select
- button

面试的时候回答还是把这些当做行内元素来回答，这些元素在一些网上也被认作行内元素，但是我这里还是把他们归类为行内块级元素，因为它们的width和height可以被设置


**4. 同源跨域的实现方法**


## 一面

### 怎么写一个并发处理器的类

```markdown
在JS中实现一个并发异步处理器的类，这个类接受两个参数，第一个参数为一个异步任务数组，第二个参数为最大并发数的数值，需要保证返回的结果顺序是跟传入的输入顺序一致，返回的结果是一个数组，数组中的元素是异步任务的返回值，需要保证返回的结果顺序是跟输入顺序一致

请说下实现思路

- 考虑到我做过文件下载相关的项目和分块下载的背景，所以问了我这个
```

**难点**
- 怎么样依次调用异步任务，这里是否需要用Promise.all
- 这里的最大并发数要怎么使用去限制同时运行的任务数量

DeepSeek解题思路

- 这个类如何控制最大并发数有些**难看懂**，这里其实是在`process`中启动任务的时候就已经决定好了
    - maxConcurrent决定了当前最大并发数， 也就是说如果maxConcurrent是2, 相当于只会运行两个_runTask
    - _runTask方法是用来启动下一个任务的, 只有在任务resolve之后在finally代码块中递归调用

```js
class ConcurrentAsyncProcessor {
  constructor(tasks, maxConcurrent) {
    this.tasks = tasks; // 任务数组（应返回Promise的函数）
    this.maxConcurrent = maxConcurrent; // 最大并发数

    this.results = new Array(tasks.length); // 结果数组

    this.active = 0; // 当前活跃任务数
    this.currentIndex = 0; // 下一个要处理的任务索引

    this.resolve = null; // Promise的resolve回调
    this.reject = null; // Promise的reject回调
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  // 启动任务处理
  process() {
    // 初始启动不超过maxConcurrent的任务
    const initialTasks = Math.min(this.maxConcurrent, this.tasks.length);
    for (let i = 0; i < initialTasks; i++) {
      this._runTask(this.currentIndex);
      this.currentIndex++;
    }
    return this.promise;
  }

  // 执行单个任务
  async _runTask(index) {
    if (index >= this.tasks.length) return;

    this.active++;
    try {
      const task = this.tasks[index];
      const result = await task(); // 执行任务函数并等待结果
      this.results[index] = result; // 存储结果到对应位置
    } catch (error) {
      this.results[index] = error; // 错误处理
    } finally {
      this.active--;
      // 尝试启动下一个任务
      if (this.currentIndex < this.tasks.length) {
        this._runTask(this.currentIndex);
        this.currentIndex++;
      }
      // 所有任务完成时resolve
      if (this.active === 0 && this.currentIndex >= this.tasks.length) {
        this.resolve(this.results);
      }
    }
  }
}

// 示例任务数组（每个任务是一个返回Promise的函数）
const tasks = [
  () => new Promise(resolve => setTimeout(() => resolve('Task 0'), 200)),
  () => new Promise(resolve => setTimeout(() => resolve('Task 1'), 100)),
  () => new Promise(resolve => setTimeout(() => resolve('Task 2'), 300))
];

// 创建处理器实例，最大并发数为2
const processor = new ConcurrentAsyncProcessor(tasks, 2);
processor.process().then(results => {
  console.log(results); // 输出: ['Task 0', 'Task 1', 'Task 2']（顺序与输入一致）
});
```


## 二面

1. 给定两个数a,b 怎么返回一个他们之间的数
```js
function getBetweenNumber(a, b) {
  const contrast = Math.abs(a - b);
  const min = a > b ? b : a;
  return min + Math.floor(contrast * Math.random());
}
```

2. 给一个有固定宽高的边框canvas， 它本身的宽高分别是w0, h0，然后输入一个图片，图片的宽高分别是w1, h1， 请给出具体的缩放比例保证这个图片一定能正好显示在这个边框中

```js
const scale = Math.min(w0 / w1, h0 / h1);   
```

3. 假设有一个类Rect, （l, r, t, b）, 分别代表这个矩形在坐标轴中的左右上下值，怎么判断两个rect类有相交
- 如果有相交，返回相交的rect类的值
- 如果没有返回null
```js
class Rect {
  constructor(l, r, t, b) {
    this.l = l;
    this.r = r;
    this.t = t;
    this.b = b;
  }
}

const intersect = (rect1, rect2) => {
  if (rect1.l > rect2.r || rect1.r < rect2.l || rect1.t > rect2.b || rect1.b < rect2.t) {
    return null;
  }
  return new Rect(
    Math.max(rect1.l, rect2.l),
    Math.min(rect1.r, rect2.r),
    Math.max(rect1.t, rect2.t),
    Math.min(rect1.b, rect2.b)
  );
};
```