class MyPromise {
    state = 'pending';
    value = undefined;
    reason = undefined;
    onFulfilledCallbacks = [];
    onRejectedCallbacks = [];

    constructor(fn) {
        const resolveHandler = value => {
            if (this.state == 'pending') {
                this.state = 'fulfilled';
                this.value = value;
                this.onFulfilledCallbacks.forEach(fn => fn(this.value));
            }
        };

        const rejectHandler = reason => {
            if (this.state === 'pending') {
                this.state = 'rejected';
                this.reason = reason;
                this.onRejectedCallbacks.forEach(fn => fn(this.reason));
            }
        };

        try {
            fn(resolveHandler, rejectHandler);
        } catch (error) {
            rejectHandler(error);
        }
    }

    catch(fn) {
        return this.then(null, fn);
    }

    then(fn1, fn2) {
        fn1 = typeof fn1 === 'function' ? fn1 : v => v;
        fn2 = typeof fn2 === 'function' ? fn2 : e => e;

        if (this.state === 'pending') {
            const p0 = new MyPromise((resolve, reject) => {
                this.onFulfilledCallbacks.push(() => {
                    try {
                        const value = fn1(this.value);
                        resolve(value);
                    } catch (err) {
                        reject(err);
                    }
                });
                this.onRejectedCallbacks.push(() => {
                    try {
                        const newReason = fn2(this.reason);
                        reject(newReason);
                    } catch (err) {
                        reject(err);
                    }
                });
            });
            return p0;
        }

        if (this.state === 'fulfilled') {
            const p1 = new MyPromise((resolve, reject) => {
                try {
                    const value = fn1(this.value);
                    resolve(value);
                } catch (err) {
                    reject(err);
                }
            });
            return p1;
        }

        if (this.state === 'rejected') {
            const p2 = new MyPromise((resolve, reject) => {
                try {
                    const newReason = fn2(this.reason);
                    reject(newReason);
                } catch (err) {
                    reject(err);
                }
            });
            return p2;
        }
    }

    static resolve(value) {
        return new MyPromise(resolve => {
            resolve(value);
        });
    }

    static reject(reason) {
        return new MyPromise((resolve, reject) => {
            reject(reason);
        });
    }

    static all(promiseList = []) {
        const p = new MyPromise((resolve, reject) => {
            const result = [];
            let resolvedCount = 0;
            const len = promiseList.length;

            promiseList.forEach(p => {
                p.then(data => {
                    result.push(data);
                    resolvedCount++;
                    if (resolvedCount === len) {
                        resolve(result);
                    }
                }).catch(err => {
                    reject(err);
                });
            });
        });
        return p;
    }

    static any(promiseList = []) {
        const p = new MyPromise((resolve, reject) => {
            let isResolved = false;
            promiseList.forEach(p => {
                p.then(data => {
                    if (!isResolved) {
                        resolve(data);
                        isResolved = true;
                    }
                }).catch(err => {
                    reject(err);
                });
            });
        });
        return p;
    }

    static race(promiseList = []) {
        const p = new MyPromise((resolve, reject) => {
            promiseList.forEach(p => {
                p.then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
            });
        });
        return p;
    }
}

const p0 = new MyPromise((resolve, reject) => {
    // reject('err');
    resolve(100);
});
// console.log({p0})
const p1 = p0
    .then(data => {
        console.log({ data });
        return data + 1;
    })
    .catch(err => {
        console.log({ err });
    });
// console.log({p1})
const p2 = MyPromise.resolve(200);
const p21 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(201);
    }, 1000);
});
const p3 = MyPromise.reject('made...');
const p31 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        reject('made...');
    }, 500);
});
const p4 = MyPromise.race([p21, p2]);
const p5 = MyPromise.all([p21, p31]);
const p6 = MyPromise.any([p31, p3]);

p4.then(data => {
    console.log('p4', { data });
}).catch(err => {
    console.log('p4', { err });
});
p5.then(data => {
    console.log('p5', { data });
}).catch(err => {
    console.log('p5', { err });
});
p6.then(data => {
    console.log('p6', { data });
}).catch(err => {
    console.log('p6', { err });
});
