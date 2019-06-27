const stringify= function(obj, prefix){
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
}

const http = {
  baseUrl: '',
  request: function (url, data, Methods='GET'){
    return new Promise((resolve,reject)=>{
      /^http[s]?:\/\//.test(url)||(url = this.baseUrl+url)
      data = stringify(data);
      Methods == 'GET'&&(url += (url.indexOf('?') === -1 ? '?' : '&') + data)
      let xmlhttp = new XMLHttpRequest()
      xmlhttp.open(Methods,url,true)
      xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded")
      xmlhttp.send(data)
      xmlhttp.onreadystatechange = ()=>{
        if(xmlhttp.status === 200){
          let responseData = xmlhttp.response || xmlhttp.responseText
          responseData && resolve(JSON.parse(responseData))
        }else{
          reject(xmlhttp)
        }
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