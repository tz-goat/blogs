## 面试流程

首先自我介绍，然后几个简单的问答，然那后开始进行笔试题

面试官对我在介绍中提到的效率工具很感兴趣，让我多介绍下，我着重介绍了Arc浏览器和Raycast

他让我多强调下这些工具是**如何帮助提升开发过程中的效率**的， 这里我讲的不是很好

对于用户比较多，几百上千个场景，如何优化你的文件管理系统

## 笔试题目
1. 手写数组扁平化Array.flat的实现，**要求尽可能少创建数组**
- 面试的时候我的实现还是用递归，每个元素都创建一个数组，所以没有满足尽可能少创建数组的要求
- 而且**concat本身也会创建数组**, 不改变原数组的情况下，返回一个新数组
- 后来我在网上搜了一下这个题目，这种情况可以用**栈**来实现

```js
const arr1 = [1, 2, [3, [4, [5]]]]

function flattenArr (arr) {
    const stack = [...arr]
    const result = []
    
    while(stack.length){
        let el = stack.shift()
        // 检查元素是否为Array的方法
        if(Array.isArray(el)){
            stack.unshift(...el)
        }else{
            result.push(el)
        }
    }
    
    return result
}

console.log(flattenArr(arr1))
```
- 扩展：如何检查一个元素是否为数组
```js
// 1. `Array.isArray()`
console.log(Array.isArray([])) // true

// 2. `instanceof`
console.log([] instanceof Array) // true
console.log([] instanceof Object) // true

// 3. 通过对象构造函数的`constructor`判断
console.log([].constructor === Array);  // true
console.log([].constructor === Object);  // false


// 4. `Object.prototype.toString.call()`
console.log(Object.prototype.toString.call([]) === '[object Array]') // true
console.log(Object.prototype.toString.call([]) === '[object Object]') // false
console.log(Object.prototype.toString.call({}) === '[object Object]'); // true

// 5. 通过对象原型链上的isPrototypeOf()判断
console.log(Array.prototype.isPrototypeOf([])) // true
console.log(Object.prototype.isPrototypeOf({})) // true
```


1. 手写Promise.all的实现, **不能用await/async**


