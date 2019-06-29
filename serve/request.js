const request = require('request')
const Qs = require('querystring')

const headers = { 
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.157 Safari/537.36',
  'Content-Type': 'application/x-www-form-urlencoded',
  'Cookie': 'os=pc; osver=Microsoft-Windows-10-Professional-build-10586-64bit; appver=2.0.3.131777; channel=netease; __remember_me=true',
  'Referer': 'https://music.163.com/'
}

const answer = { status: 500, body: {}, cookie: [] }

function createRequest(url, data){
  return new Promise((resolve,reject)=>{
    let options ={
      method: 'POST',
      url: url,
      headers: headers,
      body: Qs.stringify(data)
    }
    // console.log(options)
    request(options, function(err, res, body){
      if(err){
        answer.status = 502
        answer.body = { code: 502, msg: err.stack }
        reject(answer)
      }
      else{
        answer.body = body
        answer.status = res.statusCode
        resolve(answer)
      }
    })
  })
}
module.exports = createRequest