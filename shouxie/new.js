function myNew(Func, ...args) {
    // 1.设置一个空对象
    const instance = {};

    // 2. 修改空对象的原型：传入的原型存在prototype
    if (Func.prototype) {
        Object.setPrototypeOf(instance, Func.prototype);
    }
    // 3. 这里结合传入参数args一起调用instance的初始化函数，获取新的对象
    const res = Func.apply(instance, args);

    // 4. 如果判断res不为空就返回，不然就直接返回新对象
    if (typeof res === 'function' || (typeof res === 'object' && res !== null)) {
        return res;
    }
    return instance;
}

// 测试
function Person(name) {
    this.name = name;
}
Person.prototype.sayName = function () {
    console.log(`My name is ${this.name}`);
};
const me = myNew(Person, 'Jack');
me.sayName();
console.log(me);
