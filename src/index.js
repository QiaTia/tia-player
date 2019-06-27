/*
 * @Description: tia-player
 * @Author: QiaTia
 * @Date: 2019-06-25 14:44:34
 * @LastEditors: QiaTia
 * @GitHub: https://github.com/QiaTia/
 * @LastEditTime: 2019-06-27 22:53:06
 */
// import Toast from './toast'
String.prototype.trim = function(){
  return this.replace(/^\s*/, '').replace(/\s*$/, '');
}
String.prototype.pareTime = function(){
	let t = this.split(':')
	return t.map(item=>(item<10?'0'+item:item)).join(':')
}
/**
 * @description: $http
 * @param {type} 
 * @return: 
 */
let $http = {
  baseUrl: '',
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
  request: function (url, data, Methods='GET'){
    if(!url) return false
    return new Promise((resolve,reject)=>{
      /^http[s]?:\/\//.test(url)||(url = this.baseUrl+url)
      data = this.stringify(data);
      Methods == 'GET'&&(url += (url.indexOf('?') === -1 ? '?' : '&') + data)
      let xmlhttp = new XMLHttpRequest()
      xmlhttp.open(Methods,url,true)
      xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded")
      xmlhttp.send(data)
      xmlhttp.onreadystatechange = ()=>{
        if (!xmlhttp || xmlhttp.readyState !== 4) {
          return;
        }
        if(xmlhttp.readyState === 4){
          let response = {
            headers: 'getAllResponseHeaders' in xmlhttp ? this.parseHeaders(xmlhttp.getAllResponseHeaders()) : null,
            data: xmlhttp.response || xmlhttp.responseText,
            status: xmlhttp.status,
            requestURL: xmlhttp.responseURL,
            request: xmlhttp
          }
          if(xmlhttp.status !== 200){
            /json/.test(response.headers['content-type'])?reject(JSON.parse(response.data)):reject(response.data)
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
  get: function(url, data){
    return this.request(url,data)
  },
  post: function(url, data){
    return this.request(url,data,'POST')
  }
}

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

function tia(id = 729837165, url = 'http://localhost:3000/'){
  $http.baseUrl = url
  $http.get('playlist/detail',{id: id}).then((res)=>{
    // console.log(res)
    let detail= this.detail = this.parse(res)
    this.init(detail)
  })
  // this.init(id) 
}
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
  let listInner = ''
  for (let i in list) {
    listInner += '<li onclick="$Tia.listplay(' + i + ');">'+list[i].name + '<span class="list-right">' + list[i].artist + '</span></li>'
  }
  return {
    list,
    listInner,
    name: playlist.name,
    cover: playlist.coverImgUrl,
  }
}
tia.prototype.init = function(detail){
  // 网页渲控件
  const template = `
    <div class="tia-list"><ol>${detail.listInner}</ol></div>
    <div class="tia-body">
      <div class="tia-pic" id="tia-toggle"><div class="tia-icon music-control icon-play">${icon.play}</div></div>
      <div class="tia-panel">
        <div class="tia-info"><p>${detail.list[0].name}<span class="tia-author"> - ${detail.list[0].artist}</span></p></div>
        <div class="tia-bar-warp"><div class="tia-bar" onclick="$Tia.DisplayX(event,'.tia-bar')"><span class='bar-control'></span></div>
        <div class='tia-time-info'><span class='tia-now-time'>00:00</span>&nbsp;/&nbsp;<span class='tia-all-time'>00:00</span></div></div>
        <div class="tia-control">
          <span class="tia-icon fast_rewind" onclick='$Tia.prevMusic()'>${icon.fast_rewind}</span>
          <span class="tia-icon music-control icon-play" onclick='$Tia.toggle()'>${icon.play}</span>
          <span class="tia-icon fast_forward" onclick="$Tia.nextMusic()">'${icon.fast_rewind}</span>
          <span class="tia-icon volume">${icon.volume}<div class='volume-control' onclick="$Tia.volumeX(event,'.volume-control')"><span></span></div></span>
          <span class="tia-icon order-switch order1" onclick='$Tia.orderSwitch()'>${icon.repeat}</span>
          <span class="tia-icon menu-switch" onclick='$Tia.menuSwitch()'>${icon.menu}</span>
          <span class="tia-icon lrc-switch" onclick="$Tia.lrcSwitch()">${icon.panel}</span>
        </div>
      </div>
      <div class="panel-switch" onclick="$Tia.panelSwitch()">${icon.left}</div>
    </div>
    <div class="tia-lrc"><div class="lrc-content"></div></div>
    <audio id="tia-audio" src="${detail.list[0].src}"></audio>
  `
  var div = document.createElement("div");
  div.setAttribute("id", "Tia");
  div.innerHTML = template;
  document.body.appendChild(div);
  // 初始化自身变量, 开始监听
  this.playStatus = false
  this.id = 0
  // 音频监听
  this.audio = document.getElementById("tia-audio")
  this.audio.addEventListener('ended', ()=>( this.next() ), false);
  // 播放歌词监听
  this.audio.addEventListener("timeupdate", ({target})=>{
    let currentTime = target.currentTime
    if(parseInt(currentTime)-1 > this.i){
      // this.$barControl.style.width =  (currentTime.toFixed(0)/target.duration.toFixed(0))*100+'%';
      // this.$nowtime.innerHTML = parseInt(currentTime/60)+':'+ (currentTime.toFixed(0)%60);
      this.i++;
    }
    for (var i = 1, l = this.lyrics.length - 1; i < l; i++) {
      if (currentTime > this.lyrics[i][0]) {
        try {
          this.viaLrc.style.webkitTransform = "translateY(-" + (1.2 * i) + "em)";
          this.viaLrc.style.msTransform = "translateY(-" + (1.2 * i) + "em)";
          this.lrcview[i].className = 'lrc-cursor';
          this.lrcview[i - 1].className = ''
        } catch (e) {
          console.log(e)
        }
      }
    }
  });
  // 监听  封面地图。 播放切换监听
  this.$_Pic = document.getElementById('tia-toggle')
  this.$_Pic.style.background='url('+detail.cover+')'
  this.$_Pic.onclick = ()=>(this.toggle())
  
  this.title = document.querySelector(".tia-info"), this.tiaLrc = document.querySelector(".lrc-content");
  this.tiaBarControl = document.querySelector(".bar-control"), this.tiaNowtime = document.querySelector(".tia-now-time"), this.tiaAllTime = document.querySelector(".tia-all-time");
}
tia.prototype.toggle = function(){
  console.log(this.playStatus)

  if(this.playStatus){
    this.pause()
  }else{
    this.play()
  }
}
tia.prototype.pause = function(){
  this.playStatus = false
  return this.audio.pause()
}
tia.prototype.play=function(){
  // console.log(this.audio)
  this.audio.play().then(()=>{
    // do some thing
    this.playStatus = true
    let allTime = this.allTime = this.audio.duration
    this.$_allTime.innerHTML = (~~(allTime/60) +":"+(~~allTime%60)).pareTime()
  }).catch(e=>{
    this.next()
    console.warn(e)
  })
}
tia.prototype.next=function(){
  // 切换歌曲
  let t = this.detail.list[++this.id]
  this.audio.src = t.src
  this.$_Pic.style.background='url('+t.pic+')'
  // 播放歌曲
  this.play()
}

const $Tia = (options)=>{
  return new tia(options)
}