// 理解海螺AI对于异步并发处理器的实现
// 1. 在类中增加一个process方法，这个方法返回一个Promise对象

// 2. 设置一个maxConcurrency参数，表示最大并发数， 然后通过activeCount来记录当前正在执行的异步任务数
// 3. 对于异步任务数组的处理，设置一个while循环，当
//  - activeCount小于maxConcurrency且currentIndex小于total时，启动新的任务
//  - 如果所有任务都已开始且没有活跃的任务，则结束
//  - 使用Promise.resolve来处理每个Promise
//  - 如果任务成功或者失败，都将结果存储在results数组中，并更新activeCount和doneCount
//  - 在while循环结束后，返回results数组

class AsyncTaskProcessor {
    constructor(promises, maxConcurrency) {
        this.promises = promises;
        this.maxConcurrency = maxConcurrency;
        this.results = new Array(this.promises.length);
        this.currentIndex = 0;
        this.activeCount = 0;
        this.doneCount = 0;
    }

    process() {
        return new Promise((resolve, reject) => {
            const total = this.promises.length;

            const processNext = () => {
                // 如果所有任务都已开始且没有活跃的任务，则结束
                if (this.doneCount === total) {
                    resolve(this.results);
                    return;
                }

                // 如果还有空间且还有未开始的任务，则启动新的任务
                while (this.activeCount < this.maxConcurrency && this.currentIndex < total) {
                    const index = this.currentIndex++;
                    let promise = this.promises[index];
                    this.activeCount++;

                    // 处理每个Promise
                    Promise.resolve(promise)
                        .then(result => {
                            this.results[index] = result;
                            this.activeCount--;
                            this.doneCount++;
                            processNext();
                        })
                        .catch(error => {
                            this.results[index] = error;
                            this.activeCount--;
                            this.doneCount++;
                            processNext();
                        });
                }
            };

            // 启动第一批任务
            while (this.activeCount < this.maxConcurrency && this.currentIndex < total) {
                const index = this.currentIndex++;
                let promise = this.promises[index];
                this.activeCount++;

                Promise.resolve(promise)
                    .then(result => {
                        this.results[index] = result;
                        this.activeCount--;
                        this.doneCount++;
                        processNext();
                    })
                    .catch(error => {
                        this.results[index] = error;
                        this.activeCount--;
                        this.doneCount++;
                        processNext();
                    });
            }
        });
    }
}

// 使用示例
const promises = [
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3),
    Promise.resolve(4),
    Promise.resolve(5),
];
const maxConcurrency = 2;

const processor = new AsyncTaskProcessor(promises, maxConcurrency);
processor.process().then(results => {
    console.log(results); // 输出: [1, 2, 3, 4, 5]
});
