var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Gamestate Server Running\n');
}).listen(8124, "127.0.0.1");
console.log('Gamestate server running at http://127.0.0.1:8124/');