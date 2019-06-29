// 引入相应模块
const http = require('http'),
  url = require('url'),
	path = require('path'),
  fs = require('fs');

const  { playlist, lyric } = require('./serve/index')
	  
const port = process.argv[2] || 8080;

const types = {
	'css': 'text/css',
	'html': 'text/html',
	'js': 'application/javascript'
},

site = 'http://localhost:' + port;

http.createServer(function (request, response) {
  let uri = url.parse(request.url).pathname
  if(/^\/playlist\//.test(uri)){
    playlist(uri.replace(/^\/playlist\//,'')).then(res=>{
      console.log("playlist:", res.status)
      response.writeHead(res.status, {'Content-Type': 'application/json; charset=UTF-8'})
      response.write(res.body)
      // response.getWriter().print(JSON.toJSONString(res));
      response.end()
    }).catch(e=>{
      console.warn('Error:',e)
    })
    return false
  }else if(/^\/lyric\//.test(uri)){
    lyric(uri.replace(/^\/lyric\//,'')).then(res=>{
      console.log("lyric:", res.status)
      response.writeHead(res.status, {'Content-Type': 'application/json; charset=UTF-8'});
      response.write(res.body);
      response.end();
    }).catch(e=>{
      console.warn('Error:',e)
    })
    return false
  }else{
    let filename = path.join(__dirname, uri)
    fs.exists(filename, function (exists) {
      if (!exists) {
        response.writeHead(404, {'Content-Type': 'text/plain', 'X-my-param':'zcyue'});
        response.write('404 Not Found\n');
        response.end();
        return;
      }
  
      if(!fs.lstatSync(filename).isDirectory()) {
          var type = filename.split('.');
          type = type[type.length - 1];
          response.writeHead(200, { 'Content-Type': types[type] + '; charset=utf-8' });
          fs.createReadStream(filename).pipe(response);
      } else {
          response.writeHead(301, {'Location': site + '/index.html' });
          response.end();
      }
    });
  }
}).listen(parseInt(port, 10));

console.log('server running at \n => ' + site + '/\n CTRL + C to shutdown');