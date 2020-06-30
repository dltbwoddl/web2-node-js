//상위 디렉토리에 마음대로 접근할 수 없도록 하기.
//by     var filteredId = path.parse(queryDataid).base; 
//어떤 명령 집어넣어도 파일이름만 들어가도록한다.
//출력 보안 by sanitizeHtml
//npm을 통해서 다른 이가 만든 모듈 사용해서 앱 빠르게 만드는 법.
var http = require('http');//To use the HTTP server and client one must require('http').
var fs = require('fs');//The fs module provides an API for interacting with the file system in a manner closely modeled around standard POSIX functions.
var url = require('url');//The url module provides utilities for URL resolution and parsing.
var qs = require('querystring');
var template=require('./lib/template.js');
var get=require('./lib/getpage.js');
var path =require('path')
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function (request, response) {
  console.log(1);
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  var queryDataid = queryData.id
  console.log(pathname);
  if (pathname == '/') {
    console.log(pathname);
    get.page(queryData.id,response);
  }
  else if(pathname === '/create'){
    var title = 'create';
    fs.readdir('./data', function (error, filelist) {
      var list = template.list(filelist);
      var html = template.html(title,list,
        `
        <form action="http://localhost:4000/process_create"
        method ="post">
        <p><input type='text' name='title' placeholder='title'>
        </p>
        <p><textarea name="description" placeholder="description">
        </textarea>
        </p>
        <p>
        <input type='submit'>
        </p></form>`,'')
      response.writeHead(200);
      response.end(html);
      ;

    });
  }
  else if (pathname === '/process_create') {
      //post방식의 데이터 받기.
      var body = '';
      request.on('data', function (data) {
          body = body + data;
      });
      request.on('end', function () {
          var post = qs.parse(body);
          var title = post.title;
          var description = post.description;
          fs.writeFile(`data/${title}`, description, 'utf-8'
              , function (err) {

                  response.writeHead(302, {location:`/?id=${title}`});
                  response.end();
              })
      });

  }else if(pathname==='/update'){
    var filteredId = path.parse(queryDataid).base;
    fs.readFile('data/' + `${filteredId}` , 'utf8', function (err, describesion) {
        var title = queryData.id
        fs.readdir('./data', function (error, filelist) {
        var list =template.list(filelist);
        var html = template.html(title,list,`
        <form action="http://localhost:4000/update_process"
        method ="post">
        <input type = 'hidden' name='id' value=${title}>
        <p><input type='text' name='title' placeholder='title' value='${title}'>
        </p>
        <p><textarea name="description" placeholder="description">
        </textarea>
        </p>
        <p>
        <input type='submit'>
        </p></form>`,`<a href='/create'>creat</a> <a href = '/update?id=${title}'>update</a>`)
        response.writeHead(200);
        response.end(html);})
    })
  }
  else if(pathname==='/update_process'){
    var body = '';
    request.on('data', function (data) {
        body = body + data;
    });
    request.on('end', function () {
        var post = qs.parse(body);
        var id=post.id;
        var title = post.title;
        var description = post.description;
        var filteredId = path.parse(id).base;
        fs.rename(`data/${filteredId}`,`data/${title}`, (err) => {
          console.log('Rename complete!');
          fs.writeFile(`data/${title}`, description, 'utf-8'
            , function (err) {
                response.writeHead(302, {location:`/?id=${title}`});
                response.end();
            })
        });
        
    });

  }
  else if (pathname=="/delete_process"){
    var body = '';
    request.on('data', function (data) {
        body = body + data;
    });
    request.on('end', function () {
        var post = qs.parse(body);
        var id=post.id;
        var filteredId = path.parse(id).base;
        fs.unlink(`data/${filteredId}`, (err) => {
          if (err) throw err;
          response.writeHead(302, {location:`/`});
                response.end();
        });     
    });
  }
  else {
    response.writeHead(404);
    response.end('not page found');
  }
});
app.listen(4000);