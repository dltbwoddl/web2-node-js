var http = require('http');//To use the HTTP server and client one must require('http').
var fs = require('fs');//The fs module provides an API for interacting with the file system in a manner closely modeled around standard POSIX functions.
var url = require('url');//The url module provides utilities for URL resolution and parsing.

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var title =queryData.id
    if (pathname=='/'){      
    fs.readFile('data/'+`${queryData.id}`+'.txt','utf8',function(err,describesion){
      var template =`
    <!doctype html>
<html>
<head>
  <title>WEB1 - ${title}</title>
  <meta charset="utf-8">
</head>
<body>
  <h1><a href="/">WEB</a></h1>
  <ul>
    <li><a href="/?id=HTML">HTML</a></li>
    <li><a href="/?id=CSS">CSS</a></li>
    <li><a href="/?id=JAVASCRIPT">JavaScript</a></li>
  </ul>
  <h2>${title}</h2>
  <p>
  ${describesion}
  </p>
</body>
</html>
`
    response.writeHead(200);
    response.end(template);
  });}
  else{
    response.writeHead(404);
    response.end('not page found');
  }
});
app.listen(3000);