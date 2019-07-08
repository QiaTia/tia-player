// 定义Promise的三种状态常量
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'
const isFunction = variable => typeof variable === 'function'
/**
 * @description: 实现兼容IE的 Promise
 * @param {type} 
 * @return: 
 */
class myPromise {
  constructor(Fn) {
    if (!isFunction(Fn)) {
      throw new Error('Promise resolver  is not a function')
    }
    // 添加状态
    this._status = PENDING
    // 添加状态
    this._value = undefined
    // 添加成功回调函数队列
    this._fulfilledQueues = []
    // 添加失败回调函数队列
    this._rejectedQueues = []
    try{
      setTimeout(Fn(this._resolve.bind(this), this._reject.bind(this)),0)
    }catch(e){
      this._reject(e)
    }
  }
  _resolve(val){
    if (this._status !== PENDING) return
    const run = () => {
      this._status = FULFILLED
      this._value = val
      let cb;
      while (cb = this._fulfilledQueues.shift()) {
        cb(val)
      }
    }
    // 为了支持同步的Promise，这里采用异步调用
    setTimeout(() => run(), 0)
  }
  _reject(e){
    if (this._status !== PENDING) return
    // 依次执行失败队列中的函数，并清空队列
    const run = () => {
      this._status = REJECTED
      this._value = e
      let cb;
      while (cb = this._rejectedQueues.shift()) {
        cb(e)
      }
    }
    // 为了支持同步的Promise，这里采用异步调用
    setTimeout(run, 0)
  }
  then(Fn){
    const { _value, _status } = this
    switch (_status) {
      // 当状态为pending时，将then方法回调函数加入执行队列等待执行
      case PENDING:
        this._fulfilledQueues.push(Fn)
        break
      // 当状态已经改变时，立即执行对应的回调函数
      case FULFILLED:
        Fn(_value)
        break
      case REJECTED:
        this._reject(_value)
        break
    }
    // 返回一个新的Promise对象
    return this
  }
  catch(Fn){
    const { _value, _status } = this
    switch (_status) {
      // 当状态为pending时，将then方法回调函数加入执行队列等待执行
      case PENDING:
        this._rejectedQueues.push(Fn)
        break
      // 当状态已经改变时，立即执行对应的回调函数
      case FULFILLED:
        this._resolve(_value)
        break
      case REJECTED:
        Fn(_value)
        break
    }
    // 返回一个新的Promise对象
    return this
  }
}

((w)=>{
  w.Promise || (w.Promise = myPromise)
})(window)