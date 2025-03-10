## 自我介绍

1. 简单进行一下自我介绍
   - ima copilot这个业务线去年开始，之前的业务主要围绕QQ浏览器开始

2. 然后讲解了一下部门情况
3. 然后我这边进行自我介绍
   - 还是问一下之前为什么离职

## 简历拷打

```markdown
负责设计编写系统后台的日志上报，并通过后台日志监控系统管理线上项目运行状况，及时响应异常并解决线上问题
```
- 监控了什么
- 日志都上报了什么
- 指标有哪些，具体指标
- 怎么编写的？


```markdown
设计高效的持续集成 CI 流水线，自动化代码构建，发布上线前制定回滚策略，以应对线上异常等紧急情况
```
- 高效体现在哪？
- 回滚策略怎么制定和执行的？
- **在CI里面是怎么实现的**

```markdown
在所在团队中多次进行知识分享演讲，提升了整体开发的效率
```
- 这里他就问了一下怎么提升开发效率，提升了工作效率
- 这里我之前在掘金写的文章就发挥作用了，好好吹了一下，展现了我写的文章还有，然后继续介绍Arc浏览器的特性还有快速启动器Raycast

## 技术问题
### 使用 HTML、CSS 和 JavaScript 实现一个简单的时钟，包括分针和秒针

反思：没有考虑到通过现有时间对象`new Date()`来精确地反应现在的时间
  - 获取当前的`hour`, `minutes`, `seconds`来决定时针转动的角度
  - 然后每1秒更新一次，这样就不用花时间计算
  ```js
  setInterval(updateClock, 1000);
  ```
  - 关于样式：结合时钟半径，和时针的长度来决定`top`的取值
  - `transform` 执行相对动画，允许你对元素进行旋转、缩放、移动和倾斜等操作
  - `transform-origin`：决定动画，属性定义了元素的旋转点（或称为基点）。默认情况下，元素的旋转点是元素的中心点`（50%, 50%）`

**实例代码：**

1. [时钟-个人解法](./tencent-clock-1.html)
2. [时钟-豆包解法](./tencent-clock-2.html)

### 根据data中的键对，替换template中的变量
   ```template = 'aaa {{b}} ccc {{d}}'， data = {b: 'hello', d: 'world'}```

解法如下

使用**正则表达式**可以一次性匹配所有`{{...}}`的模式，然后通过替换函数根据匹配到的键去`data`中查找对应的值。这样只需要一次替换操作，效率更高

```js
function renderTemplate(template, data) {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => 
    data.hasOwnProperty(key) ? data[key] : ''
  );
}

const template = 'aaa {{b}} ccc {{d}}'
const data = {b: 'hello', d: 'world'}
console.log(renderTemplate(template, data))
```

```js
'abc'.replace('a', 'd') // 'dbc'
'abc'.replace(/\w/g, (match) => match + match) // 'aabbcc'
```

**进阶**

- 安全防护-防止原型链污染

```js
// 防止原型链污染
const safeData = Object.create(null);
Object.assign(safeData, data);
```

- XSS防护
```js
function safeRender(template, data) {
  const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
  };
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = data[key] || '';
    return String(value).replace(/[&<>]/g, m => escapeMap[m]);
  });
}
```


### HTTP缓存
   - 强缓存和协商缓存，以及相关的响应头
4. HTTPS的通信过程
   - 这里可以忽略TCP三次握手，直接说HTTPS的通信过程，主要讲讲HTTPS证书



