/**
 * @description: 全局Toats方法
 * @param {type} 
 * @return: this
 */
function toast (data){
  if(!data) return this
  typeof data == 'string'&&(data = {title: data})
  return this.init({duration: 3000,icon: 'none',...data})
}
toast.prototype.init=function(param){
  const id = 'via_' + Math.round(Math.random() * 9999),
    div = document.createElement("div");
  div.innerHTML = `<i class="tia-icon ${param.icon}">${this.icon[param.icon]||''}</i><p>${param.title}</p>`
  div.setAttribute("id", id);
  div.setAttribute('class','tia-toast');
  document.body.appendChild(div);
  this.Dom = document.getElementById(id)
  setTimeout(()=>{
    this.Dom.style.bottom = 0
  },0)
  param.duration&&setTimeout(()=>this.hide(), param.duration)
}
toast.prototype.icon = {
  load: `<svg t="1561855857132" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5530" width="200" height="200"><path d="M512 0a51.2 51.2 0 0 1 51.2 51.2v153.6a51.2 51.2 0 0 1-102.4 0V51.2a51.2 51.2 0 0 1 51.2-51.2z m362.0352 149.9648a51.2 51.2 0 0 1 0 72.3968L765.44 330.9568a51.2 51.2 0 0 1-72.3968-72.3968l108.544-108.5952a51.2 51.2 0 0 1 72.448 0zM1024 512a51.2 51.2 0 0 1-51.2 51.2h-153.6a51.2 51.2 0 0 1 0-102.4h153.6a51.2 51.2 0 0 1 51.2 51.2z m-149.9648 362.0352a51.2 51.2 0 0 1-72.3968 0l-108.5952-108.5952a51.2 51.2 0 0 1 72.3968-72.3968l108.5952 108.544a51.2 51.2 0 0 1 0 72.448zM512 1024a51.2 51.2 0 0 1-51.2-51.2v-153.6a51.2 51.2 0 0 1 102.4 0v153.6a51.2 51.2 0 0 1-51.2 51.2z m-362.0352-149.9648a51.2 51.2 0 0 1 0-72.3968l108.5952-108.5952a51.2 51.2 0 1 1 72.3968 72.3968l-108.544 108.5952a51.2 51.2 0 0 1-72.448 0zM0 512a51.2 51.2 0 0 1 51.2-51.2h153.6a51.2 51.2 0 1 1 0 102.4H51.2a51.2 51.2 0 0 1-51.2-51.2z m149.9648-362.0352a51.2 51.2 0 0 1 72.3968 0L330.9568 258.56A51.2 51.2 0 1 1 258.56 330.9568L150.016 222.4128a51.2 51.2 0 0 1 0-72.448z" p-id="5531"></path></svg>`
}
toast.prototype.hide=function(){
  this.Dom.style.bottom = -this.Dom.offsetHeight+'px'
  setTimeout(()=>(this.Dom.parentNode.removeChild(this.Dom)),300)
}


// modules.exports = (options)=> new toast(options)
export default function (options){
  return new toast(options)
}