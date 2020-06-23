//함수로 정리하기. 반복되는 부분 찾아서 없애기.
//templatehtml 만들어 html코드 한번만 쓰기.
//list만드는 for문 중복 없애기.
//pathname으로 if else 나누는 부분 getpage로 만들어 보다 가독성 있게 만들기.
var http = require('http');//To use the HTTP server and client one must require('http').
var fs = require('fs');//The fs module provides an API for interacting with the file system in a manner closely modeled around standard POSIX functions.
var url = require('url');//The url module provides utilities for URL resolution and parsing.

function templatehtml(title,list,body){
  console.log(12);
    return(
    `
    <!doctype html>
<html>
<head>
  <title>WEB1 - ${title}</title>
  <meta charset="utf-8">
</head>
<body>
  <h1><a href="/">WEB</a></h1>
  ${list}
  ${body}
</body>
</html>
`)
};

function listtemplate(filelist){
  console.log(10);
    var list = '<ul>';
for (var i = 0; i < filelist.length; i++) {
list = list + (`<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`);
console.log(list);
list=list+'</br>';
}return list;}

function getpage(queryDataid,response){
  if (queryDataid == undefined) {
    var title = 'welcome';
    var describesion = 'welcome';
    fs.readdir('./data', function (error, filelist) {
      var list = listtemplate(filelist);
      var template = templatehtml(title,list,`<h2>${title}</h2><p>${describesion}</p>`)
      response.writeHead(200);
      response.end(template);
      ;

    });
  }
  else {
    fs.readFile('data/' + `${queryDataid}` , 'utf8', function (err, describesion) {
      var title = queryDataid
      fs.readdir('./data', function (error, filelist) {
      var list =listtemplate(filelist);
      var template = templatehtml(title,list,`<h2>${title}</h2><p>${describesion}</p>`)
      response.writeHead(200);
      response.end(template);
    });
});
}
}

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  if (pathname == '/') {
    getpage(queryData.id,response);
  }
  else {
    response.writeHead(404);
    response.end('not page found');
  }
});
app.listen(3000);