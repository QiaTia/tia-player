String.prototype.trim = function(){
  return this.replace(/^\s*/, '').replace(/\s*$/, '');
}

const http = {
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

modules.exports = http