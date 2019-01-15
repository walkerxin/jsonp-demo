var http = require('http')
var fs = require('fs')
var url = require('url')

var port = process.env.PORT || 8888

if (!port) {
	// 当前路径下只有server.js文件 node server.js或node server都会执行这个文件
	console.log('请指定端口号好不啦？\nnode server 8888 这样不会吗？')
	process.exit(1)
}

var server = http.createServer(function (request, response) {
	var parsedUrl = url.parse(request.url, true)
	var pathWithQuery = request.url
	var queryString = ''
	if (pathWithQuery.indexOf('?') >= 0) { queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
	var path = parsedUrl.pathname
	var query = parsedUrl.query
	var method = request.method

	/******** 从这里开始看，上面不要看 ************/


	console.log('Server说：得到一个HTTP访问请求 请求路径为\n' + pathWithQuery)
	// console.log('方方说：查询字符串为\n' + queryString)
	// console.log('方方说：不含查询字符串的路径为\n' + path)


	if (path === '/') {
		response.setHeader('Content-Type', 'text/html; charset=utf-8')
		var content = fs.readFileSync('./index.html', 'utf8')
		var data = fs.readFileSync('./payDB', 'utf8')
		response.write(content.replace('&&&amt&&&', data))
		response.end()
	} else if (path === '/style.css') {
		response.setHeader('Content-Type', 'text/css; charset=utf-8')
		response.write('body{background:#000;} p{text-align:center;color:red;font-size:36}')
		response.end()
	} else if (path === '/main.js') {
		response.setHeader('Content-Type', 'text/javascript; charset=utf-8')
		response.write('alert("I\'m a js file")')
		response.end()
	} else if (path === '/pay') {
		
		let amt = fs.readFileSync('./payDB')
		if(Math.random() * 100 > 50) {
			fs.writeFileSync('./payDB', amt - 1)			
			response.setHeader('Content-Type', 'text/javascript; charset=utf-8')
			response.write('amt.innerText = ' + (amt - 1))
		}else {
			response.write('alert(error)')			
		}

		response.end()
		
	} else {
		response.statusCode = 404
		response.setHeader('Content-Type', 'text/plain; charset=utf-8')
		response.write('404: 此路径没找到你要的资源')
		response.end()
	}








	/******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)
