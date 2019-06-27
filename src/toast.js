/**
 * @description: 全局Toats方法
 * @param {type} 
 * @return: this
 */
function Toast (data){
  if(!data) return this
  typeof data == 'string'&&(data = {title: data})
  let param= {duration: 3000,icon: 'none',...data}
  // console.log(param)
  return this.init(param)
}
Toast.prototype.init=function(param){
  const id = 'via_' + Math.round(Math.random() * 9999),
    div = document.createElement("div");
  div.innerHTML = `<p style="text-align:center"><i style="icon ${param.icon}"></i>${param.title}</p>`
  div.setAttribute("id", id);
  div.setAttribute('class','tia-toast');
  document.body.appendChild(div);
  this.Dom = document.getElementById(id)
  setTimeout(()=>{
    this.Dom.style.bottom = 0
  },0)
  param.duration&&setTimeout(()=>this.hide(), param.duration)
}
Toast.prototype.hide=function(){
  this.Dom.style.bottom = -this.Dom.offsetHeight+'px'
  setTimeout(()=>(this.Dom.parentNode.removeChild(this.Dom)),300)
}

modules.exports = (options)=> new Toast(options)