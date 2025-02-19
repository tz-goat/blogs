## slice, splice, substring的区别

### 共同点
slice, splice都是数组Array上的原型方法，
```js
Array.prototype.splice()
Array.prototype.slice()

```

而substring是字符串String上的方法
但是string原型上也有slice方法
```js
String.prototype.substring()
String.prototype.slice()
```

比较之下substring跟slice的参数和返回值更相似
- substring的参数和slice的参数类似，都是start和end，而且substring和slice都不会改变原对象
- 而splice会改变原数组，而且返回值是删除的元素的数组, 它的第一个参数是start, 第二个参数是deleteCount, 代表删除的元素个数
- substring() 方法在 indexStart 大于 indexEnd 的情况下会交换它的两个参数，这意味着仍会返回一个字符串。而 slice() 方法在这种情况下返回一个空字符串。

### slice

#### 总结
slice不会改变原数组，返回一个原数组的浅拷贝

#### 返回值
slice不会改变原数组，返回一个新数组

#### 参数
```js
// 参数说明
// start: 从哪个位置开始, 如果不指定，则从0开始, 如果为负数则从数组末尾开始计算
// end: 到哪个位置结束, 如果为负数，则从数组末尾开始计算, slice方法提取的元素不包括end
slice()
slice(start)
slice(start, end)
```




#### 示例
```js
const arr = [1, 2, 3, 4, 5]
console.log(arr.slice()) // [1, 2, 3, 4, 5]
console.log(arr.slice(0)) // [1, 2, 3, 4, 5]
console.log(arr.slice(1)) // [2, 3, 4, 5]
console.log(arr.slice(1, 3)) // [2, 3]
console.log(arr.slice(-1)) // [5]
console.log(arr.slice(-2, -1)) // [4]
```

### splice

#### 总结

splice会替换或者移除原数组中的元素，并返回被移除的元素
它会改变原数组

#### 返回值
一个包含了删除的元素的数组。

- 如果只移除一个元素，则返回一个元素的数组。
- 如果没有删除任何元素，则返回一个空数组。

#### 参数
```js
// 参数说明
// start: 从哪个位置开始
// deleteCount: 删除多少个元素, 注意这里不填deleteCount跟为0的区别
// - 如果不指定，则删除start位置之后的所有元素, 
// - 如果为0，则不删除,
// item1, item2, /* …, */ itemN: 要插入的元素, 如果不指定，则不插入
splice(start)
splice(start, deleteCount)
splice(start, deleteCount, item1)
splice(start, deleteCount, item1, item2, /* …, */ itemN)
```



#### 示例
```js
// 不指定deleteCount
const arr = [1, 2, 3, 4, 5]
console.log(arr.splice(1)) // [2, 3, 4, 5]
console.log(arr) // [1]
```
```js
// 指定deleteCount
const arr = [1, 2, 3, 4, 5]
console.log(arr.splice(1, 0)) // [], 返回被删除的元素, 即从索引1开始删除0个元素
console.log(arr) // [1, 2, 3, 4, 5]
```

```js
const arr = [1, 2, 3, 4, 5]
console.log(arr.splice(1, 2, 'a', 'b', 'c')) // [2, 3], 返回被删除的元素, 即从索引1开始删除2个元素
console.log(arr) // [1, 'a', 'b', 'c', 4, 5]
```

```js
const arr = [1, 2, 3, 4, 5]
console.log(arr.splice(1, 2))
console.log(arr) // [1, 4, 5]
```



### substring

#### 总结
substring不会改变原字符串，返回一个新字符串

#### 返回值
substring不会改变原字符串，返回一个新字符串

#### 参数
```js
// 参数说明
// indexStart: 开始位置
// indexEnd: 结束位置, 如果不指定，则到字符串末尾
substring(indexStart)
substring(indexStart, indexEnd)

```

#### 示例
```js
const str = 'Hello World'
console.log(str.substring()) // 'Hello World'
console.log(str.substring(0)) // 'Hello World'
console.log(str.substring(1)) // 'ello World'
console.log(str.substring(1, 3)) // 'el'
console.log(str.substring(-1)) // 'd'
console.log(str.substring(1, -1)) // 'H'
console.log(str.substring(-1, 1)) // 'H'
```



