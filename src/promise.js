
function p(fn){
  // 
}
p.prototype.then = function(fn){
  fn(resolve)
  return this
}
p.prototype.reject = function(fn){
  fn(reject)
  return this
}