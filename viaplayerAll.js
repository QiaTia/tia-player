var cssNode = document.createElement('link');
cssNode.rel = 'stylesheet';
cssNode.type = 'text/css';
cssNode.href = '//tia.nos-eastchina1.126.net/public/viaplayer/viaplayer.css';
document.head.appendChild(cssNode);
var viaplayer = {
	playlist: [],
	lyrics: [],
	status: false,
	order: true,
	via: 0,
	audio: '',
	//title: document.querySelector(".via-info"),
	viaLrc: '',
	viaBarControl: '',
	viaNowtime: '',
	viaAllTime: '',
	//viaPic: document.querySelector(".via-pic"),
	lrcview: [],
	menulist: false,
	playStatus:false,
	timeStatus:true,
	api: 'https://qiatia.cn/tools/viaplayer/api/',
	i:1,
	icon:{
		play: `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 31"><path d="M15.552 15.168q0.448 0.32 0.448 0.832 0 0.448-0.448 0.768l-13.696 8.512q-0.768 0.512-1.312 0.192t-0.544-1.28v-16.448q0-0.96 0.544-1.28t1.312 0.192z"></path></svg>`
		,pause: `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 17 32"><path d="M14.080 4.8q2.88 0 2.88 2.048v18.24q0 2.112-2.88 2.112t-2.88-2.112v-18.24q0-2.048 2.88-2.048zM2.88 4.8q2.88 0 2.88 2.048v18.24q0 2.112-2.88 2.112t-2.88-2.112v-18.24q0-2.048 2.88-2.048z"></path></svg>`
		,fast_rewind: `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M25.468 6.947c-0.326-0.172-0.724-0.151-1.030 0.057l-6.438 4.38v-3.553c0-0.371-0.205-0.71-0.532-0.884-0.326-0.172-0.724-0.151-1.030 0.057l-12 8.164c-0.274 0.186-0.438 0.496-0.438 0.827s0.164 0.641 0.438 0.827l12 8.168c0.169 0.115 0.365 0.174 0.562 0.174 0.16 0 0.321-0.038 0.468-0.116 0.327-0.173 0.532-0.514 0.532-0.884v-3.556l6.438 4.382c0.169 0.115 0.365 0.174 0.562 0.174 0.16 0 0.321-0.038 0.468-0.116 0.327-0.173 0.532-0.514 0.532-0.884v-16.333c0-0.371-0.205-0.71-0.532-0.884z"></path></svg>`
		,fast_forward: `<svg style="transform:rotate(180deg)" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M25.468 6.947c-0.326-0.172-0.724-0.151-1.030 0.057l-6.438 4.38v-3.553c0-0.371-0.205-0.71-0.532-0.884-0.326-0.172-0.724-0.151-1.030 0.057l-12 8.164c-0.274 0.186-0.438 0.496-0.438 0.827s0.164 0.641 0.438 0.827l12 8.168c0.169 0.115 0.365 0.174 0.562 0.174 0.16 0 0.321-0.038 0.468-0.116 0.327-0.173 0.532-0.514 0.532-0.884v-3.556l6.438 4.382c0.169 0.115 0.365 0.174 0.562 0.174 0.16 0 0.321-0.038 0.468-0.116 0.327-0.173 0.532-0.514 0.532-0.884v-16.333c0-0.371-0.205-0.71-0.532-0.884z"></path></svg>`
		,menu: `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 22 32"><path d="M20.8 14.4q0.704 0 1.152 0.48t0.448 1.12-0.48 1.12-1.12 0.48h-19.2q-0.64 0-1.12-0.48t-0.48-1.12 0.448-1.12 1.152-0.48h19.2zM1.6 11.2q-0.64 0-1.12-0.48t-0.48-1.12 0.448-1.12 1.152-0.48h19.2q0.704 0 1.152 0.48t0.448 1.12-0.48 1.12-1.12 0.48h-19.2zM20.8 20.8q0.704 0 1.152 0.48t0.448 1.12-0.48 1.12-1.12 0.48h-19.2q-0.64 0-1.12-0.48t-0.48-1.12 0.448-1.12 1.152-0.48h19.2z"></path></svg>`
		,volume: `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 28 32"><path d="M13.728 6.272v19.456q0 0.448-0.352 0.8t-0.8 0.32-0.8-0.32l-5.952-5.952h-4.672q-0.48 0-0.8-0.352t-0.352-0.8v-6.848q0-0.48 0.352-0.8t0.8-0.352h4.672l5.952-5.952q0.32-0.32 0.8-0.32t0.8 0.32 0.352 0.8zM20.576 16q0 1.344-0.768 2.528t-2.016 1.664q-0.16 0.096-0.448 0.096-0.448 0-0.8-0.32t-0.32-0.832q0-0.384 0.192-0.64t0.544-0.448 0.608-0.384 0.512-0.64 0.192-1.024-0.192-1.024-0.512-0.64-0.608-0.384-0.544-0.448-0.192-0.64q0-0.48 0.32-0.832t0.8-0.32q0.288 0 0.448 0.096 1.248 0.48 2.016 1.664t0.768 2.528zM25.152 16q0 2.72-1.536 5.056t-4 3.36q-0.256 0.096-0.448 0.096-0.48 0-0.832-0.352t-0.32-0.8q0-0.704 0.672-1.056 1.024-0.512 1.376-0.8 1.312-0.96 2.048-2.4t0.736-3.104-0.736-3.104-2.048-2.4q-0.352-0.288-1.376-0.8-0.672-0.352-0.672-1.056 0-0.448 0.32-0.8t0.8-0.352q0.224 0 0.48 0.096 2.496 1.056 4 3.36t1.536 5.056zM29.728 16q0 4.096-2.272 7.552t-6.048 5.056q-0.224 0.096-0.448 0.096-0.48 0-0.832-0.352t-0.32-0.8q0-0.64 0.704-1.056 0.128-0.064 0.384-0.192t0.416-0.192q0.8-0.448 1.44-0.896 2.208-1.632 3.456-4.064t1.216-5.152-1.216-5.152-3.456-4.064q-0.64-0.448-1.44-0.896-0.128-0.096-0.416-0.192t-0.384-0.192q-0.704-0.416-0.704-1.056 0-0.448 0.32-0.8t0.832-0.352q0.224 0 0.448 0.096 3.776 1.632 6.048 5.056t2.272 7.552z"></path></svg>`
		,panel: `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M26.667 5.333h-21.333c-0 0-0.001 0-0.001 0-1.472 0-2.666 1.194-2.666 2.666 0 0 0 0.001 0 0.001v-0 16c0 0 0 0.001 0 0.001 0 1.472 1.194 2.666 2.666 2.666 0 0 0.001 0 0.001 0h21.333c0 0 0.001 0 0.001 0 1.472 0 2.666-1.194 2.666-2.666 0-0 0-0.001 0-0.001v0-16c0-0 0-0.001 0-0.001 0-1.472-1.194-2.666-2.666-2.666-0 0-0.001 0-0.001 0h0zM5.333 16h5.333v2.667h-5.333v-2.667zM18.667 24h-13.333v-2.667h13.333v2.667zM26.667 24h-5.333v-2.667h5.333v2.667zM26.667 18.667h-13.333v-2.667h13.333v2.667z"></path></svg>`
		,repeat: `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 29 32"><path d="M9.333 9.333h13.333v4l5.333-5.333-5.333-5.333v4h-16v8h2.667v-5.333zM22.667 22.667h-13.333v-4l-5.333 5.333 5.333 5.333v-4h16v-8h-2.667v5.333z"></path></svg>`
		,repeat_one: `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 29 32"><path d="M2.667 7.027l1.707-1.693 22.293 22.293-1.693 1.707-4-4h-11.64v4l-5.333-5.333 5.333-5.333v4h8.973l-8.973-8.973v0.973h-2.667v-3.64l-4-4zM22.667 17.333h2.667v5.573l-2.667-2.667v-2.907zM22.667 6.667v-4l5.333 5.333-5.333 5.333v-4h-10.907l-2.667-2.667h13.573z"></path></svg>`
		,random: `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M22.667 4l7 6-7 6 7 6-7 6v-4h-3.653l-3.76-3.76 2.827-2.827 2.587 2.587h2v-8h-2l-12 12h-6v-4h4.347l12-12h3.653v-4zM2.667 8h6l3.76 3.76-2.827 2.827-2.587-2.587h-4.347v-4z"></path></svg>`
		,left: `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M22 16l-10.105-10.6-1.895 1.987 8.211 8.613-8.211 8.612 1.895 1.988 8.211-8.613z"></path></svg>`
		,right: `<svg style="transform:rotate(180deg)" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32"><path d="M22 16l-10.105-10.6-1.895 1.987 8.211 8.613-8.211 8.612 1.895 1.988 8.211-8.613z"></path></svg>`
	},
	play: function(i) {
		try {
			this.audio.play()
		} catch (e) {
			this.nextMusic();
			console, log(e.name + ": " + e.message)
		}
		this.status = true;
		if ($('.music-control').hasClass('icon-play')) {
			$('.music-control').html(this.icon.pause);
			$('.music-control').removeClass('icon-play');
			$('.music-control').addClass('icon-pause')
		} else return false
	},
	pause: function() {
		if (this.status) {
			this.audio.pause();
			this.status = false
		}
		if (!$('.music-control').hasClass('icon-play')) {
			$('.music-control').html(this.icon.play);
			$('.music-control').removeClass('icon-pause');
			$('.music-control').addClass('icon-play')
		} else return false
	},
	toogle: function() {
		if (!this.status) {
			this.play();
			this.status = true
		} else {
			this.pause();
			this.status = false
		}
		return this.status
	},
	panelSwitch: function() {
		if ($('.panel-switch').hasClass('on')) {
			$('.via-panel').css("width", "0rem");
			$('.panel-switch').removeClass("on");
			$('.via-list').css("height", "0rem");
			$('.via-list').removeClass("on")
		} else {
			$('.via-panel').css("width", "15.1rem");
			$('.panel-switch').addClass("on")
		}
	},
	menuSwitch: function() {
		if ($('.via-list').hasClass('on')) {
			$('.via-list').css("height", "0rem");
			$('.via-list').removeClass("on")
		} else {
			$('.via-list').css("height", "15rem");
			$('.via-list').addClass("on")
		}
	},
	lrcSwitch: function() {
		if ($('.via-lrc').hasClass('off')) {
			$('.via-lrc').css("height", "2.5rem");
			$('.via-lrc').removeClass("off")
		} else {
			$('.via-lrc').css("height", "0rem");
			$('.via-lrc').addClass("off")
		}
	},
	orderSwitch: function() {
		if ($('.order-switch').hasClass('order1')) {
			this.audio.loop = false;
			$('.order-switch').html(this.icon.random);
			$('.order-switch').addClass("order2");
			$('.order-switch').removeClass("order1");
			this.toast('列表随机循环播放');
			this.order = false
		} else if ($('.order-switch').hasClass('order2')) {
			this.audio.loop = true;
			$('.order-switch').html(this.icon.repeat_one);
			$('.order-switch').removeClass("order2");
			this.toast('单曲循环播放')
		} else {
			this.audio.loop = false;
			$('.order-switch').html(this.icon.repeat);
			$('.order-switch').addClass("order1");
			this.toast('列表顺序循环播放');
			this.order = true
		}
	},
	getpalylist: function(i) {
		var musicList, trackCount, temp;
		$.post(this.api, {
			playlist: i
		}, function(data, status) {
			trackCount = data.playlist.trackCount, musicList = data.playlist.tracks, temp = '', viaplayer.playlist = musicList;
			$(".via-pic" ).css( "background" ,"url("+ data.playlist.coverImgUrl +")");//viaplayer.viaPic.style.background = 'url(' + data.playlist.coverImgUrl + ')';
			for (var i = 0; i < trackCount; i++) {
				temp += '<li onclick="viaplayer.listplay(' + i + ');">' + (i + 1) + '. ' + musicList[i].name + '<span class="list-right">' + musicList[i].ar[0].name + '</span></li>'
			}
			$('.via-list>ol').html(temp);
			viaplayer.listView(viaplayer.via);
			viaplayer.palylist = musicList
		});
		return temp
	},
	geturl: function(i) {
		$.post(this.api, {
			url: i
		}, function(data) {
			data = data.data;
			viaplayer.audio.src = data[0].url
			//viaplayer.lyricsView(this.lyrics)
		})
	},
	parseLyric: function(lrc) {
		var lyrics = lrc.split("\n"),
			result = [];
		for (var i = 0; i < lyrics.length; i++) {
			var text = decodeURIComponent(lyrics[i]);
			var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
			var timeRegExpArr = text.match(timeReg);
			if (!timeRegExpArr) continue;
			var clause = text.replace(timeReg, '');
			for (var k = 0, h = timeRegExpArr.length; k < h; k++) {
				var t = timeRegExpArr[k];
				var min = Number(String(t.match(/\[\d*/i)).slice(1)),
					sec = Number(String(t.match(/\:\d*/i)).slice(1)),
					hs = Number(String(t.match(/\.\d*/i)).slice(1));
				var time = min * 60 + sec + '.' + hs;
				result.push([time, clause])
			}
		}
		viaplayer.lyrics = result;
		return result
	},
	getlyric: function(i) {
		$.post(this.api, {
			lyric: i
		}, function(data) {
			var lrc =data.lrc.lyric;
			viaplayer.lyricsView(viaplayer.parseLyric(lrc));
			if(viaplayer.playStatus) {viaplayer.play()}else{viaplayer.playStatus = true}
		})
	},
	listView:function(i){
		this.geturl(this.playlist[i].id);
		this.getlyric(this.playlist[i].id);
		$(".via-pic" ).css( "background" ,"url("+this.playlist[i].al.picUrl+")");//this.viaPic.style.background = 'url(' + this.playlist[i].al.picUrl + ')';
		$(".via-info").html('<p>' + this.playlist[i].name + '<span class="via-author"> - ' + this.playlist[i].ar[0].name + '</span></p>');
	},
	listplay: function(i) {
		this.geturl(this.playlist[i].id);
		this.getlyric(this.playlist[i].id);
		$(".via-pic" ).css( "background" ,"url("+this.playlist[i].al.picUrl+")");//this.viaPic.style.background = 'url(' + this.playlist[i].al.picUrl + ')';
		$(".via-info").html('<p>' + this.playlist[i].name + '<span class="via-author"> - ' + this.playlist[i].ar[0].name + '</span></p>');
		this.via = i
	},
	lyricsView: function(lyrics) {
		var j = lyrics.length - 1,
			temp = '<header></header>';
		for (var i = 0; i <= j; i++) {
			temp += '<p>' + lyrics[i][1] + '</p>'
		}
		this.viaLrc.innerHTML = temp;
		return temp
	},
	nextMusic: function() {
		if (this.via >= viaplayer.palylist.length - 1) {
			this.toast('已经最后一首了！');
			return false
		}
		this.via++;
		this.listplay(this.via);
		return true
	},
	prevMusic: function() {
		if (this.via <= 0) {
			this.toast('已经第一首了！');
			return false
		}
		this.via--;
		this.listplay(this.via);
		return true
	},
	toast: function(msg) {
		var id = 'via' + Math.round(Math.random() * 9999),
			temp = ` <p style="text-align:center">` + msg + `</p>`
			,div = document.createElement("div");
		div.setAttribute("id", id);
		div.setAttribute('class','via-toast');
		document.body.appendChild(div);
		document.querySelector('#'+id).innerHTML += (temp);
		temp = setTimeout(function() {
			document.querySelector('#' + id).parentNode.removeChild(document.querySelector('#' + id));
			window.clearTimeout(temp)
		}, 5000)
	},
	player: function(list, api) {
		var div = document.createElement("div");
		div.setAttribute("id", "viaplayer");
		document.body.appendChild(div);
		document.querySelector('#viaplayer').innerHTML +=`
					<div class="via-list">
						<ol></ol>
					</div>
					<div class="via-body">
						<div class="via-pic" onclick='viaplayer.toogle()'>
							<div class="via-icon music-control icon-play">`+viaplayer.icon.play+`</div>
						</div>
						<div class="via-panel">
							<div class="via-info"><p>初始化中<span class="via-author"> - 请稍等</span></p></div>
							<div class="via-bar-warp">
							  <div class="via-bar" onclick="viaplayer.DisplayX(event,'.via-bar')"><span class='bar-control'></span></div>
							  <div class='via-time-info'><span class='via-now-time'>00:00</span>&nbsp;/&nbsp;<span class='via-all-time'>00:00</span></div>
							</div>
							<div class="via-control">
								<span class="via-icon fast_rewind" onclick='viaplayer.prevMusic()'>`+viaplayer.icon.fast_rewind+`</span>
								<span class="via-icon music-control icon-play" onclick='viaplayer.toogle()'>`+viaplayer.icon.play+`</span>
								<span class="via-icon fast_forward" onclick="viaplayer.nextMusic()">`+viaplayer.icon.fast_rewind+`</span>
								<span class="via-icon volume">`+viaplayer.icon.volume+`</span>
								<span class="via-icon order-switch order1" onclick='viaplayer.orderSwitch()'>`+viaplayer.icon.repeat+`</span>
								<span class="via-icon menu-switch" onclick='viaplayer.menuSwitch()'>`+viaplayer.icon.menu+`</span>
								<span class="via-icon lrc-switch" onclick="viaplayer.lrcSwitch()">`+viaplayer.icon.panel+`</span>
							</div>
						</div>
						<div class="panel-switch" onclick="viaplayer.panelSwitch()">
							`+viaplayer.icon.left+`
						</div>
					</div>
					<div class="via-lrc">
						<div class="lrc-content">
						</div>
					</div>
					<audio id="via-audio" src=""></audio>`;
		this.audio = document.getElementById("via-audio"),
		this.title = document.querySelector(".via-info"),
		this.viaLrc = document.querySelector(".lrc-content");
		this.viaBarControl= document.querySelector(".bar-control"),
		this.viaNowtime= document.querySelector(".via-now-time"),
		this.viaAllTime= document.querySelector(".via-all-time");
		//this.viaPic = document.querySelector(".via-pic");
		if (api != undefined) this.api = api;
		this.audio.addEventListener('play', function() {
			if (viaplayer.menulist) viaplayer.menulist.className = '';
			viaplayer.menulist = document.querySelectorAll('.via-list>ol>li')[viaplayer.via];
			viaplayer.menulist.className = 'select';
			viaplayer.lrcview = document.querySelectorAll('.lrc-content>p');
			viaplayer.timeStatus = true;
			viaplayer.i = 0
		});
		this.audio.loop = false;
		this.audio.addEventListener('ended', function() {
			if (viaplayer.order) {
				viaplayer.via++;
				viaplayer.listplay(viaplayer.via)
			} else {
				viaplayer.via = Math.round(Math.random() * (viaplayer.lyrics.length - 1));
				viaplayer.listplay(viaplayer.via)
			}
		}, false);
		this.audio.addEventListener("timeupdate", function(e) {
			if(parseInt(this.currentTime)-1 > viaplayer.i){
				viaplayer.viaBarControl.style.width =  (this.currentTime.toFixed(0)/viaplayer.audio.duration.toFixed(0))*100+'%';
				viaplayer.viaNowtime.innerHTML = parseInt(this.currentTime/60)+':'+ (this.currentTime.toFixed(0)%60);
				viaplayer.i++;
				if(viaplayer.timeStatus) {
					viaplayer.viaAllTime.innerHTML = parseInt(parseInt(viaplayer.audio.duration.toFixed(0))/60) +":"+parseInt(viaplayer.audio.duration.toFixed(0))%60;
					viaplayer.timeStatus = !viaplayer.timeStatus
				}
			}
			for (var i = 1, l = viaplayer.lyrics.length - 1; i < l; i++) {
				if (this.currentTime > viaplayer.lyrics[i][0]) {
					try {
						viaplayer.viaLrc.style.webkitTransform = "translateY(-" + (1.2 * i) + "rem)";
						viaplayer.lrcview[i].className = 'lrc-cursor';
						viaplayer.lrcview[i - 1].className = ''
					} catch (e) {
						console.log(e.name + ": " + e.message)
					}
				}
			}
		});
		this.getpalylist(list)
	},
	audioCurrentTime:function(t){
		//this.audio.currentTime
		if('fastSeek' in this.audio){
			viaplayer.audio.fastSeek(t)
		}else{
			viaplayer.audio.currentTime = t
		}
		viaplayer.i=parseInt(this.audio.currentTime)-1
	},
	DisplayX:function(event,obj){
	  let left
	    ,oDiv=document.querySelector(obj)
	    ,parObj=oDiv;
	  left=oDiv.offsetLeft;
	  while(parObj=parObj.offsetParent){
	    left+=parObj.offsetLeft
	  }
	  console.log(document.documentElement.scrollLeft);
	  this.audioCurrentTime(viaplayer.audio.duration*((event.clientX-left+document.documentElement.scrollLeft)/oDiv.offsetWidth))
	} 
}