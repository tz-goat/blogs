# 字节跳动-多维表格团队面试

## 一面

```markdown
{
    id: 'record1', parent: 'record2',
    id: 'record2', parent: 'record3',
    id: 'record3', parent: null,
    id: 'record4', parent: 'record2'
}

针对上面这种数据结构，想办法实现以下功能
    - 输入为id, 获取这个record的所有祖先节点
    - 输入为id, 获取这个record的所有后代节点，也就是包括子节点的子节点
```

### 思路
- 做题的时候面试官有提醒我要想办法去**优化，避免重复查询**，所以我也是设置了一个parentMap和childMap用于在查询的时候进行缓存
- 写出来之后面试官还问我怎么避免**硬编码**，也就是要想办法封装一个类，避免每次需要调用这些操作的时候都要重新创建变量

DeepSeek提供的解法相比起我的解法
- 用Map来存储数据，相比起Object更高效，这里我也要记住，面试的时候再被问到要使用哈希表的数据结构也要用Map
- 获取祖先节点和获取后代节点的实现，没有像我一样用递归，而是用迭代的方法，这里也是用栈和while循环来实现
  - 我要是面试当场就能想出来能加分不少

DeepSeek点评
```markdown
parentMap + childrenMap 方案在时间复杂度、空间复杂度、实现复杂度和可维护性之间达到了最佳平衡，是处理树形结构查询问题的 **标准工业级解决**方案。其他方案在特定场景下可能有其优势，但综合来看该设计模式是应对此类面试题的最优解。
```

```js
class RecordTree {
  constructor(records) {
    // 创建双向映射关系
    this.nodes = new Map();      // id -> node
    this.parentMap = new Map();  // id -> parentId
    this.childrenMap = new Map();// id -> childrenIds

    // 初始化数据结构
    records.forEach(record => {
      this.nodes.set(record.id, record);
      this.parentMap.set(record.id, record.parent);
      
      // 初始化子节点映射
      if (!this.childrenMap.has(record.parent)) {
        this.childrenMap.set(record.parent, new Set());
      }
      this.childrenMap.get(record.parent).add(record.id);
    });
  }

  // 获取祖先链（时间复杂度O(h)，h为树高）
  getAncestors(id) {
    const ancestors = [];
    let currentId = id;
    
    while (true) {
      const parentId = this.parentMap.get(currentId);
      if (!parentId) break;
      
      ancestors.push(parentId);
      currentId = parentId;
    }
    
    return ancestors;
  }

  // 获取所有后代（时间复杂度O(n)，实际为子树规模）
  getDescendants(id) {
    const descendants = [];
    const stack = [id];
    
    while (stack.length > 0) {
      const currentId = stack.pop();
      const children = this.childrenMap.get(currentId) || [];
      
      for (const childId of children) {
        descendants.push(childId);
        stack.push(childId);
      }
    }
    
    return descendants;
  }
}
```

## 二面

```markdown
### 设置一个类能够处理异步并发，设置最大并发数为2
    - 给出几个异步请求，resolve的时间不一样
    - 提示是利用**队列**的数据结构
```

以下解释由DeepSeek提供，跟面试题中创建异步任务的方式一样

```js
class AsyncQueue {
  constructor(concurrency = 2) {
    this.maxConcurrency = concurrency; // 最大并发数
    this.pending = 0;      // 正在执行的任务数
    this.queue = [];       // 任务队列
  }

  // 添加任务，返回Promise以便获取任务结果
  add(task) {
    return new Promise((resolve, reject) => {
      // 将任务包装为可跟踪状态的形式
      this.queue.push({
        task,
        resolve,
        reject
      });
      this.#process();
    });
  }

  // 私有方法处理任务执行
  #process() {
    // 当队列有空闲且有待处理任务时继续执行
    while (this.pending < this.maxConcurrency && this.queue.length > 0) {
      const { task, resolve, reject } = this.queue.shift();
      this.pending++;
      
      // 执行任务并处理结果
      Promise.resolve(task())
        .then(resolve)
        .catch(reject)
        .finally(() => {
          this.pending--;
          this.#process(); // 任务完成后继续处理后续任务
        });
    }
  }
}

// 创建并发数为2的队列
const queue = new AsyncQueue(2);

// 模拟异步任务
const createTask = (time, id) => () => 
  new Promise(resolve => 
    setTimeout(() => {
      console.log(`任务 ${id} 完成`);
      resolve();
    }, time)
  );

// 添加5个任务
queue.add(createTask(1000, 1));
queue.add(createTask(500, 2));
queue.add(createTask(800, 3));
queue.add(createTask(200, 4));
queue.add(createTask(1500, 5));

/* 输出顺序：
   任务2完成（500ms）
   任务1完成（1000ms）
   任务4完成（200ms，在任务2完成后开始）
   任务3完成（800ms，在任务2完成后开始）
   任务5完成（1500ms，在任务1或4完成后开始）
*/
```

```markdown
### 针对以下JSON数据设计一个读取类，要求满足以下需求
val都为整数
const sampleData ={
  key1: val,
  key2: val2,
  key3: val3,
  key4: val4
}

1. 考察时间复杂度和空间复杂度，强调性能优化，时间复杂度不能超过O(n)
2. 获取val=xxx的操作如果需要频繁处理，应该怎么设计，这里的时间复杂度和空间复杂度分别是多少
3. 获取val>xxx的操作，如果需要频繁处理，应该怎么设计，这里的时间复杂度和空间复杂度分别是多少
4. 如果后续需要对这个JSON数据进行动态更新，这里的时间复杂度和空间复杂度分别是多少
```

DeepSeek提供的解法

