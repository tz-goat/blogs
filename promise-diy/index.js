class MyPromise {
    constructor(executor) {
      this.status = 'pending';
      this.value = undefined;
      this.reason = undefined;
  
      this.onFulfilledCallbacks = [];
      this.onRejectedCallbacks = [];
  
      const resolve = (value) => {
        if(this.status !== 'pending') return;
        this.status = 'fulfilled';
        this.value = value;
        this.onFulfilledCallbacks.forEach(callback => callback());
      }
  
      const reject = (reason) => {
        if(this.status !== 'pending') return;
        this.status = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(callback => callback());
      }
  
      try {
        executor(resolve, reject);
      } catch (error) {
        reject(error);
      }
    }
  }
  
  const then = function(fn1, fn2){
      
  }
  
  const p1 = new MyPromise((resolve, reject) => {
      // resolve(100)
      // reject('Err')
      setTimeout(() => {
          resolve(100)
      },1000)
  })
  console.log(p1)