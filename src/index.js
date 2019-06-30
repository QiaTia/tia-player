/*
 * @Description: tia-player
 * @Author: QiaTia
 * @Date: 2019-06-25 14:44:34
 * @LastEditors: QiaTia
 * @GitHub: https://github.com/QiaTia/
 * @LastEditTime: 2019-06-30 08:58:37
 */
// import Toast from './toast'
String.prototype.trim = function(){
  return this.replace(/^\s*/, '').replace(/\s*$/, '');
}
String.prototype.pareTime = function(){
	let t = this.split(':')
	return t.map(item=>(item<10?'0'+item:item)).join(':')
}
Object.prototype.map = function(Fn){
	let t = [],j = this.length
	for(let index =0; index<j; index++){
		t[index]= Fn(this[index],index)
	}
	return t
};
/**
 * @description: $http
 * @param {type} 
 * @return: 
 */
(function(w){
  function http(data){
    return http.fn.init(data)
  }
  //1.jQuery原型替换，2.给原型提供一个简写方式
  http.fn = http.prototype = {
    constructor : http,
    version : '19.06.01',
    toArray : function(){
      return [].slice.call(this);
    },
    each : function(fun){
      return jQuery.each(this, fun);
    },
    get : function(index){
      if(index == undefined || index == null){
          return this.toArray();
      }
      if(index >=0 && index < this.length){
          return this[index];
      }
      if(index >= -(this.length - 1) && index < 0){
          return this[this.length + index];
      }else{
          return undefined;
      }
    }
  }
  http.extend = http.fn.extend = function(object){
    for(let key in object){
      this[key] = object[key];
    }
  }
  // Ajax
  http.extend({
    baseUrl:'http://dev.qiatia.cn',
    parseHeaders: function(headers){
      let ignoreDuplicateOf = [
        'age', 'authorization', 'content-length', 'content-type', 'etag',
        'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
        'last-modified', 'location', 'max-forwards', 'proxy-authorization',
        'referer', 'retry-after', 'user-agent'
      ];
      let parsed = {}, key, val, i;
    
      if (!headers) { return parsed; }
    
      headers.split('\n').map(function parser(line) {
        i = line.indexOf(':');
        key = line.substr(0, i).trim().toLowerCase();
        val = line.substr(i + 1).trim()
        if (key) {
          if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
            return;
          }
          if (key === 'set-cookie') {
            parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
          } else {
            parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
          }
        }
      })
      return parsed;
    },
    request: function({url, data, Methods='GET'}){
      if(!url) return false
      return new Promise((resolve,reject)=>{
        /^http[s]?:\/\//.test(url)||(url = this.baseUrl+url)
        data = this.stringify(data);
        Methods == 'GET'&&(url += (url.indexOf('?') === -1 ? '?' : '&') + data)
        let xmlhttp = new XMLHttpRequest()
        xmlhttp.open(Methods,url,true)
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded")
        xmlhttp.send(data)
        xmlhttp.onreadystatechange = function(){
          if (!xmlhttp || xmlhttp.readyState !== 4) {
            return;
          }
          if(xmlhttp.readyState === 4){
            let response = {
              headers: 'getAllResponseHeaders' in xmlhttp ? http.parseHeaders(xmlhttp.getAllResponseHeaders()) : null,
              data: xmlhttp.response || xmlhttp.responseText,
              status: xmlhttp.status,
              requestURL: xmlhttp.responseURL,
              request: xmlhttp
            }
            if(xmlhttp.status !== 200){
              reject(response)
            }
            if(response.data){
              /json/.test(response.headers['content-type'])?resolve(JSON.parse(response.data)):resolve(response.data)
            }
          }
        }
        xmlhttp.onerror = function() {
          // Real errors are hidden from us by the browser
          // onerror should only fire if it's a network error
          reject({msg:'Network Error',config:{url, data, Methods}, xmlhttp})
        }
        xmlhttp.onabort = function() {
          if (!request) {
            return;
          }
          reject({msg:'Request aborted',config:{url, data, Methods}, xmlhttp})
        }
        xmlhttp.ontimeout = function() {
          reject({msg:'timeout of Nam ms exceeded',config:{url, data, Methods}, xmlhttp});
        }
      })
    },
    stringify: function(obj, prefix){
      var pairs = []
      for (var key in obj) {
        if (!obj.hasOwnProperty(key)) {
          continue
        }
        var value = obj[key]
        var enkey = encodeURIComponent(key)
        var pair
        if (typeof value === 'object') {
          pair = queryStringify(value, prefix ? prefix + '[' + enkey + ']' : enkey)
        } else {
          pair = (prefix ? prefix + '[' + enkey + ']' : enkey) + '=' + encodeURIComponent(value)
        }
        pairs.push(pair)
      }
      return pairs.join('&')
    },
    get: function(url, data){
      return this.request({url,data})
    },
    post: function(url, data){
      return this.request({url,data,Methods:'POST'})
    }
  })
  let init = http.fn.init = function(data){
    if(!data) return http
    typeof data == 'string'&&(data = {url: data})
    let param= {data: {}, Methods: 'GET',...data}
    return http.request(param)
  }
  init.prototype = http.fn
  w.$http = http
})(window);