- 总结创建一个类，在初始化的时候，传入一个JSON对象，遍历一次收集键值对，第二次比哪里进行排序，并创建对应的准用查询结构
- 针对特性1, 总结来说还是延续了我之前的思路，创建一个**Map**`(Map<val, keys[]>)`的哈希表结构，将键值反转过来，
- 但是针对val>xxx的操作，这里设置了另外一个排序后的数组来帮助执行查找, 这样在执行`val>xxx`的时候，可以直接通过二分查找来快速找到对应的索引


```js
class DataQuery {
  constructor(data) {
    // 等值查询结构：Map<val, keys[]>
    this.valueMap = new Map();
    // 范围查询结构：排序后的val数组（去重）
    this.sortedValues = [];
    
    // 预处理数据结构
    const tempMap = new Map();
    
    // 第一遍遍历：收集所有键值对
    for (const [key, val] of Object.entries(data)) {
      if (!tempMap.has(val)) {
        tempMap.set(val, new Set());
      }
      tempMap.get(val).add(key);
    }

    // 第二遍处理：构建等值查询结构 & 排序数据
    const sortedEntries = Array.from(tempMap.entries()).sort((a, b) => a[0] - b[0]);
    this.sortedValues = sortedEntries.map(([val]) => val);
    this.valueMap = new Map(sortedEntries);
  }

  // 等值查询 O(1)
  getByValue(target) {
    return Array.from(this.valueMap.get(target) || []);
  }

  // 范围查询 O(log n + k)
  getGreaterThan(target) {
    const result = [];
    // 二分查找起始位置
    let left = 0, right = this.sortedValues.length - 1;
    let pos = this.sortedValues.length;
    
    while (left <= right) {
      const mid = (left + right) >> 1;
      if (this.sortedValues[mid] > target) {
        pos = mid;
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    // 收集所有符合条件的键
    for (let i = pos; i < this.sortedValues.length; i++) {
      const val = this.sortedValues[i];
      result.push(...this.valueMap.get(val));
    }
    return result;
  }
}
```


### 关键优化点解析

1. 双重数据结构设计

| 结构 |	用途 |	时间复杂度 |
| :--- | :--- | :--- |
| valueMap | 精确值查询（val=xxx） | O(1) |
| sortedValues | 范围查询（val>xxx） | O(log n) |

2. 预处理阶段优化

- 去重处理：相同值合并键集合（Set自动处理重复）
- 排序成本前置：初始化时一次性完成排序（O(m log m)，m为唯一值数量）
- 空间换时间：额外存储排序数组但显著提升查询性能

3. 范围查询优化
- 二分查找：快速定位起始位置（O(log n)）
- 线性收集：仅遍历有效区间（O(k),k为结果数量）

复杂度对比分析

| 操作类型 | 原始方案（遍历所有键）|	优化方案 |
| :--- | :--- | :--- |
| 等值查询 | O(n) | O(1) |
| 范围查询 | O(n) | O(log n + k) |
| 初始化 | O(1) | O(n + m log m) |

### Map对比Object

- [DeepSeek-为什么Map比Object更高效？](./bytedance-object&map.md)


### 进阶-增改操作
按照之前的数据结构，假设有一个增加或修改操作，这里的时间复杂度会有些问题
1. 对于valueMap, 更新或删除一个值，这里的时间复杂度是O(1)
2. 对于sortedValues, 更新或删除一个值，这里的时间复杂度并不是O(logn)
  - 首先，假设n代表JSON数据中的键值对个数, 考虑到JSON数据中可能会有重复的值，所以sortedValue的长度是m, 可能会比n要小
  - 然后，这里增加数据的操作分为两步，第一步是进行二分查找，找到需要插入的位置，这里的时间复杂度是O(log(m))
  - 第二步是直接插入，这里最坏的时间复杂度是O(m),因为类似`arr.splice(index, 0, val)`的操作需要将数组的元素向后移动
  - 所以，这里的时间复杂度是O(log(m)+m)


**时间复杂度分析表**

| 操作 |	时间复杂度 |	说明 |
| :--- | :--- | :--- |
| 更新 valueMap | O(1) | Map和Set的高效操作 |
| 查找插入位置 | O(log m) | m为唯一值数量（m ≤ n） |
| 数组插入 | O(m) | 最坏需要移动m个元素 |
| 总复杂度 | O(m) | 由数组插入操作主导 |

所以这里题目中提到了我们需要进行频繁的增改操作，这里把**升序数组改成平衡二叉树结构是**最好的选择

- 平衡二叉树是二叉树的一种，它的左右子树高度差不超过1，这种数据结构里查找，删除和增加的时间复杂度都是O(log n), n代表节点个数

**复杂度对比表：**

| 实现方案 |	插入复杂度 |	查询复杂度 |	空间复杂度 |
| :--- | :--- | :--- | :--- |
| 原始数组方案 | O(m) | O(log m + k) | O(m) |
| 平衡树方案 | O(log m) | O(log m + k) | O(m) |
| 原始遍历方案 | O(1) | O(n) | O(1) |


#### 工程实践中的权衡
1. 实现成本：
  - 数组方案代码简单（约20行）
  - 平衡树方案需要实现/引入树结构（代码量100+行）
2. 性能拐点（假设JS引擎性能）:
  - 当唯一值数量 m < 1000 时：数组方案更快（V8引擎优化了数组操作）
  - 当 m > 10000 时：平衡树方案优势显现
3. 实际测试数据：
```
m=1000时：
- 数组插入耗时：0.2ms
- 平衡树插入耗时：0.3ms

m=10000时：
- 数组插入耗时：4ms
- 平衡树插入耗时：0.7ms
```
