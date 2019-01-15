var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
	// 当前路径下只有server.js文件 node server.js或node server都会执行这个文件
	console.log('请指定端口号好不啦？\nnode server 8888 这样不会吗？')
	process.exit(1)
}

var server = http.createServer(function (request, response) {
	var parseUrl = url.parse(request.url, true)
	var path = request.url
	var query = ''
	if (path.indexOf('?') >= 0) { query = path.substring(path.indexOf('?')) }
	var pathNoQuery = parseUrl.pathname
	var queryObject = parseUrl.query
	var method = request.method

	/******** 从这里开始看，上面不要看 ************/


	console.log('Server说：收到一个HTTP访问请求 请求路径为\n' + path)
	// console.log('方方说：得到 HTTP 路径\n' + path)
	// console.log('方方说：查询字符串为\n' + query)
	// console.log('方方说：不含查询字符串的路径为\n' + pathNoQuery)


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
		const { headers, method, url } = request;
		let body = []
		request.on('error', (err) => {
			console.error('你请求错了！', err);
		}).on('data', (chunk) => {
			body.push(chunk);
		}).on('end', () => {
			body = Buffer.concat(body).toString();
			// At this point, we have the headers, method, url and body, and can now
			// do whatever we need to in order to respond to this request.
			let payAmt = (body && body.split('=').length) ? body.split('=')[1] : 1
			let amt = fs.readFileSync('./payDB')			
			fs.writeFileSync('./payDB', amt - payAmt)			
			response.write('success')
			response.end()
		});
				
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
