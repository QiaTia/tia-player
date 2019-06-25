const stringify = function(obj, prefix){
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

/**
 * @description: ajax
 * @param {type} 
 * @return: 
 */
export default {
  baseUrl: '',
  request: function (url, data, Methods){
    /^http[s]?:\/\//.test(url)||(url = this.baseUrl+url)
    let xmlhttp
		if (window.XMLHttpRequest){
			//  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
			xmlhttp = new XMLHttpRequest()
		}else{
			// IE6, IE5 浏览器执行代码
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP")
		}
    return new Promise((resolve,reject)=>{
      xmlhttp.open(Methods,url,true)
      xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded")
      xmlhttp.send(stringify(data))
      xmlhttp.onreadystatechange=function(){
        if(xmlhttp.readyState==4){
          resolve(xmlhttp.responseText,xmlhttp.status)
        }else{
          reject(xmlhttp)
        }
      }
    })
  },
  get: function(url, data){
    return this.request(url,data,'GET')
  },
  post: function(url, data){
    return this.request(url,data,'POST')
  }
}