/**
 * @description: 全局Toats方法
 * @param {type} 
 * @return: this
 */
(function(w){
  function toast (data){
    if(!data) return this
    typeof data == 'string'&&(data = {title: data})
    let param= {duration: 3000,icon: 'none',...data}
    // console.log(param)
    return this.init(param)
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
  w.Toast = (options)=> new toast(options)
})(window);

/**
 * @description: $icon
 * @param {type} 
 * @return: 
 */
const icon = {
  play: '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 31"><path d="M15.552 15.168q0.448 0.32 0.448 0.832 0 0.448-0.448 0.768l-13.696 8.512q-0.768 0.512-1.312 0.192t-0.544-1.28v-16.448q0-0.96 0.544-1.28t1.312 0.192z"></path></svg>'
  ,pause: '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 17 32"><path d="M14.080 4.8q2.88 0 2.88 2.048v18.24q0 2.112-2.88 2.112t-2.88-2.112v-18.24q0-2.048 2.88-2.048zM2.88 4.8q2.88 0 2.88 2.048v18.24q0 2.112-2.88 2.112t-2.88-2.112v-18.24q0-2.048 2.88-2.048z"></path></svg>'
  ,fast_rewind: '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M25.468 6.947c-0.326-0.172-0.724-0.151-1.030 0.057l-6.438 4.38v-3.553c0-0.371-0.205-0.71-0.532-0.884-0.326-0.172-0.724-0.151-1.030 0.057l-12 8.164c-0.274 0.186-0.438 0.496-0.438 0.827s0.164 0.641 0.438 0.827l12 8.168c0.169 0.115 0.365 0.174 0.562 0.174 0.16 0 0.321-0.038 0.468-0.116 0.327-0.173 0.532-0.514 0.532-0.884v-3.556l6.438 4.382c0.169 0.115 0.365 0.174 0.562 0.174 0.16 0 0.321-0.038 0.468-0.116 0.327-0.173 0.532-0.514 0.532-0.884v-16.333c0-0.371-0.205-0.71-0.532-0.884z"></path></svg>'
  ,fast_forward: '<svg style="transform:rotate(180deg)" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M25.468 6.947c-0.326-0.172-0.724-0.151-1.030 0.057l-6.438 4.38v-3.553c0-0.371-0.205-0.71-0.532-0.884-0.326-0.172-0.724-0.151-1.030 0.057l-12 8.164c-0.274 0.186-0.438 0.496-0.438 0.827s0.164 0.641 0.438 0.827l12 8.168c0.169 0.115 0.365 0.174 0.562 0.174 0.16 0 0.321-0.038 0.468-0.116 0.327-0.173 0.532-0.514 0.532-0.884v-3.556l6.438 4.382c0.169 0.115 0.365 0.174 0.562 0.174 0.16 0 0.321-0.038 0.468-0.116 0.327-0.173 0.532-0.514 0.532-0.884v-16.333c0-0.371-0.205-0.71-0.532-0.884z"></path></svg>'
  ,menu: '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 22 32"><path d="M20.8 14.4q0.704 0 1.152 0.48t0.448 1.12-0.48 1.12-1.12 0.48h-19.2q-0.64 0-1.12-0.48t-0.48-1.12 0.448-1.12 1.152-0.48h19.2zM1.6 11.2q-0.64 0-1.12-0.48t-0.48-1.12 0.448-1.12 1.152-0.48h19.2q0.704 0 1.152 0.48t0.448 1.12-0.48 1.12-1.12 0.48h-19.2zM20.8 20.8q0.704 0 1.152 0.48t0.448 1.12-0.48 1.12-1.12 0.48h-19.2q-0.64 0-1.12-0.48t-0.48-1.12 0.448-1.12 1.152-0.48h19.2z"></path></svg>'
  ,volume: '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 28 32"><path d="M13.728 6.272v19.456q0 0.448-0.352 0.8t-0.8 0.32-0.8-0.32l-5.952-5.952h-4.672q-0.48 0-0.8-0.352t-0.352-0.8v-6.848q0-0.48 0.352-0.8t0.8-0.352h4.672l5.952-5.952q0.32-0.32 0.8-0.32t0.8 0.32 0.352 0.8zM20.576 16q0 1.344-0.768 2.528t-2.016 1.664q-0.16 0.096-0.448 0.096-0.448 0-0.8-0.32t-0.32-0.832q0-0.384 0.192-0.64t0.544-0.448 0.608-0.384 0.512-0.64 0.192-1.024-0.192-1.024-0.512-0.64-0.608-0.384-0.544-0.448-0.192-0.64q0-0.48 0.32-0.832t0.8-0.32q0.288 0 0.448 0.096 1.248 0.48 2.016 1.664t0.768 2.528zM25.152 16q0 2.72-1.536 5.056t-4 3.36q-0.256 0.096-0.448 0.096-0.48 0-0.832-0.352t-0.32-0.8q0-0.704 0.672-1.056 1.024-0.512 1.376-0.8 1.312-0.96 2.048-2.4t0.736-3.104-0.736-3.104-2.048-2.4q-0.352-0.288-1.376-0.8-0.672-0.352-0.672-1.056 0-0.448 0.32-0.8t0.8-0.352q0.224 0 0.48 0.096 2.496 1.056 4 3.36t1.536 5.056zM29.728 16q0 4.096-2.272 7.552t-6.048 5.056q-0.224 0.096-0.448 0.096-0.48 0-0.832-0.352t-0.32-0.8q0-0.64 0.704-1.056 0.128-0.064 0.384-0.192t0.416-0.192q0.8-0.448 1.44-0.896 2.208-1.632 3.456-4.064t1.216-5.152-1.216-5.152-3.456-4.064q-0.64-0.448-1.44-0.896-0.128-0.096-0.416-0.192t-0.384-0.192q-0.704-0.416-0.704-1.056 0-0.448 0.32-0.8t0.832-0.352q0.224 0 0.448 0.096 3.776 1.632 6.048 5.056t2.272 7.552z"></path></svg>'
  ,panel: '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M26.667 5.333h-21.333c-0 0-0.001 0-0.001 0-1.472 0-2.666 1.194-2.666 2.666 0 0 0 0.001 0 0.001v-0 16c0 0 0 0.001 0 0.001 0 1.472 1.194 2.666 2.666 2.666 0 0 0.001 0 0.001 0h21.333c0 0 0.001 0 0.001 0 1.472 0 2.666-1.194 2.666-2.666 0-0 0-0.001 0-0.001v0-16c0-0 0-0.001 0-0.001 0-1.472-1.194-2.666-2.666-2.666-0 0-0.001 0-0.001 0h0zM5.333 16h5.333v2.667h-5.333v-2.667zM18.667 24h-13.333v-2.667h13.333v2.667zM26.667 24h-5.333v-2.667h5.333v2.667zM26.667 18.667h-13.333v-2.667h13.333v2.667z"></path></svg>'
  ,repeat: '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 29 32"><path d="M9.333 9.333h13.333v4l5.333-5.333-5.333-5.333v4h-16v8h2.667v-5.333zM22.667 22.667h-13.333v-4l-5.333 5.333 5.333 5.333v-4h16v-8h-2.667v5.333z"></path></svg>'
  ,repeat_one: '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 29 32"><path d="M2.667 7.027l1.707-1.693 22.293 22.293-1.693 1.707-4-4h-11.64v4l-5.333-5.333 5.333-5.333v4h8.973l-8.973-8.973v0.973h-2.667v-3.64l-4-4zM22.667 17.333h2.667v5.573l-2.667-2.667v-2.907zM22.667 6.667v-4l5.333 5.333-5.333 5.333v-4h-10.907l-2.667-2.667h13.573z"></path></svg>'
  ,random: '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M22.667 4l7 6-7 6 7 6-7 6v-4h-3.653l-3.76-3.76 2.827-2.827 2.587 2.587h2v-8h-2l-12 12h-6v-4h4.347l12-12h3.653v-4zM2.667 8h6l3.76 3.76-2.827 2.827-2.587-2.587h-4.347v-4z"></path></svg>'
  ,left: '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M22 16l-10.105-10.6-1.895 1.987 8.211 8.613-8.211 8.612 1.895 1.988 8.211-8.613z"></path></svg>'
  ,right: '<svg style="transform:rotate(180deg)" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M22 16l-10.105-10.6-1.895 1.987 8.211 8.613-8.211 8.612 1.895 1.988 8.211-8.613z"></path></svg>'
}

/**
 * @description: 播放器对象函数
 * @param {
 *    id: 歌单id
 *    url: 后台服务url
 *    audio: Html5 audio 对象
 *    lyrics： 当前歌曲歌词组
 *    $lrcView: 当前歌曲歌词 DOM 对象组
 * } 
 * @return: {
 *    id: 当前列表播放id
 *    detail: 当前歌单信息
 * }
 */
function tia(id = 729837165, url = '/'){
  $http.baseUrl = url
  let t = Toast({
    title:'资源准备中',
    icon: 'load',
    duration: 0
  })
  $http.get('playlist/'+id).then((res)=>{
    // console.log(res)
    let detail= this.detail = this.parse(res)
    this.init(detail)
    t.hide()
  }).catch(e=>Toast(e.toString()))
  // this.init(id) 
}
/**
 * @description: 格式化歌单
 * @param {type} 
 * @return: 
 */
tia.prototype.parse = function({playlist,privileges}){
  let list = playlist.tracks.map(({name,ar,al,id})=>{
    return{
      name,
      id,
      artist: ar[0].name,
      pic: al.picUrl,
      src: 'https://music.163.com/song/media/outer/url?id='+id+'.mp3'
    }
  })
  return {
    list,
    name: playlist.name,
    cover: playlist.coverImgUrl,
  }
}
/**
 * @description: 初始化播放器
 * @param {type} 
 * @return: 
 */
tia.prototype.init = function(detail){
  let listInner = ''
  for (let i in detail.list) {
    listInner += '<li data-id="' + i + '">'+detail.list[i].name + '<span class="list-right">' + detail.list[i].artist + '</span></li>'
  }
  // 网页渲控件
  const template = `
    <div class="tia-list"><ol>${listInner}</ol></div>
    <div class="tia-body">
      <div class="tia-pic" id="tia-toggle"><div class="tia-icon music-control icon-play">${icon.play}</div></div>
      <div class="tia-panel">
        <div class="tia-info"><p>${detail.list[0].name}<span class="tia-author"> - ${detail.list[0].artist}</span></p></div>
        <div class="tia-bar-warp"><div class="tia-bar"><span class='bar-control'></span></div>
        <div class='tia-time-info'><span class='tia-now-time'>00:00</span> / <span class='tia-all-time'>00:00</span></div></div>
        <div class="tia-control">
          <span class="tia-icon fast_rewind">${icon.fast_rewind}</span>
          <span class="tia-icon music-control icon-play">${icon.play}</span>
          <span class="tia-icon fast_forward">${icon.fast_rewind}</span>
          <span class="tia-icon volume">${icon.volume}<div class='volume-control'><span></span></div></span>
          <span class="tia-icon order-switch order1" >${icon.repeat}</span>
          <span class="tia-icon menu-switch">${icon.menu}</span>
          <span class="tia-icon lrc-switch">${icon.panel}</span>
        </div>
      </div>
      <div class="panel-switch">${icon.left}</div>
    </div>
    <div class="tia-lrc"><div class="lrc-content"></div></div>
    <audio id="tia-audio" src="${detail.list[0].src}"></audio>`
  var div = document.createElement("div");
  div.setAttribute("id", "Tia");
  div.innerHTML = template;
  document.body.appendChild(div);
  // 初始化自身变量, 开始监听
  this.id = 0
  this.$lrcView = []
  // 音频监听
  this.audio = document.getElementById("tia-audio")
  this.audio.volume = 0.8
  // 时间
  this.$_nowtime = document.getElementsByClassName("tia-now-time")[0]
  this.$_allTime = document.getElementsByClassName("tia-all-time")[0]
  // 封面上按钮 歌曲名 歌词wrap 进度wrap
  this.$_control = document.getElementsByClassName('music-control')
  this.$_title = document.getElementsByClassName("tia-info")[0]
  // 歌词 wrap
  this.$_lrcWrap = document.getElementsByClassName("lrc-content")[0]
  this.$_barControl = document.getElementsByClassName("bar-control")[0]
  // 播放结束 
  let index = 0, i = 0 // 会闭包的播放控制变量 
  // 播放歌词监听
  this.audio.addEventListener("timeupdate", ({target})=>{
    let currentTime = target.currentTime
    if(currentTime > index){
      this.$_barControl.style.width =  ~~(currentTime/this.allTime*100)+'%';
      this.$_nowtime.innerHTML = (~~(currentTime/60)+':'+ ~~(currentTime%60)).pareTime()
      index++
    }
    // 这歌算法可以优化
    if(this.$lrcView[i]&&this.lyrics.length>1) {
      if (currentTime > this.lyrics[i][0]) {
        try {
          this.$_lrcWrap.style.transform = "translateY(-" + (1.2 * i) + "em)";
          this.$lrcView[i].className = 'lrc-cursor';
          i>0&&(this.$lrcView[i - 1].className = '')
        } catch (e) {
          console.log(e)
        }
        i++
      }
    }
  });
  // 播放监听
  this.audio.addEventListener('play', (e)=>{
    // this.onPl
  });
  // 自然暂停监听 <==> 播放下一首
  this.audio.addEventListener('ended', ()=>{
    this.pause()
    i = 0
    index = 0
    this.$_lrcWrap.style.transform = "translateY(0em)";
    Toast('即将播放下一首')
    return this.next()
  }, false);
  // 资源改版监听 ==> 被动下一首
  this.audio.ondurationchange=(e)=>{
    index = 0, i = 0
  }
  // 网速失速  --> 网络状态不良
  this.audio.onstalled=(e)=>{
    Toast({
      title:'网络不太好呢',
      icon: 'load',
      duration: 5000
    })
  }
  // 请求出错时
  this.audio.onerror =(e)=>{
    Toast(e.toString())
    this.next()
  }
  // 播放进度
  this.$('tia-bar').onclick=(e)=>{
    let audio = this.audio
    try{
      let x = this.$DisplayX(e)*audio.duration
      if('fastSeek' in audio){
        audio.fastSeek(x)
      }else{
        audio.currentTime = x
      }
      index = 0
      i = 0
    }
    catch(e){
      Toast(e.toString())
    }
  }
  this.handleBtn()
  // 初始化第一首歌
  return this.player(detail.list[this.id])
}
/**
 * @description: 处理一些按钮监听
 * @param {type} 
 * @return: 
 */
tia.prototype.handleBtn=function(){
  // 监听  封面地图。 播放切换监听
  this.$_Pic = document.getElementById('tia-toggle')
  this.$_Pic.onclick = ()=>(this.toggle())
  // 面版切换 = 监听
  this.$_panelSwitch = document.getElementsByClassName('panel-switch')[0]
  this.$_panelSwitch.onclick = (e)=>{this.panelSwitch(e)}
  // 面板中的播放控制
  this.$_control[1].onclick=()=>{ this.toggle() }
  this.$('fast_forward').onclick=()=>{ this.next() }
  this.$('fast_rewind').onclick=()=>{ this.prev() }
  // 歌词显示
  this.$('lrc-switch').onclick=()=>{
    let t = this.$('tia-lrc')
    if(t.style.height!=='0px') t.style.height = 0
    else t.style.height = '2.5em'
  }
  // 列表切换
  let tia_List
  this.$('menu-switch').onclick=()=>{
    tia_List && (tia_List.className = '') // 清楚上次的信息
    tia_List = document.querySelectorAll('.tia-list>ol>li')[this.id]
    tia_List.className = 'select';
    let t = this.$('tia-list')
    // 跳转到本次播放列表位置
    tia_List&&t.scrollTo(0,tia_List.offsetTop - 100)
    if(t.style.height!=='15em') t.style.height = '15em'
    else t.style.height = 0
  }
  // 音量控制
  this.$('volume-control').onclick=(e)=>{
    let t = this.$DisplayX(e)/2
    console.info(t)
    this.audio.volume = t
    e.target.style.width = t*100+'%'
  }
  // 列表条跳转
  document.querySelectorAll('.tia-list>ol>li').map(item=>{
    item.onclick=({target:{dataset:{id}}})=>{
      this.id = id
      this.player(this.detail.list[id]).then(()=>{
        this.play().then(()=>{
          // this.$('tia-list').scrollTo(0,this.$('select').offsetTop - 100)
        })
      }).catch(e=>{
        Toast(e.toString)
      })
    }
  })
}
/**
 * @description: 面板切换
 * @param {type} 
 * @return: 
 */
tia.prototype.panelSwitch = function(){
  let className = this.$_panelSwitch.className
  if(/on/.test(className)){
    // 关闭
    this.$('tia-list').style.height=0
		this.$('tia-panel').style.width= "0";
    this.$_panelSwitch.className = 'panel-switch'
  }else{
    // 打开
		this.$('tia-panel').style.width= "15.1em";
    this.$_panelSwitch.className = 'panel-switch on'
  }
}
/**
 * @description: 异步获取歌词
 * @param {type} 
 * @return: 
 */
tia.prototype.getlyric = function(id){
  // let mId = this.detail.list[this.id].id
  $http.get('lyric/'+id).then((res)=>{
    // 整理歌词
    if(res.code!==200){
      Toast('歌词搜索失败')
      return;
    }
    // 请求成功 ==> 但是没有歌词
    if(!res.lrc){
      this.parseLyric('[00:00.00] 这是一首没有歌词孤独的歌')
      return;
    }
    this.parseLyric(res.lrc.lyric)
  }).catch(e=>{
    Toast('歌词搜索失败')
    console.warn(e)
  })
}
/**
 * @description: 渲染处理歌词
 * @param {type} 
 * @return: 
 */
tia.prototype.parseLyric= function(lrc){
  let lyrics = decodeURIComponent(lrc).split("\n"),
    result = [];
  for (let i in lyrics) {
    let text = lyrics[i];
    let timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
    let timeRegExpArr = text.match(timeReg);
    if (!timeRegExpArr) continue;
    let clause = text.replace(timeReg, '');
    for (let k = 0, h = timeRegExpArr.length; k < h; k++) {
      let t = timeRegExpArr[k];
      let min = Number(String(t.match(/\[\d*/i)).slice(1)),
        sec = Number(String(t.match(/\:\d*/i)).slice(1)),
        hs = Number(String(t.match(/\.\d*/i)).slice(1));
      let time = min * 60 + sec + '.' + hs;
      result.push([time, clause])
    }
  }
  this.lyrics = result
  // 渲染歌词
  let temp = '<header></header>';
  for (let i in result) {
    temp += '<p>' + result[i][1] + '</p>'
  }
  this.$_lrcWrap.innerHTML = temp
  this.$lrcView = document.querySelectorAll('.lrc-content>p')
  // console.log(this.$lrcView)
}
/**
 * @description: 播放切换
 * @param {type} 
 * @return: 
 */
tia.prototype.toggle = function(){
  // console.info(this.audio.paused)
  if(this.audio.paused) this.play()
  else this.pause()
}
/**
 * @description: 暂停播放
 * @param {type} 
 * @return: 
 */
tia.prototype.pause = function(){
  this.$_control.map(item=>{
    item.innerHTML = icon.play
    item.className = 'tia-icon music-control icon-play'
  })
  return this.audio.pause()
}
/**
 * @description: 播放
 * @param {type} 
 * @return: 
 */
tia.prototype.play=function(){
  return new Promise((resolve, reject)=>{
    this.audio.play().then(()=>{
      // do some thing
      let allTime = this.allTime = this.audio.duration
      this.$_allTime.innerHTML = (~~(allTime/60) +":"+(~~allTime%60)).pareTime()
      this.$_control.map(item=>{
        item.innerHTML = icon.pause
        item.className = 'tia-icon music-control icon-pause'
      })
      resolve()
    }).catch(e=>{
      Toast(e.toString())
      console.warn(e)
      setTimeout(this.next,500)
      reject()
    })
  })
}
/**
 * @description: 下一曲
 * @param {type} 
 * @return: 
 */
tia.prototype.next=function(){
  // 切换歌曲
  let t = this.detail.list[++this.id]
  if(!t){
    Toast('已经最好一首了.')
    t = this.detail.list[this.id=0]
  }
  this.player(t).then(()=>{
    this.play()
  })
}
/**
 * @description: 上一曲
 * @param {type} 
 * @return: 
 */
tia.prototype.prev=function() {
  if (this.id <= 0) {
    Toast('已经第一首了！');
    return false
  }
  let t = this.detail.list[--this.id]
  this.player(t).then(()=>{
    this.play()
  })
}
/**
 * @description: 列表播放
 * @param {type} 
 * @return: 
 */
tia.prototype.player = function(t){
  // if(!t) Toast('已经没有了')
  return new Promise((resolve, reject)=>{
    try {
      this.audio.src = t.src
      this.$_Pic.style.background='url('+t.pic+')'
      this.$_title.innerHTML = '<p>' + t.name + '<span class="via-author"> - ' + t.artist + '</span></p>'
      // 获取歌词
      this.getlyric(t.id)
      // 播放歌曲
      resolve()
    }
    catch(e){
      Toast(e.toString())
    }
  })
}
/**
 * @description: 选择器
 * @param {type} 
 * @return: 
 */
tia.prototype.$=function(val){
  if(/#/.test(val)) return document.getElementById(val)
  return document.getElementsByClassName(val)[0]
}
/**
 * @description: 计算元素点击的宽度百分比
 * @param {
 *  event: 事件
 * } 
 * @return: 
 */
tia.prototype.$DisplayX = function({target,clientX}){
  // console.log(event)
  let left ,parent = target.offsetParent
  left = target.offsetLeft;
  while(parent = parent.offsetParent){
    left+=parent.offsetLeft
  }
  let t = (clientX-left+document.documentElement.scrollLeft)/target.offsetWidth
  return t
}
const $Tia = (options)=>{
  return new tia(options)
}